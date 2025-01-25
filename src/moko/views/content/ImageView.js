import FileView from "../../model/FileView";

const Image_VIEW_TYPE = "image";
const image_view_icon_name = "image";
const ImageViewExtension = ["bmp", "png", "jpg", "jpeg", "gif", "svg", "webp", "avif"];

export class ImageView extends FileView {
	constructor(pane, id) {
		super(pane, id ? `${id}-image-view` : "image-view");
		this.toolBars = {};
		this.viewType = "image";
		this.file = null; //path 文件路径 name 文件名
	}
	async onopen() {
		this.containerEl.addClass("image-view");
		this.containerEl.innerHTML = ` <div>你好图片</div><img src="${this.file.path}" />`;
	}
	static get VIEW_TYPE() {
		return Image_VIEW_TYPE;
	}
	getViewType() {
		return Image_VIEW_TYPE;
	}
	getIcon() {
		return image_view_icon_name;
	}
	canAcceptExtension(extension) {
		return ImageViewExtension.includes(extension);
	}
}

export default ImageView;
