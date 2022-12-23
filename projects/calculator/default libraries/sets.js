catalogue.sets = {
	_name: "sets",
	_description: "functions for dealing with unordered sets",
	_color: "#E227B9"
};

catalogue.sets.unique = {
	name: "unique",
	inputs: [
		{name: "list", val: [0, 0]}
	],
	outputs: [
		{name: "set"}
	],
	calculate(i, state) {
		let set = [];
		for (el of i[0]) {
			if (!includes(set, el))
				set.push(el);
		}
		return [[set], state];
	}
};

catalogue.sets.union_and_intersection = {
	name: "union and intersection",
	inputs: [
		{name: "list 1", val: [1, 2]},
		{name: "list 2", val: [2, 3]}
	],
	outputs:  [
		{name: "union"},
		{name: "intersection"}
	],
	calculate(i, state) {
		let union = [];
		for (item of i[0]) {
			if (!includes(union, item))
				union.push(item);
		}
		for (item of i[1]) {
			if (!includes(union, item))
				union.push(item);
		}
		console.log(union);
		let intersection = [];
		for (item of union) {
			if (includes(i[0], item) && includes(i[1], item)) {
				intersection.push(item);
			}
		}
		console.log(intersection);
		return [[union, intersection], state];
	}
}

catalogue.sets.exclude = {
	name: "exclude",
	inputs: [
		{name: "list 1", val: [1, 2]},
		{name: "list 2", val: [2, 3]}
	],
	outputs:  [
		{name: "1 excluding 2"},
		{name: "2 excluding 1"},
		{name: "xor"}
	],
	calculate(i, state) {
		let a_minus_b = [];
		for (item of i[0])
			if (!includes(i[1], item) && !includes(a_minus_b, item))
				a_minus_b.push(item);
		let b_minus_a = [];
		for (item of i[1])
			if (!includes(i[0], item) && !includes(b_minus_a, item))
				b_minus_a.push(item);
		let xor = [];
		for (item of a_minus_b)
			xor.push(item);
		for (item of b_minus_a)
			xor.push(item);
		return [[a_minus_b, b_minus_a, xor], state];
	}
};