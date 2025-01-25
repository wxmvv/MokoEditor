// sY ViewRegistry

import { Events } from "../model/Events.js";

import EditorView from "../views/content/EditorView.js";
// import FileView from "../model/pane/FileView.js";
import ImageView from "../views/content/ImageView.js";
import WelcomeView from "../views/content/WelcomeView.js";
import TestView from "../views/content/TestView.js";

import TabBar from "../views/toolbar/TabToolBar.js";
import EditorToolBar from "../views/toolbar/EditorToolBar.js";

const ImageViewExtension = ["bmp", "png", "jpg", "jpeg", "gif", "svg", "webp", "avif"]; //fT
// const AudioViewExtension = ["mp3", "wav", "m4a", "3gp", "flac", "ogg", "oga", "opus"]; //mT
// const VideoViewExtension = ["mp4", "webm", "ogv", "mov", "mkv"];
// const PdfViewExtension = ["pdf"]; //vT
const EditorViewExtension = ["md", "mdx"]; //yT
// const bT = ["canvas"]; //bT
// const wT = ["json", "css", "js"]; //wT
// const kT = [].concat(ImageViewExtension, mT, gT, vT, EditorViewExtension, bT); //kT

// function CT(e) {
// 	return kT.contains(e);
// }

// (this.embedRegistry = new FN()),
// (this.viewRegistry = new sY()),

export class ViewRegistry extends Events {
	constructor() {
		super();
		// View ViewType
		this.viewByType = {}; // ViewType string : ViewCreator
		this.typeByExtension = {}; // Extension string : ViewType string
		this.embedByExtension = {}; //
		// Toolbar
		this.toolBarRegistry = {}; // Toolbar id : ToolbarCreator
		// Setting
		this.settingSection = {};

		//MARK 初始化 typeByExtension
		this.registerViewWithExtensions(EditorViewExtension, EditorView.VIEW_TYPE, (pane) => new EditorView(pane));
		this.registerViewWithExtensions(ImageViewExtension, ImageView.VIEW_TYPE, (pane) => new ImageView(pane));
		this.registerView(WelcomeView.VIEW_TYPE, (pane) => new WelcomeView(pane));
		this.registerView(TestView.VIEW_TYPE, (pane) => new TestView(pane));
		// MARK 初始化toolbar
		this.registerToolbar(TabBar.VIEW_TYPE, (view) => new TabBar(view));
		this.registerToolbar(EditorToolBar.VIEW_TYPE, (view) => new EditorToolBar(view));
		// TODO MARK 初始化 embedByExtension
		// this.registerEmbedByExtensions(EditorViewExtension, function (e, t, n) { return e.displayMode ? new HI(e, t, n) : new NN(e, t, n);});
		// this.registerEmbedByExtensions(ImageViewExtension, function (e, t) {return new AN(e, t);});
		// this.registerEmbedByExtensions(AudioViewExtension, function (e, t) {return new LN(e, t);});
		// this.registerEmbedByExtensions(VideoViewExtension, function (e, t) {return new PN(e, t);});
		// this.registerEmbedByExtensions(PdfViewExtension, function (e, t, n) {return new lN(e, t, n);});
		// this.registerViewWithExtensions(fT, eB.VIEW_TYPE, function (e) { return new eB(e);});
		// this.registerViewWithExtensions(mT, QF.VIEW_TYPE, function (e) {	return new QF(e);});
		// this.registerViewWithExtensions(gT, uN.VIEW_TYPE, function (e) {	return new uN(e);});
		// this.registerViewWithExtensions(vT, sN.VIEW_TYPE, function (e) {	return new sN(e); });
		// this.registerView(rY, function (e) {return new aY(e);});
	}
	// MARK toolbar
	registerToolbar(id, ToolbarCreator) {
		this.toolBarRegistry[id] = ToolbarCreator;
	}
	unRegisterToolbar(id) {
		delete this.toolBarRegistry[id];
	}
	getToolbarById(id) {
		return this.toolBarRegistry[id];
	}

	// DONE embedByExtension
	// 注册单个扩展
	registerEmbedByExtension(extension, creator) {
		if (this.isExtensionRegistered(extension)) {
			throw new Error(`Attempting to register an embed for an already registered extension "${extension}"`);
		}
		this.embedByExtension[extension] = creator; // 将扩展与创建者关联
	}
	// 注册多个扩展
	registerEmbedByExtensions(extensions, creator) {
		for (const extension of extensions) {
			this.registerEmbedByExtension(extension, creator);
		}
	}
	// 取消注册多个扩展
	unregisterEmbedByExtensions(extensions) {
		for (const extension of extensions) {
			this.unregisterEmbedByExtension(extension);
		}
	}
	// 取消注册单个扩展
	unregisterEmbedByExtension(extension) {
		delete this.embedByExtension[extension]; // 从 embedByExtension 中删除该扩展
	}
	// 检查扩展是否已注册
	isEmbedByExtensionRegistered(extension) {
		return Object.prototype.hasOwnProperty.call(this.embedByExtension, extension); // 返回扩展是否存在于 embedByExtension 中
	}
	// 获取扩展的创建者
	getEmbedCreator(extension) {
		return this.isEmbedByExtensionRegistered(extension.extension) ? this.embedByExtension[extension.extension] : null; // 返回扩展的创建者或 null
	}
	// DONE typeByExtension
	registerView(viewType, viewCreator) {
		// 检查是否已经存在该视图类型
		if (Object.prototype.hasOwnProperty.call(this.viewByType, viewType)) {
			throw new Error(`Attempting to register an existing view type "${viewType}"`);
		}
		// 注册视图
		this.viewByType[viewType] = viewCreator;
		// 触发 "view-registered" 事件
		this.trigger("view-registered", viewType);
	}
	unregisterView(viewType) {
		// 检查是否存在该视图类型
		if (Object.prototype.hasOwnProperty.call(this.viewByType, viewType)) {
			// 删除视图类型
			delete this.viewByType[viewType];
			// 触发 "view-unregistered" 事件
			this.trigger("view-unregistered", viewType);
		}
	}
	registerViewWithExtensions(ViewExtensions, viewType, viewCreator) {
		this.registerView(viewType, viewCreator);
		this.registerExtensions(ViewExtensions, viewType);
	}
	registerExtensions(extensions, type) {
		for (const extension of extensions) {
			if (this.isExtensionRegistered(extension)) {
				throw new Error(`Attempting to register an existing file extension "${extension}"`);
			}
		}
		for (const extension of extensions) {
			this.typeByExtension[extension] = type; // 关联扩展与类型
		}
		this.trigger("extensions-updated"); // 触发扩展更新事件
	}
	unregisterExtensions(extensions) {
		for (const extension of extensions) {
			delete this.typeByExtension[extension]; // 从 typeByExtension 中删除该扩展
		}
		this.trigger("extensions-updated"); // 触发扩展更新事件
	}
	isExtensionRegistered(extension) {
		return Object.prototype.hasOwnProperty.call(this.typeByExtension, extension);
	}
	getViewCreatorByType(extension) {
		return this.viewByType[extension];
	}
	getTypeByExtension(extension) {
		return this.typeByExtension[extension];
	}
	// MARK 需要观察
	// 触发事件
	trigger(eventName, ...args) {
		super.trigger(eventName, ...args, false);
	}
	// 监听事件
	on(eventName, callback, context) {
		return super.on(eventName, callback, context);
	}
}

export default ViewRegistry;
