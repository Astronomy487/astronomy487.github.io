gamerules.puzzle = {
	name: "Crossword",
	description: "Chess except it has random holes in the middle like a crossword puzzle.",
	establish() {
		function make_crossword() {
			board = [
				[black_rook, black_knig, black_bish, black_quee, black_king, black_bish, black_knig, black_rook],
				[black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn],
				[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
				[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
				[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
				[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
				[white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn],
				[white_rook, white_knig, white_bish, white_quee, white_king, white_bish, white_knig, white_rook],
			];

			//redefine special pawns that sit before the void
			c.pawn.moves = [
				{type: "peaceful", motion: [0, 1], limit: 2, required_state: 0, new_state: 2}, //move double forward
				{type: "peaceful", motion: [0, 2], limit: 1, required_state: 0, new_state: 2, void_condition: [0, 1]}, //move double forward, when void
				{type: "peaceful", motion: [0, 1], limit: 1, required_state: 1, new_state: 1}, //move single forward on non-0-state
				{type: "peaceful", motion: [0, 1], limit: 1, required_state: 2, new_state: 1}, //move single forward on non-0-state
				{type: "capture", motion: [1, 1], limit: 1, new_state: 1},
				{type: "capture", motion: [-1, 1], limit: 1, new_state: 1},
				{type: "peaceful", motion: [1, 1], limit: 1, new_state: 1, void_condition: [0, 1]}, //peaceful diagonal when void
				{type: "peaceful", motion: [-1, 1], limit: 1, new_state: 1,  void_condition: [0, 1]}, //peaceful diagonal when void
				{type: "peaceful", motion: [1, 1], limit: 1, mandatory_collateral: [1, 0, "pawn", 2]},
				{type: "peaceful", motion: [-1, 1], limit: 1, mandatory_collateral: [-1, 0, "pawn", 2]}
			];
			white_pawn.type = c.pawn;
			black_pawn.type = c.pawn;


			let done_columns = [];
			for (let it = 0; it < 3; it++) {
				let r = Math.floor(Math.random()*2);
				let c = Math.floor(Math.random()*8);
				if (board[2+r][c] == oob_cell || done_columns.includes(c)) {it--; continue;}
				done_columns.push(c);
				board[2+r][c] = oob_cell;
				board[5-r][7-c] = oob_cell;
			}
		}

		do make_crossword(); while (board[2].join("").includes("000") || board[2].join("").startsWith("00") || board[2].join("").endsWith("00") || board[3].join("").includes("000") || board[3].join("").startsWith("00") || board[3].join("").endsWith("00"));
	}
};