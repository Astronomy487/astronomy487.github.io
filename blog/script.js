//tiny script file to automatically do things to every article

//set inline delimeters for mathjax
MathJax = {
	tex: {
		inlineMath: [['$', '$']]
	}
};

let prefix = "../";

try {
	if (isMainPage) prefix = "";
} catch(e) {}

//css
add_head_link("stylesheet", prefix+"styles.css");
add_head_link("icon", prefix+"icon.png");

//helper functions
function add_script(url) {
	let script = document.body.appendChild(document.createElement("script"));
	script.setAttribute("async", "");
	script.setAttribute("src", url);
}

function add_head_link(rel, href) {
	let link = document.head.appendChild(document.createElement("link"));
	link.setAttribute("rel", rel);
	link.setAttribute("href", href);
}

//load mathjax
add_script("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js");

String.prototype.hashCode=function(){for(var t=0,r=0;r<this.length;r++)t=(t<<5)-t+this.charCodeAt(r),t|=0;return t};

document.querySelector("head").appendChild(document.createElement("title")).innerText = document.querySelector("h1").innerText;

for (let a of document.querySelectorAll("a")) {
	a.setAttribute("target", "_blank");
	if (a.getAttribute("href").includes("wikipedia.org")) {
		let img = document.createElement("img");
		img.setAttribute("src", "https://wikipedia.org/static/favicon/wikipedia.ico");
		img.setAttribute("class", "website-icon");
		a.appendChild(img);
	}
}

if (prefix != "" && false) {
	document.querySelector("body").insertBefore(document.createElement("a"), document.querySelector("h1"));
	document.querySelector("a").innerText = "see other posts";
	document.querySelector("a").setAttribute("href", "../");
	document.querySelector("a").style.textAlign = "right";
	document.querySelector("a").style.display = "block";
}


//custom : graph1
for (let div of document.querySelectorAll("graph1")) {
	let [xmin, xmax, ymin, ymax, width, height] = ["xmin", "xmax", "ymin", "ymax", "width", "height"].map(x => parseFloat(div.getAttribute(x)));
	width = 768;
	let transformations = eval(div.getAttribute("lambda"));
	if (typeof transformations == "function") transformations = [transformations];
	let colors = div.hasAttribute("colors") ? div.getAttribute("colors").split(",") : [];
	let canvas = div.appendChild(document.createElement("canvas"));
	canvas.setAttribute("width", width);
	canvas.setAttribute("height", height);
	div.style.width = width;
	div.style.height = height;
	let context = canvas.getContext("2d");
	context.lineWidth = 2;
	
	//do the axes
  context.strokeStyle = "#ddd";
	context.beginPath();
	context.stroke();
	
	for (let i = 0; i < transformations.length; i++) {
		//do the curve
		if (i < colors.length) context.strokeStyle = colors[i]
		else context.strokeStyle = "#fff";
		context.beginPath();
		for (let x = 0; x < width; x++) {
			let t = x/(width-1); //0 <= t <= 1
			let f = transformations[i](t*(xmax-xmin)+xmin); //f according to function output space
			//f -> y : ymax -> 0 , ymin -> height-1
			let outt = 1 - (f - ymin) / (ymax - ymin); //0 for biggest output, 1 for smallest output
			context.lineTo(x, outt*(height-1));
		}
		context.stroke();
	}
}

let nav = document.body.appendChild(document.createElement("nav"));
for (let h2 of document.querySelectorAll("h2")) {
	let i = h2.innerText.toLowerCase().replaceAll(" ", "-").replace(/[^a-z0-9\-]/gi, '');
	h2.setAttribute("id", i);
	let a = nav.appendChild(document.createElement("a"));
	a.innerText = h2.innerText;
	a.setAttribute("href", "#" + i);
	a.onclick = function() {
		h2.setAttribute("glow", "false");
		setTimeout(function(){
			h2.setAttribute("glow", "true");
		}, 10);
	}
}
try {if (isMainPage) {} } catch(e) {
	let aa = nav.appendChild(document.createElement("a"));
	aa.innerText = "my blog [where i talk about math]";
	aa.setAttribute("nobefore", "true");
	aa.setAttribute("href", "../");
}
nav.style.opacity = 0;


setTimeout(function() {
	if (nav.getBoundingClientRect().right > document.body.getBoundingClientRect().left) nav.remove();
	else nav.style.opacity = 1;
}, 1000);