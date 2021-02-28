game.board = [
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null]
];

let a=[{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"pawn",team:0},{piece:"rook",team:0},{piece:"knight",team:0},{piece:"bishop",team:0},{piece:"queen",team:0},{piece:"king",team:0},{piece:"bishop",team:0},{piece:"knight",team:0},{piece:"rook",team:0},{piece:"rook",team:1},{piece:"knight",team:1},{piece:"bishop",team:1},{piece:"queen",team:1},{piece:"king",team:1},{piece:"bishop",team:1},{piece:"knight",team:1},{piece:"rook",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1},{piece:"pawn",team:1}];for(i=0;i<a.length;i++){let e=!1;for(;0==e;){let p=Math.floor(Math.random()*Math.floor(8)),t=Math.floor(Math.random()*Math.floor(8));null==game.board[p][t]&&(e=!0,game.board[p][t]=a[i])}}

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
    move: [
      {x: 1, y: 0, max: 1, move: true},
      {x: 1, y: 0, max: 2, move: true, maxPreviousUses: 0},
      {x: 1, y: -1, max: 1, move: false, end: "kill"},
      {x: 1, y: 1, max: 1, move: false, end: "kill"}
    ]
  }
};

game.team = [{color:"white",rotate:2},{color:"black",rotate:0}];
start();