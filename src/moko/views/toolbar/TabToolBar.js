import ToolBar from "../../model/ToolBar";

export class TabToolBar extends ToolBar {
	constructor(parent) {
		super(parent, "tab");
	}
	static get VIEW_TYPE() {
		return "tab-bar";
	}
	getTabGroup() {
		return this.items["tab-group"];
	}
	onload() {
		this.addItemsById(["nav-button-group", "tab-group", "tab-bar-button-group"]);
	}

	onunload() {}
}

export default TabToolBar;
