import { Events } from "../../model/Events.js";

// lV
export class EmbedRegistry extends Events {
	constructor() {
		super();
		this.embedByExtension = {};
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
}

export default EmbedRegistry;
