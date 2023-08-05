catalogue.logic = {
	_name: "logic",
	_description: "logical operations for boolean values",
	_color: "#975CE0"
};

catalogue.logic.bool = {
	name: "to boolean",
	inputs: [
		{name: "in", val: 0}
	],
	outputs: [
		{name: "boolean"}
	],
	calculate(i, state) {
		let result = recursive_unary(i[0], function(a){return (a==0) ? 0 : 1});
		return [[result], state];
	}
}

catalogue.logic.not = {
	name: "not",
	inputs: [
		{name: "boolean", val: 0}
	],
	outputs: [
		{name: "not"}
	],
	calculate(i, state) {
		let result = recursive_unary(i[0], function(a){return (a==0) ? 1 : 0});
		return [[result], state];
	}
};

catalogue.logic.andor = {
	name: "and or",
	inputs: [
		{name: "p", val: 0},
		{name: "q", val: 1}
	],
	outputs: [
		{name: "and"},
		{name: "or"}
	],
	calculate(i, state) {
		let and_result = recursive_binary(i[0], i[1], function(a, b){
			let _a = (a==0) ? false : true;
			let _b = (b==0) ? false : true;
			return (_a && _b) ? 1 : 0;
		});
		let or_result = recursive_binary(i[0], i[1], function(a, b){
			let _a = (a==0) ? false : true;
			let _b = (b==0) ? false : true;
			return (_a || _b) ? 1 : 0;
		});
		return [[and_result, or_result], state];
	}
};

catalogue.logic.big_and = {
	name: "5x and",
	inputs: [
		{name: "p", val: 1},
		{name: "q", val: 1},
		{name: "r", val: 1},
		{name: "s", val: 1},
		{name: "t", val: 1}
	],
	outputs: [
		{name: "and"}
	],
	calculate(i, state) {
		let p = (i[0] == 0) ? false : true;
		let q = (i[1] == 0) ? false : true;
		let r = (i[2] == 0) ? false : true;
		let s = (i[3] == 0) ? false : true;
		let t = (i[4] == 0) ? false : true;
		return [[(p && q && r && s && t) ? 1 : 0], state];
	}
};

catalogue.logic.big_or = {
	name: "5x or",
	inputs: [
		{name: "p", val: 0},
		{name: "q", val: 0},
		{name: "r", val: 0},
		{name: "s", val: 0},
		{name: "t", val: 0}
	],
	outputs: [
		{name: "or"}
	],
	calculate(i, state) {
		let p = (i[0] == 0) ? false : true;
		let q = (i[1] == 0) ? false : true;
		let r = (i[2] == 0) ? false : true;
		let s = (i[3] == 0) ? false : true;
		let t = (i[4] == 0) ? false : true;
		return [[(p || q || r || s || t) ? 1 : 0], state];
	}
};