let englishLetters = "abcdefghijklmnopqrstuvwxyz".split("");
let englishLettersUsed = 0;

let alphabet = "".split("");

class Transition {
	constructor(letter, result) {
		this.letter = letter;
		this.result = result;
	}
}

class State {
	constructor(label = englishLetters[englishLettersUsed++]) {
		this.label = label;
		this.outgoing = [];
		this.accepting = false;
	}
	addTransition(letter = "", result = this) {
		if (letter.length && !alphabet.includes(letter)) alphabet.push(letter);
		if (this.outgoing.filter(transition => transition.letter == letter && transition.result == result).length == 0)
			this.outgoing.push(new Transition(letter, result));
	}
	makeMetastateDFA(rename = true, simplify = true) {
		let metastates = [new SetOfStates([this])]; //sets
		let metastateStates = metastates.map(x => new State(x.toString())); //normal states, with labels like '{a, b}'
		for (let i = 0; i < metastates.length; i++) {
			let metastate = metastates[i];
			for (let letter of alphabet) {
				let newMetaState = metastate.traverse(letter); //set
				let alreadyDiscovered = null;
				for (let x of metastates) if (x.toString() == newMetaState.toString()) alreadyDiscovered = metastates.indexOf(x); //alreadyDiscovered = index of this old metastate
				if (alreadyDiscovered == null) { //making it new
					alreadyDiscovered = metastates.length;
					metastates.push(newMetaState);
					metastateStates.push(new State(newMetaState.toString()));
				}
				//link time
				metastateStates[i].addTransition(letter, metastateStates[alreadyDiscovered]);
			}
			metastateStates[i].accepting = metastate.states.map(x => x.accepting).includes(true);
		}
		if (new SetOfStates([this]).findEpsilonDomain().states.filter(x => x.accepting).length) {
			//empty string is accepted by this nfa
			metastateStates[0].accepting = true;
		}
		if (simplify) metastateStates[0].makeSimplifications();
		if (rename) metastateStates[0].renameSystem();
		return metastateStates[0];
	}
	test(string) {
		let state = new SetOfStates([this]);
		for (let character of string) state = state.traverse(character);
		return state.states.map(x => x.accepting).includes(true);
	}
	renameSystem() {
		let list = this.findAnythingInSystem();
		for (let i = 0; i < list.length; i++) list[i].label = englishLetters[i];
	}
	findAnythingInSystem() {
		let list = [this];
		let listLength;
		while (listLength != list.length) {
			listLength = list.length;
			for (let state of list) list = list.concat(state.outgoing.map(x => x.result));
			list = list.filter((v, i, a) => a.indexOf(v) == i);
		}
		return list;
	}
	findAcceptingStates() {
		return this.findAnythingInSystem().filter(x => x.accepting);
	}
	makeSimplifications() {
		let list = this.findAnythingInSystem();
		for (let i = 0; i < list.length; i++) {
			for (let j = i+1; j < list.length; j++) {
				let ii = list[i];
				let jj = list[j];
				if (ii.accepting != jj.accepting) continue;
				//if ii and jj both have same transition-out rules, they are the SAME and should be SIMPLIFIED
				let shouldSimplify = true;
				for (let letter of alphabet.concat("")) {
					let iitransitions = ii.outgoing.filter(x => x.letter == letter).map(x => x.result);
					let jjtransitions = jj.outgoing.filter(x => x.letter == letter).map(x => x.result);
					if (iitransitions.length != jjtransitions.length) {
						shouldSimplify = false;
						break;
					}
					if (iitransitions.length == 0) {
						continue;
					}
					if (iitransitions.length == 1 && iitransitions[0] == jjtransitions[0]) {
						shouldSimplify = false;
						break;
					}
					//TODO: for sets longer than 2, check permutations. ughhh. if still match, continue; if dealbreaker, set false and break;
				}
				if (shouldSimplify) {
					console.log(i, j);
					//anything that pointed to jj should now point to ii
					//remove jj from existence
					list.splice(j);
					for (let q of list) for (let transition of q.outgoing) if (transition.result == jj) transition.result = ii;
				}
			}
		}
	}
	copy() {
		let list = this.findAnythingInSystem();
		let newList = [];
		for (let i = 0; i < list.length; i++) {
			newList[i] = new State(list[i].label);
			newList[i].accepting = list[i].accepting;
		}
		for (let i = 0; i < list.length; i++) {
			for (let transition of list[i].outgoing) {
				newList[i].outgoing.push(new Transition(transition.letter, newList[list.indexOf(transition.result)]));
			}
		}
	}
}

class SetOfStates {
	constructor(states = []) {
		this.states = states;
	}
	equal(other) {
		return this.toString() == other.toString();
	}
	insert(newState) {
		if (this.states.includes(newState)) return false;
		this.states.push(newState);
		return true;
	}
	findEpsilonDomain() {
		let newSet = new SetOfStates(this.states.map(x => x));
		let anyAdded;
		do {
			anyAdded = false;
			for (let epsilonedState of newSet.simpleTraverse().states) {
				anyAdded ||= newSet.insert(epsilonedState);
			}
		} while (anyAdded)
			return newSet;
	}
	traverse(letter = alphabet[0]) { //does epsilon-actual-epsilon
		return this.findEpsilonDomain().simpleTraverse(letter).findEpsilonDomain();
	}
	simpleTraverse(letter = "") { //doesn't do epsilon-actual-epsilon
		let results = [];
		for (let state of this.states)
			for (let outgoing of state.outgoing)
				if (outgoing.letter == letter)
					results.push(outgoing.result);
		return new SetOfStates(results.filter((e, i, a) => a.indexOf(e) == i));
	}
	toString() {
		return "{" + this.states.map(b => b.label).sort().join(", ") + "}";
	}
}

/* let A = new State("A");
let B = new State("B");
let C = new State("C");
let D = new State("D");
let E = new State("E");
A.addTransition("0", A);
A.addTransition("", B);
A.addTransition("", D);
B.addTransition("1", B);
B.addTransition("", C);
C.addTransition("2", C);
D.addTransition("3", D);
D.addTransition("", E);
E.addTransition("4", E); */

/* let A = new State("A");
let B = new State("B");
let C = new State("C");
A.addTransition("0", A);
A.addTransition("0", B);
B.addTransition("1", B);
B.addTransition("1", C);
C.addTransition("2", C); */

/* let q0 = new State("q0");
let q1 = new State("q1");
let q2 = new State("q2");
let q3 = new State("q3");
let q4 = new State("q4");
let q5 = new State("q5");

q0.addTransition("a", q0);
q0.addTransition("b", q0);
q0.addTransition("c", q0);
q0.addTransition("X", q0);

q0.addTransition("a", q1);

q1.addTransition("a", q2);
q1.addTransition("b", q2);
q1.addTransition("c", q2);

q2.addTransition("b", q3);

q3.addTransition("a", q4);
q3.addTransition("b", q4);
q3.addTransition("c", q4);

q4.addTransition("a", q5);

q5.addTransition("a", q5);
q5.addTransition("b", q5);
q5.addTransition("c", q5);
q5.addTransition("X", q5);

q5.accepting = true; */

/* let q0 = stateMachineConcatenation(
	stateMachineAtLeastOne(
		stateMachineForSingleCharacters("1")
	),
	stateMachineForSingleCharacters("2")
); */

let A = new State("A");
let B = new State("B");
let C = new State("C");
C.accepting = true;

A.addTransition("0", B);
A.addTransition("1", B);
A.addTransition("1", C);
B.addTransition("0", A);
B.addTransition("1", C);
C.addTransition("0", B);
C.addTransition("", A);

makeHTMLForSystem(A);
let beep = A.makeMetastateDFA();
makeHTMLForSystem(beep);

function isDFA(q) {
	for (let state of q.findAnythingInSystem()) {
		let transitions = state.outgoing;
		if (transitions.map(x => x.letter.length).includes(0)) return false;
		for (let i of transitions) for (let j of transitions) if (i != j && i.letter == j.letter) return false;
		if (transitions.length < alphabet.length) return false;
	}
	return true;
}

function stateMachineForKleeneClosure(system) {
	let lestate = new State();
	lestate.accepting = true;
	lestate.addTransition("", system);
	for (let end of system.findAcceptingStates()) {
		end.accepting = false;
		end.addTransition("", lestate);
	}
	return lestate;
}
function stateMachineZeroOrOne(system) {
	let init = new State();
	let fin = new State();
	fin.accepting = true;
	init.addTransition("", fin);
	init.addTransition("", system);
	for (let end of system.findAcceptingStates()) {
		end.accepting = false;
		end.addTransition("", fin);
	}
	return init;
}
function stateMachineAtLeastOne(system) {
	for (let end of system.findAcceptingStates()) {
		end.addTransition("", system);
	}
	return system;
}
function stateMachineForSingleCharacters(characters) {
	let init = new State();
	let end = new State();
	end.accepting = true;
	for (let character of characters) init.addTransition(character, end);
	return init;
}
function stateMachineConcatenation(...items) {
	if (items.length == 0) return stateMachineEmptyStringOnly();
	for (let i = 0; i < items.length-1; i++) {
		let j = i+1;
		for (let ending of items[i].findAcceptingStates()) {
			ending.accepting = false;
			ending.addTransition("", items[j]);
		}
	}
	return items[0];
}
function stateMachineEmptyStringOnly() {
	let init = new State();
	init.accepting = true;
	return init;
}

function stateMachineUnion(list, mergeToSingleAccepting = false) { //DOESNT MAKE COPY
	let init = new State();
	for (let e of list) init.addTransition("", e);
	if (mergeToSingleAccepting) {
		let end = new State();
		end.accepting = true;
		for (let f of list.map(x => x.findAnythingInSystem()).filter(x => x.accepting).flat()) {
			f.addTransition("", end);
			f.accepting = false;
		}
	}
	return init;
}


function makeHTMLForSystem(starting) {
	let states = [starting];
	let table = document.createElement("table");
	let tr = table.appendChild(document.createElement("tr"));
	let td = tr.appendChild(document.createElement("td"));
	let alphabetWithEpsilon = alphabet.map(x => x);
	alphabetWithEpsilon.unshift("");
	let inEpsilonColumn = []; //might get deleted if unused
	let resultsCells = []; //cells with result; might want to remove {prefix }suffix if it always has cardinality 1
	for (let letter of alphabetWithEpsilon) {
		td = tr.appendChild(document.createElement("td"));
		td.innerText = letter.length ? letter : "ϵ";
		if (!letter.length) inEpsilonColumn.push(td);
	}
	let epsilonEverUsed = false;
	let alwaysOneResultIncludingEpsilon = true;
	let alwaysOneResultIgnoringEpsilon = true;
	for (let i = 0; i < states.length; i++) {
		tr = table.appendChild(document.createElement("tr"));
		tr.appendChild(document.createElement("td")).innerText = states[i].label + (states[i].accepting ? " !" : "");
		for (let letter of alphabetWithEpsilon) {
			td = tr.appendChild(document.createElement("td"));
			let results = states[i].outgoing.filter(x => x.letter == letter);
			td.innerText = "{" + results.map(x => x.result.label).join(", ") + "}";
			if (!letter.length) {
				inEpsilonColumn.push(td);
				if (results.length) epsilonEverUsed = true;
			}
			if (results.length != 1) alwaysOneResultIncludingEpsilon = false;
			if (results.length != 1 && letter.length) alwaysOneResultIgnoringEpsilon = false;
			resultsCells.push(td);
		}
		for (let outgoing of states[i].outgoing)
			if (!states.includes(outgoing.result))
				states.push(outgoing.result);
	}
	if (!epsilonEverUsed) for (let cell of inEpsilonColumn) cell.remove();
	if ((epsilonEverUsed && alwaysOneResultIncludingEpsilon) || (!epsilonEverUsed && alwaysOneResultIgnoringEpsilon)) {
		for (let cell of resultsCells) cell.innerText = cell.innerText.substring(1, cell.innerText.length-1);
	}
	for (let cell of table.querySelectorAll("td")) cell.innerText = cell.innerText.replaceAll("{}", "∅");
	document.body.appendChild(table);
	return table;
}