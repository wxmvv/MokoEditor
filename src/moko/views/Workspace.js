import Sidebar from "./workspace/Sidebar";
import EditorView from "./content/EditorView";
import Pane from "./workspace/Pane";
import Events from "../model/Events";
import { getFileNameFromPath, isUntitledPath } from "../utils/fileDraft.js";

import { testInitPaneState, welcomeInitPaneState, emptyInitPaneState, untitledInitPaneState } from "./workspace/Pane";

function getStartupWorkspaceState(startupEditorConfig = "none") {
	if (startupEditorConfig === "newUntitledFile") return { panes: [{ ...untitledInitPaneState }], panels: [] };
	else if (startupEditorConfig === "welcome") return { panes: [{ ...welcomeInitPaneState }], panels: [] };
	else if (startupEditorConfig === "test") return { panes: [{ ...testInitPaneState }], panels: [] };
	else if (startupEditorConfig === "empty") return { panes: [{ ...emptyInitPaneState }], panels: [] };
	else if (startupEditorConfig === "none") return { panes: null, panels: [] }; // TODO
	else return { panes: null, panels: [] };
}

class Workspace extends Events {
	// 整个包含Editor工作区
	constructor(moko) {
		super();
		this.moko = moko;
		this.workspace = this;
		this.containerEl = this.moko.containerEl.createDiv("workspace");
		this.setWatermark();
		this.moko.addElement("workspace", this.containerEl);
		this.moko.addElement("workspace-watermark", this._watermarkEl);
		// workspace
		this.state = null; // workspace.json
		this.LayoutManager = null; // TODO
		this.views = [];
		// this.undoHistory = []; // 撤销记录
		// Splitter
		// this.leftSplitter = null; // 左panel 分割线 // TODO Splitter
		// this.rightSplitter = null; // 右panel 分割线
		// pane
		this.activePane = null;
		this.activeView = null;
		this.activeEditor = null; // 当前激活的 编辑器 包含toolbar 和 editor
		this._panes = [];
		// Sidebar
		this.primary_siderbar = new Sidebar(this, true); //TODO left
		this.secondary_siderbar = new Sidebar(this, false); //TODO right
		this.enbledPrimarySidebarTypes = ["file-panel-view"];
		this.enbledSecondarySidebarTypes = ["file-panel-view"];
		// config
		this.config = {
			startupEditor: "xxx", // none welcome newUntitledFile // none 启动时不打开编辑器 welcome 打开包含帮助使用的链接的欢迎页面 newUntitledFile 打开无标题文本文件(仅在打开空窗口使用)
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

	// Init
	load(workspaceState) {
		if (!workspaceState) console.log("[workspace] no state, use default");
		else console.log("[workspace] load state", workspaceState);
		this.primary_siderbar.loadSidebarViews(this.enbledPrimarySidebarTypes);
		this.secondary_siderbar.loadSidebarViews(this.enbledSecondarySidebarTypes);
		this.setState(workspaceState);
	}

	setState(workspaceState) {
		if (workspaceState && workspaceState.panes.length > 0) this.state = workspaceState;
		else this.state = getStartupWorkspaceState(this.config.startupEditor);
		this.setPanesState(this.state.panes, this.state.active_pane_id).then(() => {
			this.trigger("load-done", this);
		});
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
	// MARK PaneState
	async setPanesState(panesState, active_pane_id) {
		if (!panesState) return;
		const _panes = await this._createPanes(panesState);
		this._setActivePane(_panes.find((pane) => pane.id === active_pane_id || "") || _panes[0], { focus: false });
	}
	getPanesState() {
		const panes_state = [];
		for (const pane of this._panes) panes_state.push(pane.getState());
		return panes_state;
	}
	async _createPanes(panesState) {
		for (const paneState of panesState) {
			await this._createPane(paneState);
		}
		return this._panes;
	}
	async _createPane(paneState) {
		if (!paneState) return;
		const pane = new Pane(this);
		await pane.setState(paneState);
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
	// Sidebar
	toggleSidebarByType(type) {
		this.primary_siderbar.toggleSidebarByType(type);
		this.secondary_siderbar.toggleSidebarByType(type);
	}

	// TODO 待完善
	async save() {
		if (!this.activeEditor?.file?.path) return false;
		const currentFile = this.activeEditor.file;
		const value = this.activeEditor.getValue();
		if (isUntitledPath(currentFile.path)) {
			return await this.saveActiveFileAs(currentFile, value);
		}
		await this.moko.FileManager.saveFile(currentFile.path, value, {}, false);
		this.activeEditor.setSaved(value, currentFile);
		return true;
	}
	async saveActiveFileAs(file = this.activeEditor?.file, value = this.activeEditor?.getValue?.()) {
		if (!file) return false;
		const defaultPath = file.name?.endsWith(".md") ? file.name : `${file.name || "未命名文档"}.md`;
		const savePath = await this.moko.FileManager.showSaveDialog({
			properties: ["showHiddenFiles", "createDirectory", "showOverwriteConfirmation"],
			message: "Save File Location",
			defaultPath,
		});
		if (!savePath) return false;

		const savedFile = {
			...file,
			path: savePath,
			name: getFileNameFromPath(savePath),
			type: "editor",
			modified: false,
		};

		await this.moko.FileManager.saveFile(savePath, value || "", {}, false);
		this.activePane?.replaceTabFile(file.path, savedFile);
		this.activeEditor.replaceFilePath(file.path, savedFile, value || "");
		this.activeEditor.setSaved(value || "", savedFile);
		this.trigger("file-saved-as", savedFile);
		return true;
	}
	async openWelcome() {
		const file = { path: "welcome", name: "欢迎", type: "welcome" };
		await this.openFile(file);
	}
	async newUntitledTextFile() {
		if (this.activePane) return await this.activePane.newFile();
		const pane = await this._createPane(emptyInitPaneState);
		this._setActivePane(pane, { focus: false });
		return await pane.newFile();
	}
	async newFile() {
		return await this.newUntitledTextFile();
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
