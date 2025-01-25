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
	async showOpenDialog(options) {
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
		console.log("[FileManager] showSaveDialog");
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
		console.log("[FileManager] showSaveConfirmDialog");
	}
	async showMessageBox(options) {
		console.log("[FileManager] showMessageBox");
		if (!options) options = { message: "Message Box" };
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
		console.log("[FileManager] showErrorBox");
		return await this.adapter.showErrorBox(title, content);
	}
	// TODO
	async showCertificateTrustDialog(options) {
		if (!options) options = { message: "Certificate Trust Dialog", certificate: {} };
		console.log("[FileManager] showCertificateTrustDialog");
		return await this.adapter.showCertificateTrustDialog(options);
	}

	// MARK 初始化Library
	setLibraryState(libraryJsonRaw) {
		if (libraryJsonRaw) this.library = libraryJsonRaw;
		console.log("[FileManager] setLibraryState:", this.library);
		const paths = libraryJsonRaw.folders.map((folder) => folder.path);
		this.adapter.addRootPaths(paths, () => this.trigger("file-map-update", this.adapter.fileMap));
	}
	addPathsToLibrary(paths) {
		// 检查在this.paths是否与传入的paths有重复项,只添加不重复的
		if (!this.library) this.library = { name: "Library", folders: [] };
		paths.map((path) => {
			if (!this.library.folders.some((folder) => folder.path === path)) this.library.folders.push({ path, name: extractFileName(path) });
			else console.log(`Path already exists: ${path}`);
		});
	}

	// MARK Editor方法
	async saveFile(file, data, options, withBinary = false) {
		await this.adapter.write(file, data, options, withBinary); // this.adapter.saveFile(file, data, options);
	}
	async openFile(filePath) {
		return await this.adapter.read(filePath);
		// if (filePath)
		// try {
		// console.log(path.join(__dirname, filePath));
		// 获取当前页面的基础路径
		// const basePath = window.location.origin + window.location.pathname;
		// console.log("Base Path:", basePath);
		// 获取 document.baseURI
		// const baseURI = document.baseURI;
		// console.log("Base URI:", baseURI);
		// 获取当前脚本所在的目录
		// const basePath = path.dirname(__filename);
		// console.log("Base Path:", basePath);
		// 获取当前工作目录
		// const cwd = process.cwd();
		// console.log("Current Working Directory:", cwd);
		// TODO检测是否相对位置 然后做出相对路径
		// if (isRelativePath(filePath)) filePath = path.join(cwd, filePath);
		// console.log("Opening file:", filePath);
		// const data = await this.fs.promises.readFile(filePath, "utf8");
		// return data;
		// } catch (err) {
		// console.error("Error reading file:", err);
		// return;
		// }
	}

	readDir() {}
	createFile() {}
	deleteFile() {}
	renameFile() {}
	moveFile() {}
	getUserPath() {}
}

export default FileManager;
