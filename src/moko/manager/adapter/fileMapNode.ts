interface FileMapNode {
	id: string;
	name: string;
	path: string;
	extension: string;
	parentId: string;
	basename: string;
	realPath: string;
	absolutePath: string;
	level: number;
	children: FileMapNode[];
	isExpanded: boolean;
	isFolder: boolean;
	type: "directory" | "file";
	hasChildren: boolean;
	stats: object | undefined;
	createdAt: number | undefined;
	modifiedAt: number | undefined;
}

export default FileMapNode;

// function createTreeNode(fullPath, absolutePath, name, parentId, baselevel, isFolder, stats) {
// 	return {
// 		id: fullPath,
// 		index: fullPath,
// 		name: name,
// 		path: fullPath,
// 		extension: getFileExtension(name),
// 		parentId: parentId,
// 		basename: removeFileExtension(name),
// 		realPath: absolutePath,
// 		absolutePath: absolutePath,
// 		level: baselevel,
// 		children: [],
// 		isExpanded: false,
// 		isFolder: isFolder,
// 		type: isFolder ? "directory" : "file",
// 		hasChildren: isFolder,
// 		stats: stats || undefined,
// 		createdAt: stats?.birthtime || undefined,
// 		modifiedAt: stats?.mtime || undefined,
// 	};
// }

// buildTree(dir, parentNode) {
// 	const items = this.fs.readdirSync(dir);
// 	items.forEach((item) => {
// 		if (this.shouldIgnore(item)) return; // 忽略隐藏文件
// 		const itemPath = this.path.join(dir, item);
// 		const stats = this.fs.statSync(itemPath);
// 		const node = createTreeNode(itemPath, this.changeAbsolutePath(itemPath), item, parentNode.id, parentNode.level + 1, stats.isDirectory(), stats);
// 		this.fileMap[node.id] = node;
// 		parentNode.children.push(node.id);
// 		if (stats.isDirectory()) {
// 			this.buildTree(itemPath, node);
// 		}
// 	});
// }
