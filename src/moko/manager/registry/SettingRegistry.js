import { Events } from "../../model/Events";

export class SettingRegistry extends Events {
	constructor() {
		super();
		this.settingSection = {};
	}

	registerSetting(settingId, settingCreator) {
		this.trigger("register", settingId, settingCreator);
	}
}


export default SettingRegistry;