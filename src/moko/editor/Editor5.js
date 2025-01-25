//DONE  cm5
const CodeMirror = window.CodeMirror;
import "../../../cmHelper/theme/3024-day.css"; //white
import "../../../cmHelper/theme/3024-night.css"; //black
import "../../../cmHelper/theme/abbott.css"; //black
import "../../../cmHelper/theme/abcdef.css"; //black
import "../../../cmHelper/theme/ambiance-mobile.css"; //white
import "../../../cmHelper/theme/ambiance.css"; //black
import "../../../cmHelper/theme/ayu-dark.css"; //black
import "../../../cmHelper/theme/ayu-mirage.css"; //black
import "../../../cmHelper/theme/base16-dark.css"; //black
import "../../../cmHelper/theme/base16-light.css"; //white
import "../../../cmHelper/theme/bespin.css"; //black
import "../../../cmHelper/theme/blackboard.css"; //black
import "../../../cmHelper/theme/cobalt.css"; //black 蓝色
import "../../../cmHelper/theme/colorforth.css"; //black 黑白
import "../../../cmHelper/theme/darcula.css"; //black 偏暗
import "../../../cmHelper/theme/dracula.css"; //black
import "../../../cmHelper/theme/duotone-dark.css"; //black 字体
import "../../../cmHelper/theme/duotone-light.css"; //white 字体
import "../../../cmHelper/theme/eclipse.css"; //white
import "../../../cmHelper/theme/elegant.css"; //white
import "../../../cmHelper/theme/erlang-dark.css"; //black
import "../../../cmHelper/theme/gruvbox-dark.css"; //black
import "../../../cmHelper/theme/hopscotch.css"; //black
import "../../../cmHelper/theme/icecoder.css"; //black
import "../../../cmHelper/theme/idea.css"; //white
import "../../../cmHelper/theme/isotope.css"; //black
import "../../../cmHelper/theme/juejin.css"; //white
import "../../../cmHelper/theme/lesser-dark.css"; //black
import "../../../cmHelper/theme/liquibyte.css"; //black 纯黑背景
import "../../../cmHelper/theme/lucario.css"; //black
import "../../../cmHelper/theme/material-darker.css"; //black
import "../../../cmHelper/theme/material-ocean.css"; //black
import "../../../cmHelper/theme/material-palenight.css"; //black
import "../../../cmHelper/theme/material.css"; //black
import "../../../cmHelper/theme/mbo.css"; //black
import "../../../cmHelper/theme/mdn-like.css"; //white 线条背景
import "../../../cmHelper/theme/midnight.css"; //black
import "../../../cmHelper/theme/monokai.css"; //white
import "../../../cmHelper/theme/moxer.css"; //black
import "../../../cmHelper/theme/neat.css"; //white
import "../../../cmHelper/theme/neo.css"; //white
import "../../../cmHelper/theme/night.css"; //black 紫薯
import "../../../cmHelper/theme/nord.css"; //black
import "../../../cmHelper/theme/oceanic-next.css"; // black!
import "../../../cmHelper/theme/panda-syntax.css"; //black
import "../../../cmHelper/theme/paraiso-dark.css"; //酒红色
import "../../../cmHelper/theme/paraiso-light.css"; //淡黄色 white
import "../../../cmHelper/theme/pastel-on-dark.css";
import "../../../cmHelper/theme/railscasts.css"; //black
import "../../../cmHelper/theme/rubyblue.css"; //black
import "../../../cmHelper/theme/seti.css"; //black
import "../../../cmHelper/theme/shadowfox.css"; //black
import "../../../cmHelper/theme/solarized.css"; //white 侧边带阴影
import "../../../cmHelper/theme/ssms.css"; //white
import "../../../cmHelper/theme/the-matrix.css"; //black 控制台风格
import "../../../cmHelper/theme/tomorrow-night-bright.css"; //white
import "../../../cmHelper/theme/tomorrow-night-eighties.css"; //black
import "../../../cmHelper/theme/ttcn.css"; //white
import "../../../cmHelper/theme/twilight.css"; //black
import "../../../cmHelper/theme/vibrant-ink.css"; //black
import "../../../cmHelper/theme/xq-dark.css"; //black
import "../../../cmHelper/theme/xq-light.css"; //white
import "../../../cmHelper/theme/yeti.css"; //white
import "../../../cmHelper/theme/yonce.css"; //black
import "../../../cmHelper/theme/zenburn.css"; //black
// import "../../../cmHelper/mode/javascript/javascript";
// import "../../../cmHelper/addon/comment/comment";
// import "../../../cmHelper/addon/comment/continuecomment";
// import "../../../cmHelper/addon/dialog/dialog.js";
// import "../../../cmHelper/addon/dialog/dialog.css";用处未知
// import "../../../cmHelper/";

const formatTypes = {
	bold: { nodeType: "strong", surroundingChars: "**", altSurroundingChars: "__" },
	italic: { nodeType: "em", surroundingChars: "*", altSurroundingChars: "_" },
	code: { nodeType: "inline-code", surroundingChars: "`" },
	highlight: { nodeType: "highlight", surroundingChars: "==" },
	strikethrough: { nodeType: "strikethrough", surroundingChars: "~~" },
	comment: { nodeType: "comment", surroundingChars: "%%" },
	math: { nodeType: "math", surroundingChars: "$" },
};

// const checkFormat = (cmState) => {};

class Editor5 {
	constructor(container, options) {
		this.options = options;
		this.keyMaps = {};
		this.moko = container.moko;
		this.view = container;
		this.containerEl = container.containerEl.createDiv("editor"); // this.element = container.containerEl.createEl("textarea", "cmEditor");
		this.cmEl = this.containerEl.createEl("textarea", "cmEditor");
		this.pane = container.pane;
		// options
		this.cmLightTheme = "eclipse"; //mdn-like idea solarized juejin ssms eclipse
		this.cmDarkTheme = "erlang-dark"; //moxer nord
		this.changed = false;
		this.mode = "markdown";
		this.cm = this.initCodeMirror();
		this.doc = this.cm.getDoc();
		this.file = container.file || null;
		this.modified = false;
		this.fileState = null;
		this._fileCache = {};
		// 初始化颜色 & 滚动条事件
		this.containerEl.addEventListener("mousemove", this.showScrollbar);
		this.containerEl.addEventListener("mouseleave", this.hideScrollbar);
		// this.containerEl.addEventListener("scroll", this.showScrollbar);
		this.cm.on("change", () => this.setModified(true)); // TODO 添加tabs中的modified属性
		this.moko.SettingManager.theme.on("theme-change", (isDarkMode) => this.handleCmThemeChange(isDarkMode));
		this.moko.SettingManager.theme.on("theme-change", () => this.updateCmBg());
		this.cm.on("blur", () => this.handleBlur());
		this.cm.on("focus", () => this.handleFocus());
	}
	handleBlur() {
		this.cm.setOption("extraKeys", {});
	}
	handleFocus() {
		this.cm.setOption("extraKeys", {
			Enter: "newlineAndIndentContinueMarkdownList",
			Tab: "tabAndIndentMarkdownList",
			"Shift-Tab": "shiftTabAndUnindentMarkdownList", // "Cmd-/": "toggleComment", // addon comment 或根据需要设置其他快捷键 // "Cmd-Alt-/": "continueComment", // 根据需要设置快捷键 // "Cmd-Shift-D": (cm) => this.cm.openDialog(cm), // ??
		});
	}

	// MARK isModified 解决方案
	isModified(cm) {
		const history = cm.getHistory();
		// console.log("history", history);
		if (!history || history.done.length === 0) return false;
		if (history.done && history.done.length > 0) {
			for (const item of history.done) {
				if (item.changes && item.changes.length > 0) return true;
			}
			return false;
		} else return false;
	} // 第一种判断history
	// isModified2() {} // 第二种 直接对比全文
	setModified(mod) {
		// console.log(this.view.file, this.pane.tabs);
		if (this.modified === mod) return;
		this.modified = mod;
		this.view.file.modified = mod;
		const currentTab = this.pane.tabs.find((tab) => tab.path === this.view.file.path);
		if (currentTab) currentTab.modified = mod;
		// this.pane.tabs.forEach((tab) => {if (tab.path === this.view.file.path) {tab.modified = mod}});
		this.pane._updateTabs();
	}

	undo() {
		this.doc.undo();
		this.setModified(this.isModified(this.cm));
	}
	redo() {
		this.doc.redo();
	}

	// TODO 自定义功能按键
	toggleMarkdownFormatting = function (format) {
		const cm = this.cm;
		const formattingInfo = formatTypes[format];
		if (!formattingInfo) return; // 如果格式不存在则返回
		// TODO 如果选择中有Table 则重设选择
		//  if (l.length > 0) {
		// 	c = l.map(function (e) {
		// 		var t = e.getAbsoluteOffsets();
		// 		var textStart = t.textStart;
		// 		var textEnd = t.textEnd;
		// 		return ki.range(textStart, textEnd);
		// 	});
		// 	s = false;
		// }
		// const tableSelection = this.getTableSelection();  	// return this.editorComponent.tableCell ? this.editorComponent.tableCell.table.selectedCells : [];
		//
		const selection = cm.state.selection.ranges; // 获取当前选择的文本
		const start = cm.getCursor("start"); // 获取选择开始的位置
		const end = cm.getCursor("end");

		// const markState = {};

		// 检查当前选择的文本是否已被格式化
		const isFormatted = selection.startsWith(formattingInfo.surroundingChars) && selection.endsWith(formattingInfo.surroundingChars);

		// 生成新的文本
		const newText = isFormatted
			? selection.slice(formattingInfo.surroundingChars.length, -formattingInfo.surroundingChars.length) // 移除格式
			: formattingInfo.surroundingChars + selection + formattingInfo.surroundingChars; // 添加格式

		// 更新文本
		cm.replaceRange(newText, start, end);

		// 更新光标位置
		const newCursorPos = start.ch + (isFormatted ? selection.length - formattingInfo.surroundingChars.length * 2 : selection.length + formattingInfo.surroundingChars.length * 2);
		cm.setCursor({ line: start.line, ch: newCursorPos });
	};
	// TODO 表格Table
	getTableSelection = function () {
		return this.editorComponent.tableCell ? this.editorComponent.tableCell.table.selectedCells : [];
	};

	// DONE 设置当前文件 // TODO cmState 保存历史 到文件
	// , cmState
	setFile(item, value) {
		if (item.path === this.file?.path) return; //如果和现在打开的文件一样怎返回
		if (item.path === "untitled") this.file = null;
		this.setMode(CodeMirror.findModeByFileName(item.name)?.mode || "markdown"); // 设定解析模式
		// 保存历史状态
		const historyCmState = this.getCmState(this.cm);
		if (this.file) this._fileCache[this.file.path] = { fileValue: this._fileCache[this.file.path].fileValue, ...historyCmState }; // 如果之前就有file打开 则先保存之前状态
		if (this._fileCache[item.path]) this.restoreEditorState(this.cm, this._fileCache[item.path]); // 打开之前存储过状态的文件
		else {
			this.cm.setValue(value);
			this.cm.clearHistory(); //清理历史防止撤销
			// console.log("this.isModified(this.cm)", this.isModified(this.cm));
			this._fileCache[item.path] = { fileValue: value, ...this.getCmState(this.cm) };
			this.setModified(this.isModified(this.cm));
		}
		this.file = item;
		this.moko.workspace.trigger("editor-file-change", this);
	}
	// MARK 初始化cm
	initCodeMirror(element = this.cmEl, options = this.options, keyMaps = this.keyMaps) {
		const cmInstance = CodeMirror.fromTextArea(element, {
			// const cmInstance = CodeMirror(element, {
			mode: { name: "markdown", json: true }, // mode: { name: "javascript", json: true },
			theme: this.moko.SettingManager.theme.isDarkMode ? this.cmDarkTheme : this.cmLightTheme,
			tabSize: options?.tabSize ?? 4,
			indentUnit: options?.tabSize ?? 2,
			indentWithTabs: options?.indentWithTabs ?? true,
			autoCloseBrackets: {
				pairs: "()[]{}''\"\"<>", // 定义要补全的符号对
				explode: "[]{}()", // 在输入分隔符时，光标在括号中间时将其分开
			},
			lineNumbers: options?.lineNumbers ?? false,
			autofocus: options?.autofocus ?? true,
			lineWrapping: options?.lineWrapping ?? true,
			placeholder: options?.placeholder || element.getAttribute("placeholder") || "",
			styleSelectedText: options?.styleSelectedText ?? true,
			extraKeys: keyMaps,
			// styleActiveLine: options?.styleActiveLine ?? true,
		});
		if (options?.initialValue && (!options?.autosave || !options?.autosave.foundSavedValue)) {
			cmInstance.setValue(options.initialValue);
		}
		// console.log("Codemirror5 https://codemirror.net/5");
		return cmInstance;
	}
	// MARK 保存恢复状态
	getCmState(cm) {
		const state = {
			content: cm.getValue(), // 获取当前文本内容
			cursor: cm.getCursor(), // 获取光标位置
			selection: cm.getSelection(), // 获取选中范围
			history: cm.getHistory(), // 获取撤销历史
			modified: this.isModified(cm), // 获取是否有修改
			// fileValue: initialValue || null, // 获取初始值
			// options: {
			// 	lineNumbers: cm.options.lineNumbers, // 行号设置
			// 	lineWrapping: cm.options.lineWrapping, // 换行设置
			// 	theme: cm.getOption("theme"), // 当前主题
			// 	mode: cm.getOption("mode"), // 当前语言
			// },
		};
		return state;
	}

	restoreEditorState(cm, state, clearHistory = false, focus = true) {
		// console.log(state);
		cm.setValue(state.content); // 恢复文本内容
		if (clearHistory) cm.clearHistory(); // 清理历史
		if (focus) cm.focus();
		// 恢复光标位置
		cm.setCursor(state.cursor || { line: 0, ch: 0, sticky: null }); // 恢复光标位置
		if (state.selection) cm.setSelection(state.selection.from, state.selection.to); // 恢复选中范围
		cm.setHistory(state.history); //恢复历史
		console.log("恢复编辑器状态", state.modified);
		this.setModified(state.modified || false);

		// 还原其他设置（可选）
		// if (state.options) {
		// 	cm.setOption("lineNumbers", state.options.lineNumbers);
		// 	cm.setOption("lineWrapping", state.options.lineWrapping);
		// 	cm.setOption("theme", state.options.theme);
		// 	cm.setOption("mode", state.options.mode);
		// }
		// 我测试添加新的css类
		// Events
		// cmInstance.on("cursorActivity", (doc) => {
		// 	const activeLine = doc.getCursor().line;
		// 	// 移除之前添加的 cm-activeLine 类
		// 	doc.eachLine((lineHandle) => {
		// 		doc.removeLineClass(lineHandle, "background", "cm-activeLine");
		// 	});
		// 	// 为当前行添加 cm-activeLine 类
		// 	doc.addLineClass(activeLine, "background", "cm-activeLine");
		// });
		// Set the initial value
	}
	// MARK 添加var bg
	updateCmBg() {
		const el = document.getElementsByClassName("CodeMirror")[0];
		const bg = window.getComputedStyle(el).backgroundColor || "rgba(var(--gray-6-rgb), 0.85)";
		const color = window.getComputedStyle(el).color || "none";
		document.body.style.setProperty("--cm-bg", bg);
		document.body.style.setProperty("--cm-color", color);
	}
	setMode(mode) {
		this.mode = mode;
		this.cm.setOption("mode", mode);
	}
	setOption(key, value) {
		this.cm.setOption(key, value);
	}
	handleCmThemeChange(isDarkMode) {
		this.cm.setOption("theme", isDarkMode ? this.cmDarkTheme : this.cmLightTheme);
	}
	// MARK scrollbar Events
	showScrollbar() {
		if (this._showScrollbarTimeOut) clearTimeout(this._showScrollbarTimeOut);
		document.body.style.setProperty("--scrollbar-opacity", "1");
	}
	hideScrollbar() {
		if (this._showScrollbarTimeOut) clearTimeout(this._showScrollbarTimeOut);
		this._showScrollbarTimeOut = setTimeout(() => document.body.style.setProperty("--scrollbar-opacity", "0"), 3000);
	}
}

export default Editor5;
