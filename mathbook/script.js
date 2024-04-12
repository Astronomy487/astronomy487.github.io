function makeMath(container, text) {
	temml.render(text, container);
}

let lines = [
];

function addLine() {
	let container = document.querySelector("article").appendChild(document.createElement("div"));
	container.setAttribute("focus", "false");
	container.setAttribute("mode", "error");
	let textarea = container.appendChild(document.createElement("input"));
	textarea.setAttribute("spellcheck", "false");
	let result = container.appendChild(document.createElement("span"));
	lines.push({
		container: container,
		textarea: textarea,
		result: result,
		evaluation: undefined
	});
	textarea.oninput = function() {
		let i = 0;
		while (i < textarea.value.length && textarea.value.charAt(i) == "#") i++;
		textarea.setAttribute("heading", i);
		doEvaluate();
	}
	textarea.onfocus = function() {
		container.setAttribute("focus", "true");
		//trimEmpty();
	}
	textarea.onblur = function() {
		container.setAttribute("focus", "false");
		if (textarea.value.trim().length) if (lines[lines.map(x=>x.textarea).indexOf(textarea)].mode == "evaluation") textarea.value = math.parse(textarea.value).toString();
	}
	textarea.focus();
}

function trimEmpty() { //remove the empty lines
	for (let i = lines.length-1; i >= 1; i--) {
		if (lines[i].textarea == document.activeElement) return;
		if (!lines[i].textarea.value.trim()) {
			lines[i].container.remove();
			lines.pop();
		} else return;
	}
}

function doEvaluate() {
	let parser = math.parser();
	let assignmentNodes = [];
	for (let line of lines) {
		let text = line.textarea.value.trim();
		if (text) {
			try {
				let parsed = math.parse(text);
				let evaluated = parser.evaluate(text);
				let texToWrite = "";
				try {texToWrite = math.parse(evaluated.toString()).toTex();} catch(e) {}
				if (parsed.type == "FunctionAssignmentNode") texToWrite = parsed.toTex();
				if (parsed.type == "AssignmentNode") texToWrite = parsed.toTex();
				//if (math.type == "SymbolNode") texToWrite = "";
				if (!texToWrite) throw new Error();
				makeMath(line.result, texToWrite);
				line.container.setAttribute("mode", "evaluation");
				line.mode = "evaluation";
			} catch(e) {
				//truly erroneous
				line.result.innerText = e.toString();
				line.container.setAttribute("mode", "error");
				line.mode = "error";
			}
		} else {
			//empty line
			line.result.innerText = "";
		}
	}
}

addLine();

doEvaluate();

function substitute(node, variableName, expression) { //each pair is {name, expression} . expression is a syntax tree type deal
	return node.transform(function(node, path, parent) {
		if (node.isSymbolNode && node.name == variableName) return expression;
		return node;
	});
}

function makeSubstitutions(node, assignmentNodes) {
	return node.transform(function(node, path, parent) {
		if (node.isSymbolNode) {
			//find which symbol to substitute, and do so
			for (let assignmentNode of assignmentNodes) if (node.name == assignmentNode.name) return assignmentNode.value;
		}
		if (node.isFunctionNode) {
			//find which symbol to substitute, and do so
			for (let assignmentNode of assignmentNodes) if (node.fn == assignmentNode.name) {
				assignmentNodes = [];
				for (let i = 0; i < node.args.length; i++)
					assignmentNodes.push(new math.AssignmentNode(
						new math.SymbolNode(assignmentNode.params[i]),
						node.args[i]
					));
				return makeSubstitutions(assignmentNode.expr, assignmentNodes);
			}
		}
		return node;
	});
}

document.onkeydown = function(e) {
	try {
		let index = lines.map(x => x.textarea).indexOf(document.activeElement);
		let character = 99999; //document.activeElement.selectionStart
		if (e.keyCode == 38) { //up
			if (index < 0) return;
			lines[index-1].textarea.focus()
			setTimeout(function(){document.activeElement.setSelectionRange(character, character)},0);
		} else if (e.keyCode == 40 || e.keyCode == 13) {
			if (index >= lines.length-1) {
				addLine();
				return;
			}
			console.log("go down");
			lines[index+1].textarea.focus();
			setTimeout(function(){document.activeElement.setSelectionRange(character, character)},0);
			e.stopPropagation();
		} else if (e.keyCode == 8) {
			if (!document.activeElement.value.length) {
				lines[index].container.remove();
				lines = lines.filter(x => x.textarea != document.activeElement);
				setTimeout(function(){lines[index-1].textarea.focus();},0);
				e.stopPropagation();
			}
		}
	} catch(e) {}
}