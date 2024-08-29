class Set {
	constructor(m = []) {
		this.string = "{" + m.sort((a, b) => a.index - b.index).map(x => x.string).join(",") + "}";
		if (this.string == "{}") this.string = "∅";
		this.rank = -1;
		for (let member of m) this.rank = Math.max(this.rank, member.rank);
		this.rank++;
		this.index = sets.length;
		sets.push(this);
		this.members = m;
	}
	equals(other) {
		return this.string == other.string;
	}
	html() {
		let tr = document.createElement("tr");
		let td = [0,1,2,3].map(x => tr.appendChild(document.createElement("td")));
		td[0].innerText = this.index+1 + ".";
		td[1].innerText = this.string;
		if (this.members.length) td[1].setAttribute("title", "Elements: " + this.members.map(x => "#" + x.index).join(", "));
		td[2].innerText = this.rank;
		td[3].innerText = this.members.length;
		return tr;
	}
}

let sets = [];

new Set(); //New SET💜

//these are horrible variable names
let explored = 0; //we are making sets with members any-set-indexed-less-than-this and MANDATORY the-set-indexed-with-this
let max = 1; //the number of steps to take within this round of explored. always a power of two
let indexWithinRound = 0; //slowly counting up to max; then bumps explored

function step() { //figure out the next
	if (indexWithinRound >= max) {
		explored++;
		max = Math.pow(2, explored);
		indexWithinRound = 0;
	}
	let members = [sets[explored]];
	for (let b = 0; b < explored; b++) {
		if ((indexWithinRound>>b)&1) members.push(sets[b]);
	}
	new Set(members);
	indexWithinRound++;
}

function findUpTo(index) {
	while (sets.length < index+1) step();
}

let setsPerPage = 25;
let pageSkipSize = 10;
let currentPage;

function makePage(n) { //1, 2, 3, ..
	currentPage = n;
	while (tableout.firstChild) tableout.firstChild.remove();
	findUpTo(n*setsPerPage);
	let tr = tableout.appendChild(document.createElement("tr"));
	tr.appendChild(document.createElement("th")).innerText = "";
	tr.appendChild(document.createElement("th")).innerText = "Set";
	tr.appendChild(document.createElement("th")).innerText = "Rank";
	tr.appendChild(document.createElement("th")).innerText = "Cardinality";
	for (let i = n*setsPerPage-setsPerPage; i < n*setsPerPage; i++) {
		let tr = tableout.appendChild(sets[i].html());
		setTimeout(function() {
			tr.style.opacity = 1;
		}, (i - n*setsPerPage + setsPerPage) * 5);
	}
	while (nav.firstChild) nav.firstChild.remove();
	let a = ["a", "a", "span", "a", "a"].map(x => nav.appendChild(document.createElement(x)));
	a[0].innerText = "<<";
	a[1].innerText = "<";
	a[2].innerText = currentPage;
	a[3].innerText = ">";
	a[4].innerText = ">>";
	if (currentPage == 1) {
		a[0].setAttribute("class", "disabled");
		a[1].setAttribute("class", "disabled");
	} else {
		a[0].onclick = function() {makePage(Math.max(1, currentPage - pageSkipSize));}
		a[1].onclick = function() {makePage(currentPage - 1);}
	}
	a[3].onclick = function() {makePage(currentPage + 1);}
	a[4].onclick = function() {makePage(currentPage + pageSkipSize);}
}

makePage(1);