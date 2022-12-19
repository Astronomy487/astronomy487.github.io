catalogue.random = {
	_name: "random",
	_description: "nodes for randomized, non-deterministic behavior",
	_color: "#975CE0",
	_random_uniform(min, max, step) {
		let r = Math.random() * (max - min + step);
		if (step > 0)
			r = step * Math.floor(r / step);
		return min + r;
	},
	_random_normal(mean, stdev) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
	},
	_random_sphere(dim) {
		let v = [];
		let mag = 0;
		for (let i = 0; i < dim; i++) {
			v[i] = catalogue.random._random_normal(1, 0);
			mag += v[i] * v[i];
		}
		mag = 1 / Math.sqrt(mag);
		for (let i = 0; i < dim; i++) {
			v[i] *= mag;
		}
		return v;
	}
};

catalogue.random.uniform = {
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
		{name: "regenerate", action(i, state) {
			return state;
		}}
	],
	calculate(i, state) {
		let num = catalogue.random._random_uniform(i[0], i[1], i[2]);
		return [[num], state];
	}
};

catalogue.random.many_uniform = {
	name: "many uniform",
	inputs: [
		{name: "min", val: 0},
		{name: "max", val: 1},
		{name: "step size", val: 0},
		{name: "count", val: 1}
	],
	outputs: [
		{name: "random"}
	],
	buttons: [
		{name: "regenerate", action(i, state) {
			return state;
		}}
	],
	calculate(i, state) {
		let results = [];
		for (let j = 0; j < i[3]; j++) {
			results.push(catalogue.random._random_uniform(i[0], i[1], i[2]));
		}
		return [[results], state];
	}
};

catalogue.random.normal = {
	name: "normal",
	inputs: [
		{name: "mean", val: 0},
		{name: "stdev", val: 1}
	],
	outputs: [
		{name: "random"}
	],
	buttons: [
		{name: "regenerate", action(i, state) {
			return state;
		}}
	],
	calculate(i, state) {
		let num = catalogue.random._random_normal(i[0], i[1]);
		return [[num], state];
	}
};

catalogue.random.many_normal = {
	name: "many normal",
	inputs: [
		{name: "mean", val: 0},
		{name: "stdev", val: 1},
		{name: "count", val: 1}
	],
	outputs: [
		{name: "random"}
	],
	buttons: [
		{name: "regenerate", action(i, state) {
			return state;
		}}
	],
	calculate(i, state) {
		let results = [];
		for (let j = 0; j < i[2]; j++) {
			results.push(catalogue.random._random_normal(i[0], i[1]));
		}
		return [[results], state];
	}
};

catalogue.random.shuffle = {
	name: "shuffle",
	inputs: [
		{name: "list", val: [0, 1]}
	],
	outputs: [
		{name: "shuffled"}
	],
	buttons: [
		{name: "reshuffle", action(i, state){
			return state;
		}}
	],
	calculate(i, state) {
		let list = i[0].concat();
		list.sort(() => (Math.random() > .5) ? 1 : -1);
		return [[list], state];
	}
};

catalogue.random.pick = {
	name: "pick",
	inputs: [
		{name: "list", val: [0, 1]}
	],
	outputs: [
		{name: "item"}
	],
	buttons: [
		{name: "repick", action(i, state){
			return state;
		}}
	],
	calculate(i, state) {
		let choice = i[0];
		if (typeof(i[0]) != "number") choice = i[0][Math.floor(Math.random()*i[0].length)];
		return [[choice], state];
	}
},

catalogue.random.pick_several = {
	name: "pick several",
	inputs: [
		{name: "list", val: [0, 1]},
		{name: "count", val: 1}
	],
	outputs: [
		{name: "items"}
	],
	buttons: [
		{name: "repick", action(i, state){
			return state;
		}}
	],
	calculate(i, state) {
		let result = recursive_unary(i[1], function(a) {
			let bank = copy(i[0]);
			let picks = [];
			for (let j = 0; j < a && bank.length > 0; j++) {
				let index = Math.floor(Math.random()*bank.length);
				picks[j] = bank[index];
				bank.splice(index, 1);
			}
			return picks;
		});
		return [[result], state];
	}
}