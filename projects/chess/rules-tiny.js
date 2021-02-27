game.board = [
  [{piece:"rook",team:1},{piece:"knight",team:1},{piece:"bishop",team:1},{piece:"queen",team:1},{piece:"king",team:1},{piece:"bishop",team:1},{piece:"knight",team:1},{piece:"rook",team:1}],
  [{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1}],
  [null,null,null,null,null,null,null,null],
  [{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0}],
  [{piece:"rook",team:0},{piece:"knight",team:0},{piece:"bishop",team:0},{piece:"queen",team:0},{piece:"king",team:0},{piece:"bishop",team:0},{piece:"knight",team:0},{piece:"rook",team:0}]
];

game.piece = {
  king: {
    text: "K",
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
    text: "Q",
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
    text: "R",
    royalty: false,
    move: [
      {x: 0, y: -1, move: true, end: "kill"},
      {x: 1, y: 0, move: true, end: "kill"},
      {x: -1, y: 0, move: true, end: "kill"},
      {x: 0, y: 1, move: true, end: "kill"}
    ]
  },
  bishop: {
    text: "B",
    royalty: false,
    move: [
      {x: -1, y: -1, move: true, end: "kill"},
      {x: 1, y: -1, move: true, end: "kill"},
      {x: -1, y: 1, move: true, end: "kill"},
      {x: 1, y: 1, move: true, end: "kill"}
    ]
  },
  knight: {
    text: "N",
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
    text: "P",
    royalty: false,
    move: [
      {x: 1, y: 0, max: 1, move: true},
      {x: 1, y: 0, max: 2, move: true, maxPreviousUses: 0},
      {x: 1, y: -1, max: 1, move: false, end: "kill"},
      {x: 1, y: 1, max: 1, move: false, end: "kill"}
    ]
  }
};

game.team = [{color:"white",forwardX:-1},{color:"black",forwardX:1}];
start();