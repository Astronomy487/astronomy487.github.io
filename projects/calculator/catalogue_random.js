catalogue.random = {};

catalogue.random.uniform = {
	category: "random",
	name: "uniform",
	inputs: [
		{name: "min", val: 0},
		{name: "max", val: 1},
		{name: "step size", val: 0}
	],
	outputs: [
		{name: "random"}
	],
	buttons: [
		{name: "generate new", action(state) {
			state.r = Math.random();
			return state;
		}}
	],
	internal_state: {r: Math.random()},
	calculate(i, state) {
		let rand = state.r * (i[1]-i[0]);
		if (i[2] > 0)
			rand = i[2] * Math.round(rand / i[2]);
		let results = [i[0] + rand];
		return [results, state];
	}
};

catalogue.random.many_uniform = {
	category: "random",
	name: "many uniform",
	inputs: [
		{name: "min", val: 0},
		{name: "max", val: 1},
		{name: "step size", val: 0},
		{name: "count", val: 3}
	],
	outputs: [
		{name: "random list"}
	],
	buttons: [
		{name: "generate new", action(state) {
			//generate as many randoms as count demands
			for (let j = 0; j < state.r.length; j++) state.r[j] = Math.random();
			return state;
		}}
	],
	internal_state: {r: []},
	calculate(i, state) {
		//fill state with randoms if it doesnt have enough
		let count = parseInt(i[3]);
		for (let j = state.r.length; j < count; j++) state.r[j] = Math.random();
		let results = [];
		for (let j = 0; j < count; j++) {
			results[j] = state.r[j] * (i[1]-i[0]);
			if (i[2] > 0) results[j] = Math.round(results[j] / i[2]);
			results[j] += i[0];
		}
		return [[results], state];
	}
};