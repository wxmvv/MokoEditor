export class Vibrancy {
	constructor(moko) {
		this.moko = moko;
		this.vibrancy = "none";
		this.vibrancyTypes = [
			"none",
			"appearance-based",
			"titlebar",
			"selection",
			"menu",
			"popover",
			"sidebar",
			"header",
			"sheet",
			"window",
			"hud",
			"fullscreen-ui",
			"tooltip",
			"content",
			"under-window",
		];
		// this.init();
	}
	init() {
		this.setVibrancy("content");
	}
	// change-vibrancy
	setVibrancy(vibrancyType) {
		if (!this.vibrancyTypes.includes(vibrancyType)) return;
		this.vibrancy = vibrancyType;
		this.moko.adapter.ipcRenderer.send("change-vibrancy", vibrancyType);
		// this.moko.mokoEvent.emit("change-vibrancy", vibrancyType);
	}
	getVibrancy() {
		return this.vibrancy;
	}
}

export default Vibrancy;
