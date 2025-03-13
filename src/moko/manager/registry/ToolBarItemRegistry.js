import { Events } from "../../model/Events.js";

export class ToolBarItemRegistry extends Events {
	constructor() {
		super();
		this.items = {};
	}

	registerToolBarItem(itemId, itemCreator) {
		if (Object.prototype.hasOwnProperty.call(this.items, itemId)) throw new Error(`Attempting to register an existing tool bar item "${itemId}"`); // 检查是否已经存在该视图类型
		this.items[itemId] = itemCreator;
		this.trigger("tool-bar-item-registered", itemId); // "view-registered" event
	}

	unregisterToolBarItem(itemId) {
		if (Object.prototype.hasOwnProperty.call(this.items, itemId)) {
			delete this.items[itemId];
			this.trigger("tool-bar-item-unregistered", itemId); // "view-unregistered" event
		}
	}
}

export default ToolBarItemRegistry;
