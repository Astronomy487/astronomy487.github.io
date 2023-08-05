
let sections_list = document.getElementsByTagName("section");
for (let i = 0; i < sections_list.length; i++) {
	let t = sections_list[i].getAttribute("navtext");
	document.getElementById("tab_nav").innerHTML += "<span onclick=\"open_section("+i+")\" id=\"section_nav_"+i+"\">"+t+"</span>";
}
function open_section(n, time = 500) {
	for (let i = 0; i < sections_list.length; i++) {
		sections_list[i].style.animation = "0.5s section_"+i+"_"+(i==n ? "in" : "out"); //set animation
		document.getElementById("section_nav_"+i).setAttribute("active", i==n ? "true" : "false");
	}
	setTimeout(function(){ //0.25s, set their opacity. should be ready by end of animation
		for (let i = 0; i < sections_list.length; i++) {
			sections_list[i].style.opacity = i==n ? "1" : "0";
		}
	}, 0.5*time);
	setTimeout(function(){ //end of animation. set true active status
		for (let i = 0; i < sections_list.length; i++) {
			sections_list[i].setAttribute("active", i==n ? "true" : "false");
		}
	}, time);
}

// + the special thing that makes h1/h2 (always static) rainbows
for (el of document.getElementsByTagName("h1")) {
	let t = el.innerText;
	let html = "";
	for (let i = 0; i < t.length; i++) {
		html += "<span style=\"color: var(--color"+i%12+")\">"+t.charAt(i)+"</span>";
	}
	el.innerHTML = html;
}
for (el of document.getElementsByTagName("h2")) {
	let t = el.innerText;
	let html = "";
	for (let i = 0; i < t.length; i++) {
		html += "<span style=\"color: var(--color"+i%12+")\">"+t.charAt(i)+"</span>";
	}
	el.innerHTML = html;
}

//the special cleaning test
document.getElementById("test_chord_cleaning_input").value = "";
test_chord_cleaning();
function test_chord_cleaning() {
	let prog = document.getElementById("test_chord_cleaning_input").value;
	prog = prog.split(",").join(" ").split(" ").filter((str) => str != '');
	let html = [];
	let html2 = [];
	for (chord of prog) {
		html.push("<span class=\"inline_chord\" root=\""+clean_and_transpose(chord, 0, true)+"\">"+clean_and_transpose(chord)+"</span>");
		html2.push(notes_of_chord(chord).join(" "));
	}
	if (html.length == 0) html = ["<span class=\"quiet\">cleaned chords will appear here</span>"];
	if (html2.length == 0) html2 = ["<span class=\"quiet\">chord members will appear here</span>"];
	document.getElementById("test_chord_cleaning_output").innerHTML = html.join(" ");
	document.getElementById("test_chord_cleaning_output_2").innerHTML = html2.join(", ");
}