catalogue.constant = {};

catalogue.constant.pi = {
	category: "constant",
	name: "pi",
	outputs: [
		{name: "pi"},
		{name: "tau"},
		{name: "pi / 2"},
	],
	calculate(i, state) {
		let results = [Math.PI, 2*Math.PI, Math.PI/2];
		return [results, {}];
	}
};

catalogue.constant.e = {
	category: "constant",
	name: "e",
	outputs: [
		{name: "e"},
		{name: "1 / e"},
	],
	calculate(i, state) {
		let results = [Math.E, 1/Math.E];
		return [results, {}];
	}
};