let note_names = "C C# D D# E F F# G G# A A# B".split(" ");
//note_names = "C Db D Eb E F Gb G Ab A Bb B".split(" ");

//clean chords and transposes them. or maybe gets their root!
function clean_and_transpose(chord, shift = 0, get_root = false) {
	chord = chord.replaceAll("maj", "M");
	chord = chord.replaceAll("min", "m");
	chord = chord.replaceAll("-", "m");
	chord = chord.replaceAll("aug", "+");
	chord = chord.replaceAll("dim", "*");
	chord = chord.replaceAll("dom", "7");
	for (let i = 0; i < chord.length; i++) {
		let character = chord.charAt(i);
		if (note_names.includes(character)) {
			let before = chord.substring(0, i);
			let after = chord.substring(i+1);
			let note_value = note_names.indexOf(character) + 12;
			while (after.startsWith("#")) {
				note_value++;
				after = after.substring(1);
			}
			while (after.startsWith("b")) {
				note_value--;
				after = after.substring(1);
			}
			note_value += shift;
			if (get_root) return note_value%12;
			chord = before + note_names[note_value%12] + after;
			//check for plain major chords
			if (before == "") {
				let voicing_to_come = after.length > 0 && !after.startsWith("/");
				if (!voicing_to_come) {
					chord = before + note_names[note_value%12] + "M" + after;
				}
			}
		}
	}
	return chord;
}

//crunch the numbers. return list of the ways you could continue
function request_continuation(history) {
	let results = [];
	for (let context = knowledge_max_context; context >= 1; context--) {
		if (context > history.length) continue;
		let chord_history = [];
		let offset = clean_and_transpose(history[history.length - context], 0, true);
		for (let i = history.length - context; i < history.length; i++) {
			chord_history.push(clean_and_transpose(history[i], 12-offset));
		}
		let continuations = knowledge[chord_history.join(" ")]; //list of pairs [3, 'Fmaj']. need offset applied still
		if (!continuations) continue;
		let bank = []; //bank of transposed continuations. one for each entry in the knowledge. still contains frequencies
		let total_count = 0;
		for (entry of continuations) {
			bank.push({
				count: entry[0],
				chord: clean_and_transpose(entry[1], offset)
			});
			total_count += entry[0];
		}
		results.push({
			context: context,
			bank: bank,
			total_count: total_count
		});
	}
	return results;
}

//returns array of chord members
//assumed chord structure: root, primary quality, 7 9 11 13 info (assume upto unless add before) (can include # b before), inversion information
function notes_of_chord(chord) {
	chord = clean_and_transpose(chord);
	let root_num = note_names.indexOf(chord.charAt(0));
	if (root_num == -1) return [];
	chord = chord.substring(1);
	while (chord.charAt(0) == "#") {
		root_num = (root_num+1)%12;
		chord = chord.substring(1);
	}
	let quality = "";
	for (q of "M m + *".split(" ")) if (chord.startsWith(q)) {
		quality = q;
		chord = chord.substring(q.length);
	}
	if (quality == "") quality = "%"; //special case for dominant
	//let triad = [0, null, quality=="m"||quality=="*"?3:4, null, quality=="*"?6:quality==""];
	let triad = []; //indexed weird! third is stored in [3], fifth is stored in [5]. this is javascript so we can do that
	//bank of the note values for upper extensions. i.e. if the quality is Major, this is what 5th 7th 9th etc will look like
	let upper = {
		"M": [0, 2, 4, 5, 7, 9, 11],
		"m": [0, 2, 3, 5, 7, 8, 10],
		"*": [0, 2, 3, 4, 6, 8, 9],
		"+": [0, 2, 4, 5, 8, 9, 11],
		"%": [0, 2, 4, 5, 7, 9, 10]
	}; //technically also stored lower. this is how things are generated up to fifth
	chord = "/5/"+chord;
	let iterations = 0;
	while (chord.length > 0 && iterations < 10) {
		iterations++;
		//parse a Later Part of the chord (i.e. 7, add#11, /Gb)
		while (chord.startsWith("/")) chord = chord.substring(1);
		let add = chord.startsWith("add");
		if (add) chord = chord.substring(3);
		let sus = chord.startsWith("sus");
		if (sus) chord = chord.substring(3);
		let no = chord.startsWith("no");
		if (no) chord = chord.substring(2);
		let accidental_offset = 0;
		while (chord.startsWith("#")) {
			accidental_offset = (accidental_offset+1)%12;
			chord = chord.substring(1);
		}
		while (chord.startsWith("b")) {
			accidental_offset = (accidental_offset+11)%12;
			chord = chord.substring(1);
		}
		while (chord.startsWith("*")) {
			accidental_offset = (accidental_offset+10)%12;
			chord = chord.substring(1);
		}
		while (chord.startsWith("+")) {
			accidental_offset = (accidental_offset+2)%12;
			chord = chord.substring(1);
		}
		if (chord.length == 0) continue;
		let content = chord.charAt(0); chord = chord.substring(1); //take content from chord until we hit a new token for the chord
		while (chord.length>0 && !chord.startsWith("add") && !chord.startsWith("sus") && !chord.startsWith("no") && !chord.startsWith("/") && !chord.startsWith("b") && !chord.startsWith("#") && !chord.startsWith("*") && !chord.startsWith("+")) { //SUUUUPER messy. this is just a token parser thing that stops whenever these tokens come up
			content += chord.charAt(0);
			chord = chord.substring(1);
		}
		if (sus) {
			triad[3] = upper[quality][parseInt(content)-1];
		} else if (no) {
			delete triad[parseInt(content)];
		} else if (note_names.includes(content.charAt(0))) {
			//probably inversion presented
			let inversion_num = note_names.indexOf(content.charAt(0));
			content = content.substring(1);
			//chord might possible still have # and b which we decided not to pick up... lets pick them up now
			while (chord.charAt(0) == "#") {
				inversion_num = (inversion_num+1)%12;
				chord = chord.substring(1);
			}
			while (chord.charAt(0) == "b") {
				inversion_num = (inversion_num-1==+11)%12;
				chord = chord.substring(1);
			}
			triad[0] = inversion_num - root_num; //offset by root num so that it goes back up there
			//console.log("inversion " + note_names[inversion_num%12]);
		} else {
			//integer presented. upper chord extension
			content = parseInt(content);
			if (content > 24) continue;
			//console.log("upper " + content + " +"+accidental_offset);
			//insert from below
			if (!add) for (let i = 1; i < content; i += 2) {
				if (triad[i] == undefined) {
					triad[i] = upper[quality][(i-1)%7];
				}
			}
			if (content == 5 && triad[5] != undefined && accidental_offset == 0) {
				delete triad[3]; //special case: remove 3rd when told 5th 
			}
			triad[content] = upper[quality][(content-1)%7]+accidental_offset;
		}
		//console.log("left to parse: "+chord);
	}
	//triad now contains note numbers
	let names = [];
	for (el of triad) if (el != null) {
		let n = note_names[(el+root_num)%12];
		if (!names.includes(n)) names.push(n);
	}
	return names; //btw bass note is always first
}

function are_same_chord(a, b) {
	if (typeof(a) == "string") a = notes_of_chord(a);
	if (typeof(b) == "string") b = notes_of_chord(b);
	if (a[0] != b[0]) return false;
	for (el of a) if (!b.includes(el)) return false;
	for (el of b) if (!a.includes(el)) return false;
	return true;
}

function remove_redundant_spellings() {
	let all_types = [];
	let all_types_members = [];
	for (chord of Object.keys(knowledge)) if (chord.split(" ").length == 1) {
		all_types.push(chord);
		all_types_members.push(notes_of_chord(chord).join(" "));
	}
	//for (x of all_types_members) console.log(all_types_members);
	for (let i = 0; i < all_types.length; i++) {
		for (let j = i+1; j < all_types.length; j++) {
			if (are_same_chord(all_types[i], all_types[j])) {
				console.log(all_types[i] + " and " + all_types[j] + " are the same");
			}
		}
	}
}

function common_tones(a, b) {
	if (typeof(a) == "string") a = notes_of_chord(a);
	if (typeof(b) == "string") b = notes_of_chord(b);
	let ct = [];
	for (el of a) if (b.includes(el)) ct.push(el);
	return ct;
}