class TitleBar {
	constructor(moko) {
		this.moko = moko;
		this.containerEl = null;
		this.leftEl = null;
		this.centerEl = null;
		this.rightEl = null;
		// load
		this.containerEl = this.moko.containerEl.createDiv("title-bar");
		this.containerEl.createDiv("title-bar-drag-region");
		this.leftEl = this.containerEl.createDiv("title-bar-left");
		this.centerEl = this.containerEl.createDiv("title-bar-center");
		this.rightEl = this.containerEl.createDiv("title-bar-right");
		this.titleEl = this.centerEl.createDiv("title-bar-title");
		this.moko.addElement("title-bar", this.containerEl);
		this.moko.addElement("title-bar-center", this.centerEl);
		this.moko.addElement("title-bar-left", this.leftEl);
		this.moko.addElement("title-bar-right", this.rightEl);
	}

	// Public
	setTitle(title = "") {
		this.titleEl.setText(title);
	}
	setTitleFromCurrentFile() {
		this.setTitle(this.moko.workspace.activeEditor.file.name);
	}
	registerTitleBarLeftItem() {
		return this.leftEl.createDiv("title-bar-item");
	}
	registerTitleBarRightItem() {
		return this.rightEl.createDiv("title-bar-item");
	}

	// Private
	registerTitleBarItem() {
		return this.containerEl.createDiv("title-bar-item");
	}
	registerTitleBarCenterItem() {
		return this.centerEl.createDiv("title-bar-item");
	}
}

export default TitleBar;
