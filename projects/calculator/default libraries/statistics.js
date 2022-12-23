catalogue.stats = {
	_name: "statistics",
	_description: "statistical analysis",
	_color: "#0FC1EC"
};

catalogue.stats.stats = {
	name: "analysis",
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
		let data = flatten(i[0]);
		for (el of data)
			sum += el;
		let stdev = 0;
		let mean = sum/data.length;
		for (el of data)
			stdev += (el-mean)*(el-mean);
		stdev /= data.length;
		stdev = Math.sqrt(stdev);
		let results = [sum, mean, stdev, i[0].length];
		return [results, {}];
	}
};

/*catalogue.stats.normal_distribution = {
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
};*/

catalogue.stats.five_sum = {
	name: "min q1 med q3 max",
	inputs: [
		{name: "data", val: [1, 2, 3, 4, 5]}
	],
	outputs: [
		{name: "min"},
		{name: "q1"},
		{name: "med"},
		{name: "q3"},
		{name: "max"}
	],
	calculate(i, state) {
		let data = flatten(i[0]);
		data.sort();
		let v = [];
		for (let t = 0; t <= 1; t += 0.25) {
			let index_low = Math.floor(t * (data.length-1));
			let index_high = Math.ceil(t * (data.length-1));
			v.push(0.5*data[index_low] + 0.5*data[index_high]);
		}
		return [v, state];
	}
};

catalogue.stats.ignore_outliers = {
	name: "ignore outliers",
	inputs: [
		{name: "data", val: [1, 0, 0, 0, 0]}
	],
	outputs: [
		{name: "non outliers"},
		{name: "outliers"}
	],
	calculate(i, state) {
		let data = flatten(i[0]);
		data.sort();
		let q = [];
		for (let t = 0.25; t <= 0.75; t += 0.5) {
			let index_low = Math.floor(t * (data.length-1));
			let index_high = Math.ceil(t * (data.length-1));
			q.push(0.5*data[index_low] + 0.5*data[index_high]);
		}
		let iqr = q[1] - q[0];
		let min = q[0] - 1.5 * iqr;
		let max = q[1] + 1.5 * iqr;
		let outliers = [];
		let non_outliers = [];
		for (item of data) {
			if (item > max || item < min)
				outliers.push(item);
			else
				non_outliers.push(item);
		}
		return [[non_outliers, outliers], state];
	}
};

catalogue.stats.linear_regression = {
	name: "linear regression",
	inputs: [
		{name: "indep. (x)", val: [0, 1, 2]},
		{name: "dep. (y)", val: [2, 4, 6]}
	],
	outputs: [
		{name: "y int"},
		{name: "slope"},
		{name: "polynomial"},
		{name: "r"}
	],
	calculate(i, state) {
		let x = flatten(i[0]);
		let y = flatten(i[1]);
		let len = Math.min(x.length, y.length);
		x.length = len; y.length = len;
		//find means
		let x_mean = 0;
		let y_mean = 0;
		for (let j = 0; j < len; j++) {
			x_mean += x[j];
			y_mean += y[j];
		}
		x_mean /= len;
		y_mean /= len;
		//find s_x and s_y
		let s_x = 0;
		let s_y = 0;
		for (let j = 0; j < len; j++) {
			s_x += (x[j] - x_mean) * (x[j] - x_mean);
			s_y += (y[j] - y_mean) * (y[j] - y_mean);
		}
		s_x = Math.sqrt(s_x/(len-1));
		s_y = Math.sqrt(s_y/(len-1));
		//find r and slope
		let r = 0;
		for (let j = 0; j < len; j++)
			r += (x[j] - x_mean) * (y[j] - y_mean) / s_x / s_y;
		r /= len-1;
		let slope = r * s_y / s_x;
		//find y intercept
		let intercept = y_mean - (slope * x_mean);
		return [[intercept, slope, [intercept, slope], r], state];
	}
}