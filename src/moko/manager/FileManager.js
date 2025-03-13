import Events from "../model/Events";

class FileManager extends Events {
	constructor(adapter) {
		super();
		this.adapter = adapter;
		// Library
		this.library = null;
		this.libraryPaths = [];
		this.libraryName = "Library";
		this.fileMap = adapter.fileMap || null;
		// config
		this.configTs = 0; //配置文件时间戳
		this.config = {}; // this.configDir = "moko"; //配置文件夹名// this.userConfigDir = "~/.config/" + this.configDir;
		// this.requestSaveConfig = debounce(this.saveConfig.bind(this), 1e3, true);
		this.cacheLimit = 65536;
		// this.reloadConfig
		this.root = null;
		// 在初始化时添加 fileMap中的Root
		// this.config = JSON5.parse(settings) || {};
	}
	// MARK set
	setConfig(e, t) {
		if (t) this.config[e] = t;
		else delete this.config[e];
		// 修改配置
		// this.requestSaveConfig();
		this.trigger("config-changed");
	}

	// MARK get
	getUserConfigDir() {
		return this.adapter.userConfigDir;
	}
	getLocalConfigDir() {
		return this.adapter.localConfigDIr;
	}
	getFileMapNode(id) {
		return this.fileMap[id];
	}
	getFileMap() {
		return this.fileMap;
	}
	// MARK BTN addLocation & showOpenDialog
	async addLocation(paths) {
		if (!paths) return;
		this.adapter.addRootPaths(paths);
		this.addPathsToLibrary(paths);
		this.trigger("file-map-update", this.adapter.fileMap);
	}
	async removeLocation(path) {
		if (!path) return;
		this.adapter.removeRootPath(path);
		this.removePathFromLibrary(path);
		this.trigger("file-map-update", this.adapter.fileMap);
	}

	// MARK Dialog
	// TODO5个dialog具体实现
	async showOpenDialog(options) {
		// 打开文件的对话框
		if (!options)
			options = {
				properties: ["openFile", "openDirectory", "showHiddenFiles", "createDirectory"],
			};
		// title?: string;
		// defaultPath?: string;
		// buttonLabel?: string;
		// filters?: FileFilter[];
		// message?: string;
		// securityScopedBookmarks?: boolean;
		// options = { properties: ["openFile", "openDirectory", "multiSelections", "showHiddenFiles", "createDirectory"] };
		return await this.adapter.showOpenDialog(options);
	}
	async showSaveDialog(options) {
		// 保存文件对话框 包括选择地址 文件名
		if (!options)
			options = {
				properties: ["showHiddenFiles", "createDirectory", "showOverwriteConfirmation"],
				message: "Save File Location",
			};
		// properties?: Array<'showHiddenFiles' | 'createDirectory' | 'treatPackageAsDirectory' | 'showOverwriteConfirmation' | 'dontAddToRecent'>;
		// title?: string;
		// defaultPath?: string;
		// buttonLabel?: string;
		// filters?: FileFilter[];
		// message?: string;
		// nameFieldLabel?: string;  // `true`
		// showsTagField?: boolean;
		return await this.adapter.showSaveDialog(options);
	}
	async showSaveConfirmDialog() {
		// 在关闭未保存文件时显示确认对话框
		// console.log("[FileManager] showSaveConfirmDialog");
		const options = {
			message: "This buffer contains unsaved edits. Do you want to save it?",
			buttons: ["save", "don't save", "cancel"],
			defaultId: 0,
			cancelId: 2,
		};
		return await this.adapter.showMessageBox(options);
	}
	async showMessageBox(options) {
		// 消息框
		if (!options) options = { message: "No message to show in message box" };
		// message: string;
		// type?: ('none' | 'info' | 'error' | 'question' | 'warning');
		// buttons?: string[];
		// defaultId?: number;
		// signal?: AbortSignal;
		// title?: string;
		// detail?: string;
		// checkboxLabel?: string;
		// checkboxChecked?: boolean;
		// icon?: (NativeImage) | (string);
		// textWidth?: number;
		// cancelId?: number;
		// noLink?: boolean;
		// normalizeAccessKeys?: boolean;
		return await this.adapter.showMessageBox(options);
	}
	async showErrorBox(title, content) {
		// 错误框
		if (!title) title = "Error";
		if (!content) content = "No message to show in error box";
		return await this.adapter.showErrorBox(title, content);
	}

	// MARK Library
	// 初始化Library
	setLibraryState(libraryJsonRaw) {
		if (libraryJsonRaw) this.library = libraryJsonRaw;
		console.log("[FileManager] setLibraryState:", this.library);
		const paths = libraryJsonRaw.folders.map((folder) => folder.path);
		this.adapter.addRootPaths(paths, () => this.trigger("file-map-update", this.adapter.fileMap));
	}
	// 在Library中国呢添加文件夹地址
	addPathsToLibrary(paths) {
		// 检查在this.paths是否与传入的paths有重复项,只添加不重复的
		if (!this.library) this.library = { name: "Library", folders: [] };
		paths.map((path) => {
			if (!this.library.folders.some((folder) => folder.path === path)) this.library.folders.push({ path, name: extractFileName(path) });
			else console.log(`Path already exists: ${path}`);
		});
	}

	// MARK Editor
	// 保存文件
	async saveFile(file, data, options, withBinary = false) {
		await this.adapter.write(file, data, options, withBinary); // this.adapter.saveFile(file, data, options);
	}
	// 打开文件
	async openFile(filePath) {
		return await this.adapter.read(filePath);
	}

	readDir() {}
	createFile() {}
	deleteFile() {}
	renameFile() {}
	moveFile() {}
	getUserPath() {}
}

export default FileManager;
