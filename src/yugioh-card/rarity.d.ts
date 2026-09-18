export declare const YUGIOH_FRAME_STYLES: readonly ["auto", "default", "silver", "gold", "color"];
export type YugiohFrameStyle = typeof YUGIOH_FRAME_STYLES[number];
export declare const RARITY_LAYER_PRESETS: Record<string, {
    effect?: string;
    pendulumEffect?: boolean;
    cardBorder?: string;
    artBorder?: string;
    pendulumFrame?: string;
    effectBorder?: string;
}>;
export declare function getRarityFramePreset(rare: string, type?: string): {
    cardBorderStyle: YugiohFrameStyle;
    artBorderStyle: YugiohFrameStyle;
    effectBorderStyle: YugiohFrameStyle;
};
