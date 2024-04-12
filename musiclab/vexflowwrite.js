const { Renderer, Stave, Voice, StaveNote, Formatter, Accidental, Annotation } = Vex.Flow;

let currentAccidentals = {}; //stores state of "C/4" "D/4" every note: 0, 1, 2, -1, -2

/*
options:
availableWidth
extraHeight
texts
includeClefs
color
*/

function renderChords(notes, outputElement, options = {}) {
	currentAccidentals = {};
	while (outputElement.firstChild) outputElement.firstChild.remove();
	const renderer = new Renderer(outputElement, Renderer.Backends.SVG);
	
	if (options.availableWidth == undefined) options.availableWidth = 40 + 50 * notes.length;
	if (options.extraHeight == undefined) options.extraHeight = 0;
	if (options.texts == undefined) options.texts = [];
	if (typeof options.texts == "string") options.texts = options.texts.split(" ");
	while (options.texts.length < notes.length) options.texts.push("");
	if (options.includeClefs == undefined) options.includeClefs = true;
	if (options.color == undefined) options.color = "black";

	// Configure the rendering context.
	renderer.resize(options.availableWidth, 180 + 2*options.extraHeight);
	const context = renderer.getContext();
	context.setFillStyle(options.color);
	context.setStrokeStyle(options.color);
	
	const stave = new Stave(0, 0 + options.extraHeight, options.availableWidth-1);
	if (options.includeClefs) stave.addClef("treble");
	const stave2 = new Stave(0, 70 + options.extraHeight, options.availableWidth-1);
	if (options.includeClefs) stave2.addClef("bass");
	stave.setContext(context).draw();
	stave2.setContext(context).draw();
	
	let trebleVoice = new Vex.Flow.Voice({
		num_beats: notes.length, beat_value: 4, resolution: Vex.Flow.RESOLUTION
	});
	let bassVoice = new Vex.Flow.Voice({
		num_beats: notes.length, beat_value: 4, resolution: Vex.Flow.RESOLUTION
	});
	
	let trebleNotes = [];
	let bassNotes = [];
	for (let j = 0; j < notes.length; j++) { //for each frame
		let bassStaveNote = staveNotFromNoteNamesAndOctaves(notes[j][0], "bass", -1);
		let trebleStaveNote = staveNotFromNoteNamesAndOctaves(notes[j][1], "treble", 1, options.texts[j]);
		function staveNotFromNoteNamesAndOctaves(voiceNotes, clef, stemDirection, text = undefined) {
			let notesDiatonic = voiceNotes.map(x => x.replaceAll("b", "").replaceAll("#", "")); //includes octave. "C/4" "E/4" "G/4"
			let staveNote = new StaveNote({keys: notesDiatonic, duration: "q", clef: clef, stem_direction: stemDirection, align_center: notes.length==1});
			for (let i = 0; i < voiceNotes.length; i++) { //find accidentals we need to do
				let accidentalsNeeded = voiceNotes[i].split("#").length - voiceNotes[i].split("b").length;
				if (!currentAccidentals[notesDiatonic[i]]) currentAccidentals[notesDiatonic[i]] = 0;
				if (currentAccidentals[notesDiatonic[i]] != accidentalsNeeded) {
					currentAccidentals[notesDiatonic[i]] = accidentalsNeeded;
					while (accidentalsNeeded >= 2) {
						staveNote.addModifier(new Accidental("##"), i);
						accidentalsNeeded -= 2;
					}
					if (accidentalsNeeded > 0) {
						staveNote.addModifier(new Accidental("#"), i);
						accidentalsNeeded--;
					}
					while (accidentalsNeeded <= -2) {
						staveNote.addModifier(new Accidental("bb"), i);
						accidentalsNeeded += 2;
					}
					if (accidentalsNeeded < 0) {
						staveNote.addModifier(new Accidental("b"), i);
						accidentalsNeeded++;
					}
				}
			}
			if (text != undefined) {
				staveNote.addModifier(new Annotation(text));
			}
			return staveNote;
		}
		trebleVoice.addTickable(trebleStaveNote);
		bassVoice.addTickable(bassStaveNote);
	}
	
	let formatter = new Formatter();
	formatter.joinVoices([trebleVoice]);
	formatter.joinVoices([bassVoice]);
	
	
	formatter.formatToStave([trebleVoice, bassVoice], stave, {align_rests: true});
	
	trebleVoice.draw(context, stave);
	bassVoice.draw(context, stave2);
	
}

function simpleVoicingFromChordStack(chordStack) { //take on chord stack, make [bassNoteList, trebleNoteList] including octaves
	chordStack = chordStack.concat();
	if (chordStack.length == 1)
		chordStack[1] = chordAnalysis(chordStack[0].rootName, true);
	let currentOctave = 4;
	let currentDiatonicPlace = -1;
	let trebleNotes = [];
	for (let memberName of chordStack[0].memberNames) {
		let newDiatonicPlace = noteNamesDiatonic.indexOf(memberName.charAt(0));
		if (newDiatonicPlace <= currentDiatonicPlace) currentOctave++;
		currentDiatonicPlace = newDiatonicPlace;
		trebleNotes.push(memberName + "/" + currentOctave);
	}
	currentOctave = parseInt(trebleNotes[0].substring(trebleNotes[0].indexOf("/")+1));
	currentDiatonicPlace = noteNamesDiatonic.indexOf(trebleNotes[0].charAt(0));
	let bassNotes = [];
	for (let memberName of chordStack[1].memberNames.concat().reverse()) {
		let newDiatonicPlace = noteNamesDiatonic.indexOf(memberName.charAt(0));
		if (newDiatonicPlace >= currentDiatonicPlace) currentOctave--;
		currentDiatonicPlace = newDiatonicPlace;
		bassNotes.push(memberName + "/" + currentOctave);
	}
	return [bassNotes, trebleNotes];
}