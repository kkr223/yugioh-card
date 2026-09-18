//#region packages/src/yugioh-card/rarity.ts
var e = [
	"auto",
	"default",
	"silver",
	"gold",
	"color"
], t = [
	"auto",
	"none",
	"dt",
	"ur",
	"ur-pendulum",
	"hr",
	"ser",
	"ser-pendulum",
	"pser2"
];
function n(e, n, i = "auto") {
	if (i !== "auto" && t.includes(i)) return i;
	let a = r[e.trim().toLowerCase()] ?? {};
	return a.effect ? `${a.effect}${n === "pendulum" && a.pendulumEffect ? "-pendulum" : ""}` : "none";
}
var r = {
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
function i(e, t = "monster") {
	let i = r[e.trim().toLowerCase()] ?? {}, a = t === "pendulum", o = (e) => e === "sliver" ? "silver" : e ?? "default";
	return {
		cardBorderStyle: o(i.cardBorder),
		artBorderStyle: o(a ? i.pendulumFrame : i.artBorder),
		effectBorderStyle: o(a ? i.pendulumFrame : i.effectBorder),
		rarityEffect: n(e, t)
	};
}
//#endregion
export { e as YUGIOH_FRAME_STYLES, t as YUGIOH_RARITY_EFFECTS, i as getRarityFramePreset, n as resolveRarityEffect };
