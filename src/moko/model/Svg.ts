declare global {
	interface Window {
		svgExc(svgRaw: string, color: string, scale: number, width: string | number, height: string | number): string;
		Svg({ width, height, clickable, scale, svgRaw, color, className, style, onClick }: SvgProps): string;
	}
}

window.svgExc = svgExc;
window.Svg = Svg;

interface SvgProps {
	width?: string | number;
	height?: string | number;
	clickable?: boolean;
	scale?: number;
	svgRaw: string;
	color?: string;
	className?: string; // 自定义类名
	style?: string; // 自定义样式
	onClick?: () => void; // 点击事件
}

function svgExc(svgRaw: string, color = "currentColor", scale = 1, width: string | number = "15", height: string | number = "15"): string {
	const svgColorRegExp = /black/g;
	const svgWidthRegExp = /(?<=\s+width=")\d+/g;
	const svgHeightRegExp = /(?<=\s+height=")\d+/g;
	let a = svgRaw.replace(svgColorRegExp, color);
	if (scale !== 1) {
		a = a.replace(svgWidthRegExp, (match) => (Number(match) * scale).toString());
		a = a.replace(svgHeightRegExp, (match) => (Number(match) * scale).toString());
	} else if (width && height) {
		a = a.replace(svgWidthRegExp, width.toString());
		a = a.replace(svgHeightRegExp, height.toString());
	}
	return a;
}

function Svg(SvgProps: SvgProps) {
	const svgHtml = svgExc(SvgProps.svgRaw, SvgProps.color, SvgProps.scale, SvgProps.width, SvgProps.height);
	return `<div class="svg${SvgProps.clickable ? " clickable" : ""}${SvgProps.className ? " " + SvgProps.className : ""}" style="${SvgProps.style ? SvgProps.style : ""}" onclick="${
		SvgProps.onClick ? `(${SvgProps.onClick.toString()})()` : ""
	}">${svgHtml}</div>`;
}
