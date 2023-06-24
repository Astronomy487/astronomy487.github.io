/*
board														the current board as we speak
load_puzzle(state)							expand borders, load into state
start_display(state)						construct display, call display(state)
display(state)									display this state
next(state)											gives next position
*/

let board = null; //present board state
let placements = [1]; //represents the turns we're allowed
let cells = []; //cell elements
let input_disabled = false; //true when doing evolving
let reached_positions = null; //to check if we have reached stability
let frame_time = 300;

setTimeout(function(){
	load_puzzle([[0, 1, 0], [0, 1, 0], [0, 1, 0]], [1], 4);
}, 300);

function load_puzzle(state, p, demo_frames) {
	for (element of document.querySelectorAll(".modal")) element.remove();
	board = state;
	placements = p;
	//add padding to board
	for (let y = 0; y < board.length; y++) {
		board[y] = [0, 0, 0, 0, 0, 0].concat(board[y]).concat([0, 0, 0, 0, 0, 0]);
	}
	let empty_row = [];
	for (let x = 0; x < board[0].length; x++) empty_row.push(0);
	board = [empty_row, empty_row, empty_row, empty_row, empty_row, empty_row].concat(board).concat([empty_row, empty_row, empty_row, empty_row, empty_row, empty_row]);
	board = JSON.parse(JSON.stringify(board));
	reached_positions = {};
	mark_reached();
	//visual
	document.querySelector("header").innerText = "here is your position...";
	make_footer_placements();
	start_display();
	input_disabled = true;
	for (let i = 0; i < demo_frames; i++) {
		setTimeout(function(){
			perform_evolution();
		}, frame_time * i + 1000)
	}
	setTimeout(function(){
		input_disabled = false;
		document.querySelector("header").innerText = "Ok try your best!";
	}, frame_time * demo_frames + 1000);
}

function mark_reached() {
	reached_positions[JSON.stringify(board)] = true;
}
function have_reached(state) {
	return reached_positions[JSON.stringify(board)];
}

function make_footer_placements() {
	let footer = document.querySelector("footer");
	let divider = null;
	for (qty of placements) {
		for (let i = 0; i < qty; i++) {
			let span = footer.appendChild(document.createElement("span"));
		}
		divider = footer.appendChild(document.createElement("b"));
		divider.innerText = "•";
	}
	divider.remove();
}

function start_display() {
	let table = document.querySelector("table");
	for (let y = 0; y < board.length; y++) {
		cells[y] = [];
		let tr = table.appendChild(document.createElement("tr"));
		for (let x = 0; x < board[y].length; x++) {
			let td = tr.appendChild(document.createElement("td"));
			td.setAttribute("onclick", "press("+y+", "+x+");");
			cells[y][x] = td;
		}
	}
	display();
}

function display() {
	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[y].length; x++) {
			cells[y][x].setAttribute("alive", board[y][x] ? "true" : "false");
		}
	}
}

function next(state) {
	let new_arr = [];
	for (let y = 0; y < state.length; y++) {
		new_arr[y] = [];
		for (let x = 0; x < state[y].length; x++) {
			let neighbors = 0;
			for (let yy = Math.max(y-1, 0); yy <= Math.min(y+1, state.length-1); yy++) {
				for (let xx = Math.max(x-1, 0); xx <= Math.min(x+1, state[y].length-1); xx++) {
					if (xx != x || yy != y) if (state[yy][xx]) neighbors++;
				}
			}
			if (state[y][x])
				new_arr[y][x] = neighbors == 3 || neighbors == 2;
			else
				new_arr[y][x] = neighbors == 3;
		}
	}
	return new_arr;
}

function dead_state(state) {
	for (row of state) for (cell of row) if (cell) return false;
	return true;
}

function press(y, x) {
	//are we allowed to click
	if (input_disabled) return;
	if (y < 0 || y >= board.length) return;
	if (x < 0 || x >= board[0].length) return;
	if (placements.length == 0) return;
	if (board[y][x]) return;
	//click
	board[y][x] = true;
	placements[0]--;
	document.querySelector("footer span:not([used])").setAttribute("used", "true");
	if (!placements[0]) {
		placements.shift();
		start_evolving();
	}
	display();
}

function perform_evolution() {
	board = next(board);
	let already = have_reached(board);
	mark_reached();
	display();
	return already;
}

function start_evolving() {
	document.querySelector("header").innerText = "ok lets see...";
	input_disabled = true;
	let interval = setInterval(function(){
		let already = perform_evolution();
		if (dead_state(board)) {
			stop();
			document.querySelector("header").innerText = "Good job!";
		} else if (already) {
			stop();
			if (placements.length) {
				document.querySelector("header").innerText = "ok go another round";
			} else {
				document.querySelector("header").innerText = "it reached a stable position. you have failed";
			}
		}
	}, frame_time);
	function stop() {
		input_disabled = false;
		clearInterval(interval);
	}
}