import { YUGIOH_FRAME_STYLES as e } from "./rarity.js";
//#region packages/src/yugioh-card/document.ts
var t = "yugioh-card", n = 1, r = [
	"sc",
	"tc",
	"jp",
	"kr",
	"en",
	"astral",
	"custom1",
	"custom2"
], i = [
	"monster",
	"spell",
	"trap",
	"pendulum"
], a = [
	"normal",
	"effect",
	"ritual",
	"fusion",
	"synchro",
	"xyz",
	"link",
	"token"
], o = [
	"normal-pendulum",
	"effect-pendulum",
	"ritual-pendulum",
	"fusion-pendulum",
	"synchro-pendulum",
	"xyz-pendulum",
	"link-pendulum"
], s = [
	"left",
	"center",
	"right"
], c = [
	"cover",
	"contain",
	"stretch"
], l = [
	"none",
	"default",
	"colored"
], u = [
	"before-frame",
	"after-artwork",
	"before-text",
	"after-text",
	"top"
], d = class extends Error {
	path;
	constructor(e, t = "") {
		super(t ? `${t}: ${e}` : e), this.name = "YugiohCardDocumentError", this.path = t;
	}
}, f = {
	kind: t,
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
		twentieth: !1,
		mark25th: !1
	},
	render: {
		radius: !0,
		scale: 1
	}
};
function p(e) {
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
function m(e = {}) {
	let n = p(f);
	return {
		...n,
		...e,
		kind: t,
		version: 1,
		frame: {
			...n.frame,
			...e.frame,
			arrows: [...e.frame?.arrows ?? n.frame.arrows]
		},
		title: {
			...n.title,
			...e.title,
			fill: {
				...n.title.fill,
				...e.title?.fill
			},
			shadow: {
				...n.title.shadow,
				...e.title?.shadow
			}
		},
		artwork: {
			...n.artwork,
			...e.artwork
		},
		foreground: {
			...n.foreground,
			...e.foreground
		},
		rarityMask: {
			...n.rarityMask,
			...e.rarityMask
		},
		effectBox: {
			...n.effectBox,
			...e.effectBox
		},
		text: {
			...n.text,
			...e.text
		},
		footer: {
			...n.footer,
			...e.footer
		},
		render: {
			...n.render,
			...e.render
		}
	};
}
function h(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function g(e, t) {
	let n = e[t];
	if (!h(n)) throw new d("expected an object", t);
	return n;
}
function _(e, t, n) {
	if (typeof e != "string" || !t.includes(e)) throw new d(`expected one of ${t.join(", ")}`, n);
	return e;
}
function v(e, t) {
	if (typeof e != "string") throw new d("expected a string", t);
	return e;
}
function y(e, t) {
	if (typeof e != "number" || !Number.isFinite(e)) throw new d("expected a finite number", t);
	return e;
}
function b(e, t) {
	if (typeof e != "boolean") throw new d("expected a boolean", t);
	return e;
}
function x(e, t, n, r) {
	return e === void 0 ? n : _(e, t, r);
}
function S(e, t, n) {
	return e === void 0 ? t : b(e, n);
}
function C(n) {
	if (!h(n)) throw new d("expected an object");
	if (n.kind !== "yugioh-card") throw new d(`expected ${t}`, "kind");
	if (n.version !== 1) throw new d(`unsupported version ${String(n.version)}`, "version");
	let u = g(n, "frame"), p = g(n, "title"), m = g(p, "fill"), C = g(p, "shadow"), w = g(n, "artwork"), T = g(n, "foreground"), E = n.rarityMask === void 0 ? f.rarityMask : g(n, "rarityMask"), D = g(n, "effectBox"), O = g(n, "text"), k = g(n, "footer"), A = g(n, "render"), j = u.arrows;
	if (!Array.isArray(j) || j.some((e) => !Number.isInteger(e) || e < 1 || e > 8)) throw new d("expected integers from 1 to 8", "frame.arrows");
	return {
		kind: t,
		version: 1,
		frame: {
			language: _(u.language, r, "frame.language"),
			font: _(u.font, [
				"",
				"custom1",
				"custom2"
			], "frame.font"),
			type: _(u.type, i, "frame.type"),
			attribute: v(u.attribute, "frame.attribute"),
			icon: v(u.icon, "frame.icon"),
			cardType: _(u.cardType, a, "frame.cardType"),
			pendulumType: _(u.pendulumType, o, "frame.pendulumType"),
			level: y(u.level, "frame.level"),
			rank: y(u.rank, "frame.rank"),
			pendulumScale: y(u.pendulumScale, "frame.pendulumScale"),
			arrows: [...j],
			nameBlock: S(u.nameBlock, !1, "frame.nameBlock"),
			cardBorderStyle: _(u.cardBorderStyle ?? "auto", e, "frame.cardBorderStyle"),
			artBorderStyle: _(u.artBorderStyle ?? "auto", e, "frame.artBorderStyle"),
			effectBorderStyle: _(u.effectBorderStyle ?? "auto", e, "frame.effectBorderStyle")
		},
		title: {
			text: v(p.text, "title.text"),
			align: _(p.align, s, "title.align"),
			fill: {
				color: v(m.color, "title.fill.color"),
				gradient: b(m.gradient, "title.fill.gradient"),
				gradientStroke: S(m.gradientStroke, !0, "title.fill.gradientStroke"),
				gradientColor1: v(m.gradientColor1, "title.fill.gradientColor1"),
				gradientColor2: v(m.gradientColor2, "title.fill.gradientColor2")
			},
			shadow: {
				enabled: b(C.enabled, "title.shadow.enabled"),
				color: v(C.color, "title.shadow.color"),
				gradient: b(C.gradient, "title.shadow.gradient"),
				gradientColor1: v(C.gradientColor1, "title.shadow.gradientColor1"),
				gradientColor2: v(C.gradientColor2, "title.shadow.gradientColor2"),
				offsetX: y(C.offsetX, "title.shadow.offsetX"),
				offsetY: y(C.offsetY, "title.shadow.offsetY"),
				opacity: y(C.opacity, "title.shadow.opacity")
			},
			useRarityPreset: b(p.useRarityPreset, "title.useRarityPreset")
		},
		artwork: {
			source: v(w.source, "artwork.source"),
			fit: _(w.fit, c, "artwork.fit")
		},
		foreground: {
			enabled: b(T.enabled, "foreground.enabled"),
			source: v(T.source, "foreground.source"),
			width: y(T.width, "foreground.width"),
			height: y(T.height, "foreground.height"),
			x: y(T.x, "foreground.x"),
			y: y(T.y, "foreground.y"),
			scale: y(T.scale, "foreground.scale"),
			rotation: y(T.rotation, "foreground.rotation"),
			coverLevel: S(T.coverLevel, !0, "foreground.coverLevel"),
			coverAttribute: S(T.coverAttribute, !0, "foreground.coverAttribute"),
			clipBelowEffectBox: S(T.clipBelowEffectBox, !1, "foreground.clipBelowEffectBox")
		},
		rarityMask: {
			source: v(E.source, "rarityMask.source"),
			width: y(E.width, "rarityMask.width"),
			height: y(E.height, "rarityMask.height"),
			x: y(E.x, "rarityMask.x"),
			y: y(E.y, "rarityMask.y"),
			scale: y(E.scale, "rarityMask.scale"),
			maskEffectBox: S(E.maskEffectBox, !0, "rarityMask.maskEffectBox"),
			maskArtwork: S(E.maskArtwork, !1, "rarityMask.maskArtwork"),
			coverName: S(E.coverName, !1, "rarityMask.coverName"),
			coverAttribute: S(E.coverAttribute, !1, "rarityMask.coverAttribute"),
			coverLevel: S(E.coverLevel, !1, "rarityMask.coverLevel")
		},
		effectBox: {
			enabled: b(D.enabled, "effectBox.enabled"),
			x: y(D.x, "effectBox.x"),
			y: y(D.y, "effectBox.y"),
			width: y(D.width, "effectBox.width"),
			height: y(D.height, "effectBox.height"),
			color: v(D.color, "effectBox.color"),
			opacity: y(D.opacity, "effectBox.opacity"),
			borderStyle: x(D.borderStyle, l, "none", "effectBox.borderStyle")
		},
		text: {
			pendulumDescription: v(O.pendulumDescription, "text.pendulumDescription"),
			monsterType: v(O.monsterType, "text.monsterType"),
			description: v(O.description, "text.description"),
			firstLineCompress: b(O.firstLineCompress, "text.firstLineCompress"),
			descriptionAlign: b(O.descriptionAlign, "text.descriptionAlign"),
			descriptionZoom: y(O.descriptionZoom, "text.descriptionZoom"),
			descriptionWeight: y(O.descriptionWeight, "text.descriptionWeight"),
			showAtkBar: b(O.showAtkBar, "text.showAtkBar"),
			atk: y(O.atk, "text.atk"),
			def: y(O.def, "text.def")
		},
		footer: {
			package: v(k.package, "footer.package"),
			password: v(k.password, "footer.password"),
			copyright: v(k.copyright, "footer.copyright"),
			laser: v(k.laser, "footer.laser"),
			rare: v(k.rare, "footer.rare"),
			twentieth: b(k.twentieth, "footer.twentieth"),
			mark25th: S(k.mark25th, !1, "footer.mark25th")
		},
		render: {
			radius: b(A.radius, "render.radius"),
			scale: y(A.scale, "render.scale")
		}
	};
}
function w(e, t) {
	return typeof e == "string" ? e : t;
}
function T(e, t) {
	return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function E(e, t) {
	return typeof e == "boolean" ? e : t;
}
function D(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function O(e, t) {
	return typeof e.effectBlockBorderStyle == "string" ? e.effectBlockBorderStyle === "o" || e.effectBlockBorderStyle === "alternate" ? "colored" : D(e.effectBlockBorderStyle, l, t) : typeof e.effectBlockBorder == "boolean" ? e.effectBlockBorder ? "default" : "none" : t;
}
function k(t = {}, n = m()) {
	let l = w(t.nameShadowColor, n.title.shadow.color), u = w(t.foregroundImage, n.foreground.source), d = w(t.rarityMaskImage, n.rarityMask.source), f = Array.isArray(t.arrowList) ? t.arrowList.filter((e) => Number.isInteger(e) && e >= 1 && e <= 8) : n.frame.arrows;
	return m({
		frame: {
			language: D(t.language, r, n.frame.language),
			font: D(t.font, [
				"",
				"custom1",
				"custom2"
			], n.frame.font),
			type: D(t.type, i, n.frame.type),
			attribute: w(t.attribute, n.frame.attribute),
			icon: w(t.icon, n.frame.icon),
			cardType: D(t.cardType, a, n.frame.cardType),
			pendulumType: D(t.pendulumType, o, n.frame.pendulumType),
			level: T(t.level, n.frame.level),
			rank: T(t.rank, n.frame.rank),
			pendulumScale: T(t.pendulumScale, n.frame.pendulumScale),
			arrows: f,
			cardBorderStyle: D(t.cardBorderStyle, e, n.frame.cardBorderStyle),
			artBorderStyle: D(t.artBorderStyle, e, n.frame.artBorderStyle),
			effectBorderStyle: D(t.effectBorderStyle, e, n.frame.effectBorderStyle),
			nameBlock: E(t.nameBlock ?? t.outFrameNameBlock ?? t.outFrameNameBlockEnabled, n.frame.nameBlock)
		},
		title: {
			text: w(t.name, n.title.text),
			align: D(t.align, s, n.title.align),
			fill: {
				color: w(t.color, n.title.fill.color),
				gradient: E(t.gradient, n.title.fill.gradient),
				gradientStroke: E(t.gradientStroke, n.title.fill.gradientStroke),
				gradientColor1: w(t.gradientColor1, n.title.fill.gradientColor1),
				gradientColor2: w(t.gradientColor2, n.title.fill.gradientColor2)
			},
			shadow: {
				enabled: !!(l || t.nameShadowGradient || n.title.shadow.enabled),
				color: l,
				gradient: E(t.nameShadowGradient, n.title.shadow.gradient),
				gradientColor1: w(t.nameShadowGradientColor1, n.title.shadow.gradientColor1),
				gradientColor2: w(t.nameShadowGradientColor2, n.title.shadow.gradientColor2),
				offsetX: T(t.nameShadowOffsetX, n.title.shadow.offsetX),
				offsetY: T(t.nameShadowOffsetY, n.title.shadow.offsetY),
				opacity: T(t.nameShadowOpacity, n.title.shadow.opacity)
			},
			useRarityPreset: E(t.useRarityPreset, n.title.useRarityPreset)
		},
		artwork: {
			source: w(t.image, n.artwork.source),
			fit: D(t.artworkFit, c, n.artwork.fit)
		},
		foreground: {
			enabled: !!u,
			source: u,
			width: T(t.foregroundWidth, n.foreground.width),
			height: T(t.foregroundHeight, n.foreground.height),
			x: T(t.foregroundX, n.foreground.x),
			y: T(t.foregroundY, n.foreground.y),
			scale: T(t.foregroundScale, n.foreground.scale),
			rotation: T(t.foregroundRotation, n.foreground.rotation),
			coverLevel: E(t.foregroundCoverLevel, n.foreground.coverLevel),
			coverAttribute: E(t.foregroundCoverAttribute, n.foreground.coverAttribute),
			clipBelowEffectBox: E(t.foregroundClipBelowEffectBox, n.foreground.clipBelowEffectBox)
		},
		rarityMask: {
			source: d,
			width: T(t.rarityMaskWidth, n.rarityMask.width),
			height: T(t.rarityMaskHeight, n.rarityMask.height),
			x: T(t.rarityMaskX, n.rarityMask.x),
			y: T(t.rarityMaskY, n.rarityMask.y),
			scale: T(t.rarityMaskScale, n.rarityMask.scale),
			maskEffectBox: E(t.rarityMaskEffectBox, n.rarityMask.maskEffectBox),
			maskArtwork: E(t.rarityMaskArtwork, n.rarityMask.maskArtwork),
			coverName: E(t.rarityMaskCoverName, n.rarityMask.coverName),
			coverAttribute: E(t.rarityMaskCoverAttribute, n.rarityMask.coverAttribute),
			coverLevel: E(t.rarityMaskCoverLevel, n.rarityMask.coverLevel)
		},
		effectBox: {
			enabled: E(t.effectBlockEnabled, n.effectBox.enabled),
			x: T(t.effectBlockX, n.effectBox.x),
			y: T(t.effectBlockY, n.effectBox.y),
			width: T(t.effectBlockWidth, n.effectBox.width),
			height: T(t.effectBlockHeight, n.effectBox.height),
			color: w(t.effectBlockColor, n.effectBox.color),
			opacity: T(t.effectBlockOpacity, n.effectBox.opacity),
			borderStyle: O(t, n.effectBox.borderStyle)
		},
		text: {
			pendulumDescription: w(t.pendulumDescription, n.text.pendulumDescription),
			monsterType: w(t.monsterType, n.text.monsterType),
			description: w(t.description, n.text.description),
			firstLineCompress: E(t.firstLineCompress, n.text.firstLineCompress),
			descriptionAlign: E(t.descriptionAlign, n.text.descriptionAlign),
			descriptionZoom: T(t.descriptionZoom, n.text.descriptionZoom),
			descriptionWeight: T(t.descriptionWeight, n.text.descriptionWeight),
			showAtkBar: E(t.atkBar, n.text.showAtkBar),
			atk: T(t.atk, n.text.atk),
			def: T(t.def, n.text.def)
		},
		footer: {
			package: w(t.package, n.footer.package),
			password: w(t.password, n.footer.password),
			copyright: w(t.copyright, n.footer.copyright),
			laser: w(t.laser, n.footer.laser),
			rare: w(t.rare, n.footer.rare),
			twentieth: E(t.twentieth, n.footer.twentieth),
			mark25th: E(t.mark25th ?? t.twentyFifth, n.footer.mark25th)
		},
		render: {
			radius: E(t.radius, n.render.radius),
			scale: T(t.scale, n.render.scale)
		}
	});
}
function A(e) {
	let t = C(e);
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
export { c as YUGIOH_ARTWORK_FITS, t as YUGIOH_CARD_DOCUMENT_KIND, n as YUGIOH_CARD_DOCUMENT_VERSION, r as YUGIOH_CARD_LANGUAGES, i as YUGIOH_CARD_TYPES, l as YUGIOH_EFFECT_BOX_BORDER_STYLES, u as YUGIOH_LAYER_SLOTS, a as YUGIOH_MONSTER_CARD_TYPES, o as YUGIOH_PENDULUM_CARD_TYPES, s as YUGIOH_TITLE_ALIGNS, d as YugiohCardDocumentError, m as createYugiohCardDocument, k as legacyDataToYugiohCardDocument, C as parseYugiohCardDocument, A as yugiohCardDocumentToLegacyData };
