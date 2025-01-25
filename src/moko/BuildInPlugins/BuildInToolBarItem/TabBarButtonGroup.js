import Svg from "../../model/Svg";
import ToolBarItem from "../../views/content/ToolBarItem";
import NewSvg from "../../icons/plus.svg?raw";
import ZoomInSvg from "../../icons/maximize.svg?raw";
// import ZoomOutSvg from "../../icons/minimize.svg?raw";

import "./TabBarButtonGroup.css";

export class TabBarButtonGroup extends ToolBarItem {
	onload() {
		// const editor = this.moko.workspace.activeEditor;
		this.newFileButton = this.containerEl.createDiv("new-file-button");
		this.newFileButton.innerHTML = Svg({ id: "new", svgRaw: NewSvg, clickable: true });
		this.newFileButton.addEventListener("click", () => {
			// console.log("New Untitled Text File");
			this.moko.workspace.newUntitledTextFile();
		});
		this.zoomInBtn = this.containerEl.createDiv("zoom-in-button");
		this.zoomInBtn.innerHTML = Svg({ id: "ZoomIn", svgRaw: ZoomInSvg, clickable: true });
		this.zoomInBtn.addEventListener("click", () => {
			// TODO 将当前编辑器放大置顶 在多split中使用
			console.log("Zoom In");
			// this.moko.workspace.activeEditor.zoomIn();
		});
		// this.zoomOutBtn = this.containerEl.createDiv("zoom-out-button");
		// this.zoomOutBtn.innerHTML = Svg({ id: "ZoomOut", svgRaw: ZoomOutSvg ,clickable: true});
		// this.zoomOutBtn.addEventListener("click", () => {
		// 	console.log("Zoom Out");
		// });
	}

	onunload() {}
}

export default TabBarButtonGroup;
