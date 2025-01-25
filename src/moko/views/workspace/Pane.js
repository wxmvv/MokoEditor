import Events from "../../model/Events";
import FileView from "../../model/FileView";

export const welcomeInitPaneState = { tabs: [{ name: "欢迎", path: "welcome", type: "welcome" }], currentTabPath: "welcome" };
export const testInitPaneState = { tabs: [{ name: "测试", path: "test", type: "test" }], currentTabPath: "test" };
export const emptyInitPaneState = { tabs: [], currentTabPath: null };
export const untitledInitPaneState = { tabs: [{ name: "未命名文档", path: "untitled", type: "editor" }], currentTabPath: "untitled" };

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

	// MARK 关闭pane时调用
	onclose() {
		if (this.workspace) this.workspace.removeActivePane(this);
	}
	// MARK 主进程
	// setState()
	async setState(pane_state) {
		// console.log("[pane] setState:", pane_state);
		if (!pane_state) pane_state = emptyInitPaneState;
		const tabs = pane_state.tabs;
		const currentTabPath = pane_state.currentTabPath || tabs[0]?.path;
		for (const tab of tabs) {
			if (tab.path === currentTabPath) {
				const result = this.openFile(tab);
				if (result === "openWithDefaultApp") console.log("openWithDefaultApp 不需要添加tab");
				else this.addTab(tab);
			}
			this.addTab(tab);
		}
		if (!this.currentTabPath) {
			this.openFile(tabs[0]);
		}
		this.addTabBar();
	}

	// MARK
	newFile() {}
	// DONE openFile
	// MARK 添加新视图
	async openFile(file, openState) {
		if (!file) return;
		if (!openState) openState = {};
		let viewType; // 获取视图类型
		if (!file.extension) file.extension = getFileExtension(file.path);
		if (!file.name) file.name = extractFileName(file.path);
		if (file.path === "welcome") viewType = "welcome";
		else if (file.path === "untitled") viewType = "editor";
		else if (file.path === "test") viewType = "test";
		else if (file.path === "empty") viewType = "empty";
		else viewType = this.moko.ViewRegistry.getTypeByExtension(file.extension) || null;
		if (!viewType) {
			// TODO 打开默认应用 目前有一点问题 测试时如果workspacestate中tabs包含了无法识别的文件，则会在打开文件后重新加载
			// TODO 解决方法：在打开文件时，如果文件类型无法识别，则从tab中删除
			// this.tabs = this.tabs.filter((tab) => tab.path !== file.path);
			this.moko.openWithDefaultApp(file.path);
			return "openWithDefaultApp";
			// viewType = "editor";
		}
		// 状态相关
		const state = openState.state || {}; // 获取状态
		state.file = file.path;
		state.path = file.path;
		state.name = file.name;
		const shouldActivate = openState.active || this.moko.SettingManager.getSetting("editor.alwaysFocusNewTab"); // 确定是否激活新标签
		const group = openState.group; // 获取组
		// 添加tab
		this.addCurrentTab(state);
		// 设置状态
		await this.setViewState({ file, type: viewType, state, active: shouldActivate, group }, openState.eState); // 创建视图状态 设置视图状态
	}

	async setViewState(viewState) {
		// , ephemeralState
		try {
			// console.log("setViewState", viewState, ephemeralState);
			if (this.working) return; // 如果正在处理，则直接返回 // 标记为正在处理
			else this.working = true;
			// state
			// let historyState;
			// let newView;
			// const currentViewType = this.view?.getViewType() || "";
			const state = viewState.state || {};
			const openOptions = { history: false, layout: false, close: false };
			// if (this.view) historyState = this.getState(); // 如果当前存在view 获取当前视图状态
			const view = await this._getView(viewState.type);
			await this._openView(view); // openOptions.layout = true; // openOptions.history = true; //如果是同样的view类型，则直接更新状态
			if (this.view instanceof FileView) await this.setFile(viewState.file);
			else await this.view.setState(state, openOptions); // TODO 需要精简
			// 设置视图状态
			// await this.view.setState(state, openOptions);
			// if (this.view instanceof FileView) await this.setFile(viewState.file);
			// 暂时未使用
			// if (openOptions.close) await this.openView(null); // 关闭视图
			// console.log("setViewState", viewState, ephemeralState);
			// if (viewState.active) this.workspace._setActivePane(this, { focus: true });
			// if (viewState.group !== undefined) this.setGroupMember(viewState.group);
			// if (options) this.setEphemeralState(options);
			// if (viewState.popstate || state.sync) openOptions.history = false;
			// if (openOptions.layout) this.workspace.onLayoutChange();
			// this.updateHeader();
			// if (openOptions.history && historyState) this.recordHistory(historyState);
			// if (openOptions.done) openOptions.done(); // 调用完成回调
		} catch (error) {
			console.error(error);
		} finally {
			this.working = false; // 处理完毕，重置状态
		}
	}
	// MARK 如果是FileView 则加载FileView.seFile()
	async setFile(file) {
		if (this.view instanceof FileView) this.view.setFile(file);
		// console.log("[pane] setFile:", file);
		this.trigger("file-change", this);
	}

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
			title: this.getDisplayText(),
			icon: this.getIcon(),
			pane_state: this.getPaneState(),
			view_state: this.getViewState(),
			// file: this.getViewState().file,
			state: this.getViewState(),
			eState: this.getEphemeralState(),
			e_state: this.getEphemeralState(),
		};
	}
	getPaneState() {
		return {
			tabs: this.tabs,
			currentTabPath: this.currentTabPath,
		};
	}

	getViewState() {
		const viewState = {
			type: this.view?.getViewType() || "empty", // 获取视图类型或设置为 "empty"
			state: this.view?.getState() || {}, // 获取视图状态或设置为空对象
			file: this.view?.getFile() || null, // 获取视图文件或设置为 null
		};
		if (this.pinned) viewState.pinned = true; // 设置 pinned 为 true
		return viewState;
	}
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
	// MARK init 初始化方法

	focus() {
		this.view?.focus();
	}
	// MARK detach
	close() {
		this.containerEl.detach(); // 从 DOM 中移除容器
		this.onclose(); // 调用 onClose 方法
		// const index = this.workspace._panes.findIndex((obj) => obj.id === this.id); // 从panes缓存删除
		// if (index !== -1) this.workspace._panes.splice(index, 1);
		this.trigger("pane-close", this);
	}

	// MARK Tab相关
	// MARK 添加tabbar视图
	addTabBar() {
		if (!this.tabBar) this.tabBar = this.moko.ViewRegistry.getToolbarById("tab-bar")(this); // 如果需要 则加载tabbar
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
	selectTab(file) {
		if (!this.tabs.find((tab) => tab.path === file.path)) this.tabs.push(file);
		this.currentTabPath = file.path;
		this.openFile(file);
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
		this.moko.FileManager.showSaveDialog();
	}
	async _showSaveConfirmDialog() {
		this.moko.FileManager.showSaveConfirmDialog();
	}

	async closeTabByIndex(index) {
		if (this.tabs[index].modified) {
			// DOING 这里是保存的逻辑 未来要放在其他地方
			const tab = this.tabs[index];
			console.log("[pane] tab is modified, can't close, show save dialog");
			if (tab.path === "untitled") {
				// if (tab是untitled) {
				const savePath = await this._showSaveDialog();
				if (savePath) this.moko.FileManager.saveFile(savePath, tab.content);
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
					console.log("保存文件"); //TODO 保存文件
				} else if (res.response === 1) {
					console.log("不保存文件"); //TODO 不保存文件
				} else if (res.response === 2) return; //取消
				else return; //其他
			}
			// DOING
		}
		this.tabs.splice(index, 1); //删除操作
		if (this.tabs.length !== 0) {
			if (index >= this.tabs.length) index = this.tabs.length - 1;
			this.selectTab(this.tabs[index]);
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
