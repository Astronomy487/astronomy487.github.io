catalogue.math = {
	_name: "math",
	_description: "common math operations",
	_color: "#14bc36"
};

catalogue.math.add = {
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

catalogue.math.floor = {
	name: "floor",
	inputs: [
		{name: "input", val: 0}
	],
	outputs: [
		{name: "floored"}
	],
	calculate(i, state) {
		let results = [recursive_unary(i[0], function(a) {return Math.floor(a)})];
		return [results, {}];
	}
};

catalogue.math.round = {
	name: "round",
	inputs: [
		{name: "input", val: 0}
	],
	outputs: [
		{name: "rounded"}
	],
	calculate(i, state) {
		let results = [recursive_unary(i[0], function(a) {return Math.round(a)})];
		return [results, {}];
	}
};

catalogue.math.lerp = {
	name: "change domain",
	inputs: [
		{name: "old value", val: 0},
		{name: "old min", val: 0},
		{name: "old max", val: 1},
		{name: "new min", val: 0},
		{name: "new max", val: 1}
	],
	outputs: [
		{name: "new value"}
	],
	calculate(i, state) {
		let result = recursive_unary(i[0], function(a){
			return (a-i[1])/(i[2]-i[1]) * (i[4]-i[3]) + i[3];
		});
		return [[result], state];
	}
}