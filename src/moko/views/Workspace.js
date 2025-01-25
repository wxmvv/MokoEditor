import Panel from "./workspace/Panel";
import EditorView from "./content/EditorView";
import Pane from "./workspace/Pane";
import Events from "../model/Events";

import { testInitPaneState, welcomeInitPaneState, emptyInitPaneState, untitledInitPaneState } from "./workspace/Pane";

class Workspace extends Events {
	// 整个包含Editor工作区
	constructor(moko) {
		super();
		this.moko = moko;
		this.workspace = this;
		this.state = null; // TODO读取文件状态
		this.containerEl = this.moko.containerEl.createDiv("workspace");
		this.setWatermark();
		this.moko.addElement("workspace", this.containerEl);
		this.moko.addElement("workspace-watermark", this._watermarkEl);
		this.views = [];
		this.LayoutManager = null;
		// Pane
		this.activePane = null;
		this.activeView = null;
		this.activeEditor = null; // 当前激活的 编辑器 包含toolbar 和 editor
		this._panes = [];
		// this._panesCache = [];
		// Panel
		this.primary_siderbar = null; //left TODO
		this.secondary_siderbar = null; //right TODO
		this.activePanel = null; // 当前激活的 左panel
		this.activePanelType = null;
		this.panelsList = {};
		this.panel = new Panel(this); // 左panel // TODO 左右panel
		this.enbledPanelTypes = ["file-panel-view"];
		// Workspace
		this.state = null; // {}
		// this.undoHistory = []; // 撤销记录
		// Splitter
		// this.leftSplitter = null; // 左panel 分割线 // TODO Splitter
		// this.rightSplitter = null; // 右panel 分割线
		// config
		this.config = {
			startupEditor: "welcome", // none welcome newUntitledFile // none 启动时不打开编辑器 welcome 打开包含帮助使用的链接的欢迎页面 newUntitledFile 打开无标题文本文件(仅在打开空窗口使用)
			alwaysFocusNewTab: true, // 是否始终聚焦编辑器
		};

		// Events
		// on("css-change")
		// on('editor-menu')  //context menu on editor
		// on('file-menu') //context menu on file
		// .on("active-pane-change")
		// on("editor-change") // on editor change编辑器文本改变时触发
		// .on("active-editor-change")
		// .on("empty-workspace")
		// on('editor-drop')
		// on('editor-paste')
		// on('file-open')
		// on('layout-change')
		// on('quit')
		// on('resize')
		// on('window-close') // a popout window is closed.
		// on('window-open') // a popout window is opened.
	}
	// onCmEvents(cmInstance) {
	// 	cmInstance.on("change", (cm) => this.trigger("editor-change", cm));
	// 	cmInstance.on("cursorActivity", (cm) => this.trigger("editor-cursorActivity", cm));
	// 	cmInstance.on("focus", (cm) => this.trigger("editor-focus", cm));
	// 	cmInstance.on("blur", (cm) => this.trigger("editor-blur", cm));
	// }
	undo() {
		console.log("[workspace] undo", this.activeEditor);
		this.activeEditor.undo();
	}
	redo() {
		console.log("[workspace] redo", this.activeEditor);
		this.activeEditor.redo();
	}
	//MARK  初始化

	load(workspaceState) {
		if (!workspaceState) console.log("[workspace] load: empty workspaceState");
		else console.log("[workspace] load: ", workspaceState);
		this.loadPanelViews();
		this.setState(workspaceState);
		this.trigger("load-done", this);
	}
	// MARK workspace state
	setState(workspaceState) {
		if (workspaceState && workspaceState.panes.length > 0) this.state = workspaceState;
		else if (this.config.startupEditor === "newUntitledFile") this.state = { panes: [{ ...untitledInitPaneState }], panels: [] };
		else if (this.config.startupEditor === "welcome") this.state = { panes: [{ ...welcomeInitPaneState }], panels: [] };
		else if (this.config.startupEditor === "test") this.state = { panes: [{ ...testInitPaneState }], panels: [] };
		else if (this.config.startupEditor === "empty") this.state = { panes: [{ ...emptyInitPaneState }], panels: [] };
		else if (this.config.startupEditor === "none") this.state = { panes: null, panels: [] };
		else this.state = { panes: null, panels: [] }; // console.log(this.state.panes);
		this.setPanesState(this.state.panes, this.state.active_pane_id);
		// TODO openView
	}
	//获取workspaceState 应该在关闭时保存的
	getState() {
		const panes = this.getPanesState();
		const primary_siderbar = {}; // TODO
		const secondary_siderbar = {}; // TODO
		return {
			active_pane_id: this.activePane.id || null,
			panes,
			primary_siderbar,
			secondary_siderbar,
		};
	}
	// MARK PaneState
	async setPanesState(panesState, active_pane_id) {
		const _panes = await this._createPanes(panesState);
		this._setActivePane(_panes.find((pane) => pane.id === active_pane_id || "") || _panes[0], { focus: false });
	}
	getPanesState() {
		const panes_state = [];
		for (const pane of this._panes) panes_state.push(pane.getState());
		return panes_state;
	}
	async _createPanes(panesState) {
		await panesState.forEach(async (paneState) => await this._createPane(paneState));
		return this._panes;
	}
	async _createPane(paneState) {
		// console.log("[workspace] create pane: ", paneState);
		const pane = new Pane(this);
		if (paneState) await pane.setState(paneState);
		this._panes.push(pane);

		return pane;
	}

	// MARK set Active Pane & Editor
	_setActivePane(pane, options) {
		if (pane === this.activePane) return;
		if (!pane) {
			this.activePane = null;
			this.activeView = null;
			this.activeEditor = null;
		} else {
			this.activePane = pane;
			this.activeView = pane.view;
			if (this.activeView instanceof EditorView) this._setActiveEditor(this.activeView.editor);
			if (options?.focus) this.activePane.focus();
		}
		this.trigger("active-pane-change", pane);
		if (!pane) this.trigger("empty-workspace", this);
	}
	_removeActivePane(pane) {
		if (pane === this.activePane) this._setActivePane(null);
	}
	_setActiveEditor(editor) {
		if (!editor) return;
		this.activeEditor = editor; // this.onCmEvents(editor.cm);
		this.trigger("active-editor-change", editor); // 触发 editor-change 事件
	}

	/**
	 * // MARK
	 * @param {object} file
	 * @param {string} file.path
	 * @param {string} file.name
	 * @returns {Promise<File>}
	 */
	async openFile(file) {
		if (!this.activePane && this._panes.length === 0) {
			const paneState = {
				tabs: [file],
				currentTabPath: file.path,
			};
			this._createPane(paneState);
			this._setActivePane(this._panes[0]);
		} else if (!this.activePane && this._panes.length > 0) {
			this._setActivePane(this._panes[0]);
			this.activePane.openFile(file);
			this.workspace.containerEl.appendChild(this.activePane.containerEl);
		} else {
			this.activePane.openFile(file);
			this.workspace.containerEl.appendChild(this.activePane.containerEl);
		}
	}
	async openWelcome() {
		const file = { path: "welcome", name: "欢迎", type: "welcome" };
		await this.openFile(file);
	}
	async newUntitledTextFile() {
		console.log("workspace.newUntitledTextFile");
		const file = { path: "untitled", name: "未命名文档", type: "editor" };
		await this.openFile(file);
	}
	async newFile() {
		this.activePane.newFile();
	}
	_getActiveFileView() {
		const activeView = this.activeView;
		// 如果当前活动叶子存在并且有导航，且其视图是 YF 类型，返回该视图
		if (activeView && activeView.view.navigation) {
			return activeLeaf.view instanceof YF ? activeLeaf.view : null;
		}
		let bestView = null;
		// 遍历所有叶子节点，查找活动时间最长的叶子
		is.iterateAllLeaves(function (leaf) {
			if (leaf.view.navigation && (!activeLeaf || activeLeaf.activeTime < leaf.activeTime)) {
				activeLeaf = leaf;
				bestView = leaf.view instanceof YF ? leaf.view : null;
			}
		});
		return bestView;
	}
	getActiveFile() {
		const activeFileView = this._getActiveFileView(); // 获取当前活动文件视图
		return activeFileView ? activeFileView.file : null; // 如果活动文件视图存在，则返回其文件属性，否则返回 null
	}

	// MARK Panel
	// MARK Panel loadPanelViews
	loadPanelViews() {
		// TODO 自动注册开启的panel
		// const panelTypes = Object.keys(this.moko.ViewRegistry.viewByType);
		if (!this.enbledPanelTypes || this.enbledPanelTypes.length == 0) return; //console.log("ViewRegistry.viewByType is empty 未注册任何panel");
		for (const PanelTypeName of this.enbledPanelTypes) this.loadPanelView(PanelTypeName);
	}
	loadPanelView(PanelTypeName) {
		this.panelsList[PanelTypeName] = this.moko.ViewRegistry.viewByType[PanelTypeName](this.moko.workspace.panel);
		this.panelsList[PanelTypeName].containerEl.style.display = "none";
		this.panelsList[PanelTypeName].load();
	}
	// MARK Panel togglePanel
	togglePanel(PanelTypeName) {
		if (this.panel.collapsed) {
			this.switchPanel(PanelTypeName);
			this.openPanel(PanelTypeName);
		} else {
			if (this.activePanelType == PanelTypeName) {
				this.activePane.focus(); // 宽度问题
				this.closePanel();
			} else {
				this.switchPanel(PanelTypeName);
				this.openPanel(PanelTypeName);
			}
		}
	}
	switchPanel(PanelTypeName) {
		Object.keys(this.panelsList).forEach((panelName) => {
			if (panelName !== PanelTypeName) this.panelsList[panelName].containerEl.style.display = "none"; // 遍历所有 panel，将除当前 PanelTypeName 之外的所有 panel 隐藏
		});
		this.setActivePanel(this.panelsList[PanelTypeName]);
		this.activePanelType = PanelTypeName;
		this.activePanel.containerEl.style.display = "";
	}
	setActivePanel(panel) {
		this.activePanel = panel;
	}
	openPanel() {
		this.panel.expand();
	}
	closePanel() {
		this.panel.collapse();
	}
	// MARK Watermark 水印
	setWatermark() {
		this._watermarkEl = this.containerEl.createDiv("workspace-watermark");
		this._watermarkEl.createDiv("watermark-letterpress");
		// this._watermarkTitleEl = this._watermarkEl.createDiv("watermark-title");
		// this._watermarkTitleEl.setText("Moko");
		// this._watermarkEl.createDiv("watermark-shortcuts");
	}
}

export default Workspace;