import { Editor6 } from "../../editor/Editor.js";
import FileView from "../../model/FileView.js";

const EDITOR_VIEW_TYPE = "editor";
const editor_view_icon_name = "editor";


export class EditorView extends FileView {
	constructor(pane, id) {
		super(pane, id ? `${id}-editor-view` : "editor-view");
		this.toolBars = {};
		// this.editor = new Editor(this);
		this.editor = new Editor6(this);
		this.viewType = EDITOR_VIEW_TYPE;
		this.file = {}; //path 文件路径 name 文件名
		// this.moko.workspace.onCmEvents(this.editor.cm);
	}
	static get VIEW_TYPE() {
		return EDITOR_VIEW_TYPE;
	}
	getViewType() {
		return EDITOR_VIEW_TYPE;
	}
	getIcon() {
		return editor_view_icon_name;
	}
	async onopen() {
		this.addToolBarById("editor-tool-bar");
	}
	async onclose() {
		// this.removeToolBarById("editor-tool-bar");
	}

	// MARK 设置状态 设置文本
	async setState(state, options) {
		console.log("Editor View setState", state, options);
		await this.setFile(state);
	}
	async setFile(item, cmState) {
		// console.log("Editor View setFile", item, cmState);
		this.file = item;
		let value;
		if (item.path === "untitled") value = "";
		else value = await this.moko.FileManager.openFile(item.path);
		this.editor.setFile(item, value, cmState);
	}

	getState() {
		const stateData = super.getState(); // stateData.mode = this.getMode(); // 获取当前模式 // stateData.backlinks = this.showBacklinks; // 是否显示反向链接 // stateData.source = this.editMode.sourceMode; // 获取编辑模式的源模式
		return stateData; // 返回完整的状态数据
	}
	getEphemeralState() {
		const eState = super.getEphemeralState.call(this); // 更新当前模式的状态 // this.currentMode.getEphemeralState(state);
		if (this.scroll) eState.scroll = this.scroll; // 如果有滚动位置，添加到状态中
		return eState;
	}
	// getMode() {
	// 	return this.currentMode.type;
	// }
	focus() {
		if (!this.editor || !this.editor.cm) return;
		this.editor.cm.focus();
	}
}

export default EditorView;

// async setState(newState, options) {
//  let hasChanged = false; // 标记是否有状态变化
//  const mode = newState.mode; // 获取新状态中的模式
//  const backlinks = newState.backlinks; // 获取新状态中的反向链接设置
//  const sourceMode = newState.source; // 获取新状态中的源模式
//  // 如果有模式，检查并设置模式
//  if (mode) {
//      if (Object.prototype.hasOwnProperty.call(this.modes, mode)) {
//          hasChanged = await this.setMode(this.modes[mode]); // 设置模式
//      }
//  }
//  // 更新编辑模式和反向链接设置
//  const editMode = this.editMode;
//  if (typeof sourceMode === "boolean" && editMode.sourceMode !== sourceMode) {
//      editMode.toggleSource(); // 切换源模式
//      hasChanged = true; // 标记状态变化
//  }
//  if (typeof backlinks === "boolean") {
//      this.showBacklinks = backlinks; // 更新反向链接设置
//      this.updateShowBacklinks(); // 更新显示状态
//  }
//  // 如果状态有变化，设置布局更新标记
//  if (hasChanged) {
//      options.layout = true;
//  }
//  // 调用父类的 setState 方法
//  await this.setState.call(this, newState, options);
// }

// // MARK 设置状态 设置文本
// async setState(state, options) {
// 	console.log("Editor View setState", state, options);
// 	const file = state.file;
// 	this.setFile(file);
// 	// let shouldUpdateLayout = false; // 是否需要更新布局
// 	// const { file, mode, backlinks, source } = state; // 解构参数
// 	// if (mode) {
// 	// 	if (Object.prototype.hasOwnProperty.call(this.modes, mode)) {
// 	// 		shouldUpdateLayout = await this.setMode(this.modes[mode]); // 设置模式
// 	// 	}
// 	// }
// 	// const editMode = this.editMode;
// 	// // 处理 sourceMode
// 	// if (typeof source === "boolean" && editMode.sourceMode !== source) {
// 	// 	editMode.toggleSource();
// 	// 	shouldUpdateLayout = true; // 更新布局
// 	// }
// 	// // 处理 backlinks
// 	// if (typeof backlinks === "boolean") {
// 	// 	this.showBacklinks = backlinks;
// 	// 	this.updateShowBacklinks();
// 	// }
// 	// // 如果需要更新布局，则设置 options.layout
// 	// if (shouldUpdateLayout) {
// 	// 	options.layout = true;
// 	// }
// 	// // 调用父类的 setState 方法
// 	// await super.setState(state, options);
// }
