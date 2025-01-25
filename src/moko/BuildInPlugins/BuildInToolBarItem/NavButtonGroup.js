import Svg from "../../model/Svg";
import ToolBarItem from "../../views/content/ToolBarItem";
import GoBackSvg from "../../icons/arrow_left.svg?raw";
import GoForwardSvg from "../../icons/arrow_right.svg?raw";

import "./NavButtonGroup.css";

export class NavButtonGroup extends ToolBarItem {
	onload() {
		// const editor = this.moko.workspace.activeEditor;
		this.goBackBtn = this.containerEl.createDiv("nav-button-go-back");
		this.goBackBtn.innerHTML = Svg({ id: "GoBack", svgRaw: GoBackSvg, clickable: true });
		this.goBackBtn.addEventListener("click", () => {
			console.log("go back");
		});
		this.goForwardBtn = this.containerEl.createDiv("nav-button-go-forward");
		this.goForwardBtn.innerHTML = Svg({ id: "GoForward", svgRaw: GoForwardSvg, clickable: true });
		this.goForwardBtn.addEventListener("click", () => {
			console.log("go forward");
		});
	}

	onunload() {}
}

export default NavButtonGroup;
