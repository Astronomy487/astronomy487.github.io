const empty_cell = 1;
const oob_cell = 0; //important that this casts to false

let board = [];
let board_history = []; //every past value of board

let team_rotations = [];
let teams;
let turn; //whose turn it currently is
let available_moves; //available moves to current turn
let selection = null; //select piece before acting on it. [row, col]
let just_happened = null; //the last move that just happened. [row, col]
let team_names = "White Black Blue Red Yellow".split(" ");
let ai_teams = [];
let rotation_enabled = true;

function start_game() {
	//board alone has been initialized. and teams has already been calculated
	for (row of board) for (cell of row) if (cell.type != undefined) team_rotations[cell.team] = [0, 90, 180, 270][cell.direction];
	for (row of board) for (cell of row) if (cell.type != undefined && cell.type.royal) team_rotations[cell.team] = [0, 90, 180, 270][cell.direction];
	turn = -1;
	//read and remove modal
	for (let i = 0; i < teams; i++) if (document.getElementById("ai_checkbox_"+i).checked) {
		ai_teams.push(i);
		team_names[i] += " (CPU)";
	}
	rotation_enabled = document.getElementById("rotation_checkbox").checked;
	document.getElementById("modal").remove();
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
	board_history = [board];
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
		get_celement(row_count, col_count).innerHTML = cell.type==undefined ? '' : '<span team="'+cell.team+'">'+cell.type.letter+'</span>';
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

function find_legal_moves(turn, board) {
	let m = find_moves(turn, board);
	for (let i = 0; i < m.length; i++) {
		let move = m[i];
		let illegal = royalty_threatened(move.result, turn);
		if (illegal) {
			m.splice(i, 1);
			i--;
		}
	}
	return m;
}

function rotate(v, direction) {
	let dx = v[0];
	let dy = v[1];
	return [[-dy, dx, dy, -dx][direction], [dx, -dy, -dx, dy][direction]];
}

//TODO: restructure this so theres a helper function to find moves for one specific piece. it still has to somehow overload with those royal threat parameters

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
			//main loop: for each move definition
			for (move of cell.type.moves) {
				//preliminary checks for conditions for this move
				if (move.void_condition != undefined) {
					let [d_row, d_col] = rotate(move.void_condition, cell.direction);
					if (in_bounds(board, row_count+d_row, col_count+d_col)) continue;
				}
				if (move.mandatory_collateral != undefined) {
					let [collateral_row, collateral_col] = rotate(move.mandatory_collateral, cell.direction);
					collateral_row += row_count;
					collateral_col += col_count;
					if (!in_bounds(board, collateral_row, collateral_col) || board[collateral_row][collateral_col] == empty_cell) continue;
					let collateral_cell = board[collateral_row][collateral_col];
					if (collateral_cell.team == turn) continue;
					if (move.mandatory_collateral[2] != undefined && move.mandatory_collateral[2] != collateral_cell.type.name) continue;
					if (move.mandatory_collateral[3] != undefined && move.mandatory_collateral[3] != collateral_cell.state) continue;
				}
				if (move.required_state != undefined && cell.state != move.required_state) continue;
				let [d_row, d_col] = rotate(move.motion, cell.direction);
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
						//extra condition check: does friend also meet requirements
						if (move.required_state != undefined && board[current_row][current_col].state != move.required_state) continue;
						let future_board = copy_board(board);
						if (move.new_state != undefined) future_board[current_row][current_col].state = move.new_state;
						future_board[row_count+d_row][col_count+d_col] = future_board[current_row][current_col];
						future_board[current_row][current_col] = empty_cell;
						if (move.new_state != undefined) future_board[row_count][col_count].state = move.new_state;
						future_board[row_count+2*d_row][col_count+2*d_col] = future_board[row_count][col_count];
						future_board[row_count][col_count] = empty_cell;
						moves_list.push({origin: [row_count, col_count], destination: [row_count+2*d_row, col_count+2*d_col], result: future_board});
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
							//create possible future around this. sliding at empty
							let future_board = copy_board(board);
							if (move.new_state != undefined) future_board[row_count][col_count].state = move.new_state;
							future_board[current_row][current_col] = future_board[row_count][col_count];
							future_board[row_count][col_count] = empty_cell;
							if (move.mandatory_collateral != undefined) { //if pass, this Is a collateral situation
								let [collateral_row, collateral_col] = rotate(move.mandatory_collateral, cell.direction);
								collateral_row += row_count;
								collateral_col += col_count;
								future_board[collateral_row][collateral_col] = empty_cell;
							}
							moves_list.push({origin: [row_count, col_count], destination: [current_row, current_col], result: future_board});
						}
					} else {
						if (board[current_row][current_col].team != turn && move.type != "peaceful") { //if hitting enemy, and we aren't peaceful
							//console.log("looking at "+square_name(row_count, col_count)+" to "+square_name(current_row, current_col));
							//console.log("hit a piece");
							if (checking_royal_threat && board[current_row][current_col].type.royal && board[current_row][current_col].team == royal_team) return true;
							let future_board = copy_board(board);
							future_board[row_count][col_count].state++;
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
					current_row += d_row;
					current_col += d_col;
					slide_count++;
				}
			} //end for each move
		} //end 'is this our piece' conditions
	} //end piece loop
	if (checking_royal_threat) return false;
	return moves_list;
}

//once the board is in its good current state, update visuals and get moves ready
// (to return to a history, use need_rotate=false and set the turn yourself)
function do_turn(need_rotate = true) {
	if (need_rotate) {
		turn = (turn+1)%teams;
		if (!ai_teams.includes(turn) && rotation_enabled) {
			let css = "";
			css += "table{transform:rotate("+team_rotations[turn]+"deg);}";
			css += "span[team]{transform:rotate(-"+team_rotations[turn]+"deg);}";
			document.getElementById("rotation_css").innerHTML = css;
		}
	}
	update_display_all();
	available_moves = find_legal_moves(turn, board);
	document.getElementById("current_turn_display").innerText = team_names[turn]+"'s turn";
	if (royalty_threatened(board, turn)) document.getElementById("current_turn_display").innerText += " (in check)";
	if (available_moves.length == 0) {
		if (royalty_threatened(board, turn)) {
			end_game("checkmate");
		} else {
			end_game("stalemate");
		}
	} else {
		highlight_appropriate_squares();
		if (ai_teams.includes(turn)) setTimeout(computer_turn, 200);
	}
}

function end_game(kind) {
	sfx("boom.ogg");
	for (let row_count = 0; row_count < board.length; row_count++) for (let col_count = 0; col_count < board[row_count].length; col_count++) {
		get_celement(row_count, col_count).setAttribute("highlight", "");
		get_celement(row_count, col_count).setAttribute("onclick", "");
	}
	document.getElementById("current_turn_display").innerHTML = kind + " on " + team_names[turn];
	console.log(kind);
}
//these functions work with the ui. current board state! no future handling
function click_cell(row, col) {
	//deselecting space
	if (selection != null && row == selection[0] && col == selection[1]) {
		selection = null;
		sfx("sfxdeselect.mp3");
		highlight_appropriate_squares();
		return;
	}
	//using an available move
	if (selection != null) for (move of available_moves) {
		if (move.destination[0] == row && move.destination[1] == col && move.origin[0] == selection[0] && move.origin[1] == selection[1]) {
			accept_move(move);
			return;
		}
	}
	//selecting a new space from our team
	if (board[row][col].team == turn) {
		selection = [row, col];
		sfx("sfxselect.mp3");
		highlight_appropriate_squares();
		return;
	}
}

//for actually commiting a move object
function accept_move(move) {
	let evaluation_change = board_evaluation(turn, move.result) - board_evaluation(turn, board);
	board = move.result;
	board_history.push(board);
	selection = null;
	just_happened = move.destination;
	sfx(evaluation_change == 0 ? "sfxmove.mp3" : "sfxtake.mp3");
	do_turn();
}

function sfx(noise) {
	let a = new Audio("sfx/"+noise);
	a.volume = 0.5;
	a.play();
}

function highlight_appropriate_squares() { //do square highlighting
	for (let row_count = 0; row_count < board.length; row_count++) for (let col_count = 0; col_count < board[row_count].length; col_count++) {
		let highlight_type = "";
		if (board[row_count][col_count].team == turn) highlight_type = "owned"; //we own this piece. we can use it
		get_celement(row_count, col_count).setAttribute("highlight", highlight_type);
	}
	if (just_happened != null) {
		get_celement(just_happened[0], just_happened[1]).setAttribute("highlight", "just_happened"); //actively selected piece
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
				state: cell.state,
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

//using global available_moves, does a turn for us.
function computer_turn() {
	//console.log("thinking...");
	let time = Date.now();
	let move = best_move_for(turn, board, 3);
	time = Date.now() - time;
	console.log("took "+time/1000+" seconds");
	//console.log("done thinking");
	accept_move(move);
}

//evaluates how much a board state is in favor of some team
function board_evaluation(team, board) {
	let points = [];
	for (let i = 0; i < teams; i++) points[i] = 0;
	for (row of board) for (cell of row) {
		if (cell.team != undefined) points[cell.team] += cell.type.worth;
	}
	let our_advantage = 0;
	for (let opposing = 0; opposing < teams; opposing++) our_advantage += points[team] - points[opposing];
	return our_advantage;
}

function best_move_for(team, board, depth) {
	if (depth == 1) {
		let available = find_legal_moves(team, board);
		if (available.length == 0) return 0; //this player is trapped. keep that in mind when returning to previous layer
		let evals = [];
		for (a of available) evals.push(board_evaluation(team, board));
		let max_eval = evals[0];
		for (e of evals) if (e > max_eval) max_eval = e;
		let best_of_available = [];
		for (let i = 0; i < evals.length; i++) if (evals[i] == max_eval) best_of_available.push(available[i]);
		return best_of_available[Math.floor(Math.random()*best_of_available.length)];
	} else {
		let available = find_legal_moves(team, board);
		if (available.length == 0) return 0;
		//among the legal moves, let's predict how the next person will respond
		let next_team = (team+1)%teams;
		let evals = []; //evaluation in terms of our own benefit still
		for (a of available) {
			let their_response = best_move_for(next_team, a.result, depth-1);
			if (their_response == 0) {
				//they have no available moves here. if they're in danger, checkmate; otherwise, stalemate
				evals.push(royalty_threatened(next_team, a.result) ? 99999 : 0);
			} else {
				evals.push(board_evaluation(team, their_response.result)); //this is how good we'll end up if we go through with their plans
			}
		}
		let max_eval = evals[0];
		for (e of evals) if (e > max_eval) max_eval = e;
		let best_of_available = [];
		for (let i = 0; i < evals.length; i++) if (evals[i] == max_eval) best_of_available.push(available[i]);
		return best_of_available[Math.floor(Math.random()*best_of_available.length)];
	}
}