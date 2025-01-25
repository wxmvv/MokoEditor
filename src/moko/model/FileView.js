import View from "./View";

export class FileView extends View {
	constructor(pane, id) {
		super(pane, id);
		this.file = null; //path 文件路径 name 文件名
	}
	// DONE override
	setFile() {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	canAcceptExtension(extension) {
		// return extensions.includes(extension);
		return false;
	}
	getDisplayText() {
		return this.file ? this.file.name : "unknown file";
	}
	getState() {
		// console.log("FileView.getState", this.file);
		const stateData = {};
		if (this.file) {
			stateData.file = this.file.path;
			stateData.path = this.file.path;
			stateData.name = this.file.name;
		}
		return stateData;
	}
	getFile() {
		return this.getState();
	}

	onload() {
		super.onload.call(this);
	}
	async onclose() {
		this.containerEl.empty();
		this.loadfile(null);
	}
}

export default FileView;
