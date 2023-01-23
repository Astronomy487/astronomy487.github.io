gamerules.checkers = {
	name: "Checkers",
	description: "",
	establish() {
		c.checker = {
			name: "piece",
			letter: ".",
			worth: 1,
			moves: [
				{type: "peaceful", motion: [2, 2], limit: 1, condition: {mandatory_collateral: [1, 1]}},
				{type: "peaceful", motion: [-2, 2], limit: 1, condition: {mandatory_collateral: [-1, 1]}},
				{type: "peaceful", motion: [1, 1], limit: 1},
				{type: "peaceful", motion: [-1, 1], limit: 1}
			]
		};

		white_pawn.type = c.checker;
		black_pawn.type = c.checker;

		board = [
			[empty_cell, black_pawn, empty_cell, black_pawn, empty_cell, black_pawn, empty_cell, black_pawn],
			[black_pawn, empty_cell, black_pawn, empty_cell, black_pawn, empty_cell, black_pawn, empty_cell],
			[empty_cell, black_pawn, empty_cell, black_pawn, empty_cell, black_pawn, empty_cell, black_pawn],
			[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
			[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
			[white_pawn, empty_cell, white_pawn, empty_cell, white_pawn, empty_cell, white_pawn, empty_cell],
			[empty_cell, white_pawn, empty_cell, white_pawn, empty_cell, white_pawn, empty_cell, white_pawn],
			[white_pawn, empty_cell, white_pawn, empty_cell, white_pawn, empty_cell, white_pawn, empty_cell],
		];
	}
};