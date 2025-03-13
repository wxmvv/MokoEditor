import "./utils/enhance.js";
import "./utils/progress-bar.css";
import ProgressBar from "./utils/ProgressBar.js";
import UaInfo from "./utils/UaInfo.js";
import DevLogger from "./utils/DevLogger.js";
// views
import Workspace from "./views/Workspace.js";
import StatusBar from "./views/StatusBar.js";
import TitleBar from "./views/TitleBar.js";
import Setting from "./views/setting/Setting.js";
import Modal from "./views/Modal.js";
// registry
import { PanelRegistry } from "./manager/registry/PanelRegistry.js";
import { ViewRegistry } from "./manager/registry/ViewRegistry.js";
import { ToolBarItemRegistry } from "./manager/registry/ToolBarItemRegistry.js";
import { EmbedRegistry } from "./manager/registry/EmbedRegistry.js";
import { SettingRegistry } from "./manager/registry/SettingRegistry.js";
import { ToolBarRegistry } from "./manager/registry/ToolBarRegistry.js";
import Commands from "./manager/Commands.js";
import HotkeyManager from "./manager/HotkeyManager.js";
// manager
import SettingManager from "./manager/SettingManager.js";
import FileManager from "./manager/FileManager.js";
import PluginManager from "./manager/PluginManager.js";
import InternalNotification from "./views/InternalNotification.js";
import CommandPalette from "./views/CommandPalette.js";
import ElectronAdapter from "./manager/adapter/ElectronAdapter.js";
//state json
import JSON5 from "json5";
import libraryStateJson from "./manifest/User/state/library.json?raw";
import workspaceStateJson from "./manifest/User/state/workspace.json?raw";
import defaultSettingsJSON from "./manifest/settings/default_settings.json?raw";
import userSettingsJSON from "./manifest/settings/user_settings.json?raw";

const MOKO_VERSION = "0.1.0";

class moko {
	constructor(appElement, adapter) {
		if (moko.instance) return moko.instance;
		DevLogger.instance.LogMokoTitle();
		DevLogger.instance.LogPackageInfo();
		this.App = "Moko Editor";
		this.AppInfo = {
			name: "Moko",
			author: "wxm",
			description: "Markdown editor for everyone",
			version: MOKO_VERSION,
		};
		this.appId = randomId();
		this.title = "Moko";
		this.uaInfo = new UaInfo();
		this.adapter = adapter;
		this.appEl = appElement;
		this.containerEl = appElement.createDiv("moko-view");
		this.elements = {};

		ProgressBar.instance.show();
		ProgressBar.instance.setMessage("[moko] Init Registry...");
		this.ToolBarItemRegistry = new ToolBarItemRegistry(this);
		this.ViewRegistry = new ViewRegistry(this);
		this.PanelRegistry = new PanelRegistry(this);
		this.EmbedRegistry = new EmbedRegistry(this);
		this.SettingRegistry = new SettingRegistry(this);
		this.ToolBarRegistry = new ToolBarRegistry(this);
		this.commands = new Commands(this);
		this.HotkeyManager = new HotkeyManager(this);

		ProgressBar.instance.setMessage("[moko] Init Views...");
		this.modal = new Modal(this); // 模态框
		this.titleBar = new TitleBar(this); // 标题栏
		this.workspace = new Workspace(this); // 工作区
		this.statusBar = new StatusBar(this); // 状态栏
		this.setting = new Setting(this.modal); // 设置面板

		ProgressBar.instance.setMessage("[moko] Init Manager...");
		this.FileManager = new FileManager(this.adapter); // 文件管理 // TODO 检查configDir 是在~/.config/moko
		this.SettingManager = new SettingManager(this); // 设置管理
		this.PluginManager = new PluginManager(this); // 插件管理

		ProgressBar.instance.setMessage("[FileManager] Load Local State..."); // 读取本地储存 // TODO FileManager检查configDir 是否存在 如果不存在就新建
		if (this.adapter) this.FileManager.setLibraryState(JSON5.parse(libraryStateJson)); //TODO 这里需要一个代码 尝试读取library.json文件 如果有就读取赋值给this.FileManager.library // TODO 从文件获取workspace状态 // this.workspace.state = JSON5.parse(localStorage.getItem("workspace"));

		ProgressBar.instance.setMessage("[SettingManager] Loac Local Settings...");
		this.SettingManager.loadSetting(defaultSettingsJSON, userSettingsJSON);
		this.SettingManager.theme.applySystem();

		ProgressBar.instance.setMessage("[PluginManager] Install BuildInPlugins...");
		this.PluginManager.loadBuildInPlugins();

		ProgressBar.instance.setMessage("[moko] Loading...");
		this.setting.load(); // TODO 设置界面
		this.workspace.load(JSON5.parse(workspaceStateJson)); // ProgressBar.instance.setMessage("[moko] 加载workspace...");
		this.titleBar.setTitle(this.title); //ProgressBar.instance.setMessage("[moko] 设置title...");

		ProgressBar.instance.setMessage("[moko] 加载命令框与信息框...");
		this.InternalNotification = new InternalNotification(this); // MARK notification & command palette
		this.CommandPalette = new CommandPalette(this);

		// this.InternalNotification.addItem("欢迎使用Moko", "6666");
		// this.adapter.showNotification({ title: "欢迎使用Moko", subtitle: "6666", body: "牛🐮" });
		this.JSON5 = JSON5;
		window.moko = this;
		ProgressBar.instance.setMessage("[moko] 初始化完毕!");
		ProgressBar.instance.delayHide(300);
		return this;
	}

	static get MOKO_VERSION() {
		return MOKO_VERSION;
	}

	addElement(key, el) {
		this.elements[key] = el;
	}

	// MARK 使用默认应用打开文件
	async openWithDefaultApp(filePath) {
		const adapter = this.adapter;

		// 检查是否是桌面应用，并且适配器是特定类型
		if (this.uaInfo.isDesktopApp && adapter instanceof ElectronAdapter) {
			const fullPath = adapter.getFullPath(filePath);
			// 如果是桌面应用且适配器为特定类型，则使用桌面应用打开文件
			try {
				const { shell } = await window.require("electron");
				const path = await window.require("path");
				console.log("openWithDefaultApp fullPath", fullPath);
				// 目前有个问题，打开文件名index.html会重载文件 解决问题
				if (path.basename(fullPath) === "index.html") return;
				if (shell) {
					if (shell.openPath) {
						shell.openPath(fullPath);
					} else {
						shell.openItem(fullPath);
					}
					return;
				}
			} catch (error) {
				throw new Error(`openWithDefaultApp Load File Error: filepath: ${filePath}, error: ${error.message}`);
			}
		} else if (this.uaInfo.isMobile) {
			// } else if (this.uaInfo.isMobile && kO && adapter instanceof MX) {
			// 如果是移动应用且适配器为特定类型，则不执行任何操作
			return;
		}
		await adapter.openWithDefaultApp(filePath);
	}

	async openExternal(filePath) {
		const adapter = this.adapter;
		await adapter.openExternal(filePath);
	}

	// MARK Zen Mode
	isZen() {
		return document.body.classList.contains("zen-mode");
	}
	Zen() {
		document.body.style.setProperty("--editor-tool-bar-opacity", "0");
		document.body.style.setProperty("--editor-tool-bar-height", "0px");
		document.body.style.setProperty("--editor-tool-bar-border-bottom", "none");
		document.body.style.setProperty("--tab-bar-opacity", "0");
		document.body.style.setProperty("--tab-bar-height", "0px");
		document.body.style.setProperty("--tab-bar-border-top", "none");
		document.body.style.setProperty("--title-bar-bg", "var(--cm-bg)");
		document.body.classList.add("zen-mode");
		this.titleBar.setTitle("");
	}
	unZen() {
		document.body.style.setProperty("--editor-tool-bar-opacity", "1");
		document.body.style.setProperty("--editor-tool-bar-height", "36px");
		document.body.style.setProperty("--editor-tool-bar-border-bottom", "var(--border)");
		document.body.style.setProperty("--tab-bar-opacity", "1");
		document.body.style.setProperty("--tab-bar-height", "30px");
		document.body.style.setProperty("--tab-bar-border-top", "var(--border)");
		document.body.style.setProperty("--title-bar-bg", "rgba(var(--gray-6-rgb), 0.7)");
		document.body.classList.remove("zen-mode");
		this.titleBar.setTitle(this.title);
	}
	toggleZen() {
		if (this.isZen()) {
			this.unZen();
		} else {
			this.Zen();
		}
	}
}

export default moko;
