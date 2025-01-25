class Font {
	constructor(moko) {
		// this.setting = setting; // 将 settings 作为属性保存
		this.moko = moko;
		this.fontList = ["zed-mono", "zed-mono-ex", "zed-mono", "zed-mono-ex", "??", "default"];
		this.UIFont = "zed-mono";
		this.textFont = "zed-sans";
	}
	init() {
		console.log("Font init");
	}
	getUIFont() {
		return this.UIFont;
	}
	getTextFont() {
		return this.textFont;
	}
	applyUIFont(fontFamily) {
		document.body.style.setProperty("--font-interface-override", fontFamily);
		this.UIFont = fontFamily;
	}
	applyTextFont(fontFamily) {
		document.body.style.setProperty("--font-text-override", fontFamily);
		this.textFont = fontFamily;
	}
}

export { Font };
export default Font;
