const UNTITLED_PATH = "untitled";
const UNTITLED_PREFIX = "untitled:";
const UNTITLED_NAME = "未命名文档";

function isUntitledPath(path) {
	return path === UNTITLED_PATH || (typeof path === "string" && path.startsWith(UNTITLED_PREFIX));
}

function getUntitledIndex(path) {
	if (path === UNTITLED_PATH) return 1;
	if (!isUntitledPath(path)) return null;

	const rawIndex = path.slice(UNTITLED_PREFIX.length);
	const index = Number.parseInt(rawIndex, 10);
	return Number.isNaN(index) ? null : index;
}

function createUntitledFile(existingTabs = []) {
	const usedIndexes = existingTabs
		.map((tab) => getUntitledIndex(tab?.path))
		.filter((index) => typeof index === "number" && index > 0);

	const nextIndex = usedIndexes.length > 0 ? Math.max(...usedIndexes) + 1 : 1;
	return {
		path: `${UNTITLED_PREFIX}${nextIndex}`,
		name: nextIndex === 1 ? UNTITLED_NAME : `${UNTITLED_NAME} ${nextIndex}`,
		type: "editor",
		modified: false,
	};
}

function getFileNameFromPath(filePath) {
	if (!filePath) return "";
	const segments = filePath.split(/[\\/]/);
	return segments[segments.length - 1] || "";
}

export { UNTITLED_NAME, UNTITLED_PATH, UNTITLED_PREFIX, createUntitledFile, getFileNameFromPath, getUntitledIndex, isUntitledPath };
