const empty_cell = 1;
const oob_cell = 0; //important that this casts to false

let board = [];
let team_rotations;

let teams;
let turn; //whose turn it currently is
let available_moves; //available moves to current turn
let selection = null; //select piece before acting on it. [row, col]
let team_names = "white black red blue green".split(" ");

function start_game() {
	//board, team_rotations have been initialized
	teams = team_rotations.length;
	turn = -1;
	//create board
	{
		let html = "";
		for (let row_count = 0; row_count < board.length; row_count++) {
			let row = board[row_count];
			html += '<tr>';
			for (let col_count = 0; col_count < row.length; col_count++) {
				let cell = row[col_count];
				html += '<td id="cell_'+row_count+'_'+col_count+'" onclick="click_cell('+row_count+', '+col_count+')">';
				html += '</td>';
			}
			html += '</tr>';
		}
		document.getElementById("display_table").innerHTML = html;
		//any oob cells need to be made white
		for (let row_count = 0; row_count < board.length; row_count++) for (let col_count = 0; col_count < board[row_count].length; col_count++) {
			if (board[row_count][col_count] == oob_cell)
				get_celement(row_count, col_count).setAttribute("oob", "true");
		}
	}
	//dereference anything sus in the board
	board = copy_board(board);
	//start the round
	do_turn();
}

function get_celement(row_count, col_count) {
	return document.getElementById("cell_"+row_count+"_"+col_count);
}

function update_display_all() {
	for (let row_count = 0; row_count < board.length; row_count++) for (let col_count = 0; col_count < board[row_count].length; col_count++) update_display(row_count, col_count);
}
function update_display(row_count, col_count) { //only updates the character inside! square highlighting is handled by highlight_appropriate_squares
	if (board[row_count][col_count]) {
		let cell = board[row_count][col_count];
		get_celement(row_count, col_count).innerHTML = cell.type==undefined ? "" : '<span team="'+cell.team+'">'+cell.type.letter+'</span>';
	}
}

//finds pseudo legal moves from this function
function find_moves(turn, board) {
	//finds the valid moves for player #turn to make
	//each move object is returned with these attributes
	// - source coordinates (piece to activate to cause this)
	// - destination coordinates (space to click to cause this to happen)
	// - result (a new board array that will become the state if this is picked. all new references (except to piece types))
	let moves_list = [];
	for (let row_count = 0; row_count < board.length; row_count++) for (let col_count = 0; col_count < board[row_count].length; col_count++) {
		let cell = board[row_count][col_count];
		//if (cell == empty_cell || cell == oob_cell) continue;
		if (cell.team == turn) {
			//this piece belongs to this team
			for (move of cell.type.moves) {
				//calculate the possible continuations for this piece in this move
				//coordinates in definition are (a, b). use that + rotation to determine d_row and d_col for this piece
				let a = move.motion[0];
				let b = move.motion[1];
				let d_row = [-b, a, b, -a][cell.direction];
				let d_col = [a, -b, -a, b][cell.direction];
				//check conditions to see if the cell can actually move
				if (move.condition != undefined) {
					if (move.condition.max_uses != undefined && cell.uses > move.condition.max_uses) continue;
					//if (move.condition.facing_edge != undefined && move.condition.facing_edge && in_bounds(board, row_count+d_row, col_count+d_col, false)) continue;
				}
				let current_row = row_count + d_row;
				let current_col = col_count + d_col;
				let slide_count = 1;
				while (in_bounds(board, current_row, current_col)) {
					if (move.limit != undefined && slide_count > move.limit) break;
					if (board[current_row][current_col] == empty_cell) { //if in empty
						if (move.type != "capture" && move.type != "ranged" && move.type != "convert") {
							//create possible future around this
							let future_board = copy_board(board);
							future_board[row_count][col_count].uses++;
							future_board[current_row][current_col] = future_board[row_count][col_count];
							future_board[row_count][col_count] = empty_cell;
							moves_list.push({origin: [row_count, col_count], destination: [current_row, current_col], result: future_board});
						}
					} else { //if we have hit a piece
						if (board[current_row][current_col].team != turn && move.type != "peaceful") { //if hitting enemy, and we aren't peaceful
							let future_board = copy_board(board);
							future_board[row_count][col_count].uses++;
							if (move.type == "ranged") {
								future_board[current_row][current_col] = empty_cell;
							} else if (move.type == "convert") {
								future_board[current_row][current_col].team = turn;
								future_board[current_row][current_col].direction = future_board[row_count][col_count].direction;
							} else { //normal piece moves there. no funny
								future_board[current_row][current_col] = future_board[row_count][col_count];
								future_board[row_count][col_count] = empty_cell;
							}
							moves_list.push({origin: [row_count, col_count], destination: [current_row, current_col], result: future_board});
						}
						break; //stop the sliding loop
					}
					current_row += d_row
					current_col += d_col;
					slide_count++;
				}
			}
			//thats all the movements for this piece
		} //end 'is this our piece' conditions
	} //end piece loop
	return moves_list;
}

function do_turn() {
	{
		turn = (turn+1)%teams;
		let css = "";
		css += "table{transform:rotate("+team_rotations[turn]+"deg);}";
		css += "span[team]{transform:rotate(-"+team_rotations[turn]+"deg);}";
		document.getElementById("rotation_css").innerHTML = css;
	}
	update_display_all();
	available_moves = find_moves(turn, board);
	highlight_appropriate_squares();
}

//these functions work with the ui. current board state! no future handling
function click_cell(row, col) {
	if (selection != null && row == selection[0] && col == selection[1]) {
		//deselecting this space
		selection = null;
		sfx("deselect");
	} else if (board[row][col].team == turn) {
		//selecting this new space
		selection = [row, col];
		sfx("select");
	}
	//check to see if this is a valid move from available_moves. if so, accept that future
	if (selection != null) for (move of available_moves) {
		if (move.destination[0] == row && move.destination[1] == col && move.origin[0] == selection[0] && move.origin[1] == selection[1]) {
			board = move.result;
			selection = null;
			sfx("play");
			do_turn();
			return;
		}
	}
	highlight_appropriate_squares();
}

function sfx(noise) {
	console.log(noise);
}

function highlight_appropriate_squares() { //do square highlighting
	for (let row_count = 0; row_count < board.length; row_count++) for (let col_count = 0; col_count < board[row_count].length; col_count++) {
		let highlight_type = "";
		if (board[row_count][col_count].team == turn) highlight_type = "owned"; //we own this piece. we can use it
		get_celement(row_count, col_count).setAttribute("highlight", highlight_type);
	}
	if (selection != null) {
		get_celement(selection[0], selection[1]).setAttribute("highlight", "origin"); //actively selected piece
		for (move of available_moves) if (move.origin[0] == selection[0] && move.origin[1] == selection[1]) {
			get_celement(move.destination[0], move.destination[1]).setAttribute("highlight", "destination");
		}
	}
}

//creates a copy of the board. piece objects are recreated. references to the piece types are maintained.
//used to explore future board states without altering the existing board
function copy_board(board) {
	let new_board = [];
	for (row of board) {
		let new_row = [];
		new_board.push(new_row);
		for (cell of row) {
			if (typeof(cell) == "number") {
				new_row.push(cell);
				continue;
			}
			new_row.push({
				team: cell.team,
				direction: cell.direction,
				uses: cell.uses,
				type: cell.type
			});
		}
	}
	return new_board;
}

function in_bounds(board, row_count, col_count, counting_void = true) {
	if (row_count < 0 || row_count >= board.length) return false;
	if (col_count < 0 || col_count >= board[row_count].length) return false;
	if (board[row_count][col_count] == oob_cell && counting_void) return false;
	return true;
}



/*
MOVE DEFINITION INCLUDES
- type {normal, capture, peaceful, ranged}
- motion
- *limit
- *condition{max_uses}


*/


let type_rook = {
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
let type_bish = {
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
let type_quee = {
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
let type_king = {
	name: "king",
	letter: "l",
	worth: 9999999,
	moves: [
		{type: "normal", motion: [1, 1], limit: 1},
		{type: "normal", motion: [1, -1], limit: 1},
		{type: "normal", motion: [-1, 1], limit: 1},
		{type: "normal", motion: [-1, -1], limit: 1},
		{type: "normal", motion: [0, 1], limit: 1},
		{type: "normal", motion: [0, -1], limit: 1},
		{type: "normal", motion: [-1, 0], limit: 1},
		{type: "normal", motion: [1, 0], limit: 1}
	]
};
let type_knig = {
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
let type_pawn = {
	name: "pawn",
	letter: "o",
	worth: 100,
	moves: [
		{type: "peaceful", motion: [0, 1], limit: 2, condition: {max_uses: 0}},
		{type: "peaceful", motion: [0, 1], limit: 1},
		{type: "capture", motion: [1, 1], limit: 1},
		{type: "capture", motion: [-1, 1], limit: 1}
	]
}
let type_bure = {
	name: "bureaucrat",
	letter: ".",
	worth: 0,
	moves: [
		{type: "peaceful", motion: [-7, -7], limit: 1},{type: "peaceful", motion: [-7, -6], limit: 1},{type: "peaceful", motion: [-7, -5], limit: 1},{type: "peaceful", motion: [-7, -4], limit: 1},{type: "peaceful", motion: [-7, -3], limit: 1},{type: "peaceful", motion: [-7, -2], limit: 1},{type: "peaceful", motion: [-7, -1], limit: 1},{type: "peaceful", motion: [-7, 0], limit: 1},{type: "peaceful", motion: [-7, 1], limit: 1},{type: "peaceful", motion: [-7, 2], limit: 1},{type: "peaceful", motion: [-7, 3], limit: 1},{type: "peaceful", motion: [-7, 4], limit: 1},{type: "peaceful", motion: [-7, 5], limit: 1},{type: "peaceful", motion: [-7, 6], limit: 1},{type: "peaceful", motion: [-7, 7], limit: 1},{type: "peaceful", motion: [-6, -7], limit: 1},{type: "peaceful", motion: [-6, -6], limit: 1},{type: "peaceful", motion: [-6, -5], limit: 1},{type: "peaceful", motion: [-6, -4], limit: 1},{type: "peaceful", motion: [-6, -3], limit: 1},{type: "peaceful", motion: [-6, -2], limit: 1},{type: "peaceful", motion: [-6, -1], limit: 1},{type: "peaceful", motion: [-6, 0], limit: 1},{type: "peaceful", motion: [-6, 1], limit: 1},{type: "peaceful", motion: [-6, 2], limit: 1},{type: "peaceful", motion: [-6, 3], limit: 1},{type: "peaceful", motion: [-6, 4], limit: 1},{type: "peaceful", motion: [-6, 5], limit: 1},{type: "peaceful", motion: [-6, 6], limit: 1},{type: "peaceful", motion: [-6, 7], limit: 1},{type: "peaceful", motion: [-5, -7], limit: 1},{type: "peaceful", motion: [-5, -6], limit: 1},{type: "peaceful", motion: [-5, -5], limit: 1},{type: "peaceful", motion: [-5, -4], limit: 1},{type: "peaceful", motion: [-5, -3], limit: 1},{type: "peaceful", motion: [-5, -2], limit: 1},{type: "peaceful", motion: [-5, -1], limit: 1},{type: "peaceful", motion: [-5, 0], limit: 1},{type: "peaceful", motion: [-5, 1], limit: 1},{type: "peaceful", motion: [-5, 2], limit: 1},{type: "peaceful", motion: [-5, 3], limit: 1},{type: "peaceful", motion: [-5, 4], limit: 1},{type: "peaceful", motion: [-5, 5], limit: 1},{type: "peaceful", motion: [-5, 6], limit: 1},{type: "peaceful", motion: [-5, 7], limit: 1},{type: "peaceful", motion: [-4, -7], limit: 1},{type: "peaceful", motion: [-4, -6], limit: 1},{type: "peaceful", motion: [-4, -5], limit: 1},{type: "peaceful", motion: [-4, -4], limit: 1},{type: "peaceful", motion: [-4, -3], limit: 1},{type: "peaceful", motion: [-4, -2], limit: 1},{type: "peaceful", motion: [-4, -1], limit: 1},{type: "peaceful", motion: [-4, 0], limit: 1},{type: "peaceful", motion: [-4, 1], limit: 1},{type: "peaceful", motion: [-4, 2], limit: 1},{type: "peaceful", motion: [-4, 3], limit: 1},{type: "peaceful", motion: [-4, 4], limit: 1},{type: "peaceful", motion: [-4, 5], limit: 1},{type: "peaceful", motion: [-4, 6], limit: 1},{type: "peaceful", motion: [-4, 7], limit: 1},{type: "peaceful", motion: [-3, -7], limit: 1},{type: "peaceful", motion: [-3, -6], limit: 1},{type: "peaceful", motion: [-3, -5], limit: 1},{type: "peaceful", motion: [-3, -4], limit: 1},{type: "peaceful", motion: [-3, -3], limit: 1},{type: "peaceful", motion: [-3, -2], limit: 1},{type: "peaceful", motion: [-3, -1], limit: 1},{type: "peaceful", motion: [-3, 0], limit: 1},{type: "peaceful", motion: [-3, 1], limit: 1},{type: "peaceful", motion: [-3, 2], limit: 1},{type: "peaceful", motion: [-3, 3], limit: 1},{type: "peaceful", motion: [-3, 4], limit: 1},{type: "peaceful", motion: [-3, 5], limit: 1},{type: "peaceful", motion: [-3, 6], limit: 1},{type: "peaceful", motion: [-3, 7], limit: 1},{type: "peaceful", motion: [-2, -7], limit: 1},{type: "peaceful", motion: [-2, -6], limit: 1},{type: "peaceful", motion: [-2, -5], limit: 1},{type: "peaceful", motion: [-2, -4], limit: 1},{type: "peaceful", motion: [-2, -3], limit: 1},{type: "peaceful", motion: [-2, -2], limit: 1},{type: "peaceful", motion: [-2, -1], limit: 1},{type: "peaceful", motion: [-2, 0], limit: 1},{type: "peaceful", motion: [-2, 1], limit: 1},{type: "peaceful", motion: [-2, 2], limit: 1},{type: "peaceful", motion: [-2, 3], limit: 1},{type: "peaceful", motion: [-2, 4], limit: 1},{type: "peaceful", motion: [-2, 5], limit: 1},{type: "peaceful", motion: [-2, 6], limit: 1},{type: "peaceful", motion: [-2, 7], limit: 1},{type: "peaceful", motion: [-1, -7], limit: 1},{type: "peaceful", motion: [-1, -6], limit: 1},{type: "peaceful", motion: [-1, -5], limit: 1},{type: "peaceful", motion: [-1, -4], limit: 1},{type: "peaceful", motion: [-1, -3], limit: 1},{type: "peaceful", motion: [-1, -2], limit: 1},{type: "peaceful", motion: [-1, -1], limit: 1},{type: "peaceful", motion: [-1, 0], limit: 1},{type: "peaceful", motion: [-1, 1], limit: 1},{type: "peaceful", motion: [-1, 2], limit: 1},{type: "peaceful", motion: [-1, 3], limit: 1},{type: "peaceful", motion: [-1, 4], limit: 1},{type: "peaceful", motion: [-1, 5], limit: 1},{type: "peaceful", motion: [-1, 6], limit: 1},{type: "peaceful", motion: [-1, 7], limit: 1},{type: "peaceful", motion: [0, -7], limit: 1},{type: "peaceful", motion: [0, -6], limit: 1},{type: "peaceful", motion: [0, -5], limit: 1},{type: "peaceful", motion: [0, -4], limit: 1},{type: "peaceful", motion: [0, -3], limit: 1},{type: "peaceful", motion: [0, -2], limit: 1},{type: "peaceful", motion: [0, -1], limit: 1},{type: "peaceful", motion: [0, 1], limit: 1},{type: "peaceful", motion: [0, 2], limit: 1},{type: "peaceful", motion: [0, 3], limit: 1},{type: "peaceful", motion: [0, 4], limit: 1},{type: "peaceful", motion: [0, 5], limit: 1},{type: "peaceful", motion: [0, 6], limit: 1},{type: "peaceful", motion: [0, 7], limit: 1},{type: "peaceful", motion: [1, -7], limit: 1},{type: "peaceful", motion: [1, -6], limit: 1},{type: "peaceful", motion: [1, -5], limit: 1},{type: "peaceful", motion: [1, -4], limit: 1},{type: "peaceful", motion: [1, -3], limit: 1},{type: "peaceful", motion: [1, -2], limit: 1},{type: "peaceful", motion: [1, -1], limit: 1},{type: "peaceful", motion: [1, 0], limit: 1},{type: "peaceful", motion: [1, 1], limit: 1},{type: "peaceful", motion: [1, 2], limit: 1},{type: "peaceful", motion: [1, 3], limit: 1},{type: "peaceful", motion: [1, 4], limit: 1},{type: "peaceful", motion: [1, 5], limit: 1},{type: "peaceful", motion: [1, 6], limit: 1},{type: "peaceful", motion: [1, 7], limit: 1},{type: "peaceful", motion: [2, -7], limit: 1},{type: "peaceful", motion: [2, -6], limit: 1},{type: "peaceful", motion: [2, -5], limit: 1},{type: "peaceful", motion: [2, -4], limit: 1},{type: "peaceful", motion: [2, -3], limit: 1},{type: "peaceful", motion: [2, -2], limit: 1},{type: "peaceful", motion: [2, -1], limit: 1},{type: "peaceful", motion: [2, 0], limit: 1},{type: "peaceful", motion: [2, 1], limit: 1},{type: "peaceful", motion: [2, 2], limit: 1},{type: "peaceful", motion: [2, 3], limit: 1},{type: "peaceful", motion: [2, 4], limit: 1},{type: "peaceful", motion: [2, 5], limit: 1},{type: "peaceful", motion: [2, 6], limit: 1},{type: "peaceful", motion: [2, 7], limit: 1},{type: "peaceful", motion: [3, -7], limit: 1},{type: "peaceful", motion: [3, -6], limit: 1},{type: "peaceful", motion: [3, -5], limit: 1},{type: "peaceful", motion: [3, -4], limit: 1},{type: "peaceful", motion: [3, -3], limit: 1},{type: "peaceful", motion: [3, -2], limit: 1},{type: "peaceful", motion: [3, -1], limit: 1},{type: "peaceful", motion: [3, 0], limit: 1},{type: "peaceful", motion: [3, 1], limit: 1},{type: "peaceful", motion: [3, 2], limit: 1},{type: "peaceful", motion: [3, 3], limit: 1},{type: "peaceful", motion: [3, 4], limit: 1},{type: "peaceful", motion: [3, 5], limit: 1},{type: "peaceful", motion: [3, 6], limit: 1},{type: "peaceful", motion: [3, 7], limit: 1},{type: "peaceful", motion: [4, -7], limit: 1},{type: "peaceful", motion: [4, -6], limit: 1},{type: "peaceful", motion: [4, -5], limit: 1},{type: "peaceful", motion: [4, -4], limit: 1},{type: "peaceful", motion: [4, -3], limit: 1},{type: "peaceful", motion: [4, -2], limit: 1},{type: "peaceful", motion: [4, -1], limit: 1},{type: "peaceful", motion: [4, 0], limit: 1},{type: "peaceful", motion: [4, 1], limit: 1},{type: "peaceful", motion: [4, 2], limit: 1},{type: "peaceful", motion: [4, 3], limit: 1},{type: "peaceful", motion: [4, 4], limit: 1},{type: "peaceful", motion: [4, 5], limit: 1},{type: "peaceful", motion: [4, 6], limit: 1},{type: "peaceful", motion: [4, 7], limit: 1},{type: "peaceful", motion: [5, -7], limit: 1},{type: "peaceful", motion: [5, -6], limit: 1},{type: "peaceful", motion: [5, -5], limit: 1},{type: "peaceful", motion: [5, -4], limit: 1},{type: "peaceful", motion: [5, -3], limit: 1},{type: "peaceful", motion: [5, -2], limit: 1},{type: "peaceful", motion: [5, -1], limit: 1},{type: "peaceful", motion: [5, 0], limit: 1},{type: "peaceful", motion: [5, 1], limit: 1},{type: "peaceful", motion: [5, 2], limit: 1},{type: "peaceful", motion: [5, 3], limit: 1},{type: "peaceful", motion: [5, 4], limit: 1},{type: "peaceful", motion: [5, 5], limit: 1},{type: "peaceful", motion: [5, 6], limit: 1},{type: "peaceful", motion: [5, 7], limit: 1},{type: "peaceful", motion: [6, -7], limit: 1},{type: "peaceful", motion: [6, -6], limit: 1},{type: "peaceful", motion: [6, -5], limit: 1},{type: "peaceful", motion: [6, -4], limit: 1},{type: "peaceful", motion: [6, -3], limit: 1},{type: "peaceful", motion: [6, -2], limit: 1},{type: "peaceful", motion: [6, -1], limit: 1},{type: "peaceful", motion: [6, 0], limit: 1},{type: "peaceful", motion: [6, 1], limit: 1},{type: "peaceful", motion: [6, 2], limit: 1},{type: "peaceful", motion: [6, 3], limit: 1},{type: "peaceful", motion: [6, 4], limit: 1},{type: "peaceful", motion: [6, 5], limit: 1},{type: "peaceful", motion: [6, 6], limit: 1},{type: "peaceful", motion: [6, 7], limit: 1},{type: "peaceful", motion: [7, -7], limit: 1},{type: "peaceful", motion: [7, -6], limit: 1},{type: "peaceful", motion: [7, -5], limit: 1},{type: "peaceful", motion: [7, -4], limit: 1},{type: "peaceful", motion: [7, -3], limit: 1},{type: "peaceful", motion: [7, -2], limit: 1},{type: "peaceful", motion: [7, -1], limit: 1},{type: "peaceful", motion: [7, 0], limit: 1},{type: "peaceful", motion: [7, 1], limit: 1},{type: "peaceful", motion: [7, 2], limit: 1},{type: "peaceful", motion: [7, 3], limit: 1},{type: "peaceful", motion: [7, 4], limit: 1},{type: "peaceful", motion: [7, 5], limit: 1},{type: "peaceful", motion: [7, 6], limit: 1},{type: "peaceful", motion: [7, 7], limit: 1}
	]
};
let type_lase = {
	name: "laser",
	letter: "x",
	worth: 900,
	moves: [
		{type: "ranged", motion: [0, 1]},
		{type: "peaceful", motion: [-1, 0], limit: 1},
		{type: "peaceful", motion: [1, 0], limit: 1}
	]
};
let type_wiza = {
	name: "wizard",
	letter: "x",
	worth: 900,
	moves: [
		{type: "convert", motion: [1, 0], limit: 1},
		{type: "convert", motion: [-1, 0], limit: 1},
		{type: "peaceful", motion: [0, 1], limit: 1},
		{type: "peaceful", motion: [0, -1], limit: 1},
		/*{type: "peaceful", motion: [-1, 0], limit: 1},
		{type: "peaceful", motion: [1, 0], limit: 1},*/
		{type: "peaceful", motion: [-1, 1], limit: 1},
		{type: "peaceful", motion: [-1, -1], limit: 1},
		{type: "peaceful", motion: [1, -1], limit: 1},
		{type: "peaceful", motion: [1, 1], limit: 1}
	]
};
let white_rook = {team: 0, direction: 0, uses: 0, type: type_rook};
let black_rook = {team: 1, direction: 2, uses: 0, type: type_rook};
let white_bish = {team: 0, direction: 0, uses: 0, type: type_bish};
let black_bish = {team: 1, direction: 2, uses: 0, type: type_bish};
let white_quee = {team: 0, direction: 0, uses: 0, type: type_quee};
let black_quee = {team: 1, direction: 2, uses: 0, type: type_quee};
let white_king = {team: 0, direction: 0, uses: 0, type: type_king};
let black_king = {team: 1, direction: 2, uses: 0, type: type_king};
let white_knig = {team: 0, direction: 0, uses: 0, type: type_knig};
let black_knig = {team: 1, direction: 2, uses: 0, type: type_knig};
let white_pawn = {team: 0, direction: 0, uses: 0, type: type_pawn};
let black_pawn = {team: 1, direction: 2, uses: 0, type: type_pawn};
let white_bure = {team: 0, direction: 0, uses: 0, type: type_bure};
let black_bure = {team: 1, direction: 2, uses: 0, type: type_bure};
let white_lase = {team: 0, direction: 0, uses: 0, type: type_lase};
let black_lase = {team: 1, direction: 2, uses: 0, type: type_lase};
let white_wiza = {team: 0, direction: 0, uses: 0, type: type_wiza};
let black_wiza = {team: 1, direction: 2, uses: 0, type: type_wiza};

board = [
	[black_rook, black_bish, black_knig, black_quee, black_king, black_knig, black_bish, black_rook],
	[black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_wiza],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[white_wiza, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn],
	[white_rook, white_bish, white_knig, white_quee, white_king, white_knig, white_bish, white_rook],
];

board[1][0] = black_bure;
board[6][7] = white_bure;

team_rotations = [0, 0];
start_game();