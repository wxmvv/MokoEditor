import { Events } from "../../model/Events.js";

export class PanelRegistry extends Events {
	constructor() {
		super();
		this.panelByType = {}; // ViewType string : ViewCreator
	}

	registerPanel(viewType, viewCreator) {
		if (Object.prototype.hasOwnProperty.call(this.panelByType, viewType)) throw new Error(`Attempting to register an existing view type "${viewType}"`);
		this.panelByType[viewType] = viewCreator;
		this.trigger("view-registered", viewType); // "view-registered" event
	}

	unregisterPanel(viewType) {
		if (Object.prototype.hasOwnProperty.call(this.panelByType, viewType)) {
			delete this.panelByType[viewType];
			this.trigger("view-unregistered", viewType); // "view-unregistered" event
		}
	}

	getPanelCreatorByType(extension) {
		return this.panelByType[extension];
	}
}

export default PanelRegistry;
