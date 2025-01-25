/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { UncontrolledTreeEnvironment, Tree } from "react-complex-tree";
import { TreeProvider } from "./tree/TreeProvider";
import ProgressBar from "../../utils/ProgressBar";
import Svg from "./Svg";
import FileSvg from "../../icons/file.svg?raw";
import FolderSvg from "../../icons/folder.svg?raw";
import FolderOpenSvg from "../../icons/folder_open.svg?raw";
import TargetSvg from "../../icons/target.svg?raw";
import CollsapseSvg from "../../icons/collapse_all.svg?raw";
import ExpandSvg from "../../icons/expand_all.svg?raw";

// TODO
// 1. 文件名超出问题，以及换行

const cx = (...classNames) => classNames.filter((cn) => !!cn).join(" ");
// MARK - 树形结构const

const renderDepthOffset = 18; // 缩进偏移量
const renderLeftOffset = 10; // 整体偏移量
export function FilePanel({ mokoRef }) {
	const [viewState, setViewState] = useState({});
	const [refreshFlag, setRefreshFlag] = useState(0);
	const [fileMap, setFileMap] = useState(null);
	const [root, setRoot] = useState("root");
	const dataProviderRef = useRef(null);
	const panelRef = useRef(null);
	const tree = useRef(null);

	const fileMapRef = useRef(null);

	// 初始化的时候会调用一次 如果有Library就读取
	useEffect(() => {
		if (!mokoRef.current.FileManager.fileMap) return;
		fileMapRef.current = mokoRef.current.FileManager.fileMap;
		setFileMap(mokoRef.current.FileManager.fileMap);
		mokoRef.current.adapter.on("file-map-update", handleFileMapChange);
	}, [mokoRef.current.FileManager.fileMap]);

	// 刷新页面
	useEffect(() => {
		if (!fileMap || !mokoRef.current.FileManager) return;
		dataProviderRef.current = new TreeProvider(fileMap);
		if (fileMap["root"].children.length === 1) {
			setRoot(fileMap["root"].children[0]);
		} else {
			setRoot("root");
		}
		setRefreshFlag(refreshFlag + 1);
		mokoRef.current.viewState = viewState;
	}, [fileMap]);

	// Handler
	// const handleSort = () => {
	// 	const sortedData = sortTreeNodes([...treeData]);
	// 	setTreeData(sortedData);
	// };
	const sortTreeNodes = (obj) => {
		// TODO 自定义排序
		const customOrder = (a, b) => {
			const regex = /(\d+)|(\D+)/g;
			const aParts = a.match(regex);
			const bParts = b.match(regex);
			for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
				const aPart = aParts[i];
				const bPart = bParts[i];

				// 如果都是数字，按数值比较
				if (!isNaN(aPart) && !isNaN(bPart)) {
					return Number(aPart) - Number(bPart);
				}
				// 按字母比较
				return aPart.localeCompare(bPart);
			}
			return aParts.length - bParts.length; // 长度不同则按长度排序
		};
		const sortedKeys = Object.keys(obj).sort(customOrder); // 获取键并排序
		const sortedObject = {};
		sortedKeys.forEach((key) => {
			sortedObject[key] = obj[key]; // 按排序后的键构建新对象
		});
		return sortedObject;
	};
	const handleFileMapChange = (newFileMap) => {
		setFileMap({ ...sortTreeNodes(newFileMap) }); // console.log("handleFileMapChange", newFileMap);
	};
	async function HandleAddLocation() {
		const paths = await mokoRef.current.FileManager.showOpenDialog();
		const pb = new ProgressBar(panelRef.current, true, false);
		pb.show();
		pb.setMessage("扫描文件夹中...");
		await mokoRef.current.FileManager.addLocation(paths);
		pb.delayHide();
	}
	async function handleClickItem(item) {
		if (item.isFolder) console.log(`Folder clicked: `, item);
		else {
			console.log(`File clicked: `, item);
			await mokoRef.current.workspace.openFile(item);
		}
	}
	async function handleContextMenu(item) {
		console.log(`Context menu clicked: `, item);
		await mokoRef.current.adapter.showContextMenu(item);
	}
	function handleSelectItems() {
		//selectedItems // console.log("Selected items:", selectedItems.map((item) => item).join(", "));
	}
	function handleTarget() {
		// console.log(tree, mokoRef.current.workspace.activePane.getFile());
		const file = mokoRef.current.workspace.activePane.getFile();
		tree.current.focusItem(file.path);
		tree.current.selectItems([file.path]);
	}
	function handleCollapseAll() {
		tree.current.collapseAll();
	}
	function handleExpandAll() {
		tree.current.expandAll();
	}

	return (
		<div className="filePanel" ref={panelRef}>
			{mokoRef.current && (
				<div className="panel-header">
					<div className="panel-header-title">File Explorer</div>
					<div className="panel-header-tools">
						<Svg svgRaw={TargetSvg} clickable onClick={handleTarget} />
						<Svg svgRaw={ExpandSvg} clickable onClick={handleExpandAll} />
						<Svg svgRaw={CollsapseSvg} clickable onClick={handleCollapseAll} />
						{/* style={{ color: "#68bee3" }} */}
					</div>
				</div>
				// <div className="panel-btn-group">
				// 	<button className="btn" onClick={HandleAddLocation}>
				// 		Add Location
				// 	</button>
				// </div>
			)}
			{/* https://rct.lukasbach.com */}
			<div className="treeView">
				{fileMap && dataProviderRef.current && (
					<UncontrolledTreeEnvironment
						// style={{ width: "100%", height: "100%" }}
						// key={refreshFlag}
						key={`file-tree-1${refreshFlag}`}
						dataProvider={dataProviderRef.current}
						getItemTitle={(item) => item.name}
						viewState={viewState}
						onViewStateChange={setViewState}
						canDragAndDrop={false}
						canDropOnFolder={false}
						canReorderItems={true}
						onSelectItems={handleSelectItems}
						// renderDepthOffset={10} // 已在下方重新实现
					>
						<Tree
							treeId="tree-1"
							ref={tree}
							rootItem={root}
							treeLabel="Tree"
							renderItemsContainer={({ children, containerProps }) => (
								<ul {...containerProps} className="rct-tree-items-container">
									{children}
								</ul>
							)}
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							renderItem={({ item, depth, children, title, arrow, context, info }) => {
								const InteractiveComponent = context.isRenaming ? "div" : "button";
								const type = context.isRenaming ? undefined : "button";
								return (
									<li
										{...context.itemContainerWithChildrenProps}
										className={cx(
											"rct-tree-item-li",
											item.isFolder && "rct-tree-item-li-isFolder",
											context.isSelected && "rct-tree-item-li-selected",
											context.isExpanded && "rct-tree-item-li-expanded",
											context.isFocused && "rct-tree-item-li-focused",
											context.isDraggingOver && "rct-tree-item-li-dragging-over",
											context.isSearchMatching && "rct-tree-item-li-search-match"
										)}
									>
										<div
											{...context.itemContainerWithoutChildrenProps}
											//  style={{ '--depthOffset': `${(depth + 1) * renderDepthOffset}px` }}
											style={{ "--depthOffset": `${depth * renderDepthOffset + renderLeftOffset}px` }} // MARK
											className={cx(
												"rct-tree-item-title-container",
												item.isFolder && "rct-tree-item-title-container-isFolder",
												context.isSelected && "rct-tree-item-title-container-selected",
												context.isExpanded && "rct-tree-item-title-container-expanded",
												context.isFocused && "rct-tree-item-title-container-focused",
												context.isDraggingOver && "rct-tree-item-title-container-dragging-over",
												context.isSearchMatching && "rct-tree-item-title-container-search-match"
											)}
										>
											{arrow}
											<InteractiveComponent
												type={type}
												{...context.interactiveElementProps}
												className={cx(
													"rct-tree-item-button",
													item.isFolder && "rct-tree-item-button-isFolder",
													context.isSelected && "rct-tree-item-button-selected",
													context.isExpanded && "rct-tree-item-button-expanded",
													context.isFocused && "rct-tree-item-button-focused",
													context.isDraggingOver && "rct-tree-item-button-dragging-over",
													context.isSearchMatching && "rct-tree-item-button-search-match"
												)}
											>
												{title}
											</InteractiveComponent>
										</div>
										{children}
									</li>
								);
							}}
							renderItemTitle={({ item, title, context, info }) => {
								if (!info.isSearching || !context.isSearchMatching)
									return (
										<div className={`tree-item ${context.isSelected ? "selected" : ""}`} onClick={() => handleClickItem(item)} onContextMenu={() => handleContextMenu(item)}>
											{item.isFolder ? context.isExpanded ? <Svg svgRaw={FolderOpenSvg} color={"#68bee3"} /> : <Svg svgRaw={FolderSvg} /> : <Svg svgRaw={FileSvg} />}
											{item.name}
										</div>
									);
								const startIndex = title.toLowerCase().indexOf(info.search.toLowerCase());
								return (
									<div className={`tree-item ${context.isSelected ? "selected" : ""}`} onClick={() => handleClickItem(item)} onContextMenu={() => handleContextMenu(item)}>
										{item.isFolder ? context.isExpanded ? <Svg svgRaw={FolderOpenSvg} color={"#68bee3"} /> : <Svg svgRaw={FolderSvg} /> : <Svg svgRaw={FileSvg} />}
										{/* TODO 搜索时的render */}

										{startIndex > 0 && <span>{title.slice(0, startIndex)}</span>}
										<span className="rct-tree-item-search-highlight">{title.slice(startIndex, startIndex + info.search.length)}</span>
										{startIndex + info.search.length < title.length && <span>{title.slice(startIndex + info.search.length, title.length)}</span>}
									</div>
								);
							}}
						/>
					</UncontrolledTreeEnvironment>
				)}
			</div>
		</div>
	);
}

export default FilePanel;

// <div
// 	// style={{ marginLeft: 10 * (item.level - 1) }} // 根据层级调整缩进
// 	className={`tree-item ${context.isSelected ? "selected" : ""}`}
// 	onClick={() => handleClickItem(item)} // onMouseDown={() => handleMousedownItem(item)}// onMouseDown={() => console.log(title, item, context, info)}
// 	onContextMenu={() => handleContextMenu(item)}
// >
// 	{item.isFolder ? context.isExpanded ? <Svg svgRaw={FolderOpenSvg} color={"#68bee3"} /> : <Svg svgRaw={FolderSvg} /> : <Svg svgRaw={FileSvg} />}
// 	{item.name}
// </div>
// )}
