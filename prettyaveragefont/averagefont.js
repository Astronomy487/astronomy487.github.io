for (let div of document.querySelectorAll("[averagefont]")) {
	let fonts = div.getAttribute("averagefont").split(",").map(x => x.trim());
	if (fonts.join("") == "") fonts = ["Arial", "Verdana", "Tahoma", "Trebuchet MS"];
	let txtcolor = div.getAttribute("txtcolor"); if (!txtcolor) txtcolor = "black";
	let bgcolor = div.getAttribute("bgcolor"); if (!bgcolor) bgcolor = "white";
	fonts = fonts.map(x => x.split("/"));
	for (let font of fonts) if (font.length == 1) font.push("inherit");
	let text = div.innerText;
	div.innerText = "";
	for (let word of text.split(" ")) {
		let wordspan = div.appendChild(document.createElement("span"));
		wordspan.style.display = "inline-block";
		wordspan.style.marginRight = "0.25em";
		for (let character of word.split("")) {
			let container = wordspan.appendChild(document.createElement("span"));
			container.style.display = "inline-block";
			container.style.position = "static";
			container.style.backgroundColor = bgcolor;
			container.style.margin = "0 -0.03125em";
			for (let i = 0; i < fonts.length; i++) {
				let span = container.appendChild(document.createElement("span"));
				span.innerText = character;
				span.style.fontFamily = fonts[i][0];
				span.style.fontWeight = fonts[i][1];
				span.style.backgroundColor = bgcolor;
				span.style.textAlign = "center";
				span.style.color = txtcolor;
				span.style.opacity = 1/(i+1);
			}
			let maxWidth = Array.from(container.querySelectorAll("span")).reduce((a,b) => Math.max(a, b.getBoundingClientRect().width), 0) + "px";
			if (maxWidth == "0px") maxWidth = "0.5em";
			for (let span of container.querySelectorAll("span")) {
				span.style.position = "absolute";
				span.style.width = maxWidth;
			}
			container.style.width = maxWidth;
			container.style.filter = "brightness(1) contrast(500)";
		}
	}
}