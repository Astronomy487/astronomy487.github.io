let sets = {}; //keys are bigints-converted-to-strings

function getSet(index) {
	if (!sets[index.toString()])
		new Set(index);
	return sets[index.toString()];
}
function noteImportantSet(set, comment, color) {
	let indexStr = findIndexFromSetString(set).toString();
	if (!importantNote[indexStr])
		importantNote[indexStr] = [];
	importantNote[indexStr].push('<span style="color: '+color+'">' + comment + '</span>');
}

let importantNote = {};

class Set {
	constructor(index) { //index is bigint
		sets[index.toString()] = this;
		this.index = index;
		let n = index;
		let i = 0n;
		this.elements = [];
		while (n > 0) {
			if (n % 2n > 0) {
				this.elements.push(getSet(i));
			}
			n = n >> 1n;
			i = i + 1n;
		}
		this.cardinality = this.elements.length;
		this.string = this.cardinality ? "{" + this.elements.map(x => x.string).join(",") + "}" : "∅";
		this.rank = 0;
		for (let element of this.elements) this.rank = Math.max(this.rank, element.rank + 1);
	}
}

new Set(BigInt("3785924987"));

let perPage = 100n;
let currentPage = 0n;

let indexToHighlight = -1n;

function prepareTable() {
	while (output.firstChild) output.firstChild.remove();
	let tr = output.appendChild(document.createElement("tr"));
	output.appendChild(document.createElement("th")).innerText = "Index";
	output.appendChild(document.createElement("th")).innerText = "Set";
	output.appendChild(document.createElement("th")).innerText = "Rank";
	output.appendChild(document.createElement("th")).innerText = "Cardinality";
	output.appendChild(document.createElement("th")).innerText = "Notes";
}
function doRow(i) {
	let set = getSet(i);
	let tr = output.appendChild(document.createElement("tr"));
	tr.appendChild(document.createElement("td")).innerText = set.index;
	tr.appendChild(document.createElement("td")).innerText = set.string;
	tr.appendChild(document.createElement("td")).innerText = set.rank;
	tr.appendChild(document.createElement("td")).innerText = set.cardinality;
	if (i == indexToHighlight) tr.setAttribute("highlight", "true");
	tr.appendChild(document.createElement("td")).innerHTML = importantNote[i.toString()] ? importantNote[i.toString()].join("<br>") : "";
}
function makePage(n = currentPage) { //start on page 0; display n through n+perPage-1; n is bigint
	if (n < 0n) n = 0n;
	while (output.firstChild) output.firstChild.remove();
	currentPage = n;
	prepareTable();
	for (let i = n * perPage; i < n * perPage + perPage; i = i + 1n) doRow(i);
	currentPageDisplay.value = n.toString();
	try {
		output.querySelector("[highlight]").scrollIntoView();
	} catch(e) {
		
	}
}
function makeSpecialPage() {
	prepareTable();
	for (let i of Object.keys(importantNote).map(BigInt)) doRow(i);
	currentPageDisplay.value = "special";
	try {
		output.querySelector("[highlight]").scrollIntoView();
	} catch(e) {
		
	}
}

let maxRank = 5;

function findIndexFromSetString(string) {
	let ogString = string;
	string = string.replaceAll("∅", "{}").replaceAll(" ", "").replaceAll("\t", "").replaceAll("\\","").replaceAll("emptyset","{}");
	if (!string.length) throw "Gave me an empty string...";
	let nestingLevel = 0;
	for (let character of string.split("")) {
		if (character == "{") nestingLevel++;
		if (character == "}") nestingLevel--;
		if (nestingLevel < 0) throw "Invalid curly brackets";
		if (nestingLevel-1 > maxRank) if (!confirm("Looking for a set higher than rank "+maxRank+" will probably freeze your browser. Is that okay")) throw "Higher than rank "+maxRank;
	}
	if (nestingLevel != 0) throw "Invalid curly brackets";
	string = string.substring(1, string.length-1);
	if (!string.length) return 0n;
	//make children - string split by commas, but only on outer nesting level
	let children = [];
	nestingLevel = 0;
	let latestChild = "";
	for (let character of string.split("")) {
		if (character == "{") nestingLevel++;
		if (character == "}") nestingLevel--;
		if (nestingLevel == 0 && character == ",") {
			children.push(latestChild);
			latestChild = "";
		} else latestChild += character;
	}
	children.push(latestChild);
	let total = 0n;
	for (let child of children.map(findIndexFromSetString)) {
		total |= 1n << child;
	}
	return total;
}

function doSearch() {
	let str = setSearch.value;
	try {
		pullUpIndex(findIndexFromSetString(str));
	} catch(e) {
		
	}
}

function pullUpIndex(index) {
	indexToHighlight = index;
	makePage((index-index%perPage)/(perPage));
}

//make notes about cool sets
/* for (let [i, vonNeuman] = [0, "{}"]; i < 6; [i, vonNeuman] = [i+1, (vonNeuman.substring(0, vonNeuman.length-1) + ","+vonNeuman+"}").replace("{,","{")]) {
	noteImportantSet(vonNeuman, "Von Neuman ordinal "+i, "#2af");
	console.log(vonNeuman);
} */

let neumanOrdinals = ["{}", "{{}}", "{{},{{}}}", "{{},{{}},{{},{{}}}}", "{{},{{}},{{},{{}}},{{},{{}},{{},{{}}}}}", "{{},{{}},{{},{{}}},{{},{{}},{{},{{}}}},{{},{{}},{{},{{}}},{{},{{}},{{},{{}}}}}}"]

for (let i = 0; i < neumanOrdinals.length; i++)
	noteImportantSet(neumanOrdinals[i], "Von Neuman ordinal " + i, "#2af");

for (let i = 0; i < 4; i++)
	for (let j = 0; j < 4; j++)
		noteImportantSet("{{"+neumanOrdinals[i]+"}, {"+neumanOrdinals[i]+", "+neumanOrdinals[j]+"}}", "Kuratowski ordered pair ("+i+", "+j+")", "#af2");

//for (let [i, t] = [0, "{}"]; i < 6; [i, t] = [i+1, "{"+t+"}"]) noteImportantSet(t, "First set of rank " + i);

makePage();