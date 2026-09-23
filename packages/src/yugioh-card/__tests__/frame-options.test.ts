import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createYugiohCardDocument,
  legacyDataToYugiohCardDocument,
  parseYugiohCardDocument,
  resolveFrameOptions,
  yugiohCardDocumentToLegacyData,
} from '../document.ts';

test('frame defaults follow rarity and model without a grandmaster rank variant', () => {
  for (const rare of ['', 'o', 'grandmaster']) {
    for (const type of ['monster', 'pendulum']) {
      for (const model of ['normal', 'xyz', 'link']) {
        const options = resolveFrameOptions({
          type, rare, cardType: model, pendulumType: `${model}-pendulum`,
        });
        assert.equal(options.cardBorderCoverForeground, rare === 'grandmaster');
        assert.equal(options.levelAlign, model === 'xyz' ? 'left' : 'right');
        assert.equal(options.levelStyle, model === 'xyz' ? 'rank'
          : rare === 'grandmaster' ? 'level-grandmaster' : 'level');
        assert.equal(options.showStars, model !== 'link');
      }
    }
  }
  assert.equal(resolveFrameOptions({ type: 'spell' }).showStars, false);
});

test('frame overrides round-trip, survive preset changes, and reset to auto', () => {
  const original = legacyDataToYugiohCardDocument({
    rare: 'grandmaster', cardBorderCoverForeground: false,
    levelAlign: 'center', levelStyle: 'level',
  });
  const parsed = parseYugiohCardDocument(JSON.parse(JSON.stringify(original)));
  assert.deepEqual(parsed, original);
  const changed = legacyDataToYugiohCardDocument({ cardType: 'xyz' }, parsed);
  const flat = yugiohCardDocumentToLegacyData(changed);
  assert.deepEqual(resolveFrameOptions(flat), {
    cardBorderCoverForeground: false, levelAlign: 'center', levelStyle: 'level', showStars: true,
  });
  const reset = legacyDataToYugiohCardDocument({
    cardBorderCoverForeground: 'auto', levelAlign: 'auto', levelStyle: 'auto',
  }, changed);
  assert.deepEqual(resolveFrameOptions(yugiohCardDocumentToLegacyData(reset)), {
    cardBorderCoverForeground: true, levelAlign: 'left', levelStyle: 'rank', showStars: true,
  });
});

test('old documents default frame options to auto and reject malformed overrides', () => {
  const old = JSON.parse(JSON.stringify(createYugiohCardDocument()));
  for (const field of ['cardBorderCoverForeground', 'levelAlign', 'levelStyle']) {
    delete old.frame[field];
  }
  const parsed = parseYugiohCardDocument(old);
  assert.equal(parsed.frame.cardBorderCoverForeground, 'auto');
  assert.equal(parsed.frame.levelAlign, 'auto');
  assert.equal(parsed.frame.levelStyle, 'auto');
  for (const field of ['cardBorderCoverForeground', 'levelAlign', 'levelStyle']) {
    assert.throws(() => parseYugiohCardDocument({
      ...old, frame: { ...old.frame, [field]: 'invalid' },
    }), new RegExp(`frame\\.${field}`));
  }
});
