catalogue.lists = {
	_name: "lists",
	_description: "functions for manipulating lists",
	_color: "#bc1436"
};

catalogue.lists.up_to = {
	name: "up to",
	inputs: [
		{name: "lower", val: 1},
		{name: "upper", val: 10},
		{name: "step", val: 1}
	],
	outputs: [
		{name: "list"}
	],
	calculate(i, state) {
		let arr = [];
		for (let j = i[0]; j <= i[1]+0.00000001; j += i[2]) {
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
		{name: "list 1", val: []},
		{name: "list 2", val: []}
	],
	outputs: [
		{name: "joined list"}
	],
	calculate(i, state) {
		let l = [];
		for (x of i) {
			if (typeof(x) == "number") {
				l.push(x);
			} else {
				for (item of x)
					l.push(item);
			}
		}
		return [[l], state];
	}
};

catalogue.lists.big_join = {
	name: "5x join",
	inputs: [
		{name: "list 1", val: []},
		{name: "list 2", val: []},
		{name: "list 3", val: []},
		{name: "list 4", val: []},
		{name: "list 5", val: []}
	],
	outputs: [
		{name: "joined list"}
	],
	calculate(i, state) {
		let l = [];
		for (x of i) {
			if (typeof(x) == "number") {
				l.push(x);
			} else {
				for (item of x)
					l.push(item);
			}
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
};

catalogue.lists.unfold = {
	name: "unfold",
	inputs: [
		{name: "list", val: [[0]]}
	],
	outputs: [
		{name: "unfolded list"}
	],
	calculate(i, state) {
		let result = flatten(i[0]);
		return [[result], state];
	}
}

catalogue.lists.shuffle = {
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

catalogue.lists.pick = {
	name: "pick",
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
			if (a == 1) picks = picks[0];
			return picks;
		});
		return [[result], state];
	}
};

catalogue.lists.normalize = {
	name: "normalize",
	inputs: [
		{name: "vector", val: [1, 1]},
		{name: "target sum", val: 1}
	],
	outputs: [
		{name: "sum to x"},
		{name: "sq sum to x"},
	],
	calculate(i, state) {
		let flattened = flatten(i[0]);
		let sum = 0;
		for (item of flattened) sum += item;
		let re_sum = recursive_unary(i[0], function(a){
			return a * i[1] / sum;
		});
		let sq_sum = 0;
		for (item of flattened) sq_sum += (item*item);
		sq_sum = Math.sqrt(sq_sum);
		let re_sq_sum = recursive_unary(i[0], function(a){
			return a * i[1] / sq_sum;
		});
		return [[re_sum, re_sq_sum], state];
	}
}