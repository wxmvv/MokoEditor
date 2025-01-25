/**
 * Commands // cY NK
 * // TODO
 * 1. check条件添加
 * */

class Commands {
	constructor(moko) {
		this.commands = {}; //
		this.commandPalette = {}; // command:{command:"command",title: "title"}
		this.moko = moko;
	}

	/**
	 * 注册一个命令
	 * @param {string} command - 命令的唯一标识符
	 * @param {Function} handler - 命令的处理函数
	 * @param {Object} commandOptions - 命令的选项
	 * @param {string} [commandOptions.title] - 命令面板的标题，默认为命令的唯一标识符
	 * @param {string} [commandOptions.hotkeys] - 命令面板的快捷键，默认为空
	 * @param {string} [commandOptions.when] - 命令面板的条件，默认为空
	 * @param {boolean} [commandOptions.mobileOnly] - 命令面板是否只在移动设备上显示，默认为false
	 */
	registerCommand(command, handler, commandOptions) {
		if (Object.prototype.hasOwnProperty.call(this.commands, command)) throw new Error(`Command '${command}' already registered`); // 判断命令是否已经注册
		if (typeof handler !== "function") throw new Error("Command handler must be a function"); // console.log(`Registering command '${command}'`, typeof handler !== "function");
		this.commands[command] = handler; // 注册命令
		this._handleOptions(command, commandOptions);
	}

	/**
	 * 注册命令面板
	 * @param {string} command - 命令的唯一标识符
	 * @param {Object} options - 命令面板的选项
	 * @param {string} [options.title] - 命令面板的标题，默认为命令的唯一标识符
	 * @param {string} [options.hotkeys] - 命令面板的快捷键，默认为空
	 * @param {string} [options.when] - 命令面板的条件，默认为空
	 * @param {boolean} [options.mobileOnly] - 命令面板是否只在移动设备上显示，默认为false
	 * */
	_handleOptions(command, options) {
		if (Object.prototype.hasOwnProperty.call(this.commandPalette, command)) throw new Error(`Command '${command}' already registered in command palette`);
		if (!options) return (this.commandPalette[command] = { command, title: command }); // 判断是否存在options
		options.command = command;
		// title
		if (!options.title) options.title = command;
		// hotkey
		if (options.hotkeys) this.moko.HotkeyManager._registerDefaultCommandHotkey(options.hotkeys, command);
		// when
		// if (options.when && !this.moko.checkCondition(options.when)) return; // TODO 判断条件是否满足
		// mobileOnly
		if (options.mobileOnly && !this.moko.uaInfo.isMobile) return; // 判断是否Mobile only
		// commandPalette
		this.commandPalette[command] = options;
	}

	/**
	 * 取消注册一个命令
	 * @param {string} command - 命令的唯一标识符
	 */
	unregisterCommand(command) {
		if (Object.prototype.hasOwnProperty.call(this.commands, command) && this.moko.hotkeyManager.removeDefaultHotkeys(command)) {
			delete this.commands[command]; // delete this.editorCommands[commandId];
			delete this.commandPalette[command]; // delete this.editorCommands[commandId];
		}
	}

	/**
	 * 执行一个命令
	 * @param {string} command - 命令的唯一标识符
	 * @param {...any} args - 传递给命令处理函数的参数
	 * @returns {any} - 命令处理函数的返回值
	 */
	executeCommand(command, ...args) {
		if (!command) return console.log(`none '${command}'`);
		const handler = this.commands[command];
		if (!handler) throw new Error(`Command '${command}' not found`);
		return handler(...args);
	}

	/**
	 * 执行一个异步命令
	 * @param {string} command - 命令的唯一标识符
	 * @param {...any} args - 传递给命令处理函数的参数
	 * @returns {Promise<any>} - 命令处理函数的返回值
	 */
	async executeAsyncCommand(command, ...args) {
		const handler = commands[command];
		if (!handler) {
			throw new Error(`Command '${command}' not found`);
		}
		console.log(`Executing async command: ${command}`);
		return handler(...args);
	}

	/**
	 * 检查回调函数是否存在
	 * @param {string} command - 命令的唯一标识符
	 * @returns {boolean} - 如果命令存在且有处理函数，返回 true，否则返回 false
	 */
	checkCallback(command) {
		return typeof commands[command] === "function";
	}
}

export { Commands };
export default Commands;
