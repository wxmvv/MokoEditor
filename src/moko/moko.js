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
// manager
import SettingManager from "./manager/SettingManager.js";
import FileManager from "./manager/FileManager.js";
import PluginManager from "./manager/PluginManager.js";
import HotkeyManager from "./manager/HotkeyManager.js";
import { ViewRegistry } from "./manager/ViewRegistry.js";
import { ToolBarItemRegistry } from "./manager/ToolBarItemRegistry.js";
import ElectronAdapter from "./manager/adapter/ElectronAdapter.js";
import Commands from "./manager/Commands.js";
//state json
import JSON5 from "json5";
import libraryStateJson from "./manifest/User/state/library.json?raw";
import workspaceStateJson from "./manifest/User/state/workspace.json?raw";
import InternalNotification from "./views/InternalNotification.js";
import CommandPalette from "./views/CommandPalette.js";
// import historyJson from "../userStorage/history.json?raw";

const MOKO_VERSION = "0.0.1";

class moko {
	constructor(appElement, adapter) {
		if (moko.instance) return moko.instance;
		DevLogger.instance.LogMokoTitle();
		DevLogger.instance.LogPackageInfo();
		this.App = "Moko Editor";
		this.AppInfo = {
			name: "Moko Editor",
			author: "Moko",
			description: "Markdown Editor for everyone",
			version: "1.0.0",
		};
		this.appId = randomId();
		this.title = "Moko";
		this.uaInfo = new UaInfo();
		this.adapter = adapter;
		this.appEl = appElement;
		this.containerEl = appElement.createDiv("moko-view");
		this.elements = {};
		ProgressBar.instance.show();
		ProgressBar.instance.setMessage("[moko] 实例化注册表...");
		this.ToolBarItemRegistry = new ToolBarItemRegistry(this);
		this.ViewRegistry = new ViewRegistry(this); // 视图管理
		this.commands = new Commands(this); // 命令管理
		this.HotkeyManager = new HotkeyManager(this); // 热键管理
		ProgressBar.instance.setMessage("[moko] 实例化Views...");
		this.modal = new Modal(this); // 模态框
		this.titleBar = new TitleBar(this); // 标题栏
		this.workspace = new Workspace(this); // 工作区
		this.statusBar = new StatusBar(this); // 状态栏
		this.setting = new Setting(this.modal); // 设置面板
		ProgressBar.instance.setMessage("[moko] 实例化Manager...");
		this.FileManager = new FileManager(this.adapter); // 文件管理 // TODO 检查configDir 是在~/.config/moko
		this.SettingManager = new SettingManager(this); // 设置管理
		this.PluginManager = new PluginManager(this); // 插件管理
		ProgressBar.instance.setMessage("[moko] 初始化组件...");
		ProgressBar.instance.setMessage("[FileManager] 加载State..."); // 读取本地储存 // TODO FileManager检查configDir 是否存在 如果不存在就新建
		if (this.adapter) this.FileManager.setLibraryState(JSON5.parse(libraryStateJson)); //TODO 这里需要一个代码 尝试读取library.json文件 如果有就读取赋值给this.FileManager.library // TODO 从文件获取workspace状态 // this.workspace.state = JSON5.parse(localStorage.getItem("workspace"));
		ProgressBar.instance.setMessage("[SettingManager] 应用本地设置...");
		this.SettingManager.theme.applySystem();
		ProgressBar.instance.setMessage("[PluginManager] 读取BuildIn插件...");
		this.PluginManager.loadBuildInPlugins();
		ProgressBar.instance.setMessage("[moko] 加载setting...");
		this.setting.load(); // TODO 设置界面
		ProgressBar.instance.setMessage("[moko] 加载workspace...");
		this.workspace.load(JSON5.parse(workspaceStateJson)); // this.workspace.load();
		ProgressBar.instance.setMessage("[moko] 设置title...");
		this.titleBar.setTitle(this.title); //this.title
		ProgressBar.instance.setMessage("[moko] 加载命令框与信息框...");
		this.InternalNotification = new InternalNotification(this); // MARK notification & command palette
		this.CommandPalette = new CommandPalette(this);
		ProgressBar.instance.setMessage("[moko] 初始化完毕!");
		this.JSON5 = JSON5;
		window.moko = this;
		// this.Zen();
		ProgressBar.instance.delayHide(300);
		return this;
	}
	static get MOKO_VERSION() {
		return MOKO_VERSION;
	}
	getOverrideConfigDir(e) {
		const t = localStorage.getItem(e + "-config");
		return t && String.isString(t) ? t : null;
	}
	addElement(key, el) {
		this.elements[key] = el;
	}
	// DONE 使用默认应用打开文件
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
