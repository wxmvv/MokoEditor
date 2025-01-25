import Component from "./Component";
export class ToolBar extends Component {
	constructor(parent, id) {
		super();
		this.id = id;
		this.moko = parent.moko;
		this.parent = parent;
		this.pane = parent.pane;
		this.containerEl = parent.containerEl.createDiv(id ? `${id}-tool-bar` : "tool-bar");

		this.items = {};
	}
	onload() {}
	onunload() {}
	addItemsById(ids) {
		ids.forEach((id) => this.addItemById(id));
	}
	addItemById(id) {
		const item = this.moko.ToolBarItemRegistry.items[id](this);
		this.items[item.id] = item;
		item.load();
	}
}

export default ToolBar;
