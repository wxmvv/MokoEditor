// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Root, createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { FilePanel } from "./FilePanel.jsx";
import { PanelView } from "../../model/PanelView.js";

export const FilE_PANEL_VIEW = "file-panel-view";
export class FilePanelView extends PanelView {
	async onload() {
		this.root = createRoot(this.containerEl);
		this.root.render(
			<StrictMode>
				<FilePanel mokoRef={{ current: this.moko }} />
			</StrictMode>
		);
	}
	async onunload() {
		this.root?.unmount();
	}
	getViewType() {
		return FilE_PANEL_VIEW;
	}
}
