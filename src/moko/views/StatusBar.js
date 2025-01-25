// DONE StatusBar
export class StatusBar {
	constructor(moko) {
		this.moko = moko;
		this.containerEl = null;
		this.leftEl = null;
		this.rightEl = null;
		// this.items = {}; // this.items = [];
		// load
		this.containerEl = this.moko.containerEl.createDiv("status-bar glass");
		this.leftEl = this.containerEl.createDiv("status-bar-left");
		this.rightEl = this.containerEl.createDiv("status-bar-right");
		this.moko.addElement("status-bar", this.containerEl);
		this.moko.addElement("status-bar-left", this.leftEl);
		this.moko.addElement("status-bar-right", this.rightEl);
	}

	// Public
	registerStatusBarLeftItem() {
		return this.leftEl.createDiv("status-bar-item");
	}
	registerStatusBarRightItem() {
		return this.rightEl.createDiv("status-bar-item");
	}
	//Pravite
	registerStatusBarItem() {
		return this.containerEl.createDiv("status-bar-item");
	}
}

export default StatusBar;
