import Theme from "./settings/Theme";
import Font from "./settings/Font";
// import Vibrancy from "./settings/Vibrancy";
import JSON5 from "json5";
import Plugin from "../model/Plugin";
import SettingsBtnSvg from "../icons/file_icons/settings.svg?raw";
import { Svg } from "../model/Svg";

import defaultSettingsJSON from "../manifest/settings/default_settings.json?raw";
import userSettingsJSON from "../manifest/settings/user_settings.json?raw";

class SettingManager extends Plugin {
	constructor(moko) {
		// console.log("%cInitializing settings...", "color:#3c414c; font-size:13px; font-weight:bold;");
		super(moko, {
			id: "settings",
			name: "Settings",
			enabled: true,
			info: {
				description: "Settings",
				author: "Moko",
				version: "1.0.0",
				license: "MIT",
				url: "https://github.com/Moko-Developer/Moko-Editor",
			},
			options: {},
		});
		this.theme = new Theme(moko);
		this.font = new Font(moko);
		// this.vibrancy = moko.uaInfo.isMacOS ? new Vibrancy(moko) : null;
		this.defaultSetting = this.loadJSON5(defaultSettingsJSON);
		this.userSetting = this.loadJSON5(userSettingsJSON);
		this.setting = this.mergeSettings(this.defaultSetting, this.userSetting);
		console.log("[SettingManager] 加载设置:", this.setting);
		this.icon = SettingsBtnSvg;
		this.load();
	}

	async onload() {
		// const item = this.addTitleBarRightItem();
		this.showCommand = {
			command: "show-settings",
			commandHandler: () => window.moko.setting.toggle(),
			options: { hotkeys: "command+," }, //hotkeys: [newHotkey(["Mod"], ",")],
		};
		const item = this.addStatusBarLeftItem();
		item.innerHTML = Svg({ id: "Settings", svgRaw: this.icon, clickable: true });
		item.addEventListener("click", this.showCommand.commandHandler);
		this.registerCommand(this.showCommand.command, this.showCommand.commandHandler, this.showCommand.options);
	}

	// 合并 defaultSettings 和 userSettings
	// deepmerge 后续如果需要深层合并可以尝试deepmerge库
	mergeSettings(defaultSettings, userSettings) {
		return {
			...defaultSettings,
			...userSettings, // userSettings 会覆盖 defaultSettings 中的相同字段
		};
	}
	loadJSON5(jsonRaw) {
		if (!jsonRaw) return console.log("未传入jsonRaw,无法读取");
		return JSON5.parse(jsonRaw);
	}

	// DONE 获取配置
	getSetting(SettingName) {
		const SettingValue = this.setting[SettingName];
		return SettingValue ? this.defaultSetting[SettingName] : SettingValue;
	}
}

export { SettingManager };
export default SettingManager;
