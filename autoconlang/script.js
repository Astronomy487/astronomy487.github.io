class AutoConlang {
	static AffixRule = class {
		constructor(concept, conlang) { //concept: nounClass, nounNumber, nounDefiniteness, nounRole
			this.concept = concept;
			this.conlang = conlang;
			this.markingSystem = conlang.randomFrom("marking system for " + concept, ["none", "prefix", "postfix", "preword", "postword"])
		}
		process(content, text) { //content: "to" for nounRole, "animate" for nounClass
			if (this.markingSystem == "preword") return this.conlang.getMorpheme("marking system " + this.concept, content, 1) + text;
			if (this.markingSystem == "prefix") return this.conlang.getMorpheme("marking system " + this.concept, content, ) + " " + text;
			if (this.markingSystem == "postword") return text + " " + this.conlang.getMorpheme("marking system " + this.concept, content, 1);
			if (this.markingSystem == "postfix") return text + this.conlang.getMorpheme("marking system " + this.concept, content, 1);
			return text;
		}
	}
	constructor(seed = Date.now()) {
		this.seed = seed.toString();
		this.bank = {};
		this.affixRules = {
			nounClass: new AutoConlang.AffixRule("nounClass", this),
			nounNumber: new AutoConlang.AffixRule("nounNumber", this),
			nounDefiniteness: new AutoConlang.AffixRule("nounDefiniteness", this),
			nounRole: new AutoConlang.AffixRule("nounRole", this)
		}
		//Determine how nouns will work
		this.nounClasses = this.randomFrom("nounClasses decision", [
			["neutral"],
			["boy", "girl"],
			["boy", "girl", "thing"],
			["person", "thing"],
			["person", "creature", "thing"],
		]);
		if (this.nounClasses.length == 1) this.markingSystems.nounClass = "none";
		this.nounNumbers = this.randomFrom("nounNumbers decision", [
			["all"],
			["singular", "plural"],
			["singular", "dual", "plural"],
			["singular", "paucal", "plural"],
			["singular", "plural", "collective"],
		]);
		if (this.nounNumbers.length == 1) this.markingSystems.nounNumber = "none";
	}
	randomFrom(extraSeed, list) {
		return list[Math.floor(this.random(extraSeed)*list.length)];
	}
	random(text) {
		return new Math.seedrandom(this.seed + text)();
	}
	shuffle(extraSeed, list) {
		let rng = new Math.seedrandom(this.seed + extraSeed);
		for (let i = 0; i < list.length; i++) {
			let choice = Math.floor(rng()*(list.length-i))+i;
			[list[i], list[choice]] = [list[choice], list[i]];
		}
		return list;
	}
	static stripText(a) {
		return a.toLowerCase().replace(/[^a-z]/g, "");
	}
	getMorpheme(partOfSpeech, english, suggSyllables = 2) {
		if (!this.bank[partOfSpeech]) this.bank[partOfSpeech] = {}
		english = AutoConlang.stripText(english);
		if (this.bank[partOfSpeech][english]) return this.bank[partOfSpeech][english];
		this.bank[partOfSpeech][english] = this.randomMorpheme(partOfSpeech + english, suggSyllables);
		return this.bank[partOfSpeech][english];
	}
	randomMorpheme(seedText, suggSyllables) { //seed need not include this.seed
		suggSyllables += Math.floor(this.random(seedText+" syllables")*2);
		suggSyllables -= Math.floor(this.random(seedText+" syllablesminus")*2);
		if (suggSyllables <= 0) suggSyllables = 1;
		let text = "";
		for (let i = 0; i < suggSyllables; i++)
			text += "mnptkwjsl  ".charAt(Math.floor(this.random(seedText+"cc"+i) *11)).trim() + "aeiou".charAt(Math.floor(this.random(seedText+"vv"+i)*5));
		return text;
	}
	static englishWordDistance(a, b) {
		[a, b] = [AutoConlang.stripText(a), AutoConlang.stripText(b)];
		if (wordVecs[a]) a = wordVecs[a]; else throw new Error(a + " isn't in word bank");
		if (wordVecs[b]) b = wordVecs[b]; else throw new Error(b + " isn't in word bank");
		if (a.length != b.length) throw new Error("Vectors are different lengths, apparently");
		let dist = 0;
		for (let i = 0; i < a.length; i++)
			dist += (a[i] - b[i])**2;
		return dist;
	}
	categorize(word, categories = this.nounClasses) {
		let distances = categories.map(x => AutoConlang.englishWordDistance(word, x));
		return categories[distances.indexOf(Math.min(...distances))];
	}
	buildNoun(english, num, definiteness, englishNounRole) {
		let nounClass = this.categorize(english);
		//todo: turn num into an actual number class, according to how this lang wants it
		num = num.toString();
		let text = this.getMorpheme("noun", english);
		for (let [affixRule, affixContent] of this.shuffle("noun affixes order", [
			[this.affixRules.nounClass, nounClass],
			[this.affixRules.nounNumber, num],
			[this.affixRules.nounDefiniteness, definiteness],
			[this.affixRules.nounRole, englishNounRole]
		])) {
			text = affixRule.process(affixContent, text);
		}
		return text;
	}
}

let clongs = [4,5,6].map(x => new AutoConlang(x));
let table = document.body.appendChild(document.createElement("table"));
for (let [request, gloss] of [
	['seed', 'seed'],
	['buildNoun("girl", 1, "a", "object")', 'girl (obj)'],
	['buildNoun("girl", 1, "a", "subject")', 'girl (subj)'],
	['buildNoun("boy", 1, "a", "object")', 'boy (obj)'],
	['buildNoun("boy", 1, "a", "subject")', 'boy (subj)'],
	['buildNoun("woman", 1, "a", "object")', 'woman (obj)'],
	['buildNoun("woman", 1, "a", "subject")', 'woman (subj)'],
	['buildNoun("man", 1, "a", "object")', 'man (obj)'],
	['buildNoun("man", 1, "a", "subject")', 'man (subj)'],
]) {
	let tr = table.appendChild(document.createElement("tr"));
	tr.appendChild(document.createElement("th")).innerText = gloss;
	for (let i = 0; i < clongs.length; i++)
		tr.appendChild(document.createElement("td")).innerText = eval("clongs["+i+"]."+request);
}