catalogue.lists = {
	_name: "lists",
	_description: "functions for manipulating lists",
	_color: "#bc1436"
};

catalogue.lists.up_to = {
	name: "up to",
	inputs: [
		{name: "lower", val: 0},
		{name: "upper", val: 4},
		{name: "step", val: 2}
	],
	outputs: [
		{name: "list"}
	],
	calculate(i, state) {
		let arr = [];
		for (let j = i[0]; j <= i[1]; j += i[2]) {
			arr.push(j);
		}
		let results = [arr];
		return [results, {}];
	}
};

// opportunity for restructure: just like how there are recursive helper functions that deconstruct problems until arriving at individual numbers, you should do the same but for arriving at individual lists

// idk exactly how that would work so i wont do it for now

catalogue.lists.sort = {
	name: "sort",
	inputs: [
		{name: "list", val: [3, 2, 1]}
	],
	outputs: [
		{name: "sorted"}
	],
	calculate(i, state) {
		function recursive_sort(list) {
			let number_list = [];
			let list_list = [];
			for (item of list) {
				if (typeof(item) == "number") number_list.push(item);
				else list_list.push(item);
			}
			number_list.sort();
			for (item of list_list)
				number_list.push(recursive_sort(item));
			return number_list;
		}
		let results = [recursive_sort(i[0])];
		return [results, {}];
	}
};

catalogue.lists.size = {
	name: "size",
	inputs: [
		{name: "list", val: [0]}
	],
	outputs: [
		{name: "size"}
	],
	calculate(i, state) {
		return [[i[0].length], {}];
	}
};

catalogue.lists.reverse = {
	name: "reverse",
	inputs: [
		{name: "list", val: [0, 1]}
	],
	outputs: [
		{name: "reversed"}
	],
	calculate(i, state) {
		let list = copy(i[0]);
		reverse(list);
		function reverse(x) {
			x.reverse();
			for (item of x) if (typeof(item) != "number") reverse(item);
		}
		return [[list], ]
	}
}

catalogue.lists.repeat = {
	name: "repeat",
	inputs: [
		{name: "content", val: 1},
		{name: "count", val: 2}
	],
	outputs: [
		{name: "list"}
	],
	calculate(i, state) {
		/*let list = [];
		for (let j = 0; j < i[1]; j++)
			list.push(i[0]);*/
		let list = recursive_unary(i[1], function(a){
			let l = [];
			for (let j = 0; j < a; j++)
				l.push(i[0]);
			return l;
		});
		return [[list], state];
	}
};

catalogue.lists.join = {
	name: "join",
	inputs: [
		{name: "list 1", val: [1]},
		{name: "list 2", val: [2]}
	],
	outputs: [
		{name: "joined list"}
	],
	calculate(i, state) {
		let l = [];
		if (typeof(i[0]) == "number") {
			l.push(i[0]);
		} else {
			for (item of i[0])
				l.push(item);
		}
		if (typeof(i[1]) == "number") {
			l.push(i[1]);
		} else {
			for (item of i[1])
				l.push(item);
		}
		return [[l], state];
	}
};

catalogue.lists.get = { //indexed at 1 <333
	name: "nth item",
	inputs: [
		{name: "list", val: [1, 2]},
		{name: "index", val: 1}
	],
	outputs: [
		{name: "item"}
	],
	calculate(i, state) {
		let result = recursive_unary(i[1], function(a){
			let index = Math.floor(a - 1);
			if (index < 0) index = 0;
			if (index > i[0].length-1) index = i[0].length-1;
			return i[0][index];
		});
		return [[result], state];
	}
}