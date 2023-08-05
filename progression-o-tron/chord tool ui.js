function accept_chord(chord) {
	document.getElementById("prog_input").value = document.getElementById("prog_input").value.trim() + " " + chord;
	find_continuations();
}

function auto_continuate(n = 1, rerun_tool = true) {
	for (let i = 0; i < n; i++) {
		let prog = document.getElementById("prog_input").value;
		prog = prog.split(",").join(" ").split(" ").filter((str) => str != '');
		let report = request_continuation(prog);
		let choice = pick_from_frequency_list(report[0].bank);
		document.getElementById("prog_input").value += " " + choice;
	}
	if (rerun_tool) find_continuations();
}

//using auto_continuate, choose a few chords for me
function start_for_me() {
	let all_types = Object.keys(knowledge);
	let choice;
	do {
		choice = Math.floor(Math.random()*all_types.length);
	} while (all_types[choice].split(" ").length != 1);
	document.getElementById("prog_input").value = clean_and_transpose(all_types[choice], Math.floor(Math.random()*12));
	auto_continuate(20, false);
	choice = document.getElementById("prog_input").value.split(" ");
	choice = choice[choice.length-1];
	document.getElementById("prog_input").value = choice;
	auto_continuate(2);
}

function transpose_input(n) {
	if (n == 0) return;
	let prog = document.getElementById("prog_input").value;
	prog = prog.split(",").join(" ").split(" ").filter((str) => str != '');
	for (let i = 0; i < prog.length; i++)
		prog[i] = clean_and_transpose(prog[i], n);
	document.getElementById("prog_input").value = prog.join(" ");
	find_continuations();
}

function pick_from_frequency_list(f_list) { //doesn't force any changes, literally just picks
	let list = [];
	for (entry of f_list) {
		for (let i = 0; i < entry.count; i++) {
			list.push(entry.chord);
		}
	}
	return list[Math.floor(Math.random()*list.length)];
}

//ui for running request_continuation
let last_run_on = "";
function find_continuations(force_run = false) {
	let prog = document.getElementById("prog_input").value;
	prog = prog.split(",").join(" ").split(" ").filter((str) => str != '');
	if (prog.join(" ") == last_run_on && !force_run) return;
	last_run_on = prog.join(" ");
	if (Object.keys(knowledge).length == 0) {
		document.getElementById("advanced_results").innerHTML = "<hr><h3>There are no active libraries right now.</h3><p>You should probably go fix that.</p><hr>";
	} else if (prog.length == 0) {
		document.getElementById("advanced_results").innerHTML = '<hr><h3>Type some chords to find a possible continuation</h3><div class="context_level_heading" onclick="start_for_me()" id="start_for_me">Start a progression for me</div><hr>';
		document.getElementById("action_buttons").style.display = "none";
	} else {
		let report = request_continuation(prog);
		document.getElementById("advanced_results").innerHTML = advanced_results_html(report, prog);
	}
	let return_html = []; //html for the little box that cleans and returns the input prog
	for (element of prog) {
		return_html.push("<span class=\"inline_chord\" root=\""+clean_and_transpose(element, 0, true)+"\">"+clean_and_transpose(element)+"</span>");
	}
	document.getElementById("cleaned_return").innerHTML = return_html.join(" ");
}

//assumes result has at least one entry
function advanced_results_html(report, prog) {
	let html = "<hr>";
	//clean_and_transpose(prog[prog.length-1]) //cleaned final chord that might cause error
	if (report.length == 0) {
		//problem: last chord has no lookup
		let problem = prog[prog.length-1];
		document.getElementById("action_buttons").style.display = "none";
		return "<hr><h3>Cannot continue this progression</h3><p>There are no instances of a chord like <span class=\"inline_chord\" root=\""+clean_and_transpose(problem, 0, true)+"\">"+clean_and_transpose(problem)+"</span> before. <span class=\"quiet\">Maybe the chord is spelled wrong. If not, then that chord never appeared in the sample.</span></p><hr>";
	}
	for (level of report) {
		html += "<div class=\"context_level_heading\" onclick=\"accept_chord('"+pick_from_frequency_list(level.bank)+"')\">using " + level.context + " chord"+(level.context==1?"":"s")+" of context</div>";
		let proportion_ceiling = level.bank[0].count * 1.5;
		for (cont of level.bank) {
			let chord_name = cont.chord;
			html += "<div class=\"result_chord\" root=\""+clean_and_transpose(cont.chord, 0, true)+"\" onclick=\"accept_chord('"+chord_name+"')\">";
			html += "<span class=\"result_chord_name\">" + chord_name + "</span>";
			let proportion_display = 100 * cont.count / proportion_ceiling;
			let proportion_text = Math.round(1000 * cont.count / level.total_count)/10 + "%";
			html += "<span class=\"result_chord_percent_container\">";
			html += "<span class=\"result_chord_percent\" style=\"width: "+proportion_display+"%\">&nbsp;</span>";
			html += "<span class=\"result_chord_number\">"+proportion_text+"</span>";
			html += "<span class=\"result_chord_common_tones\">"+common_tones(prog[prog.length-1], chord_name).join(" ")+"</span>";
			html += "</span>";
			html += "</div>";
		}
		html += "<hr>";
	}
	document.getElementById("action_buttons").style.display = "block";
	return html;
}
