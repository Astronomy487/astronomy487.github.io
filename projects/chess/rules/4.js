gamerules["4"] = {
	name: "4 Players",
	description: "",
	establish() {
		board = [];

		let map = "###rnbkqbnr######pppppppp######        ###rp          prnp          pnbp          pbkp          pkqp          pqbp          pbnp          pnrp          pr###        ######pppppppp######rnbkqbnr###".split("");

		let map_map = {
			r: c.rook,
			n: c.knight,
			b: c.bishop,
			q: c.queen,
			k: c.king,
			p: c.pawn
		};

		for (let row = 0; row < 14; row++) {
			board[row] = [];
			for (let col = 0; col < 14; col++) {
				let character = map[row*14+col];
				if (character == "#") {
					board[row][col] = oob_cell;
				} else if (character == " ") {
					board[row][col] = empty_cell;
				} else {
					let team = 0;
					if (row > 11) team = 0;
					if (col > 11) team = 1;
					if (row < 3) team = 2;
					if (col < 3) team = 3;
					board[row][col] = {team: team, direction: team, state: 0, type: map_map[character]};
				}
			}
		}
	}
};