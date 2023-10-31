/*

given
- skeletal structure for some compound
- a number of electrons to assign

we want to assign electrons around outer atoms


data structure for the Problem Itself???

molecule
- atoms: []
	- {symbol: "C", brings: 4, lone_electrons: 0, bonds: []} //brings is # of electrons it BRINGS, really for formal charge stuff. lone_electrons increments by 2.
		//# of atoms an atom experiences (for octet purposes): lone_electrons + sum(bonds.order)


procedure
- count # of electrons for whole structure (sum of brings, plus molecular formal charge)
- make bond orders at least 1
- going from outside atoms to inside atoms, assign electrons to satisfy octets for as long as we can
- if inner things are unsatisfied, try bringing in outers' lone pairs

*/

//this is the problem we are GIVEN
/* let molecule = {
	atoms: [
		{symbol: "H", bonds: []},
		{symbol: "H", bonds: []},
		{symbol: "C", bonds: [0, 1, 3]},
		{symbol: "O", bonds: []}
	],
	net_formal_charge: 0
}; */

/* molecule = {
	atoms: [
		{symbol: "Cl", bonds: [1,2,3,4]},
		{symbol: "O", bonds: []},
		{symbol: "O", bonds: []},
		{symbol: "O", bonds: []},
		{symbol: "O", bonds: []},
	],
	net_formal_charge: -1
} */

//we need to PICK how things start off connected
//there are (n-1)! possibilities for non-cyclical atoms (repeats permutations of identical atoms. divide by some k! please)
//if we also make cycles there are 2^(n choose 2) (also repeats permutations of identical atoms.)
//for even tiny molecules, just guessing a structure is TOO INEFFICIENT. idk how im going to generate these
//i mean there is the idea that carbon 'wants' 4 bonds, so we should tack things onto it and simultaneously satisfy their bonds
//but figuring out the nature of the bonds is the whole deal with the electron assignment i think

/* molecule = {
	atoms: [
		{symbol: "C", bonds: [1, 2]}, //0
		{symbol: "O", bonds: []}, //1
		{symbol: "H", bonds: []}, //2
		
		{symbol: "C", bonds: [0, 4, 5]}, //3
		{symbol: "H", bonds: []}, //4
		{symbol: "O", bonds: [6]}, //5
		{symbol: "H", bonds: []}, //6
		
		{symbol: "C", bonds: [3, 8, 9]}, //7
		{symbol: "H", bonds: []}, //8
		{symbol: "O", bonds: [10]}, //9
		{symbol: "H", bonds: []}, //10
		
		{symbol: "C", bonds: [7, 12, 13]}, //11
		{symbol: "H", bonds: []}, //12
		{symbol: "O", bonds: [14]}, //13
		{symbol: "H", bonds: []}, //14
		
		{symbol: "C", bonds: [11, 16, 17]}, //15
		{symbol: "H", bonds: []}, //16
		{symbol: "O", bonds: [18]}, //17
		{symbol: "H", bonds: []}, //18
		
		{symbol: "C", bonds: [15, 20, 21, 22]}, //19
		{symbol: "H", bonds: []}, //20
		{symbol: "H", bonds: []}, //21
		{symbol: "O", bonds: [23]}, //22
		{symbol: "H", bonds: []} //23
	],
	net_formal_charge: 0
}; */

/* molecule = {
	atoms: [
		{symbol: "S", bonds: [1, 2, 3, 4]},
		{symbol: "Cl", bonds: []},
		{symbol: "Cl", bonds: []},
		{symbol: "Cl", bonds: []},
		{symbol: "Cl", bonds: []}
	],
	net_formal_charge: 0
}; */

/* molecule = {
	atoms: [
		{symbol: "C", bonds: []}, //0
		{symbol: "H", bonds: [0]}, //1
		{symbol: "O", bonds: [0]}, //2
		
		{symbol: "C", bonds: [0]}, //3
		{symbol: "Cl", bonds: [3]}, //4
		{symbol: "H", bonds: [3]}, //5
		
		{symbol: "C", bonds: [3]}, //6
		{symbol: "H", bonds: [6]}, //7
		{symbol: "Cl", bonds: [6]}, //8
		
		{symbol: "C", bonds: [6]}, //9
		{symbol: "H", bonds: [9]}, //10
		{symbol: "O", bonds: [9]}, //11
	],
	net_formal_charge: 0
}; */

/* solve({
	atoms: [
		{symbol: "C", bonds: []}, //0
		{symbol: "H", bonds: [0]}, //1
		{symbol: "O", bonds: [0]}, //2
		
		{symbol: "C", bonds: [0]}, //3
		{symbol: "Cl", bonds: [3]}, //4
		{symbol: "H", bonds: [3]}, //5
		
		{symbol: "C", bonds: [3]}, //6
		{symbol: "H", bonds: [6]}, //7
		{symbol: "Cl", bonds: [6]}, //8
		
		{symbol: "C", bonds: [6]}, //9
		{symbol: "H", bonds: [9]}, //10
		{symbol: "O", bonds: [9]}, //11
	],
	net_formal_charge: 0
}); */

//parse_and_run("CCl4");
let message_box = document.querySelector("#message_box");
function parse_and_run(formula, charge) {
	document.querySelector("main").remove();
	message_box.innerText = "computing lewis structure...";
	setTimeout(async function(){
		if (formula == "") return;
		//umm maybe sanitize input even more. like what if we are given something that isnt even a formula
		let results = solve(formula, charge);
		for (let i = 0; i < 1000; i++) {
			let new_results = solve(formula, charge);
			if (new_results.problematic_score < results.problematic_score) results = new_results;
		}
		message_box.innerText = "drawing lewis structure...";
		//do the draw thing
		setTimeout(async function(){
			let best = {overlap: Number.MAX_SAFE_INTEGER};
			//for (let attempts = 0; attempts < 100 || best.overlap > 100000; attempts++) {
			while (best.overlap > 100000) {
				let new_attempt = try_draw(results.molecule);
				if (new_attempt.overlap < best.overlap) best = new_attempt;
			}
			message_box.innerText = "";
			document.body.appendChild(best.main);
		});

	});
}

function solve(formula, charge) {
	let atom_counts = symbol_to_atom_counts(formula);
	let molecule = {
		atoms: [],
		net_formal_charge: charge
	};
	for (let element of Object.keys(atom_counts)) for (let i = 0; i < atom_counts[element]; i++) {
		molecule.atoms.push({symbol: element, bonds: []});
	}
	
	//find how many electrons each atom brings
	for (let atom of molecule.atoms) {
		atom.atom_object = symbol_to_element_object(atom.symbol);
		let group = atom.atom_object.group;
		let brings = 2; //for the d and f blocks. very awkward
		if (group <= 2) brings = group;
		if (group >= 13) brings = group - 10;
		atom.brings = brings;
	}

	for (let atom of molecule.atoms) atom.lone_electrons = 0;
	
	//sort the molecules so that carbon-core things are in the middle
	molecule.atoms.sort((a, b) => inherent_closeness_to_octet(b) - inherent_closeness_to_octet(a));
	
	for (let i = 1; i < molecule.atoms.length; i++) molecule.atoms[i].bonds.push(Math.floor(Math.random()*i/2)); //THIS IS BAD!!! the way we connect this molecule shouldnt just be random you idiot

	//turn bonds from index arrays into actual {atoms: [a, b], order: 0}
	//the two sides of the atom most hold the same bond object!!!
	//atoms list within bond object is unordered. theres a helper function to find the Other atom if u give it the atom you are currently on
	for (let i = 0; i < molecule.atoms.length; i++) {
		for (let j = i+1; j < molecule.atoms.length; j++) {
			if (molecule.atoms[i].bonds.includes(j) || molecule.atoms[j].bonds.includes(i)) {
				//i and j ARE connected. sever their fake number link
				molecule.atoms[i].bonds = remove_value(molecule.atoms[i].bonds, j);
				molecule.atoms[j].bonds = remove_value(molecule.atoms[j].bonds, i);
				//make the real links
				let the_bond = {
					atoms: [molecule.atoms[i], molecule.atoms[j]],
					order: 0
				};
				molecule.atoms[i].bonds.push(the_bond);
				molecule.atoms[j].bonds.push(the_bond);
			}
		}
	}

	//sort the real actual atom list for number of bonds (roughly corresponds to centrality. goes outer to inner)
	molecule.atoms.sort((a, b) => a.bonds.length - b.bonds.length);

	//find number of electrons that need to be assigned at some point
	let electrons_in_molecule = 0 - molecule.net_formal_charge;
	for (let atom of molecule.atoms) electrons_in_molecule += atom.brings;
	let electrons_to_assign = electrons_in_molecule;

	//put electrons into bonds to get them to order one
	for (let atom of molecule.atoms) for (let bond of atom.bonds) {
		if (bond.order == 0) {
			bond.order++;
			electrons_to_assign -= 2;
		}
	}

	//going from outside to inside, just assign electrons to satisfy octets
	for (let atom of molecule.atoms) {
		while (!satisfied_octet(atom) && electrons_to_assign) {
			atom.lone_electrons++;
			electrons_to_assign--;
		}
	}

	//if we have leftover electrons, try really hard to find expandable octets. especially among positive formal charge atoms
	while (electrons_to_assign >= 2) {
		let atoms_from_positive_to_negative_charge = molecule.atoms.toSorted((b, a) => atom_formal_charge(a) - atom_formal_charge(b));
		//we have this list. we should add 2 to the most positive atom, if it can take it.
		//if it can't, we keep going through list until that can happen.
		//if we ever go through whole list without making any improvements, break out of this while
		let any_improvements = false;
		for (let atom of atoms_from_positive_to_negative_charge) {
			if (how_much_can_octet_expand(atom) >= 2 && electrons_to_assign >= 2) {
				atom.lone_electrons += 2;
				electrons_to_assign -= 2;
				any_improvements = true;
				break;
			}
		}
		if (!any_improvements) break;
	}
		
	//sweep around atoms. if i have negative charge, >=2 lone electrons, and know someone with positive charge, let's turn that into a stronger bond. (unless that other atom cannot have more)
	{
		let any_effect = true;
		while (any_effect) {
			any_effect = false;
			for (let atom of molecule.atoms) {
				for (let bond of atom.bonds) {
					let partner = bond_other_atom(atom, bond);
					if (atom_formal_charge(partner) > 0 && atom_formal_charge(atom) < 0 && atom.lone_electrons >= 2 && can_take_more_electrons(partner)>=2) {
						atom.lone_electrons -= 2;
						bond.order++;
						any_effect = true;
					}
				}
			}
		}
	}
	
	//OK FINAL CHECK: if anything sucks super bad. um sorry, try again i guess
	let problematic_score = 0
	//unassigned electron
	if (electrons_to_assign != 0) problematic_score += 1000000;
	for (let atom of molecule.atoms) {
		//literally exceeding octet
		if (too_many_electrons(atom)) problematic_score += 1000000;
		//undersatisfied octet
		if (can_take_more_electrons(atom)) problematic_score += 1000000;
		//formal charges (tiny problem)
		problematic_score += Math.abs(atom_formal_charge(atom));
		//using expanded octets (even tinier problem)
		problematic_score += Math.max(atom_electrons_felt(atom)-8, 0);
	}
	//TODO else check that negative charges are on the electronegative atoms
	
	return {molecule: molecule, problematic_score: problematic_score};
}

function try_draw(molecule) {
	let main = document.createElement("main");
	let first_choice_atom = molecule.atoms[molecule.atoms.length-1];
	first_choice_atom.x = 0;
	first_choice_atom.y = 0;
	let draw_queue = [{
		atom: first_choice_atom,
		//coming_from_angle: Math.random() * 2 * Math.PI,
		coming_from_angle: 0,
		previous_atom: null
	}];
	//function draw_atom(atom, coming_from_angle, x, y, previous_atom) {
	while (draw_queue.length) {
		//STUPID QUEUE SYSTEM BECAUSE MY RECURSIVE FUNCTIONS ARENT WORKING
		let queue_item = draw_queue.shift();
		let [atom, coming_from_angle, x, y, previous_atom] = [queue_item.atom, queue_item.coming_from_angle, queue_item.atom.x, queue_item.atom.y, queue_item.previous_atom];
		//make an element
		atom.element = main.appendChild(document.createElement("div"));
		atom.element.setAttribute("class", "atom");
		atom.element.innerText = atom.symbol;
		let formal_charge = atom_formal_charge(atom);
		//if (formal_charge != 0) atom.element.innerHTML += "<sup>"+(Math.abs(formal_charge)<2?"":Math.abs(formal_charge))+(formal_charge<0?"-":"+")+"</sup>";
		atom.element.style.left = x + "rem";
		atom.element.style.top = y + "rem";
		//atom.element.style.backgroundColor = atom.atom_object.color;
		atom.x = x;
		atom.y = y;
		let steric = steric_number(atom);
		//compile list of other things to draw
		things_to_draw = atom.bonds.filter((bond) => !bond.atoms.includes(previous_atom));
		shuffle(things_to_draw);
		for (let i = 0; i < atom.lone_electrons - 1; i += 2) things_to_draw.push(2);
		if (atom.lone_electrons % 2) things_to_draw.push(1);
		//create the set of new angles where are things to draw should be put
		let angles_to_do = [];
		for (let i = 0; i < things_to_draw.length; i++) angles_to_do.push((coming_from_angle + Math.PI + Math.PI*2*(i+1)/steric) % (Math.PI * 2));
		shuffle(angles_to_do);
		for (let thing_to_draw of things_to_draw) {
			let distance_amplitude = typeof(thing_to_draw) == "number" ? 1.5 : 5;
			//find the best angle to draw this thing at
			let angle = 0;
			let largest_min_distance = 0; //largest min distance == furthest away from other stuff
			for (let possible_angle of angles_to_do) {
				let [possible_x, possible_y] = [x + distance_amplitude * Math.cos(possible_angle), y + distance_amplitude * Math.sin(possible_angle)]; //position of this link
				let min_distance = Number.MAX_SAFE_INTEGER;
				for (let other_atom of molecule.atoms) if (other_atom.x != undefined) min_distance = Math.min(min_distance, Math.hypot(other_atom.x - possible_x, other_atom.y - possible_y));
				if (min_distance > largest_min_distance) [angle, largest_min_distance] = [possible_angle, min_distance];
			}
			angles_to_do = remove_value(angles_to_do, angle);
			if (typeof(thing_to_draw) == "number") {
				//draw a lone pair/electron here
				let lone = main.appendChild(document.createElement("div"));
				lone.setAttribute("class", "lone");
				lone.innerText = {2:":",1:"·"}[thing_to_draw];
				lone.style.left = x + distance_amplitude * Math.cos(angle) + "rem";
				lone.style.top = y + distance_amplitude * Math.sin(angle) + "rem";
				lone.style.rotate = angle + "rad";
			} else {
				//draw line and the next atom
				let new_x = x + distance_amplitude * Math.cos(angle);
				let new_y = y + distance_amplitude * Math.sin(angle);
				let order = thing_to_draw.order;
				for (let o = 0; o < order; o++) {
					let altitude = (o - (order-1)*0.5) * 0.5;
					let perp_angle = angle + Math.PI / 2;
					//all the coords will be moved by alt * cis(perp_angle)
					make_hr(x + altitude * Math.cos(perp_angle), y + altitude * Math.sin(perp_angle), new_x + altitude * Math.cos(perp_angle), new_y + altitude * Math.sin(perp_angle));
				}
				let partner = bond_other_atom(atom, thing_to_draw);
				//WHEN WE PUT THINGS IN DRAW QUEUE!!! make their atom objects have their x position so we can start using that info already!
				partner.x = new_x;
				partner.y = new_y;
				draw_queue.push({
					atom: partner,
					coming_from_angle: angle,
					previous_atom: atom
				});
			}
		}
	}
	function make_hr(x1, y1, x2, y2, ratio) {
		let centerx = (x1+x2) / 2;
		let centery = (y1+y2) / 2;
		let hr = main.appendChild(document.createElement("hr"));
		hr.style.top = centery+0.45 + "rem";
		hr.style.left = centerx-1.55 + "rem";
		hr.style.width = Math.hypot(x2-x1, y2-y1) + "rem";
		//this altitude is messed up because of transformation orders. i hate that for me
		//hr.style.transform = "translateY("+altitude+"rem) rotate("+(Math.PI/2-Math.atan2(x2-x1, y2-y1))+"rad)";
		hr.style.rotate = Math.PI/2 - Math.atan2(x2-x1, y2-y1) + "rad";
		//hr.style.borderWidth = order*order * 0.0625 + "rem";
	}
	let overlap = 0;
	for (let i = 0; i < molecule.atoms.length; i++) for (let j = i+1; j < molecule.atoms.length; j++) {
		let [atom_i, atom_j] = [molecule.atoms[i], molecule.atoms[j]];
		let distance = Math.hypot(atom_i.x - atom_j.x, atom_i.y - atom_j.y);
		if (distance < 3) overlap += 100000;
		if (distance < 5) overlap += 5;
		if (distance < 7) overlap++;
		if (distance < 9) overlap++;
	}
	//make height-width of main to be 2rem + the difference between most and least coordinate
	let [least_x, most_x, least_y, most_y] = [0, 0, 0, 0];
	for (let atom of molecule.atoms) {
		least_x = Math.min(least_x, atom.x);
		most_x = Math.max(most_x, atom.x);
		least_y = Math.min(least_y, atom.y);
		most_y = Math.max(most_y, atom.y);
	}
	main.style.transform = "translate(-50%, -50%) translate("+(-1 - 0.5*most_x - 0.5*least_x)+"rem, "+(-1 - 0.5*most_y - 0.5*least_y)+"rem)";
	
	return {main: main, overlap: overlap};
}

function shuffle(r){for(var a=r.length-1;0<a;a--){var f=Math.floor(Math.random()*(a+1)),o=r[a];r[a]=r[f],r[f]=o}}

function satisfied_octet(atom) {
	let electrons_felt = atom.lone_electrons;
	for (let bond of atom.bonds) electrons_felt += bond.order * 2;
	if (atom.atom_object.period == 1) return electrons_felt == 2;
	if (atom.atom_object.z <= 14) return electrons_felt == 8;
	return electrons_felt >= 8; //is there any upper limit on the expanded octet rule???
}

function how_much_can_octet_expand(atom) {
	if (atom.atom_object.z <= 14) return 0;
	let electrons_felt = atom.lone_electrons;
	for (let bond of atom.bonds) electrons_felt += bond.order * 2;
	return 18 - electrons_felt;
}

function inherent_closeness_to_octet(atom) { //based off of BRINGS. ranks fluorine(1) = hydrogen(1) < oxygen(2) < nitrogen < carbon. doesn't consider expanded octets
	if (atom.atom_object.period == 1) return 2 - atom.brings;
	return 8 - atom.brings;
	//maybe for super big atoms, up the number?? we want Xe to seem more central in XeI2
}

function can_take_more_electrons(atom) { //returns number of electrons more this atom can take
	let electrons_felt = atom.lone_electrons;
	for (let bond of atom.bonds) electrons_felt += bond.order * 2;
	if (atom.atom_object.period == 1) return 2 - electrons_felt;
	if (atom.atom_object.z <= 14) return 8 - electrons_felt;
	return 18 - electrons_felt; //is there any upper limit on the expanded octet rule???
}

function too_many_electrons(atom) {
	let electrons_felt = atom.lone_electrons;
	for (let bond of atom.bonds) electrons_felt += bond.order * 2;
	if (atom.atom_object.period == 1) return electrons_felt > 2;
	if (atom.atom_object.z <= 14) return electrons_felt > 8;
	return electrons_felt > 18; //is there any upper limit on the expanded octet rule???
}

function atom_formal_charge(atom) {
	let immediate_electrons = atom.lone_electrons;
	for (let bond of atom.bonds) immediate_electrons += bond.order;
	return atom.brings - immediate_electrons;
}

//TODO: use this as helper function in others
function atom_electrons_felt(atom) {
	let electrons_felt = atom.lone_electrons;
	for (let bond of atom.bonds) electrons_felt += bond.order * 2;
	return electrons_felt;
}

function lewis_text(molecule = molecule) {
	let text = [];
	for (let atom of molecule.atoms) {
		let str = atom.symbol + " ";
		for (let i = 0; i < atom.lone_electrons - 1; i += 2) str += ":";
		if (atom.lone_electrons % 2) str += ".";
		for (let bond of atom.bonds) {
			str += " " + "*-=≡≣".charAt(bond.order) + bond_other_atom(atom, bond).symbol;
		}
		if (atom_formal_charge(atom) != 0) str += " (charge "+atom_formal_charge(atom)+")";
		text.push(str);
	}
	return text.join("\n");
}

function bond_other_atom(my_atom, bond) {
	if (bond.atoms[0] == my_atom) return bond.atoms[1];
	return bond.atoms[0];
}
function remove_value(arr, val) {return arr.filter(function(e) {return e != val;});}

function are_bonded(atom_a, atom_b) {
	for (let bond of atom_a.bonds) if (bond.atoms.includes(atom_b)) return true;
	return false;
}
function steric_number(atom) {
	return Math.ceil(atom.lone_electrons / 2) + atom.bonds.length;
}