catalogue.polynomial = {
	_name: "polynomial",
	_description: "modules for using polynomials (internally stored as lists)",
	_color: "#F5CC19"
};

catalogue.polynomial.evaluate = {
	name: "evaluate polynomial",
	inputs: [
		{name: "polynomial", val: [0, 1]},
		{name: "input", val: 0}
	],
	outputs: [
		{name: "evaluation"}
	],
	calculate(i, state) {
		let output = recursive_unary(i[1], function(a) {
			let sum = 0;
			for (let pow = 0; pow < i[0].length; pow++)
				sum += i[0][pow] * Math.pow(a, pow);
			return sum;
		});
		return [[output], state];
	}
};

catalogue.polynomial.derivative = {
	name: "derivative",
	inputs: [
		{name: "polynomial", val: [0, 1]}
	],
	outputs: [
		{name: "derivative"}
	],
	calculate(i, state) {
		let coefficients = [];
		for (let pow = 1; pow < i[0].length; pow++) {
			coefficients.push(pow * i[0][pow]);
		}
		return [[coefficients], state];
	}
};