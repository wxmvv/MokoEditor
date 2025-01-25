/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// BUG
// 1.拼音框会到处飘 https://github.com/electron/electron/issues/4539 IEM

// MARK codemirror6
// https://codemirror.net/docs/community/
// https://codemirror.net/docs/ref/#state.EditorState.toJSON
// https://discuss.codemirror.net
import { basicSetup, minimalSetup } from "codemirror";
import { EditorState, Compartment, StateEffect } from "@codemirror/state";
// import { historyField, historyState, StateEffect } from "@codemirror/history";
import { EditorView } from "@codemirror/view";
import {
	keymap,
	lineNumbers,
	highlightActiveLine,
	highlightWhitespace,
	highlightTrailingWhitespace,
	placeholder,
	scrollPastEnd,
	highlightActiveLineGutter,
	highlightSpecialChars,
} from "@codemirror/view";
import { dropCursor, drawSelection, rectangularSelection, crosshairCursor } from "@codemirror/view";
// language
import { bracketMatching, indentOnInput, foldGutter, foldState, foldKeymap, syntaxHighlighting, indentUnit } from "@codemirror/language"; //defaultHighlightStyle, HighlightStyle,
// commands
import { indentWithTab, standardKeymap, defaultKeymap, historyKeymap, history, undo, redo, historyField } from "@codemirror/commands";
// search
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
// autocomplete
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from "@codemirror/autocomplete";
// lint
import { lintKeymap } from "@codemirror/lint";
// collab
import {} from "@codemirror/collab";
// language-data
import { languages } from "@codemirror/language-data";
// markdown
import { markdown, markdownKeymap, markdownLanguage, commonmarkLanguage, deleteMarkupBackward, insertNewlineContinueMarkup } from "@codemirror/lang-markdown";
import { Table, TaskList, Strikethrough, Autolink, GFM, Subscript, Superscript, Emoji } from "@lezer/markdown";
// other-lang
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
// theme
// import { amy, ayuLight, barf, bespin, birdsOfParadise, boysAndGirls, clouds, cobalt, coolGlow, dracula, espresso, noctisLilac, rosePineDawn, smoothy, solarizedLight, tomorrow } from "thememirror"; // https://github.com/vadimdemedes/thememirror
import { oneDark } from "@codemirror/theme-one-dark"; // ondark
import { materialLight } from "@ddietr/codemirror-themes/material-light"; // codemirror-themes
import { materialDark } from "@ddietr/codemirror-themes/material-dark"; // https://github.com/dennis84/codemirror-themes
import { solarizedLight } from "@ddietr/codemirror-themes/solarized-light";
import { solarizedDark } from "@ddietr/codemirror-themes/solarized-dark";
import { dracula } from "@ddietr/codemirror-themes/dracula";
import { githubLight } from "@ddietr/codemirror-themes/github-light";
import { githubDark } from "@ddietr/codemirror-themes/github-dark";
import { aura } from "@ddietr/codemirror-themes/aura";
import { tokyoNight } from "@ddietr/codemirror-themes/tokyo-night";
import { tokyoNightStorm } from "@ddietr/codemirror-themes/tokyo-night-storm";
import { tokyoNightDay } from "@ddietr/codemirror-themes/tokyo-night-day";
// 自定义高亮样式
import { tags } from "@lezer/highlight";
import { HighlightStyle, defaultHighlightStyle } from "@codemirror/language";
const markdownHighlightStyle = HighlightStyle.define([
	{ tag: tags.heading1, class: "md-h1" }, // 为标题添加自定义 class
	{ tag: tags.heading2, class: "md-h2" },
	{ tag: tags.heading3, class: "md-h3" },
	{ tag: tags.heading4, class: "md-h4" },
	{ tag: tags.heading5, class: "md-h5" },
	{ tag: tags.heading6, class: "md-h6" },
	{ tag: tags.separator, class: "md-separator" }, // 为分隔线添加自定义 class
	{ tag: tags.emphasis, class: "md-italic" }, // 为斜体添加自定义 class
	{ tag: tags.strong, class: "md-bold" }, // 为粗体和斜体添加自定义 class
	{ tag: tags.link, class: "md-link" }, // 为链接添加自定义 class
	{ tag: tags.list, class: "md-list" }, // 可以为列表、引用块等添加其他的 class
	{ tag: tags.quote, class: "md-quote" },
]);

const mokoBasicSetup = (() => [
	history(),
	markdown({
		base: markdownLanguage,
		codeLanguages: [javascript()],
		addKeymap: true,
		extensions: [
			keymap.of([indentWithTab, ...standardKeymap]), //...completionKeymap, ...lintKeymap , ...searchKeymap, ...historyKeymap, ...foldKeymap,...closeBracketsKeymap,
		],
	}), // markdown // syntaxHighlighting(defaultHighlightStyle, { fallback: true }), // syntaxHighlighting(myHighlightStyle),
	EditorView.theme({ "&.cm-focused": { outline: "none" } }), // 禁用焦点时的去掉轮廓  //&dark &light 必须设置dark light theme //"& .cm-selectionBackground": { background: "rgba(255, 255, 255, 0.3) !important" }
	EditorState.readOnly.of(false), // 是否只读
	EditorState.allowMultipleSelections.of(false), // 是否允许多选
	syntaxHighlighting(markdownHighlightStyle), // 可以同时使用markdownHighlightStyle和defaultHighlightStyle，需要先custom后default
	highlightActiveLineGutter(),
	highlightActiveLine(), // 标记active行,添加.cm-activeLine类
	highlightSpecialChars(), //https://codemirror.net/docs/ref/#view.highlightSpecialChars
	highlightSelectionMatches(), // cm-highlightSpace
	highlightTrailingWhitespace(), // cm-trailingSpace
	// highlightWhitespace(), //cm-highlightSpace cm-highlightTab
	dropCursor(),
	indentOnInput(), // ?
	bracketMatching(),
	closeBrackets(), // 自动闭合括号
	rectangularSelection(),
	crosshairCursor(),
	drawSelection({ cursorBlinkRate: 1200, drawRangeCursor: true }),
	placeholder("Write something here..."),
	keymap.of([indentWithTab, ...standardKeymap]),
])();

export class Editor6 {
	constructor(container, options) {
		this.moko = container.moko;
		this.view = container;
		this.containerEl = container.containerEl.createDiv("editor"); // this.element = container.containerEl.createEl("textarea", "cmEditor");
		this.pane = container.pane;
		this.options = options;
		this.modified = false; // config // modified
		this.themeConfig = new Compartment(); // theme //https://discuss.codemirror.net/t/cm6-dynamically-switching-syntax-theme-w-reconfigure/2858/7
		this.lineWrappingConfig = new Compartment(); // lineWrapping
		this.lineNumbersConfig = new Compartment(); // lineNumbers
		this.foldGutterConfig = new Compartment(); // foldGutter
		this.indentUnitConfig = new Compartment(); // this.tabWidthConfig = new Compartment(); // tabWidth
		this.scrollPastEndConfig = new Compartment(); // scrollPastEnd
		this.lightTheme = githubLight; // materialLight solarizedLight githubLight tokyoNightDay
		this.darkTheme = oneDark; //oneDark materialDark solarizedDark aura dracula githubDark tokyoNightStorm tokyoNight
		this.lineWrapping = true;
		this.showLineNumbers = false;
		this.showFoldGutter = false;
		this.canScrollPastEnd = false;
		this.tabWidth = 4;
		this.indentUnitStr = " ".repeat(this.tabWidth);
		this.basicDynamicState = () => [
			this.themeConfig.of([this.moko.SettingManager.theme.isDarkMode ? this.darkTheme : this.lightTheme]), // theme
			this.lineWrappingConfig.of(this.lineWrapping ? EditorView.lineWrapping : []),
			this.lineNumbersConfig.of(this.showLineNumbers ? lineNumbers() : []),
			this.indentUnitConfig.of(indentUnit.of(" ".repeat(this.tabWidth))), // this.tabWidthConfig.of(EditorState.tabSize.of(this.tabWidth || 4)),
			this.foldGutterConfig.of(this.showFoldGutter ? foldGutter() : []),
			this.scrollPastEndConfig.of(this.canScrollPastEnd ? scrollPastEnd() : []), // scrollPastEnd(), // 确保滚动条可以滚动到将最后一行放置在第一行
			EditorView.updateListener.of((v) => {
				// console.log(this.cm.state.field(historyField)); console.log(this.cm.state.field(foldState));
				//console.log("cm doc change", v), // 添加modified属性
				if (v.docChanged) this.setModified(true);
				// if (v.empty) console.log("cm empty change", v);
				// if (v.focusChanged) console.log("cm focus change", v);
				// if (v.geometryChanged) console.log("cm geometry change", v);
				// if (v.heightChanged) console.log("cm height change", v);
				// if (v.selectionSet) console.log("cm selectionSet change", v);
				// if (v.viewportChanged) console.log("cm viewport change", v);
			}),
			// EditorState.lineSeparator.of("\n"), // 行分隔符
			// EditorState.phrases.of({ "cm.search.placeholder": "Search" }), // 搜索框占位符
			// EditorState.languageData.of(() => [{ language: "markdown" }]), // 设置语言
			// EditorState.changeFilter.of((tr) => tr.docChanged), // 设置修改过滤器
			// EditorState.transactionFilter.of((tr) => tr.annotation(Transaction.userEvent) !== "input"), // 设置事务过滤器
			// EditorState.transactionExtender.of((tr) => console.log(tr)), // 设置事务扩展器
		];
		this.state = EditorState.create({
			doc: `# 一级标题\n## 二级标题\n### 三级标题\n#### 四级标题\n##### 五级标题\n###### 六级标题\n\n这是一个段落示例。段落之间要有空行隔开。\n\n**加粗文本**\n*斜体文本*\n***加粗且斜体文本***\n\n~~删除线文本~~\n\n> 这是一个引用块。\n> 可以包含多行内容，所有行前都要添加  '>' \n\n- 无序列表项 1\n- 无序列表项 2\n  - 嵌套无序列表项\n\n1. 有序列表项 1\n2. 有序列表项 2\n   1. 嵌套有序列表项\n\n[这是一个链接](https://example.com)\n\n这是一个自动链接：<https://example.com>\n\n代码块示例：\n\n\nconsole.log("Hello, Markdown!");\n\n\n带语法高亮的代码块：\n\njavascript\nfunction greet() {\n  console.log("Hello, GFM!");\n}\n\n\n### 表格\n\n| 标题 1 | 标题 2 |\n| ------ | ------ |\n| 单元格 1 | 单元格 2 |\n| 单元格 3 | 单元格 4 |\n\n### 任务列表\n\n- [x] 已完成任务\n- [ ] 未完成任务\n\n### 图片\n\n![示例图片](https://example.com/image.png)\n\n这是 Markdown 和 GFM 的基本语法示例。`,
			extensions: [
				mokoBasicSetup,
				this.basicDynamicState(),
			],
		}); // state view
		this.cm = new EditorView({ state: this.state, parent: this.containerEl });
		this.containerEl.addEventListener("mousemove", this.showScrollbar); // MARK listener 初始化颜色 & 滚动条事件
		this.containerEl.addEventListener("mouseleave", this.hideScrollbar);
		this.moko.SettingManager.theme.on("theme-change", (isDarkMode) => this.handleThemeChange(isDarkMode));
		this.moko.SettingManager.theme.on("theme-change", () => this.updateCmBg());
		this.file = null; // 初始化文件
		this._fileCache = {}; // 初始化文件缓存
	}
	// TEST
	// MARK 设置状态 设置文本
	// localStorage.setItem("editorState", JSON.stringify(view.state.toJSON())); // 将状态保存到 localStorage
	restoreEditorState(view, savedState) {
		// 储存恢复state 解决方案参考 https://discuss.codemirror.net/t/save-the-folding-state-and-reapply-after-reloading/4587/4
		if (!savedState || !savedState.doc) return console.error("Invalid saved state");
		const newState = EditorState.fromJSON(
			savedState.stateJson,
			{
				extensions: [mokoBasicSetup, this.basicDynamicState()],
			},
			{
				history: historyField,
			}
		);
		view.setState(newState);
	}
	saveEditorState(view) {
		//  需要保存的字段 1. 文档内容doc 2. 光标位置selection 3. 历史记录history 4. scroll位置 5.fold return { ...view.state };
		const history = view.state.field(historyField, false); // 提取历史字段状态
		return {
			stateJson: { ...view.state.toJSON({ history: historyField }) },
			viewState: { ...view.state },
			doc: view.state.doc,
			selection: { ...view.state.selection },
			history: { ...history }, // 保存历史状态
		};
	}
	setFile(item, value) {
		// 如果this.file存在 则先保存历史状态
		if (this.file) this._fileCache[this.file.path] = { ...this.saveEditorState(this.cm) };
		// 设置新文件
		if (item.path === this.file?.path) return console.log("[editor] same file"); // 如果打开文件就是当前文件 直接返回
		if (item.path === "untitled") (this.file = null), console.log("[editor] new untitled file"); // 如果是未命名标题的新文件
		else this.file = item; // 否则设置当前文件
		// TODO 根据文件后缀名设置解析模式 this.setMode(CodeMirror.findModeByFileName(item.name)?.mode || "markdown"); // 设定解析模式
		// console.log("Test [history state]", this._fileCache[item.path]);
		if (this._fileCache[item.path]) this.restoreEditorState(this.cm, this._fileCache[item.path]); // 打开之前存储过状态的文件
		else {
			const newFileState = EditorState.create({
				doc: value,
				extensions: [
					mokoBasicSetup, // basicSetup(),
					this.basicDynamicState(),
				],
			});
			this.cm.setState(newFileState);
			this._fileCache[item.path] = { ...this.saveEditorState(this.cm) };
			this.setModified(this.isModified(this.cm));
		}
		this.file = item;
		this.moko.workspace.trigger("editor-file-change", this);
	} //cmState
	// MARK config lineWrapping Theme this.scrollPastEnd ? scrollPastEnd() : []
	handleScrollPastEndChange(canScrollPastEnd) {
		this.canScrollPastEnd = canScrollPastEnd;
		this.cm.dispatch({ effects: this.scrollPastEndConfig.reconfigure(canScrollPastEnd ? scrollPastEnd() : []) });
	}
	handleFoldGutterChange(showFoldGutter) {
		this.showFoldGutter = showFoldGutter;
		this.cm.dispatch({ effects: this.foldGutterConfig.reconfigure(showFoldGutter ? foldGutter() : []) });
	}
	handleLineNumbersChange(showLineNumbers) {
		this.showLineNumbers = showLineNumbers;
		this.cm.dispatch({ effects: this.lineNumbersConfig.reconfigure(showLineNumbers ? lineNumbers() : []) });
	}
	handleTabWidthChange(tabWidth) {
		if (typeof tabWidth !== "number") return;
		this.tabWidth = tabWidth;
		this.cm.dispatch({ effects: this.tabWidthConfig.reconfigure(EditorState.tabSize.of(tabWidth || 4)) });
	}
	handleIndentUnitChange(indentUnit) {
		if (typeof indentUnit !== "number") return;
		this.indentUnit = indentUnit;
		this.cm.dispatch({ effects: this.indentUnitConfig.reconfigure(indentUnit.of(" ".repeat(this.tabWidth || 4))) });
	}
	handleThemeChange(isDarkMode) {
		this.cm.dispatch({ effects: this.themeConfig.reconfigure([isDarkMode ? this.darkTheme : this.lightTheme]) });
	}
	handleLineWrappingChange(isLineWrapping) {
		this.lineWrapping = isLineWrapping;
		this.cm.dispatch({ effects: this.lineWrappingConfig.reconfigure(isLineWrapping ? EditorView.lineWrapping : []) });
	}
	// MARK isModified
	isModified(cm) {
		const history = cm.state.field(historyField, false); //return cm.state.field(historyField).dirty;
		if (!history || history.done.length === 0) return false;
		if (history.done && history.done.length > 0) {
			for (const item of history.done) {
				if (item.changes && item.changes !== undefined && item.changes.length > 0) return true;
			}
			return false;
		} else return false;
	}
	setModified(mod) {
		if (this.modified === mod) return; // 如果本来就更改了，则不进行操作
		this.modified = mod; // 更改状态
		this.view.file.modified = mod; // 更改view中file的状态
		const currentTab = this.pane.tabs.find((tab) => tab.path === this.view.file.path); // 找到当前tab
		if (currentTab) currentTab.modified = mod; // 更改tab的状态
		this.pane._updateTabs(); // 刷新tab
	}
	// MARK history undo redo
	undo() {
		undo(this.cm);
		this.setModified(this.isModified(this.cm));
	}
	redo() {
		redo(this.cm);
	}
	// MARK 添加var bg
	updateCmBg() {
		const el = document.getElementsByClassName("cm-editor")[0];
		const bg = window.getComputedStyle(el).backgroundColor || "rgba(var(--gray-6-rgb), 0.85)";
		const color = window.getComputedStyle(el).color || "none";
		document.body.style.setProperty("--cm-bg", bg);
		document.body.style.setProperty("--cm-color", color);
	}
	setLineWrapping(lineWrapping) {
		this.cm.dispatch({ effects: this.lineWrappingConfig.reconfigure(lineWrapping ? EditorView.lineWrapping : null) });
	}
	// MARK scrollbar Events
	showScrollbar() {
		if (this._showScrollbarTimeOut) clearTimeout(this._showScrollbarTimeOut);
		document.body.style.setProperty("--scrollbar-bg", "var(--scrollbar-bg-active)");
		document.body.style.setProperty("--scrollbar-thumb-bg", "var(--scrollbar-thumb-bg-active)");
	}
	hideScrollbar() {
		if (this._showScrollbarTimeOut) clearTimeout(this._showScrollbarTimeOut);
		this._showScrollbarTimeOut = setTimeout(() => document.body.style.setProperty("--scrollbar-bg", "transparent"), 3000);
		this._showScrollbarTimeOut = setTimeout(() => document.body.style.setProperty("--scrollbar-thumb-bg", "transparent"), 3000);
	}
}

export default Editor6;
