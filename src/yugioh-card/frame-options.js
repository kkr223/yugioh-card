//#region packages/src/yugioh-card/frame-options.ts
var e = [
	"auto",
	"left",
	"center",
	"right"
], t = [
	"auto",
	"level",
	"rank",
	"level-grandmaster"
];
function n(e) {
	let t = e.type === "pendulum" ? e.pendulumType : e.cardType, n = t === "xyz" || t === "xyz-pendulum", r = e.rare?.trim().toLowerCase() === "grandmaster";
	return {
		cardBorderCoverForeground: typeof e.cardBorderCoverForeground == "boolean" ? e.cardBorderCoverForeground : r,
		levelAlign: e.levelAlign && e.levelAlign !== "auto" ? e.levelAlign : n ? "left" : "right",
		levelStyle: e.levelStyle && e.levelStyle !== "auto" ? e.levelStyle : n ? "rank" : r ? "level-grandmaster" : "level",
		showStars: ["monster", "pendulum"].includes(e.type ?? "monster") && t !== "link" && t !== "link-pendulum"
	};
}
//#endregion
export { e as YUGIOH_LEVEL_ALIGNS, t as YUGIOH_LEVEL_STYLES, n as resolveFrameOptions };
