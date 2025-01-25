import ToolBar from "../../model/ToolBar";

export class EditorToolBar extends ToolBar {
	constructor(container) {
		super(container, "editor");
	}
	static get VIEW_TYPE() {
		return "editor-tool-bar";
	}
	onload() {
		this.addItemsById(["file-path", "editor-button-group"]);
	}

	onunload() {}
}

export default EditorToolBar;
