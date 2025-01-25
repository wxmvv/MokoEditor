/* eslint-disable @typescript-eslint/no-unused-vars */
import Adapter from "./Adapter";

export class ElectronAdapter extends Adapter {
	constructor() {
		super();
		// modules
		this.fs = window.require("original-fs");
		this.path = window.require("path");
		this.url = window.require("url");
		this.process = window.require("process");
		this.chokidar = window.require("chokidar");
		this.electron = window.require("electron"); // this.remote = this.electron.remote;  // electron 12 dependency
		this.micromatch = window.require("micromatch");
		this.ipcRenderer = this.electron.ipcRenderer;
		this.versions = this.process.versions;
		this.platform = this.getPlatform();
		this.electronPaths = this.ipcRenderer.sendSync("app:getPaths");
		this.electronInfo = this.ipcRenderer.sendSync("app:getInfo");
		console.log("electronInfo", this.electronInfo);
		this.homePath = this.electronPaths.homePath; // /Users/xxx
		this.__dirname = this.electronPaths.__dirname;
		this.userConfigDir = this.path.join(this.homePath, ".config", "moko");
		this.localConfigDIr = this.path.join(this.__dirname, ".moko"); //如果打开的是本地文件夹，这个就是本地文件夹的路径
		window.electron = this.electron;
		window.process = this.process;
		window.path = this.path;
		// vars
		this.rootPaths = [];
		this.watchers = {};
		this.fileMap = {};
		this.fileMap["root"] = this.genFileMapRootNode();
		this.ignorePatterns = ["**/.git", "**/.svn", "**/.hg", "**/CVS", "**/.DS_Store", "**/Thumbs.db"];
		this.insensitive = false; // 系统是否区分大小写 true则不区分，false则区分
		try {
			this.testInsensitive();
		} catch (error) {
			console.error(error);
		}
		// Queue
		// this.operationQueue = []; // 操作队列
		// Events
		this.addNoticificationEvents();
	}

	// // TODO operationQueue 操作队列
	// //添加操作到队列
	// async enqueueOperation(operation) {
	// 	this.operationQueue.push(operation);
	// 	await this.processQueue(); // 尝试处理队列
	// }
	// // 处理队列中的操作
	// async processQueue() {
	// 	if (this.operationQueue.length === 0) return;
	// 	const operations = this.operationQueue.slice(); // 复制当前队列
	// 	this.operationQueue = []; // 清空队列
	// 	for (const operation of operations) {
	// 		await operation(); // 执行操作
	// 	}
	// 	// 所有操作完成后更新界面
	// 	this.onFileMapUpdate();
	// }

	// MARK Events
	onFileMapUpdate() {
		this.trigger("file-map-update", this.fileMap);
	}
	// MARK fileMap & watcher
	addRootPaths(rootPaths, callback) {
		if (rootPaths) this.rootPaths = rootPaths; //console.log("[initWithRootPaths]", rootPaths);
		this.rootPaths.forEach((rootPath) => this.addRootPath(rootPath));
		if (callback) callback();
	}
	addRootPath(rootPath, callback) {
		if (this.watchers[rootPath]) return;
		const watcher = this.chokidar.watch(rootPath, {
			ignored: (path) => this.shouldIgnore(path), // ignored: /(^|[\/\\])\../, // 忽略隐藏文件
			persistent: true,
		});
		this.watchers[rootPath] = watcher;
		watcher
			.on("add", (path, stats) => this.handleWatcherEvents(rootPath, "add", path, stats))
			.on("change", (path, stats) => this.handleWatcherEvents(rootPath, "change", path, stats))
			.on("addDir", (path, stats) => this.handleWatcherEvents(rootPath, "addDir", path, stats))
			.on("unlink", (path, stats) => this.handleWatcherEvents(rootPath, "unlink", path, stats))
			.on("unlinkDir", (path, stats) => this.handleWatcherEvents(rootPath, "unlinkDir", path, stats))
			.on("error", (error, stats) => this.handleWatcherError(rootPath, error, stats))
			.on("ready", () => this.handleWatcherReady(rootPath))
			.on("raw", (event, path, details) => this.handleWatcherRaw(rootPath, event, path, details));
		if (callback) callback();
		return this.fileMap;
	}
	removeRootPath(rootPath) {
		if (!this.watchers[rootPath]) return;
		this.watchers[rootPath].close();
		delete this.watchers[rootPath];
		this.deleteFileMapNode(rootPath);
	}
	deleteFileMapNode(path) {
		const node = this.fileMap[path];
		if (node) {
			node.children.forEach((childId) => {
				this.deleteFileMapNode(childId);
			});
			delete this.fileMap[path];
		}
	}
	genFileMapRootNode() {
		return {
			id: "root",
			index: "root",
			path: "root",
			name: "root",
			extension: "",
			parentId: "root",
			basename: "root",
			realPath: "root",
			absolutePath: "root",
			level: 0,
			children: [],
			isExpanded: false,
			isFolder: true,
			type: "directory",
			hasChildren: true,
			stats: undefined,
			createdAt: undefined,
			modifiedAt: undefined,
		};
	}
	genFileMapNode(rootPath, path, stats, level = 0) {
		const fileMapNode = {
			id: path,
			index: path,
			path: path,
			name: this.path.basename(path),
			extension: getFileExtension(path),
			parentId: this.path.dirname(path),
			basename: removeFileExtension(path),
			realPath: this.changeAbsolutePath(path),
			absolutePath: this.changeAbsolutePath(path),
			level: level,
			children: [],
			isExpanded: false,
			isFolder: !stats.isFile(),
			type: !stats.isFile() ? "directory" : "file",
			hasChildren: !stats.isFile(),
			stats: stats || undefined,
			createdAt: stats?.birthtime || undefined,
			modifiedAt: stats?.mtime || undefined,
		};
		this.fileMap[path] = fileMapNode;
		if (rootPath === path) this.fileMap["root"].children.push(path); // root = ;
		else this.fileMap[fileMapNode.parentId].children.push(path);
	} // level
	handleWatcherError(rootPath, error, stats) {
		console.log(`[chokidar] [${rootPath}:error] Watcher error:`, error, stats);
	}
	handleWatcherReady(rootPath) {
		// console.log(`[chokidar] [${rootPath}:ready] Initial scan complete. Ready for changes`);
	}
	handleWatcherRaw(rootPath, event, path, details) {
		// console.log(`[chokidar] [${rootPath}:raw] Raw event info:`, event, path, details);
	}
	getLevel(rootPath, targetPath) {
		// 计算相对路径
		const relativePath = path.relative(rootPath, targetPath);
		// 如果相对路径包含 ".."，说明 targetPath 不在 rootPath 下，返回 -1 表示无效
		if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
			return -1;
		}
		// 使用分隔符分割相对路径，计算层级
		return relativePath ? relativePath.split(path.sep).length : 0;
	}
	handleWatcherEvents(rootPath, action, path, stats) {
		if (!action) return;
		if (!action) return;
		if (!path && !stats) return;
		if (action === "add") {
			this.genFileMapNode(rootPath, path, stats, this.getLevel(rootPath, path)); // if (this.shouldIgnore(path)) return; // 同样忽略隐藏文件 如果在watch中配置 则不需要在此配置
			// console.log(`[chokidar] [${rootPath}:add] File ${path} has been added`, stats);
		}
		if (action === "addDir") {
			this.genFileMapNode(rootPath, path, stats, this.getLevel(rootPath, path)); // if (this.shouldIgnore(path)) return; // 同样忽略隐藏文件 如果在watch中配置 则不需要在此配置
			// console.log(`[chokidar] [${rootPath}:addDir] Directory ${path} has been added`, stats, rootPath);
		}
		if (action === "change") {
			// console.log(`[chokidar] [${rootPath}:change] File ${path} has been changed`, stats, rootPath);
		}
		if (action === "unlink") {
			this.deleteFileMapNode(path);
			// console.log(`[chokidar] [${rootPath}:unlink] File ${path} has been removed`, rootPath);
		}
		if (action === "unlinkDir") {
			this.deleteFileMapNode(path);
			// console.log(`[chokidar] [${rootPath}:unlinkDir] Directory ${path} has been removed`, rootPath);
		}
		this.onFileMapUpdate(); // this.debounce(() => this.onFileMapUpdate(), 300);
	}
	// MARK 文件功能
	// append 追加  在文件末尾追加内容，如果文件不存在则新建
	async append(normalizedPath, data, writeOptions) {
		try {
			const fullPath = this.getFullPath(normalizedPath);
			await this.fs.promises.appendFile(fullPath, data, "utf8");
			await this.applyWriteOptions(fullPath, writeOptions);
			// await this.reconcileInternalFile(normalizedPath);
		} catch (error) {
			console.error("Error during append operation:", error);
		}
	}
	// copy 复制文件
	async copy(normalizedPath, normalizedNewPath) {
		try {
			const sourcePath = this.getFullPath(normalizedPath);
			const targetPath = this.getFullPath(normalizedNewPath);
			await this.fs.promises.copyFile(sourcePath, targetPath, this.fs.constants.COPYFILE_EXCL); //fs.constants.COPYFILE_EXCL : The copy operation will fail if dest already exists.
			// await this.reconcileInternalFile(normalizedNewPath);
		} catch (error) {
			console.error("Error during copy operation:", error);
		}
	}
	// read 读文件
	async read(normalizedPath, withBinary = false) {
		try {
			const fullPath = this.getFullPath(normalizedPath); //console.log(fullPath);
			if (withBinary) return this.BufferToArrayBuffer(await this.fs.promises.readFile(fullPath));
			else return await this.fs.promises.readFile(fullPath, "utf8");
		} catch (error) {
			console.error("Error during read operation:", error);
		}
	}
	// write 写入文件
	async write(normalizedPath, data, writeOptions, withBinary = false) {
		try {
			const filePath = this.getFullPath(normalizedPath);
			if (withBinary) await this.fs.promises.writeFile(filePath, Buffer.from(data));
			else await this.fs.promises.writeFile(filePath, data, "utf8");
			await this.applyWriteOptions(filePath, writeOptions);
		} catch (error) {
			console.error("Error during write operation:", error);
		}
	}
	// remove 删除文件
	async remove(normalizedPath) {
		try {
			const fullPath = this.getFullPath(normalizedPath);
			await this.fs.promises.unlink(fullPath);
			// await this.reconcileInternalFile(normalizedPath);
		} catch (error) {
			console.error("Error during remove operation:", error);
		}
	}
	// exists 检测文件是否存在
	async exists(normalizedPath, sensitive = this.sensitive) {
		return await this._exists(this.getFullPath(normalizedPath), sensitive);
	}
	// mkdir 创建文件夹
	async mkdir(normalizedPath) {
		try {
			const fullPath = this.getFullPath(normalizedPath);
			await this.fs.promises.mkdir(fullPath, { recursive: true });
		} catch (error) {
			console.error("Error during mkdir operation:", error);
		}
	}
	// rmdir 删除文件夹
	async rmdir(normalizedPath, recursive = true) {
		try {
			const fullPath = this.getFullPath(normalizedPath);
			if (recursive) {
				await this.fs.promises.rm(fullPath, { maxRetries: 5, recursive: recursive });
			} else {
				await this.fs.promises.rmdir(fullPath, { maxRetries: 5 });
			}
		} catch (error) {
			console.error("Error during rmdir operation:", error);
		}
	}
	// process 自动读取、修改和保存明文文件的内容。
	async process(normalizedPath, fn, writeOptions) {
		try {
			const fullPath = this.getFullPath(normalizedPath);
			const content = await this.fsPromises.readFile(fullPath, "utf8");
			const processedContent = fn(content);
			if (processedContent !== content) {
				await this.fs.promises.writeFile(fullPath, processedContent, "utf8");
				await this.applyWriteOptions(fullPath, writeOptions);
			}
		} catch (error) {
			console.error("Error during process operation:", error);
		}
	}
	// rename 重命名文件
	async rename(normalizedPath, normalizedNewPath) {
		if (normalizedPath === normalizedNewPath) return;
		try {
			const sourcePath = this.getFullPath(normalizedPath);
			const targetPath = this.getFullPath(normalizedNewPath);
			if ((await this._exists(targetPath, false)) && (!this.insensitive || normalizedPath.toLowerCase() !== normalizedNewPath.toLowerCase())) throw new Error("Destination file already exists!");
			await this.fs.promises.rename(sourcePath, targetPath);
		} catch (error) {
			console.error("Error during rename operation:", error);
		}
	}
	// stat 获取文件信息
	async stat(normalizedPath) {
		try {
			const fullPath = this.getFullPath(normalizedPath);
			const stat = await this.fs.promises.stat(fullPath);
			if (stat.isFile()) return { ...{ type: "file" }, ...this.statsToWriteOptions(stat) };
			else if (stat.isDirectory()) return { ...{ type: "folder" }, ...this.statsToWriteOptions(stat) }; // return m({ type: "folder" }, this.statsToWriteOptions(stat));
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		return null;
	}
	statsToWriteOptions(stats) {
		return { ctime: Math.round(stats.birthtimeMs), mtime: Math.round(stats.mtimeMs), size: stats.size };
	}
	// MARK 暂时放弃的模块
	// trash 暂时不考虑使用 //trashSystem

	async trashLocal(normalizedPath) {
		// 	const fullPath = this.getFullPath(normalizedPath);
		// 	const n = this.getFullPath(".trash");
		// 	await this.fs.promises.mkdir(n, { recursive: true });
		// 	const i = this.path.extname(fullPath);
		// 	const r = this.path.basename(fullPath, i);
		// 	let o = this.path.join(n, r + i);
		// 	let a = 1;
		// 	while (await this._exists(o)) {
		// 		a++;
		// 		o = this.path.join(n, r + " " + a + i);
		// 	}
		// 	await this.fs.promises.rename(fullPath, o);
		// 	await this.reconcileInternalFile(normalizedPath);
	}
	//  URI Scheme getResourcePath

	getSchemePath(normalizedPath) {
		// const fullPath = this.getFullPath(normalizedPath);
		// let n = 0;
		// const i = this.files[normalizedPath];
		// if (i && "file" === i.type) n = i.mtime || Date.now();
		// const r = this.url.pathToFileURL(fullPath).href;
		// return r.startsWith("file:///") ? (r = r.substring("file:///".length)) : r.startsWith("file://") && (r = "%5C%5C" + r.substring("file://".length)), Il.resourcePathPrefix + r + "?" + n;
	}
	// MARK Electron
	// MARK Dialog ipcRenderer Api
	// 打开对话框
	async showOpenDialog(options) {
		// https://www.electronjs.org/docs/latest/api/dialog
		return await this.ipcRenderer.invoke("dialog:showOpenDialog", options);
	}
	// 保存对话框
	async showSaveDialog(options) {
		return await this.ipcRenderer.invoke("dialog:showSaveDialog", options);
	}
	// showMessageBox
	async showMessageBox(options) {
		return await this.ipcRenderer.invoke("dialog:showMessageBox", options);
	}
	async showCertificateTrustDialog(options) {
		return await this.ipcRenderer.invoke("dialog:showCertificateTrustDialog", options);
	}
	async showErrorBox(title, content) {
		return await this.ipcRenderer.invoke("dialog:showErrorBox", title, content);
	}
	async showAboutBox() {
		return await this.ipcRenderer.invoke("dialog:showAboutBox");
	}
	// MARK shell openExternal openPath
	async openWithDefaultApp(filePath) {
		const shell = this.electron.shell;
		if (shell) {
			shell.openPath(filePath);
		}
	}
	async openExternal(url) {
		const shell = this.electron.shell;
		if (shell) {
			shell.openExternal(url);
		}
	}
	// MARK notification TODO
	addNoticificationEvents() {
		this.ipcRenderer.on("notification-click", (event) => console.log("通知click:", event));
		this.ipcRenderer.on("notification-close", (event) => console.log("通知close:", event));
		this.ipcRenderer.on("notification-show", (event) => console.log("通知show:", event));
		this.ipcRenderer.on("notification-reply", (event, reply) => console.log("通知reply:", event, reply));
	}
	showNotification(options) {
		// return this.ipcRenderer.invoke("notification:showNotification", options);
		options = {};
		options.title = "test title";
		options.body = "test body";
		options.subtitle = "test subtitle";
		options.hasReply = true;
		options.replyPlaceholder = "test placeholder";
		// return this.ipcRenderer.send("show-notification", options);
		return this.ipcRenderer.invoke("notification:show", options);
	}

	// MARK contextMenu Menu MenuItem
	async showContextMenu(options) {
		return await this.ipcRenderer.invoke("menu:showContextMenu", options);
	}
	// MARK 文件名相关
	// 返回完整的绝对路径
	getFullRealPath(relativePath) {
		return this.path.isAbsolute(relativePath) ? relativePath : this.path.join(this.__dirname, relativePath);
	}
	getFullPath(path) {
		const realPath = this.getRealPath(path);
		return this.getFullRealPath(realPath);
	}
	// 通过逐级向上查找父路径 处理虚拟路径
	getRealPath(filePath) {
		for (let currentPath = filePath; currentPath; ) {
			if (Object.prototype.hasOwnProperty.call(this.fileMap, currentPath)) {
				return this.fileMap[currentPath].realPath + filePath.substring(currentPath.length);
			}
			currentPath = extractParentPath(currentPath);
		}
		return filePath;
	}
	getBasePathName() {
		return this.path.basename(this.__dirname);
	}
	getFileMap() {
		return this.fileMap;
	}
	getParentPath(filePath) {
		return this.path.dirname(filePath);
	}
	shouldIgnore(path) {
		const res = this.ignorePatterns.some((pattern) => this.micromatch.isMatch(path, pattern, { dot: true }));
		// console.log(path, res);
		return res;
	}
	getPlatform() {
		return this.process.platform;
	}
	// MARK 文件核查与其他方法实现
	changeAbsolutePath(fullPath) {
		return this.path.isAbsolute(fullPath) ? fullPath : this.path.join(this.process.cwd(), fullPath);
	}
	BufferToArrayBuffer(buffer) {
		return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	}
	// 测试是否区分大小写
	testInsensitive() {
		const testFilePath = this.path.join(this.homePath, ".MOKOTEST");
		const testFilePathLower = this.path.join(this.homePath, ".mokotest");
		if (this.fs.existsSync(testFilePath)) this.fs.unlinkSync(testFilePath);
		this.fs.writeFileSync(testFilePath, "", "utf8");
		this.insensitive = this.fs.existsSync(testFilePathLower);
		this.fs.unlinkSync(testFilePath);
	}
	// 检查文件是否存在
	async _exists(FullPath, sensitive) {
		try {
			// https://nodejs.org/api/fs.html#fspromisesaccesspath-mode
			await this.fs.promises.access(FullPath);
		} catch (error) {
			console.error(error);
			return false;
		}
		if (sensitive && this.insensitive) {
			const dir = this.path.dirname(FullPath);
			const base = this.path.basename(FullPath);
			const files = await this.fs.promises.readdir(dir);
			return files.indexOf(base) !== -1;
		}
		return true;
	}
	// applyWriteOptions 写入文件 mtime atime
	async applyWriteOptions(fullPath, options) {
		if (options) {
			const { ctime, mtime, immediate } = options;
			if (ctime && this.btime) this.btime.btime(fullPath, ctime);
			if (mtime) await this.fs.promises.utimes(fullPath, mtime / 1e3, mtime / 1e3);
			if (immediate) immediate();
		}
	}
}

export default ElectronAdapter;
