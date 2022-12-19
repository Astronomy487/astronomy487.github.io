catalogue.constant = {
	_name: "constant",
	_description: "math constants and other constant-like modules",
	_color: "#EA780D"
};

catalogue.constant.pi = {
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

catalogue.constant.integer = {
	name: "choose integer",
	outputs: [
		{name: "int"}
	],
	buttons: [
		{name: "increment", action(i, state) {
			state.k++;
			return state;
		}},
		{name: "decrement", action(i, state) {
			state.k--;
			return state;
		}}
	],
	internal_state: {k: 0},
	calculate(i, state) {
		let results = [state.k];
		return [results, state];
	}
};

catalogue.constant.memory = {
	name: "memory",
	inputs: [
		{name: "input", val: 1}
	],
	outputs: [
		{name: "memory"}
	],
	buttons: [
		{name: "save", action(i, state) {
			state.mem = i[0];
			return state;
		}}
	],
	internal_state: {mem: 0},
	calculate(i, state) {
		return [[state.mem], state];
	}
};

catalogue.constant.identity = {
	name: "identity",
	inputs: [
		{name: "input", val: 1}
	],
	outputs: [
		{name: "input"}
	],
	calculate(i, state) {
		return [i, state];
	}
}