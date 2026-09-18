import { YUGIOH_FRAME_STYLES as e, getRarityFramePreset as t } from "./rarity.js";
//#region packages/src/yugioh-card/document.ts
var n = "yugioh-card", r = 1, i = [
	"sc",
	"tc",
	"jp",
	"kr",
	"en",
	"astral",
	"custom1",
	"custom2"
], a = [
	"monster",
	"spell",
	"trap",
	"pendulum"
], o = [
	"normal",
	"effect",
	"ritual",
	"fusion",
	"synchro",
	"xyz",
	"link",
	"token"
], s = [
	"normal-pendulum",
	"effect-pendulum",
	"ritual-pendulum",
	"fusion-pendulum",
	"synchro-pendulum",
	"xyz-pendulum",
	"link-pendulum"
], c = [
	"left",
	"center",
	"right"
], l = [
	"cover",
	"contain",
	"stretch"
], u = [
	"none",
	"default",
	"colored"
], d = [
	"before-frame",
	"after-artwork",
	"before-text",
	"after-text",
	"top"
], f = class extends Error {
	path;
	constructor(e, t = "") {
		super(t ? `${t}: ${e}` : e), this.name = "YugiohCardDocumentError", this.path = t;
	}
}, p = {
	kind: n,
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
function m(e) {
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
function h(e = {}) {
	let t = m(p);
	return {
		...t,
		...e,
		kind: n,
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
function g(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function _(e, t) {
	let n = e[t];
	if (!g(n)) throw new f("expected an object", t);
	return n;
}
function v(e, t, n) {
	if (typeof e != "string" || !t.includes(e)) throw new f(`expected one of ${t.join(", ")}`, n);
	return e;
}
function y(e, t) {
	if (typeof e != "string") throw new f("expected a string", t);
	return e;
}
function b(e, t) {
	if (typeof e != "number" || !Number.isFinite(e)) throw new f("expected a finite number", t);
	return e;
}
function x(e, t) {
	if (typeof e != "boolean") throw new f("expected a boolean", t);
	return e;
}
function S(e, t, n, r) {
	return e === void 0 ? n : v(e, t, r);
}
function C(e, t, n) {
	return e === void 0 ? t : x(e, n);
}
function w(t) {
	if (!g(t)) throw new f("expected an object");
	if (t.kind !== "yugioh-card") throw new f(`expected ${n}`, "kind");
	if (t.version !== 1) throw new f(`unsupported version ${String(t.version)}`, "version");
	let r = _(t, "frame"), d = _(t, "title"), m = _(d, "fill"), h = _(d, "shadow"), w = _(t, "artwork"), T = _(t, "foreground"), E = t.rarityMask === void 0 ? p.rarityMask : _(t, "rarityMask"), D = _(t, "effectBox"), O = _(t, "text"), k = _(t, "footer"), A = _(t, "render"), j = r.arrows;
	if (!Array.isArray(j) || j.some((e) => !Number.isInteger(e) || e < 1 || e > 8)) throw new f("expected integers from 1 to 8", "frame.arrows");
	return {
		kind: n,
		version: 1,
		frame: {
			language: v(r.language, i, "frame.language"),
			font: v(r.font, [
				"",
				"custom1",
				"custom2"
			], "frame.font"),
			type: v(r.type, a, "frame.type"),
			attribute: y(r.attribute, "frame.attribute"),
			icon: y(r.icon, "frame.icon"),
			cardType: v(r.cardType, o, "frame.cardType"),
			pendulumType: v(r.pendulumType, s, "frame.pendulumType"),
			level: b(r.level, "frame.level"),
			rank: b(r.rank, "frame.rank"),
			pendulumScale: b(r.pendulumScale, "frame.pendulumScale"),
			arrows: [...j],
			nameBlock: C(r.nameBlock, !1, "frame.nameBlock"),
			cardBorderStyle: v(r.cardBorderStyle ?? "auto", e, "frame.cardBorderStyle"),
			artBorderStyle: v(r.artBorderStyle ?? "auto", e, "frame.artBorderStyle"),
			effectBorderStyle: v(r.effectBorderStyle ?? "auto", e, "frame.effectBorderStyle")
		},
		title: {
			text: y(d.text, "title.text"),
			align: v(d.align, c, "title.align"),
			fill: {
				color: y(m.color, "title.fill.color"),
				gradient: x(m.gradient, "title.fill.gradient"),
				gradientStroke: C(m.gradientStroke, !0, "title.fill.gradientStroke"),
				gradientColor1: y(m.gradientColor1, "title.fill.gradientColor1"),
				gradientColor2: y(m.gradientColor2, "title.fill.gradientColor2")
			},
			shadow: {
				enabled: x(h.enabled, "title.shadow.enabled"),
				color: y(h.color, "title.shadow.color"),
				gradient: x(h.gradient, "title.shadow.gradient"),
				gradientColor1: y(h.gradientColor1, "title.shadow.gradientColor1"),
				gradientColor2: y(h.gradientColor2, "title.shadow.gradientColor2"),
				offsetX: b(h.offsetX, "title.shadow.offsetX"),
				offsetY: b(h.offsetY, "title.shadow.offsetY"),
				opacity: b(h.opacity, "title.shadow.opacity")
			},
			useRarityPreset: x(d.useRarityPreset, "title.useRarityPreset")
		},
		artwork: {
			source: y(w.source, "artwork.source"),
			fit: v(w.fit, l, "artwork.fit")
		},
		foreground: {
			enabled: x(T.enabled, "foreground.enabled"),
			source: y(T.source, "foreground.source"),
			width: b(T.width, "foreground.width"),
			height: b(T.height, "foreground.height"),
			x: b(T.x, "foreground.x"),
			y: b(T.y, "foreground.y"),
			scale: b(T.scale, "foreground.scale"),
			rotation: b(T.rotation, "foreground.rotation"),
			coverLevel: C(T.coverLevel, !0, "foreground.coverLevel"),
			coverAttribute: C(T.coverAttribute, !0, "foreground.coverAttribute"),
			clipBelowEffectBox: C(T.clipBelowEffectBox, !1, "foreground.clipBelowEffectBox")
		},
		rarityMask: {
			source: y(E.source, "rarityMask.source"),
			width: b(E.width, "rarityMask.width"),
			height: b(E.height, "rarityMask.height"),
			x: b(E.x, "rarityMask.x"),
			y: b(E.y, "rarityMask.y"),
			scale: b(E.scale, "rarityMask.scale"),
			maskEffectBox: C(E.maskEffectBox, !0, "rarityMask.maskEffectBox"),
			maskArtwork: C(E.maskArtwork, !1, "rarityMask.maskArtwork"),
			coverName: C(E.coverName, !1, "rarityMask.coverName"),
			coverAttribute: C(E.coverAttribute, !1, "rarityMask.coverAttribute"),
			coverLevel: C(E.coverLevel, !1, "rarityMask.coverLevel")
		},
		effectBox: {
			enabled: x(D.enabled, "effectBox.enabled"),
			x: b(D.x, "effectBox.x"),
			y: b(D.y, "effectBox.y"),
			width: b(D.width, "effectBox.width"),
			height: b(D.height, "effectBox.height"),
			color: y(D.color, "effectBox.color"),
			opacity: b(D.opacity, "effectBox.opacity"),
			borderStyle: S(D.borderStyle, u, "none", "effectBox.borderStyle")
		},
		text: {
			pendulumDescription: y(O.pendulumDescription, "text.pendulumDescription"),
			monsterType: y(O.monsterType, "text.monsterType"),
			description: y(O.description, "text.description"),
			firstLineCompress: x(O.firstLineCompress, "text.firstLineCompress"),
			descriptionAlign: x(O.descriptionAlign, "text.descriptionAlign"),
			descriptionZoom: b(O.descriptionZoom, "text.descriptionZoom"),
			descriptionWeight: b(O.descriptionWeight, "text.descriptionWeight"),
			showAtkBar: x(O.showAtkBar, "text.showAtkBar"),
			atk: b(O.atk, "text.atk"),
			def: b(O.def, "text.def")
		},
		footer: {
			package: y(k.package, "footer.package"),
			password: y(k.password, "footer.password"),
			copyright: y(k.copyright, "footer.copyright"),
			laser: y(k.laser, "footer.laser"),
			rare: y(k.rare, "footer.rare"),
			twentieth: x(k.twentieth, "footer.twentieth"),
			mark25th: C(k.mark25th, !1, "footer.mark25th")
		},
		render: {
			radius: x(A.radius, "render.radius"),
			scale: b(A.scale, "render.scale")
		}
	};
}
function T(e, t) {
	return typeof e == "string" ? e : t;
}
function E(e, t) {
	return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function D(e, t) {
	return typeof e == "boolean" ? e : t;
}
function O(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function k(e, t) {
	return typeof e.effectBlockBorderStyle == "string" ? e.effectBlockBorderStyle === "o" || e.effectBlockBorderStyle === "alternate" ? "colored" : O(e.effectBlockBorderStyle, u, t) : typeof e.effectBlockBorder == "boolean" ? e.effectBlockBorder ? "default" : "none" : t;
}
function A(t = {}, n = h()) {
	let r = T(t.nameShadowColor, n.title.shadow.color), u = T(t.foregroundImage, n.foreground.source), d = T(t.rarityMaskImage, n.rarityMask.source), f = Array.isArray(t.arrowList) ? t.arrowList.filter((e) => Number.isInteger(e) && e >= 1 && e <= 8) : n.frame.arrows;
	return h({
		frame: {
			language: O(t.language, i, n.frame.language),
			font: O(t.font, [
				"",
				"custom1",
				"custom2"
			], n.frame.font),
			type: O(t.type, a, n.frame.type),
			attribute: T(t.attribute, n.frame.attribute),
			icon: T(t.icon, n.frame.icon),
			cardType: O(t.cardType, o, n.frame.cardType),
			pendulumType: O(t.pendulumType, s, n.frame.pendulumType),
			level: E(t.level, n.frame.level),
			rank: E(t.rank, n.frame.rank),
			pendulumScale: E(t.pendulumScale, n.frame.pendulumScale),
			arrows: f,
			cardBorderStyle: O(t.cardBorderStyle, e, n.frame.cardBorderStyle),
			artBorderStyle: O(t.artBorderStyle, e, n.frame.artBorderStyle),
			effectBorderStyle: O(t.effectBorderStyle, e, n.frame.effectBorderStyle),
			nameBlock: D(t.nameBlock ?? t.outFrameNameBlock ?? t.outFrameNameBlockEnabled, n.frame.nameBlock)
		},
		title: {
			text: T(t.name, n.title.text),
			align: O(t.align, c, n.title.align),
			fill: {
				color: T(t.color, n.title.fill.color),
				gradient: D(t.gradient, n.title.fill.gradient),
				gradientStroke: D(t.gradientStroke, n.title.fill.gradientStroke),
				gradientColor1: T(t.gradientColor1, n.title.fill.gradientColor1),
				gradientColor2: T(t.gradientColor2, n.title.fill.gradientColor2)
			},
			shadow: {
				enabled: !!(r || t.nameShadowGradient || n.title.shadow.enabled),
				color: r,
				gradient: D(t.nameShadowGradient, n.title.shadow.gradient),
				gradientColor1: T(t.nameShadowGradientColor1, n.title.shadow.gradientColor1),
				gradientColor2: T(t.nameShadowGradientColor2, n.title.shadow.gradientColor2),
				offsetX: E(t.nameShadowOffsetX, n.title.shadow.offsetX),
				offsetY: E(t.nameShadowOffsetY, n.title.shadow.offsetY),
				opacity: E(t.nameShadowOpacity, n.title.shadow.opacity)
			},
			useRarityPreset: D(t.useRarityPreset, n.title.useRarityPreset)
		},
		artwork: {
			source: T(t.image, n.artwork.source),
			fit: O(t.artworkFit, l, n.artwork.fit)
		},
		foreground: {
			enabled: !!u,
			source: u,
			width: E(t.foregroundWidth, n.foreground.width),
			height: E(t.foregroundHeight, n.foreground.height),
			x: E(t.foregroundX, n.foreground.x),
			y: E(t.foregroundY, n.foreground.y),
			scale: E(t.foregroundScale, n.foreground.scale),
			rotation: E(t.foregroundRotation, n.foreground.rotation),
			coverLevel: D(t.foregroundCoverLevel, n.foreground.coverLevel),
			coverAttribute: D(t.foregroundCoverAttribute, n.foreground.coverAttribute),
			clipBelowEffectBox: D(t.foregroundClipBelowEffectBox, n.foreground.clipBelowEffectBox)
		},
		rarityMask: {
			source: d,
			width: E(t.rarityMaskWidth, n.rarityMask.width),
			height: E(t.rarityMaskHeight, n.rarityMask.height),
			x: E(t.rarityMaskX, n.rarityMask.x),
			y: E(t.rarityMaskY, n.rarityMask.y),
			scale: E(t.rarityMaskScale, n.rarityMask.scale),
			maskEffectBox: D(t.rarityMaskEffectBox, n.rarityMask.maskEffectBox),
			maskArtwork: D(t.rarityMaskArtwork, n.rarityMask.maskArtwork),
			coverName: D(t.rarityMaskCoverName, n.rarityMask.coverName),
			coverAttribute: D(t.rarityMaskCoverAttribute, n.rarityMask.coverAttribute),
			coverLevel: D(t.rarityMaskCoverLevel, n.rarityMask.coverLevel)
		},
		effectBox: {
			enabled: D(t.effectBlockEnabled, n.effectBox.enabled),
			x: E(t.effectBlockX, n.effectBox.x),
			y: E(t.effectBlockY, n.effectBox.y),
			width: E(t.effectBlockWidth, n.effectBox.width),
			height: E(t.effectBlockHeight, n.effectBox.height),
			color: T(t.effectBlockColor, n.effectBox.color),
			opacity: E(t.effectBlockOpacity, n.effectBox.opacity),
			borderStyle: k(t, n.effectBox.borderStyle)
		},
		text: {
			pendulumDescription: T(t.pendulumDescription, n.text.pendulumDescription),
			monsterType: T(t.monsterType, n.text.monsterType),
			description: T(t.description, n.text.description),
			firstLineCompress: D(t.firstLineCompress, n.text.firstLineCompress),
			descriptionAlign: D(t.descriptionAlign, n.text.descriptionAlign),
			descriptionZoom: E(t.descriptionZoom, n.text.descriptionZoom),
			descriptionWeight: E(t.descriptionWeight, n.text.descriptionWeight),
			showAtkBar: D(t.atkBar, n.text.showAtkBar),
			atk: E(t.atk, n.text.atk),
			def: E(t.def, n.text.def)
		},
		footer: {
			package: T(t.package, n.footer.package),
			password: T(t.password, n.footer.password),
			copyright: T(t.copyright, n.footer.copyright),
			laser: T(t.laser, n.footer.laser),
			rare: T(t.rare, n.footer.rare),
			twentieth: D(t.twentieth, n.footer.twentieth),
			mark25th: D(t.mark25th ?? t.twentyFifth, n.footer.mark25th)
		},
		render: {
			radius: D(t.radius, n.render.radius),
			scale: E(t.scale, n.render.scale)
		}
	});
}
function j(e) {
	let t = w(e);
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
export { l as YUGIOH_ARTWORK_FITS, n as YUGIOH_CARD_DOCUMENT_KIND, r as YUGIOH_CARD_DOCUMENT_VERSION, i as YUGIOH_CARD_LANGUAGES, a as YUGIOH_CARD_TYPES, u as YUGIOH_EFFECT_BOX_BORDER_STYLES, e as YUGIOH_FRAME_STYLES, d as YUGIOH_LAYER_SLOTS, o as YUGIOH_MONSTER_CARD_TYPES, s as YUGIOH_PENDULUM_CARD_TYPES, c as YUGIOH_TITLE_ALIGNS, f as YugiohCardDocumentError, h as createYugiohCardDocument, t as getRarityFramePreset, A as legacyDataToYugiohCardDocument, w as parseYugiohCardDocument, j as yugiohCardDocumentToLegacyData };
