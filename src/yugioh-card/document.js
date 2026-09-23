import { YUGIOH_FRAME_STYLES as e, YUGIOH_RARITY_EFFECTS as t, getRarityFramePreset as n, resolveRarityEffect as r } from "./rarity.js";
import { YUGIOH_LEVEL_ALIGNS as i, YUGIOH_LEVEL_STYLES as a, resolveFrameOptions as o } from "./frame-options.js";
//#region packages/src/yugioh-card/document.ts
var s = "yugioh-card", c = 1, l = [
	"sc",
	"tc",
	"jp",
	"kr",
	"en",
	"astral",
	"custom1",
	"custom2"
], u = [
	"monster",
	"spell",
	"trap",
	"pendulum"
], d = [
	"normal",
	"effect",
	"ritual",
	"fusion",
	"synchro",
	"xyz",
	"link",
	"token"
], f = [
	"normal-pendulum",
	"effect-pendulum",
	"ritual-pendulum",
	"fusion-pendulum",
	"synchro-pendulum",
	"xyz-pendulum",
	"link-pendulum"
], p = [
	"left",
	"center",
	"right"
], m = [
	"cover",
	"contain",
	"stretch"
], h = [
	"none",
	"default",
	"colored"
], g = [
	"before-frame",
	"after-artwork",
	"before-text",
	"after-text",
	"top"
], _ = class extends Error {
	path;
	constructor(e, t = "") {
		super(t ? `${t}: ${e}` : e), this.name = "YugiohCardDocumentError", this.path = t;
	}
}, v = {
	kind: s,
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
		levelAlign: "auto",
		levelStyle: "auto",
		cardBorderCoverForeground: "auto",
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
function y(e) {
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
function b(e = {}) {
	let t = y(v);
	return {
		...t,
		...e,
		kind: s,
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
function x(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function S(e, t) {
	let n = e[t];
	if (!x(n)) throw new _("expected an object", t);
	return n;
}
function C(e, t, n) {
	if (typeof e != "string" || !t.includes(e)) throw new _(`expected one of ${t.join(", ")}`, n);
	return e;
}
function w(e, t) {
	if (typeof e != "string") throw new _("expected a string", t);
	return e;
}
function T(e, t) {
	if (typeof e != "number" || !Number.isFinite(e)) throw new _("expected a finite number", t);
	return e;
}
function E(e, t) {
	if (typeof e != "boolean") throw new _("expected a boolean", t);
	return e;
}
function D(e, t, n, r) {
	return e === void 0 ? n : C(e, t, r);
}
function O(e, t, n) {
	return e === void 0 ? t : E(e, n);
}
function k(n) {
	if (!x(n)) throw new _("expected an object");
	if (n.kind !== "yugioh-card") throw new _(`expected ${s}`, "kind");
	if (n.version !== 1) throw new _(`unsupported version ${String(n.version)}`, "version");
	let r = S(n, "frame"), o = S(n, "title"), c = S(o, "fill"), g = S(o, "shadow"), y = S(n, "artwork"), b = S(n, "foreground"), k = n.rarityMask === void 0 ? v.rarityMask : S(n, "rarityMask"), A = S(n, "effectBox"), j = S(n, "text"), M = S(n, "footer"), N = S(n, "render"), P = r.arrows;
	if (!Array.isArray(P) || P.some((e) => !Number.isInteger(e) || e < 1 || e > 8)) throw new _("expected integers from 1 to 8", "frame.arrows");
	return {
		kind: s,
		version: 1,
		frame: {
			language: C(r.language, l, "frame.language"),
			font: C(r.font, [
				"",
				"custom1",
				"custom2"
			], "frame.font"),
			type: C(r.type, u, "frame.type"),
			attribute: w(r.attribute, "frame.attribute"),
			icon: w(r.icon, "frame.icon"),
			cardType: C(r.cardType, d, "frame.cardType"),
			pendulumType: C(r.pendulumType, f, "frame.pendulumType"),
			level: T(r.level, "frame.level"),
			rank: T(r.rank, "frame.rank"),
			levelAlign: D(r.levelAlign, i, "auto", "frame.levelAlign"),
			levelStyle: D(r.levelStyle, a, "auto", "frame.levelStyle"),
			cardBorderCoverForeground: r.cardBorderCoverForeground === void 0 || r.cardBorderCoverForeground === "auto" ? "auto" : E(r.cardBorderCoverForeground, "frame.cardBorderCoverForeground"),
			pendulumScale: T(r.pendulumScale, "frame.pendulumScale"),
			arrows: [...P],
			nameBlock: O(r.nameBlock, !1, "frame.nameBlock"),
			cardBorderStyle: C(r.cardBorderStyle ?? "auto", e, "frame.cardBorderStyle"),
			artBorderStyle: C(r.artBorderStyle ?? "auto", e, "frame.artBorderStyle"),
			effectBorderStyle: C(r.effectBorderStyle ?? "auto", e, "frame.effectBorderStyle")
		},
		title: {
			text: w(o.text, "title.text"),
			align: C(o.align, p, "title.align"),
			fill: {
				color: w(c.color, "title.fill.color"),
				gradient: E(c.gradient, "title.fill.gradient"),
				gradientStroke: O(c.gradientStroke, !0, "title.fill.gradientStroke"),
				gradientColor1: w(c.gradientColor1, "title.fill.gradientColor1"),
				gradientColor2: w(c.gradientColor2, "title.fill.gradientColor2")
			},
			shadow: {
				enabled: E(g.enabled, "title.shadow.enabled"),
				color: w(g.color, "title.shadow.color"),
				gradient: E(g.gradient, "title.shadow.gradient"),
				gradientColor1: w(g.gradientColor1, "title.shadow.gradientColor1"),
				gradientColor2: w(g.gradientColor2, "title.shadow.gradientColor2"),
				offsetX: T(g.offsetX, "title.shadow.offsetX"),
				offsetY: T(g.offsetY, "title.shadow.offsetY"),
				opacity: T(g.opacity, "title.shadow.opacity")
			},
			useRarityPreset: E(o.useRarityPreset, "title.useRarityPreset")
		},
		artwork: {
			source: w(y.source, "artwork.source"),
			fit: C(y.fit, m, "artwork.fit")
		},
		foreground: {
			enabled: E(b.enabled, "foreground.enabled"),
			source: w(b.source, "foreground.source"),
			width: T(b.width, "foreground.width"),
			height: T(b.height, "foreground.height"),
			x: T(b.x, "foreground.x"),
			y: T(b.y, "foreground.y"),
			scale: T(b.scale, "foreground.scale"),
			rotation: T(b.rotation, "foreground.rotation"),
			coverLevel: O(b.coverLevel, !0, "foreground.coverLevel"),
			coverAttribute: O(b.coverAttribute, !0, "foreground.coverAttribute"),
			clipBelowEffectBox: O(b.clipBelowEffectBox, !1, "foreground.clipBelowEffectBox")
		},
		rarityMask: {
			source: w(k.source, "rarityMask.source"),
			width: T(k.width, "rarityMask.width"),
			height: T(k.height, "rarityMask.height"),
			x: T(k.x, "rarityMask.x"),
			y: T(k.y, "rarityMask.y"),
			scale: T(k.scale, "rarityMask.scale"),
			maskEffectBox: O(k.maskEffectBox, !0, "rarityMask.maskEffectBox"),
			maskArtwork: O(k.maskArtwork, !1, "rarityMask.maskArtwork"),
			coverName: O(k.coverName, !1, "rarityMask.coverName"),
			coverAttribute: O(k.coverAttribute, !1, "rarityMask.coverAttribute"),
			coverLevel: O(k.coverLevel, !1, "rarityMask.coverLevel")
		},
		effectBox: {
			enabled: E(A.enabled, "effectBox.enabled"),
			x: T(A.x, "effectBox.x"),
			y: T(A.y, "effectBox.y"),
			width: T(A.width, "effectBox.width"),
			height: T(A.height, "effectBox.height"),
			color: w(A.color, "effectBox.color"),
			opacity: T(A.opacity, "effectBox.opacity"),
			borderStyle: D(A.borderStyle, h, "none", "effectBox.borderStyle")
		},
		text: {
			pendulumDescription: w(j.pendulumDescription, "text.pendulumDescription"),
			monsterType: w(j.monsterType, "text.monsterType"),
			description: w(j.description, "text.description"),
			firstLineCompress: E(j.firstLineCompress, "text.firstLineCompress"),
			descriptionAlign: E(j.descriptionAlign, "text.descriptionAlign"),
			descriptionZoom: T(j.descriptionZoom, "text.descriptionZoom"),
			descriptionWeight: T(j.descriptionWeight, "text.descriptionWeight"),
			showAtkBar: E(j.showAtkBar, "text.showAtkBar"),
			atk: T(j.atk, "text.atk"),
			def: T(j.def, "text.def")
		},
		footer: {
			package: w(M.package, "footer.package"),
			password: w(M.password, "footer.password"),
			copyright: w(M.copyright, "footer.copyright"),
			laser: w(M.laser, "footer.laser"),
			rare: w(M.rare, "footer.rare"),
			rarityEffect: C(M.rarityEffect ?? "auto", t, "footer.rarityEffect"),
			twentieth: E(M.twentieth, "footer.twentieth"),
			mark25th: O(M.mark25th, !1, "footer.mark25th")
		},
		render: {
			radius: E(N.radius, "render.radius"),
			scale: T(N.scale, "render.scale")
		}
	};
}
function A(e, t) {
	return typeof e == "string" ? e : t;
}
function j(e, t) {
	return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function M(e, t) {
	return typeof e == "boolean" ? e : t;
}
function N(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function P(e, t) {
	return typeof e.effectBlockBorderStyle == "string" ? e.effectBlockBorderStyle === "o" || e.effectBlockBorderStyle === "alternate" ? "colored" : N(e.effectBlockBorderStyle, h, t) : typeof e.effectBlockBorder == "boolean" ? e.effectBlockBorder ? "default" : "none" : t;
}
function F(n = {}, r = b()) {
	let o = A(n.nameShadowColor, r.title.shadow.color), s = A(n.foregroundImage, r.foreground.source), c = A(n.rarityMaskImage, r.rarityMask.source), h = Array.isArray(n.arrowList) ? n.arrowList.filter((e) => Number.isInteger(e) && e >= 1 && e <= 8) : r.frame.arrows;
	return b({
		frame: {
			language: N(n.language, l, r.frame.language),
			font: N(n.font, [
				"",
				"custom1",
				"custom2"
			], r.frame.font),
			type: N(n.type, u, r.frame.type),
			attribute: A(n.attribute, r.frame.attribute),
			icon: A(n.icon, r.frame.icon),
			cardType: N(n.cardType, d, r.frame.cardType),
			pendulumType: N(n.pendulumType, f, r.frame.pendulumType),
			level: j(n.level, r.frame.level),
			rank: j(n.rank, r.frame.rank),
			levelAlign: N(n.levelAlign, i, r.frame.levelAlign),
			levelStyle: N(n.levelStyle, a, r.frame.levelStyle),
			cardBorderCoverForeground: n.cardBorderCoverForeground === "auto" ? "auto" : typeof n.cardBorderCoverForeground == "boolean" ? n.cardBorderCoverForeground : r.frame.cardBorderCoverForeground,
			pendulumScale: j(n.pendulumScale, r.frame.pendulumScale),
			arrows: h,
			cardBorderStyle: N(n.cardBorderStyle, e, r.frame.cardBorderStyle),
			artBorderStyle: N(n.artBorderStyle, e, r.frame.artBorderStyle),
			effectBorderStyle: N(n.effectBorderStyle, e, r.frame.effectBorderStyle),
			nameBlock: M(n.nameBlock ?? n.outFrameNameBlock ?? n.outFrameNameBlockEnabled, r.frame.nameBlock)
		},
		title: {
			text: A(n.name, r.title.text),
			align: N(n.align, p, r.title.align),
			fill: {
				color: A(n.color, r.title.fill.color),
				gradient: M(n.gradient, r.title.fill.gradient),
				gradientStroke: M(n.gradientStroke, r.title.fill.gradientStroke),
				gradientColor1: A(n.gradientColor1, r.title.fill.gradientColor1),
				gradientColor2: A(n.gradientColor2, r.title.fill.gradientColor2)
			},
			shadow: {
				enabled: !!(o || n.nameShadowGradient || r.title.shadow.enabled),
				color: o,
				gradient: M(n.nameShadowGradient, r.title.shadow.gradient),
				gradientColor1: A(n.nameShadowGradientColor1, r.title.shadow.gradientColor1),
				gradientColor2: A(n.nameShadowGradientColor2, r.title.shadow.gradientColor2),
				offsetX: j(n.nameShadowOffsetX, r.title.shadow.offsetX),
				offsetY: j(n.nameShadowOffsetY, r.title.shadow.offsetY),
				opacity: j(n.nameShadowOpacity, r.title.shadow.opacity)
			},
			useRarityPreset: M(n.useRarityPreset, r.title.useRarityPreset)
		},
		artwork: {
			source: A(n.image, r.artwork.source),
			fit: N(n.artworkFit, m, r.artwork.fit)
		},
		foreground: {
			enabled: !!s,
			source: s,
			width: j(n.foregroundWidth, r.foreground.width),
			height: j(n.foregroundHeight, r.foreground.height),
			x: j(n.foregroundX, r.foreground.x),
			y: j(n.foregroundY, r.foreground.y),
			scale: j(n.foregroundScale, r.foreground.scale),
			rotation: j(n.foregroundRotation, r.foreground.rotation),
			coverLevel: M(n.foregroundCoverLevel, r.foreground.coverLevel),
			coverAttribute: M(n.foregroundCoverAttribute, r.foreground.coverAttribute),
			clipBelowEffectBox: M(n.foregroundClipBelowEffectBox, r.foreground.clipBelowEffectBox)
		},
		rarityMask: {
			source: c,
			width: j(n.rarityMaskWidth, r.rarityMask.width),
			height: j(n.rarityMaskHeight, r.rarityMask.height),
			x: j(n.rarityMaskX, r.rarityMask.x),
			y: j(n.rarityMaskY, r.rarityMask.y),
			scale: j(n.rarityMaskScale, r.rarityMask.scale),
			maskEffectBox: M(n.rarityMaskEffectBox, r.rarityMask.maskEffectBox),
			maskArtwork: M(n.rarityMaskArtwork, r.rarityMask.maskArtwork),
			coverName: M(n.rarityMaskCoverName, r.rarityMask.coverName),
			coverAttribute: M(n.rarityMaskCoverAttribute, r.rarityMask.coverAttribute),
			coverLevel: M(n.rarityMaskCoverLevel, r.rarityMask.coverLevel)
		},
		effectBox: {
			enabled: M(n.effectBlockEnabled, r.effectBox.enabled),
			x: j(n.effectBlockX, r.effectBox.x),
			y: j(n.effectBlockY, r.effectBox.y),
			width: j(n.effectBlockWidth, r.effectBox.width),
			height: j(n.effectBlockHeight, r.effectBox.height),
			color: A(n.effectBlockColor, r.effectBox.color),
			opacity: j(n.effectBlockOpacity, r.effectBox.opacity),
			borderStyle: P(n, r.effectBox.borderStyle)
		},
		text: {
			pendulumDescription: A(n.pendulumDescription, r.text.pendulumDescription),
			monsterType: A(n.monsterType, r.text.monsterType),
			description: A(n.description, r.text.description),
			firstLineCompress: M(n.firstLineCompress, r.text.firstLineCompress),
			descriptionAlign: M(n.descriptionAlign, r.text.descriptionAlign),
			descriptionZoom: j(n.descriptionZoom, r.text.descriptionZoom),
			descriptionWeight: j(n.descriptionWeight, r.text.descriptionWeight),
			showAtkBar: M(n.atkBar, r.text.showAtkBar),
			atk: j(n.atk, r.text.atk),
			def: j(n.def, r.text.def)
		},
		footer: {
			package: A(n.package, r.footer.package),
			password: A(n.password, r.footer.password),
			copyright: A(n.copyright, r.footer.copyright),
			laser: A(n.laser, r.footer.laser),
			rare: A(n.rare, r.footer.rare),
			rarityEffect: N(n.rarityEffect, t, r.footer.rarityEffect),
			twentieth: M(n.twentieth, r.footer.twentieth),
			mark25th: M(n.mark25th ?? n.twentyFifth, r.footer.mark25th)
		},
		render: {
			radius: M(n.radius, r.render.radius),
			scale: j(n.scale, r.render.scale)
		}
	});
}
function I(e) {
	let t = k(e);
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
		levelAlign: t.frame.levelAlign,
		levelStyle: t.frame.levelStyle,
		cardBorderCoverForeground: t.frame.cardBorderCoverForeground,
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
export { m as YUGIOH_ARTWORK_FITS, s as YUGIOH_CARD_DOCUMENT_KIND, c as YUGIOH_CARD_DOCUMENT_VERSION, l as YUGIOH_CARD_LANGUAGES, u as YUGIOH_CARD_TYPES, h as YUGIOH_EFFECT_BOX_BORDER_STYLES, e as YUGIOH_FRAME_STYLES, g as YUGIOH_LAYER_SLOTS, i as YUGIOH_LEVEL_ALIGNS, a as YUGIOH_LEVEL_STYLES, d as YUGIOH_MONSTER_CARD_TYPES, f as YUGIOH_PENDULUM_CARD_TYPES, t as YUGIOH_RARITY_EFFECTS, p as YUGIOH_TITLE_ALIGNS, _ as YugiohCardDocumentError, b as createYugiohCardDocument, n as getRarityFramePreset, F as legacyDataToYugiohCardDocument, k as parseYugiohCardDocument, o as resolveFrameOptions, r as resolveRarityEffect, I as yugiohCardDocumentToLegacyData };
