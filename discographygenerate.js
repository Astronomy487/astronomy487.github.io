if (screen.width < 1280) {
	//cancel plans. open bandcamp. i cant design for mobile
	if (albums.length > 1) {
		open("https://astronomy487.bandcamp.com");
	} else {
		open(albums[0].links.bandcamp);
	}
}

let bio_element = document.querySelector("#bio");
for (let album of albums) {
	//make the info
	let album_main_element = document.body.appendChild(document.createElement("main"));
	album_main_element.style.setProperty("--accent", "rgb("+album.accent+")");
	album_main_element.style.setProperty("--text", "rgb("+album.text+")");
	album_main_element.style.setProperty("--semitext", "rgba("+album.text+", 0.67)");
	album_main_element.style.setProperty("--background", "rgb("+album.background+")");
	album_main_element.style.setProperty("--edge", "rgb("+album.edge+")");
	album_main_element.style.setProperty("--dark-background", "rgb("+album.dark_background+")");
	//decor
	let decor = text_element(album_main_element, "div", album.material_symbol, "decor");
	let decor_animation_delay = -10 * Math.random() + "s";
	decor.style.animationDelay = decor_animation_delay;
	if (album == albums[0] && bio_element) { //if first on page with bio, add decor to bio instead
		decor = text_element(bio_element, "div", album.material_symbol, "decor");
		decor.style.animationDelay = decor_animation_delay;
	}
	if (!album.image_front) album.image_front = "https://astronomy487.github.io/"+album.title.toLowerCase().replace(/[^a-z0-9]/g, "")+"/front.jpg";
	if (!album.image_back) album.image_back = "https://astronomy487.github.io/"+album.title.toLowerCase().replace(/[^a-z0-9]/g, "")+"/back.jpg";
	//html time
	let div = album_main_element.appendChild(document.createElement("div"));
	div.setAttribute("class", "information");
	let h1 = text_element(div, "h1", album.title);
	bumpify_text(h1, 10);
	/*if (album.title_font) {
		html_link_font(album.title_font, album.title_font_weight);
		h1.style.fontFamily = album.title_font;
	}
	for (property of Object.keys(album.title_font_css))
		h1.style[property] = album.title_font_css[property];*/
	let metadata = text_element(div, "p", album.release_year, "album_metadata");
	if (album.compilation) metadata.innerText += " Compilation";
	if (album.main_length) metadata.innerText += " · " + album.main_length;
	if (album.description) text_element(div, "p", album.description, "album_description");
	//tracklists
	if (album.disc_lengths) album.disc_lengths.unshift(0); //put a 0 at start to activate disc count
	function do_disc_math(paragraph) {
			if (album.disc_lengths && album.disc_lengths.length) { //if this album is broken into discs
				if (album.disc_lengths[0]) {
					album.disc_lengths[0]--;
				} else {
					album.disc_lengths.shift();
					if (!album.disc_lengths.length) return;
					album.disc_lengths[0]--;
					if (album.disc_names[0].length) paragraph.innerHTML += " <span class=\"disc_notice\">"+album.disc_names[0]+":</span> ";
					album.disc_names.shift();
				}
			}
	}
	if (album.main_tracklist) {
		let main_p = text_element(div, "p", "", "tracklist main_tracklist");
		for (let i = 0; i < album.main_tracklist.length; i++) {
			do_disc_math(main_p);
			main_p.innerHTML += " <span class=\"track\"><b>"+(i+1)+"</b> " + album.main_tracklist[i] + "</span>";
		}
	}
	if (album.bonus_tracklist || album.bonus_tracklist_notice) {
		let bonus_p = text_element(div, "p", "", "tracklist bonus_tracklist");
		let plural = (album.bonus_tracklist && album.bonus_tracklist.length > 1) || album.bonus_tracklist_notice;
		let bonus_notice = text_element(bonus_p, "span", "Bandcamp-exclusive bonus track"+(plural?"s":"")+" · "+album.bonus_length, "paragraph_head");
		if (album.bonus_tracklist_notice) {
			bonus_p.innerHTML += album.bonus_tracklist_notice;
		}
		if (album.bonus_tracklist) {
			for (let i = 0; i < album.bonus_tracklist.length; i++) {
				do_disc_math(bonus_p);
				bonus_p.innerHTML += " <span class=\"track\"><b>"+(i+1+album.main_tracklist.length)+"</b> " + album.bonus_tracklist[i]+"</span>";
			}
		}
	}
	for (p of document.querySelectorAll(".tracklist")) p.innerHTML = p.innerHTML.replaceAll("(", "<span class=\"paren\">(").replaceAll(")", ")</span>");
	//iframe
	/*if (album.bandcamp_album_id) {
		div.insertAdjacentHTML("beforeend", '<iframe style="border: 0; width: 32rem; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album='+album.bandcamp_album_id+'/size=large/bgcol=333333/linkcol='+rgb_to_hex(album.accent)+'/tracklist=false/artwork=small/transparent=true/" seamless></iframe>');
		let iframe = div.querySelector("iframe");
		let iframe_doc = iframe.contentDocument || iframe.contentWindow.document;
		setTimeout(function(){
			iframe_doc.body.style.backgroundColor = "blue";
		},1000);
	}*/
	//links
	let nav = text_element(album_main_element, "nav");
	for (name of Object.keys(album.links)) {
		let a = text_element(nav, "a");
		a.setAttribute("href", album.links[name]);
		let img = text_element(a, "img");
		img.setAttribute("src", "https://astronomy487.github.io/socialicons/"+album.icon_color+"/"+name+".png");
	}
	//copyright
	if (!album.exclude_copyright) {
		let copyright_notice = text_element(div, "p", "&copy; "+album.release_year+" Astro. <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0\" target=\"_blank\">CC BY-NC-SA 4.0 License.</a>", "copyright");
		if (album.credits) copyright_notice.innerHTML += "<br>" + album.credits.join("<br>");
		for (let [name, url] of [["REY GWEN", "https://reygwen.com"], ["bandanabloom", "https://bandanabloom.bandcamp.com/"]]) {
			copyright_notice.innerHTML = copyright_notice.innerHTML.replaceAll(name, "<a href=\""+url+"\" target=\"_blank\">"+name+"</a>")
		}
	}
	//lonely things
	if (albums.length == 1) {
		album_main_element.setAttribute("lonely", "true");
		document.querySelector("link[rel=\"icon\"]").setAttribute("href", album.image_front);
		document.querySelector("title").innerText = album.title;
		document.body.style.overflow = "hidden";
	}
	//album art
	let animation_progress = -10 * Math.random() + "s";
	for (let [side, tag, img] of [["front", "img", album.image_front], ["back", "img", album.image_back], ["left", "div"], ["right", "div"]]) {
		let element = text_element(album_main_element, tag);
		element.setAttribute("class", "album_art "+side);
		if (tag == "img") {
			element.setAttribute("src", img);
		}
		element.style.animationDelay = animation_progress;
	}
}

function text_element(parent, tag, text, c) {
	let element = parent.appendChild(document.createElement(tag));
	if (text) element.innerHTML = text;
	if (c) element.setAttribute("class", c);
	return element;
}

function html_link_font(name, weight) {
	let link = document.querySelector("head").appendChild(document.createElement("link"));
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", "https://fonts.googleapis.com/css2?family="+name.replaceAll(" ", "+")+":wght@"+weight+"&display=swap");
}


function rgb_to_hex(c) {
	return h(c[0]) + h(c[1]) + h(c[2]);
	function h(c) {
		let hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
}

let choice_album = albums[0];
//document.body.style.setProperty("--accent", "rgb("+choice_album.accent+")");
document.body.style.setProperty("--text", "rgb("+choice_album.text+")");
document.body.style.setProperty("--background", "rgb("+choice_album.background+")");
document.body.style.setProperty("--dark-background", "rgb("+choice_album.dark_background+")");
document.body.style.setProperty("--edge", "rgb("+choice_album.edge+")");

function bumpify_text(element, len) {
	element.innerHTML = "<span>" + element.innerText.split("").join("</span><span>") + "</span>";
	for (let span of element.querySelectorAll("span")) {
		span.setAttribute("class", "bump");
	}
	//let bump_count = -20 * Math.random();
	let first_wait = Math.random() * len;
	setTimeout(function() {
		setInterval(function() { //repeat this
			let span_number = 0;
			for (let span of element.querySelectorAll("span")) {
				span_number++;
				setTimeout(function() {
					span.classList.remove("bump");
					void element.offsetWidth;
					span.classList.add("bump");
				}, 100 * span_number);
			}
		}, len * 1000);
	}, first_wait);
	/*for (let span of element.querySelectorAll("span")) {
		span.setAttribute("class", "bump");
		setTimeout(function(){
			setInterval(function(){
				span.classList.remove("bump");
				void element.offsetWidth;
				span.classList.add("bump");
			}, len * 1000);
		}, first_wait * 1000 + 100 * span_number);
		span_number++;*/
}