/**
 * HotkeyManager
 * //TODO
 * 1. 修改热键功能，包括先取消注册，在注册新的
 * 2. 恢复默认按键，包括恢复所有，以及恢复单一
 */

export class HotkeyManager {
	constructor(moko) {
		this.moko = moko;
		this.hotkeys = {}; // 存储热键的映射关系
		this.commandHotkeys = {}; // 存储命令热键的映射关系
		this.defaultCommandHotkeys = {}; // 储存默认热键
		this._listen();
	}

	/**
	 * 输入command,获取对应keys列表
	 * @param {string} command - 命令的唯一标识符
	 * @returns {Array} - 热键的键值数组
	 */
	getKeysByCommand(command) {
		const hotkeys = [];
		for (const key in this.commandHotkeys) if (this.commandHotkeys[key] === command) hotkeys.push(key);
		return hotkeys.length === 0 ? null : hotkeys;
	}

	/**
	 * 注册一个热键，不会显示在命令面板
	 * @param {string} key - 热键的键值
	 * @param {Function} handler - 热键的处理函数
	 */
	registerHotkey(key, handler) {
		this.hotkeys[key.toLowerCase()] = handler;
	}

	/**
	 * 注册一个command热键 并且会显示在命令面板中
	 * @param {string} key - 热键的键值
	 * @param {string} command - 热键的处理函数
	 *
	 */
	registerCommandHotkey(key, command) {
		this.commandHotkeys[key] = command; // this.commandHotkeys[command] = key;
		this.registerHotkey(key, () => window.moko.commands.executeCommand(command));
	}

	/**
	 * 取消注册一个热键
	 *  @param {string} key - 热键的键值
	 * */
	unregisterHotkey(key) {
		delete this.commandHotkeys[key]; // this.commandHotkeys.forEach((command, commandKey) => if (commandKey === key) delete this.commandHotkeys[command]);
		delete this.hotkeys[key];
	}

	/**
	 * 传入command取消注册一个热键
	 *  @param {string} command - 热键的键值
	 * */
	unregisterHotkeyByCommand(command) {
		for (const key in this.commandHotkeys) if (this.commandHotkeys[key] === command) this.unregisterHotkey(key);
	}

	/**
	 * 注册默认command热键 只有在命令中添加了hotkeys属性会默认执行
	 * @param {string || Array} key - 热键的键值
	 * @param {string} command - 热键的处理函数
	 *
	 */
	_registerDefaultCommandHotkey(keys, command) {
		if (!keys || !command) return console.log("%c[HotkeyManager] _registerDefaultCommandHotkey:keys or command is required", "color: red;");
		if (typeof keys === "string") {
			this.defaultCommandHotkeys[keys] = command;
			this.registerCommandHotkey(keys, command);
		}
		if (Array.isArray(keys)) {
			keys.forEach((key) => {
				this.defaultCommandHotkeys[key] = command;
				this.registerCommandHotkey(key, command);
			});
		}
	}

	/**
	 * 通过keydown event 获取key的组合键
	 * @param {KeyboardEvent} event - keydown event- 热键的键值
	 * @return {string} - 热键的键值
	 */
	_getKeyCombo(event) {
		const keys = [];
		if (event.ctrlKey) keys.push("ctrl");
		if (event.metaKey) keys.push("command");
		if (event.altKey) keys.push("alt");
		if (event.shiftKey) keys.push("shift");
		keys.push(event.key.toLowerCase());
		return keys.join("+");
	}

	/**
	 * 添加热键监听器
	 */
	_listen() {
		document.addEventListener("keydown", (event) => {
			const keyCombo = this._getKeyCombo(event);
			// console.log("[HotkeyManager] listen:", event, keyCombo, this.hotkeys[keyCombo]);
			if (this.hotkeys[keyCombo]) {
				event.preventDefault();
				this.hotkeys[keyCombo]();
			}
		});
	}
	//TODO 使用electron 添加全局热键监听器
	_listenGlobal() {
		// window.addEventListener("keydown", this.handleHotkey.bind(this));
	}
	//TODO移除全局热键监听器
	_removeListen() {}

	// TODO 标准化快捷键组合 暂时未使用
	_normalizeKeys(keys) {
		return keys
			.toLowerCase()
			.replace(/command/g, "command")
			.replace(/ctrl/g, "ctrl");
	}
}

export default HotkeyManager;
