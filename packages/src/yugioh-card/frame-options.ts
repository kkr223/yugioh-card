export const YUGIOH_LEVEL_ALIGNS = ['auto', 'left', 'center', 'right'] as const;
export const YUGIOH_LEVEL_STYLES = ['auto', 'level', 'rank', 'level-grandmaster'] as const;
export type YugiohLevelAlign = typeof YUGIOH_LEVEL_ALIGNS[number];
export type YugiohLevelStyle = typeof YUGIOH_LEVEL_STYLES[number];

export function resolveFrameOptions(data: {
  type?: string;
  cardType?: string;
  pendulumType?: string;
  rare?: string;
  cardBorderCoverForeground?: boolean | 'auto';
  levelAlign?: string;
  levelStyle?: string;
}) {
  const model = data.type === 'pendulum' ? data.pendulumType : data.cardType;
  const xyz = model === 'xyz' || model === 'xyz-pendulum';
  const master = data.rare?.trim().toLowerCase() === 'grandmaster';
  return {
    cardBorderCoverForeground: typeof data.cardBorderCoverForeground === 'boolean'
      ? data.cardBorderCoverForeground : master,
    levelAlign: data.levelAlign && data.levelAlign !== 'auto'
      ? data.levelAlign : xyz ? 'left' : 'right',
    levelStyle: data.levelStyle && data.levelStyle !== 'auto'
      ? data.levelStyle : xyz ? 'rank' : master ? 'level-grandmaster' : 'level',
    showStars: ['monster', 'pendulum'].includes(data.type ?? 'monster')
      && model !== 'link' && model !== 'link-pendulum',
  };
}
