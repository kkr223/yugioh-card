import { CompressText as e } from "../compress-text/compress-text.js";
import { resolveRarityEffect as t } from "./rarity.js";
import { YUGIOH_LAYER_SLOTS as n, createYugiohCardDocument as r, legacyDataToYugiohCardDocument as i, parseYugiohCardDocument as a, yugiohCardDocumentToLegacyData as o } from "./document.js";
import { LegacyYugiohCardRenderer as s } from "./legacy-renderer.js";
import { Box as c, Group as l, Image as u, Rect as d } from "leafer-unified";
//#region packages/src/yugioh-card/index.ts
var f = class extends Error {
	revision;
	cause;
	constructor(e, t) {
		super(`Failed to render YugiohCard revision ${e}`), this.name = "YugiohCardRenderError", this.revision = e, this.cause = t;
	}
}, p = {
	"before-frame": -100,
	"after-artwork": 25,
	"before-text": 29,
	"after-text": 90,
	top: 1e3
}, m = {
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
}, h = {
	nameBlock: {
		url: "/yugioh/image/other/name-block.png",
		x: 76,
		y: 82,
		width: 1242,
		height: 157
	},
	effectBox: {
		defaultUrl: "/yugioh/image/effect-border/eblock-border.png",
		coloredUrl: "/yugioh/image/effect-border/eblock-border-color.png"
	},
	mark25th: {
		url: "/yugioh/image/watermark/mark25th.png",
		x: 503,
		y: 1496,
		width: 388,
		height: 430
	}
}, g = {
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
}, _ = [
	"name",
	"pendulumDescription",
	"monsterType",
	"description",
	"package",
	"password"
];
function v(e) {
	if (!(e.language !== "sc" && e.language !== "tc")) for (let t of _) e[t] = e[t].replace(/[０-９]/g, (e) => String.fromCharCode(e.charCodeAt(0) - 65248));
}
function y(e) {
	let t = a(e);
	return Object.freeze(t.frame.arrows), Object.freeze(t.frame), Object.freeze(t.title.fill), Object.freeze(t.title.shadow), Object.freeze(t.title), Object.freeze(t.artwork), Object.freeze(t.foreground), Object.freeze(t.rarityMask), Object.freeze(t.effectBox), Object.freeze(t.text), Object.freeze(t.footer), Object.freeze(t.render), Object.freeze(t);
}
function b(e) {
	return typeof e == "object" && !!e && "then" in e && typeof e.then == "function";
}
var x = class extends s {
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
		super(e), this.documentValue = e.document ? a(e.document) : i(e.data), this.data = o(this.documentValue), this.initializeSlotGroups();
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
		this.documentValue = i(e, this.documentValue), this.data = o(this.documentValue), this.scheduleRender();
	}
	async setDocument(e) {
		this.assertActive(), this.documentValue = a(e), this.data = o(this.documentValue), await this.scheduleRender();
	}
	async updateDocument(e) {
		await this.setDocument(e(this.getDocument()));
	}
	getDocument() {
		return y(this.documentValue ?? r());
	}
	registerExtension(e) {
		if (this.assertActive(), !n.includes(e.slot)) throw Error(`Unknown YugiohCard layer slot: ${String(e.slot)}`);
		if (this.extensions.has(e.id)) throw Error(`Duplicate YugiohCard extension id: ${e.id}`);
		let t = this.slotGroups.get(e.slot);
		if (!t) throw Error(`Layer slot is not initialized: ${e.slot}`);
		let r = new l();
		t.add(r), this.extensions.set(e.id, {
			extension: e,
			group: r
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
		for (let e of n) {
			let t = new l({ zIndex: p[e] });
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
						let n = new f(e, t);
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
		let t = a(this.documentValue), n = o(t);
		v(n), this.applyRarityTitlePreset(n), this.data = n, super.draw(), this.drawRarityMask(t), this.applyArtworkFit(t), this.drawPendulumSplitMask(t), this.drawNameBlock(t), this.drawTitleShadow(t), this.drawForeground(t), this.applyForegroundTitlePolicy(t), this.applyForegroundOverlayPolicy(t), this.drawEffectBox(t), this.drawMark25th(t);
		let r = y(t);
		for (let { extension: t, group: n } of this.extensions.values()) {
			let i = t.update({
				group: n,
				document: r,
				resourceUrl: (e) => this.resourceUrl(e),
				invalidate: () => {
					this.scheduleRender();
				}
			});
			if (b(i) && await i, e !== this.revisionValue) return;
		}
	}
	applyRarityTitlePreset(e) {
		if (!e.useRarityPreset || e.color || e.gradient) return;
		let t = m[e.rare.trim().toLowerCase()];
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
		let n = this, r = n.rareLeaf;
		if (!r) return;
		let i = e.rarityMask, a = !!i.source && i.width > 0 && i.height > 0 && i.scale > 0, o = t(e.footer.rare, e.frame.type, e.footer.rarityEffect), s = o !== "none" && (a || i.maskEffectBox || i.maskArtwork), c = o === "pser2" ? "hard-light" : "pass-through";
		if (!s) {
			this.leafer.add(r), r.set({
				blendMode: c,
				zIndex: 100
			}), this.rarityMaskLayer?.set({ visible: !1 });
			return;
		}
		this.rarityMaskLayer || (this.rarityMaskLayer = new l(), this.rarityMaskShape = new l({ mask: "grayscale" }), this.rarityMaskBackground = new d({ fill: "#ffffff" }), this.rarityMaskLeaf = new u(), this.rarityArtworkMaskLeaf = new d({ fill: "#000000" }), this.rarityEffectBoxMaskLeaf = new d({ fill: "#000000" }), this.rarityMaskShape.add(this.rarityMaskBackground), this.rarityMaskShape.add(this.rarityMaskLeaf), this.rarityMaskShape.add(this.rarityArtworkMaskLeaf), this.rarityMaskShape.add(this.rarityEffectBoxMaskLeaf), this.rarityMaskLayer.add(this.rarityMaskShape), this.leafer.add(this.rarityMaskLayer)), this.rarityMaskLayer.add(r), this.rarityMaskLayer.set({
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
			x: n.imageLeaf?.x ?? 0,
			y: n.imageLeaf?.y ?? 0,
			width: n.imageLeaf?.width ?? 0,
			height: n.imageLeaf?.height ?? 0,
			visible: i.maskArtwork
		});
		let f = e.effectBox, p = Math.min(16, f.width / 2), m = Math.min(16, f.height / 2), h = Math.min(20, f.height / 2);
		this.rarityEffectBoxMaskLeaf?.set({
			x: f.x + p,
			y: f.y + m,
			width: Math.max(0, f.width - p * 2),
			height: Math.max(0, f.height - m - h),
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
			if (this.pendulumEffectMaskLeaf || (this.pendulumEffectMaskLeaf = new u(), this.leafer.add(this.pendulumEffectMaskLeaf)), e.frame.type !== "pendulum") {
				let e = g.normal;
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
				url: this.resourceUrl(g.pendulumArt.url),
				x: g.pendulumArt.x,
				y: g.pendulumArt.y,
				width: g.pendulumArt.width,
				height: g.pendulumArt.height,
				visible: !0,
				zIndex: 20
			}), this.pendulumEffectMaskLeaf.set({
				url: this.resourceUrl(g.pendulumEffect.url),
				x: g.pendulumEffect.x,
				y: g.pendulumEffect.y,
				width: g.pendulumEffect.width,
				height: g.pendulumEffect.height,
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
		this.nameBlockLeaf || (this.nameBlockLeaf = new u(), this.leafer.add(this.nameBlockLeaf));
		let t = h.nameBlock;
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
		this.foregroundClipBox || (this.foregroundClipBox = new c(), this.leafer.add(this.foregroundClipBox)), this.foregroundLeaf || (this.foregroundLeaf = new u(), this.foregroundClipBox.add(this.foregroundLeaf));
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
		let n = this, r = t(e.footer.rare, e.frame.type, e.footer.rarityEffect) === "pser2" && !e.rarityMask.coverName;
		this.titleShadowLeaf?.set({ zIndex: r ? 101 : 22 }), n.nameLeaf?.set({ zIndex: r ? 102 : 23 });
	}
	applyForegroundOverlayPolicy(e) {
		let n = this, r = t(e.footer.rare, e.frame.type, e.footer.rarityEffect) === "pser2", i = r && !e.rarityMask.coverLevel ? 101 : e.foreground.coverLevel ? 10 : 22;
		n.levelLeaf?.set({ zIndex: i }), n.rankLeaf?.set({ zIndex: i }), n.attributeLeaf?.set({ zIndex: r && !e.rarityMask.coverAttribute ? 101 : e.foreground.coverAttribute ? 10 : 22 });
		let a = this.foregroundVisible(e), o = r ? e.rarityMask.coverLevel ? a && e.foreground.coverLevel ? 20.5 : 22 : 101 : a ? e.foreground.coverLevel ? 20.5 : 22 : 120;
		n.linkArrowLeaf?.set({ zIndex: o });
	}
	drawEffectBox(e) {
		if (!this.leafer) return;
		let t = this;
		this.effectBoxFillLeaf || (this.effectBoxFillLeaf = new d(), this.leafer.add(this.effectBoxFillLeaf)), this.effectBoxBorderLeaf || (this.effectBoxBorderLeaf = new u(), this.leafer.add(this.effectBoxBorderLeaf));
		let n = e.effectBox, r = n.enabled && n.width > 0 && n.height > 0 && n.opacity > 0, i = n.borderStyle !== "none" && n.width > 0 && n.height > 0, a = Math.min(16, n.width / 2), o = Math.min(16, n.height / 2), s = Math.min(20, n.height / 2);
		this.effectBoxFillLeaf.set({
			x: n.x + a,
			y: n.y + o,
			width: Math.max(0, n.width - a * 2),
			height: Math.max(0, n.height - o - s),
			fill: n.color,
			opacity: n.opacity,
			visible: r,
			zIndex: 28
		});
		let c = (e.frame.effectBorderStyle === "auto" ? n.borderStyle === "colored" : e.frame.effectBorderStyle === "color") ? h.effectBox.coloredUrl : h.effectBox.defaultUrl;
		this.effectBoxBorderLeaf.set({
			url: this.resourceUrl(c),
			x: n.x,
			y: n.y,
			width: n.width,
			height: n.height,
			visible: i,
			zIndex: 29
		}), t.rareEffectBorderLeaf?.set({
			x: n.x,
			y: n.y,
			width: n.width,
			height: n.height
		});
	}
	drawMark25th(e) {
		if (!this.leafer) return;
		this.mark25thLeaf || (this.mark25thLeaf = new u(), this.leafer.add(this.mark25thLeaf));
		let t = h.mark25th;
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
export { x as YugiohCard, f as YugiohCardRenderError };
