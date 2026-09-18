export const YUGIOH_FRAME_STYLES = ['auto', 'default', 'silver', 'gold', 'color', 'grandmaster'] as const;
export type YugiohFrameStyle = typeof YUGIOH_FRAME_STYLES[number];
export const YUGIOH_RARITY_EFFECTS = ['auto', 'none', 'dt', 'ur', 'ur-pendulum', 'hr', 'ser', 'ser-pendulum', 'pser2'] as const;
export type YugiohRarityEffect = typeof YUGIOH_RARITY_EFFECTS[number];

export function resolveRarityEffect(rare: string, type: string, effect = 'auto'): YugiohRarityEffect {
  if (effect !== 'auto' && YUGIOH_RARITY_EFFECTS.includes(effect as YugiohRarityEffect)) {
    return effect as YugiohRarityEffect;
  }
  const preset = RARITY_LAYER_PRESETS[rare.trim().toLowerCase()] ?? {};
  return preset.effect
    ? `${preset.effect}${type === 'pendulum' && preset.pendulumEffect ? '-pendulum' : ''}` as YugiohRarityEffect
    : 'none';
}

export const RARITY_LAYER_PRESETS: Record<string, {
  effect?: string;
  pendulumEffect?: boolean;
  cardBorder?: string;
  artBorder?: string;
  pendulumFrame?: string;
  effectBorder?: string;
}> = {
  dt: { effect: 'dt' },
  ur: { effect: 'ur', pendulumEffect: true },
  gr: { cardBorder: 'gold', artBorder: 'gold', pendulumFrame: 'gold' },
  hr: { effect: 'hr', cardBorder: 'silver', artBorder: 'silver', pendulumFrame: 'sliver', effectBorder: 'color' },
  ser: { effect: 'ser', pendulumEffect: true },
  gser: { effect: 'ser', pendulumEffect: true, cardBorder: 'gold', artBorder: 'gold', pendulumFrame: 'gold' },
  pser: { effect: 'ser', pendulumEffect: true, cardBorder: 'silver', artBorder: 'silver', pendulumFrame: 'sliver' },
  pser2: { effect: 'pser2', cardBorder: 'silver', artBorder: 'silver', pendulumFrame: 'sliver' },
  o: { cardBorder: 'color', artBorder: 'color', pendulumFrame: 'color', effectBorder: 'color' },
  grandmaster: { cardBorder: 'grandmaster', artBorder: 'color', pendulumFrame: 'color', effectBorder: 'grandmaster' },
};

export function getRarityFramePreset(rare: string, type = 'monster'): {
  cardBorderStyle: YugiohFrameStyle;
  artBorderStyle: YugiohFrameStyle;
  effectBorderStyle: YugiohFrameStyle;
  rarityEffect: YugiohRarityEffect;
} {
  const preset = RARITY_LAYER_PRESETS[rare.trim().toLowerCase()] ?? {};
  const pendulum = type === 'pendulum';
  const normalize = (value?: string): YugiohFrameStyle =>
    value === 'sliver' ? 'silver' : (value ?? 'default') as YugiohFrameStyle;
  return {
    cardBorderStyle: normalize(preset.cardBorder),
    artBorderStyle: normalize(pendulum ? preset.pendulumFrame : preset.artBorder),
    effectBorderStyle: normalize(preset.effectBorder === 'grandmaster'
      ? preset.effectBorder : pendulum ? preset.pendulumFrame : preset.effectBorder),
    rarityEffect: resolveRarityEffect(rare, type),
  };
}
