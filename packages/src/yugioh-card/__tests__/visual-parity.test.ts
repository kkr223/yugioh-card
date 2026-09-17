import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import skia from 'skia-canvas';
import { YugiohCard as OldYugiohCard } from 'yugioh-card-v190';
import { YugiohCard } from '../index.ts';

const resourcePath = path.resolve('src/assets/yugioh-card');
const data = {
  language: 'sc',
  name: '青眼白龙',
  type: 'monster',
  attribute: 'light',
  cardType: 'normal',
  level: 8,
  monsterType: '龙族/通常',
  atk: 3000,
  def: 2500,
  description: '以高攻击力著称的传说之龙。',
  package: 'SD25-SC001',
  password: '89631139',
  radius: true,
  scale: 0.1,
};

function waitForView(card: { leafer: { waitViewCompleted(callback: () => void): void } }) {
  return new Promise<void>(resolve => {
    card.leafer.waitViewCompleted(resolve);
  });
}

async function pixelsFromCard(card: {
  leafer: {
    waitViewCompleted(callback: () => void): void;
    canvas: { view: { toBuffer(type: string): Promise<Buffer> } };
  };
}) {
  await waitForView(card);
  const buffer = await card.leafer.canvas.view.toBuffer('png');
  const image = await skia.loadImage(buffer);
  const canvas = new skia.Canvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return {
    width: image.width,
    height: image.height,
    pixels: context.getImageData(0, 0, image.width, image.height).data,
  };
}

async function createLegacyResourcePath(): Promise<string> {
  const legacyResourcePath = await mkdtemp(path.join(tmpdir(), 'yugioh-card-legacy-'));
  const targetDirectory = path.join(legacyResourcePath, 'yugioh', 'image');
  await mkdir(targetDirectory, { recursive: true });
  await symlink(
    path.join(resourcePath, 'yugioh', 'font'),
    path.join(legacyResourcePath, 'yugioh', 'font'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );

  const mappings = [
    ['card/card-normal.png', 'card-normal.png'],
    ['attribute/attribute-light.png', 'attribute-light.png'],
    ['attribute/attribute-rare.png', 'attribute-rare.png'],
    ['level/level.png', 'level.png'],
    ['level/rank.png', 'rank.png'],
    ['art-border/art-frame-base.png', 'card-mask.png'],
    ['text/atk-def.svg', 'atk-def.svg'],
    ['watermark/twentieth.png', 'twentieth.png'],
  ];
  for (const direction of [
    'up',
    'right-up',
    'right',
    'right-down',
    'down',
    'left-down',
    'left',
    'left-up',
  ]) {
    for (const state of ['on', 'off']) {
      const fileName = `arrow-${direction}-${state}.png`;
      mappings.push([`linkmarker/${fileName}`, fileName]);
    }
  }

  await Promise.all(mappings.map(([source, target]) => copyFile(
    path.join(resourcePath, 'yugioh', 'image', source),
    path.join(targetDirectory, target),
  )));
  return legacyResourcePath;
}

test('keeps legacy rendering within the pixel compatibility budget', async () => {
  const legacyResourcePath = await createLegacyResourcePath();
  try {
    const oldCard = new OldYugiohCard({ resourcePath: legacyResourcePath, skia, data });
    const newCard = new YugiohCard({ resourcePath, skia, data });
    await newCard.whenReady();

    const [oldImage, newImage] = await Promise.all([
      pixelsFromCard(oldCard),
      pixelsFromCard(newCard),
    ]);
    assert.equal(newImage.width, oldImage.width);
    assert.equal(newImage.height, oldImage.height);

    let changedPixels = 0;
    const pixelCount = oldImage.width * oldImage.height;
    for (let index = 0; index < oldImage.pixels.length; index += 4) {
      let changed = false;
      for (let channel = 0; channel < 4; channel += 1) {
        if (Math.abs(oldImage.pixels[index + channel] - newImage.pixels[index + channel]) > 8) {
          changed = true;
          break;
        }
      }
      if (changed) {
        changedPixels += 1;
      }
    }

    oldCard.leafer.destroy();
    newCard.destroy();
    assert.ok(
      changedPixels / pixelCount <= 0.001,
      `${changedPixels}/${pixelCount} pixels exceeded tolerance`,
    );
  } finally {
    await rm(legacyResourcePath, { recursive: true, force: true });
  }
});
