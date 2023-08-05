let libraries = [];

let color_counter = 2;

make_library("The Real Book", "Chords taken from the first 15 songs of The Real Book collection of jazz standards. Comprised mostly of seventh chords!",
	{'Cm7':[[28,'Fm7'],[8,'A#m7'],[4,'Am7'],[1,'Gm7*5'],[5,'Cm7'],[1,'Gm7'],[3,'D#M7'],[2,'Bm7'],[1,'G#7*5'],[6,'Dm7'],[4,'C#M7'],[4,'A#M'],[71,'F7'],[5,'F7b9'],[4,'D7#9'],[2,'G#M7'],[1,'Gm7b5'],[1,'D7b9'],[2,'B*7'],[4,'G7#9'],[2,'C7'],[7,'F7sus4'],[3,'C#*7'],[2,'Fm7b5/A#'],[1,'Am7b5'],[3,'F#7'],[3,'G7'],[1,'F#9'],[2,'Cm7b5/F#'],[1,'D7'],[1,'D#6'],[1,'F9'],[2,'DM/C'],[1,'G#m7']],'C7#9/G B7#9/F#':[[1,'B7b9']],'C7*5':[[1,'Fm7']],'C9sus4':[[1,'Fm7']],'CM7':[[1,'F7'],[1,'C7'],[6,'Bm7'],[10,'Cm7'],[3,'F#m7'],[12,'Dm7'],[1,'CM7'],[3,'Em7'],[4,'B7'],[4,'C#m7'],[1,'Bm7b5'],[3,'Am7'],[7,'FM7'],[4,'F#m7b5'],[2,'A7'],[2,'C#m7b5'],[3,'C6'],[1,'C#*7'],[1,'B7#5'],[3,'Dm7b5'],[2,'F#7'],[1,'G#+7'],[1,'D7'],[1,'Fm7/C'],[1,'D#7#5']],'Cm7 Gm7':[[1,'Cm7']],'Cm7*5':[[1,'Fm7']],'CM7 Cm7':[[8,'F7'],[1,'Fm7'],[1,'Bm7']],'C7':[[1,'GM7'],[1,'D7'],[6,'Cm7'],[39,'FM7'],[1,'FM7/A'],[26,'Fm7'],[1,'B7b5'],[1,'Fm7b5'],[9,'Am7'],[3,'C7#5'],[4,'Bm7'],[4,'B7'],[25,'F7'],[1,'F7#11'],[1,'F7b9'],[5,'Gm7'],[1,'F7/C'],[9,'G7'],[1,'C#7'],[4,'A7'],[1,'C#M7'],[3,'F6'],[1,'F6/A'],[1,'Fm7b5/B'],[2,'A#m6'],[1,'G#M7'],[1,'DM7']],'Cm7 Fm7':[[2,'D#m7'],[1,'G#M7'],[10,'A#7'],[3,'A#7sus4'],[6,'A#m7'],[2,'F#*7'],[2,'A#m7b5/D#'],[1,'Dm7'],[1,'Dm7b5']],'Cm7 Gm7*5':[[1,'Cm7']],'Cm7 A#m7':[[3,'Gm7'],[2,'A#m7'],[2,'G#M'],[1,'CM/A#']],'C7 FM7/A':[[1,'D7']],'C7 FM7':[[8,'Fm7'],[3,'Bm7'],[6,'Gm7'],[4,'E7'],[2,'F#m7'],[1,'Em7b5'],[7,'A#M7'],[2,'D7'],[2,'F6'],[1,'Em7'],[1,'C#+7'],[1,'Bm7b5']],'Cm7 Am7':[[1,'Em7*5'],[1,'Em7'],[1,'G#m7'],[1,'Dm7']],'Cm7*5 Fm7':[[1,'Fm7']],'CM7 CM7':[[1,'Dm7']],'Cm7 D#M7':[[1,'G#7'],[2,'Em7']],'CM9/E EM7':[[1,'Am7/E']],'Cm7 Cm7':[[1,'Fm7'],[3,'Dm7'],[1,'D7b9']],'CM7 F7':[[1,'CM7']],'C7b9':[[3,'FM7'],[1,'C7#5'],[1,'F9sus4'],[4,'Fm7'],[1,'Dm7b5/C'],[1,'A#m6']],'C7 GM7':[[1,'G7']],'C7 Am7':[[7,'Dm7'],[2,'D7']],'C7 D7':[[1,'Dm7']],'Cm7 F#9':[[1,'F7']],'CM7 C7':[[1,'D7']],'CM7 Dm7':[[10,'G7'],[2,'Em7']],'C7 Cm7':[[1,'A#m7'],[1,'Cm7b5/F#'],[4,'F7']],'Cm7 C#M7':[[4,'Cm7']],'Cm7 Bm7':[[1,'G7*5'],[1,'A#*7']],'Cm7 G#7*5':[[1,'C#m7']],'C*7':[[1,'E9/B'],[3,'Bm7'],[1,'G#m7'],[1,'F#M7']],'CM':[[4,'A#M'],[4,'DM'],[4,'Dm7'],[1,'Bm7b5']],'CM7/E A7':[[1,'Dm7']],'C7b5':[[1,'Bm7'],[1,'B7sus4']],'Cm7 Dm7':[[4,'D#M7'],[2,'G7b9']],'CM7 Bm7':[[4,'Am7'],[1,'E7'],[1,'Gm7']],'C7b9 FM7':[[2,'Gm7'],[1,'FM7']],'Cm7 A#M':[[4,'G#M']],'CM A#M':[[4,'CM']],'C9 B7':[[1,'F#m7']],'CM DM':[[4,'Em7']],'C7b9 Dm7b5/C':[[1,'C7b9']],'CM Dm7':[[2,'CM'],[1,'Dm7']],'CM7/E':[[1,'A7'],[1,'FM7#11']],'C7#5 A#m7':[[1,'D#m7']],'Cm7 F7':[[33,'A#M7'],[1,'A#M7/D'],[1,'A#m7b5'],[7,'Dm7'],[2,'F7#5'],[5,'A#m7'],[1,'A#7b9'],[7,'A#7'],[1,'D7'],[2,'Fm7'],[3,'A#6'],[1,'D#m6'],[1,'C#M7'],[1,'GM7']],'CM7 B7':[[1,'A#7b5'],[1,'Em7b5/A#'],[1,'E7'],[1,'A#7']],'C7#9/G':[[1,'B7#9/F#'],[1,'C7b9']],'CM7 F#m7':[[3,'B7b9']],'Cm7 F7b9':[[3,'A#M7'],[2,'A#m7']],'CM7#11':[[1,'Dm7']],'C7 Fm7':[[11,'A#7'],[2,'C7#9'],[1,'A#7sus4'],[2,'A#m7'],[3,'B7'],[3,'C7'],[1,'B9'],[1,'Fm7b5/B'],[1,'G7'],[1,'G#6']],'C7#9':[[4,'F7#5'],[4,'Fm7']],'C7#5':[[5,'Fm7'],[1,'A#m7'],[2,'FM7'],[1,'C7'],[1,'Fm7b5/B']],'Cm7b5':[[1,'Fm7'],[4,'F7b9'],[8,'F7'],[2,'B7']],'C9/G':[[1,'C7#9/G']],'Cm7 D7#9':[[4,'G7#5']],'Cm7 Gm7b5':[[1,'Cm7']],'C7#9 F7#5':[[4,'A#m7']],'CM7 Em7':[[1,'Bm7b5'],[1,'Em7'],[1,'A7']],'C7#5 Fm7':[[2,'G7#9'],[2,'C#M7'],[1,'D#m7']],'C*7 E9/B':[[1,'E7#9/B']],'Cm F7':[[1,'A#M7']],'Cm7 G#M7':[[2,'Cm7']],'Cm7b5 Fm7':[[1,'G7#9']],'Cm7 D7b9':[[1,'D7#5']],'C7b9 C7#5':[[1,'A#m7']],'C7sus4 G#M/C':[[1,'G7b9sus4']],'Cm7 B*7':[[1,'D#9/A#'],[1,'A#m7']],'C7 B7b5':[[1,'A#m7']],'Cm7 G7#9':[[4,'Cm7']],'C7b5 Bm7':[[1,'A#*7']],'C7sus4 Cm7':[[1,'F7']],'C9/G C7#9/G':[[1,'B7#9/F#']],'C*7 F#M7':[[1,'F7#5']],'C7#9/G C7b9':[[1,'F9sus4']],'C7b9 F9sus4':[[1,'A#m7']],'C6':[[2,'D7'],[1,'F#m7'],[2,'E7'],[1,'Cm6'],[2,'Dm7']],'C7sus4':[[1,'FM'],[2,'FM7'],[1,'Am7'],[1,'Cm7'],[1,'Bm7b5'],[1,'Fm7/C'],[1,'DM/C'],[1,'G#M/C'],[1,'G#M/A#'],[1,'BM7'],[1,'A#M7'],[1,'D#7sus4']],'C7#9 Fm7':[[2,'F7'],[2,'G#M7']],'Cm7 C7':[[2,'Fm7']],'C7b9 Fm7':[[1,'C7#9'],[3,'A#7']],'CM7 C#m7':[[4,'F#7']],'CM7 Bm7b5':[[1,'E7b9']],'Cm7b5 F7b9':[[2,'A#m7'],[1,'D#m6']],'Cm7/G':[[1,'G7sus4'],[1,'C#M7/F']],'C7 Fm7b5':[[1,'A#7']],'Cm7b5 F7':[[5,'A#m7'],[1,'A#6/D'],[1,'D#m6'],[1,'A#M7']],'CM7 Fm7/C':[[1,'C7sus4']],'Cm7 F7sus4':[[1,'A#M'],[2,'A#M7'],[1,'Em7b5'],[1,'GM/F'],[1,'D#M7'],[1,'G#7sus4']],'C7sus4 FM':[[1,'Em7b5']],'CM Bm7b5':[[1,'E7b9']],'Cm7b5/F':[[2,'F7sus4']],'C6 Cm6':[[1,'Bm7']],'C7#11':[[1,'Cm7']],'C7 C#7':[[1,'C7']],'Cm7b5/A#':[[1,'A#7b9']],'C7b9sus4 G#M9/C':[[1,'C7b9sus4'],[1,'CM7'],[1,'Cma7']],'CM7 Am7':[[3,'Dm7']],'C7sus4 FM7':[[2,'Gm7']],'Cm7 C#*7':[[2,'Cm7'],[1,'Am7']],'C*7 Bm7':[[3,'E7']],'C7 C7#5':[[2,'FM7'],[1,'C7']],'C7#5 FM7':[[2,'Dm7']],'C*7 G#m7':[[1,'C#m7']],'Cm7 Fm7b5/A#':[[2,'A#7sus4']],'C7sus4 BM7':[[1,'D7#5']],'Cm7b5/F F7sus4':[[1,'Dm7'],[1,'Fm7']],'C7sus4 Am7':[[1,'D7']],'C7sus4 Bm7b5':[[1,'A#7']],'Cm7b5 B7':[[1,'A#m7'],[1,'A#7']],'C7 Bm7':[[1,'Em7'],[3,'E7']],'Cm6 GM7':[[3,'Am7b5'],[1,'Bm7']],'Cm7 Am7b5':[[1,'G#7']],'C7 B7':[[2,'E7'],[1,'A#7'],[1,'Em7']],'C7 F7':[[1,'A#7#11'],[8,'A#7'],[2,'Dm7'],[2,'Cm7'],[3,'A#m7'],[6,'C7'],[1,'A#M7']],'C7 F7#11':[[1,'Fm7']],'C7#11 Cm7':[[1,'C#*7']],'C7 G7':[[1,'G#7'],[3,'E7'],[2,'D7'],[3,'C7']],'C7 F7b9':[[1,'Gm7b5/F']],'C9':[[1,'B7'],[1,'Fm7']],'CM7 FM7':[[3,'Bm7b5'],[1,'F#m7b5'],[2,'B7'],[1,'Fm7']],'CM7 F#m7b5':[[4,'B7']],'Cm7 F#7':[[3,'Fm7']],'CM7 A7':[[1,'D7'],[1,'Dm7']],'CM7 C#m7b5':[[1,'F#7b9'],[1,'F#7']],'CM7 D#7#5':[[1,'G#m7']],'Cm7 G7':[[3,'Cm7']],'C7 Gm7':[[5,'C7']],'C7/G':[[1,'G7']],'C7 F7/C':[[1,'C7']],'C7/G G7':[[1,'D7']],'Cm7b5/F#':[[4,'F7']],'CM7 C6':[[2,'D7'],[1,'F#m7']],'C6 D7':[[2,'Am7']],'C6 F#m7':[[1,'B7']],'Cm7 Cm7b5/F#':[[2,'F7']],'Cm7b5/F# F7':[[2,'Fm7'],[1,'A#M7'],[1,'A#m7']],'C7 A7':[[1,'A7#5'],[3,'Dm7']],'C7#5 C7':[[1,'C#M7']],'Cm7/G C#M7/F':[[1,'F#M7#11']],'C7 C#M7':[[1,'D*7']],'CM7 C#*7':[[1,'GM7']],'CM7 B7#5':[[1,'Em7b5/A#']],'C7#5 Fm7b5/B':[[1,'A#7']],'Cm6':[[1,'Bm7'],[4,'GM7']],'C6 E7':[[2,'A7']],'Cm7 DM/C':[[2,'Bm7']],'Cm7 D7':[[1,'Gm7']],'C7 F6':[[1,'A7'],[2,'Gm7']],'Cm7 D#6':[[1,'D#m6']],'Cm6 Bm7':[[1,'E9']],'Cm7 F9':[[1,'A#m7']],'C9 Fm7':[[1,'A#7']],'C6 Dm7':[[1,'G7']],'C6/E':[[1,'D#*']],'C*':[[1,'Bm']],'Cm':[[1,'F7']],'CM7 Dm7b5':[[1,'G7b9'],[2,'G7']],'C* Bm':[[1,'E7']],'C7b9 A#m6':[[1,'FM7']],'CM/A# Am7':[[2,'D7sus4']],'C7 F6/A':[[1,'G#*']],'C6/E D#*':[[1,'Dm']],'C7 Fm7b5/B':[[1,'A#7']],'C7 A#m6':[[2,'FM7']],'C7 G#M7':[[1,'Am7b5']],'C+7':[[1,'Fm7']],'CM7 F#7':[[2,'BM7']],'CM7 G#+7':[[1,'C#m7']],'C+7 Fm7':[[1,'A#m7']],'C7 DM7':[[1,'E7']],'CM7 D7':[[1,'Dm7']],'C7b9sus4':[[3,'G#M9/C']],'CM9/E':[[1,'E7b9sus4'],[1,'EM7'],[1,'Ema7']],'CM/A#':[[2,'Am7'],[1,'A#7sus4']],'CM/E':[[1,'B7b9sus4']],'Cma7':[[1,'C7sus4']],'CM/D':[[1,'C#7b5']],'CM9/E E7b9sus4':[[1,'CM9/E']],'Cm7/G G7sus4':[[1,'Cm7/G']],'C7sus4 Fm7/C':[[1,'F#M7/A#']],'CM7/E FM7#11':[[1,'Gm7']],'CM7#11 Dm7':[[1,'EM/D']],'C7sus4 DM/C':[[1,'C7sus4']],'CM/A# A#7sus4':[[1,'F#M/A#']],'CM/E B7b9sus4':[[1,'GM9/B']],'CM9/E Ema7':[[1,'E7sus4']],'Cma7 C7sus4':[[1,'G#M/A#']],'C7sus4 G#M/A#':[[1,'A7b5']],'CM/D C#7b5':[[1,'C7sus4']],'C7b5 B7sus4':[[1,'A#M7']],'C7sus4 A#M7':[[1,'Am7']],'Cm7 G#m7':[[1,'C#7sus4']]}
);
make_library("The Real Book (Simplified)", "Same as The Real Book above, but with all upper chord extensions and inversions removed (i.e. only root position triads).",
	{'CM AM':[[5,'Dm'],[1,'DM'],[1,'A+']],'Cm Am':[[2,'Em'],[1,'G#m'],[1,'Dm']],'CM':[[88,'FM'],[11,'GM'],[7,'CM'],[10,'DM'],[19,'Cm'],[39,'Fm'],[11,'Bm'],[6,'A#M'],[19,'Dm'],[4,'F#m'],[7,'AM'],[4,'F+'],[4,'Em'],[4,'C+'],[14,'BM'],[4,'C#m'],[3,'B*'],[2,'F*'],[15,'Am'],[4,'D*'],[4,'F#*'],[3,'C#*'],[5,'Gm'],[3,'C#M'],[1,'B+'],[4,'EM'],[3,'A#m'],[1,'D#*'],[6,'G#M'],[2,'F#M'],[1,'G#+'],[1,'D#+'],[1,'D#M']],'Cm':[[29,'Fm'],[8,'A#m'],[4,'Am'],[2,'Gm'],[5,'Cm'],[4,'D#M'],[3,'Bm'],[3,'G#M'],[6,'Dm'],[5,'C#M'],[4,'A#M'],[85,'FM'],[8,'DM'],[1,'G*'],[2,'B*'],[12,'GM'],[3,'CM'],[3,'C#*'],[2,'F*'],[1,'A*'],[4,'F#M'],[2,'C*'],[1,'G#m']],'CM A#M':[[4,'CM'],[1,'F#M'],[1,'Am']],'Cm A#m':[[3,'Gm'],[2,'A#m'],[2,'G#M'],[1,'CM']],'CM FM':[[8,'CM'],[10,'Fm'],[3,'Bm'],[13,'Gm'],[3,'FM'],[3,'DM'],[4,'EM'],[4,'A#m'],[2,'F#m'],[2,'E*'],[17,'A#M'],[1,'G*'],[4,'B*'],[2,'Dm'],[1,'F#*'],[2,'Cm'],[1,'AM'],[1,'G#*'],[2,'BM'],[1,'Em'],[1,'C#+']],'Cm Fm':[[2,'D#m'],[1,'Fm'],[1,'G#M'],[13,'A#M'],[6,'A#m'],[2,'F#*'],[2,'A#*'],[1,'Dm'],[1,'D*']],'CM GM':[[1,'GM'],[3,'DM'],[1,'G#M'],[3,'EM'],[3,'CM']],'Cm Gm':[[2,'Cm']],'CM CM':[[3,'DM'],[1,'Dm'],[1,'BM'],[1,'FM'],[1,'F#m']],'Cm Cm':[[1,'Fm'],[3,'Dm'],[1,'DM']],'Cm D#M':[[1,'G#M'],[2,'Em'],[1,'D#m']],'CM B+':[[1,'E*']],'CM DM':[[2,'Dm'],[4,'Em'],[2,'Am'],[1,'EM'],[1,'CM']],'Cm Dm':[[4,'D#M'],[2,'GM']],'Cm CM':[[2,'Fm'],[1,'G#M']],'CM Cm':[[1,'A#m'],[13,'FM'],[1,'C#*'],[1,'C*'],[2,'Bm'],[1,'Fm']],'CM BM':[[4,'A#M'],[1,'A#m'],[1,'BM'],[3,'EM'],[1,'F#m'],[1,'E*'],[1,'Em'],[1,'GM'],[1,'D+']],'Cm Bm':[[1,'GM'],[1,'EM'],[1,'A#*']],'CM Dm':[[2,'CM'],[1,'Dm'],[11,'GM'],[2,'Em'],[1,'EM']],'Cm DM':[[4,'G+'],[1,'D+'],[1,'Gm'],[2,'Bm']],'Cm G#M':[[1,'C#m'],[2,'Cm']],'CM C#m':[[4,'F#M']],'Cm C#M':[[4,'Cm'],[1,'F#M']],'CM Bm':[[4,'Am'],[1,'A#*'],[1,'Em'],[4,'EM'],[1,'Gm']],'Cm A#M':[[4,'G#M']],'CM Fm':[[16,'A#M'],[2,'FM'],[7,'CM'],[3,'G#M'],[2,'A#m'],[4,'BM'],[1,'F*'],[1,'GM'],[1,'F#M']],'Cm FM':[[52,'A#M'],[1,'A#*'],[8,'A#m'],[7,'Dm'],[2,'F+'],[1,'E*'],[1,'DM'],[2,'Fm'],[1,'D#m'],[1,'C#M'],[2,'GM'],[1,'D#M'],[1,'G#M']],'Cm F#M':[[3,'Fm'],[1,'FM']],'CM F#m':[[4,'BM']],'C+':[[6,'Fm'],[1,'A#m'],[2,'FM'],[1,'CM'],[1,'F*']],'C*':[[1,'Fm'],[1,'EM'],[18,'FM'],[4,'Bm'],[1,'G#m'],[2,'BM'],[1,'A#M'],[1,'F#M']],'C+ Fm':[[2,'GM'],[2,'C#M'],[1,'A#m'],[1,'D#m']],'CM F+':[[4,'A#m']],'CM Em':[[1,'B*'],[1,'Em'],[1,'AM'],[1,'EM']],'Cm G*':[[1,'Cm']],'CM C+':[[1,'A#m'],[2,'FM'],[1,'CM']],'C* Fm':[[1,'GM']],'C+ A#m':[[1,'D#m']],'Cm B*':[[1,'D#M'],[1,'A#m']],'C* EM':[[1,'EM']],'CM Gm':[[5,'CM']],'Cm GM':[[8,'Cm'],[3,'A*'],[1,'Bm']],'CM B*':[[2,'EM'],[1,'A#M']],'C* FM':[[8,'A#m'],[1,'Dm'],[3,'Fm'],[3,'A#M'],[2,'D#m']],'CM F*':[[2,'A#M']],'C+ F*':[[1,'A#M']],'CM Am':[[10,'Dm'],[5,'DM']],'C* G#m':[[1,'C#m']],'Cm C#*':[[2,'Cm'],[1,'Am']],'C* Bm':[[4,'EM']],'Cm A*':[[1,'G#M']],'C+ FM':[[2,'Dm']],'Cm F*':[[2,'A#M']],'CM D*':[[1,'CM'],[3,'GM']],'C* BM':[[1,'A#m'],[1,'A#M']],'CM F#*':[[4,'BM']],'CM C#*':[[2,'F#M'],[1,'GM']],'CM C#M':[[2,'CM'],[1,'D*']],'Cm C*':[[2,'FM']],'C* F#M':[[1,'F+']],'C+ CM':[[1,'C#M']],'CM EM':[[2,'AM'],[1,'CM'],[1,'Am']],'CM A#m':[[3,'FM']],'CM D#*':[[1,'Dm']],'CM G#M':[[1,'A*'],[2,'CM'],[1,'GM'],[1,'Cm'],[1,'AM']],'CM F#M':[[2,'BM']],'CM G#+':[[1,'C#m']],'CM D#+':[[1,'G#m']],'Cm G#m':[[1,'C#M']]}
);

function make_library(name, description, knowledge, needs_processing = false) {
	let lib = {weight: 0, name: name, description: description, color: color_counter, knowledge: {}};
	color_counter = (color_counter+1)%12;
	if (needs_processing) {
		//find separators and process chord lists
		let sequence = knowledge.split(" ").filter(x=>{return x;});
		let subseq = [];
		for (chord of sequence) {
			if (chord.startsWith("/")) {
				process_chord_list(lib, subseq);
				subseq = [];
			} else {
				subseq.push(chord);
			}
		}
		process_chord_list(lib, subseq);
		//console.log(JSON.stringify(lib.knowledge));
	} else {
		lib.knowledge = knowledge;
	}
	fix_library(lib); //normalize continuation weights, find max_context
	if (libraries.length == 0) lib.weight = 100;
	libraries.push(lib);
}

function process_chord_list(lib, chord_list, max_context = 2, simplify = false) {
	if (chord_list.length <= 1) return;
	for (let context_size = 1; context_size <= max_context; context_size++) {
		for (let i = context_size; i < chord_list.length; i++) { //i is chord of focus (destination)
			let offset = clean_and_transpose(chord_list[i - context_size], 0, true);
			let chord_history = [];
			for (let j = i - context_size; j < i; j++) chord_history.push(clean_and_transpose(chord_list[j], 12-offset));
			chord_history = chord_history.join(" ");
			let destination = clean_and_transpose(chord_list[i], 12-offset);
			//record motion chord_history into lib
			let context_exists = Object.keys(lib.knowledge).includes(chord_history); //if context entry already exists
			if (context_exists) {
				let context_rule = lib.knowledge[chord_history];
				let entry_exists = false;
				for (cont of context_rule) {
					if (cont[1] == destination) {
						cont[0]++;
						entry_exists = true;
					}
				}
				if (!entry_exists) context_rule.push([1, destination]);
			} else {
				lib.knowledge[chord_history] = [[1,destination]];
			}
		}
	}
}

//set sum of each transition rule's continuations to be 1.0 within this library
//also determine the max context for this library. and also count recorded motions
function fix_library(lib) {
	let max_context = 0;
	let motion_count = 0;
	for (rule of Object.keys(lib.knowledge)) {
		let list = lib.knowledge[rule];
		let sum = 0;
		for (ex of list) {
			sum += ex[0];
			motion_count++;
		}
		if (sum == 0) continue;
		for (ex of list) {
			ex[0] /= sum;
		}
		max_context = Math.max(max_context, rule.split(" ").length);
	}
	lib.max_context = max_context;
	lib.motion_count = motion_count;
}

//everything here + below is for constructing knowledge from library knowledge

let knowledge = {}; //the copy of knowledge used. composed from the knowledge of several libraries
let knowledge_max_context = 0;

//builds the knowledge to be used from libraries
function build_knowledge() {
	//build knowledge from libraries
	knowledge = {};
	knowledge_max_context = 0;
	for (let i = 0; i < libraries.length; i++) {
		let lib = libraries[i];
		if (lib.weight > 0) {
			add_knowledge(lib.knowledge, lib.weight);
			knowledge_max_context = (knowledge_max_context==0) ? lib.max_context : Math.min(lib.max_context, knowledge_max_context);
		}
	}
	//sort all knowledge rules
	for (rule of Object.keys(knowledge)) {
		knowledge[rule].sort((a, b) => (a[0] < b[0]) ? 1 : -1)
	}
	//also rerun the finder
	find_continuations(true);
}

//the variables here are named horribly. dont look at them
function add_knowledge(k, weight) {
	for (key of Object.keys(k)) { //for each entry in the knowledge
		if (!Object.keys(knowledge).includes(key)) { //make sure entry key exists
			knowledge[key] = [];
		}
		let rule = knowledge[key];
		for (continuation of k[key]) {
			//continuation[0] is count, continuation[1] is new chord name. must find it in rule
			let found = false;
			for (possible_continuation of rule) {
				if (possible_continuation[1] == continuation[1]) {
					possible_continuation[0] += continuation[0] * weight;
					found = true;
				}
			}
			if (!found) {
				rule.push([continuation[0]*weight, continuation[1]]);
			}
		}
	}
}

//make libraries list and their ui interactions (they update active/weight and call for build_knowledge)
generate_libraries_ui();
function generate_libraries_ui() {
	document.getElementById("library_container").innerHTML = "";
	for (let i = 0; i < libraries.length; i++) {
		let lib = libraries[i];
		let html = '<div class="library" root="'+lib.color+'">';
		html += '<p><b>'+lib.name+'</b><a>'+lib.motion_count+' motion'+(lib.motion_count==1?'':'s')+'</a></p>';
		html += '<p>'+lib.description+'</p>';
		html += '<span id="library_label_'+i+'" class="library_contribution"></span>';
		html += '<input type="range" min="0" max="100" value="'+lib.weight+'" id="library_slider_'+i+'" oninput="library_slider_change('+i+')" onchange="build_knowledge()">';
		html += '</div>';
		document.getElementById("library_container").innerHTML += html;
		library_slider_change(i);
	}
}

function library_slider_change(i) {
	libraries[i].weight = document.getElementById("library_slider_"+i).value;
	document.getElementById("library_label_"+i).innerText = libraries[i].weight>0 ? libraries[i].weight+'%' : "no influence";
	document.getElementById("library_label_"+i).style.color = libraries[i].weight>0 ? 'var(--accent)' : 'var(--medium)';
}


//stuff for the user library form
document.getElementById("user_library_name").value = "";
document.getElementById("user_library_description").value = "";
document.getElementById("user_library_chords").value = "";
function make_user_library() {
	let name = document.getElementById("user_library_name").value.trim();
	if (name == "") name = "Untitled library";
	let description = document.getElementById("user_library_description").value.trim();
	let chords = document.getElementById("user_library_chords").value.split("\n").join(" ").split("\t").join(" ").trim();
	make_library(name, description, chords, true);
	for (let i = 0; i < libraries.length; i++) libraries[i].weight = i==libraries.length-1 ? 100 : 0;
	generate_libraries_ui();
	document.getElementById("user_library_name").value = "";
	document.getElementById("user_library_description").value = "";
	document.getElementById("user_library_chords").value = "";
	build_knowledge();
}