/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as fs from "fs";
// import * as path from "path";

// const fs = window.require("original-fs");
// const path = window.require("path");

// 定义文件树的节点类型
interface TreeNode {
	id: string;
	index: string;
	path: string;
	level: number;
	extension: string;
	parentId?: string;
	name: string; //完整文件名 a.md
	basename: string; //文件名 a 去掉后缀
	realPath: string;
	absolutePath: string;
	children: string[];
	isExpanded: boolean;
	isFolder: boolean;
	type: "directory" | "file";
	hasChildren: boolean;
	createdAt?: Date;
	modifiedAt?: Date;
	stats?: any;
}

// 定义文件树的整体结构
interface TreeResult {
	[key: string]: TreeNode;
}

function removeFileExtension(e: string): string {
	const t = extractFileName(e).lastIndexOf(".");
	return -1 === t || t === e.length - 1 || 0 === t ? e : e.substr(0, t);
}
// 从路径字符串中提取文件扩展名（小写）。
function getFileExtension(e: string): string {
	const t = e.lastIndexOf(".");
	return -1 === t || t === e.length - 1 || 0 === t ? "" : e.substring(t + 1).toLowerCase();
}

// const path = require("path");
// const process = window.require("process");
// 创建节点信息（文件或文件夹）
export const createTreeNode = (fullPath: string, absolutePath: string, name: string, parentId: string, baselevel: number, isFolder: boolean, stats?: any): TreeNode => {
	return {
		id: fullPath,
		index: fullPath,
		name: name,
		path: fullPath,
		extension: getFileExtension(name),
		parentId: parentId,
		basename: removeFileExtension(name),
		realPath: absolutePath,
		absolutePath: absolutePath,
		level: baselevel,
		children: [],
		isExpanded: false,
		isFolder: isFolder,
		type: isFolder ? "directory" : "file",
		hasChildren: isFolder,
		stats: stats || undefined,
		createdAt: stats?.birthtime || undefined,
		modifiedAt: stats?.mtime || undefined,
	};
};

export const createTreeRootObject = (rootName: string = "root"): TreeResult => {
	const root = createTreeNode(rootName, rootName, rootName, rootName, 0, true);
	return { [rootName]: root };
};

export async function listAll() {}

export async function listRecursiveChild() {}

// 递归读取目录并返回结果
// export const readDirRecursiveList = async (dir: string, exclude: string[] = [], baselevel: number = 0, parentId: string = ""): Promise<TreeResult> => {
// 	let results: TreeResult;

// 	results = {
// 		[parentId]: createTreeNode(dir, path.basename(dir), parentId, baselevel, true),
// 	};

// 	const items = (await fs.promises.readdir(dir, { withFileTypes: true })) || [];
// 	for (const item of items) {
// 		const fullPath = path.join(dir, item.name);
// 		if (exclude.includes(item.name)) continue;
// 		let stats: any;
// 		try {
// 			stats = await fs.promises.stat(fullPath);
// 		} catch (err) {
// 			console.error(`Error getting stats for ${fullPath}:`, err);
// 			continue;
// 		}
// 		const nodeId = `${fullPath}`;
// 		if (item.isDirectory()) {
// 			const subDirResults = await readDirRecursiveList(fullPath, exclude, baselevel + 1, nodeId);
// 			results[parentId].children.push(nodeId);
// 			results[nodeId] = createTreeNode(fullPath, item.name, parentId, baselevel, true);
// 			results[nodeId].children = subDirResults[nodeId]?.children || [];
// 			results = { ...results, ...subDirResults };
// 		} else {
// 			results[parentId].children.push(nodeId);
// 			results[nodeId] = createTreeNode(fullPath, item.name, parentId, baselevel, false, stats);
// 		}
// 	}
// 	return results;
// };
