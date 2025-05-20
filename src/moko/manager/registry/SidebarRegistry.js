import { Events } from "../../model/Events.js";

export class SidebarRegistry extends Events {
	constructor() {
		super();
		this.sidebarByType = {}; // ViewType string : ViewCreator
	}

	registerSidebar(viewType, viewCreator) {
		if (Object.prototype.hasOwnProperty.call(this.sidebarByType, viewType)) throw new Error(`Attempting to register an existing view type "${viewType}"`);
		this.sidebarByType[viewType] = viewCreator;
		this.trigger("view-registered", viewType); // "view-registered" event
	}

	unregisterSidebar(viewType) {
		if (Object.prototype.hasOwnProperty.call(this.sidebarByType, viewType)) {
			delete this.sidebarByType[viewType];
			this.trigger("view-unregistered", viewType); // "view-unregistered" event
		}
	}

	getSidebarCreatorByType(extension) {
		return this.sidebarByType[extension];
	}
}

export default SidebarRegistry;
