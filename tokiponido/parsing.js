let dictionary = {
	"jan": {
		gloss: "Person",
		wordArity: 0, predicateArity: 1,
		predicateDefinition: "#0 is a person"
	},
	"mi": {
		gloss: "Me",
		wordArity: 0, predicateArity: 1,
		predicateDefinition: "#0 is me"
	},
	"sina": {
		gloss: "You",
		wordArity: 0, predicateArity: 1,
		predicateDefinition: "#0 is you"
	},
	"olin": {
		gloss: "Love",
		wordArity: 2, predicateArity: 2,
		predicateDefinition: "#0 loves #1"
	},
	"pona": {
		gloss: "Good",
		wordArity: 1, predicateArity: 1,
		predicateDefinition: "#0 is good"
	},
	"meli": {
		gloss: "Female",
		wordArity: 1, predicateArity: 1,
		predicateDefinition: "#0 is female"
	},
	"mije": {
		gloss: "Male",
		wordArity: 1, predicateArity: 1,
		predicateDefinition: "#0 is male"
	},
	"ike": {
		gloss: "Bad",
		wordArity: 1, predicateArity: 1,
		predicateDefinition: "#0 is bad"
	},
	"suli": {
		gloss: "Big",
		wordArity: 1, predicateArity: 1,
		predicateDefinition: "#0 is big"
	},
	"tomo": {
		gloss: "House",
		wordArity: 0, predicateArity: 1,
		predicateDefinition: "#0 is a house"
	},
	"lon": {
		gloss: "At",
		wordArity: 2, predicateArity: 2,
		predicateDefinition: "at #0 is #1"
	},
	"mama": {
		gloss: "Parent",
		wordArity: 1, predicateArity: 2,
		predicateDefinition: "#0 is the parent of #1"
	},
	"ale": {
		gloss: "all",
		wordArity: 1,
		specialFunction: unary_forall
	},
	"wan": {
		gloss: "some",
		wordArity: 1,
		specialFunction: unary_exists
	},
	"en": {
		gloss: "all",
		wordArity: 2,
		specialFunction: binary_and
	},
	"anu": {
		gloss: "all",
		wordArity: 2,
		specialFunction: binary_or
	},
	"ala": {
		gloss: "not",
		wordArity: 1,
		specialFunction: unary_not
	},
	"nu": {
		gloss: "factthat",
		wordArity: 1,
		specialFunction: unary_factthat
	},
	"li": {
		gloss: "is",
		wordArity: 2,
		specialFunction: binary_equals
	},
	"specialphoneticwords": {
		wordArity: 0
	}
};
for (let p of Object.keys(dictionary)) dictionary[p].word = p;

class ParsingNode {
	constructor(t) {
		t = t.toLowerCase();
		//TODO: add checks to see if it's the fancy words forall and or
		//or cmevla somehow
		if (dictionary[t]) this.token = dictionary[t];
		else {
			t = t.charAt(0).toUpperCase() + t.substring(1);
			//just assume its a global variable bro
			//also means evaluating RIGHT NOW
			this.token = dictionary.specialphoneticwords;
			let argument = undefined;
			for (let phonetic of Object.keys(globalVariablePhoneticToArgument))
				if (phonetic == t)
					argument = globalVariablePhoneticToArgument[phonetic];
			if (!argument) argument = new GlobalArgument(t)
			this.knowledge = new Knowledge(argument, new AndProposition([]));
		}
		this.children = [];
		this.text = t;
	}
	wouldLikeChildren() {
		return this.children.length < this.token.wordArity;
	}
	satisfied() {
		return this.children.length == this.token.wordArity;
	}
	takeChild(x) {
		if (!this.wouldLikeChildren()) throw new Error("this doesn't need more children");
		this.children.push(x);
		x.parent = this;
	}
	evaluate() {
		if (this.knowledge) return; //if already evaluated, yay :D
		for (let c of this.children) c.evaluate();
		let childrenKnowledge = this.children.map(x => x.knowledge);
		if (false) this.knowledge = null;
		else if (this.token.wordArity == 0 && this.token.predicateArity == 1) this.knowledge = nullary(this.token.gloss, ...childrenKnowledge);
		else if (this.token.wordArity == 1 && this.token.predicateArity == 1) this.knowledge = unary_a(this.token.gloss, ...childrenKnowledge);
		else if (this.token.wordArity == 1 && this.token.predicateArity == 2) this.knowledge = unary_b(this.token.gloss, ...childrenKnowledge);
		else if (this.token.wordArity == 2 && this.token.predicateArity == 2) this.knowledge = binary_a(this.token.gloss, ...childrenKnowledge);
		else if (this.token.wordArity == 2 && this.token.predicateArity == 3) this.knowledge = binary_b(this.token.gloss, ...childrenKnowledge);
		else if (this.token.wordArity == 3 && this.token.predicateArity == 3) this.knowledge = ternary_a(this.token.gloss, ...childrenKnowledge);
		else if (this.token.wordArity == 3 && this.token.predicateArity == 4) this.knowledge = ternary_b(this.token.gloss, ...childrenKnowledge);
		else if (this.token.specialFunction) this.knowledge = this.token.specialFunction(...childrenKnowledge);
		else throw new Error("couldn't find evluation function to use");
	}
	toString() {
		//return this.knowledge.toString();
		let t = this.parent ? this.knowledge.toString() : this.knowledge.facts.toString(); //don't show passed argument if top level of expression
		if (t.startsWith("(") && t.endsWith(")")) t = t.substring(1, t.length-1);
		return t;
	}
	toText() {
		return this.text + " " + this.children.map(x => x.toText()).join(" ");
	}
}



/* let parsed = binary_a("At",
	unary_a("Female", nullary("Person")),
	unary_forall(unary_a("Male", nullary("Person")))
);

let parsed2 = binary_a("At",
	unary_a("Female", nullary("Person")),
	unary_a("Male", unary_forall(nullary("Person")))
);

parsed = binary_or(parsed, parsed2);
parsed.fixArguments(); */

function parseSentence(tokens) {
	counter = 0; usedPredicateShortNames = {}; globalVariablePhoneticToArgument = {};
	tokens = tokens.split("\n").join(" ").split("\t").join(" ").split(" ").map(x => x.trim()).filter(x => x.length);
	//tokens = tokens.map(x => x.trim());
	tokens = tokens.map(x => new ParsingNode(x));
	let inserted = 1; //number of tokens that have been successfully put into tree
	while (inserted < tokens.length) {
		//let's try to insert tokens[inserted]. find last thing that still needs
		let foundParent = false;
		for (let j = inserted-1; j >= 0 && !foundParent; j--) {
			if (tokens[j].wouldLikeChildren()) {
				tokens[j].takeChild(tokens[inserted]);
				foundParent = true;
			}
		}
		//if (!foundParent) throw new Error("couldn't find parent"); //actually that's fine; this is just new sentence
		inserted++;
	}
	for (let t of tokens) if (!t.satisfied()) throw new Error(t, "isn't satisfied");
	let sentences = [];
	for (let t of tokens) if (!t.parent) {
		//these are roots of sentence
		t.evaluate(); //call da nullary unary_X binary_X ternary_X functions
		t.knowledge.asSentence();
		sentences.push(t);
	}
	return sentences;
}

document.querySelector("#parser-input").oninput = function() {
	while (document.querySelector("#parser-output").firstChild)
		document.querySelector("#parser-output").firstChild.remove();
	try {
		let sentences = parseSentence(this.value);
		for (let sentence of sentences) {
			document.querySelector("#parser-output").appendChild(makeMath(sentence.toString(), "$", "div"));
			document.querySelector("#parser-output").appendChild(makeMath(sentence.toText(), "", "div"));
		}
		document.querySelector("#parser-output").appendChild(document.createElement("hr"));
		let predicateMeaningTable = document.querySelector("#parser-output").appendChild(document.createElement("table"));
		for (let shortText of Object.keys(usedPredicateShortNames).sort()) {
			let tr = predicateMeaningTable.appendChild(document.createElement("tr"));
			let dictionaryEntry = dictionary[Object.keys(dictionary).filter(wordform => dictionary[wordform].gloss == usedPredicateShortNames[shortText])[0]];
			predicateMeaningTable.appendChild(makeMath(shortText + "xyzw".substring(0, dictionaryEntry.predicateArity), "$", "td"));
			predicateMeaningTable.appendChild(makeMath(dictionaryEntry.word, "", "td"));
			predicateMeaningTable.appendChild(makeMath("“" + dictionaryEntry.gloss + "”", "", "td"));
			let message = dictionaryEntry.predicateDefinition;
			for (let d = 0; d < dictionaryEntry.predicateArity; d++)
				message = message.replace("#"+d, "$" + "xyzw".charAt(d) + "$");
			predicateMeaningTable.appendChild(makeMath(message, "", "td"));
		}
		for (let phonetic of Object.keys(globalVariablePhoneticToArgument)
			.sort((a,b) => globalVariablePhoneticToArgument[a].toString().localeCompare(globalVariablePhoneticToArgument[b].toString()))
		) {
			let tr = predicateMeaningTable.appendChild(document.createElement("tr"));
			predicateMeaningTable.appendChild(makeMath(globalVariablePhoneticToArgument[phonetic].toString(), "$", "td"));
			predicateMeaningTable.appendChild(makeMath(phonetic, "", "td")).setAttribute("colspan", "2");
			predicateMeaningTable.appendChild(makeMath("The global argument ‘" + phonetic + "’", "", "td"));
		}
	} catch(e) {
		console.log(e);
		document.querySelector("#parser-output").innerText = e.toString();
	}
}
document.querySelector("#parser-input").oninput();