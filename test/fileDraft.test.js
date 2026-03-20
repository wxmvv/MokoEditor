import test from "node:test";
import assert from "node:assert/strict";

import { createUntitledFile, getFileNameFromPath, getUntitledIndex, isUntitledPath } from "../src/moko/utils/fileDraft.js";

test("createUntitledFile allocates unique untitled paths", () => {
	const first = createUntitledFile([]);
	const second = createUntitledFile([first]);
	const third = createUntitledFile([first, { path: "notes.md" }, second]);

	assert.equal(first.path, "untitled:1");
	assert.equal(first.name, "未命名文档");
	assert.equal(second.path, "untitled:2");
	assert.equal(second.name, "未命名文档 2");
	assert.equal(third.path, "untitled:3");
});

test("isUntitledPath supports legacy and numbered drafts", () => {
	assert.equal(isUntitledPath("untitled"), true);
	assert.equal(isUntitledPath("untitled:7"), true);
	assert.equal(isUntitledPath("/tmp/untitled.md"), false);
	assert.equal(getUntitledIndex("untitled"), 1);
	assert.equal(getUntitledIndex("untitled:7"), 7);
	assert.equal(getUntitledIndex("notes.md"), null);
});

test("getFileNameFromPath extracts basename cross-platform", () => {
	assert.equal(getFileNameFromPath("/Users/demo/notes.md"), "notes.md");
	assert.equal(getFileNameFromPath("C:\\Users\\demo\\notes.md"), "notes.md");
});
