//based off of this
// https://www.reddit.com/r/AnarchyChess/comments/uwm5l8/you_know_what_fuck_you_league_of_legends_chess/

c.rook = {
	name: "rook",
	letter: "t",
	worth: 500,
	moves: [
		{type: "normal", motion: [0, 1]},
		{type: "normal", motion: [0, -1]},
		{type: "normal", motion: [-1, 0]},
		{type: "normal", motion: [1, 0]}
	]
};
c.bishop = {
	name: "bishop",
	letter: "v",
	worth: 300,
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
	worth: 900,
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
	worth: 9999999,
	royal: true,
	moves: [
		{type: "normal", motion: [1, 1], limit: 1},
		{type: "normal", motion: [1, -1], limit: 1},
		{type: "normal", motion: [-1, 1], limit: 1},
		{type: "normal", motion: [-1, -1], limit: 1},
		{type: "normal", motion: [0, 1], limit: 1},
		{type: "normal", motion: [0, -1], limit: 1},
		{type: "normal", motion: [-1, 0], limit: 1},
		{type: "normal", motion: [1, 0], limit: 1},
		{type: "castle", motion: [1, 0], friend: "rook", condition: {max_uses: 0}},
		{type: "castle", motion: [-1, 0], friend: "rook", condition: {max_uses: 0}}
	]
};
c.knight = {
	name: "knight",
	letter: "m",
	worth: 300,
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
	letter: "o",
	worth: 100,
	promote: true,
	moves: [
		{type: "peaceful", motion: [0, 1], limit: 2, condition: {max_uses: 0}},
		{type: "peaceful", motion: [1, 0], limit: 2, condition: {max_uses: 0}},
		{type: "capture", motion: [1, 1], limit: 2, condition: {max_uses: 0}},
		{type: "peaceful", motion: [0, 1], limit: 1},
		{type: "peaceful", motion: [1, 0], limit: 1},
		{type: "capture", motion: [1, 1], limit: 1}
	]
};

white_rook = {team: 0, direction: 0, uses: 0, type: c.rook};
black_rook = {team: 1, direction: 2, uses: 0, type: c.rook};
white_bish = {team: 0, direction: 0, uses: 0, type: c.bishop};
black_bish = {team: 1, direction: 2, uses: 0, type: c.bishop};
white_quee = {team: 0, direction: 0, uses: 0, type: c.queen};
black_quee = {team: 1, direction: 2, uses: 0, type: c.queen};
white_king = {team: 0, direction: 0, uses: 0, type: c.king};
black_king = {team: 1, direction: 2, uses: 0, type: c.king};
white_knig = {team: 0, direction: 0, uses: 0, type: c.knight};
black_knig = {team: 1, direction: 2, uses: 0, type: c.knight};
white_pawn = {team: 0, direction: 0, uses: 0, type: c.pawn};
black_pawn = {team: 1, direction: 2, uses: 0, type: c.pawn};
white_paw4 = {team: 0, direction: 0, uses: 0, type: c.pawn4};
black_paw4 = {team: 1, direction: 2, uses: 0, type: c.pawn4};

let map = "           PPRBK" +
          "           PPPBQ" +
          "  #########PNPPR" +
          "  #########PPNPP" +
          "  ######## PPPPP" +
          "  #######   ##  " +
          "  ######   ###  " +
          "  #####   ####  " +
					"  ####   #####  " +
          "  ###   ######  " +
          "  ##   #######  " +
          "ppppp ########  " +
          "ppnpp#########  " +
          "rppnp#########  " +
          "qbppp           " +
          "kbrpp           ";

let map_map = {
	" ": empty_cell,
	"#": oob_cell,
	"p": white_pawn,
	"P": black_pawn,
	"k": white_king,
	"K": black_king,
	"q": white_quee,
	"Q": black_quee,
	"b": white_bish,
	"B": black_bish,
	"r": white_rook,
	"R": black_rook,
	"n": white_knig,
	"N": black_knig,
}

for (let row = 0; row < 16; row++) {
	let r = [];
	for (let col = 0; col < 16; col++) {
		let character = map.charAt(row*16+col);
		r.push(map_map[character]);
	}
	board.push(r);
}

start_game();