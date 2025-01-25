export class PanelView {
	// containerEl: HTMLElement | null;
	// navigation = false;
	// closeable = false;
	constructor(panel) {
		this.containerEl = null;
		this.moko = panel.moko;
		this.viewType = this.getViewType() || "panel-view";
		this.containerEl = panel.containerEl.createDiv(`panel-content ${this.viewType}`);
		// MARK
		// this.headerEl = panel.containerEl.createDiv("panel-title");
		this.containerEl.setAttribute("data-type", this.getViewType());
	}

	async load() {
		await this.onload();
		// console.log("[Panel]", this.getViewType(), "onopen");
	}
	async unload() {
		await this.onunload();
		// console.log("[Panel]", this.getViewType(), "onclose");
	}
	async onload() {}
	async onunload() {}

	onResize() {}
	handleCut() {}
	handleCopy() {}
	handlePaste() {}

	getViewType() {}
	getDisplayText() {}
	setContainer(el) {
		this.containerEl = el;
	}
	getContainer() {
		return this.containerEl;
	}
}

export default PanelView;
