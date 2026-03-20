import Events from "../../model/Events";
import FileView from "../../model/FileView";
import { createUntitledFile, getFileNameFromPath, isUntitledPath } from "../../utils/fileDraft.js";

export const welcomeInitPaneState = { tabs: [{ name: "欢迎", path: "welcome", type: "welcome" }], currentTabPath: "welcome" };
export const testInitPaneState = { tabs: [{ name: "测试", path: "test", type: "test" }], currentTabPath: "test" };
export const emptyInitPaneState = { tabs: [], currentTabPath: null };
export const untitledInitPaneState = { tabs: [{ name: "未命名文档", path: "untitled:1", type: "editor" }], currentTabPath: "untitled:1" };

export class Pane extends Events {
	constructor(parent, id) {
		super();
		this.id = id || randomId();
		this.type = "pane";
		this.moko = parent.moko;
		this.pane = this;
		this.parent = parent;
		this.workspace = parent.workspace;
		this.containerEl = parent.containerEl.createDiv(id ? `split-view pane ${id}` : "split-view pane");
		this.view = null; //MARK EditorView FileView WebView
		this._viewsCache = {}; // views缓存
		this.tabBar = null; //tabBar引用
		this.tabGroup = null; //tabGroup引用
		this.tabs = []; //所有tab
		this.currentTabPath = null; //当前激活的tab的path
		this.pinned = false;
		this.working = false; // 是否正在处理
		this.containerEl.addEventListener("focusin", () => this.workspace._setActivePane(this));
		this.containerEl.addEventListener("mousedown", () => this.workspace._setActivePane(this));
	}

	async setState(pane_state) {
		// console.log("[pane] setState:", pane_state);
		if (!pane_state || !Array.isArray(pane_state.tabs)) return;
		pane_state.tabs.filter((tab) => !this.moko.ViewRegistry.getTypeByExtension(getFileExtension(tab.path)));
		const tabs = pane_state.tabs;
		if (tabs.length === 0) return;
		const currentTabPath = pane_state.currentTabPath || tabs[0]?.path;
		for (const tab of tabs) {
			this.addTab(tab);
		}
		this.addTabBar();
		await this.openFile(tabs.find((tab) => tab.path === currentTabPath) || tabs[0]);
	}

	async newFile() {
		const file = createUntitledFile(this.tabs);
		await this.openFile(file);
		return file;
	}

	async openFile(file, openState) {
		if (!file) return;
		if (!openState) openState = {};
		let viewType;
		if (!file.extension) file.extension = getFileExtension(file.path);
		if (!file.name) file.name = extractFileName(file.path);
		if (file.path === "welcome") viewType = "welcome";
		else if (isUntitledPath(file.path)) viewType = "editor";
		else if (file.path === "test") viewType = "test";
		else if (file.path === "empty") viewType = "empty";
		else viewType = this.moko.ViewRegistry.getTypeByExtension(file.extension) || null;
		if (!viewType) viewType = "editor"; // TODO 1.添加更多extension 以及 2.如果不存在则直接打开二进制文件
		// state
		const state = openState.state || {};
		state.file = file.path;
		state.path = file.path;
		state.name = file.name;
		const shouldActivate = openState.active || this.moko.SettingManager.getSetting("editor.alwaysFocusNewTab"); // 确定是否激活新标签
		const group = openState.group;
		// work
		this.addCurrentTab(state);
		await this.setViewState({ file, type: viewType, state, active: shouldActivate, group }, openState.eState); // 创建视图状态 设置视图状态
	}

	async setViewState(viewState) {
		//  ephemeralState
		try {
			// console.log("setViewState", viewState, ephemeralState);
			if (this.working) return; // 如果正在处理，则直接返回 // 标记为正在处理
			else this.working = true;
			const state = viewState.state || {};
			const openOptions = { history: false, layout: false, close: false };
			// if (this.view) historyState = this.getState(); // 如果当前存在view 获取当前视图状态
			const view = await this._getView(viewState.type);
			await this._openView(view);
			if (this.view instanceof FileView) await this.setFile(viewState.file);
			else await this.view.setState(state, openOptions); // TODO 需要精简
			await this.view.focus(); // 打开后自动 auto focus
			// DOING
			await this.workspace._setActivePane(this);
			this._updateTabs(); // 更新tab 并autoPositionTab
		} catch (error) {
			console.error(error);
		} finally {
			this.working = false; // 处理完毕，重置状态
		}
	}
	// MARK 如果是FileView 则加载FileView.seFile()
	async setFile(file) {
		if (this.view instanceof FileView) await this.view.setFile(file);
		this.trigger("file-change", this);
	}
	// async saveFile() {
	// 	if (this.view instanceof FileView) {
	// 		console.log(this.view.file.path, this.view.getValue(), { encoding: this.view.encoding });
	// 		// await this.moko.FileManager.saveFile(this.view.file.path, this.view.getValue(), { encoding: this.view.encoding });
	// 	}
	// 	this.trigger("file-save", this);
	// }

	// DONE 视图
	// 通过type获取视图 如果缓存存在 直接获取，不存在则新建
	async _getView(viewType) {
		if (!viewType) return this.view;
		if (!this._viewsCache[viewType]) this._viewsCache[viewType] = this.moko.ViewRegistry.getViewCreatorByType(viewType)(this);
		return this._viewsCache[viewType];
	}
	// 打开视图
	async _openView(view) {
		try {
			if (!view) return;
			// console.log("[pane] _openView:", view);
			if (view === this.view) return view; // 如果目标视图是当前视图，则直接返回
			if (this.view) await this.view.close(); // 1.如果已存在view先关闭
			this.view = view; // this.containerEl.setChildrenInPlace([this.resizeHandleEl]); // 设置容器的子元素
			await view.open(this.containerEl);
			return view;
		} catch (error) {
			console.error("Failed to open view", error);
		}
	}
	// 重建视图
	async rebuildView() {
		// 记录之前的状态
		const viewState = this.getViewState();
		const ephemeralState = this.getEphemeralState();
		// 打开一个空视图
		await this._openView(null);
		// 设置视图状态
		await this.setViewState(viewState, ephemeralState);
	}
	// DONE 获取视图状态 & 获取短暂状态
	getIcon() {
		return this.view?.getIcon() || "";
	}
	getDisplayText() {
		return this.view?.getDisplayText() || "";
	}
	getFile() {
		return this.view?.getFile() || null;
	}
	//获取所有state
	getState() {
		return {
			icon: this.getIcon(),
			pane_state: this.getPaneState(),
			view_state: this.getViewState(),
			state: this.getViewState(),
			eState: this.getEphemeralState(),
			e_state: this.getEphemeralState(),
			...this.getPaneState(),
		};
	}
	getPaneState() {
		return {
			id: this.id,
			type: this.type,
			tabs: this.tabs,
			currentTabPath: this.currentTabPath,
		};
	}

	getViewState() {
		const viewState = {
			type: this.view?.getViewType() || "empty", // 获取视图类型或设置为 "empty"
			state: this.view?.getState() || {}, // 获取视图状态或设置为空对象
			file: this.view?.getFile() || null, // 获取视图文件或设置为 null
			currentTabPath: this.currentTabPath, // 获取当前标签页路径
		};
		if (this.pinned) viewState.pinned = true; // 设置 pinned 为 true
		return viewState;
	}
	// 备用
	getEphemeralState() {
		return this.view.getEphemeralState();
	}
	// DONE 获得视图split相关状态 TODO
	serialize() {
		return { id: this.id, type: this.type, state: this.getViewState(), group: this.group, pinned: this.pinned };
	}
	// DONE 是否置顶
	togglePinned() {
		// 	this.setPinned(!this.pinned);
		// }
		// setPinned(isPinned) {
		// 	this.pinned = isPinned; // 更新当前视图的固定状态
		// 	this.trigger("pinned-change", isPinned); // 触发“固定状态改变”事件
		// 	this.updateHeader(); // 更新头部信息
		// 	this.workspace.requestSaveLayout(); // 请求保存当前布局
		// 	const group = this.group; // 获取当前视图所在的组
		// 	if (group) {
		// 		const leaves = this.workspace.getGroupLeaves(group); // 获取组内所有视图
		// 		for (const leaf of leaves) {
		// 			if (leaf.pinned !== isPinned) {
		// 				leaf.setPinned(isPinned); // 更新组内每个视图的固定状态
		// 			}
		// 		}
		// 	}
	}
	// DONE 判断是否可以导航
	canNavigate() {
		return this.view.navigation && !this.pinned;
	}
	// DONE 判断是否可以关闭
	canClose() {
		return this.view.closeable;
	}
	// DONE 是否高光
	highlight() {
		this.containerEl.addClass("is-highlighted");
	}
	unhighlight() {
		this.containerEl.removeClass("is-highlighted");
	}
	// init
	focus() {
		if (!this.view) return;
		this.view?.focus();
	}
	// detach
	close() {
		this.containerEl.detach();
		this.onclose();
		// const index = this.workspace._panes.findIndex((obj) => obj.id === this.id); // 从panes缓存删除
		// if (index !== -1) this.workspace._panes.splice(index, 1);
		this.trigger("pane-close", this);
	}
	onclose() {
		if (this.workspace) this.workspace._removeActivePane(this); // 关闭pane时调用
	}

	// Tab
	addTabBar() {
		if (!this.tabBar) this.tabBar = this.moko.ToolBarRegistry.getToolbarById("tab-bar")(this); // 如果需要 则加载tabbar
		this.containerEl.insertBefore(this.tabBar.containerEl, this.containerEl.firstChild); //将tabbar放在最上
		this.tabBar.load();
		this.tabGroup = this.tabBar.getTabGroup();
	}
	removeTabBar() {
		if (!this.tabBar) return;
		this.tabBar.containerEl.detach();
		this.tabBar.unload();
		this.tabBar = null;
		this.tabGroup = null;
	}
	addCurrentTab(file) {
		if (!this.tabs.find((tab) => tab.path === file.path)) this.tabs.push(file);
		this.currentTabPath = file.path;
		this._updateTabs();
	}
	async selectTab(file) {
		if (!this.tabs.find((tab) => tab.path === file.path)) this.tabs.push(file);
		this.currentTabPath = file.path;
		await this.openFile(file);
		this._updateTabs();
	}
	addTab(file) {
		if (!this.tabs.find((tab) => tab.path === file.path)) this.tabs.push(file);
		else this.currentTabPath = file.path;
		this._updateTabs();
	}
	_closeTab(file) {
		this.tabs = this.tabs.filter((tab) => tab.path !== file.path);
		this._updateTabs();
	}

	async _showSaveDialog() {
		return await this.moko.FileManager.showSaveDialog();
	}
	async _showSaveConfirmDialog() {
		return await this.moko.FileManager.showSaveConfirmDialog();
	}
	replaceTabFile(oldPath, nextFile) {
		const tab = this.tabs.find((item) => item.path === oldPath);
		if (!tab) return;
		Object.assign(tab, nextFile);
		tab.name = nextFile.name || getFileNameFromPath(nextFile.path);
		tab.path = nextFile.path;
		tab.modified = false;
		if (this.currentTabPath === oldPath) this.currentTabPath = nextFile.path;
		this._updateTabs();
	}

	async closeTabByIndex(index) {
		let tab = this.tabs[index];
		if (!tab) return;
		if (tab.modified) {
			// DOING 这里是保存的逻辑 未来要放在其他地方
			console.log("[pane] tab is modified, can't close, show save dialog");
			if (tab.path !== this.currentTabPath) {
				await this.selectTab(tab);
				tab = this.tabs.find((item) => item.path === this.currentTabPath) || tab;
			}
			if (isUntitledPath(tab.path)) {
				const didSave = await this.workspace.save();
				if (!didSave) return;
				tab = this.tabs[index] || this.tabs.find((item) => !isUntitledPath(item.path) && item.name === tab.name) || tab;
			} else {
				const options = {
					title: "save file",
					detail: `name: ${tab.name} \npath: ${tab.path}`,
					message: "This buffer contains unsaved edits. Do you want to save it?",
					buttons: ["save", "don't save", "cancel"],
					defaultId: 0,
					cancelId: 2,
				};
				const res = await this.moko.FileManager.showMessageBox(options);
				// const res = await this.moko.adapter.showAboutBox();
				if (res.response === 0) {
					const didSave = await this.workspace.save();
					if (!didSave) return;
				} else if (res.response === 1) {
					console.log("不保存文件"); //TODO 不保存文件
				} else if (res.response === 2) return; //取消
				else return; //其他
			}
			// DOING
		}
		const currentIndex = this.tabs.findIndex((item) => item.path === tab.path);
		if (currentIndex === -1) return;
		this.tabs.splice(currentIndex, 1); //删除操作
		if (this.tabs.length !== 0) {
			const nextIndex = currentIndex >= this.tabs.length ? this.tabs.length - 1 : currentIndex;
			await this.selectTab(this.tabs[nextIndex]);
		} else {
			this.currentTabPath = null;
		}
		this._updateTabs();
	}
	_updateTabs() {
		if (this.tabs.length === 0) {
			console.log("[pane] tabs is empty, close pane");
			this.close();
		}
		this.tabs.forEach((file, index) => {
			if (file.path === this.currentTabPath) {
				this.currentTab = file;
				this.currentTabIndex = index;
				this.currentTabName = file.name;
			}
		});
		this.trigger("tab-update", this);
	}
}

export default Pane;
