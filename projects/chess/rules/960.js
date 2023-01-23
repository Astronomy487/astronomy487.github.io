rules_name = "Chess960";
rules_description = "The order of all pieces on the back rank is shuffled. Invented by Bobby Fischer in 1996. Called Chess960 because there are 960 possible arrangements.";

board = [
	[],
	[black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
	[white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn],
	[]
];
function shuffle(t){let f=t.length,n,o;for(;0!==f;)o=Math.floor(Math.random()*f),--f,n=t[f],t[f]=t[o],t[o]=n;return t};
let row = "qkrrbbnn".split("");
let valid = false;
//shuffle until a) bishops on opposite parities b) subset rooks&kings looks like rkr
while (!valid) {
	row = shuffle(row);
	valid = true;
	let first_bishop = row.indexOf("b");
	let second_bishop = row.indexOf("b", first_bishop+1);
	if (first_bishop%2 == second_bishop%2) valid = false;
	let rkr = "";
	for (p of row) if (p == "r" || p == "k") rkr += p;
	if (rkr != "rkr") valid = false;
}
for (p of row) {
	board[7].push({q: white_quee, k: white_king, r: white_rook, b: white_bish, n: white_knig}[p]);
	board[0].push({q: black_quee, k: black_king, r: black_rook, b: black_bish, n: black_knig}[p]);
}