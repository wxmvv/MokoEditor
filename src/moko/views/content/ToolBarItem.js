import Component from "../../model/Component.js";

export class ToolBarItem extends Component {
	constructor(parent, id) {
		super();
		this.id = id;
		this.parent = parent;
		this.pane = parent.pane;
		this.moko = parent.moko;
		this.containerEl = parent.containerEl.createDiv("tool-bar-item");
		if (id) this.containerEl.classList.add(`${id}`);
		// 新建完直接load
		// this.load();
		// this.instance = this;
		// return this;
	}

	// registerToolbarItem = function (itemId, toolbarItem) {
	// 	this.moko.ToolBarItemRegistry.registerToolbarItem(itemId, toolbarItem);
	// 	this.register(function () {
	// 		return this.moko.ToolBarItemRegistry.unregisterToolbarItem(itemId);
	// 	});
	// };

	onload() {
		console.log("loading ToolBarItem");
	}
	onunload() {
		console.log("unloading ToolBarItem");
	}
}
export default ToolBarItem;
