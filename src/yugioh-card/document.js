import { YUGIOH_FRAME_STYLES as e, YUGIOH_RARITY_EFFECTS as t, getRarityFramePreset as n, resolveRarityEffect as r } from "./rarity.js";
//#region packages/src/yugioh-card/document.ts
var i = "yugioh-card", a = 1, o = [
	"sc",
	"tc",
	"jp",
	"kr",
	"en",
	"astral",
	"custom1",
	"custom2"
], s = [
	"monster",
	"spell",
	"trap",
	"pendulum"
], c = [
	"normal",
	"effect",
	"ritual",
	"fusion",
	"synchro",
	"xyz",
	"link",
	"token"
], l = [
	"normal-pendulum",
	"effect-pendulum",
	"ritual-pendulum",
	"fusion-pendulum",
	"synchro-pendulum",
	"xyz-pendulum",
	"link-pendulum"
], u = [
	"left",
	"center",
	"right"
], d = [
	"cover",
	"contain",
	"stretch"
], f = [
	"none",
	"default",
	"colored"
], p = [
	"before-frame",
	"after-artwork",
	"before-text",
	"after-text",
	"top"
], m = class extends Error {
	path;
	constructor(e, t = "") {
		super(t ? `${t}: ${e}` : e), this.name = "YugiohCardDocumentError", this.path = t;
	}
}, h = {
	kind: i,
	version: 1,
	frame: {
		language: "sc",
		font: "",
		type: "monster",
		attribute: "dark",
		icon: "",
		cardType: "normal",
		pendulumType: "normal-pendulum",
		level: 0,
		rank: 0,
		pendulumScale: 0,
		arrows: [],
		nameBlock: !1,
		cardBorderStyle: "auto",
		artBorderStyle: "auto",
		effectBorderStyle: "auto"
	},
	title: {
		text: "",
		align: "left",
		fill: {
			color: "",
			gradient: !1,
			gradientStroke: !0,
			gradientColor1: "#999999",
			gradientColor2: "#ffffff"
		},
		shadow: {
			enabled: !1,
			color: "",
			gradient: !1,
			gradientColor1: "#1f2937",
			gradientColor2: "#0f172a",
			offsetX: 7,
			offsetY: 7,
			opacity: .92
		},
		useRarityPreset: !1
	},
	artwork: {
		source: "",
		fit: "cover"
	},
	foreground: {
		enabled: !1,
		source: "",
		width: 0,
		height: 0,
		x: 697,
		y: 1015.5,
		scale: 1,
		rotation: 0,
		coverLevel: !0,
		coverAttribute: !0,
		clipBelowEffectBox: !1
	},
	rarityMask: {
		source: "",
		width: 0,
		height: 0,
		x: 697,
		y: 1015.5,
		scale: 1,
		maskEffectBox: !0,
		maskArtwork: !1,
		coverName: !1,
		coverAttribute: !1,
		coverLevel: !1
	},
	effectBox: {
		enabled: !1,
		x: 77,
		y: 1501,
		width: 1239,
		height: 427,
		color: "#f6f2e8",
		opacity: .78,
		borderStyle: "none"
	},
	text: {
		pendulumDescription: "",
		monsterType: "",
		description: "",
		firstLineCompress: !1,
		descriptionAlign: !1,
		descriptionZoom: 1,
		descriptionWeight: 0,
		showAtkBar: !0,
		atk: 0,
		def: 0
	},
	footer: {
		package: "",
		password: "",
		copyright: "",
		laser: "",
		rare: "",
		rarityEffect: "auto",
		twentieth: !1,
		mark25th: !1
	},
	render: {
		radius: !0,
		scale: 1
	}
};
function g(e) {
	return {
		...e,
		frame: {
			...e.frame,
			arrows: [...e.frame.arrows]
		},
		title: {
			...e.title,
			fill: { ...e.title.fill },
			shadow: { ...e.title.shadow }
		},
		artwork: { ...e.artwork },
		foreground: { ...e.foreground },
		rarityMask: { ...e.rarityMask },
		effectBox: { ...e.effectBox },
		text: { ...e.text },
		footer: { ...e.footer },
		render: { ...e.render }
	};
}
function _(e = {}) {
	let t = g(h);
	return {
		...t,
		...e,
		kind: i,
		version: 1,
		frame: {
			...t.frame,
			...e.frame,
			arrows: [...e.frame?.arrows ?? t.frame.arrows]
		},
		title: {
			...t.title,
			...e.title,
			fill: {
				...t.title.fill,
				...e.title?.fill
			},
			shadow: {
				...t.title.shadow,
				...e.title?.shadow
			}
		},
		artwork: {
			...t.artwork,
			...e.artwork
		},
		foreground: {
			...t.foreground,
			...e.foreground
		},
		rarityMask: {
			...t.rarityMask,
			...e.rarityMask
		},
		effectBox: {
			...t.effectBox,
			...e.effectBox
		},
		text: {
			...t.text,
			...e.text
		},
		footer: {
			...t.footer,
			...e.footer
		},
		render: {
			...t.render,
			...e.render
		}
	};
}
function v(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function y(e, t) {
	let n = e[t];
	if (!v(n)) throw new m("expected an object", t);
	return n;
}
function b(e, t, n) {
	if (typeof e != "string" || !t.includes(e)) throw new m(`expected one of ${t.join(", ")}`, n);
	return e;
}
function x(e, t) {
	if (typeof e != "string") throw new m("expected a string", t);
	return e;
}
function S(e, t) {
	if (typeof e != "number" || !Number.isFinite(e)) throw new m("expected a finite number", t);
	return e;
}
function C(e, t) {
	if (typeof e != "boolean") throw new m("expected a boolean", t);
	return e;
}
function w(e, t, n, r) {
	return e === void 0 ? n : b(e, t, r);
}
function T(e, t, n) {
	return e === void 0 ? t : C(e, n);
}
function E(n) {
	if (!v(n)) throw new m("expected an object");
	if (n.kind !== "yugioh-card") throw new m(`expected ${i}`, "kind");
	if (n.version !== 1) throw new m(`unsupported version ${String(n.version)}`, "version");
	let r = y(n, "frame"), a = y(n, "title"), p = y(a, "fill"), g = y(a, "shadow"), _ = y(n, "artwork"), E = y(n, "foreground"), D = n.rarityMask === void 0 ? h.rarityMask : y(n, "rarityMask"), O = y(n, "effectBox"), k = y(n, "text"), A = y(n, "footer"), j = y(n, "render"), M = r.arrows;
	if (!Array.isArray(M) || M.some((e) => !Number.isInteger(e) || e < 1 || e > 8)) throw new m("expected integers from 1 to 8", "frame.arrows");
	return {
		kind: i,
		version: 1,
		frame: {
			language: b(r.language, o, "frame.language"),
			font: b(r.font, [
				"",
				"custom1",
				"custom2"
			], "frame.font"),
			type: b(r.type, s, "frame.type"),
			attribute: x(r.attribute, "frame.attribute"),
			icon: x(r.icon, "frame.icon"),
			cardType: b(r.cardType, c, "frame.cardType"),
			pendulumType: b(r.pendulumType, l, "frame.pendulumType"),
			level: S(r.level, "frame.level"),
			rank: S(r.rank, "frame.rank"),
			pendulumScale: S(r.pendulumScale, "frame.pendulumScale"),
			arrows: [...M],
			nameBlock: T(r.nameBlock, !1, "frame.nameBlock"),
			cardBorderStyle: b(r.cardBorderStyle ?? "auto", e, "frame.cardBorderStyle"),
			artBorderStyle: b(r.artBorderStyle ?? "auto", e, "frame.artBorderStyle"),
			effectBorderStyle: b(r.effectBorderStyle ?? "auto", e, "frame.effectBorderStyle")
		},
		title: {
			text: x(a.text, "title.text"),
			align: b(a.align, u, "title.align"),
			fill: {
				color: x(p.color, "title.fill.color"),
				gradient: C(p.gradient, "title.fill.gradient"),
				gradientStroke: T(p.gradientStroke, !0, "title.fill.gradientStroke"),
				gradientColor1: x(p.gradientColor1, "title.fill.gradientColor1"),
				gradientColor2: x(p.gradientColor2, "title.fill.gradientColor2")
			},
			shadow: {
				enabled: C(g.enabled, "title.shadow.enabled"),
				color: x(g.color, "title.shadow.color"),
				gradient: C(g.gradient, "title.shadow.gradient"),
				gradientColor1: x(g.gradientColor1, "title.shadow.gradientColor1"),
				gradientColor2: x(g.gradientColor2, "title.shadow.gradientColor2"),
				offsetX: S(g.offsetX, "title.shadow.offsetX"),
				offsetY: S(g.offsetY, "title.shadow.offsetY"),
				opacity: S(g.opacity, "title.shadow.opacity")
			},
			useRarityPreset: C(a.useRarityPreset, "title.useRarityPreset")
		},
		artwork: {
			source: x(_.source, "artwork.source"),
			fit: b(_.fit, d, "artwork.fit")
		},
		foreground: {
			enabled: C(E.enabled, "foreground.enabled"),
			source: x(E.source, "foreground.source"),
			width: S(E.width, "foreground.width"),
			height: S(E.height, "foreground.height"),
			x: S(E.x, "foreground.x"),
			y: S(E.y, "foreground.y"),
			scale: S(E.scale, "foreground.scale"),
			rotation: S(E.rotation, "foreground.rotation"),
			coverLevel: T(E.coverLevel, !0, "foreground.coverLevel"),
			coverAttribute: T(E.coverAttribute, !0, "foreground.coverAttribute"),
			clipBelowEffectBox: T(E.clipBelowEffectBox, !1, "foreground.clipBelowEffectBox")
		},
		rarityMask: {
			source: x(D.source, "rarityMask.source"),
			width: S(D.width, "rarityMask.width"),
			height: S(D.height, "rarityMask.height"),
			x: S(D.x, "rarityMask.x"),
			y: S(D.y, "rarityMask.y"),
			scale: S(D.scale, "rarityMask.scale"),
			maskEffectBox: T(D.maskEffectBox, !0, "rarityMask.maskEffectBox"),
			maskArtwork: T(D.maskArtwork, !1, "rarityMask.maskArtwork"),
			coverName: T(D.coverName, !1, "rarityMask.coverName"),
			coverAttribute: T(D.coverAttribute, !1, "rarityMask.coverAttribute"),
			coverLevel: T(D.coverLevel, !1, "rarityMask.coverLevel")
		},
		effectBox: {
			enabled: C(O.enabled, "effectBox.enabled"),
			x: S(O.x, "effectBox.x"),
			y: S(O.y, "effectBox.y"),
			width: S(O.width, "effectBox.width"),
			height: S(O.height, "effectBox.height"),
			color: x(O.color, "effectBox.color"),
			opacity: S(O.opacity, "effectBox.opacity"),
			borderStyle: w(O.borderStyle, f, "none", "effectBox.borderStyle")
		},
		text: {
			pendulumDescription: x(k.pendulumDescription, "text.pendulumDescription"),
			monsterType: x(k.monsterType, "text.monsterType"),
			description: x(k.description, "text.description"),
			firstLineCompress: C(k.firstLineCompress, "text.firstLineCompress"),
			descriptionAlign: C(k.descriptionAlign, "text.descriptionAlign"),
			descriptionZoom: S(k.descriptionZoom, "text.descriptionZoom"),
			descriptionWeight: S(k.descriptionWeight, "text.descriptionWeight"),
			showAtkBar: C(k.showAtkBar, "text.showAtkBar"),
			atk: S(k.atk, "text.atk"),
			def: S(k.def, "text.def")
		},
		footer: {
			package: x(A.package, "footer.package"),
			password: x(A.password, "footer.password"),
			copyright: x(A.copyright, "footer.copyright"),
			laser: x(A.laser, "footer.laser"),
			rare: x(A.rare, "footer.rare"),
			rarityEffect: b(A.rarityEffect ?? "auto", t, "footer.rarityEffect"),
			twentieth: C(A.twentieth, "footer.twentieth"),
			mark25th: T(A.mark25th, !1, "footer.mark25th")
		},
		render: {
			radius: C(j.radius, "render.radius"),
			scale: S(j.scale, "render.scale")
		}
	};
}
function D(e, t) {
	return typeof e == "string" ? e : t;
}
function O(e, t) {
	return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function k(e, t) {
	return typeof e == "boolean" ? e : t;
}
function A(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function j(e, t) {
	return typeof e.effectBlockBorderStyle == "string" ? e.effectBlockBorderStyle === "o" || e.effectBlockBorderStyle === "alternate" ? "colored" : A(e.effectBlockBorderStyle, f, t) : typeof e.effectBlockBorder == "boolean" ? e.effectBlockBorder ? "default" : "none" : t;
}
function M(n = {}, r = _()) {
	let i = D(n.nameShadowColor, r.title.shadow.color), a = D(n.foregroundImage, r.foreground.source), f = D(n.rarityMaskImage, r.rarityMask.source), p = Array.isArray(n.arrowList) ? n.arrowList.filter((e) => Number.isInteger(e) && e >= 1 && e <= 8) : r.frame.arrows;
	return _({
		frame: {
			language: A(n.language, o, r.frame.language),
			font: A(n.font, [
				"",
				"custom1",
				"custom2"
			], r.frame.font),
			type: A(n.type, s, r.frame.type),
			attribute: D(n.attribute, r.frame.attribute),
			icon: D(n.icon, r.frame.icon),
			cardType: A(n.cardType, c, r.frame.cardType),
			pendulumType: A(n.pendulumType, l, r.frame.pendulumType),
			level: O(n.level, r.frame.level),
			rank: O(n.rank, r.frame.rank),
			pendulumScale: O(n.pendulumScale, r.frame.pendulumScale),
			arrows: p,
			cardBorderStyle: A(n.cardBorderStyle, e, r.frame.cardBorderStyle),
			artBorderStyle: A(n.artBorderStyle, e, r.frame.artBorderStyle),
			effectBorderStyle: A(n.effectBorderStyle, e, r.frame.effectBorderStyle),
			nameBlock: k(n.nameBlock ?? n.outFrameNameBlock ?? n.outFrameNameBlockEnabled, r.frame.nameBlock)
		},
		title: {
			text: D(n.name, r.title.text),
			align: A(n.align, u, r.title.align),
			fill: {
				color: D(n.color, r.title.fill.color),
				gradient: k(n.gradient, r.title.fill.gradient),
				gradientStroke: k(n.gradientStroke, r.title.fill.gradientStroke),
				gradientColor1: D(n.gradientColor1, r.title.fill.gradientColor1),
				gradientColor2: D(n.gradientColor2, r.title.fill.gradientColor2)
			},
			shadow: {
				enabled: !!(i || n.nameShadowGradient || r.title.shadow.enabled),
				color: i,
				gradient: k(n.nameShadowGradient, r.title.shadow.gradient),
				gradientColor1: D(n.nameShadowGradientColor1, r.title.shadow.gradientColor1),
				gradientColor2: D(n.nameShadowGradientColor2, r.title.shadow.gradientColor2),
				offsetX: O(n.nameShadowOffsetX, r.title.shadow.offsetX),
				offsetY: O(n.nameShadowOffsetY, r.title.shadow.offsetY),
				opacity: O(n.nameShadowOpacity, r.title.shadow.opacity)
			},
			useRarityPreset: k(n.useRarityPreset, r.title.useRarityPreset)
		},
		artwork: {
			source: D(n.image, r.artwork.source),
			fit: A(n.artworkFit, d, r.artwork.fit)
		},
		foreground: {
			enabled: !!a,
			source: a,
			width: O(n.foregroundWidth, r.foreground.width),
			height: O(n.foregroundHeight, r.foreground.height),
			x: O(n.foregroundX, r.foreground.x),
			y: O(n.foregroundY, r.foreground.y),
			scale: O(n.foregroundScale, r.foreground.scale),
			rotation: O(n.foregroundRotation, r.foreground.rotation),
			coverLevel: k(n.foregroundCoverLevel, r.foreground.coverLevel),
			coverAttribute: k(n.foregroundCoverAttribute, r.foreground.coverAttribute),
			clipBelowEffectBox: k(n.foregroundClipBelowEffectBox, r.foreground.clipBelowEffectBox)
		},
		rarityMask: {
			source: f,
			width: O(n.rarityMaskWidth, r.rarityMask.width),
			height: O(n.rarityMaskHeight, r.rarityMask.height),
			x: O(n.rarityMaskX, r.rarityMask.x),
			y: O(n.rarityMaskY, r.rarityMask.y),
			scale: O(n.rarityMaskScale, r.rarityMask.scale),
			maskEffectBox: k(n.rarityMaskEffectBox, r.rarityMask.maskEffectBox),
			maskArtwork: k(n.rarityMaskArtwork, r.rarityMask.maskArtwork),
			coverName: k(n.rarityMaskCoverName, r.rarityMask.coverName),
			coverAttribute: k(n.rarityMaskCoverAttribute, r.rarityMask.coverAttribute),
			coverLevel: k(n.rarityMaskCoverLevel, r.rarityMask.coverLevel)
		},
		effectBox: {
			enabled: k(n.effectBlockEnabled, r.effectBox.enabled),
			x: O(n.effectBlockX, r.effectBox.x),
			y: O(n.effectBlockY, r.effectBox.y),
			width: O(n.effectBlockWidth, r.effectBox.width),
			height: O(n.effectBlockHeight, r.effectBox.height),
			color: D(n.effectBlockColor, r.effectBox.color),
			opacity: O(n.effectBlockOpacity, r.effectBox.opacity),
			borderStyle: j(n, r.effectBox.borderStyle)
		},
		text: {
			pendulumDescription: D(n.pendulumDescription, r.text.pendulumDescription),
			monsterType: D(n.monsterType, r.text.monsterType),
			description: D(n.description, r.text.description),
			firstLineCompress: k(n.firstLineCompress, r.text.firstLineCompress),
			descriptionAlign: k(n.descriptionAlign, r.text.descriptionAlign),
			descriptionZoom: O(n.descriptionZoom, r.text.descriptionZoom),
			descriptionWeight: O(n.descriptionWeight, r.text.descriptionWeight),
			showAtkBar: k(n.atkBar, r.text.showAtkBar),
			atk: O(n.atk, r.text.atk),
			def: O(n.def, r.text.def)
		},
		footer: {
			package: D(n.package, r.footer.package),
			password: D(n.password, r.footer.password),
			copyright: D(n.copyright, r.footer.copyright),
			laser: D(n.laser, r.footer.laser),
			rare: D(n.rare, r.footer.rare),
			rarityEffect: A(n.rarityEffect, t, r.footer.rarityEffect),
			twentieth: k(n.twentieth, r.footer.twentieth),
			mark25th: k(n.mark25th ?? n.twentyFifth, r.footer.mark25th)
		},
		render: {
			radius: k(n.radius, r.render.radius),
			scale: O(n.scale, r.render.scale)
		}
	});
}
function N(e) {
	let t = E(e);
	return {
		language: t.frame.language,
		font: t.frame.font,
		name: t.title.text,
		color: t.title.fill.color,
		align: t.title.align,
		gradient: t.title.fill.gradient,
		gradientStroke: t.title.fill.gradientStroke,
		gradientColor1: t.title.fill.gradientColor1,
		gradientColor2: t.title.fill.gradientColor2,
		nameShadowColor: t.title.shadow.color,
		nameShadowGradient: t.title.shadow.gradient,
		nameShadowGradientColor1: t.title.shadow.gradientColor1,
		nameShadowGradientColor2: t.title.shadow.gradientColor2,
		nameShadowOffsetX: t.title.shadow.offsetX,
		nameShadowOffsetY: t.title.shadow.offsetY,
		nameShadowOpacity: t.title.shadow.opacity,
		useRarityPreset: t.title.useRarityPreset,
		type: t.frame.type,
		attribute: t.frame.attribute,
		icon: t.frame.icon,
		image: t.artwork.source,
		artworkFit: t.artwork.fit,
		cardType: t.frame.cardType,
		pendulumType: t.frame.pendulumType,
		level: t.frame.level,
		rank: t.frame.rank,
		pendulumScale: t.frame.pendulumScale,
		nameBlock: t.frame.nameBlock,
		cardBorderStyle: t.frame.cardBorderStyle,
		artBorderStyle: t.frame.artBorderStyle,
		effectBorderStyle: t.frame.effectBorderStyle,
		outFrameNameBlock: t.frame.nameBlock,
		outFrameNameBlockEnabled: t.frame.nameBlock,
		pendulumDescription: t.text.pendulumDescription,
		monsterType: t.text.monsterType,
		atkBar: t.text.showAtkBar,
		atk: t.text.atk,
		def: t.text.def,
		arrowList: [...t.frame.arrows],
		description: t.text.description,
		firstLineCompress: t.text.firstLineCompress,
		descriptionAlign: t.text.descriptionAlign,
		descriptionZoom: t.text.descriptionZoom,
		descriptionWeight: t.text.descriptionWeight,
		package: t.footer.package,
		password: t.footer.password,
		copyright: t.footer.copyright,
		laser: t.footer.laser,
		rare: t.footer.rare,
		rarityEffect: t.footer.rarityEffect,
		twentieth: t.footer.twentieth,
		mark25th: t.footer.mark25th,
		twentyFifth: t.footer.mark25th,
		radius: t.render.radius,
		scale: t.render.scale,
		foregroundImage: t.foreground.source,
		foregroundWidth: t.foreground.width,
		foregroundHeight: t.foreground.height,
		foregroundX: t.foreground.x,
		foregroundY: t.foreground.y,
		foregroundScale: t.foreground.scale,
		foregroundRotation: t.foreground.rotation,
		foregroundCoverLevel: t.foreground.coverLevel,
		foregroundCoverAttribute: t.foreground.coverAttribute,
		foregroundClipBelowEffectBox: t.foreground.clipBelowEffectBox,
		rarityMaskImage: t.rarityMask.source,
		rarityMaskWidth: t.rarityMask.width,
		rarityMaskHeight: t.rarityMask.height,
		rarityMaskX: t.rarityMask.x,
		rarityMaskY: t.rarityMask.y,
		rarityMaskScale: t.rarityMask.scale,
		rarityMaskEffectBox: t.rarityMask.maskEffectBox,
		rarityMaskArtwork: t.rarityMask.maskArtwork,
		rarityMaskCoverName: t.rarityMask.coverName,
		rarityMaskCoverAttribute: t.rarityMask.coverAttribute,
		rarityMaskCoverLevel: t.rarityMask.coverLevel,
		effectBlockEnabled: t.effectBox.enabled,
		effectBlockX: t.effectBox.x,
		effectBlockY: t.effectBox.y,
		effectBlockWidth: t.effectBox.width,
		effectBlockHeight: t.effectBox.height,
		effectBlockColor: t.effectBox.color,
		effectBlockOpacity: t.effectBox.opacity,
		effectBlockBorder: t.effectBox.borderStyle !== "none",
		effectBlockBorderStyle: t.effectBox.borderStyle
	};
}
//#endregion
export { d as YUGIOH_ARTWORK_FITS, i as YUGIOH_CARD_DOCUMENT_KIND, a as YUGIOH_CARD_DOCUMENT_VERSION, o as YUGIOH_CARD_LANGUAGES, s as YUGIOH_CARD_TYPES, f as YUGIOH_EFFECT_BOX_BORDER_STYLES, e as YUGIOH_FRAME_STYLES, p as YUGIOH_LAYER_SLOTS, c as YUGIOH_MONSTER_CARD_TYPES, l as YUGIOH_PENDULUM_CARD_TYPES, t as YUGIOH_RARITY_EFFECTS, u as YUGIOH_TITLE_ALIGNS, m as YugiohCardDocumentError, _ as createYugiohCardDocument, n as getRarityFramePreset, M as legacyDataToYugiohCardDocument, E as parseYugiohCardDocument, r as resolveRarityEffect, N as yugiohCardDocumentToLegacyData };
