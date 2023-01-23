rules_name = "Double (16x12)";
rules_description = "An absurdly large 16x12 game. Each team has two kings, both of which must stay protected.";

c.pawn4 = { //can move forward 4
	name: "pawn",
	letter: "o",
	worth: 100,
	promote: true,
	moves: [
		{type: "peaceful", motion: [0, 1], limit: 4, condition: {max_uses: 0}},
		{type: "peaceful", motion: [0, 1], limit: 1},
		{type: "capture", motion: [1, 1], limit: 1},
		{type: "capture", motion: [-1, 1], limit: 1}
	]
};

let white_paw4 = {team: 0, direction: 0, uses: 0, type: c.pawn4};
let black_paw4 = {team: 1, direction: 2, uses: 0, type: c.pawn4};


board = [
	[black_rook, black_knig, black_bish, black_quee, black_king, black_bish, black_knig, black_rook, black_rook, black_knig, black_bish, black_quee, black_king, black_bish, black_knig, black_rook],
	[black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4, black_paw4],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4, white_paw4],
	[white_rook, white_knig, white_bish, white_quee, white_king, white_bish, white_knig, white_rook, white_rook, white_knig, white_bish, white_quee, white_king, white_bish, white_knig, white_rook]
];