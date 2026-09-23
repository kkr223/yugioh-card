import { CompressText as e } from "../compress-text/compress-text.js";
import { getRarityFramePreset as t, resolveRarityEffect as n } from "./rarity.js";
import "./frame-options.js";
import { YUGIOH_LAYER_SLOTS as r, createYugiohCardDocument as i, legacyDataToYugiohCardDocument as a, parseYugiohCardDocument as o, yugiohCardDocumentToLegacyData as s } from "./document.js";
import { LegacyYugiohCardRenderer as c } from "./legacy-renderer.js";
import { Box as l, Group as u, Image as d, Rect as f } from "leafer-unified";
//#region packages/src/yugioh-card/index.ts
var p = class extends Error {
	revision;
	cause;
	constructor(e, t) {
		super(`Failed to render YugiohCard revision ${e}`), this.name = "YugiohCardRenderError", this.revision = e, this.cause = t;
	}
}, m = {
	"before-frame": -100,
	"after-artwork": 25,
	"before-text": 29,
	"after-text": 90,
	top: 1e3
}, h = {
	ur: {
		color: "#f3cc63",
		gradient: !0,
		gradientColor1: "#8a5d17",
		gradientColor2: "#f8e6a2"
	},
	gr: {
		color: "#d8dde6",
		gradient: !0,
		gradientColor1: "#6d7683",
		gradientColor2: "#f4f7fb"
	},
	hr: {
		color: "#eef2f8",
		gradient: !0,
		gradientColor1: "#8e99a9",
		gradientColor2: "#ffffff"
	},
	ser: {
		color: "#edf2f8",
		gradient: !0,
		gradientColor1: "#8b95a4",
		gradientColor2: "#ffffff"
	},
	gser: {
		color: "#f1d377",
		gradient: !0,
		gradientColor1: "#8a6422",
		gradientColor2: "#fff1be"
	},
	pser: {
		color: "#f5d6ef",
		gradient: !0,
		gradientColor1: "#855f86",
		gradientColor2: "#fff5fd"
	},
	pser2: {
		color: "#f5d6ef",
		gradient: !0,
		gradientColor1: "#855f86",
		gradientColor2: "#fff5fd"
	}
}, g = {
	nameBlock: {
		url: "/yugioh/image/other/name-block.png",
		x: 76,
		y: 82,
		width: 1242,
		height: 157
	},
	effectBox: {
		defaultUrl: "/yugioh/image/effect-border/eblock-border.png",
		coloredUrl: "/yugioh/image/effect-border/eblock-border-color.png",
		grandmasterUrl: "/yugioh/image/effect-border/eblock-border-grandmaster.png"
	},
	mark25th: {
		url: "/yugioh/image/watermark/mark25th.png",
		x: 503,
		y: 1496,
		width: 388,
		height: 430
	}
}, _ = {
	normal: {
		url: "/yugioh/image/art-border/art-frame-base.png",
		x: 117,
		y: 322,
		width: 1162,
		height: 1162
	},
	pendulumArt: {
		url: "/yugioh/image/pendulum-frame/pframe-art-base.png",
		x: 68,
		y: 342,
		width: 1257,
		height: 914
	},
	pendulumEffect: {
		url: "/yugioh/image/pendulum-frame/pframe-effect-base.png",
		x: 68,
		y: 1256,
		width: 1257,
		height: 681
	}
}, v = [
	"name",
	"pendulumDescription",
	"monsterType",
	"description",
	"package",
	"password"
];
function y(e) {
	if (!(e.language !== "sc" && e.language !== "tc")) for (let t of v) e[t] = e[t].replace(/[０-９]/g, (e) => String.fromCharCode(e.charCodeAt(0) - 65248));
}
function b(e) {
	let t = o(e);
	return Object.freeze(t.frame.arrows), Object.freeze(t.frame), Object.freeze(t.title.fill), Object.freeze(t.title.shadow), Object.freeze(t.title), Object.freeze(t.artwork), Object.freeze(t.foreground), Object.freeze(t.rarityMask), Object.freeze(t.effectBox), Object.freeze(t.text), Object.freeze(t.footer), Object.freeze(t.render), Object.freeze(t);
}
function x(e) {
	return typeof e == "object" && !!e && "then" in e && typeof e.then == "function";
}
var S = class extends c {
	documentValue;
	revisionValue = 0;
	completedRevision = 0;
	renderQueued = !1;
	rendering = !1;
	waiters = [];
	extensions = /* @__PURE__ */ new Map();
	slotGroups = /* @__PURE__ */ new Map();
	nameBlockLeaf = null;
	titleShadowLeaf = null;
	foregroundClipBox = null;
	foregroundLeaf = null;
	pendulumEffectMaskLeaf = null;
	rarityMaskLayer = null;
	rarityMaskShape = null;
	rarityMaskBackground = null;
	rarityMaskLeaf = null;
	rarityArtworkMaskLeaf = null;
	rarityEffectBoxMaskLeaf = null;
	effectBoxFillLeaf = null;
	effectBoxBorderLeaf = null;
	mark25thLeaf = null;
	constructor(e = {}) {
		super(e), this.documentValue = e.document ? o(e.document) : a(e.data), this.data = s(this.documentValue), this.initializeSlotGroups();
		for (let t of e.extensions ?? []) this.registerExtension(t);
		this.scheduleRender();
	}
	get tag() {
		return "YugiohCard";
	}
	get revision() {
		return this.revisionValue;
	}
	setData(e = {}) {
		if (!this.documentValue) {
			super.setData(e);
			return;
		}
		this.documentValue = a(e, this.documentValue), this.data = s(this.documentValue), this.scheduleRender();
	}
	async setDocument(e) {
		this.assertActive(), this.documentValue = o(e), this.data = s(this.documentValue), await this.scheduleRender();
	}
	async updateDocument(e) {
		await this.setDocument(e(this.getDocument()));
	}
	getDocument() {
		return b(this.documentValue ?? i());
	}
	registerExtension(e) {
		if (this.assertActive(), !r.includes(e.slot)) throw Error(`Unknown YugiohCard layer slot: ${String(e.slot)}`);
		if (this.extensions.has(e.id)) throw Error(`Duplicate YugiohCard extension id: ${e.id}`);
		let t = this.slotGroups.get(e.slot);
		if (!t) throw Error(`Layer slot is not initialized: ${e.slot}`);
		let n = new u();
		t.add(n), this.extensions.set(e.id, {
			extension: e,
			group: n
		}), this.scheduleRender();
	}
	async unregisterExtension(e) {
		let t = this.extensions.get(e);
		return t ? (this.extensions.delete(e), await t.extension.destroy?.({
			group: t.group,
			resourceUrl: (e) => this.resourceUrl(e),
			invalidate: () => {
				this.scheduleRender();
			}
		}), t.group.destroy(), !0) : !1;
	}
	draw() {
		if (!this.documentValue) {
			super.draw();
			return;
		}
		this.scheduleRender();
	}
	async whenReady() {
		await super.whenReady(), this.completedRevision < this.revisionValue && await this.waitForRevision(this.revisionValue);
	}
	async export(e, t) {
		return await this.whenReady(), super.export(e, t);
	}
	destroy() {
		if (this.destroyed) return;
		let e = /* @__PURE__ */ Error("YugiohCard was destroyed");
		for (let t of this.waiters.splice(0)) t.reject(e);
		for (let e of [...this.extensions.keys()]) this.unregisterExtension(e);
		this.nameBlockLeaf = null, this.titleShadowLeaf = null, this.foregroundClipBox = null, this.foregroundLeaf = null, this.pendulumEffectMaskLeaf = null, this.rarityMaskLayer = null, this.rarityMaskShape = null, this.rarityMaskBackground = null, this.rarityMaskLeaf = null, this.rarityArtworkMaskLeaf = null, this.rarityEffectBoxMaskLeaf = null, this.effectBoxFillLeaf = null, this.effectBoxBorderLeaf = null, this.mark25thLeaf = null, super.destroy();
	}
	assertActive() {
		if (this.destroyed) throw Error("YugiohCard was destroyed");
	}
	initializeSlotGroups() {
		if (!this.leafer) throw Error("YugiohCard renderer is not initialized");
		for (let e of r) {
			let t = new u({ zIndex: m[e] });
			this.leafer.add(t), this.slotGroups.set(e, t);
		}
	}
	scheduleRender() {
		this.assertActive();
		let e = ++this.revisionValue, t = this.waitForRevision(e);
		return this.renderReady = t, !this.renderQueued && !this.rendering && (this.renderQueued = !0, queueMicrotask(() => {
			this.flushRenderQueue();
		})), t;
	}
	waitForRevision(e) {
		return this.completedRevision >= e ? Promise.resolve() : new Promise((t, n) => {
			this.waiters.push({
				revision: e,
				resolve: t,
				reject: n
			});
		});
	}
	async flushRenderQueue() {
		if (!(this.rendering || this.destroyed)) {
			this.renderQueued = !1, this.rendering = !0;
			try {
				for (; !this.destroyed && this.completedRevision < this.revisionValue;) {
					let e = this.revisionValue;
					try {
						await this.renderRevision(e), this.completedRevision = e, this.resolveWaiters(e);
					} catch (t) {
						let n = new p(e, t);
						this.completedRevision = e, this.rejectWaiters(e, n);
					}
				}
			} finally {
				this.rendering = !1, !this.destroyed && this.completedRevision < this.revisionValue && (this.renderQueued = !0, queueMicrotask(() => {
					this.flushRenderQueue();
				}));
			}
		}
	}
	async renderRevision(e) {
		let t = o(this.documentValue), n = s(t);
		y(n), this.applyRarityTitlePreset(n), this.data = n, super.draw(), this.drawRarityMask(t), this.applyArtworkFit(t), this.drawPendulumSplitMask(t), this.drawNameBlock(t), this.drawTitleShadow(t), this.drawForeground(t), this.applyForegroundTitlePolicy(t), this.applyForegroundOverlayPolicy(t), this.drawEffectBox(t), this.drawMark25th(t);
		let r = b(t);
		for (let { extension: t, group: n } of this.extensions.values()) {
			let i = t.update({
				group: n,
				document: r,
				resourceUrl: (e) => this.resourceUrl(e),
				invalidate: () => {
					this.scheduleRender();
				}
			});
			if (x(i) && await i, e !== this.revisionValue) return;
		}
	}
	applyRarityTitlePreset(e) {
		if (!e.useRarityPreset || e.color || e.gradient) return;
		let t = h[e.rare.trim().toLowerCase()];
		t && Object.assign(e, t);
	}
	applyArtworkFit(e) {
		let t = this;
		if (!t.imageLeaf) return;
		let n = e.artwork.fit === "contain" ? "fit" : e.artwork.fit;
		t.imageLeaf.set({ fill: {
			type: "image",
			url: e.artwork.source,
			mode: n,
			align: "top"
		} });
	}
	foregroundVisible(e) {
		let t = e.foreground;
		return t.enabled && !!t.source && t.width > 0 && t.height > 0 && t.scale > 0;
	}
	drawRarityMask(e) {
		if (!this.leafer) return;
		let t = this, r = t.rareLeaf;
		if (!r) return;
		let i = e.rarityMask, a = !!i.source && i.width > 0 && i.height > 0 && i.scale > 0, o = n(e.footer.rare, e.frame.type, e.footer.rarityEffect), s = o !== "none" && (a || i.maskEffectBox || i.maskArtwork), c = o === "pser2" ? "hard-light" : "pass-through";
		if (!s) {
			this.leafer.add(r), r.set({
				blendMode: c,
				zIndex: 100
			}), this.rarityMaskLayer?.set({ visible: !1 });
			return;
		}
		this.rarityMaskLayer || (this.rarityMaskLayer = new u(), this.rarityMaskShape = new u({ mask: "grayscale" }), this.rarityMaskBackground = new f({ fill: "#ffffff" }), this.rarityMaskLeaf = new d(), this.rarityArtworkMaskLeaf = new f({ fill: "#000000" }), this.rarityEffectBoxMaskLeaf = new f({ fill: "#000000" }), this.rarityMaskShape.add(this.rarityMaskBackground), this.rarityMaskShape.add(this.rarityMaskLeaf), this.rarityMaskShape.add(this.rarityArtworkMaskLeaf), this.rarityMaskShape.add(this.rarityEffectBoxMaskLeaf), this.rarityMaskLayer.add(this.rarityMaskShape), this.leafer.add(this.rarityMaskLayer)), this.rarityMaskLayer.add(r), this.rarityMaskLayer.set({
			width: this.cardWidth,
			height: this.cardHeight,
			visible: !0,
			zIndex: 100,
			blendMode: c
		}), this.rarityMaskBackground?.set({
			width: this.cardWidth,
			height: this.cardHeight,
			visible: !0
		}), this.rarityMaskLeaf?.set({
			url: i.source,
			width: i.width,
			height: i.height,
			x: i.x,
			y: i.y,
			scaleX: i.scale,
			scaleY: i.scale,
			around: {
				type: "percent",
				x: .5,
				y: .5
			},
			visible: a
		}), this.rarityArtworkMaskLeaf?.set({
			x: t.imageLeaf?.x ?? 0,
			y: t.imageLeaf?.y ?? 0,
			width: t.imageLeaf?.width ?? 0,
			height: t.imageLeaf?.height ?? 0,
			visible: i.maskArtwork
		});
		let l = e.effectBox, p = Math.min(16, l.width / 2), m = Math.min(16, l.height / 2), h = Math.min(20, l.height / 2);
		this.rarityEffectBoxMaskLeaf?.set({
			x: l.x + p,
			y: l.y + m,
			width: Math.max(0, l.width - p * 2),
			height: Math.max(0, l.height - m - h),
			visible: i.maskEffectBox
		}), r.set({
			blendMode: "pass-through",
			zIndex: 0
		});
	}
	drawPendulumSplitMask(e) {
		if (!this.leafer) return;
		let t = this.maskLeaf;
		if (t) {
			if (this.pendulumEffectMaskLeaf || (this.pendulumEffectMaskLeaf = new d(), this.leafer.add(this.pendulumEffectMaskLeaf)), e.frame.type !== "pendulum") {
				let e = _.normal;
				t.set({
					url: this.resourceUrl(e.url),
					x: e.x,
					y: e.y,
					width: e.width,
					height: e.height,
					visible: !0,
					zIndex: 20
				}), this.pendulumEffectMaskLeaf.set({ visible: !1 });
				return;
			}
			t.set({
				url: this.resourceUrl(_.pendulumArt.url),
				x: _.pendulumArt.x,
				y: _.pendulumArt.y,
				width: _.pendulumArt.width,
				height: _.pendulumArt.height,
				visible: !0,
				zIndex: 20
			}), this.pendulumEffectMaskLeaf.set({
				url: this.resourceUrl(_.pendulumEffect.url),
				x: _.pendulumEffect.x,
				y: _.pendulumEffect.y,
				width: _.pendulumEffect.width,
				height: _.pendulumEffect.height,
				visible: !0,
				zIndex: 22
			});
		}
	}
	drawTitleShadow(t) {
		let n = this.nameLeaf;
		if (!n || !this.leafer) return;
		this.titleShadowLeaf || (this.titleShadowLeaf = new e(), this.leafer.add(this.titleShadowLeaf));
		let r = t.title.shadow;
		if (!r.enabled) {
			this.titleShadowLeaf.set({ visible: !1 });
			return;
		}
		this.titleShadowLeaf.set({
			text: n.text,
			fontFamily: n.fontFamily,
			fontSize: n.fontSize,
			letterSpacing: n.letterSpacing,
			wordSpacing: n.wordSpacing,
			textAlign: n.textAlign,
			rtFontSize: n.rtFontSize,
			rtTop: n.rtTop,
			rtColor: r.gradient ? r.gradientColor1 : r.color,
			width: n.width,
			height: n.height,
			x: (n.x ?? 0) + r.offsetX,
			y: (n.y ?? 0) + r.offsetY,
			zIndex: 22,
			visible: n.visible !== !1,
			opacity: r.opacity,
			scaleX: n.scaleX,
			scaleY: n.scaleY,
			strokeWidth: n.strokeWidth,
			color: r.color,
			gradient: r.gradient,
			gradientColor1: r.gradientColor1,
			gradientColor2: r.gradientColor2
		});
	}
	drawNameBlock(e) {
		if (!this.leafer) return;
		this.nameBlockLeaf || (this.nameBlockLeaf = new d(), this.leafer.add(this.nameBlockLeaf));
		let t = g.nameBlock;
		this.nameBlockLeaf.set({
			url: this.resourceUrl(t.url),
			x: t.x,
			y: t.y,
			width: t.width,
			height: t.height,
			visible: e.frame.nameBlock,
			zIndex: 9
		});
	}
	drawForeground(e) {
		if (!this.leafer) return;
		this.foregroundClipBox || (this.foregroundClipBox = new l(), this.leafer.add(this.foregroundClipBox)), this.foregroundLeaf || (this.foregroundLeaf = new d(), this.foregroundClipBox.add(this.foregroundLeaf));
		let t = e.foreground, n = this.foregroundVisible(e);
		this.foregroundClipBox.set({
			width: this.cardWidth,
			height: Math.max(0, e.effectBox.y + e.effectBox.height),
			overflow: t.clipBelowEffectBox ? "hide" : "show",
			visible: n,
			zIndex: 21
		}), this.foregroundLeaf.set({
			url: t.source,
			width: t.width,
			height: t.height,
			x: t.x,
			y: t.y,
			scaleX: t.scale,
			scaleY: t.scale,
			rotation: t.rotation,
			around: {
				type: "percent",
				x: .5,
				y: .5
			},
			visible: n,
			zIndex: 21
		});
	}
	applyForegroundTitlePolicy(e) {
		let t = this, r = n(e.footer.rare, e.frame.type, e.footer.rarityEffect) === "pser2" && !e.rarityMask.coverName;
		this.titleShadowLeaf?.set({ zIndex: r ? 101 : 22 }), t.nameLeaf?.set({ zIndex: r ? 102 : 23 });
	}
	applyForegroundOverlayPolicy(e) {
		let t = this, r = n(e.footer.rare, e.frame.type, e.footer.rarityEffect) === "pser2", i = r && !e.rarityMask.coverLevel ? 101 : e.foreground.coverLevel ? 10 : 22;
		t.levelLeaf?.set({ zIndex: i }), t.rankLeaf?.set({ zIndex: i }), t.attributeLeaf?.set({ zIndex: r && !e.rarityMask.coverAttribute ? 101 : e.foreground.coverAttribute ? 10 : 22 });
		let a = this.foregroundVisible(e), o = r ? e.rarityMask.coverLevel ? a && e.foreground.coverLevel ? 20.5 : 22 : 101 : a ? e.foreground.coverLevel ? 20.5 : 22 : 120;
		t.linkArrowLeaf?.set({ zIndex: o });
	}
	drawEffectBox(e) {
		if (!this.leafer) return;
		let n = this;
		this.effectBoxFillLeaf || (this.effectBoxFillLeaf = new f(), this.leafer.add(this.effectBoxFillLeaf)), this.effectBoxBorderLeaf || (this.effectBoxBorderLeaf = new d(), this.leafer.add(this.effectBoxBorderLeaf));
		let r = e.effectBox, i = r.enabled && r.width > 0 && r.height > 0 && r.opacity > 0, a = r.borderStyle !== "none" && r.width > 0 && r.height > 0, o = Math.min(16, r.width / 2), s = Math.min(16, r.height / 2), c = Math.min(20, r.height / 2);
		this.effectBoxFillLeaf.set({
			x: r.x + o,
			y: r.y + s,
			width: Math.max(0, r.width - o * 2),
			height: Math.max(0, r.height - s - c),
			fill: r.color,
			opacity: r.opacity,
			visible: i,
			zIndex: 28
		});
		let l = e.frame.effectBorderStyle === "auto" ? r.borderStyle === "colored" : e.frame.effectBorderStyle === "color", u = (e.frame.effectBorderStyle === "auto" ? t(e.footer.rare, e.frame.type).effectBorderStyle : e.frame.effectBorderStyle) === "grandmaster" ? g.effectBox.grandmasterUrl : l ? g.effectBox.coloredUrl : g.effectBox.defaultUrl;
		this.effectBoxBorderLeaf.set({
			url: this.resourceUrl(u),
			x: r.x,
			y: r.y,
			width: r.width,
			height: r.height,
			visible: a,
			zIndex: 29
		}), n.rareEffectBorderLeaf?.set({
			x: r.x,
			y: r.y,
			width: r.width,
			height: r.height
		});
	}
	drawMark25th(e) {
		if (!this.leafer) return;
		this.mark25thLeaf || (this.mark25thLeaf = new d(), this.leafer.add(this.mark25thLeaf));
		let t = g.mark25th;
		this.mark25thLeaf.set({
			url: this.resourceUrl(t.url),
			x: t.x,
			y: t.y,
			width: t.width,
			height: t.height,
			visible: e.footer.mark25th,
			zIndex: 10
		});
	}
	resolveWaiters(e) {
		let t = [];
		for (let n of this.waiters) n.revision <= e ? n.resolve() : t.push(n);
		this.waiters = t;
	}
	rejectWaiters(e, t) {
		let n = [];
		for (let r of this.waiters) r.revision <= e ? r.reject(t) : n.push(r);
		this.waiters = n;
	}
};
//#endregion
export { S as YugiohCard, p as YugiohCardRenderError };
