import { numberToFull as e } from "../utils/index.js";
import { Card as t } from "../card/index.js";
import { CompressText as n } from "../compress-text/compress-text.js";
import { getRarityFramePreset as r, resolveRarityEffect as i } from "./rarity.js";
import a from "./style/sc-style.js";
import o from "./style/tc-style.js";
import s from "./style/jp-style.js";
import c from "./style/kr-style.js";
import l from "./style/en-style.js";
import u from "./style/astral-style.js";
import d from "./style/custom1-style.js";
import f from "./style/custom2-style.js";
import { Group as p, Image as m, Rect as h, Text as g } from "leafer-unified";
//#region packages/src/yugioh-card/legacy-renderer.js
var _ = {
	x: 170,
	y: 375,
	width: 1054,
	height: 1054
}, v = {
	x: 94,
	y: 364,
	width: 1205,
	height: 900
}, y = class extends t {
	cardLeaf = null;
	nameLeaf = null;
	attributeLeaf = null;
	levelLeaf = null;
	rankLeaf = null;
	spellTrapLeaf = null;
	imageLeaf = null;
	maskLeaf = null;
	pendulumLeaf = null;
	pendulumDescriptionLeaf = null;
	packageLeaf = null;
	linkArrowLeaf = null;
	effectLeaf = null;
	descriptionLeaf = null;
	atkDefLinkLeaf = null;
	passwordLeaf = null;
	copyrightLeaf = null;
	laserLeaf = null;
	rareLeaf = null;
	rareCardBorderLeaf = null;
	rareArtBorderLeaf = null;
	rarePendulumArtBorderLeaf = null;
	rarePendulumEffectBorderLeaf = null;
	rareEffectBorderLeaf = null;
	attributeRareLeaf = null;
	twentiethLeaf = null;
	cardWidth = 1394;
	cardHeight = 2031;
	data = {
		language: "sc",
		font: "",
		name: "",
		color: "",
		align: "left",
		gradient: !1,
		gradientColor1: "#999999",
		gradientColor2: "#ffffff",
		type: "monster",
		attribute: "dark",
		icon: "",
		image: "",
		cardType: "normal",
		pendulumType: "normal-pendulum",
		level: 0,
		rank: 0,
		pendulumScale: 0,
		pendulumDescription: "",
		monsterType: "",
		atkBar: !0,
		atk: 0,
		def: 0,
		arrowList: [],
		description: "",
		firstLineCompress: !1,
		descriptionAlign: !1,
		descriptionZoom: 1,
		descriptionWeight: 0,
		package: "",
		password: "",
		copyright: "",
		laser: "",
		rare: "",
		twentieth: !1,
		radius: !0,
		scale: 1
	};
	constructor(e = {}) {
		super(e), this.initLeafer(), this.setData(e.data);
	}
	get tag() {
		return "YugiohCard";
	}
	draw() {
		this.drawCard(), this.drawName(), this.drawAttribute(), this.drawLevel(), this.drawRank(), this.drawSpellTrap(), this.drawImage(), this.drawMask(), this.drawPendulum(), this.drawPendulumDescription(), this.drawPackage(), this.drawLinkArrow(), this.drawEffect(), this.drawDescription(), this.drawAtkDefLink(), this.drawPassword(), this.drawCopyright(), this.drawLaser(), this.drawRare(), this.drawAttributeRare(), this.drawTwentieth(), this.updateScale();
	}
	drawCard() {
		this.cardLeaf || (this.cardLeaf = new m(), this.leafer.add(this.cardLeaf)), this.cardLeaf.set({
			url: this.cardUrl,
			cornerRadius: this.data.radius ? 24 : 0,
			zIndex: 0
		});
	}
	drawName() {
		let { name: e } = this.style;
		this.nameLeaf || (this.nameLeaf = new n(), this.leafer.add(this.nameLeaf)), this.nameLeaf.set({
			text: this.data.name,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			letterSpacing: e.letterSpacing || 0,
			wordSpacing: e.wordSpacing || 0,
			textAlign: this.data.align || "left",
			color: this.data.color || this.autoNameColor,
			gradient: this.data.gradient,
			gradientStroke: this.data.gradientStroke,
			gradientColor1: this.data.gradientColor1,
			gradientColor2: this.data.gradientColor2,
			rtFontSize: e.rtFontSize,
			rtTop: e.rtTop,
			rtColor: this.autoNameColor,
			width: this.showAttribute ? 1033 : 1161,
			height: 200,
			x: 116,
			y: e.top,
			zIndex: 10
		});
	}
	drawAttribute() {
		this.attributeLeaf || (this.attributeLeaf = new m(), this.leafer.add(this.attributeLeaf)), this.attributeLeaf.set({
			url: this.attributeUrl,
			x: 1163,
			y: 96,
			visible: this.showAttribute,
			zIndex: 10
		});
	}
	drawLevel() {
		if (!this.levelLeaf) {
			this.levelLeaf = new p();
			for (let e = 0; e < 13; e++) {
				let e = new m();
				this.levelLeaf.add(e);
			}
			this.leafer.add(this.levelLeaf);
		}
		let e = `${this.baseImage}/level/level.png`, t = this.data.level < 13 ? 147 : 101;
		this.levelLeaf.children.forEach((n, r) => {
			n.set({
				url: e,
				x: this.cardWidth - t - r * 92,
				y: 247,
				around: {
					type: "percent",
					x: 1,
					y: 0
				},
				visible: r < this.data.level
			});
		}), this.levelLeaf.set({
			visible: this.showLevel,
			zIndex: 10
		});
	}
	drawRank() {
		if (!this.rankLeaf) {
			this.rankLeaf = new p();
			for (let e = 0; e < 13; e++) {
				let e = new m();
				this.rankLeaf.add(e);
			}
			this.leafer.add(this.rankLeaf);
		}
		let e = `${this.baseImage}/level/rank.png`, t = this.data.rank < 13 ? 147 : 101;
		this.rankLeaf.children.forEach((n, r) => {
			n.set({
				url: e,
				x: t + r * 92,
				y: 247,
				visible: r < this.data.rank
			});
		}), this.rankLeaf.set({
			visible: this.showRank,
			zIndex: 10
		});
	}
	drawSpellTrap() {
		if (!this.spellTrapLeaf) {
			this.spellTrapLeaf = new p();
			let e = new n(), t = new m(), r = new n();
			this.spellTrapLeaf.add(e), this.spellTrapLeaf.add(t), this.spellTrapLeaf.add(r), this.leafer.add(this.spellTrapLeaf);
		}
		let { spellTrap: e } = this.style, { icon: t } = e, r = this.data.icon ? `${this.baseImage}/icon/icon-${this.data.icon}.png` : "", i = this.data.icon ? 72 : 0, a = ["en", "kr"].includes(this.data.language) ? "[" : "【", o = ["en", "kr"].includes(this.data.language) ? "]" : "】", s = e.letterSpacing || 0, c = e.wordSpacing || 0, l = this.spellTrapLeaf.children[0], u = this.spellTrapLeaf.children[1], d = this.spellTrapLeaf.children[2];
		l.set({
			text: o,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			letterSpacing: s,
			wordSpacing: c,
			scaleY: e.scaleY || 1,
			y: e.top
		});
		let f = l.bounds;
		l.x = this.cardWidth - e.right - f.width, u.set({
			url: r,
			x: l.x - (this.data.icon && t.marginRight || 0) - i,
			y: e.top + (t.marginTop || 0)
		}), d.set({
			text: a + this.spellTrapName,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			letterSpacing: s,
			wordSpacing: c,
			scaleY: e.scaleY || 1,
			rtFontSize: e.rtFontSize,
			rtTop: e.rtTop,
			rtFontScaleX: e.rtFontScaleX || 1,
			y: e.top
		});
		let h = d.bounds;
		d.x = u.x - (this.data.icon && t.marginLeft || 0) - h.width, this.spellTrapLeaf.set({
			visible: ["spell", "trap"].includes(this.data.type),
			zIndex: 10
		});
	}
	drawImage() {
		this.imageLeaf || (this.imageLeaf = new h(), this.listenImageStatus(this.imageLeaf), this.leafer.add(this.imageLeaf)), this.imageLeaf.set({
			width: this.data.type === "pendulum" ? 1205 : 1054,
			height: this.data.type === "pendulum" ? 1205 : 1054,
			x: this.data.type === "pendulum" ? 94 : 170,
			y: this.data.type === "pendulum" ? 364 : 375,
			fill: {
				type: "image",
				url: this.data.image,
				mode: "cover",
				align: "top"
			},
			visible: this.data.image,
			zIndex: 10
		});
	}
	drawMask() {
		this.maskLeaf || (this.maskLeaf = new m(), this.leafer.add(this.maskLeaf));
		let e = this.data.type === "pendulum" ? `${this.baseImage}/pendulum-frame/pframe-art-base.png` : `${this.baseImage}/art-border/art-frame-base.png`;
		this.maskLeaf.set({
			url: e,
			x: this.data.type === "pendulum" ? 68 : 117,
			y: this.data.type === "pendulum" ? 342 : 322,
			zIndex: 20
		});
	}
	drawPendulum() {
		if (!this.pendulumLeaf) {
			this.pendulumLeaf = new p();
			let e = new g(), t = new g();
			this.pendulumLeaf.add(e), this.pendulumLeaf.add(t), this.leafer.add(this.pendulumLeaf);
		}
		let e = this.pendulumLeaf.children[0], t = this.pendulumLeaf.children[1], n = this.data.language === "astral" ? 144 : 145;
		e.set({
			text: this.data.pendulumScale,
			fontFamily: this.data.language === "astral" ? "ygo-astral" : "ygo-atk-def",
			fontSize: this.data.language === "astral" ? 84 : 98,
			fill: "black",
			letterSpacing: this.data.language === "astral" ? 0 : -10,
			x: n,
			y: this.data.language === "astral" ? 1389 : 1370,
			around: {
				type: "percent",
				x: .5,
				y: 0
			}
		}), n = this.data.language === "astral" ? 1250 : 1249, t.set({
			text: this.data.pendulumScale,
			fontFamily: this.data.language === "astral" ? "ygo-astral" : "ygo-atk-def",
			fontSize: this.data.language === "astral" ? 84 : 98,
			fill: "black",
			letterSpacing: this.data.language === "astral" ? 0 : -10,
			x: n,
			y: this.data.language === "astral" ? 1389 : 1370,
			around: {
				type: "percent",
				x: .5,
				y: 0
			}
		}), this.pendulumLeaf.set({
			visible: this.data.type === "pendulum",
			zIndex: 30
		});
	}
	drawPendulumDescription() {
		this.pendulumDescriptionLeaf || (this.pendulumDescriptionLeaf = new n(), this.leafer.add(this.pendulumDescriptionLeaf));
		let { pendulumDescription: e } = this.style;
		this.pendulumDescriptionLeaf.set({
			text: this.data.pendulumDescription,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			fontScale: this.data.descriptionZoom,
			strokeWidth: this.data.descriptionWeight,
			lineHeight: e.lineHeight,
			letterSpacing: e.letterSpacing || 0,
			wordSpacing: e.wordSpacing || 0,
			rtFontSize: e.rtFontSize,
			rtStrokeWidth: this.data.descriptionWeight,
			rtTop: e.rtTop,
			width: 950,
			height: 230,
			x: 221,
			y: e.top,
			visible: this.data.type === "pendulum",
			zIndex: 30
		});
	}
	drawPackage() {
		if (this.packageLeaf || (this.packageLeaf = new n(), this.leafer.add(this.packageLeaf)), this.packageLeaf.set({
			text: this.data.package,
			fontFamily: "ygo-password",
			fontSize: 40,
			color: this.data.type === "monster" && this.data.cardType === "xyz" ? "white" : "black",
			textAlign: this.data.type === "pendulum" ? "left" : "right",
			y: this.data.type === "pendulum" ? 1859 : 1455,
			zIndex: 30
		}), this.data.type === "pendulum") this.packageLeaf.x = 116;
		else {
			let e = this.packageLeaf.bounds, t = this.data.type === "monster" && this.data.cardType === "link" ? 252 : 148;
			this.packageLeaf.x = this.cardWidth - t - e.width;
		}
	}
	drawLinkArrow() {
		if (!this.linkArrowLeaf) {
			this.linkArrowLeaf = new p();
			for (let e = 0; e < 8; e++) {
				let e = new m();
				this.linkArrowLeaf.add(e);
			}
			this.leafer.add(this.linkArrowLeaf);
		}
		let e = [
			{
				x: 555,
				y: 278,
				url: this.baseImage + "/linkmarker/arrow-up-on.png"
			},
			{
				x: 1130,
				y: 299,
				url: this.baseImage + "/linkmarker/arrow-right-up-on.png"
			},
			{
				x: 1223,
				y: 761,
				url: this.baseImage + "/linkmarker/arrow-right-on.png"
			},
			{
				x: 1130,
				y: 1336,
				url: this.baseImage + "/linkmarker/arrow-right-down-on.png"
			},
			{
				x: 555,
				y: 1428,
				url: this.baseImage + "/linkmarker/arrow-down-on.png"
			},
			{
				x: 95,
				y: 1336,
				url: this.baseImage + "/linkmarker/arrow-left-down-on.png"
			},
			{
				x: 71,
				y: 758,
				url: this.baseImage + "/linkmarker/arrow-left-on.png"
			},
			{
				x: 95,
				y: 299,
				url: this.baseImage + "/linkmarker/arrow-left-up-on.png"
			}
		], t = [
			{
				x: 555,
				y: 278,
				url: this.baseImage + "/linkmarker/arrow-up-off.png"
			},
			{
				x: 1130,
				y: 299,
				url: this.baseImage + "/linkmarker/arrow-right-up-off.png"
			},
			{
				x: 1223,
				y: 761,
				url: this.baseImage + "/linkmarker/arrow-right-off.png"
			},
			{
				x: 1130,
				y: 1336,
				url: this.baseImage + "/linkmarker/arrow-right-down-off.png"
			},
			{
				x: 555,
				y: 1428,
				url: this.baseImage + "/linkmarker/arrow-down-off.png"
			},
			{
				x: 95,
				y: 1336,
				url: this.baseImage + "/linkmarker/arrow-left-down-off.png"
			},
			{
				x: 71,
				y: 758,
				url: this.baseImage + "/linkmarker/arrow-left-off.png"
			},
			{
				x: 95,
				y: 299,
				url: this.baseImage + "/linkmarker/arrow-left-up-off.png"
			}
		];
		this.linkArrowLeaf.children.forEach((n, r) => {
			let i = this.data.arrowList.includes(r + 1);
			n.set({
				url: i ? e[r].url : t[r].url,
				x: i ? e[r].x : t[r].x,
				y: i ? e[r].y : t[r].y
			});
		}), this.linkArrowLeaf.set({
			visible: this.data.type === "monster" && this.data.cardType === "link",
			zIndex: 120
		});
	}
	drawEffect() {
		this.effectLeaf || (this.effectLeaf = new n(), this.leafer.add(this.effectLeaf));
		let { effect: e } = this.style, t = ["en", "kr"].includes(this.data.language) ? "[" : "【", r = ["en", "kr"].includes(this.data.language) ? "]" : "】";
		this.effectLeaf.set({
			text: t + this.data.monsterType + r,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			strokeWidth: this.data.descriptionWeight,
			lineHeight: e.lineHeight,
			letterSpacing: e.letterSpacing || 0,
			wordSpacing: e.wordSpacing || 0,
			rtFontSize: e.rtFontSize,
			rtStrokeWidth: this.data.descriptionWeight,
			rtTop: e.rtTop,
			width: 1175,
			height: 100,
			x: 109 + (e.textIndent || 0),
			y: e.top,
			visible: this.showEffect,
			zIndex: 30
		});
	}
	drawDescription() {
		this.descriptionLeaf || (this.descriptionLeaf = new n(), this.leafer.add(this.descriptionLeaf));
		let { effect: e, description: t } = this.style, r = e.minHeight || 0;
		this.showEffect && (r = e.fontSize * e.lineHeight);
		let i = t.fontFamily;
		this.data.language === "en" && !this.data.font && (this.data.type === "monster" && this.data.cardType === "normal" || this.data.type === "pendulum" && this.data.pendulumType === "normal-pendulum") && (i = "ygo-en-italic");
		let a = 385;
		["spell", "trap"].includes(this.data.type) || (this.showEffect && (a -= r), this.data.atkBar && (a -= 60)), this.descriptionLeaf.set({
			text: this.data.description,
			fontFamily: i,
			fontSize: t.fontSize,
			fontScale: this.data.descriptionZoom,
			textAlign: this.data.descriptionAlign ? "center" : "justify",
			firstLineCompress: this.data.firstLineCompress,
			strokeWidth: this.data.descriptionWeight,
			lineHeight: t.lineHeight,
			letterSpacing: t.letterSpacing || 0,
			wordSpacing: t.wordSpacing || 0,
			rtFontSize: t.rtFontSize,
			rtStrokeWidth: this.data.descriptionWeight,
			rtTop: t.rtTop,
			autoSmallSize: !!t.smallFontSize,
			smallFontSize: t.smallFontSize,
			width: 1175,
			height: a,
			x: 109,
			y: e.top + r,
			zIndex: 30
		});
	}
	drawAtkDefLink() {
		if (!this.atkDefLinkLeaf) {
			this.atkDefLinkLeaf = new p();
			let e = new m(), t = new g(), n = new g(), r = new g();
			this.atkDefLinkLeaf.add(e), this.atkDefLinkLeaf.add(t), this.atkDefLinkLeaf.add(n), this.atkDefLinkLeaf.add(r), this.leafer.add(this.atkDefLinkLeaf);
		}
		let t = this.atkDefLinkLeaf.children[0], n = this.atkDefLinkLeaf.children[1], r = this.atkDefLinkLeaf.children[2], i = this.atkDefLinkLeaf.children[3];
		t.set({
			url: this.atkDefLinkUrl,
			x: 109,
			y: 1844
		});
		let a = "";
		this.data.atk >= 0 ? a = this.data.language === "astral" ? e(this.data.atk) : this.data.atk : this.data.atk === -1 ? a = "?" : this.data.atk === -2 && (a = "∞");
		let o = this.data.language === "astral" ? 898 : 999;
		n.set({
			text: a,
			fontFamily: this.data.language === "astral" ? "ygo-astral" : "ygo-atk-def",
			fontSize: this.data.language === "astral" ? 49 : 62,
			fill: "black",
			letterSpacing: this.data.language === "astral" ? 0 : 2,
			x: o,
			y: this.data.language === "astral" ? 1850 : 1839,
			around: {
				type: "percent",
				x: 1,
				y: 0
			},
			visible: ["monster", "pendulum"].includes(this.data.type)
		});
		let s = "";
		this.data.def >= 0 ? s = this.data.language === "astral" ? e(this.data.def) : this.data.def : this.data.def === -1 ? s = "?" : this.data.def === -2 && (s = "∞");
		let c = this.data.language === "astral" ? 1279 : 1282;
		r.set({
			text: s,
			fontFamily: this.data.language === "astral" ? "ygo-astral" : "ygo-atk-def",
			fontSize: this.data.language === "astral" ? 49 : 62,
			fill: "black",
			letterSpacing: this.data.language === "astral" ? 0 : 2,
			x: c,
			y: this.data.language === "astral" ? 1850 : 1839,
			around: {
				type: "percent",
				x: 1,
				y: 0
			},
			visible: this.data.type === "monster" && this.data.cardType !== "link" || this.data.type === "pendulum"
		});
		let l = this.data.language === "astral" ? e(this.data.arrowList.length) : this.data.arrowList.length, u = this.data.language === "astral" ? 1279 : 1280;
		i.set({
			text: l,
			fontFamily: this.data.language === "astral" ? "ygo-astral" : "ygo-link",
			fontSize: this.data.language === "astral" ? 49 : 44,
			fill: "black",
			letterSpacing: this.data.language === "astral" ? 0 : 2,
			x: u,
			y: this.data.language === "astral" ? 1850 : 1855,
			around: {
				type: "percent",
				x: 1,
				y: 0
			},
			scaleX: this.data.language === "astral" ? 1 : 1.3,
			visible: this.data.type === "monster" && this.data.cardType === "link"
		}), this.atkDefLinkLeaf.set({
			visible: this.showAtkDefLink,
			zIndex: 30
		});
	}
	drawPassword() {
		this.passwordLeaf || (this.passwordLeaf = new n(), this.leafer.add(this.passwordLeaf)), this.passwordLeaf.set({
			text: this.data.password,
			fontFamily: "ygo-password",
			fontSize: 40,
			color: this.data.type === "monster" && this.data.cardType === "xyz" ? "white" : "black",
			x: 66,
			y: 1932,
			zIndex: 30
		});
	}
	drawCopyright() {
		this.copyrightLeaf || (this.copyrightLeaf = new m(), this.leafer.add(this.copyrightLeaf));
		let e = this.data.type === "monster" && this.data.cardType === "xyz" ? "white" : "black", t = this.data.copyright ? `${this.baseImage}/copyright/copyright-${this.data.copyright}-${e}.svg` : "";
		this.copyrightLeaf.set({
			url: t,
			x: this.cardWidth - 141,
			y: 1936,
			around: {
				type: "percent",
				x: 1,
				y: 0
			},
			visible: this.data.copyright,
			zIndex: 30
		});
	}
	drawLaser() {
		this.laserLeaf || (this.laserLeaf = new m(), this.leafer.add(this.laserLeaf));
		let e = this.data.laser ? `${this.baseImage}/fp-mark/${this.data.laser}.png` : "";
		this.laserLeaf.set({
			url: e,
			x: 1276,
			y: 1913,
			visible: this.data.laser,
			zIndex: 120
		});
	}
	drawRare() {
		this.rareLeaf || (this.rareLeaf = new m(), this.leafer.add(this.rareLeaf)), this.rareCardBorderLeaf || (this.rareCardBorderLeaf = new m(), this.leafer.add(this.rareCardBorderLeaf)), this.rareArtBorderLeaf || (this.rareArtBorderLeaf = new m(), this.leafer.add(this.rareArtBorderLeaf)), this.rarePendulumArtBorderLeaf || (this.rarePendulumArtBorderLeaf = new m(), this.leafer.add(this.rarePendulumArtBorderLeaf)), this.rarePendulumEffectBorderLeaf || (this.rarePendulumEffectBorderLeaf = new m(), this.leafer.add(this.rarePendulumEffectBorderLeaf)), this.rareEffectBorderLeaf || (this.rareEffectBorderLeaf = new m(), this.leafer.add(this.rareEffectBorderLeaf));
		let e = i(this.data.rare, this.data.type, this.data.rarityEffect), t = r(this.data.rare, this.data.type);
		for (let e of [
			"cardBorderStyle",
			"artBorderStyle",
			"effectBorderStyle"
		]) this.data[e] && this.data[e] !== "auto" && (t[e] = this.data[e]);
		let n = t.cardBorderStyle === "default" ? "" : t.cardBorderStyle, a = t.artBorderStyle === "default" ? "" : t.artBorderStyle, o = (e) => e === "silver" ? "sliver" : e === "color" ? "gold" : e, s = a ? o(a) : "", c = t.effectBorderStyle === "default" ? "" : o(t.effectBorderStyle), l = t.effectBorderStyle === "color" ? "color" : "", u = this.data.type === "pendulum", d = e === "none" ? "" : `${this.baseImage}/rare-effect/rare-${e}.png`, f = u && e === "hr", p = v.width / _.width, h = v.height / _.height;
		this.rareLeaf.set({
			url: d,
			x: f ? v.x - _.x * p : 0,
			y: f ? v.y - _.y * h : 0,
			width: f ? this.cardWidth * p : this.cardWidth,
			height: f ? this.cardHeight * h : this.cardHeight,
			cornerRadius: this.data.radius ? 24 : 0,
			visible: e !== "none",
			zIndex: 100
		}), this.rareCardBorderLeaf.set({
			url: n ? `${this.baseImage}/card-border/card-border-${n}.png` : "",
			cornerRadius: this.data.radius ? 24 : 0,
			visible: !!n,
			zIndex: 20.5
		}), this.rareArtBorderLeaf.set({
			url: a ? `${this.baseImage}/art-border/art-frame-${a}.png` : "",
			x: 117,
			y: 322,
			visible: !!a && !u,
			zIndex: 20.5
		}), this.rarePendulumArtBorderLeaf.set({
			url: s ? `${this.baseImage}/pendulum-frame/pframe-art-${s}.png` : "",
			x: 68,
			y: 342,
			visible: !!s && u,
			zIndex: 20.5
		}), this.rarePendulumEffectBorderLeaf.set({
			url: c ? `${this.baseImage}/pendulum-frame/pframe-effect-${c}.png` : "",
			x: 68,
			y: 1256,
			visible: !!c && u,
			zIndex: 22
		}), this.rareEffectBorderLeaf.set({
			url: l ? `${this.baseImage}/effect-border/eblock-border-${l}.png` : "",
			x: 77,
			y: 1501,
			visible: !!l && !u,
			zIndex: this.data.effectBorderStyle && this.data.effectBorderStyle !== "auto" ? 20.5 : 29
		});
	}
	drawAttributeRare() {
		this.attributeRareLeaf || (this.attributeRareLeaf = new m(), this.leafer.add(this.attributeRareLeaf));
		let e = `${this.baseImage}/attribute/attribute-rare.png`;
		this.attributeRareLeaf.set({
			url: e,
			x: 1163,
			y: 96,
			visible: this.showAttributeRare,
			zIndex: 30
		});
	}
	drawTwentieth() {
		this.twentiethLeaf || (this.twentiethLeaf = new m(), this.leafer.add(this.twentiethLeaf));
		let e = `${this.baseImage}/watermark/twentieth.png`;
		this.twentiethLeaf.set({
			url: e,
			x: 472,
			y: 1532,
			visible: this.data.twentieth,
			zIndex: 10
		});
	}
	get baseImage() {
		return this.resourceUrl("/yugioh/image");
	}
	get style() {
		let e = {};
		return this.data.font ? this.data.font === "custom1" ? e = d : this.data.font === "custom2" && (e = f) : this.data.language === "sc" ? e = a : this.data.language === "tc" ? e = o : this.data.language === "jp" ? e = s : this.data.language === "kr" ? e = c : this.data.language === "en" ? e = l : (this.data.language === "astral" || this.data.language === "astral") && (e = u), e;
	}
	get cardUrl() {
		return this.data.type === "monster" ? `${this.baseImage}/card/card-${this.data.cardType}.png` : this.data.type === "pendulum" ? `${this.baseImage}/card/card-${this.data.pendulumType}.png` : `${this.baseImage}/card/card-${this.data.type}.png`;
	}
	get autoNameColor() {
		let e = "black";
		return (this.data.type === "monster" && ["xyz", "link"].includes(this.data.cardType) || ["spell", "trap"].includes(this.data.type) || this.data.type === "pendulum" && ["xyz-pendulum", "link-pendulum"].includes(this.data.pendulumType)) && (e = "white"), e;
	}
	get showAttribute() {
		return ["monster", "pendulum"].includes(this.data.type) ? !!this.data.attribute : !0;
	}
	get attributeUrl() {
		let e = "";
		return this.data.language === "jp" ? e = "-jp" : this.data.language === "kr" ? e = "-kr" : this.data.language === "en" ? e = "-en" : this.data.language === "astral" && (e = "-astral"), ["monster", "pendulum"].includes(this.data.type) ? this.data.attribute ? `${this.baseImage}/attribute/attribute-${this.data.attribute}${e}.png` : "" : `${this.baseImage}/attribute/attribute-${this.data.type}${e}.png`;
	}
	get spellTrapName() {
		let e = "";
		return this.data.language === "sc" || this.data.language === "tc" ? this.data.type === "spell" ? e = "魔法卡" : this.data.type === "trap" && (e = "陷阱卡") : this.data.language === "jp" ? this.data.type === "spell" ? e = "[魔(ま)][法(ほう)]カード" : this.data.type === "trap" && (e = "[罠(トラップ)]カード") : this.data.language === "kr" ? this.data.type === "spell" ? e = "마법 카드" : this.data.type === "trap" && (e = "함정 카드") : this.data.language === "en" ? this.data.type === "spell" ? e = "Spell Card" : this.data.type === "trap" && (e = "Trap Card") : this.data.language === "astral" && (this.data.type === "spell" ? e = "マホウカアド" : this.data.type === "trap" && (e = "トラププカアド")), e;
	}
	get showAttributeRare() {
		return this.showAttribute && [
			"hr",
			"ser",
			"ser-pendulum",
			"pser2"
		].includes(i(this.data.rare, this.data.type, this.data.rarityEffect));
	}
	get showLevel() {
		let e = !1;
		return this.data.type === "monster" ? e = [
			"normal",
			"effect",
			"ritual",
			"fusion",
			"synchro",
			"token"
		].includes(this.data.cardType) : this.data.type === "pendulum" && (e = [
			"normal-pendulum",
			"effect-pendulum",
			"ritual-pendulum",
			"fusion-pendulum",
			"synchro-pendulum"
		].includes(this.data.pendulumType)), e;
	}
	get showRank() {
		let e = !1;
		return this.data.type === "monster" ? e = this.data.cardType === "xyz" : this.data.type === "pendulum" && (e = this.data.pendulumType === "xyz-pendulum"), e;
	}
	get showEffect() {
		return ["monster", "pendulum"].includes(this.data.type) && this.data.monsterType;
	}
	get showAtkDefLink() {
		if (!this.data.atkBar) return !1;
		if (this.data.language === "astral") {
			if (this.data.type === "monster" && this.data.cardType !== "link" || this.data.type === "pendulum" || this.data.type === "monster" && this.data.cardType === "link") return !0;
		} else if (this.data.type === "monster" && this.data.cardType !== "link" || this.data.type === "pendulum" || this.data.type === "monster" && this.data.cardType === "link") return !0;
		return !1;
	}
	get atkDefLinkUrl() {
		let e = "";
		return this.data.language === "astral" ? ((this.data.type === "monster" && this.data.cardType !== "link" || this.data.type === "pendulum") && (e = `${this.baseImage}/text/atk-def-astral.svg`), this.data.type === "monster" && this.data.cardType === "link" && (e = `${this.baseImage}/text/atk-link-astral.svg`)) : ((this.data.type === "monster" && this.data.cardType !== "link" || this.data.type === "pendulum") && (e = `${this.baseImage}/text/atk-def.svg`), this.data.type === "monster" && this.data.cardType === "link" && (e = `${this.baseImage}/text/atk-link.svg`)), e;
	}
};
//#endregion
export { y as LegacyYugiohCardRenderer };
