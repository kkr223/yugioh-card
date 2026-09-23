export declare const YUGIOH_LEVEL_ALIGNS: readonly ["auto", "left", "center", "right"];
export declare const YUGIOH_LEVEL_STYLES: readonly ["auto", "level", "rank", "level-grandmaster"];
export type YugiohLevelAlign = typeof YUGIOH_LEVEL_ALIGNS[number];
export type YugiohLevelStyle = typeof YUGIOH_LEVEL_STYLES[number];
export declare function resolveFrameOptions(data: {
    type?: string;
    cardType?: string;
    pendulumType?: string;
    rare?: string;
    cardBorderCoverForeground?: boolean | 'auto';
    levelAlign?: string;
    levelStyle?: string;
}): {
    cardBorderCoverForeground: boolean;
    levelAlign: string;
    levelStyle: string;
    showStars: boolean;
};
