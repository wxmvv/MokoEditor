
function svgExc(svgRaw, color = "currentColor", scale = 1, width, height) {
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

export function Svg({ width, height, clickable, scale, svgRaw, color, className, style, onClick }) {
	const svgHtml = svgExc(svgRaw, color, scale, width, height);
	return `<div class="svg${clickable ? " clickable" : ""}${className ? " " + className : ""}" style="${style ? style : ""}" onclick="${onClick ? `(${onClick.toString()})()` : ""}">${svgHtml}</div>`;
}

export default Svg;
