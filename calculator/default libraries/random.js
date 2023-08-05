catalogue.distributions = {
	_name: "distributions",
	_description: "nodes for generating and analyzing random distributions",
	_color: "#1466fc",
	_random_uniform(min, max, step) {
		let r = Math.random() * (max - min + step);
		if (step > 0)
			r = step * Math.floor(r / step);
		return min + r;
	},
	_random_uniform_mean_stdev(min, max, step) {
		if (step <= 0) {
			return [(min+max)/2, Math.sqrt((max-min)*(max-min)/12)];
		}
		let mean = 0;
		let n = 0;
		for (let i = min; i <= max+0.00000001; i += step) {
			console.log(i);
			mean += i;
			n++;
		}
		mean /= n;
		let stdev = 0;
		for (let i = min; i <= max+0.00000001; i += step) {
			stdev += (i - mean) * (i - mean);
		}
		stdev = Math.sqrt(stdev/(n-1));
		return [mean, stdev];
	},
	_random_normal(mean, stdev) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
	},
	_random_binomial(p, n) {
		let count = 0;
		for (let i = 0; i < n; i++)
			if (Math.random() < p)
				count++;
		return count;
	},
	_random_geometric(p) {
		if (p <= 0) return 0;
		for (let i = 1; true; i++)
			if (Math.random() < p)
				return i;
	}
};

catalogue.distributions.uniform = {
	name: "uniform",
	inputs: [
		{name: "min", val: 0},
		{name: "max", val: 1},
		{name: "step", val: 0},
		{name: "count", val: 1}
	],
	outputs: [
		{name: "random"},
		{name: "long mean"},
		{name: "long stdev"}
	],
	buttons: [
		{name: "regenerate", action(i, state){return state;}}
	],
	calculate(i, state) {
		let result = recursive_unary(i[3], function(a) {
			let x = [];
			for (let j = 0; j < a; j++)
				x.push(catalogue.distributions._random_uniform(i[0], i[1], i[2]));
			return a == 1 ? x[0] : x;
		});
		let mean_stdev = catalogue.distributions._random_uniform_mean_stdev(i[0], i[1], i[2]);
		return [[result, mean_stdev[0], mean_stdev[1]], state];
	}
};

/* catalogue.distributions.uniform_percentiles = {
	name: "uniform percentiles",
	inputs: [
		{name: "percentile a", val: 0},
		{name: "value b", val: 0},
		{name: "min", val: 0},
		{name: "max", val: 1}
	],
	outputs: [
		{name: "value a"},
		{name: "percentile b"}
	],
	calculate(i, state) {
		let val_a = recursive_unary(i[0], function(per_a) {
			return per_a * (i[3]-i[2]) + i[2];
		});
		let per_b = recursive_unary(i[1], function(val_a) {
			return (val_a-i[2])/(i[3]-i[2]);
		});
		return [[val_a, per_b], state];
	}
} */ //i want percentile calcs for other distributions too :( but they are hard idk how those work

catalogue.distributions.normal = {
	name: "normal",
	inputs: [
		{name: "mean", val: 0},
		{name: "stdev", val: 1},
		{name: "count", val: 1}
	],
	outputs: [
		{name: "random"}
	],
	buttons: [
		{name: "regenerate", action(i, state){return state;}}
	],
	calculate(i, state) {
		let result = recursive_unary(i[2], function(a) {
			let x = [];
			for (let j = 0; j < a; j++)
				x.push(catalogue.distributions._random_normal(i[0], i[1]));
			return a == 1 ? x[0] : x;
		});
		return [[result], state];
	}
};

catalogue.distributions.binomial = {
	name: "binomial",
	inputs: [
		{name: "probability", val: 0.2},
		{name: "trials", val: 5},
		{name: "count", val: 1}
	],
	outputs: [
		{name: "random"},
		{name: "long mean"},
		{name: "long stdev"}
	],
	buttons: [
		{name: "regenerate", action(i, state){return state;}}
	],
	calculate(i, state) {
		let result = recursive_unary(i[2], function(a) {
			let x = [];
			for (let j = 0; j < a; j++)
				x.push(catalogue.distributions._random_binomial(i[0], i[1]));
			return a == 1 ? x[0] : x;
		});
		return [[result, i[0]*i[1], Math.sqrt(i[1] * i[0] * (1-i[0]))], state];
	}
};

catalogue.distributions.geometric = {
	name: "geometric",
	inputs: [
		{name: "probability", val: 0.2},
		{name: "count", val: 1}
	],
	outputs: [
		{name: "random"},
		{name: "long mean"},
		{name: "long stdev"}
	],
	buttons: [
		{name: "regenerate", action(i, state){return state;}}
	],
	calculate(i, state) {
		let result = recursive_unary(i[1], function(a) {
			let x = [];
			for (let j = 0; j < a; j++)
				x.push(catalogue.distributions._random_geometric(i[0]));
			return a == 1 ? x[0] : x;
		});
		return [[result, 1/i[0], Math.sqrt(1-i[0])/i[0]], state];
	}
};