import Svg from "../../model/Svg";
import BoldSvg from "../../icons/bold.svg?raw";
import UndoSvg from "../../icons/undo.svg?raw";
import RedoSvg from "../../icons/redo.svg?raw";
import ToolBarItem from "../../views/content/ToolBarItem";

import "./EditorButtonGroup.css";

export class EditorButtonGroup extends ToolBarItem {
	onload() {
		this.undoBtn = this.containerEl.createDiv("editor-button-undo");
		this.undoBtn.innerHTML = Svg({ id: "undo", svgRaw: UndoSvg, clickable: true });
		this.undoBtn.addEventListener("click", () => {
			console.log("undo");
			this.moko.workspace.activeEditor.undo();
		});
		this.redoBtn = this.containerEl.createDiv("editor-button-redo");
		this.redoBtn.innerHTML = Svg({ id: "redo", svgRaw: RedoSvg, clickable: true });
		this.redoBtn.addEventListener("click", () => {
			console.log("redo");
			this.moko.workspace.activeEditor.redo();
		});
		this.boldBtn = this.containerEl.createDiv("editor-button-bold");
		this.boldBtn.innerHTML = Svg({ id: "bold", svgRaw: BoldSvg, clickable: true });
		this.boldBtn.addEventListener("click", () => {
			console.log("bold");
			// this.moko.workspace.activeEditor.doc.bold();
		});
	}

	onunload() {}
}

export default EditorButtonGroup;
