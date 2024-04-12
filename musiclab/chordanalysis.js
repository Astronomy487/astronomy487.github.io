let noteNames = "C C# D D# E F F# G G# A A# B".split(" ");
let noteNamesDiatonic = "C D E F G A B".split(" ");

function chordStackAnalysis(text) {
	text = text.trim().split("/").map(x => x.trim()).filter(x => x.length);
	text[0] = chordAnalysis(text[0], false);
	for (let i = 1; i < text.length; i++) {
		let num = parseInt(text[i]);
		if (num==text[i] && text[0].qualitySet[num] != undefined) {
			//ok this slash is a NUMBER bass thing. and it's even in the quality set! find what note this is.
			let diatonicBasis = noteNamesDiatonic[(noteNamesDiatonic.indexOf(text[0].rootName.charAt(0))-1+num)%7]; //diatonic name of our special bass
			let diatonicBasisInteger = noteNames.indexOf(diatonicBasis);
			let targetPitchInteger = (text[0].qualitySet[num] + text[0].root)%12;
			text[i] = chordAnalysis(diatonicBasis + numberToAccidentals(targetPitchInteger - diatonicBasisInteger), true);
		} else text[i] = chordAnalysis(text[i], true);
	}
	return text;
}

function chordAnalysis(text, lowerChord = false) {
	let ogText = text;
	text = text.trim();
	text = text.replaceAll("♯", "#").replaceAll("♭", "b");
	//find root
	let rootName = text.charAt(0).toUpperCase();
	let root = noteNames.indexOf(rootName);
	if (root == -1) return;
	text = text.substring(1);
	while (text.startsWith("#")) {
		root = (root+1)%12;
		text = text.substring(1);
		rootName += "#";
	}
	while (text.startsWith("b")) {
		root = (root+11)%12;
		text = text.substring(1);
		rootName += "b";
	}
	//find quality (i.e. scale from which notes are pulled)
	let qualityName = lowerChord ? "unison" : "dominant"; //default quality. depends on if this is lower chord
	findQualityNameLoop:
	for (let [indicators, indicatedQuality] of [
		[["minormajor", "minmaj", "mM", "m/M", "m(M"], "minormajor"],
		[["major", "maj", "M"], "major"],
		[["minor", "min", "m", "-"], "minor"],
		[["dom"], "dominant"],
		[["+", "aug"], "augmented"],
		[["dim", "°", "*"], "diminished"],
		[["ø"], "halfdiminished"],
		[["unison"], "unison"],
	]) {
		for (let indicator of indicators) if (text.startsWith(indicator)) {
			qualityName = indicatedQuality;
			text = text.substring(indicator.length);
			break findQualityNameLoop;
		}
	}
	let scaleOfChoice = {
		major: [0, 2, 4, 5, 7, 9, 11],
		dominant: [0, 2, 4, 5, 7, 9, 10],
		minor: [0, 2, 3, 5, 7, 9, 10],
		minormajor: [0, 2, 3, 5, 7, 9, 11],
		augmented: [0, 2, 4, 5, 8, 9, 10],
		diminished: [0, 2, 3, 5, 6, 8, 9],
		halfdiminished: [0, 2, 3, 5, 6, 8, 10],
		unison: [0, 0, 0, 0, 0, 0, 0], //goofy : correct the quality set before we leave
	}[qualityName];
	//read chord for member indeces (ie 7ths 9ths 11ths 13ths) and add the Pitch numbers
	let qualitySet = {};
	qualitySet[1] = scaleOfChoice[0];
	qualitySet[3] = scaleOfChoice[2];
	qualitySet[5] = scaleOfChoice[4];
	let anyUpperYet = false; //turns true once any extension (including 7th). odd fills 7-9-11-13 to meet a high odd extension only runs if this is still false
	for (let it = 0; it < 10; it++) {
		while (text.startsWith("(")) text = text.substring(1);
		if (!text.length) break;
		//identify comments (no5, sus4) before the number itself
		let comment = "";
		for (let possibleComment of ["add", "no", "sus"]) if (text.startsWith(possibleComment)) {
			comment = possibleComment;
			text = text.substring(possibleComment.length);
		}
		//find accidentals on the extension
		let alteration = 0;
		while (text.startsWith("b")) {
			alteration--;
			text = text.substring(1);
		}
		while (text.startsWith("#")) {
			alteration++;
			text = text.substring(1);
		}
		//find the number for the extension
		let num = parseInt(text);
		if (!(num >= 0)) throw new Error("Cannot read '"+text+"'"); //give up
		if (num > 13) num = parseInt(text.charAt(0));
		text = text.substring(num.toString().length);
		//fill 7-9-11-13
		if (!anyUpperYet && comment != "add" && num%2 && num > 7 && num <= 13) for (let fill = 7; fill < num; fill += 2)
			if (!qualitySet[fill]) qualitySet[fill] = scaleOfChoice[(fill-1)%7];
		//remove 3rd for X5 chord
		if (num == 5 && alteration == 0 && comment != "no") delete qualitySet[3];
		qualitySet[num] = (scaleOfChoice[(num-1)%7]+alteration)%12;
		if (comment == "sus") delete qualitySet[3];
		if (comment == "no") delete qualitySet[num];
		while (text.startsWith(")")) text = text.substring(1);
		anyUpperYet = true;
	}
	if (text.length) return;
	if (qualityName == "unison") {
		qualitySet = {1: 0};
	}
	if (qualityName == "dominant" && qualitySet[7] == undefined) qualityName = "major";
	//a VERY CRUDE filter for unique pitches
	for (let i = 0; i < 16; i++) if (qualitySet[i] != undefined) for (let j = i+1; j < 16; j++) if (qualitySet[j] == qualitySet[i]) delete qualitySet[j];
	return {
		root: root,
		qualitySet: qualitySet,
		rootName: rootName,
		memberNames: rootAndQualitySetToMembers(root, qualitySet, rootName),
		text: rootName + qualityTextFromQualitySet(qualitySet, lowerChord),
		lowerChord: lowerChord,
		qualityName: qualityName
	};
}

let expectedPitches = {1: 0, 3: 4, 5: 7, 7: 10, 2: 2, 4: 5, 6: 9}
function qualityTextFromQualitySet(qualitySet, lowerChord = false) {
	qualitySet = copyQualitySet(qualitySet);
	let comments = [];
	delete qualitySet[1];
	if (!Object.keys(qualitySet).length) { //if it's literally just the root, this is a unison chord. good night
		return "";
	}
	let alterationsRequired = {};
	for (let interval of Object.keys(qualitySet)) {
		alterationsRequired[interval] = qualitySet[interval] - expectedPitches[(interval-1)%7+1];
		alterationsRequired[interval] = (alterationsRequired[interval]%12+12)%12; if (alterationsRequired[interval] > 6) alterationsRequired[interval] -= 12;
	}
	let extent = 1;
	//use alterations needed for 3, 5, 7 to determine the primary quality
	let primaryQuality = "";
	if (alterationsRequired[3] == -1) primaryQuality = "m";
	if (alterationsRequired[7] == 1) primaryQuality += "M";
	//identify special case qualities
	let specialPrimaryQualityUsed = false;
	if (alterationsRequired[5] == -1 && (alterationsRequired[7] == -1 || alterationsRequired[7] == undefined) && alterationsRequired[3] == -1) {
		primaryQuality = "°"; //dim is shortcut for m7b5
		specialPrimaryQualityUsed = true;
	}
	if (alterationsRequired[5] == 1 && alterationsRequired[3] == 0) {
		primaryQuality = "+"; //aug is shortcut
		specialPrimaryQualityUsed = true;
	}
	if (lowerChord && !primaryQuality.length) primaryQuality = "M";
	comments.push(primaryQuality);
	//find how high the chord extends
	let canDeleteThisExtension = false;
	for (extent = 5; extent <= 13; extent += 2) {
		if (canDeleteThisExtension) delete qualitySet[extent];
		canDeleteThisExtension = true;
		//let's think about how we need to handle extent+2
		if (extent >= 7 && alterationsRequired[extent+2] != 0) { //if at/past 7th and next one needs alterations, stop probably
			if (alterationsRequired[extent+4] == undefined) break; //if we really stop here, just stop adding on
			else canDeleteThisExtension = false; //if la vie continue, just remember to mark this funky alteration in the later pass
		}
		if (!qualitySet[extent+2]) break; //ok seriously The next one doesnt exist. theres no hope
		if (extent == 5 && (alterationsRequired[7]<0||alterationsRequired[7]>1)) canDeleteThisExtension = false; //hacky thing to mention REALLY WEIRD sevenths
	}
	if (extent>5) delete qualitySet[extent];
	//find how to mention the extension
	let extensionMentionedYet = false;
	if (extent > 7) comments.push(numberToAccidentals(alterationsRequired[extent]) + extent + "");
	if (extent == 7 && alterationsRequired[7] >= 0) comments.push("7");
	else if (extent == 7 && specialPrimaryQualityUsed) comments.push("7"); //if we could use shortcut, don't mention 7th alteration
	else if (extent == 7 && !specialPrimaryQualityUsed) comments.push(numberToAccidentals(alterationsRequired[7]) + 7)
	//mention a funky fifth, if we haven't already
	if (alterationsRequired[5] != undefined && alterationsRequired[5] != 0 && !specialPrimaryQualityUsed)
		comments.push(numberToAccidentals(alterationsRequired[5]) + 5);
	//handle sus things
	if (!qualitySet[5]) {
		comments.push("no5");
	}
	if (!qualitySet[3]) {
		if (qualitySet[2]) {
			comments.push("sus" + numberToAccidentals(alterationsRequired[2]) + 2);
			delete qualitySet[2];
		}
		else if (qualitySet[4]) {
			comments.push("sus" + numberToAccidentals(alterationsRequired[4]) + 4);
			delete qualitySet[4];
		}
		else comments.push("5");
	}
	delete qualitySet[3];
	delete qualitySet[5];
	//name anything we have left
	for (let remainingInterval of Object.keys(qualitySet).map(x => parseInt(x)).sort((a,b)=>a-b)) {
		delete qualitySet[remainingInterval];
		let makeComment = "";
		if (remainingInterval%2 && !extensionMentionedYet && alterationsRequired[remainingInterval-2] == undefined) makeComment += "add";
		makeComment += numberToAccidentals(alterationsRequired[remainingInterval]);
		makeComment += remainingInterval;
		comments.push(makeComment);
		extensionMentionedYet = true;
	}
	//bundle comments and return
	let needProtectionFromAccidental = true;
	let commentsTogether = "";
	for (let comment of comments) if (comment.length) {
		if ((comment.startsWith("#") || comment.startsWith("b")) && needProtectionFromAccidental)
			commentsTogether += "(" + comment + ")";
		else
			commentsTogether += comment;
		if (noteNames.includes(comment.charAt(comment.length-1))) needProtectionFromAccidental = true;
		else needProtectionFromAccidental = false;
	}
	return commentsTogether;
}

function copyQualitySet(qualitySet) {
	let x = {};
	for (let key of Object.keys(qualitySet)) x[key] = qualitySet[key];
	return x;
}

function numberToAccidentals(n, requestNaturals = false) {
	if (n == 0 && requestNaturals) return "n";
	return "#".repeat(Math.max(0, n)) + "b".repeat(Math.max(0, -n));
}

function rootAndQualitySetToMembers(root, qualitySet, rootName) {
	let memberNames = [rootName];
	let rootDiatonicIndex = noteNamesDiatonic.indexOf(rootName.charAt(0));
	for (let stackNumber of Object.keys(qualitySet).map(x => parseInt(x)).sort((a,b)=>a-b)) if (stackNumber != 1) {
		let diatonicIndex = (rootDiatonicIndex+stackNumber-1)%7;
		let noteName = noteNamesDiatonic[diatonicIndex]; //the note's letter name, no accidentals yet
		let neededAccidental = qualitySet[stackNumber]+root - noteNames.indexOf(noteNamesDiatonic[diatonicIndex]);
		neededAccidental = (neededAccidental+12)%12;
		if (neededAccidental > 6) neededAccidental -= 12;
		while (neededAccidental > 0) {noteName += "#"; neededAccidental--;}
		while (neededAccidental < 0) {noteName += "b"; neededAccidental++;}
		memberNames.push(noteName);
	}
	return memberNames;
}

function qualitySetToIntervalNames(qualitySet) {
	let names = [];
	for (let interval of Object.keys(qualitySet).map(x => parseInt(x)).sort((a,b)=>a-b)) {
		if (qualitySet[interval] == 0) {
			names.push(interval==1 ? "unison" : "octave");
			continue;
		}
		let expectation = [0, 1.5, 3.5, 5, 7, 8.5, 10.5][(interval-1)%7]
		let difference = qualitySet[interval] - expectation; //positive = major or augmented, negative = minor or iminished
		if (difference == 0) names.push("perfect " + ordinal(interval));
		
		if (difference == 0.5) names.push("major " + ordinal(interval));
		if (difference == 1) names.push("augmented " + ordinal(interval));
		if (difference == 1.5) names.push("augmented " + ordinal(interval));
		if (difference == 2) names.push("doubly augmented " + ordinal(interval));
		
		if (difference == -0.5) names.push("minor " + ordinal(interval));
		if (difference == -1) names.push("diminished " + ordinal(interval));
		if (difference == -1.5) names.push("diminished " + ordinal(interval));
		if (difference == -2) names.push("doubly diminished " + ordinal(interval));
		//names.push("weird " + ordinal(interval));
		//if expectation is on a 0.5, then major is up and minor is down. otherwise just perfect
	}
	return names;
}

function ordinal(n) {
	n = n.toString();
	if (n > 3 && n < 21) return n + "th";
	if (n.endsWith("1")) return n + "st";
	if (n.endsWith("2")) return n + "nd";
	if (n.endsWith("3")) return n + "rd";
	return n + "th";
}