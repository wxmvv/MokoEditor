/* eslint-disable @typescript-eslint/no-unused-vars */
//DONE
import Plugin from "../../model/Plugin";
// import { svgExc } from "../../views/utils/Svg.js";
import manifest from "./manifest.json?raw";
import JSON5 from "json5";

import "./styles.css";

export default class WordsCounter extends Plugin {
	async onload() {
		this.manifest = JSON5.parse(manifest);
		this.el = this.addStatusBarRightItem();
		this.el.classList.add("status-bar-right-words-counter");
		// this.elfocus = this.addStatusBarRightItem();
		// this.elfocus.classList.add("status-bar-right-focused");
		// this.elfocus.innerHTML = `<div>Not Focused</div>`;
		// MARK counter
		// cm5
		// this.registerEvent(this.moko.workspace.on("active-editor-change", (editor) => this.addCmEvents(editor.cm)));
		// this.registerEvent(this.moko.workspace.on("editor-drop", (editor) => this.removeCmEvents(editor.cm)));
		// cm6
		this.registerEvent(this.moko.workspace.on("editor-change", () => this.updateStatusBar.bind(this)));

		// this.registerEvent(this.moko.workspace.on("cm-cursorActivity", this.updateStatusBar.bind(this)));
		// this.registerEvent(this.moko.workspace.on("cm-change", this.updateStatusBar.bind(this)));
		// MARK focus
		// this.registerEvent(this.moko.workspace.on("editor-blur", this.updateblur.bind(this)));
		// this.registerEvent(this.moko.workspace.on("editor-focus", this.updateFocus.bind(this)));
	}
	addCmEvents(cm) {
		this.cmEvents = {
			cursorActivity: cm.on("cursorActivity", this.updateStatusBar.bind(this)),
			change: cm.on("change", this.updateStatusBar.bind(this)),
		};
		this.updateStatusBar.bind(this);
	}
	removeCmEvents(cm) {
		if (this.cmEvents["cursorActivity"]) cm.off("cursorActivity", this.cmEvents.cursorActivity);
		if (this.cmEvents["change"]) cm.off("change", this.cmEvents.change);
		this.updateStatusBar.bind(this);
	}

	updateFocus() {
		this.elfocus.innerHTML = `<div>Focused</div>`;
	}
	updateblur() {
		this.elfocus.innerHTML = `<div>Not Focused</div>`;
	}
	updateStatusBar() {
		if (!this.moko.workspace.activeEditor) return (this.el.innerHTML = " ");
		const doc = this.moko.workspace.activeEditor.cm.getDoc();
		const value = doc.getValue();
		const charCount = value.length;
		const lineCount = doc.lineCount();
		const cursor = doc.getCursor();
		const columnNumber = cursor.ch + 1;
		const currentLineNumber = cursor.line + 1;
		const byteCount = new Blob([value]).size;
		const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
		const wordCount = (value.match(/\b\w+\b/g) || []).length;
		const paragraphCount = (value.match(/\n{2,}/g) || []).length + 1;
		const selectedText = doc.getSelection();
		const selectedCharacters = selectedText.length;
		const paragraphs = selectedText.split(/\n+/);
		const selectedLines = paragraphs.filter((paragraph) => paragraph.trim().length > 0).length;
		// 更新状态栏内容
		// this.el.innerHTML = `
		//     <div>Character Count: ${charCount}</div>
		//     <div>Line Count: ${lineCount}</div>
		//     <div>Column Number: ${columnNumber}</div>
		//     <div>Current Line Number: ${currentLineNumber}</div>
		//     <div>Byte Count: ${byteCount}</div>
		//     <div>Letter Count: ${letterCount}</div>
		//     <div>Word Count: ${wordCount}</div>
		//     <div>Paragraph Count: ${paragraphCount}</div>
		// `;
		if (selectedCharacters > 0 && selectedLines > 1) {
			this.el.innerHTML = `<div>${currentLineNumber}:${columnNumber}</div><div>(${selectedLines} lines, ${selectedCharacters} characters)</div>`;
		} else if (selectedCharacters > 0 && !selectedLines > 1) {
			this.el.innerHTML = `<div>${currentLineNumber}:${columnNumber}</div><div>${selectedCharacters} characters)</div>`;
		} else {
			this.el.innerHTML = `<div>${currentLineNumber}:${columnNumber}</div>`;
		}
	}

	async onunload() {
		console.log("unloading plugin");
	}
}
