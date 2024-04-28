//this is information actually saved
let letterScaleScheme = 0;
let tableData = [];
let letterScale; //this one is regenerated before u make table for first time, from letterScaleScheme
let allLetterScaleSchemes = [
	[
		["A", 4],
		["AB", 3.5],
		["B", 3],
		["BC", 2.5],
		["C", 2],
		["D", 1],
		["F", 0]
	], [
		["A", 4],
		["A-", 3.67],
		["B+", 3.33],
		["B", 3],
		["B-", 2.67],
		["C+", 2.33],
		["C", 2],
		["C-", 1.67],
		["D+", 1.33],
		["D", 1],
		["F", 0]
	]
];
loadData();
if (!tableData.length) {
	//we have to choose a scheme
	let modal = document.body.appendChild(document.createElement("div"));
	modal.setAttribute("class", "modal");
	let p = modal.appendChild(document.createElement("p"));
	p.innerText = "What grading scale do you use?";
	p.style.textAlign = "center";
	let bigTable = modal.appendChild(document.createElement("table"));
	bigTable.setAttribute("class", "grading-scale-meta");
	let bigRow = bigTable.appendChild(document.createElement("tr"));
	for (let i = 0; i < allLetterScaleSchemes.length; i++) {
		let bigTd = bigRow.appendChild(document.createElement("td"));
		bigTd.setAttribute("class", "grading-scale-meta-td")
		let table = bigTd.appendChild(document.createElement("table"));
		table.setAttribute("class", "grading-scale");
		for (let entry of allLetterScaleSchemes[i]) {
			let tr = table.appendChild(document.createElement("tr"));
			let td = tr.appendChild(document.createElement("td"));
			td.innerText = entry[0];
			td = tr.appendChild(document.createElement("td"));
			td.innerText = styleGPA(entry[1]);
		}
		bigTd.onclick = function() {
			letterScaleScheme = i;
			modal.remove();
			document.querySelector("#main").style.display = "block";
			addClass();
		}
	}
	table
} else {
	document.querySelector("#main").style.display = "block";
	makeTableStart();
}

function setLetterScale() {
	letterScale = allLetterScaleSchemes[letterScaleScheme];
}

function addClass() {
	tableData.push({
		name: "Class #" + (tableData.length+1),
		credits: 4,
		currentGrade: 100,
		finalWorth: 20,
		gradeScale: [
			[95, 90, 85, 80, 70, 60, 0],
			[93, 90, 87, 83, 80, 77, 73, 70, 65, 60, 0]
		][letterScaleScheme],
		desiredLetterIndex: 0,
		selected: false
	});
	makeTableStart();
}

function makeTableStart() {
	if (!letterScale) setLetterScale();
	while (table.firstChild) table.firstChild.remove();
	if (!tableData.length) location.reload();
	let tr = table.appendChild(document.createElement("tr"));
	for (let text of ["", "Class", "Credits", "Grading scale<br>"+letterScale.filter((v,i)=>v[1]).map(x => '<span style="display: inline-block; width: 2.5rem;">'+x[0]+'</span>').join(""), "Current<br>grade (%)", "Weight of<br>final (%)", "Goal", "Grade needed<br>on final (%)", ""]) {
		let th = tr.appendChild(document.createElement("th"));
		th.innerHTML = text;
	}
	for (let row of tableData) {
		tr = table.appendChild(document.createElement("tr"));
		let td = tr.appendChild(document.createElement("td"));
		makeDynamicInput(td, "checkbox", row, "selected").style.width = "2rem";
		td = tr.appendChild(document.createElement("td"));
		makeDynamicInput(td, "text", row, "name").style.width = "7rem";
		td = tr.appendChild(document.createElement("td"));
		makeDynamicInput(td, "number", row, "credits").style.width = "5rem";
		
		td = tr.appendChild(document.createElement("td"));
		for (let i = 0; i < letterScale.length-1; i++) {
			let n = makeDynamicInput(td, "number", row.gradeScale, i, true);
			n.style.width = "2rem";
			n.style.margin = "0 1px";
		}
		
		td = tr.appendChild(document.createElement("td"));
		makeDynamicInput(td, "number", row, "currentGrade", true).style.width = "6rem";;
		td = tr.appendChild(document.createElement("td"));
		makeDynamicInput(td, "number", row, "finalWorth", true).style.width = "9rem";
		td = tr.appendChild(document.createElement("td"));
		makeDynamicSelect(td, letterScale.map(x=>x[0]), row, "desiredLetterIndex").style.width = "4rem";
		row.needOnFinalElement = tr.appendChild(document.createElement("td"));
		row.needOnFinalElement.style.width = "9rem";
		
		td = tr.appendChild(document.createElement("td"));
		let deleteButton = td.appendChild(document.createElement("button"));
		deleteButton.innerText = "Remove";
		deleteButton.style.marginLeft = "0.5rem";
		deleteButton.onclick = function() {
			if (confirm("Delete course \""+row.name+"\"?")) {
				tableData = tableData.filter(x => x != row);
				makeTableStart();
			}
		}
	}
	/* tr = table.appendChild(document.createElement("tr"));
	let td = tr.appendChild(document.createElement("td"));
	td.setAttribute("colspan", 5);
	let newButton = td.appendChild(document.createElement("button"));
	newButton.innerText = "Add course";
	newButton.onclick = addClass; */
	doAllCalculations();
}

//function to use on input elements to force grade to Not be decimal
function makeIntoPercentage(input) {
	if (input.value <= 1) input.value *= 100;
}

//make an input element, and link it to a real variable
function makeDynamicInput(parent, type, object, attribute, perc=false) {
	let input = parent.appendChild(document.createElement("input"));
	input.setAttribute("type", type);
	if (type == "checkbox") input.checked = object[attribute];
	else input.value = object[attribute];
	input.onchange = function() {
		if (perc && input.value<2) input.value *= 100;
		object[attribute] = input.value;
		if (type == "number") object[attribute] = parseFloat(input.value);
		if (type == "checkbox") object[attribute] = input.checked;
		if (input.value.toString().length) {
			this.setAttribute("bad", "false");
		} else {
			this.setAttribute("bad", "true");
		}
		doAllCalculations();
	}
	return input;
}

//same but with a SELECT. because THOSE WORK DIFFERENT
function makeDynamicSelect(parent, choices, object, attribute, onedit = function() {}) {
	let input = parent.appendChild(document.createElement("select"));
	for (let i = 0; i < choices.length; i++) {
		let option = input.appendChild(document.createElement("option"));
		option.value = i;
		option.innerText = choices[i];
	}
	input.value = object[attribute];
	input.onchange = function() {
		object[attribute] = input.value;
		if (input.value.toString().length) {
			this.setAttribute("bad", "false");
		} else {
			this.setAttribute("bad", "true");
		}
		doAllCalculations();
	}
	return input;
}

function doAllCalculations() {
	for (let row of tableData) {
		row.needOnFinal = needOnFinal(row.currentGrade/100, row.finalWorth/100, row.gradeScale[row.desiredLetterIndex]/100);
		row.needOnFinalElement.innerText = (row.needOnFinal<=0) ? "0%" : Math.round(row.needOnFinal*10000)/100+"%";
	}
	let totalCredits = tableData.reduce((a,b)=>a+b.credits,0);
	let totalSelectedCredits = tableData.filter(x => x.selected).reduce((a,b)=>a+b.credits,0);
	let gpaAll = 0;
	let gpaSelected = 0;
	for (let row of tableData) {
		let worth = letterScale[row.desiredLetterIndex][1] * row.credits;
		gpaAll += worth/totalCredits;
		if (row.selected) gpaSelected += worth/totalSelectedCredits;
	}
	document.querySelector("#gpa-all").innerText = styleGPA(gpaAll);
	if (tableData.reduce((a,b)=>a||b.selected,false)) {
		document.querySelector("#gpa-selected").innerText = styleGPA(gpaSelected);
		document.querySelector("#optional-gpa").style.display = "inline";
	} else {
		document.querySelector("#optional-gpa").style.display = "none";
	}
	console.log(totalCredits, totalSelectedCredits, gpaAll, gpaSelected);
}

function needOnFinal(current, worth, desire) {
	//current*(1-worth) + x*worth = desire
	//current - current*worth + x*worth = desire
	//x*worth = desire + current*worth - current
	//x = desire/worth + current - current/worth
	return desire/worth + current - current/worth;
}

function styleGPA(x) {
	x = Math.round(x*100)/100;
	x = x.toString();
	if (!x.includes(".")) x += ".";
	while (x.indexOf(".") > x.length-2) x += "0";
	return x;
}

setInterval(saveData, 30*1000);
function saveData() {
	let json = [letterScaleScheme, tableData.map(x => [
		x.name,
		x.credits,
		x.currentGrade,
		x.finalWorth,
		x.gradeScale,
		x.desiredLetterIndex,
		x.selected?1:0
	])];
	localStorage.setItem("gradetool487", JSON.stringify(json));
}
function loadData() {
	let json = localStorage.getItem("gradetool487");
	if (!json) return;
	json = JSON.parse(json);
	letterScaleScheme = json[0];
	tableData = json[1].map(function(x){
		return {
			name: x[0],
			credits: x[1],
			currentGrade: x[2],
			finalWorth: x[3],
			gradeScale: x[4],
			desiredLetterIndex: x[5],
			selected: x[6] == 1
		};
	})
}