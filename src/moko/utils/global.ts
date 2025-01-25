/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
	interface Window {
		svgExc(svgRaw: string, color: string, scale: number, width: string | number, height: string | number): unknown;
	}
	function debounce<T extends (...args: any[]) => any>(callback: T, delay: number, immediate: boolean): any;
	function randomId(prefix?: string): string;
	function replaceNonBreakingSpaces(e: string): string;
	function extractFileName(e: string): string;
	function extractFileExtension(e: string): string;
	function hasHiddenFile(e: string): boolean;
	function removeFileExtension(e: string): string;
	function removePathExtension(e: string): string;
	function getFileExtension(e: string): string;
	function addFileExtension(e: string, ext: string): string;
	function hasMatchingExtension(e: string, ext: string): boolean;
	function normalizePath(e: string): string;
	function cleanPath(e: string): string;
	function removeMarkdownExtension(e: string): string;
	function removeMarkdownPathExtension(e: string): string;
	function extractParentPath(e: string): string;
}
function randomId(prefix?: string) {
	return prefix ? `${prefix}-${Math.random().toString(36).substring(2, 8)}` : Math.random().toString(36).substring(2, 8);
}

// MARK debounce 函数：防抖功能
function debounce<T extends (...args: any[]) => any>(callback: T, delay: number = 0, immediate: boolean = false) {
	let timeoutId: number | null = null; // 保存定时器 ID
	let context: any = null; // 保存当前函数上下文
	let args: any[] | null = null; // 保存传入的参数
	let lastCallTime: number = 0; // 上次调用时间
	let windowContext: Window = window; // 当前 window 对象

	// 定时器完成后执行的函数
	const executeCallback = () => {
		const callContext = context;
		const callArgs = args;
		context = null;
		args = null;
		if (callArgs) {
			callback.apply(callContext, callArgs); // 执行实际的回调函数
		}
	};

	// 检查是否到了执行时间，执行回调
	const processTimeout = () => {
		if (lastCallTime) {
			const currentTime = Date.now();
			if (currentTime < lastCallTime) {
				windowContext = window;
				timeoutId = windowContext.setTimeout(processTimeout, lastCallTime - currentTime);
				return;
			}
			lastCallTime = 0; // 重置 lastCallTime
		}
		timeoutId = null;
		executeCallback(); // 执行回调
	};

	// 返回的防抖函数
	const debouncedFunction = function (this: unknown, ...inputArgs: unknown[]) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		context = this; // 保存调用上下文
		args = inputArgs; // 保存传入参数
		if (timeoutId) {
			if (immediate) {
				// 如果是立即执行模式，更新下次调用时间
				lastCallTime = Date.now() + delay;
			}
		} else {
			windowContext = window;
			timeoutId = windowContext.setTimeout(processTimeout, delay); // 启动定时器
		}
		return debouncedFunction;
	};

	// 取消定时器
	debouncedFunction.cancel = function () {
		if (timeoutId) {
			windowContext.clearTimeout(timeoutId);
			timeoutId = null;
		}
		return debouncedFunction;
	};

	// 立即执行回调
	debouncedFunction.run = function () {
		if (timeoutId) {
			windowContext.clearTimeout(timeoutId);
			timeoutId = null;
			executeCallback();
		}
	};

	return debouncedFunction;
}

// MARK 字符串方法
// le
// 将字符串中的不间断空格 (\u00A0) 和窄空格 (\u202F) 替换为普通空格。
const nonBreakingSpace = /\u00A0|\u202F/g;
function replaceNonBreakingSpaces(string: string): string {
	return string.replace(nonBreakingSpace, " ");
}
//ye
// 规范化路径字符串，去除多余的分隔符。 console.log(cleanPath("/path//to/file.txt")); // 输出: "/path/to/file.txt"
function cleanPath(e: string): string {
	return "" === (e = e.replace(/([\\/])+/g, "/").replace(/(^\/+|\/+$)/g, "")) && (e = "/"), e;
}
// ce
// 用于提取文件名
function extractFileName(e: string): string {
	const lastIndex = e.lastIndexOf("/");
	return lastIndex === -1 ? e : e.slice(lastIndex + 1);
}
//ue Lc
// 提取父路径
function extractParentPath(e: string): string {
	const t = e.lastIndexOf("/");
	return -1 === t ? "" : e.slice(0, t);
}
// he Pc
// 检查路径中是否包含 .开头文件
function hasHiddenFile(e: string): boolean {
	for (; e; ) {
		if (extractFileName(e).startsWith(".")) return true;
		e = extractParentPath(e);
	}
	return false;
}
//de
// 从文件名中提取不带扩展名的部分。
function removeFileExtension(e: string): string {
	const t = extractFileName(e).lastIndexOf(".");
	return -1 === t || t === e.length - 1 || 0 === t ? e : e.substr(0, t);
}
//pe
// 从路径字符串中提取不带扩展名的部分。
function removePathExtension(e: string): string {
	const t = e.lastIndexOf(".");
	return -1 === t || t === e.length - 1 || 0 === t ? e : e.substring(0, t);
}
//fe
// 从路径字符串中提取文件扩展名（小写）。
function getFileExtension(e: string): string {
	const t = e.lastIndexOf(".");
	return -1 === t || t === e.length - 1 || 0 === t ? "" : e.substring(t + 1).toLowerCase();
}
//me
// 将扩展名添加到文件名后面。 console.log(addFileExtension("file", "txt")); // 输出: "file.txt"
function addFileExtension(e: string, t: string): string {
	return t ? e + "." + t : e;
}
//ge
// 检查文件扩展名是否与指定扩展名匹配。 console.log(hasMatchingExtension("/path/to/file.txt", "txt")); // 输出: true
function hasMatchingExtension(e: string, t: string): boolean {
	return getFileExtension(e) === t;
}
//ve
// normalizePath() 删除多余空格，删除多余斜杠，然后unicode编码
// 规范化路径字符串，去除多余的分隔符，并进行 Unicode 规范化。 console.log(normalizePath("/path//to/file.txt")); // 输出: "/path/to/file.txt"
function normalizePath(e: string): string {
	return replaceNonBreakingSpaces(cleanPath(e)).normalize("NFC");
}

//ce
//  从路径字符串中提取不带扩展名的部分，如果文件是 Markdown 文件。 console.log(removeMarkdownExtension("/path/to/file.md")); // 输出: "file"
function removeMarkdownExtension(e: string): string {
	const t = extractFileName(e);
	return "md" === getFileExtension(t) ? removeFileExtension(t) : t;
}
//we
// 从路径字符串中提取不带扩展名的部分，如果文件是 Markdown 文件。 console.log(removeMarkdownPathExtension("/path/to/file.md")); // 输出: "/path/to/file"
function removeMarkdownPathExtension(e: string): string {
	return "md" === getFileExtension(extractFileName(e)) ? removePathExtension(e) : e;
}

window.replaceNonBreakingSpaces = replaceNonBreakingSpaces;
window.extractFileName = extractFileName;
window.extractParentPath = extractParentPath;
window.hasHiddenFile = hasHiddenFile;
window.removeFileExtension = removeFileExtension;
window.removePathExtension = removePathExtension;
window.getFileExtension = getFileExtension;
window.addFileExtension = addFileExtension;
window.hasMatchingExtension = hasMatchingExtension;
window.normalizePath = normalizePath;
window.cleanPath = cleanPath;
window.removeMarkdownExtension = removeMarkdownExtension;
window.removeMarkdownPathExtension = removeMarkdownPathExtension;
window.randomId = randomId;
window.debounce = debounce;

export {};
