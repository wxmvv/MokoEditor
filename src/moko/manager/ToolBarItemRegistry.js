import { Events } from "../model/Events.js";

export class ToolBarItemRegistry extends Events {
	constructor() {
		super();
		this.items = {};
	}

	registerToolBarItem(itemId, itemCreator) {
		// 检查是否已经存在该视图类型
		if (Object.prototype.hasOwnProperty.call(this.items, itemId)) {
			throw new Error(`Attempting to register an existing tool bar item "${itemId}"`);
		}
		// 注册视图
		this.items[itemId] = itemCreator;
		// 触发 "view-registered" 事件
		this.trigger("tool-bar-item-registered", itemId);
	}
	unregisterToolBarItem(itemId) {
		// 检查是否存在该视图类型
		if (Object.prototype.hasOwnProperty.call(this.items, itemId)) {
			// 删除视图类型
			delete this.items[itemId];
			// 触发 "view-unregistered" 事件
			this.trigger("tool-bar-item-unregistered", itemId);
		}
	}
}
