
//  <script src="https://cdn.jsdelivr.net/npm/vexflow@4.2.3/build/cjs/vexflow.js"></script>



let weights = {
	equalSpacing: 20,
	spacing: -100,
	travelPunishment: -500,
	tooLowOrHighPunishment: -20000,
	perfectMotionPunishment: -500
};
const { Renderer, Stave, Voice, StaveNote, Formatter, Accidental, Annotation } = Vex.Flow;

let myInterval = null;
// Create an SVG renderer and attach it to the DIV element named "boo".
let currentAccidentals = {}; //stores state of "C/4" "D/4" every note: 0, 1, 2, -1, -2
function displayChords(chordAnalyses) {
	if (typeof chordAnalyses == "string") chordAnalyses = chordAnalyses.split(" ").filter(x => x.length).map(x => chordAnalysis(x));
	
	let [bestScore, bestNotes] = [Number.NEGATIVE_INFINITY, null];
	if (myInterval) clearInterval(myInterval);
	myInterval = setInterval(makeAttempt, 1);
	let startTime = Date.now();
	let attempts = 0;
	function makeAttempt() {
		let staveNotes = [];
		let previousVoicingChoice = null;
		let totalScore = 0;
		currentAccidentals = {};
		[previousVoicingChoice, staveNotes[0]] = chordToStaveNote(chordAnalyses[0], previousVoicingChoice);
		for (let i = 1; i < chordAnalyses.length; i++) {
			[previousVoicingChoice, staveNotes[i]] = chordToStaveNote(chordAnalyses[i], previousVoicingChoice);
			totalScore += previousVoicingChoice.score;
		}
		attempts++;
		if (totalScore > bestScore) {
			bestScore = totalScore;
			bestNotes = staveNotes;
			renderChords(bestNotes, chordAnalyses);
			console.log("new best", bestScore, Date.now()-startTime, attempts);
		}
	}
}

//displayChords("Cmaj7 B7 Em7 Ebm7 Dm7 G7 Cmaj7");

function renderChords(notes, chordAnalyses) {
	while (output.firstChild) output.firstChild.remove();
	const renderer = new Renderer(output, Renderer.Backends.SVG);
	
	let availableWidth = 40 + 70 * notes.length;

	// Configure the rendering context.
	renderer.resize(availableWidth+1, 500);
	const context = renderer.getContext();
	context.setFillStyle('white');
	context.setStrokeStyle('white');
	
	const stave = new Stave(0, 40, availableWidth).addClef("treble");
	const stave2 = new Stave(0, 110, availableWidth).addClef("bass");
	stave.setContext(context).draw();
	stave2.setContext(context).draw();
	
	let trebleNotes = notes;
	let bassNotes = chordAnalyses.map(function(chord){
		let keyDiatonic = chord.bassName.replaceAll("b","").replaceAll("#", "")+"/3";
		let staveNote = new StaveNote({keys: [keyDiatonic], duration: "q", clef: "bass", stem_direction: -1});
		let neededAccidental = "n";
		for (let a of acc) if (chord.bassName.includes(a)) {
			neededAccidental = a;
			break;
		}
		if (!currentAccidentals[keyDiatonic]) currentAccidentals[keyDiatonic] = "n";
		if (currentAccidentals[keyDiatonic] != neededAccidental) {
			staveNote.addModifier(new Accidental(neededAccidental));
			currentAccidentals[keyDiatonic] = neededAccidental;
		}
		return staveNote;
	});
	let textNotes = chordAnalyses.map(chord => chord.ogText);
	
	let trebleVoice = new Vex.Flow.Voice({
		num_beats: notes.length, beat_value: 4, resolution: Vex.Flow.RESOLUTION
	});
	let bassVoice = new Vex.Flow.Voice({
		num_beats: notes.length, beat_value: 4, resolution: Vex.Flow.RESOLUTION
	});
	for (let trebleNote of trebleNotes) trebleVoice.addTickable(trebleNote);
	for (let bassNote of bassNotes) bassVoice.addTickable(bassNote);
	//trebleVoice.addTickable(trebleNotes[0]);
	//trebleVoice.addTickables([trebleNotes]);
	//bassVoice.addTickables([bassNotes]);
	
	let formatter = new Formatter();
	formatter.joinVoices([trebleVoice, bassVoice]);
	
	formatter.formatToStave([trebleVoice, bassVoice], stave, {align_rests: true});
	
	trebleVoice.draw(context, stave);
	bassVoice.draw(context, stave2);
	
	//Formatter.FormatAndDraw(context, stave, notes);
	//Formatter.FormatAndDraw(context, stave2, bassNotes);
	
}


let acc = ["bb", "b", "##", '#'];
function chordToStaveNote(analysis, previousVoicingChoice) { //given chord analysis, we return our favorite voicing. as {noteNames, noteNumbers, score} and also as StaveNote
	let allVoicingChoices = allPossibleVoicings(analysis);
	evaluateVoicingChoices(allVoicingChoices, previousVoicingChoice);
	let voicingChoice = allVoicingChoices[Math.floor(Math.random()*4)];
	let keysDiatonic = voicingChoice.noteNames.map(x => x.replaceAll("b", "").replaceAll("#", ""));
	let staveNote = new StaveNote({keys: keysDiatonic, duration: "q", stem_direction: 1});
	for (let i = 0; i < voicingChoice.noteNames.length; i++) {
		let neededAccidental = "n";
		for (let a of acc) if (voicingChoice.noteNames[i].includes(a)) {
			neededAccidental = a;
			break;
		}
		if (!currentAccidentals[keysDiatonic[i]]) currentAccidentals[keysDiatonic[i]] = "n";
		if (currentAccidentals[keysDiatonic[i]] != neededAccidental) {
			staveNote.addModifier(new Accidental(neededAccidental), i);
			currentAccidentals[keysDiatonic[i]] = neededAccidental;
		}
	}
	staveNote.addModifier(new Annotation(analysis.ogText));
	return [voicingChoice, staveNote];
}

function evaluateVoicingChoices(allVoicingChoices, previousVoicingChoice) {
	//allVoicingChoices looks like list of {noteNames, noteNumbers, score}s. previousVoicingChoice is one from the previous, which was successful
	shuffle(allVoicingChoices);
	for (let voicingChoice of allVoicingChoices) {
		let nums = voicingChoice.noteNumbers; //set voicingChoice.score depending on how good this is
		voicingChoice.score = inherentGoodness(nums);
		if (previousVoicingChoice) voicingChoice.score += transitionGoodness(previousVoicingChoice.noteNumbers, nums);
	}
	allVoicingChoices.sort((a, b) => b.score - a.score);
	function transitionGoodness(prev, nums) {
		let travelPunishment = 0;
		if (prev.length != nums.length) for (let item of prev) travelPunishment += weights.travelPunishment * nums.map(x => Math.abs(x-item)).reduce((a,b)=>Math.min(a,b),1000);
		else travelPunishment += weights.travelPunishment * nums.map((v,i,a) => Math.abs(nums[i] - prev[i])).reduce((a,b)=>a+b,0);
		
		let perfectMotionPunishment = 0;
		for (let i = 0; i < prev.length; i++) for (let j = 0; j < prev.length; j++) if ([0,5,7].includes((prev[j]-prev[i])%12)) {
			//weve got a fifth/fourth/octave. lets hope it does not move paralelly
			if (nums[j] - nums[i] == prev[j] - prev[i] && nums[i] != prev[i]) { //omg we MOVED. and maintained same 0,5,7 interval
				perfectMotionPunishment += weights.perfectMotionPunishment;
			}
		}
		
		return travelPunishment + perfectMotionPunishment;
	}
	function inherentGoodness(nums) {
		let equalSpacing           = weights.equalSpacing           * -range(nums.map((v,i,a) => i ? a[i]-a[i-1] : 0));
		let spacing                = weights.spacing                * nums[nums.length-1]-nums[0];
		let tooLowOrHighPunishment = weights.tooLowOrHighPunishment * nums.map(x => x<9?9-x:(x>15?x-15:0)).reduce((a,b)=>a+b,0);
		return equalSpacing + spacing + tooLowOrHighPunishment;
	}
}

function allPossibleVoicings(chordAnalysis, previousChordVoicingChoice) {
	//turns {C7} into [['C/4', 'E/4', 'G/5', 'Bb/4'], ]... every chord member gets put in either octave 4 or 5
	let possibles = [[]];
	for (let name of chordAnalysis.memberNames) {
		let chooseLower = possibles.map(x => [...x, name+"/4"]);
		let chooseUpper = possibles.map(x => [...x, name+"/5"]);
		possibles = chooseLower.concat(chooseUpper);
	}
	possibles = possibles.map(noteSet => ({
		noteNames: noteSet, //C/4, E/4, G/5, B/4
		score: 0,
		noteNumbers: noteSet.map(name => {
			let pitch = noteNames.indexOf(name.charAt(0));
			name = name.substring(1);
			while (name.startsWith("#")) {name = name.substring(1); pitch++;}
			while (name.startsWith("b")) {name = name.substring(1); pitch--;}
			pitch = (12+pitch)%12;
			pitch += (parseInt(name.substring(1))-4)*12;
			return pitch;
		}).sort((a,b)=>a-b)
	}));
	return possibles;
}

function transitionQuality(noteNumbers1, noteNumbers2) {
	//evaluate the quality of this transition, + the general Goodness of that second voicing
}

function stdev(t){let e=t.length,a=t.reduce((t,e)=>t+e)/e;return Math.sqrt(t.map(t=>Math.pow(t-a,2)).reduce((t,e)=>t+e)/e)}
function range(t){return t.reduce((a,b)=>Math.max(a,b),t[0]) - t.reduce((a,b)=>Math.min(a,b),t[0])}
function shuffle(f){let o=f.length;for(;0!=o;){var t=Math.floor(Math.random()*o);o--,[f[o],f[t]]=[f[t],f[o]]}}