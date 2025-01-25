import Component from "./Component";
// Plugin: () => UZ,
class Plugin extends Component {
	// constructor(moko, manifest) {
	constructor(moko, manifest) {
		super();
		// 初始化最后数据修改时间
		this._lastDataModifiedTime = 0;
		// 配置文件变化时的回调函数，并使用防抖机制（延迟 50ms 执行）
		this.onConfigFileChange = debounce(this._onConfigFileChange, 50);
		this.moko = moko;
		this.manifest = manifest;
	}

	async onload() {
		console.log("loading plugin");
	}
	async onunload() {
		console.log("unloading plugin");
	}
	// TODO Settings
	// 我需要两个 一个是添加单独的tab，一个是添加到现有tab
	addSettingTab(e) {
		this.moko.setting.addSettingTab(e);
		this.register(function () {
			return t.app.setting.removeSettingTab(e);
		});
	}
	addSettingsToTab() {}
	// DONE StatusBar
	addStatusBarLeftItem() {
		const statusBarItem = this.moko.statusBar.registerStatusBarLeftItem();
		// 2. 给这个状态栏项添加一个 CSS 类
		// 类名由插件的 manifest id 生成，非字母数字的字符会被替换为 '-'
		const className = "plugin-" + this.manifest.id.toLowerCase().replace(/[^_a-zA-Z0-9-]/g, "-");
		statusBarItem.addClass(className);
		// 注册一个清理函数，当插件被移除或卸载时，自动从 DOM 中移除这个状态栏项
		this.register(() => statusBarItem.detach());
		return statusBarItem;
	}
	// 加在右侧container
	addStatusBarRightItem() {
		const statusBarItem = this.moko.statusBar.registerStatusBarRightItem();
		const className = "plugin-" + this.manifest.id.toLowerCase().replace(/[^_a-zA-Z0-9-]/g, "-");
		statusBarItem.addClass(className);
		this.register(() => statusBarItem.detach());
		return statusBarItem;
	}

	// DONE TitleBar
	addTitleBarLeftItem() {
		const titleBarItem = this.moko.titleBar.registerTitleBarLeftItem();
		const className = "plugin-" + this.manifest.id.toLowerCase().replace(/[^_a-zA-Z0-9-]/g, "-");
		titleBarItem.addClass(className);
		this.register(() => titleBarItem.detach());
		return titleBarItem;
	}
	addTitleBarRightItem() {
		const titleBarItem = this.moko.titleBar.registerTitleBarRightItem();
		const className = "plugin-" + this.manifest.id.toLowerCase().replace(/[^_a-zA-Z0-9-]/g, "-");
		titleBarItem.addClass(className);
		titleBarItem.addClass("action-toolbar-item-container");
		this.register(() => titleBarItem.detach());
		return titleBarItem;
	}
	// DONE ToolBarItem
	// addToolBarItem(itemId, toolbarItem) {
	// this.registerToolbarItem();
	// const toolBarItem = this.moko.toolbar.registerToolbarItem();
	// const toolBarItem = this.moko.ToolBarItemRegistry.registerToolbarItem();
	// const className = "plugin-" + this.manifest.id.toLowerCase().replace(/[^_a-zA-Z0-9-]/g, "-");
	// toolBarItem.addClass(className);
	// this.register(() => toolBarItem.detach());
	// return toolBarItem;
	// }
	// addToolBarItem = function (itemId, toolbarItem) {

	// }
	registerToolbarItem(itemId, toolbarItemCreater) {
		// console.log(this.moko.ToolBarItemRegistry);
		this.moko.ToolBarItemRegistry.registerToolBarItem(itemId, toolbarItemCreater);
		this.register(function () {
			return this.moko.ToolBarItemRegistry.unregisterToolBarItem(itemId);
		});
	}

	// TODO View
	registerView(viewType, View) {
		this.moko.ViewRegistry.registerView(viewType, View);
		this.register(function () {
			return this.moko.ViewRegistry.unregisterView(viewType);
		});
	}
	registerPanel(viewType, View) {
		this.moko.ViewRegistry.registerView(viewType, View);
		this.register(function () {
			return this.moko.ViewRegistry.unregisterView(viewType);
		});
	}

	// DONE Commands 旧
	// addCommand(commandObj) {
	// 	return this.registerCommand(commandObj.id, commandObj.callback || commandObj.checkCallback || commandObj.editorCallback || commandObj.checkEditorCallback, { hotkey: commandObj.hotkeys });
	// }
	// MARK 我的command实现
	registerCommand(command, commandHandler, options) {
		command = this.manifest.id + ":" + command;
		this.moko.commands.registerCommand(command, commandHandler, options);
		this.register(() => {
			return this.moko.commands.unregisterCommand(command);
		});
	}

	// TODO
	// workspace split
	// ribbon
	addRibbonIcon(icon, title, callback) {
		const app = this.moko;
		// 生成图标的唯一标识符
		const ribbonId = this.manifest.id + ":" + title;
		// 添加图标到左侧侧边栏
		const ribbonButton = app.workspace.leftRibbon.addRibbonItemButton(ribbonId, icon, title, callback);
		// 注册销毁图标的操作
		this.register(function () {
			app.workspace.leftRibbon.removeRibbonAction(ribbonId);
			ribbonButton.detach();
		});
		return ribbonButton;
	}

	registerHoverLinkSource(e, t) {
		this.moko.workspace.registerHoverLinkSource(e, t);
		this.register(function () {
			return this.moko.workspace.unregisterHoverLinkSource(e);
		});
	}
	registerExtensions(e, t) {
		this.moko.viewRegistry.registerExtensions(e, t);
		this.register(function () {
			return this.app.viewRegistry.unregisterExtensions(e);
		});
	}
	registerMarkdownPostProcessor(e, t) {
		return (
			LL.registerPostProcessor(e, t),
			this.register(function () {
				return LL.unregisterPostProcessor(e);
			}),
			e
		);
	}
	// LL = MarkdownPreviewRenderer
	// registerMarkdownCodeBlockProcessor (e, t, n) {
	// 	const i = LL.createCodeBlockPostProcessor(e, t);
	// 	return (
	// 		LL.registerPostProcessor(i, n),
	// 		LL.registerCodeBlockPostProcessor(e, t),
	// 		this.register(function () {
	// 			LL.unregisterCodeBlockPostProcessor(e), LL.unregisterPostProcessor(i);
	// 		}),
	// 		i
	// 	);
	// };
	// registerCodeMirror (e) {};
	registerEditorExtension(e) {
		this.moko.workspace.registerEditorExtension(e);
		this.register(function () {
			return this.moko.workspace.unregisterEditorExtension(e);
		});
	}
	registerObsidianProtocolHandler(e, t) {
		this.moko.workspace.registerObsidianProtocolHandler(e, t);
		this.register(function () {
			return this.moko.workspace.unregisterObsidianProtocolHandler(e, t);
		});
	}
	registerEditorSuggest(e) {
		this.moko.workspace.activeEditorSuggest.addSuggest(e);
		this.register(function () {
			return this.moko.workspace.activeEditorSuggest.removeSuggest(e);
		});
	}
	// loadData() {
	// 	return v(this, void 0, Promise, function () {
	// 		let e, t;
	// 		return y(this, function (n) {
	// 			switch (n.label) {
	// 				case 0:
	// 					return [4, this.moko.vault.readPluginData(this.manifest.dir)];
	// 				case 1:
	// 					return (e = n.sent()) && this.onExternalSettingsChange ? ((t = this), [4, this.getModifiedTime()]) : [3, 3];
	// 				case 2:
	// 					(t._lastDataModifiedTime = n.sent()), (n.label = 3);
	// 				case 3:
	// 					return [2, e];
	// 			}
	// 		});
	// 	});
	// }
	async loadData() {
		try {
			// 从应用程序的 vault 读取插件数据
			const data = await this.moko.FileManager.readPluginData(this.manifest.dir);
			// 如果有外部设置变更的监听器，则获取文件的修改时间
			if (data && this.onExternalSettingsChange) {
				// 更新最后一次数据修改时间
				this._lastDataModifiedTime = await this.getModifiedTime();
			}
			// 返回插件数据
			return data;
		} catch (error) {
			console.error("Error loading plugin data:", error);
			throw error;
		}
	}

	// saveData = function (e) {
	// 	return v(this, void 0, Promise, function () {
	// 		let t;
	// 		return y(this, function (n) {
	// 			return (t = Date.now()), (this._lastDataModifiedTime = t), [2, this.app.vault.writePluginData(this.manifest.dir, e, { mtime: t })];
	// 		});
	// 	});
	// };
	async saveData(data) {
		try {
			const currentTime = Date.now();
			this._lastDataModifiedTime = currentTime;
			await this.moko.vault.writePluginData(this.manifest.dir, data, { mtime: currentTime });
		} catch (error) {
			console.error("Error saving data:", error);
			throw error;
		}
	}

	// TODO 加载css
	async loadCSS() {
		console.log("loading CSS");
		try {
			const cssFilePath = this.manifest.dir + "/" + BZ;
			const cssFileExists = await this.moko.vault.exists(cssFilePath);

			if (cssFileExists) {
				const cssContent = await this.moko.vault.readRaw(cssFilePath);
				const styleElement = createEl("style", { type: "text/css" });
				styleElement.textContent = cssContent;
				document.head.insertBefore(styleElement, this.moko.customCss.styleEl);

				this.register(() => {
					styleElement.detach();
				});
			}
		} catch (error) {
			console.error("Error loading CSS:", error);
			throw error;
		}
	}
	async getModifiedTime() {
		try {
			const filePath = ve(this.manifest.dir + "/data.json");
			const fileStat = await this.moko.vault.adapter.stat(filePath);
			return fileStat.mtime;
		} catch (error) {
			console.error("Error getting modified time:", error);
			return 0;
		}
	}
	// _onConfigFileChange = function () {
	// 	return v(this, void 0, void 0, function () {
	// 		let e;
	// 		return y(this, function (t) {
	// 			switch (t.label) {
	// 				case 0:
	// 					return this.onExternalSettingsChange ? [4, this.getModifiedTime()] : [2];
	// 				case 1:
	// 					return (e = t.sent()), this._lastDataModifiedTime < e && this.onExternalSettingsChange(), (this._lastDataModifiedTime = e), [2];
	// 			}
	// 		});
	// 	});
	// };
	async _onConfigFileChange() {
		try {
			if (this.onExternalSettingsChange) {
				const modifiedTime = await this.getModifiedTime();
				if (this._lastDataModifiedTime < modifiedTime) {
					this.onExternalSettingsChange();
					this._lastDataModifiedTime = modifiedTime;
				}
			}
		} catch (error) {
			console.error("Error handling config file change:", error);
			throw error;
		}
	}
}

export { Plugin };
export default Plugin;
