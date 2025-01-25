/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-prototype-builtins */
// import JSON5 from "json5"
import BuildInToolBarItems from "../BuildInPlugins/BuildInToolBarItem/main.js";
import BuildInMokoCommands from "../BuildInPlugins/BuildInMokoCommands/main.js";
import BuildInEditorCommands from "../BuildInPlugins/BuildInEditorCommands/main.js";
import BuildInWorkspaceCommands from "../BuildInPlugins/BuildInWorkspaceCommands/main.js";
import FileExplorer from "../BuildInPlugins/fileExplorer/main.js";
import WordsCounter from "../BuildInPlugins/wordsCounter/main.js";
import TestButton from "../BuildInPlugins/testButton/main.js";

class PluginManager {
	constructor(moko) {
		this.moko = moko;
		// TODO
		// this.corePluginsList = this.loadConfigJson();
		// this.BuildInPluginsList = ["file-explorer", "words-counter", "BuildInToolBarItems", "testButton"];
		this.BuildInPluginsList = ["BuildInMokoCommands", "BuildInEditorCommands", "BuildInWorkspaceCommands", "BuildInToolBarItems", "file-explorer", "words-counter", "testButton"];
		if (!this.plugins) this.plugins = {};
		this.pluginRegistry = {};
		// TODO自动注册
		this.registerPlugin("BuildInMokoCommands", BuildInMokoCommands);
		this.registerPlugin("BuildInEditorCommands", BuildInEditorCommands);
		this.registerPlugin("BuildInWorkspaceCommands", BuildInWorkspaceCommands);
		this.registerPlugin("BuildInToolBarItems", BuildInToolBarItems);
		this.registerPlugin("file-explorer", FileExplorer);
		this.registerPlugin("words-counter", WordsCounter);
		this.registerPlugin("testButton", TestButton);
		// console.log("%cInitializing plugins...", "color:#3c414c; font-size:13px; font-weight:bold;");
		// 在这里开启注册过的插件
		// TODO自动启动

		// this.enablePluginsFromList(this.BuildInPluginsList);

		//plugins
		// this.manifests = {}
		// this.plugins = {}
		// this.enabledPlugins = new Set()
		// this.updates = {}
		// this.requestSaveConfig = debounce(this.saveConfig, 1e3)
		// this.moko = moko
		// ????
		// this.app.vault.on("raw", this.onRaw.bind(this)
	}
	loadBuildInPlugins() {
		this.BuildInPluginsList.forEach((pluginId) => {
			this.loadPluginById(pluginId);
		});
	}
	//plugins
	async onRaw(event) {
		if (event.startsWith(this.app.vault.configDir)) {
			const pluginId = ce(ue(event));
			if (this.enabledPlugins.has(pluginId) && event === `${this.getPluginFolder()}/${pluginId}/data.json`) {
				const plugin = this.plugins[pluginId];
				if (plugin) {
					await plugin.onConfigFileChange();
				}
			}
		}
	}

	async loadManifests() {
		const adapter = this.app.vault.adapter;
		const pluginFolder = this.getPluginFolder();
		this.manifests = {};

		try {
			const exists = await adapter.exists(pluginFolder);
			if (!exists) return;

			const folders = await adapter.list(pluginFolder);
			for (const folder of folders.folders) {
				const manifestPath = `${folder}/${OZ}`;
				const manifestExists = await adapter.exists(manifestPath);
				if (manifestExists) {
					const manifestContent = await adapter.read(manifestPath);
					const manifest = JSON.parse(manifestContent);
					if (manifest.id) {
						manifest.dir = folder;
						if (manifest.author && manifest.author.toLowerCase() !== "obsidian") {
							manifest.author = "";
						}
						this.manifests[manifest.id] = manifest;
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	async loadManifest(pluginId) {
		const adapter = this.app.vault.adapter;
		const manifestPath = `${pluginId}/${OZ}`;

		try {
			const manifestExists = await adapter.exists(manifestPath);
			if (manifestExists) {
				const manifestContent = await adapter.read(manifestPath);
				const manifest = JSON.parse(manifestContent);
				if (manifest.id) {
					manifest.dir = pluginId;
					if (manifest.author && manifest.author.toLowerCase() !== "obsidian") {
						manifest.author = "";
					}
					this.manifests[manifest.id] = manifest;
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	// TODO
	async loadPlugin(pluginId) {
		if (!this.isEnabled()) return null;

		let plugin = this.plugins[pluginId];
		if (plugin) return plugin;

		const manifest = this.manifests[pluginId];
		if (!manifest) return null;

		// TODO
		// const pluginCode = await this.moko.FileManager.adapter.read(`${manifest.dir}/${FZ}`);
		// if (localStorage.getItem("debug-plugin")) {
		// 	pluginCode = pluginCode.replace(_Z, "");
		// }

		const isMobile = document.body.hasClass("emulate-mobile");
		const require = (moduleName) => {
			if (qZ.hasOwnProperty(moduleName)) {
				console.error(new Error(`[CM6][${pluginId}] Using a deprecated package: "${moduleName}".\n${NZ}`));
				return qZ[moduleName];
			}
			if (zZ.hasOwnProperty(moduleName)) {
				return zZ[moduleName];
			}
			if (isMobile) {
				new OI(`${pluginId} attempted to load NodeJS package: "${moduleName}"`);
				console.error(new Error(`[${pluginId}] Attempting to load NodeJS package: "${moduleName}"`));
				return null;
			}
			return tn(moduleName);
		};

		const module = { exports: {} };
		const pluginFunction = window.eval(`(function anonymous(require,module,exports){${pluginCode}\n})\n//# sourceURL=plugin:${encodeURIComponent(pluginId)}\n`);
		pluginFunction(require, module, module.exports);

		const PluginClass = module.exports.default || module.exports;
		if (!PluginClass) {
			throw new Error(`Failed to load plugin ${pluginId}. No exports detected.`);
		}

		plugin = new PluginClass(this.app, manifest);
		if (!(plugin instanceof UZ)) {
			throw new Error(`Failed to load plugin ${pluginId}`);
		}

		this.plugins[pluginId] = plugin;
		await plugin.load();
		await plugin.loadCSS();
		return plugin;
	}

	async unloadPlugin(pluginId) {
		const plugin = this.plugins[pluginId];
		if (plugin) {
			await plugin.unload();
			delete this.plugins[pluginId];
		}
	}

	async initialize() {
		const app = this.app;
		const enabledPlugins = await app.vault.readConfigJson("community-plugins");
		if (enabledPlugins && Array.isArray(enabledPlugins)) {
			this.enabledPlugins = new Set(enabledPlugins);
		} else {
			this.enabledPlugins = new Set();
		}

		await this.loadManifests();

		if (Object.keys(this.manifests).length === 0) return;

		if (!this.isEnabled()) {
			if (localStorage.getItem("enable-plugin-" + app.appId) === null) {
				new KZ(app).open();
			}
			return;
		}

		const loadTimes = [];
		const startTime = performance.now();

		for (const pluginId of this.enabledPlugins) {
			if (this.manifests.hasOwnProperty(pluginId)) {
				const loadStart = performance.now();
				await this.enablePlugin(pluginId);
				loadTimes.push({ id: pluginId, time: Math.round(performance.now() - loadStart) });
			}
		}

		const totalTime = performance.now() - startTime;
		if (localStorage.getItem("debug-plugin") === "1") {
			const logMessages = [`Total plugin setup: ${Math.round(totalTime).toLocaleString()}ms`];
			loadTimes.sort((a, b) => b.time - a.time);
			for (const { id, time } of loadTimes) {
				logMessages.push(`${id}: ${time.toLocaleString()}ms`);
			}
			console.log(logMessages.join("\n"));
			if (logMessages.length > 11) {
				logMessages.length = 11;
				logMessages.push("More in developer console");
			}
			new OI(logMessages.join("\n"), 0);
		}

		this.requestSaveConfig();
		this.checkForDeprecations();
		setInterval(() => this.checkForDeprecations(), 432e5);
	}

	getPluginFolder() {
		return `${this.app.vault.configDir}/plugins`;
	}

	async enablePlugin(pluginId) {
		const manifest = this.manifests[pluginId];
		if (!manifest) return false;

		if (this.isDeprecated(manifest)) {
			new OI(`Unable to load plugin ${manifest.name} v${manifest.version}. This version has been reported to cause issues. Please check for a newer version of the plugin.`);
			return false;
		}

		if (manifest.id === "sliding-panes-obsidian") {
			new OI(
				createFragment(function (e) {
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					e.createEl("p", {
						text: "As of Obsidian v1.0, Sliding Panes is a built-in feature called Stacked Tabs. We recommend uninstalling the Sliding Panes plugin.",
					}),
						e.createEl("p").createEl("a", {
							cls: "mod-cta",
							text: "Learn more",
							href: "https://help.obsidian.md/User+interface/Stacked+tabs",
							attr: { target: "_blank" },
						});
				}),
				6e3
			);
			return false;
		}

		if (manifest.id === "better-pdf-plugin" && manifest.version === "1.4.0") {
			new OI("Better PDF Plugin is no longer functional. We recommend uninstalling it.", 6e3);
			return false;
		}

		if (!Qt.isDesktopApp && manifest.isDesktopOnly) return false;

		try {
			this.loadingPluginId = pluginId;
			await this.loadPlugin(pluginId);
			this.loadingPluginId = null;
			return true;
		} catch (error) {
			this.loadingPluginId = null;
			new OI(rm.interface.msgFailedToLoadPlugin({ plugin: pluginId }));
			console.error(`Plugin failure: ${pluginId}`, error);
			return false;
		}
	}

	async disablePlugin(pluginId) {
		try {
			await this.unloadPlugin(pluginId);
		} catch (error) {
			new OI(`Failed to unload plugin ${pluginId}`);
			console.error(`Plugin failure: ${pluginId}`, error);
		}
	}

	async enablePluginAndSave(pluginId) {
		const success = await this.enablePlugin(pluginId);
		if (success) {
			this.enabledPlugins.add(pluginId);
			this.requestSaveConfig();
			return true;
		}
		return false;
	}

	async disablePluginAndSave(pluginId) {
		this.enabledPlugins.delete(pluginId);
		this.requestSaveConfig();
		await this.disablePlugin(pluginId);
	}

	async uninstallPlugin(pluginId) {
		await this.disablePluginAndSave(pluginId);

		const manifest = this.manifests[pluginId];
		if (manifest && manifest.dir) {
			const exists = await this.app.vault.exists(manifest.dir);
			if (exists) {
				await this.app.vault.adapter.rmdir(manifest.dir, true);
			}
		}

		delete this.manifests[pluginId];
		delete this.updates[pluginId];
	}

	getPlugin(pluginId) {
		return this.plugins.hasOwnProperty(pluginId) ? this.plugins[pluginId] : null;
	}

	async saveConfig() {
		await this.app.vault.writeConfigJson("community-plugins", Array.from(this.enabledPlugins));
	}

	isEnabled() {
		return localStorage.getItem("enable-plugin-" + this.app.appId) === "true";
	}

	async setEnable(enable) {
		localStorage.setItem("enable-plugin-" + this.app.appId, enable ? "true" : "false");

		if (!enable) {
			for (const pluginId of Object.keys(this.plugins)) {
				await this.disablePlugin(pluginId);
			}
		} else {
			for (const pluginId of Array.from(this.enabledPlugins)) {
				await this.enablePlugin(pluginId);
			}
		}
	}

	async checkForDeprecations() {
		if (Object.keys(this.plugins).length === 0) return;

		try {
			const deprecations = await ZK(JZ).json;
			for (const pluginId of Object.keys(this.plugins)) {
				if (this.plugins.hasOwnProperty(pluginId)) {
					const manifest = this.manifests[pluginId] || this.plugins[pluginId].manifest;
					if (this.isDeprecated(manifest)) {
						await this.disablePluginAndSave(pluginId);
						new OI(
							`The plugin ${manifest.name} v${manifest.version} has been disabled. This version has been reported to cause issues. Please check for a newer version of the plugin.`,
							0
						);
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	isDeprecated(manifest) {
		if (!manifest) return false;
		if (!eX.hasOwnProperty(manifest.id)) return false;
		return eX[manifest.id].contains(manifest.version);
	}

	async installPlugin(url, branch, manifest) {
		const { id, name } = manifest;
		const notice = new OI(YZ.msgInstallingPlugin({ name }), 0);
		notice.noticeEl.addClass("is-loading");

		let manifestContent = null;
		try {
			manifestContent = await ZK(eY(url, branch, OZ)).text;
			const parsedManifest = JSON.parse(manifestContent);
			if (parsedManifest.id && parsedManifest.id === id) {
				const fm = this.app.FileManager;
				const pluginFolder = this.getPluginFolder();
				const pluginDir = `${pluginFolder}/${id}`;

				if (!(await fm.exists(pluginFolder))) {
					await fm.createFolder(pluginFolder);
				}

				if (!(await fm.exists(pluginDir))) {
					await fm.createFolder(pluginDir);
				}

				await fm.adapter.write(`${pluginDir}/${OZ}`, manifestContent);

				const mainFileContent = await ZK(eY(url, branch, FZ)).text;
				await fm.adapter.write(`${pluginDir}/${FZ}`, mainFileContent);

				const stylesFileContent = await ZK(eY(url, branch, BZ)).text;
				await fm.adapter.write(`${pluginDir}/${BZ}`, stylesFileContent);

				delete this.updates[id];
				notice.noticeEl.removeClass("is-loading");
				notice.noticeEl.addClass("mod-success");
				notice.setMessage(YZ.msgSuccessfullyInstalledPlugin({ name }));
				setTimeout(() => notice.hide(), 3e3);

				await this.loadManifest(pluginDir);

				if (this.plugins.hasOwnProperty(id)) {
					await this.disablePlugin(id);
				}
				await this.enablePlugin(id);
			} else {
				notice.noticeEl.removeClass("is-loading");
				notice.setMessage("Plugin ID mismatch.");
				setTimeout(() => notice.hide(), 3e3);
			}
		} catch (error) {
			console.error(error);
			notice.noticeEl.removeClass("is-loading");
			notice.setMessage(YZ.msgFailedToInstallPlugin({ name }));
			setTimeout(() => notice.hide(), 3e3);
		}
	}

	async checkForUpdates() {
		this.updates = {};
		try {
			const plugins = await XZ();
			for (const plugin of plugins) {
				const { id, repo } = plugin;
				if (this.manifests.hasOwnProperty(id)) {
					const manifest = this.manifests[id];
					const manifestUrl = QK(repo, OZ);
					const remoteManifest = await ZK(manifestUrl).json;
					if (remoteManifest && remoteManifest.id === id) {
						const latestVersion = await tY(repo, remoteManifest);
						if (iH(manifest.version, latestVersion)) {
							this.updates[id] = { repo, version: latestVersion, manifest: remoteManifest };
						}
					}
				}
			}

			const updateCount = Object.keys(this.updates).length;
			new OI(updateCount === 0 ? YZ.msgNoUpdatesFound() : YZ.msgUpdatesFound({ count: updateCount }));
		} catch (error) {
			console.error(error);
			new OI(YZ.msgFailedLoadPlugins());
		}
	}

	// internalPlugins
	// 注册插件
	registerPlugin(id, pluginClass) {
		this.pluginRegistry[id] = pluginClass;
		// console.log("[PluginManager] 注册插件:", id);
	}
	// 获取插件类
	getPluginClassById(id) {
		return this.pluginRegistry[id];
	}
	// 获取所有插件
	getPluginList() {
		return Object.keys(this.pluginRegistry);
	}

	loadConfigJson() {
		//TODO 从json文件中读取需要加载的插件列表
		// ["fileExplorer"]
		return corePluginsList;
		// return JSON5.parse(corePluginsList);
	}

	// 我自己定义的 改用loadPlugin
	loadPluginById(pluginId) {
		// 从注册表中获取插件类
		const PluginClass = this.getPluginClassById(pluginId);
		// 如果没有该插件类，则报错
		if (!PluginClass) {
			console.error(`No plugin found with ID: ${pluginId}`);
			return;
		}
		// 检查是否已经加载过
		if (Object.prototype.hasOwnProperty.call(this.plugins, pluginId)) {
			throw new Error(`Plugin ${pluginId} has already been loaded`);
		}
		// 初始化插件实例
		const pluginInstance = new PluginClass(this.moko);
		pluginInstance.load();
		// pluginInstance.init();
		// 将插件实例存入 this.plugins 对象
		this.plugins[pluginId] = pluginInstance;
		return pluginId;
	}
	// 根据 JSON 列表启用插件
	enablePluginsFromList(pluginList) {
		console.log("[PluginManager]", pluginList);
		pluginList.forEach((pluginId) => {
			// 加载插件
			this.loadPluginById(pluginId);
			// 启用插件
			// const plugin = this.plugins[pluginId];
			// if (plugin) {
			// 	plugin.enable();
			// } else {
			// 	console.error(`Plugin with ID ${pluginId} not loaded`);
			// }
		});
	}
}

export { PluginManager };
export default PluginManager;
