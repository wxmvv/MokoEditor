import { Events } from "../../model/Events.js";

import TabBar from "../../views/toolbar/TabToolBar.js";
import EditorToolBar from "../../views/toolbar/EditorToolBar.js";

export class ToolBarRegistry extends Events {
	constructor() {
		super();
		this.toolBarRegistry = {}; // Toolbar id : ToolbarCreator

		this.registerToolbar(TabBar.VIEW_TYPE, (view) => new TabBar(view));
		this.registerToolbar(EditorToolBar.VIEW_TYPE, (view) => new EditorToolBar(view));
	}

	registerToolbar(id, ToolbarCreator) {
		this.toolBarRegistry[id] = ToolbarCreator;
	}
	unRegisterToolbar(id) {
		delete this.toolBarRegistry[id];
	}
	getToolbarById(id) {
		return this.toolBarRegistry[id];
	}
}

export default ToolBarRegistry;
