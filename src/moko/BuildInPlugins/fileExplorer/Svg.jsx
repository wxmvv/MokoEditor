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

function Svg({ width, height, scale, svgRaw, color, className, style, onClick, clickable = false }) {
	return (
		<div
			className={`svg ${className ? className : ""} ${clickable ? " clickable" : ""}`}
			style={style}
			dangerouslySetInnerHTML={{ __html: svgExc(svgRaw, color, scale, width, height) }}
			onClick={onClick}
		></div>
	);
}

export default Svg;
