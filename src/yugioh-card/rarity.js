//#region packages/src/yugioh-card/rarity.ts
var e = [
	"auto",
	"default",
	"silver",
	"gold",
	"color"
], t = {
	dt: { effect: "dt" },
	ur: {
		effect: "ur",
		pendulumEffect: !0
	},
	gr: {
		cardBorder: "gold",
		artBorder: "gold",
		pendulumFrame: "gold"
	},
	hr: {
		effect: "hr",
		cardBorder: "silver",
		artBorder: "silver",
		pendulumFrame: "sliver",
		effectBorder: "color"
	},
	ser: {
		effect: "ser",
		pendulumEffect: !0
	},
	gser: {
		effect: "ser",
		pendulumEffect: !0,
		cardBorder: "color",
		artBorder: "color",
		pendulumFrame: "gold",
		effectBorder: "color"
	},
	pser: {
		effect: "ser",
		pendulumEffect: !0,
		cardBorder: "silver",
		artBorder: "silver",
		pendulumFrame: "sliver",
		effectBorder: "color"
	},
	pser2: {
		effect: "pser2",
		cardBorder: "silver",
		artBorder: "silver",
		pendulumFrame: "sliver"
	},
	o: { cardBorder: "color" }
};
function n(e, n = "monster") {
	let r = t[e.trim().toLowerCase()] ?? {}, i = n === "pendulum", a = (e) => e === "sliver" ? "silver" : e ?? "default";
	return {
		cardBorderStyle: a(r.cardBorder),
		artBorderStyle: a(i ? r.pendulumFrame : r.artBorder),
		effectBorderStyle: a(i ? r.pendulumFrame : r.effectBorder)
	};
}
//#endregion
export { t as RARITY_LAYER_PRESETS, e as YUGIOH_FRAME_STYLES, n as getRarityFramePreset };
