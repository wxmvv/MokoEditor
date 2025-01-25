/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/lukasbach/react-complex-tree/blob/main/packages/core/src/uncontrolledEnvironment/StaticTreeDataProvider.ts
import { Disposable, ExplicitDataSource, TreeDataProvider, TreeItem, TreeItemIndex } from "./types";
import { EventEmitter } from "./EventEmitter";

export class TreeProvider<T = any> implements TreeDataProvider {
	private data: ExplicitDataSource;

	/** Emit an event with the changed item ids to notify the tree view about changes. */
	public readonly onDidChangeTreeDataEmitter = new EventEmitter<TreeItemIndex[]>();

	private setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>;

	constructor(
		items: Record<TreeItemIndex, TreeItem<T>>,
		setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>
		// private implicitItemOrdering?: (itemA: TreeItem<T>, itemB: TreeItem<T>) => number,
	) {
		this.data = { items };
		this.setItemName = setItemName;
	}

	public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
		// console.log(this.data.items[itemId]);
		// console.log(this.data.items);
		// console.log(itemId);
		return this.data.items[itemId];
	}

	public async onChangeItemChildren(itemId: TreeItemIndex, newChildren: TreeItemIndex[]): Promise<void> {
		this.data.items[itemId].children = newChildren;
		this.onDidChangeTreeDataEmitter.emit([itemId]);
	}
	public onDidChangeTreeData(listener: (changedItemIds: TreeItemIndex[]) => void): Disposable {
		const handlerId = this.onDidChangeTreeDataEmitter.on((payload) => listener(payload));
		return { dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId) };
	}

	public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
		if (this.setItemName) {
			this.data.items[item.index] = this.setItemName(item, name);
			// this.onDidChangeTreeDataEmitter.emit(item.index);
		}
	}
}

// export default class TreeProvider {
// 	constructor(initialItems) {
// 		this.items = initialItems || {}; // 存储树的初始数据
// 	}

// 	async getTreeItem(itemId) {
// 		return this.data.items[itemId];
// 	}

// 	// 获取根节点
// 	getRootItem() {
// 		return {
// 			id: "root", // 根节点的ID
// 			children: Object.keys(this.items), // 根节点下的所有子节点
// 			isFolder: true, // 标记为文件夹
// 			name: "Root",
// 		};
// 	}

// 	// 根据ID获取某个节点的详细信息
// 	getItem(itemId) {
// 		return this.items[itemId] || null; // 如果ID对应的项存在，则返回项；否则返回null
// 	}

// 	// 获取某个文件夹的子节点
// 	getChildren(itemId) {
// 		const item = this.items[itemId];
// 		if (item && item.isFolder) {
// 			return item.children || [];
// 		}
// 		return [];
// 	}

// 	// 设置新的数据
// 	setItems(newItems) {
// 		this.items = newItems;
// 	}

// 加载更多数据，比如从远程获取更多节点
// async loadMoreItems(itemId) {
// 	// 这里你可以模拟或者真正地从远程 API 获取数据
// 	const newItems = await this.fetchMoreItems(itemId);

// 	// 将新数据合并到当前数据中
// 	this.items = { ...this.items, ...newItems };
// }

// 模拟远程 API 获取更多数据
// async fetchMoreItems(itemId) {
// 	return new Promise((resolve) => {
// 		setTimeout(() => {
// 			resolve({
// 				"file-3": { id: "file-3", name: "New File", isFolder: false },
// 				"folder-4": { id: "folder-4", name: "New Folder", isFolder: true, children: [] },
// 			});
// 		}, 1000);
// 	});
// }
// }

// export { TreeProvider };
