catalogue.stats = {
	_name: "statistics",
	_description: "statistical analysis",
	_color: "#0FC1EC"
};

catalogue.stats.stats = {
	name: "stats",
	inputs: [
		{name: "data", val: [0]}
	],
	outputs: [
		{name: "sum"},
		{name: "mean"},
		{name: "stdev"},
		{name: "count"}
	],
	buttons: [],
	calculate(i, state) {
		let sum = 0;
		for (el of i[0])
			sum += el;
		let stdev = 0;
		let mean = sum/i[0].length;
		for (el of i[0])
			stdev += (el-mean)*(el-mean);
		stdev /= i[0].length;
		stdev = Math.sqrt(stdev);
		let results = [sum, mean, stdev, i[0].length];
		return [results, {}];
	}
};

catalogue.stats.normal_distribution = {
	name: "normal distribution",
	inputs: [
		{name: "data", val: [0]}
	],
	outputs: [
		{name: "mean"},
		{name: "stdev"},
		{name: "z-scores"}
	],
	buttons: [],
	calculate(i, state) {
		let mean = 0;
		for (el of i[0])
			mean += el;
		mean /= i[0].length;
		let stdev = 0;
		for (el of i[0])
			stdev += (el-mean)*(el-mean);
		stdev /= i[0].length;
		stdev = Math.sqrt(stdev);
		let z = [];
		for (let j = 0; j < i[0].length; j++)
			z.push((i[0][j]-mean)/stdev);
		let results = [mean, stdev, z];
		return [results, {}];
	}
}