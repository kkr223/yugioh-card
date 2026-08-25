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
  assert.match(String(internals.effectBoxBorderLeaf.url), /eblock-border-o\.png$/);
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
    rareLeaf: { visible?: boolean; url?: string; zIndex?: number };
    foregroundLeaf: { visible?: boolean; zIndex?: number };
    effectBoxBorderLeaf: { visible?: boolean; url?: string; zIndex?: number };
  };

  assert.equal(Boolean(internals.rareLeaf.visible), true);
  assert.match(String(internals.rareLeaf.url), /card-bleed-rainbow\.png$/);
  assert.equal(internals.foregroundLeaf.visible, true);
  assert.ok(Number(internals.rareLeaf.zIndex) < Number(internals.foregroundLeaf.zIndex));
  assert.equal(internals.effectBoxBorderLeaf.visible, false);

  card.setData({ effectBlockBorder: true });
  await card.whenReady();

  assert.match(String(internals.effectBoxBorderLeaf.url), /eblock-border\.png$/);
  assert.equal(internals.effectBoxBorderLeaf.visible, true);

  card.setData({ effectBlockBorderStyle: 'colored' });
  await card.whenReady();

  assert.match(String(internals.effectBoxBorderLeaf.url), /eblock-border-o\.png$/);
  assert.equal(internals.effectBoxBorderLeaf.visible, true);
  assert.ok(
    Number(internals.effectBoxBorderLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex),
  );
  card.destroy();
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
    rarePrintLeaf: { visible?: boolean; url?: string; zIndex?: number };
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

  assert.match(String(internals.rareLeaf.url), /rare-pser2\.png$/);
  assert.equal(internals.rareLeaf.zIndex, 0);
  assert.equal(internals.rareLeaf.blendMode, 'pass-through');
  assert.match(String(internals.rarePrintLeaf.url), /rare-pser-print-pendulum\.png$/);
  assert.equal(internals.rarePrintLeaf.visible, true);
  assert.equal(internals.rarePrintLeaf.zIndex, 20.5);
  assert.equal(internals.rarityMaskLayer.visible, true);
  assert.equal(internals.rarityMaskLayer.zIndex, 100);
  assert.equal(internals.rarityMaskLayer.blendMode, 'hard-light');
  assert.ok(
    Number(internals.rarePrintLeaf.zIndex) < Number(internals.rarityMaskLayer.zIndex),
  );
  assert.ok(
    Number(internals.rarePrintLeaf.zIndex) < Number(internals.foregroundClipBox.zIndex),
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

  const withPrint = await card.export('png', { density: 1 }) as { data: string };
  internals.rarePrintLeaf.visible = false;
  const withoutPrint = await card.export('png', { density: 1 }) as { data: string };
  assert.notEqual(withPrint.data, withoutPrint.data);
  internals.rarityMaskLayer.blendMode = 'pass-through';
  const withoutHardLight = await card.export('png', { density: 1 }) as { data: string };
  assert.notEqual(withoutPrint.data, withoutHardLight.data);

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
  assert.match(String(internals.rareLeaf.url), /rare-pser-pendulum\.png$/);
  assert.equal(internals.rarePrintLeaf.visible, false);

  card.setData({ rare: '' });
  await card.whenReady();
  assert.equal(internals.rareLeaf.blendMode, 'pass-through');
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

test('pendulum foreground cards split art and effect masks around the foreground', async () => {
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

  assert.match(String(internals.maskLeaf.url), /card-mask-pendulum-art\.png$/);
  assert.equal(internals.maskLeaf.x, 68);
  assert.equal(internals.maskLeaf.y, 342);
  assert.equal(internals.maskLeaf.width, 1257);
  assert.equal(internals.maskLeaf.height, 914);
  assert.ok(Number(internals.foregroundLeaf.zIndex) > Number(internals.maskLeaf.zIndex));
  assert.equal(internals.pendulumEffectMaskLeaf.visible, true);
  assert.match(
    String(internals.pendulumEffectMaskLeaf.url),
    /card-mask-pendulum-effect\.png$/,
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

  assert.match(String(internals.maskLeaf.url), /card-mask-pendulum\.png$/);
  assert.equal(internals.maskLeaf.width, 1257);
  assert.equal(internals.maskLeaf.height, 1595);
  assert.equal(internals.pendulumEffectMaskLeaf.visible, false);
  card.destroy();
});
