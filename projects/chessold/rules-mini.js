game.board = [
  [{piece:"rook",team:1},{piece:"queen",team:1},{piece:"king",team:1},{piece:"rook",team:1}],
  [{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1}],
  [{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0}],
  [{piece:"rook",team:0},{piece:"queen",team:0},{piece:"king",team:0},{piece:"rook",team:0}]
];

game.piece = {
  king: {
    text: "l",
    royalty: true,
    move: [
      {x: -1, y: -1, max: 1, move: true, end: "kill"},
      {x: -1, y: 0, max: 1, move: true, end: "kill"},
      {x: -1, y: 1, max: 1, move: true, end: "kill"},
      {x: 0, y: -1, max: 1, move: true, end: "kill"},
      {x: 0, y: 1, max: 1, move: true, end: "kill"},
      {x: 1, y: -1, max: 1, move: true, end: "kill"},
      {x: 1, y: 0, max: 1, move: true, end: "kill"},
      {x: 1, y: 1, max: 1, move: true, end: "kill"}
    ]
  },
  queen: {
    text: "w",
    royalty: false,
    move: [
      {x: -1, y: -1, move: true, end: "kill"},
      {x: -1, y: 0, move: true, end: "kill"},
      {x: -1, y: 1, move: true, end: "kill"},
      {x: 0, y: -1, move: true, end: "kill"},
      {x: 0, y: 1, move: true, end: "kill"},
      {x: 1, y: -1, move: true, end: "kill"},
      {x: 1, y: 0, move: true, end: "kill"},
      {x: 1, y: 1, move: true, end: "kill"}
    ]
  },
  rook:{
    text: "t",
    royalty: false,
    move: [
      {x: 0, y: -1, move: true, end: "kill"},
      {x: 1, y: 0, move: true, end: "kill"},
      {x: -1, y: 0, move: true, end: "kill"},
      {x: 0, y: 1, move: true, end: "kill"}
    ]
  },
  bishop: {
    text: "v",
    royalty: false,
    move: [
      {x: -1, y: -1, move: true, end: "kill"},
      {x: 1, y: -1, move: true, end: "kill"},
      {x: -1, y: 1, move: true, end: "kill"},
      {x: 1, y: 1, move: true, end: "kill"}
    ]
  },
  knight: {
    text: "m",
    royalty: false,
    move: [
      {x: -2, y: -1, max: 1, move: true, end: "kill"},
      {x: -1, y: -2, max: 1, move: true, end: "kill"},
      {x: -2, y: 1, max: 1, move: true, end: "kill"},
      {x: 1, y: -2, max: 1, move: true, end: "kill"},
      {x: 2, y: -1, max: 1, move: true, end: "kill"},
      {x: -1, y: 2, max: 1, move: true, end: "kill"},
      {x: 2, y: 1, max: 1, move: true, end: "kill"},
      {x: 1, y: 2, max: 1, move: true, end: "kill"}
    ]
  },
  pawn: {
    text: "o",
    royalty: false,
    promote: ["queen","rook","bishop","knight"],
    move: [
      {x: 1, y: 0, max: 1, move: true},
      {x: 1, y: 0, max: 2, move: true, maxPreviousUses: 0},
      {x: 1, y: -1, max: 1, move: false, end: "kill"},
      {x: 1, y: 1, max: 1, move: false, end: "kill"}
    ]
  }
};

game.team = [{color:"white",rotate:2},{color:"black",rotate:0}];
//rotate 0: pawns move down (black)
//rotate 2: pawns move up (white)
//rotate 1: pawns move right
//rotate 3: pawns move left
//this also rotates horizontal moves (a leftward move would be queenside for white and kingside for black)
//supported colors: "white", "black", "red", "yellow", "green", "blue", "cyan", "purple", "magenta"
start();