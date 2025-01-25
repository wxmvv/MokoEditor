/* eslint-disable @typescript-eslint/no-unused-vars */
import Events from "../../model/Events.js";

export class Adapter extends Events {
	constructor() {
		super();
		this.fileMap = {};
	}
	// MARK fileMap

	// MARK 文件功能
	// append 追加
	async append(normalizedPath, data, writeOptions) {}
	// copy 复制文件
	async copy(normalizedPath, normalizedNewPath) {}
	// read 读取文件
	async read(normalizedPath, withBinary = false) {}
	// writeFile 写入文件
	async write(normalizedPath, data, writeOptions, withBinary = false) {}
	// remove 删除文件
	async remove(normalizedPath) {}
	// exists 检测文件是否存在
	async exists(normalizedPath, sensitive) {}
	// mkdir 创建文件夹
	async mkdir(normalizedPath) {}
	// rmdir 删除文件夹
	async rmdir(normalizedPath, recursive = true) {}
	// process 自动读取、修改和保存明文文件的内容。
	async process(normalizedPath, fn, writeOptions) {}
	// rename 重命名文件
	async rename(normalizedPath, normalizedNewPath) {}
	// stat 获取文件信息
	async stat(normalizedPath) {}

	// MARK 系统功能
	// 打开对话框
	async showOpenDialog(options) {
		console.log("showOpenDialog", options); //https://www.electronjs.org/docs/latest/api/dialog
	}
	async showSaveDialog(options) {
		console.log("showSaveDialog", options);
	}
	async openWithDefaultApp(filePath) {
		console.log("openWithDefaultApp", filePath);
	}
	async openExternal(filePath) {
		console.log("openExternal", filePath);
	}
	// notification
	
}

export default Adapter;
