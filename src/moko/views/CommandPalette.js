import Fuse from "fuse.js";
// https://www.fusejs.io/api/methods.html#remove

/**
 * //DONE
 * 1. 快捷键 DONE
 * 2. 打开文件功能 DONE
 * 3. 搜索功能 DONE
 *
 * // BUG
 * 1. filemap去掉root项
 * 2. 去除文件夹项目
 */

export class CommandPalette {
	constructor(moko) {
		this.moko = moko;
		this.containerEl = moko.containerEl.createDiv("command-palette command-palette-container"); // glass
		this.inputEl = this.containerEl.createEl("input", { cls: "command-palette command-palette-input input" });
		this.listEl = this.containerEl.createDiv("command-palette command-palette-list");
		this.inputEl.placeholder = ">_";
		this.inputEl.addEventListener("input", (event) => this.renderList(event.target.value));
		this.selected = 0;
		this.isShow = false;
		this._handler = {
			hotkeyHandler: (event) => {
				if (window.moko.CommandPalette.containerEl.style.display !== "none") {
					if (event.key === "Escape") return event.stopPropagation(), event.preventDefault(), this._hide();
					if (event.key === "ArrowUp") return event.stopPropagation(), event.preventDefault(), this._handleArrowUp();
					if (event.key === "ArrowDown") return event.stopPropagation(), event.preventDefault(), this._handleArrowDown(); //console.log("ArrowDown commandPalette", event);
					if (event.key === "Enter") return event.stopPropagation(), event.preventDefault(), this._handleEnter(); //;console.log("Enter commandPalette todo: openCommand");
				} // 当显示CommandPalette时
			}, // CommandPalette 的上下选择一节esc退出
			documentMouseDownHandler: (event) => {
				if (event.target.classList.contains("command-palette")) this.inputEl.focus();
				else this._hide();
			}, // 点击其他区域 隐藏CommandPalette
		};
		this._initFuse();
		this._hide();
	}

	renderList(valueString) {
		if (valueString[0] === ">") this._renderCommandList(this._getCommandPaletteList(valueString.slice(1)));
		else this._renderFileList(this._getFilePaletteList(valueString));
	}

	_renderFileList(list) {
		// console.log(list);
		this.listEl.innerHTML = "";
		if (list.length === 0) {
			const el = this.listEl.createDiv("command-palette command-palette-list-item");
			el.innerHTML = "No matching files";
			return;
		}
		for (const item of list) {
			const el = this.listEl.createDiv("command-palette command-palette-list-item");
			const nameEl = el.createDiv("command-palette command-palette-list-item-name");
			const pathEl = el.createEl("span", { cls: "command-palette command-palette-list-item-path" });
			const name = item.item ? item.item.name : item.name;
			const path = item.item ? item.item.path : item.path;
			const matches = item.matches;
			if (matches && matches.length > 0) {
				let result = "";
				let lastIndex = 0;
				matches.forEach((match) => {
					const { indices } = match;
					indices.forEach(([start, end]) => {
						result += name.slice(lastIndex, start);
						result += `<b class="command-palette highlight">${name.slice(start, end + 1)}</b>`;
						lastIndex = end + 1;
					});
				});
				result += name.slice(lastIndex);
				nameEl.innerHTML = result;
				pathEl.innerHTML = path;
			} else {
				nameEl.innerHTML = name;
				pathEl.innerHTML = path;
			}
			el.setAttribute("data-path", path);
			el.addEventListener("click", (event) => {
				event.stopPropagation();
				console.log("[commandPalette] click file:", path, event);
				this.executeOpenFile(path);
			});
		}
		this._selectByIndex(0);
	}
	/**
	 *  渲染命令列表
	 *  @param {Array} list - 命令列表
	 *  @returns {void}
	 */
	_renderCommandList(list) {
		// console.log("[CommandPalette] renderList", list);
		this.listEl.innerHTML = "";
		if (list.length === 0) {
			const el = this.listEl.createDiv("command-palette command-palette-list-item");
			el.innerHTML = "No matching commands";
			return;
		}
		for (const item of list) {
			const el = this.listEl.createDiv("command-palette command-palette-list-item");
			const titleEl = el.createDiv("command-palette command-palette-list-item-title");
			const hotkeyEl = el.createDiv("command-palette command-palette-list-item-hotkey");
			const title = item.item ? item.item.title : item.title;
			const command = item.item ? item.item.command : item.command;
			const hotkeys = this.moko.HotkeyManager.getKeysByCommand(command);
			const matches = item.matches;
			if (matches && matches.length > 0) {
				let result = "";
				let lastIndex = 0;
				matches.forEach((match) => {
					const { indices } = match;
					indices.forEach(([start, end]) => {
						result += title.slice(lastIndex, start);
						result += `<b class="command-palette highlight">${title.slice(start, end + 1)}</b>`;
						lastIndex = end + 1;
					});
				});
				result += title.slice(lastIndex);
				titleEl.innerHTML = result;
				if (hotkeys) this._renderkeybinding(hotkeys, hotkeyEl);
			} else {
				titleEl.innerHTML = title;
				if (hotkeys) this._renderkeybinding(hotkeys, hotkeyEl);
			}
			el.setAttribute("data-command", item.item ? item.item.command : item.command);
			el.addEventListener("click", (event) => {
				event.stopPropagation();
				console.log("[commandPalette] click item:", item.command, event);
				this.executeCommand(item.command);
			});
		}
		this._selectByIndex(0);
	}
	_renderkeybinding(hotkeys, containerEl) {
		// console.log("[test]", hotkeys);
		if (typeof hotkeys === "string") {
			const _hotkeys = hotkeys.split("+");
			_hotkeys.forEach((hotkey) => {
				const keyEl = containerEl.createEl("span", { cls: "command-palette-list-item-hotkey-key" });
				if (hotkey === "ctrl") keyEl.textContent = "⌥";
				else if (hotkey === "alt") keyEl.textContent = "^";
				else if (hotkey === "shift") keyEl.textContent = "⇧";
				else if (hotkey === "command") keyEl.textContent = "⌘";
				else keyEl.textContent = hotkey.toUpperCase();
			});
		} else if (Array.isArray(hotkeys)) {
			hotkeys.forEach((hotkeystring, index) => {
				const hotkeyli = hotkeystring.split("+");
				hotkeyli.forEach((s) => {
					const keyEl = containerEl.createEl("span", { cls: "command-palette-list-item-hotkey-key" });
					if (s === "ctrl") keyEl.textContent = "⌥";
					else if (s === "alt") keyEl.textContent = "^";
					else if (s === "shift") keyEl.textContent = "⇧";
					else if (s === "command") keyEl.textContent = "⌘";
					else keyEl.textContent = s.toUpperCase();
				});
				if (hotkeys.length - 1 !== index) containerEl.createEl("span", { cls: "command-palette-list-item-hotkey-key-separator" });
			});
		}
	}
	_selectByIndex(index) {
		this.listEl.children[index].classList.add("selected");
		this.selected = index;
		this._updateVScrollPosition(index);
	}
	_updateVScrollPosition(index) {
		const itemHeight = this.listEl.children[index].offsetHeight;
		const containerHeight = this.listEl.offsetHeight;
		const itemTop = this.listEl.children[index].offsetTop;
		const itemBottom = itemTop + itemHeight;
		if (itemTop < this.listEl.scrollTop) this.listEl.scrollTop = itemTop;
		else if (itemBottom > this.listEl.scrollTop + containerHeight) this.listEl.scrollTop = itemBottom - containerHeight + 4;
	}
	_handleArrowUp() {
		if (this.selected !== 0) {
			this.listEl.children[this.selected].classList.remove("selected");
			this._selectByIndex(this.selected - 1);
		} else if (this.selected === 0) {
			this.listEl.children[this.selected].classList.remove("selected");
			this._selectByIndex(this.listEl.children.length - 1);
		}
	}
	_handleArrowDown() {
		if (this.selected !== this.listEl.children.length - 1) {
			this.listEl.children[this.selected].classList.remove("selected");
			this._selectByIndex(this.selected + 1);
		} else if (this.selected === this.listEl.children.length - 1) {
			this.listEl.children[this.selected].classList.remove("selected");
			this._selectByIndex(0);
		}
	}
	_handleEnter() {
		if (!this.selected) this.selected = 0;
		if (this.listEl.children[this.selected].getAttribute("data-command")) {
			const command = this.listEl.children[this.selected].getAttribute("data-command");
			console.log("[CommandPalette] Enter command:", command);
			this.executeCommand(command);
		} else {
			const path = this.listEl.children[this.selected].getAttribute("data-path");
			console.log("[CommandPalette] Enter openFile:", path);
			this.executeOpenFile(path);
		}
	}

	/**
	 * 执行命令
	 * @param {string} command - 命令名称
	 * @returns {void}
	 * */
	executeCommand(command) {
		this._hide();
		this.moko.commands.executeCommand(command);
	}

	/**
	 * 执行命令
	 * @param {string} path - 命令名称
	 * @returns {void}
	 * */
	executeOpenFile(path) {
		this._hide();
		this.moko.workspace.openFile({ path });
	}

	showCommandPalette() {
		if (this.hasShow() && this.inputEl.value[0] === ">") this._hide();
		else this._show(">");
	}
	showFilePalette() {
		if (this.hasShow() && this.inputEl.value[0] !== ">") this._hide();
		else this._show();
	}
	hasShow() {
		return this.containerEl.style.display !== "none";
	}
	_show(initValue = "") {
		this.renderList(initValue);
		this.inputEl.value = initValue;
		this.containerEl.show();
		document.addEventListener("keydown", this._handler.hotkeyHandler); // 使用Listener添加快捷键
		document.addEventListener("mousedown", this._handler.documentMouseDownHandler); // 使用Listener添加快捷键
		this.inputEl.focus();
	}
	_hide() {
		this.containerEl.hide();
		this.inputEl.value = ""; // 清空输入框
		document.removeEventListener("keydown", this._handler.hotkeyHandler); // 移除快捷键
		document.removeEventListener("mousedown", this._handler.documentMouseDownHandler); // 移除快捷键
		this.moko.workspace.activePane?.focus();
	}

	// 初始化fuse 需要在commands初始化后 和commands更新后执行
	_initFuse() {
		this.fileFuse = new Fuse(Object.values(this.moko.FileManager.fileMap), { includeMatches: true, threshold: 0.4, keys: ["name"] });
		this.commandFuse = new Fuse(Object.values(this.moko.commands.commandPalette), { includeMatches: true, threshold: 0.4, keys: ["title"] });
		this.renderList("");
	}
	_getFilePaletteList(value) {
		// console.log("[CommandPalette] Search command:", value);
		this.fileFuse.setCollection(Object.values(this.moko.FileManager.fileMap));
		if (value === "" || value === undefined || value === null) return Object.values(this.moko.FileManager.fileMap);
		return this.fileFuse.search(value);
	}
	_getCommandPaletteList(value) {
		this.commandFuse.setCollection(Object.values(this.moko.commands.commandPalette));
		if (value === "" || value === undefined || value === null) return Object.values(this.moko.commands.commandPalette);
		return this.commandFuse.search(value);
	}
}

export default CommandPalette;
