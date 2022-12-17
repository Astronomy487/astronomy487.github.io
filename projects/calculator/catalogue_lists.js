catalogue.lists = {};

catalogue.lists.up_to = {
	category: "lists",
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

catalogue.lists.sort = {
	category: "lists",
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