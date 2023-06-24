let color_breakpoints = [
	[29, 125, 203], //blue
	[120, 0, 180], //royal purple
	[197, 20, 145], // deep magenta
	[208, 0, 0], //red
	[232, 93, 4], //orange
	[255, 186, 8], //yellow
	[199, 219, 23], //lime
	[100, 203, 55], //green
	[53, 190, 203], //cyan
	[29, 125, 203] //blue
];

function get_color(t) { //returns in css formatting. 0 <= t <= 1
	let i = t * (color_breakpoints.length - 1);
	let low_i = Math.floor(i);
	let high_i = Math.ceil(i);
	let high_i_prop = i%1;
	let low_i_prop = 1 - high_i_prop;
	let colors = [];
	for (let channel = 0; channel < 3; channel++)
		colors[channel] = color_breakpoints[low_i][channel] * low_i_prop + color_breakpoints[high_i][channel] * high_i_prop;
	for (let channel = 0; channel < 3; channel++)
		colors[channel] = Math.round(colors[channel]);
	return "rgb("+colors.join(", ")+")";
}

function dynamic_accent_color() {
	let t = new Date();
	t = t.getHours()/24 + t.getMinutes()/24/60+t.getSeconds()/24/60/60;
	document.body.style.setProperty("--accent", get_color(t));
}
dynamic_accent_color();
setInterval(dynamic_accent_color, 60000);