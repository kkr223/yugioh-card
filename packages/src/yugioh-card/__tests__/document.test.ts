import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createYugiohCardDocument,
  legacyDataToYugiohCardDocument,
  parseYugiohCardDocument,
  yugiohCardDocumentToLegacyData,
  YugiohCardDocumentError,
} from '../document.ts';

test('creates independent default documents', () => {
  const first = createYugiohCardDocument();
  const second = createYugiohCardDocument();

  first.frame.arrows.push(1);
  assert.deepEqual(second.frame.arrows, []);
  assert.equal(second.title.fill.gradientStroke, true);
  assert.equal(second.foreground.clipBelowEffectBox, false);
  assert.equal(second.rarityMask.maskEffectBox, true);
});

test('maps legacy data to a structured document and back', () => {
  const document = legacyDataToYugiohCardDocument({
    language: 'jp',
    name: 'テスト',
    gradient: true,
    gradientStroke: false,
    type: 'pendulum',
    pendulumType: 'xyz-pendulum',
    arrowList: [1, 9, 3],
    foregroundImage: 'foreground.png',
    foregroundWidth: 400,
    foregroundHeight: 600,
    foregroundCoverLevel: false,
    foregroundCoverAttribute: false,
    foregroundClipBelowEffectBox: true,
    rarityMaskImage: 'mask.png',
    rarityMaskWidth: 1394,
    rarityMaskHeight: 2031,
    rarityMaskX: 700,
    rarityMaskY: 1000,
    rarityMaskScale: 0.9,
    rarityMaskEffectBox: false,
    nameShadowColor: '#111111',
    nameBlock: true,
    effectBlockEnabled: true,
    effectBlockX: 80,
    effectBlockWidth: 1200,
    effectBlockBorderStyle: 'colored',
    mark25th: true,
  });

  assert.equal(document.frame.language, 'jp');
  assert.deepEqual(document.frame.arrows, [1, 3]);
  assert.equal(document.title.shadow.enabled, true);
  assert.equal(document.title.fill.gradientStroke, false);
  assert.equal(document.frame.nameBlock, true);
  assert.equal(document.foreground.enabled, true);
  assert.equal(document.foreground.coverLevel, false);
  assert.equal(document.foreground.coverAttribute, false);
  assert.equal(document.foreground.clipBelowEffectBox, true);
  assert.equal(document.rarityMask.source, 'mask.png');
  assert.equal(document.rarityMask.scale, 0.9);
  assert.equal(document.rarityMask.maskEffectBox, false);
  assert.equal(document.effectBox.x, 80);
  assert.equal(document.effectBox.borderStyle, 'colored');
  assert.equal(document.footer.mark25th, true);

  const legacy = yugiohCardDocumentToLegacyData(document);
  assert.equal(legacy.name, 'テスト');
  assert.equal(legacy.gradientStroke, false);
  assert.equal(legacy.nameBlock, true);
  assert.equal(legacy.foregroundImage, 'foreground.png');
  assert.equal(legacy.foregroundCoverLevel, false);
  assert.equal(legacy.foregroundCoverAttribute, false);
  assert.equal(legacy.foregroundClipBelowEffectBox, true);
  assert.equal(legacy.rarityMaskImage, 'mask.png');
  assert.equal(legacy.rarityMaskScale, 0.9);
  assert.equal(legacy.rarityMaskEffectBox, false);
  assert.equal(legacy.effectBlockWidth, 1200);
  assert.equal(legacy.effectBlockBorderStyle, 'colored');
  assert.equal(legacy.mark25th, true);
});

test('legacy data uses defaults for invalid enum values', () => {
  const document = legacyDataToYugiohCardDocument({
    language: 'invalid',
    type: 'invalid',
  });

  assert.equal(document.frame.language, 'sc');
  assert.equal(document.frame.type, 'monster');
});

test('strict parser rejects unknown versions and invalid enums', () => {
  const document = createYugiohCardDocument();

  assert.throws(
    () => parseYugiohCardDocument({ ...document, version: 2 }),
    YugiohCardDocumentError,
  );
  assert.throws(
    () => parseYugiohCardDocument({
      ...document,
      frame: { ...document.frame, language: 'invalid' },
    }),
    /frame\.language/,
  );
  assert.throws(
    () => parseYugiohCardDocument({
      ...document,
      effectBox: { ...document.effectBox, borderStyle: 'invalid' },
    }),
    /effectBox\.borderStyle/,
  );
});

test('strict parser returns a detached document', () => {
  const input = createYugiohCardDocument({
    frame: { arrows: [1, 2] },
  });
  const parsed = parseYugiohCardDocument(input);

  input.frame.arrows.push(3);
  assert.deepEqual(parsed.frame.arrows, [1, 2]);
});

test('strict parser keeps version 1 documents without the new rarity mask section compatible', () => {
  const { rarityMask: _rarityMask, ...legacyDocument } = createYugiohCardDocument();
  const parsed = parseYugiohCardDocument(legacyDocument);

  assert.equal(parsed.rarityMask.source, '');
  assert.equal(parsed.rarityMask.maskEffectBox, true);
});
