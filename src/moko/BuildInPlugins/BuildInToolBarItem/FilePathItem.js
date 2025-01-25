import ToolBarItem from "../../views/content/ToolBarItem";
import "./FilePathItem.css";
export class FilePathItem extends ToolBarItem {
	onload() {
		this.fileNameItem = this.containerEl.createDiv("file-name-item");
		this.fileNameItem.setText(this.pane.view.file.name);
		this.filePathItem = this.containerEl.createDiv("file-path-item");
		this.filePathItem.setText(this.pane.view.file.path);

		this.pane.on("file-change", (pane) => {
			this.fileNameItem.setText(pane.view.file.name || "undefined");
			this.filePathItem.setText(pane.view.file.path || "undefined");
		});
	}

	onunload() {}
}

export default FilePathItem;
