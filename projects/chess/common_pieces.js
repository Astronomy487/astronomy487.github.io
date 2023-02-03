/*

Every instance of a piece on the board contains these attributes
- team: the team of the piece. 0=white, 1=black...
- direction: direction of the piece's movement. 0=up, 1=left, 2=down, 3=right
- state: starts at 0. rules can check/alter this state for conditional rules
- type: points to object in piece catalogue

Every piece object in the catalogue (c) includes these attributes
- name: a short name
- letter: the displayed letter. currently uses chess cases font. can include a wrapping <span style="transform: rotate()">
- worth: its value (pawn = 1), used for the ai
- moves: an array of move objects

Each move object includes these attributes (* denotes optional)
- type {normal, capture, peaceful, ranged, convert, castle}. this partially defines its behavior
	- if normal, it can move or capture
	- if capture, it MUST capture (like diagonal pawns)
	- if peaceful, it can only go to empty spot (like forward pawns)
	- if ranged, it can hit the offset tile but does not move
	- if convert, it converts the offset tile to its own team
	- if castle, it seeks for a "friend" (property of move) along the offset, and shuffles with it if found. see c.king.moves for how this is implemented
- motion: an [x, y] vector for the offset for this move
- *limit: the maximum number of times this movement can be made in a turn. for infinitely sliding pieces, limit is undefined
- *void_condition: if provided, an [x, y] offset that must be out of bounds for this move to be valid
- *mandatory_collateral: if provided, an [x, y] offset that must be an opponent piece that will be killed also. can also include piece type of opponent and opponent
- *required_state: a state this piece must be in to take this move
- *new_state: the new state this piece will become after this move happens

*/
let c = {}; //piece catalogue

c.rook = {
	name: "rook",
	letter: "t",
	worth: 5,
	moves: [
		{type: "normal", motion: [0, 1], new_state: 1},
		{type: "normal", motion: [0, -1], new_state: 1},
		{type: "normal", motion: [-1, 0], new_state: 1},
		{type: "normal", motion: [1, 0], new_state: 1}
	]
};
c.bishop = {
	name: "bishop",
	letter: "v",
	worth: 3,
	moves: [
		{type: "normal", motion: [1, 1]},
		{type: "normal", motion: [1, -1]},
		{type: "normal", motion: [-1, 1]},
		{type: "normal", motion: [-1, -1]}
	]
};
c.queen = {
	name: "queen",
	letter: "w",
	worth: 9,
	moves: [
		{type: "normal", motion: [1, 1]},
		{type: "normal", motion: [1, -1]},
		{type: "normal", motion: [-1, 1]},
		{type: "normal", motion: [-1, -1]},
		{type: "normal", motion: [0, 1]},
		{type: "normal", motion: [0, -1]},
		{type: "normal", motion: [-1, 0]},
		{type: "normal", motion: [1, 0]}
	]
};
c.king = {
	name: "king",
	letter: "l",
	worth: 100,
	royal: true,
	moves: [
		{type: "normal", motion: [1, 1], limit: 1, new_state: 1},
		{type: "normal", motion: [1, -1], limit: 1, new_state: 1},
		{type: "normal", motion: [-1, 1], limit: 1, new_state: 1},
		{type: "normal", motion: [-1, -1], limit: 1, new_state: 1},
		{type: "normal", motion: [0, 1], limit: 1, new_state: 1},
		{type: "normal", motion: [0, -1], limit: 1, new_state: 1},
		{type: "normal", motion: [-1, 0], limit: 1, new_state: 1},
		{type: "normal", motion: [1, 0], limit: 1, new_state: 1},
		{type: "castle", motion: [1, 0], friend: "rook", required_state: 0, new_state: 1},
		{type: "castle", motion: [-1, 0], friend: "rook", required_state: 0, new_state: 1}
	]
};
c.knight = {
	name: "knight",
	letter: "m",
	worth: 3,
	moves: [
		{type: "normal", motion: [2, 1], limit: 1},
		{type: "normal", motion: [2, -1], limit: 1},
		{type: "normal", motion: [-2, 1], limit: 1},
		{type: "normal", motion: [-2, -1], limit: 1},
		{type: "normal", motion: [1, 2], limit: 1},
		{type: "normal", motion: [1, -2], limit: 1},
		{type: "normal", motion: [-1, 2], limit: 1},
		{type: "normal", motion: [-1, -2], limit: 1}
	]
};
c.pawn = {
	name: "pawn",
	promotes: ["queen"],
	letter: "o",
	worth: 1,
	promote: true,
	moves: [
		{type: "peaceful", motion: [0, 1], limit: 2, required_state: 0, new_state: 2}, //move double forward
		{type: "peaceful", motion: [0, 1], limit: 1, required_state: 1, new_state: 1}, //move single forward on non-0-state
		{type: "peaceful", motion: [0, 1], limit: 1, required_state: 2, new_state: 1}, //move single forward on non-0-state
		{type: "capture", motion: [1, 1], limit: 1, new_state: 1},
		{type: "capture", motion: [-1, 1], limit: 1, new_state: 1},
		{type: "peaceful", motion: [1, 1], limit: 1, mandatory_collateral: [1, 0, "pawn", 2], new_state: 1},
		{type: "peaceful", motion: [-1, 1], limit: 1, mandatory_collateral: [-1, 0, "pawn", 2], new_state: 1}
	]
};

c.wazir = { //1x rook
	name: "wazir",
	letter: "<div style=\"transform: rotate(180deg);\">t</div>",
	worth: 2,
	moves: [
		{type: "normal", motion: [0, 1], limit: 1},
		{type: "normal", motion: [0, -1], limit: 1},
		{type: "normal", motion: [-1, 0], limit: 1},
		{type: "normal", motion: [1, 0], limit: 1}
	]
};
c.ferz = { //1x bishop
	name: "ferz",
	letter: "<div style=\"transform: rotate(180deg);\">v</div>",
	worth: 2,
	moves: [
		{type: "normal", motion: [1, 1], limit: 1},
		{type: "normal", motion: [-1, -1], limit: 1},
		{type: "normal", motion: [-1, 1], limit: 1},
		{type: "normal", motion: [1, -1], limit: 1}
	]
};
c.dabbaba = { //2x rook
	name: "dabbaba",
	letter: "<div style=\"transform: rotate(90deg);\">t</div>",
	worth: 4,
	moves: [
		{type: "normal", motion: [0, 2], limit: 1},
		{type: "normal", motion: [0, -2], limit: 1},
		{type: "normal", motion: [-2, 0], limit: 1},
		{type: "normal", motion: [2, 0], limit: 1}
	]
};
c.alfil = { //2x bishop
	name: "alfil",
	letter: "<div style=\"transform: rotate(90deg);\">v</div>",
	worth: 2,
	moves: [
		{type: "normal", motion: [2, 2], limit: 1},
		{type: "normal", motion: [-2, -2], limit: 1},
		{type: "normal", motion: [-2, 2], limit: 1},
		{type: "normal", motion: [2, -2], limit: 1}
	]
};

c.pawn.promotes = [c.queen, c.bishop, c.rook, c.knight];

let white_rook = {team: 0, direction: 0, state: 0, type: c.rook};
let black_rook = {team: 1, direction: 2, state: 0, type: c.rook};
let white_bish = {team: 0, direction: 0, state: 0, type: c.bishop};
let black_bish = {team: 1, direction: 2, state: 0, type: c.bishop};
let white_quee = {team: 0, direction: 0, state: 0, type: c.queen};
let black_quee = {team: 1, direction: 2, state: 0, type: c.queen};
let white_king = {team: 0, direction: 0, state: 0, type: c.king};
let black_king = {team: 1, direction: 2, state: 0, type: c.king};
let white_knig = {team: 0, direction: 0, state: 0, type: c.knight};
let black_knig = {team: 1, direction: 2, state: 0, type: c.knight};
let white_pawn = {team: 0, direction: 0, state: 0, type: c.pawn};
let black_pawn = {team: 1, direction: 2, state: 0, type: c.pawn};

function board_from_simple_fen(fen) {
	let map_map = {
		" ": empty_cell,
		"#": oob_cell,
		"p": black_pawn,
		"P": white_pawn,
		"k": black_king,
		"K": white_king,
		"q": black_quee,
		"Q": white_quee,
		"b": black_bish,
		"B": white_bish,
		"r": black_rook,
		"R": white_rook,
		"n": black_knig,
		"N": white_knig,
	}
	fen = fen.replaceAll("1", " ");
	fen = fen.replaceAll("2", "  ");
	fen = fen.replaceAll("3", "   ");
	fen = fen.replaceAll("4", "    ");
	fen = fen.replaceAll("5", "     ");
	fen = fen.replaceAll("6", "      ");
	fen = fen.replaceAll("7", "       ");
	fen = fen.replaceAll("8", "        ");
	fen = fen.replaceAll("9", "         ");
	let b = [];
	for (row of fen.split("/")) {
		let r = [];
		for (character of row.split(""))
			r.push(map_map[character]);
		b.push(r);
	}
	return b;
}