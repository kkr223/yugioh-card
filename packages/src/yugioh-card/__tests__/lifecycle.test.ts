import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { Rect } from 'leafer-unified';
import skia from 'skia-canvas';
import {
  createYugiohCardDocument,
  YugiohCard,
  type CardLayerExtension,
} from '../index.ts';

const resourcePath = path.resolve('src/assets/yugioh-card');

test('star layout supports alignment, independent styles and model defaults', async () => {
  const card = new YugiohCard({ resourcePath, skia, data: { level: 8, rank: 4, scale: 0.1 } });
  type StarGroup = { visible: boolean; children: Array<{ visible: boolean; x: number; width: number; url: string }> };
  const leaves = card as unknown as { levelLeaf: StarGroup; rankLeaf: StarGroup };
  try {
    await card.whenReady();
    assert.equal(leaves.levelLeaf.children[0].x, 515);
    for (const level of [0, 1, 8, 13]) {
      for (const levelAlign of ['left', 'center', 'right']) {
        card.setData({ level, levelAlign, levelStyle: 'level-grandmaster' });
        await card.whenReady();
        const stars = leaves.levelLeaf.children.filter(star => star.visible);
        assert.equal(stars.length, level);
        if (!level) continue;
        const width = level * 92 - 4;
        const margin = level < 13 ? 147 : 101;
        const left = levelAlign === 'left' ? margin
          : levelAlign === 'center' ? (1394 - width) / 2 : 1394 - margin - width;
        assert.equal(stars[0].x, left);
        assert.equal(stars.at(-1)!.x + 88, left + width);
        assert.match(stars[0].url, /level-grandmaster\.png$/);
      }
    }
    card.setData({ cardType: 'xyz', levelAlign: 'auto', levelStyle: 'auto' });
    await card.whenReady();
    assert.equal(leaves.levelLeaf.visible, false);
    assert.equal(leaves.rankLeaf.visible, true);
    assert.equal(leaves.rankLeaf.children.filter(star => star.visible).length, 4);
    assert.equal(leaves.rankLeaf.children[0].x, 147);
    assert.match(leaves.rankLeaf.children[0].url, /rank\.png$/);
    card.setData({ levelStyle: 'level', levelAlign: 'center' });
    await card.whenReady();
    assert.equal(leaves.rankLeaf.children[0].x, 515);
    assert.match(leaves.rankLeaf.children[0].url, /level\.png$/);
    for (const type of ['monster', 'pendulum']) {
      card.setData({ type, cardType: 'link', pendulumType: 'link-pendulum' });
      await card.whenReady();
      assert.equal(leaves.levelLeaf.visible, false);
      assert.equal(leaves.rankLeaf.visible, false);
    }
    card.setData({ type: 'monster', cardType: 'normal', rare: 'grandmaster', levelStyle: 'auto', levelAlign: 'auto' });
    await card.whenReady();
    assert.match(leaves.levelLeaf.children[0].url, /level-grandmaster\.png$/);
  } finally {
    card.destroy();
  }
});

test('outer border coverage changes edge pixels without covering the foreground center', async () => {
  const foreground = new skia.Canvas(1, 1);
  const context = foreground.getContext('2d');
  context.fillStyle = '#ff0000';
  context.fillRect(0, 0, 1, 1);
  const card = new YugiohCard({ resourcePath, skia, data: {
    scale: 0.2, foregroundImage: await foreground.toDataURL('png'),
    foregroundWidth: 1394, foregroundHeight: 2031, foregroundX: 697, foregroundY: 1015.5,
  } });
  const leaves = card as unknown as Record<string, { zIndex: number; visible: boolean }>;
  async function sample(x: number) {
    const exported = await card.export('png', { density: 1 }) as { data: string };
    const image = await skia.loadImage(exported.data);
    const canvas = new skia.Canvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(Math.floor(x * image.width / 1394), Math.floor(1000 * image.height / 2031), 1, 1).data];
  }
  try {
    for (const rare of ['', 'o', 'grandmaster']) {
      card.setData({ rare, cardBorderCoverForeground: false });
      await card.whenReady();
      assert.deepEqual(await sample(20), [255, 0, 0, 255]);
      card.setData({ cardBorderCoverForeground: true });
      await card.whenReady();
      assert.notDeepEqual(await sample(20), [255, 0, 0, 255]);
      assert.deepEqual(await sample(700), [255, 0, 0, 255]);
      assert.ok(leaves[rare ? 'rareCardBorderLeaf' : 'defaultCardBorderLeaf'].zIndex > leaves.foregroundClipBox.zIndex);
      assert.ok(leaves.rareArtBorderLeaf.zIndex < leaves.foregroundClipBox.zIndex);
      card.setData({ cardBorderCoverForeground: 'auto' });
      await card.whenReady();
      assert.equal((await sample(20))[0] === 255, rare !== 'grandmaster');
    }
  } finally {
    card.destroy();
  }
});

test('coalesces document updates and exports the stable revision', async () => {
  let extensionUpdates = 0;
  let extensionDestroyed = 0;
  const extension: CardLayerExtension = {
    id: 'test-extension',
    slot: 'top',
    update({ group, document }) {
      extensionUpdates += 1;
      group.clear();
      group.add(new Rect({
        width: 10,
        height: 10,
        fill: document.title.text ? '#ffffff' : '#000000',
      }));
    },
    destroy() {
      extensionDestroyed += 1;
    },
  };
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      title: { text: 'first' },
      render: { scale: 0.1 },
    }),
    extensions: [extension],
  });

  card.setData({ name: 'second' });
  card.setData({ name: 'third' });
  await card.whenReady();

  assert.equal(card.getDocument().title.text, 'third');
  assert.ok(card.revision >= 3);
  assert.ok(extensionUpdates >= 1);

  const exported = await card.export('png', { density: 1 }) as { data: string };
  assert.match(exported.data, /^data:image\/png;base64,/);

  await assert.rejects(
    async () => card.registerExtension(extension),
    /Duplicate YugiohCard extension id/,
  );

  assert.equal(await card.unregisterExtension(extension.id), true);
  assert.equal(extensionDestroyed, 1);
  card.destroy();
  card.destroy();
});

test('updateDocument receives a detached readonly document', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    data: { name: 'before', scale: 0.1 },
  });

  await card.updateDocument(document => {
    assert.equal(Object.isFrozen(document), true);
    assert.equal(Object.isFrozen(document.title), true);
    return {
      ...document,
      title: {
        ...document.title,
        text: 'after',
      },
    };
  });

  assert.equal(card.getDocument().title.text, 'after');
  card.destroy();
});

test('resolves base card resources from the categorized image directories', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    data: {
      type: 'monster',
      cardType: 'normal',
      attribute: 'light',
      level: 1,
      icon: 'continuous',
      copyright: 'sc',
      laser: 'laser1',
      scale: 0.1,
    },
  });

  await card.whenReady();
  const internals = card as unknown as {
    cardLeaf: { url?: string };
    attributeLeaf: { url?: string };
    levelLeaf: { children: Array<{ url?: string }> };
    spellTrapLeaf: { children: Array<{ url?: string }> };
    maskLeaf: { url?: string };
    linkArrowLeaf: { children: Array<{ url?: string }> };
    atkDefLinkLeaf: { children: Array<{ url?: string }> };
    copyrightLeaf: { url?: string };
    laserLeaf: { url?: string };
  };

  assert.match(String(internals.cardLeaf.url), /card\/card-normal\.png$/);
  assert.match(String(internals.attributeLeaf.url), /attribute\/attribute-light\.png$/);
  assert.match(String(internals.levelLeaf.children[0].url), /level\/level\.png$/);
  assert.match(String(internals.spellTrapLeaf.children[1].url), /icon\/icon-continuous\.png$/);
  assert.match(String(internals.maskLeaf.url), /art-border\/art-frame-base\.png$/);
  assert.match(String(internals.linkArrowLeaf.children[0].url), /linkmarker\/arrow-up-off\.png$/);
  assert.match(String(internals.atkDefLinkLeaf.children[0].url), /text\/atk-def\.svg$/);
  assert.match(String(internals.copyrightLeaf.url), /copyright\/copyright-sc-black\.svg$/);
  assert.match(String(internals.laserLeaf.url), /fp-mark\/laser1\.png$/);
  card.destroy();
});

test('renders optional out-frame resources from document switches', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      frame: { nameBlock: true },
      effectBox: {
        enabled: false,
        borderStyle: 'colored',
      },
      footer: { mark25th: true },
      render: { scale: 0.1 },
    }),
  });

  await card.whenReady();
  const internals = card as unknown as {
    nameBlockLeaf: { visible?: boolean; x?: number; y?: number };
    effectBoxFillLeaf: { visible?: boolean };
    effectBoxBorderLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      zIndex?: number;
    };
    foregroundLeaf: { zIndex?: number };
    mark25thLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
  };

  assert.equal(internals.nameBlockLeaf.visible, true);
  assert.equal(internals.nameBlockLeaf.x, 76);
  assert.equal(internals.nameBlockLeaf.y, 82);
  assert.equal(internals.effectBoxFillLeaf.visible, false);
  assert.equal(internals.effectBoxBorderLeaf.visible, true);
  assert.match(String(internals.effectBoxBorderLeaf.url), /eblock-border-color\.png$/);
  assert.equal(internals.effectBoxBorderLeaf.x, 77);
  assert.equal(internals.effectBoxBorderLeaf.y, 1501);
  assert.equal(internals.effectBoxBorderLeaf.width, 1239);
  assert.equal(internals.effectBoxBorderLeaf.height, 427);
  assert.ok(
    Number(internals.effectBoxBorderLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex),
  );
  assert.equal(internals.mark25thLeaf.visible, true);
  assert.match(String(internals.mark25thLeaf.url), /mark25th\.png$/);
  assert.equal(internals.mark25thLeaf.x, 503);
  assert.equal(internals.mark25thLeaf.y, 1496);
  assert.equal(internals.mark25thLeaf.width, 388);
  assert.equal(internals.mark25thLeaf.height, 430);

  card.destroy();
});

test('renders out-frame rarity with independently optional effect-box border', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    data: {
      rare: 'o',
      foregroundImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
      foregroundWidth: 100,
      foregroundHeight: 100,
      effectBlockBorder: false,
      scale: 0.1,
    },
  });

  await card.whenReady();
  const internals = card as unknown as {
    rareCardBorderLeaf: { visible?: boolean; url?: string; zIndex?: number };
    foregroundLeaf: { visible?: boolean; zIndex?: number };
    effectBoxBorderLeaf: { visible?: boolean; url?: string; zIndex?: number };
  };

  assert.equal(internals.rareCardBorderLeaf.visible, true);
  assert.match(String(internals.rareCardBorderLeaf.url), /card-border-color\.png$/);
  assert.equal(internals.foregroundLeaf.visible, true);
  assert.ok(
    Number(internals.rareCardBorderLeaf.zIndex) < Number(internals.foregroundLeaf.zIndex),
  );
  assert.equal(internals.effectBoxBorderLeaf.visible, false);

  card.setData({ effectBlockBorder: true });
  await card.whenReady();

  assert.match(String(internals.effectBoxBorderLeaf.url), /eblock-border\.png$/);
  assert.equal(internals.effectBoxBorderLeaf.visible, true);

  card.setData({ effectBlockBorderStyle: 'colored' });
  await card.whenReady();

  assert.match(String(internals.effectBoxBorderLeaf.url), /eblock-border-color\.png$/);
  assert.equal(internals.effectBoxBorderLeaf.visible, true);
  assert.ok(
    Number(internals.effectBoxBorderLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex),
  );
  card.destroy();
});

test('expands rarity presets into reusable border and effect layers', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    data: { rare: 'hr', scale: 0.1 },
  });

  await card.whenReady();
  const internals = card as unknown as {
    rareLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    rareCardBorderLeaf: { visible?: boolean; url?: string };
    rareArtBorderLeaf: { visible?: boolean; url?: string };
    rarePendulumArtBorderLeaf: { visible?: boolean; url?: string };
    rarePendulumEffectBorderLeaf: { visible?: boolean; url?: string; zIndex?: number };
    rareEffectBorderLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    foregroundLeaf: { zIndex?: number };
  };

  assert.match(String(internals.rareLeaf.url), /rare-effect\/rare-hr\.png$/);
  assert.match(String(internals.rareCardBorderLeaf.url), /card-border-silver\.png$/);
  assert.match(String(internals.rareArtBorderLeaf.url), /art-frame-silver\.png$/);
  assert.equal(internals.rareArtBorderLeaf.visible, true);
  assert.match(String(internals.rareEffectBorderLeaf.url), /eblock-border-color\.png$/);
  assert.equal(internals.rareEffectBorderLeaf.visible, true);
  assert.equal(internals.rareEffectBorderLeaf.x, 77);
  assert.equal(internals.rareEffectBorderLeaf.y, 1501);
  assert.equal(internals.rareEffectBorderLeaf.width, 1239);
  assert.equal(internals.rareEffectBorderLeaf.height, 427);

  card.setData({ type: 'pendulum', rare: 'hr' });
  await card.whenReady();
  assert.ok(Number(internals.rareLeaf.x) < 0);
  assert.ok(Number(internals.rareLeaf.y) > 0);
  assert.ok(Number(internals.rareLeaf.width) > 1394);
  assert.ok(Number(internals.rareLeaf.height) < 2031);

  card.setData({ type: 'pendulum', rare: 'gser' });
  await card.whenReady();
  assert.match(String(internals.rareLeaf.url), /rare-ser-pendulum\.png$/);
  assert.equal(internals.rareLeaf.x, 0);
  assert.equal(internals.rareLeaf.y, 0);
  assert.equal(internals.rareLeaf.width, 1394);
  assert.equal(internals.rareLeaf.height, 2031);
  assert.match(String(internals.rareCardBorderLeaf.url), /card-border-gold\.png$/);
  assert.equal(internals.rareArtBorderLeaf.visible, false);
  assert.match(String(internals.rarePendulumArtBorderLeaf.url), /pframe-art-gold\.png$/);
  assert.equal(internals.rarePendulumArtBorderLeaf.visible, true);
  assert.match(String(internals.rarePendulumEffectBorderLeaf.url), /pframe-effect-gold\.png$/);
  assert.equal(internals.rarePendulumEffectBorderLeaf.visible, true);
  assert.ok(
    Number(internals.rarePendulumEffectBorderLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex),
  );
  assert.equal(internals.rareEffectBorderLeaf.visible, false);

  card.setData({ type: 'monster', rare: 'gser' });
  await card.whenReady();
  assert.match(String(internals.rareLeaf.url), /rare-ser\.png$/);
  assert.match(String(internals.rareCardBorderLeaf.url), /card-border-gold\.png$/);
  assert.match(String(internals.rareArtBorderLeaf.url), /art-frame-gold\.png$/);
  assert.equal(internals.rareArtBorderLeaf.visible, true);
  assert.equal(internals.rareEffectBorderLeaf.visible, false);

  card.setData({ type: 'monster', rare: 'gr' });
  await card.whenReady();
  assert.equal(internals.rareLeaf.visible, false);
  assert.match(String(internals.rareCardBorderLeaf.url), /card-border-gold\.png$/);
  assert.match(String(internals.rareArtBorderLeaf.url), /art-frame-gold\.png$/);
  assert.equal(internals.rareArtBorderLeaf.visible, true);
  card.setData({ rare: 'pser' });
  await card.whenReady();
  assert.match(String(internals.rareLeaf.url), /rare-ser\.png$/);
  assert.match(String(internals.rareArtBorderLeaf.url), /art-frame-silver\.png$/);
  assert.equal(internals.rareEffectBorderLeaf.visible, false);
  card.setData({ rare: 'o' });
  await card.whenReady();
  assert.match(String(internals.rareEffectBorderLeaf.url), /eblock-border-color\.png$/);
  assert.equal(internals.rareEffectBorderLeaf.visible, true);
  card.destroy();
});

test('keeps frame overrides independent of rarity and each other', async () => {
  const card = new YugiohCard({ resourcePath, skia, data: {
    rare: 'hr', cardBorderStyle: 'gold', artBorderStyle: 'color',
    effectBorderStyle: 'default', scale: 0.1,
  } });
  try {
    await card.whenReady();
    const leaves = card as unknown as Record<string, { url?: string; visible?: boolean }>;
    assert.match(String(leaves.rareCardBorderLeaf.url), /card-border-gold\.png$/);
    assert.match(String(leaves.rareArtBorderLeaf.url), /art-frame-color\.png$/);
    assert.equal(leaves.rareEffectBorderLeaf.visible, false);
    assert.match(String(leaves.rareLeaf.url), /rare-hr\.png$/);
    card.setData({ rare: 'pser', cardBorderStyle: 'default' });
    await card.whenReady();
    assert.equal(leaves.rareCardBorderLeaf.visible, false);
    assert.match(String(leaves.rareArtBorderLeaf.url), /art-frame-color\.png$/);
    card.setData({ type: 'pendulum', artBorderStyle: 'silver', effectBorderStyle: 'gold' });
    await card.whenReady();
    assert.match(String(leaves.rarePendulumArtBorderLeaf.url), /pframe-art-sliver\.png$/);
    assert.match(String(leaves.rarePendulumEffectBorderLeaf.url), /pframe-effect-gold\.png$/);
    const restored = createYugiohCardDocument(JSON.parse(JSON.stringify(card.getDocument())));
    assert.equal(restored.frame.artBorderStyle, 'silver');
    assert.equal(restored.frame.effectBorderStyle, 'gold');
  } finally {
    card.destroy();
  }
});

test('composes out-frame and grandmaster frames with the correct foreground order', async () => {
  const card = new YugiohCard({ resourcePath, skia, data: {
    rare: 'o', scale: 0.1,
    foregroundImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    foregroundWidth: 200, foregroundHeight: 300,
    effectBlockEnabled: true, effectBlockBorder: true,
  } });
  try {
    const leaves = card as unknown as Record<string, { url?: string; visible?: boolean; zIndex?: number }>;
    for (const rare of ['o', 'grandmaster']) {
      for (const type of ['monster', 'pendulum']) {
        card.setData({ rare, type });
        await card.whenReady();
        assert.match(String(leaves.rareCardBorderLeaf.url), new RegExp(`card-border-${rare === 'o' ? 'color' : 'grandmaster'}\\.png$`));
        const art = type === 'pendulum' ? leaves.rarePendulumArtBorderLeaf : leaves.rareArtBorderLeaf;
        assert.equal(art.visible, true);
        assert.match(String(art.url), /(?:pframe-art|art-frame)-color\.png$/);
        assert.ok(Number(art.zIndex) < Number(leaves.foregroundLeaf.zIndex));
        if (type === 'pendulum') {
          assert.equal(leaves.rarePendulumEffectBorderLeaf.visible, true);
          assert.match(String(leaves.rarePendulumEffectBorderLeaf.url), /pframe-effect-color\.png$/);
          assert.ok(Number(leaves.rarePendulumEffectBorderLeaf.zIndex) > Number(leaves.foregroundLeaf.zIndex));
        }
        if (rare === 'grandmaster') {
          assert.equal(leaves.rareEffectBorderLeaf.visible, true);
          assert.match(String(leaves.rareEffectBorderLeaf.url), /eblock-border-grandmaster\.png$/);
          assert.match(String(leaves.effectBoxBorderLeaf.url), /eblock-border-grandmaster\.png$/);
          assert.equal(leaves.rareLeaf.visible, false);
        }
        const exported = await card.export('png', { density: 1 }) as { data: string };
        assert.match(exported.data, /^data:image\/png;base64,/);
      }
    }
  } finally {
    card.destroy();
  }
});

test('switches independent effects, masks and overlay policies without changing frames', async () => {
  const card = new YugiohCard({ resourcePath, skia, data: {
    rare: 'gr', rarityEffect: 'pser2', name: 'Independent effect', scale: 0.1,
  } });
  try {
    await card.whenReady();
    const leaves = card as unknown as Record<string, { url?: string; visible?: boolean; blendMode?: string; zIndex?: number }>;
    assert.match(String(leaves.rareLeaf.url), /rare-pser2\.png$/);
    assert.equal(leaves.rarityMaskLayer.blendMode, 'hard-light');
    assert.equal(leaves.nameLeaf.zIndex, 102);
    assert.match(String(leaves.rareCardBorderLeaf.url), /card-border-gold\.png$/);
    card.setData({ rarityEffect: 'ser-pendulum' });
    await card.whenReady();
    assert.match(String(leaves.rareLeaf.url), /rare-ser-pendulum\.png$/);
    assert.equal(leaves.rarityMaskLayer.blendMode, 'pass-through');
    assert.equal(leaves.nameLeaf.zIndex, 23);
    card.setData({ rarityEffect: 'none' });
    await card.whenReady();
    assert.equal(leaves.rareLeaf.visible, false);
    assert.equal(leaves.rarityMaskLayer.visible, false);
    assert.match(String(leaves.rareCardBorderLeaf.url), /card-border-gold\.png$/);
    assert.equal(card.getDocument().footer.rarityEffect, 'none');
  } finally {
    card.destroy();
  }
});

test('renders pser2 through an adjustable grayscale rarity mask', async () => {
  const maskSource = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  const card = new YugiohCard({
    resourcePath,
    skia,
    data: {
      type: 'pendulum',
      name: 'PSER 2 Name',
      nameShadowColor: '#111111',
      rare: 'pser2',
      rarityMaskImage: maskSource,
      rarityMaskWidth: 200,
      rarityMaskHeight: 300,
      rarityMaskX: 640,
      rarityMaskY: 900,
      rarityMaskScale: 1.5,
      rarityMaskArtwork: true,
      scale: 0.1,
    },
  });

  await card.whenReady();
  const internals = card as unknown as {
    rareLeaf: { url?: string; zIndex?: number; blendMode?: string; parent?: unknown };
    rareCardBorderLeaf: { visible?: boolean; url?: string; zIndex?: number };
    rarePendulumArtBorderLeaf: { visible?: boolean; url?: string; zIndex?: number };
    rarePendulumEffectBorderLeaf: { visible?: boolean; url?: string; zIndex?: number };
    rarityMaskLayer: { visible?: boolean; zIndex?: number; blendMode?: string };
    foregroundClipBox: { zIndex?: number };
    nameLeaf: { zIndex?: number };
    titleShadowLeaf: { zIndex?: number };
    attributeLeaf: { zIndex?: number };
    levelLeaf: { zIndex?: number };
    rankLeaf: { zIndex?: number };
    linkArrowLeaf: { zIndex?: number };
    rarityMaskShape: { mask?: string };
    rarityMaskLeaf: {
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
    };
    rarityEffectBoxMaskLeaf: {
      visible?: boolean;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    rarityArtworkMaskLeaf: {
      visible?: boolean;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
  };

  assert.match(String(internals.rareLeaf.url), /rare-effect\/rare-pser2\.png$/);
  assert.equal(internals.rareLeaf.zIndex, 0);
  assert.equal(internals.rareLeaf.blendMode, 'pass-through');
  assert.match(String(internals.rareCardBorderLeaf.url), /card-border-silver\.png$/);
  assert.equal(internals.rareCardBorderLeaf.visible, true);
  assert.equal(internals.rareCardBorderLeaf.zIndex, 20.5);
  assert.match(String(internals.rarePendulumArtBorderLeaf.url), /pframe-art-sliver\.png$/);
  assert.equal(internals.rarePendulumArtBorderLeaf.visible, true);
  assert.match(
    String(internals.rarePendulumEffectBorderLeaf.url),
    /pframe-effect-sliver\.png$/,
  );
  assert.equal(internals.rarePendulumEffectBorderLeaf.visible, true);
  assert.equal(internals.rarityMaskLayer.visible, true);
  assert.equal(internals.rarityMaskLayer.zIndex, 100);
  assert.equal(internals.rarityMaskLayer.blendMode, 'hard-light');
  assert.ok(
    Number(internals.rareCardBorderLeaf.zIndex) < Number(internals.rarityMaskLayer.zIndex),
  );
  assert.ok(
    Number(internals.rareCardBorderLeaf.zIndex) < Number(internals.foregroundClipBox.zIndex),
  );
  assert.equal(internals.titleShadowLeaf.zIndex, 101);
  assert.equal(internals.nameLeaf.zIndex, 102);
  assert.equal(internals.attributeLeaf.zIndex, 101);
  assert.equal(internals.levelLeaf.zIndex, 101);
  assert.equal(internals.rankLeaf.zIndex, 101);
  assert.equal(internals.linkArrowLeaf.zIndex, 101);
  assert.equal(internals.rarityMaskShape.mask, 'grayscale');
  assert.equal(internals.rarityMaskLeaf.url, maskSource);
  assert.equal(internals.rarityMaskLeaf.x, 640);
  assert.equal(internals.rarityMaskLeaf.y, 900);
  assert.equal(internals.rarityMaskLeaf.width, 200);
  assert.equal(internals.rarityMaskLeaf.height, 300);
  assert.equal(internals.rarityMaskLeaf.scaleX, 1.5);
  assert.equal(internals.rarityArtworkMaskLeaf.visible, true);
  assert.equal(internals.rarityArtworkMaskLeaf.x, 94);
  assert.equal(internals.rarityArtworkMaskLeaf.y, 364);
  assert.equal(internals.rarityArtworkMaskLeaf.width, 1205);
  assert.equal(internals.rarityArtworkMaskLeaf.height, 1205);
  assert.equal(internals.rarityEffectBoxMaskLeaf.visible, true);
  assert.equal(internals.rarityEffectBoxMaskLeaf.x, 93);
  assert.equal(internals.rarityEffectBoxMaskLeaf.y, 1517);
  assert.equal(internals.rarityEffectBoxMaskLeaf.width, 1207);
  assert.equal(internals.rarityEffectBoxMaskLeaf.height, 391);

  const withBorder = await card.export('png', { density: 1 }) as { data: string };
  internals.rareCardBorderLeaf.visible = false;
  const withoutBorder = await card.export('png', { density: 1 }) as { data: string };
  assert.notEqual(withBorder.data, withoutBorder.data);
  internals.rarityMaskLayer.blendMode = 'pass-through';
  const withoutHardLight = await card.export('png', { density: 1 }) as { data: string };
  assert.notEqual(withoutBorder.data, withoutHardLight.data);

  card.setData({
    rarityMaskCoverName: true,
    rarityMaskCoverAttribute: true,
    rarityMaskCoverLevel: true,
  });
  await card.whenReady();
  assert.equal(internals.titleShadowLeaf.zIndex, 22);
  assert.equal(internals.nameLeaf.zIndex, 23);
  assert.equal(internals.attributeLeaf.zIndex, 10);
  assert.equal(internals.levelLeaf.zIndex, 10);
  assert.equal(internals.rankLeaf.zIndex, 10);
  assert.equal(internals.linkArrowLeaf.zIndex, 22);

  card.setData({
    rarityMaskImage: '',
    rarityMaskEffectBox: false,
    rarityMaskArtwork: false,
  });
  await card.whenReady();
  assert.equal(internals.rarityMaskLayer.visible, false);
  assert.equal(internals.rareLeaf.zIndex, 100);
  assert.equal(internals.rareLeaf.blendMode, 'hard-light');

  card.setData({ rare: 'pser' });
  await card.whenReady();
  assert.match(String(internals.rareLeaf.url), /rare-ser-pendulum\.png$/);
  assert.equal(internals.rareCardBorderLeaf.visible, true);
  assert.match(String(internals.rareCardBorderLeaf.url), /card-border-silver\.png$/);

  card.setData({ rare: '' });
  await card.whenReady();
  assert.equal(internals.rareLeaf.blendMode, 'pass-through');
  assert.equal(internals.rareCardBorderLeaf.visible, false);
  card.destroy();
});

test('renders Chinese text with half-width digits', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    data: {
      language: 'sc',
      name: '测试１２３',
      cardType: 'effect',
      monsterType: '龙族／效果２',
      description: '１回合只能发动２次。',
      scale: 0.1,
    },
  });

  await card.whenReady();
  const internals = card as unknown as {
    nameLeaf: { text?: string };
    effectLeaf: { text?: string };
    descriptionLeaf: { text?: string };
  };

  assert.equal(internals.nameLeaf.text, '测试123');
  assert.equal(internals.effectLeaf.text, '【龙族／效果2】');
  assert.equal(internals.descriptionLeaf.text, '1回合只能发动2次。');
  assert.equal(card.getDocument().title.text, '测试１２３');
  card.destroy();
});

test('foreground can be clipped at the bottom edge of the effect box', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      foreground: {
        enabled: true,
        source: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        width: 100,
        height: 100,
        clipBelowEffectBox: true,
      },
      effectBox: { y: 1400, height: 400 },
      render: { scale: 0.1 },
    }),
  });

  await card.whenReady();
  const internals = card as unknown as {
    foregroundClipBox: { height?: number; overflow?: string };
  };
  assert.equal(internals.foregroundClipBox.height, 1800);
  assert.equal(internals.foregroundClipBox.overflow, 'hide');

  await card.updateDocument(document => ({
    ...document,
    foreground: { ...document.foreground, clipBelowEffectBox: false },
  }));
  assert.equal(internals.foregroundClipBox.overflow, 'show');
  card.destroy();
});

test('foreground can avoid covering level, rank, attribute and link-marker overlays', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      frame: {
        cardType: 'link',
        level: 4,
        arrows: [1, 3],
      },
      foreground: {
        enabled: true,
        source: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        width: 100,
        height: 100,
        coverLevel: false,
        coverAttribute: false,
      },
      render: { scale: 0.1 },
    }),
  });

  await card.whenReady();
  const internals = card as unknown as {
    foregroundLeaf: { zIndex?: number };
    nameLeaf: { zIndex?: number };
    attributeLeaf: { zIndex?: number };
    levelLeaf: { zIndex?: number };
    rankLeaf: { zIndex?: number };
    linkArrowLeaf: { zIndex?: number };
  };
  assert.ok(Number(internals.nameLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));
  assert.ok(Number(internals.attributeLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));
  assert.ok(Number(internals.levelLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));
  assert.ok(Number(internals.rankLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));
  assert.ok(Number(internals.linkArrowLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));

  await card.updateDocument(document => ({
    ...document,
    foreground: {
      ...document.foreground,
      coverLevel: true,
      coverAttribute: true,
    },
  }));

  assert.equal(internals.levelLeaf.zIndex, 10);
  assert.equal(internals.rankLeaf.zIndex, 10);
  assert.equal(internals.attributeLeaf.zIndex, 10);
  assert.ok(Number(internals.linkArrowLeaf.zIndex) < Number(internals.foregroundLeaf.zIndex));
  card.destroy();
});

test('pendulum cards compose separate art and effect frame resources', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      frame: {
        type: 'pendulum',
      },
      foreground: {
        enabled: true,
        source: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        width: 100,
        height: 100,
      },
      render: { scale: 0.1 },
    }),
  });

  await card.whenReady();
  const internals = card as unknown as {
    foregroundLeaf: { zIndex?: number };
    maskLeaf: {
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      zIndex?: number;
    };
    pendulumEffectMaskLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      zIndex?: number;
    };
  };

  assert.match(String(internals.maskLeaf.url), /pframe-art-base\.png$/);
  assert.equal(internals.maskLeaf.x, 68);
  assert.equal(internals.maskLeaf.y, 342);
  assert.equal(internals.maskLeaf.width, 1257);
  assert.equal(internals.maskLeaf.height, 914);
  assert.ok(Number(internals.foregroundLeaf.zIndex) > Number(internals.maskLeaf.zIndex));
  assert.equal(internals.pendulumEffectMaskLeaf.visible, true);
  assert.match(
    String(internals.pendulumEffectMaskLeaf.url),
    /pframe-effect-base\.png$/,
  );
  assert.equal(internals.pendulumEffectMaskLeaf.x, 68);
  assert.equal(internals.pendulumEffectMaskLeaf.y, 1256);
  assert.equal(internals.pendulumEffectMaskLeaf.width, 1257);
  assert.equal(internals.pendulumEffectMaskLeaf.height, 681);
  assert.ok(
    Number(internals.pendulumEffectMaskLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex),
  );

  await card.updateDocument(document => ({
    ...document,
    foreground: {
      ...document.foreground,
      enabled: false,
    },
  }));

  assert.match(String(internals.maskLeaf.url), /pframe-art-base\.png$/);
  assert.equal(internals.maskLeaf.width, 1257);
  assert.equal(internals.maskLeaf.height, 914);
  assert.equal(internals.pendulumEffectMaskLeaf.visible, true);
  card.destroy();
});
