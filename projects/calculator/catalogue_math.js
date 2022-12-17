catalogue.math = {};

catalogue.math.add = {
	category: "math",
	name: "add",
	inputs: [
		{name: "addend 1", val: 0},
		{name: "addend 2", val: 0}
	],
	outputs: [
		{name: "sum"}
	],
	calculate(i, state) {
		let results = [recursive_binary(i[0], i[1], function(a, b) {return a + b})];
		return [results, {}];
	}
};

catalogue.math.subtract = {
	category: "math",
	name: "subtract",
	inputs: [
		{name: "minuend", val: 0},
		{name: "subtrahend", val: 0}
	],
	outputs: [
		{name: "difference"}
	],
	calculate(i, state) {
		let results = [recursive_binary(i[0], i[1], function(a, b) {return a - b})];
		return [results, {}];
	}
};

catalogue.math.multiply = {
	category: "math",
	name: "multiply",
	inputs: [
		{name: "factor 1", val: 1},
		{name: "factor 2", val: 1}
	],
	outputs: [
		{name: "product"}
	],
	calculate(i, state) {
		let results = [recursive_binary(i[0], i[1], function(a, b) {return a * b})];
		return [results, {}];
	}
};

catalogue.math.divide = {
	category: "math",
	name: "divide",
	inputs: [
		{name: "numerator", val: 1},
		{name: "denominator", val: 1}
	],
	outputs: [
		{name: "quotient"}
	],
	calculate(i, state) {
		let results = [recursive_binary(i[0], i[1], function(a, b) {if (b==0) return 0; return a / b})];
		return [results, {}];
	}
};

catalogue.math.trig = {
	category: "math",
	name: "trig",
	inputs: [
		{name: "angle", val: 0}
	],
	outputs: [
		{name: "sine"},
		{name: "cosine"},
		{name: "tangent"},
	],
	calculate(i, state) {
		let sin = recursive_unary(i[0], function(a) {return Math.sin(a)});
		let cos = recursive_unary(i[0], function(a) {return Math.cos(a)});
		let tan = recursive_unary(i[0], function(a) {return Math.tan(a)});
		let results = [sin, cos, tan];
		return [results, {}];
	}
};

catalogue.math.log = {
	category: "math",
	name: "log",
	inputs: [
		{name: "input", val: 1},
		{name: "base", val: Math.E}
	],
	outputs: [
		{name: "log"}
	],
	calculate(i, state) {
		let results = [recursive_binary(i[0], i[1], function(a, b) {
			if (b < 0 || b == 1) return 0;
			if (a == 0) return 0;
			return Math.log(a) / Math.log(b)
		})];
		return [results, {}];
	}
};

catalogue.math.exponent = {
	category: "math",
	name: "exponent",
	inputs: [
		{name: "base", val: Math.E},
		{name: "exponent", val: 1}
	],
	outputs: [
		{name: "result"}
	],
	calculate(i, state) {
		let results = [recursive_binary(i[0], i[1], function(a, b) {return Math.pow(a, b)})];
		return [results, {}];
	}
};