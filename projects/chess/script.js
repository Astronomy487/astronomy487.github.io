const empty_cell = 1;
const oob_cell = 0; //important that this casts to false

let board = [];

let team_rotations = [];
let teams;
let turn; //whose turn it currently is
let available_moves; //available moves to current turn
let selection = null; //select piece before acting on it. [row, col]
let team_names = "White Black Red Blue Green".split(" ");

function start_game() {
  document.getElementById("menu").remove();
	//board alone has been initialized
	teams = 0;
	for (row of board) for (cell of row) if (cell.team != undefined) teams = Math.max(teams, cell.team);
	for (row of board) for (cell of row) if (cell.type != undefined) team_rotations[cell.team] = [0, 90, 180, 270][cell.direction];
	for (row of board) for (cell of row) if (cell.type != undefined && cell.type.royal) team_rotations[cell.team] = [0, 90, 180, 270][cell.direction];
	teams++;
	turn = -1;
	//create board
	{
		let html = "";
		for (let row_count = 0; row_count < board.length; row_count++) {
			let row = board[row_count];
			html += '<tr>';
			for (let col_count = 0; col_count < row.length; col_count++) {
				let cell = row[col_count];
				html += '<td id="cell_'+row_count+'_'+col_count+'" onmousedown="click_cell('+row_count+', '+col_count+')" parity="'+((row_count+col_count)%2)+'")>';
				//html += '<td id="cell_'+row_count+'_'+col_count+'" onmousedown="click_cell('+row_count+', '+col_count+')" onmouseup="click_cell('+row_count+', '+col_count+')" parity="'+((row_count+col_count)%2)+'">';
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
		get_celement(row_count, col_count).setAttribute("title", (cell.type==undefined?"":team_names[cell.team].toLowerCase()+" "+cell.type.name+" on ")+square_name(row_count, col_count));
	}
}

function royalty_threatened(board, royal_team) {
	for (let team = 0; team < teams; team++) {
		if (team != royal_team) if (find_moves(team, board, true, royal_team)) return true;
	}
	return false;
}
function royalty_threatened_by(board, attacking_team) {
	for (let team = 0; team < teams; team++) {
		if (team != attacking_team) if (find_moves(attacking_team, board, true, team)) return true;
	}
	return false;
}

//finds pseudo legal moves from this function
function find_moves(turn, board, checking_royal_threat = false, royal_team) {
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
			for (move of cell.type.moves) {
				if (move.condition != undefined) {
					if (move.condition.max_uses != undefined && cell.uses > move.condition.max_uses) continue;
				}
				//coordinates in definition are (a, b). use that + rotation to determine d_row and d_col for this piece
				let a = move.motion[0];
				let b = move.motion[1];
				let d_row = [-b, a, b, -a][cell.direction];
				let d_col = [a, -b, -a, b][cell.direction];
				let current_row = row_count + d_row;
				let current_col = col_count + d_col;
				//special move types
				if (move.type == "castle") {
					//scan by interval (d_row, d_col). if this is empty until an X of our color, then we can do a silly swap
					let walks = 0;
					while (in_bounds(board, current_row, current_col) && board[current_row][current_col] == empty_cell) {
						current_row += d_row;
						current_col += d_col;
						walks++;
					}
					if (walks < 1) continue;
					if (in_bounds(board, current_row, current_col) && board[current_row][current_col].team == turn && board[current_row][current_col].type.name == move.friend) {
						//extra condition check: does friend also meet requirements:
						if (move.condition != undefined) {
							if (move.condition.max_uses != undefined && board[current_row][current_col].uses > move.condition.max_uses) continue;
						}
						let future_board = copy_board(board);
						/* future_board[row_count][col_count] //old king
						future_board[row_count+d_row][col_count+d_col] //old king + 1
						future_board[row_count+2*d_row][col_count+2*d_col] //old king + 2
						future_board[current_row][current_col] //pos of rook */
						future_board[current_row][current_col].uses++;
						future_board[row_count+d_row][col_count+d_col] = future_board[current_row][current_col];
						future_board[current_row][current_col] = empty_cell;
						future_board[row_count][col_count].uses++;
						future_board[row_count+2*d_row][col_count+2*d_col] = future_board[row_count][col_count];
						future_board[row_count][col_count] = empty_cell;
						moves_list.push({origin: [row_count, col_count], destination: [current_row, current_col], result: future_board, type: move.type});
					}
					continue;
				}
				//all other move types use same rules
				//calculate the possible continuations for this piece in this move
				//check conditions to see if the cell can actually move
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
							moves_list.push({origin: [row_count, col_count], destination: [current_row, current_col], result: future_board, type: move.type});
						}
					} else {
						//console.log(square_name(row_count, col_count)+" to "+square_name(current_row, current_col));
						if (board[current_row][current_col].team != turn && move.type != "peaceful") { //if hitting enemy, and we aren't peaceful
							//console.log("looking at "+square_name(row_count, col_count)+" to "+square_name(current_row, current_col));
							//console.log("hit a piece");
							if (checking_royal_threat && board[current_row][current_col].type.royal && board[current_row][current_col].team == royal_team) return true;
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
							moves_list.push({origin: [row_count, col_count], destination: [current_row, current_col], result: future_board, type: move.type});
						}
						break; //stop the sliding loop
					}
					current_row += d_row;
					current_col += d_col;
					slide_count++;
				}
			}
			//thats all the movements for this piece
		} //end 'is this our piece' conditions
	} //end piece loop
	if (checking_royal_threat) return false;
	return moves_list;
}

function do_turn() {
	{
		turn = (turn+1)%teams;
		let css = "";
		css += "table{transform:rotate("+team_rotations[turn]+"deg);}";
		css += "span[team]{transform:rotate(-"+team_rotations[turn]+"deg);}";
		//document.getElementById("rotation_css").innerHTML = css;
	}
	update_display_all();
	available_moves = find_moves(turn, board);
	//filter out moves that threaten our own royalty
	for (let i = 0; i < available_moves.length; i++) {
		let move = available_moves[i];
		let illegal = royalty_threatened(move.result, turn);
		if (illegal) {
			available_moves.splice(i, 1);
			i--;
		}
	}
	if (available_moves.length == 0) {
		if (royalty_threatened(board, turn)) {
			end_game("checkmate");
		} else {
			end_game("stalemate");
		}
	} else highlight_appropriate_squares();
}

function end_game(kind, winner) {
	for (let row_count = 0; row_count < board.length; row_count++) for (let col_count = 0; col_count < board[row_count].length; col_count++) {
		get_celement(row_count, col_count).setAttribute("highlight", "");
		get_celement(row_count, col_count).setAttribute("onclick", "");
	}
	let html = "";
	if (kind == "stalemate") {
		html += "<h1>Stalemate</h1>";
		html += "<p>It is "+team_names[turn]+"'s turn, but they have no valid moves.</p>";
	} else if (kind == "checkmate") {
		html += "<h1>Checkmate</h1>";
		html += "<p>"+team_names[turn]+"'s royalty cannot be saved.</p>"
	}
	open_modal(html, true);
}
function open_modal(html, closable) {
	document.getElementById("modal").hidden = false;
	document.getElementById("modal").style.animation = "0.5s modal_open";
	document.getElementById("modal").innerHTML = (closable?'<div id="close_modal" onclick="close_modal();">x</div>':'') + html;
}
function close_modal() {
	document.getElementById("modal").style.animation = "0.5s modal_close";
	setTimeout(function(){
		document.getElementById("modal").hidden = true;
	}, 450);
}

//these functions work with the ui. current board state! no future handling
function click_cell(row, col) {
	//deselecting space
	if (selection != null && row == selection[0] && col == selection[1]) {
		selection = null;
		sfx("deselect");
		highlight_appropriate_squares();
		return;
	}
	//using an available move
	if (selection != null) for (move of available_moves) {
		if (move.destination[0] == row && move.destination[1] == col && move.origin[0] == selection[0] && move.origin[1] == selection[1]) {
			board = move.result;
			selection = null;
			sfx("play_"+move.type);
			//if (royalty_threatened_by(board, turn)) console.log("check btw");
			do_turn();
			return;
		}
	}
	//selecting a new space from our team
	if (board[row][col].team == turn) {
		selection = [row, col];
		sfx("select");
		highlight_appropriate_squares();
		return;
	}
}

function sfx(noise) {
	//console.log(noise);
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

function square_name(row, col) {
	return "abcdefghijklmnopqrstuvwxyz".split("")[col] + (board.length - row);
}



/*
MOVE DEFINITION INCLUDES
- type {normal, capture, peaceful, ranged}
- motion
- *limit
- *condition{max_uses}


*/
let c = {}; //piece catalogue

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
		{type: "peaceful", motion: [0, 1], limit: 1},
		{type: "capture", motion: [1, 1], limit: 1},
		{type: "capture", motion: [-1, 1], limit: 1}
	]
};

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
}
c.bureaucrat = { //can move anywhere
	name: "bureaucrat",
	letter: ".",
	worth: 0,
	moves: [
		{type: "peaceful", motion: [-7, -7], limit: 1},{type: "peaceful", motion: [-7, -6], limit: 1},{type: "peaceful", motion: [-7, -5], limit: 1},{type: "peaceful", motion: [-7, -4], limit: 1},{type: "peaceful", motion: [-7, -3], limit: 1},{type: "peaceful", motion: [-7, -2], limit: 1},{type: "peaceful", motion: [-7, -1], limit: 1},{type: "peaceful", motion: [-7, 0], limit: 1},{type: "peaceful", motion: [-7, 1], limit: 1},{type: "peaceful", motion: [-7, 2], limit: 1},{type: "peaceful", motion: [-7, 3], limit: 1},{type: "peaceful", motion: [-7, 4], limit: 1},{type: "peaceful", motion: [-7, 5], limit: 1},{type: "peaceful", motion: [-7, 6], limit: 1},{type: "peaceful", motion: [-7, 7], limit: 1},{type: "peaceful", motion: [-6, -7], limit: 1},{type: "peaceful", motion: [-6, -6], limit: 1},{type: "peaceful", motion: [-6, -5], limit: 1},{type: "peaceful", motion: [-6, -4], limit: 1},{type: "peaceful", motion: [-6, -3], limit: 1},{type: "peaceful", motion: [-6, -2], limit: 1},{type: "peaceful", motion: [-6, -1], limit: 1},{type: "peaceful", motion: [-6, 0], limit: 1},{type: "peaceful", motion: [-6, 1], limit: 1},{type: "peaceful", motion: [-6, 2], limit: 1},{type: "peaceful", motion: [-6, 3], limit: 1},{type: "peaceful", motion: [-6, 4], limit: 1},{type: "peaceful", motion: [-6, 5], limit: 1},{type: "peaceful", motion: [-6, 6], limit: 1},{type: "peaceful", motion: [-6, 7], limit: 1},{type: "peaceful", motion: [-5, -7], limit: 1},{type: "peaceful", motion: [-5, -6], limit: 1},{type: "peaceful", motion: [-5, -5], limit: 1},{type: "peaceful", motion: [-5, -4], limit: 1},{type: "peaceful", motion: [-5, -3], limit: 1},{type: "peaceful", motion: [-5, -2], limit: 1},{type: "peaceful", motion: [-5, -1], limit: 1},{type: "peaceful", motion: [-5, 0], limit: 1},{type: "peaceful", motion: [-5, 1], limit: 1},{type: "peaceful", motion: [-5, 2], limit: 1},{type: "peaceful", motion: [-5, 3], limit: 1},{type: "peaceful", motion: [-5, 4], limit: 1},{type: "peaceful", motion: [-5, 5], limit: 1},{type: "peaceful", motion: [-5, 6], limit: 1},{type: "peaceful", motion: [-5, 7], limit: 1},{type: "peaceful", motion: [-4, -7], limit: 1},{type: "peaceful", motion: [-4, -6], limit: 1},{type: "peaceful", motion: [-4, -5], limit: 1},{type: "peaceful", motion: [-4, -4], limit: 1},{type: "peaceful", motion: [-4, -3], limit: 1},{type: "peaceful", motion: [-4, -2], limit: 1},{type: "peaceful", motion: [-4, -1], limit: 1},{type: "peaceful", motion: [-4, 0], limit: 1},{type: "peaceful", motion: [-4, 1], limit: 1},{type: "peaceful", motion: [-4, 2], limit: 1},{type: "peaceful", motion: [-4, 3], limit: 1},{type: "peaceful", motion: [-4, 4], limit: 1},{type: "peaceful", motion: [-4, 5], limit: 1},{type: "peaceful", motion: [-4, 6], limit: 1},{type: "peaceful", motion: [-4, 7], limit: 1},{type: "peaceful", motion: [-3, -7], limit: 1},{type: "peaceful", motion: [-3, -6], limit: 1},{type: "peaceful", motion: [-3, -5], limit: 1},{type: "peaceful", motion: [-3, -4], limit: 1},{type: "peaceful", motion: [-3, -3], limit: 1},{type: "peaceful", motion: [-3, -2], limit: 1},{type: "peaceful", motion: [-3, -1], limit: 1},{type: "peaceful", motion: [-3, 0], limit: 1},{type: "peaceful", motion: [-3, 1], limit: 1},{type: "peaceful", motion: [-3, 2], limit: 1},{type: "peaceful", motion: [-3, 3], limit: 1},{type: "peaceful", motion: [-3, 4], limit: 1},{type: "peaceful", motion: [-3, 5], limit: 1},{type: "peaceful", motion: [-3, 6], limit: 1},{type: "peaceful", motion: [-3, 7], limit: 1},{type: "peaceful", motion: [-2, -7], limit: 1},{type: "peaceful", motion: [-2, -6], limit: 1},{type: "peaceful", motion: [-2, -5], limit: 1},{type: "peaceful", motion: [-2, -4], limit: 1},{type: "peaceful", motion: [-2, -3], limit: 1},{type: "peaceful", motion: [-2, -2], limit: 1},{type: "peaceful", motion: [-2, -1], limit: 1},{type: "peaceful", motion: [-2, 0], limit: 1},{type: "peaceful", motion: [-2, 1], limit: 1},{type: "peaceful", motion: [-2, 2], limit: 1},{type: "peaceful", motion: [-2, 3], limit: 1},{type: "peaceful", motion: [-2, 4], limit: 1},{type: "peaceful", motion: [-2, 5], limit: 1},{type: "peaceful", motion: [-2, 6], limit: 1},{type: "peaceful", motion: [-2, 7], limit: 1},{type: "peaceful", motion: [-1, -7], limit: 1},{type: "peaceful", motion: [-1, -6], limit: 1},{type: "peaceful", motion: [-1, -5], limit: 1},{type: "peaceful", motion: [-1, -4], limit: 1},{type: "peaceful", motion: [-1, -3], limit: 1},{type: "peaceful", motion: [-1, -2], limit: 1},{type: "peaceful", motion: [-1, -1], limit: 1},{type: "peaceful", motion: [-1, 0], limit: 1},{type: "peaceful", motion: [-1, 1], limit: 1},{type: "peaceful", motion: [-1, 2], limit: 1},{type: "peaceful", motion: [-1, 3], limit: 1},{type: "peaceful", motion: [-1, 4], limit: 1},{type: "peaceful", motion: [-1, 5], limit: 1},{type: "peaceful", motion: [-1, 6], limit: 1},{type: "peaceful", motion: [-1, 7], limit: 1},{type: "peaceful", motion: [0, -7], limit: 1},{type: "peaceful", motion: [0, -6], limit: 1},{type: "peaceful", motion: [0, -5], limit: 1},{type: "peaceful", motion: [0, -4], limit: 1},{type: "peaceful", motion: [0, -3], limit: 1},{type: "peaceful", motion: [0, -2], limit: 1},{type: "peaceful", motion: [0, -1], limit: 1},{type: "peaceful", motion: [0, 1], limit: 1},{type: "peaceful", motion: [0, 2], limit: 1},{type: "peaceful", motion: [0, 3], limit: 1},{type: "peaceful", motion: [0, 4], limit: 1},{type: "peaceful", motion: [0, 5], limit: 1},{type: "peaceful", motion: [0, 6], limit: 1},{type: "peaceful", motion: [0, 7], limit: 1},{type: "peaceful", motion: [1, -7], limit: 1},{type: "peaceful", motion: [1, -6], limit: 1},{type: "peaceful", motion: [1, -5], limit: 1},{type: "peaceful", motion: [1, -4], limit: 1},{type: "peaceful", motion: [1, -3], limit: 1},{type: "peaceful", motion: [1, -2], limit: 1},{type: "peaceful", motion: [1, -1], limit: 1},{type: "peaceful", motion: [1, 0], limit: 1},{type: "peaceful", motion: [1, 1], limit: 1},{type: "peaceful", motion: [1, 2], limit: 1},{type: "peaceful", motion: [1, 3], limit: 1},{type: "peaceful", motion: [1, 4], limit: 1},{type: "peaceful", motion: [1, 5], limit: 1},{type: "peaceful", motion: [1, 6], limit: 1},{type: "peaceful", motion: [1, 7], limit: 1},{type: "peaceful", motion: [2, -7], limit: 1},{type: "peaceful", motion: [2, -6], limit: 1},{type: "peaceful", motion: [2, -5], limit: 1},{type: "peaceful", motion: [2, -4], limit: 1},{type: "peaceful", motion: [2, -3], limit: 1},{type: "peaceful", motion: [2, -2], limit: 1},{type: "peaceful", motion: [2, -1], limit: 1},{type: "peaceful", motion: [2, 0], limit: 1},{type: "peaceful", motion: [2, 1], limit: 1},{type: "peaceful", motion: [2, 2], limit: 1},{type: "peaceful", motion: [2, 3], limit: 1},{type: "peaceful", motion: [2, 4], limit: 1},{type: "peaceful", motion: [2, 5], limit: 1},{type: "peaceful", motion: [2, 6], limit: 1},{type: "peaceful", motion: [2, 7], limit: 1},{type: "peaceful", motion: [3, -7], limit: 1},{type: "peaceful", motion: [3, -6], limit: 1},{type: "peaceful", motion: [3, -5], limit: 1},{type: "peaceful", motion: [3, -4], limit: 1},{type: "peaceful", motion: [3, -3], limit: 1},{type: "peaceful", motion: [3, -2], limit: 1},{type: "peaceful", motion: [3, -1], limit: 1},{type: "peaceful", motion: [3, 0], limit: 1},{type: "peaceful", motion: [3, 1], limit: 1},{type: "peaceful", motion: [3, 2], limit: 1},{type: "peaceful", motion: [3, 3], limit: 1},{type: "peaceful", motion: [3, 4], limit: 1},{type: "peaceful", motion: [3, 5], limit: 1},{type: "peaceful", motion: [3, 6], limit: 1},{type: "peaceful", motion: [3, 7], limit: 1},{type: "peaceful", motion: [4, -7], limit: 1},{type: "peaceful", motion: [4, -6], limit: 1},{type: "peaceful", motion: [4, -5], limit: 1},{type: "peaceful", motion: [4, -4], limit: 1},{type: "peaceful", motion: [4, -3], limit: 1},{type: "peaceful", motion: [4, -2], limit: 1},{type: "peaceful", motion: [4, -1], limit: 1},{type: "peaceful", motion: [4, 0], limit: 1},{type: "peaceful", motion: [4, 1], limit: 1},{type: "peaceful", motion: [4, 2], limit: 1},{type: "peaceful", motion: [4, 3], limit: 1},{type: "peaceful", motion: [4, 4], limit: 1},{type: "peaceful", motion: [4, 5], limit: 1},{type: "peaceful", motion: [4, 6], limit: 1},{type: "peaceful", motion: [4, 7], limit: 1},{type: "peaceful", motion: [5, -7], limit: 1},{type: "peaceful", motion: [5, -6], limit: 1},{type: "peaceful", motion: [5, -5], limit: 1},{type: "peaceful", motion: [5, -4], limit: 1},{type: "peaceful", motion: [5, -3], limit: 1},{type: "peaceful", motion: [5, -2], limit: 1},{type: "peaceful", motion: [5, -1], limit: 1},{type: "peaceful", motion: [5, 0], limit: 1},{type: "peaceful", motion: [5, 1], limit: 1},{type: "peaceful", motion: [5, 2], limit: 1},{type: "peaceful", motion: [5, 3], limit: 1},{type: "peaceful", motion: [5, 4], limit: 1},{type: "peaceful", motion: [5, 5], limit: 1},{type: "peaceful", motion: [5, 6], limit: 1},{type: "peaceful", motion: [5, 7], limit: 1},{type: "peaceful", motion: [6, -7], limit: 1},{type: "peaceful", motion: [6, -6], limit: 1},{type: "peaceful", motion: [6, -5], limit: 1},{type: "peaceful", motion: [6, -4], limit: 1},{type: "peaceful", motion: [6, -3], limit: 1},{type: "peaceful", motion: [6, -2], limit: 1},{type: "peaceful", motion: [6, -1], limit: 1},{type: "peaceful", motion: [6, 0], limit: 1},{type: "peaceful", motion: [6, 1], limit: 1},{type: "peaceful", motion: [6, 2], limit: 1},{type: "peaceful", motion: [6, 3], limit: 1},{type: "peaceful", motion: [6, 4], limit: 1},{type: "peaceful", motion: [6, 5], limit: 1},{type: "peaceful", motion: [6, 6], limit: 1},{type: "peaceful", motion: [6, 7], limit: 1},{type: "peaceful", motion: [7, -7], limit: 1},{type: "peaceful", motion: [7, -6], limit: 1},{type: "peaceful", motion: [7, -5], limit: 1},{type: "peaceful", motion: [7, -4], limit: 1},{type: "peaceful", motion: [7, -3], limit: 1},{type: "peaceful", motion: [7, -2], limit: 1},{type: "peaceful", motion: [7, -1], limit: 1},{type: "peaceful", motion: [7, 0], limit: 1},{type: "peaceful", motion: [7, 1], limit: 1},{type: "peaceful", motion: [7, 2], limit: 1},{type: "peaceful", motion: [7, 3], limit: 1},{type: "peaceful", motion: [7, 4], limit: 1},{type: "peaceful", motion: [7, 5], limit: 1},{type: "peaceful", motion: [7, 6], limit: 1},{type: "peaceful", motion: [7, 7], limit: 1}
	]
};
c.laser = { //laser straight ahead
	name: "laser",
	letter: "x",
	worth: 900,
	moves: [
		{type: "ranged", motion: [0, 1]},
		{type: "peaceful", motion: [-1, 0], limit: 1},
		{type: "peaceful", motion: [1, 0], limit: 1}
	]
};
c.wizard = { //converts neighbor pieces
	name: "wizard",
	letter: "x",
	worth: 900,
	moves: [
		{type: "convert", motion: [1, 0], limit: 1},
		{type: "convert", motion: [-1, 0], limit: 1},
		{type: "peaceful", motion: [0, 1], limit: 1},
		{type: "peaceful", motion: [0, -1], limit: 1},
		{type: "peaceful", motion: [-1, 0], limit: 1},
		{type: "peaceful", motion: [1, 0], limit: 1},
		{type: "peaceful", motion: [-1, 1], limit: 1},
		{type: "peaceful", motion: [-1, -1], limit: 1},
		{type: "peaceful", motion: [1, -1], limit: 1},
		{type: "peaceful", motion: [1, 1], limit: 1}
	]
};

c.governor = { //1x rook
	name: "governor",
	letter: "<div style=\"transform: rotate(180deg);\">t</div>",
	worth: 200,
	moves: [
		{type: "normal", motion: [0, 1], limit: 1},
		{type: "normal", motion: [0, -1], limit: 1},
		{type: "normal", motion: [-1, 0], limit: 1},
		{type: "normal", motion: [1, 0], limit: 1}
	]
};
c.general = { //1x bishop
	name: "general",
	letter: "<div style=\"transform: rotate(180deg);\">v</div>",
	worth: 200,
	moves: [
		{type: "normal", motion: [1, 1], limit: 1},
		{type: "normal", motion: [-1, -1], limit: 1},
		{type: "normal", motion: [-1, 1], limit: 1},
		{type: "normal", motion: [1, -1], limit: 1}
	]
};
c.tank = { //2x rook
	name: "tank",
	letter: "<div style=\"transform: rotate(180deg);\">t</div>",
	worth: 400,
	moves: [
		{type: "normal", motion: [0, 2], limit: 1},
		{type: "normal", motion: [0, -2], limit: 1},
		{type: "normal", motion: [-2, 0], limit: 1},
		{type: "normal", motion: [2, 0], limit: 1}
	]
};
c.elephant = { //2x bishop
	name: "elephant",
	letter: "<div style=\"transform: rotate(180deg);\">v</div>",
	worth: 200,
	moves: [
		{type: "normal", motion: [2, 2], limit: 1},
		{type: "normal", motion: [-2, -2], limit: 1},
		{type: "normal", motion: [-2, 2], limit: 1},
		{type: "normal", motion: [2, -2], limit: 1}
	]
};

let white_rook = {team: 0, direction: 0, uses: 0, type: c.rook};
let black_rook = {team: 1, direction: 2, uses: 0, type: c.rook};
let white_bish = {team: 0, direction: 0, uses: 0, type: c.bishop};
let black_bish = {team: 1, direction: 2, uses: 0, type: c.bishop};
let white_quee = {team: 0, direction: 0, uses: 0, type: c.queen};
let black_quee = {team: 1, direction: 2, uses: 0, type: c.queen};
let white_king = {team: 0, direction: 0, uses: 0, type: c.king};
let black_king = {team: 1, direction: 2, uses: 0, type: c.king};
let white_knig = {team: 0, direction: 0, uses: 0, type: c.knight};
let black_knig = {team: 1, direction: 2, uses: 0, type: c.knight};
let white_pawn = {team: 0, direction: 0, uses: 0, type: c.pawn};
let black_pawn = {team: 1, direction: 2, uses: 0, type: c.pawn};
let white_paw4 = {team: 0, direction: 0, uses: 0, type: c.pawn4};
let black_paw4 = {team: 1, direction: 2, uses: 0, type: c.pawn4};