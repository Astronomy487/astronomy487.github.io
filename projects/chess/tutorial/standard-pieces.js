gamemodes.standard.piece.king = {
  name: "king",
  category: "standard",
  textChar: "l",
  royalty: true,
  moves: [
    {xGo: 1, yGo: 1, when: "both", max: 1},
    {xGo: 1, yGo: 0, when: "both", max: 1},
    {xGo: 1,yGo: -1, when: "both", max: 1},
    {xGo: 0, yGo: 1, when: "both", max: 1},
    {xGo: 0, yGo: 0, when: "both", max: 1},
    {xGo: 0,yGo: -1, when: "both", max: 1},
    {xGo: -1, yGo: 1, when: "both", max: 1},
    {xGo: -1, yGo: 0, when: "both", max: 1},
    {xGo: -1,yGo: -1, when: "both", max: 1},
  ]
};

gamemodes.standard.piece.queen = {
  name: "queen",
  category: "standard",
  textChar: "w",
  moves: [
    {xGo: -1, yGo: -1, when: "both"},
    {xGo: 1, yGo: -1, when: "both"},
    {xGo: -1, yGo: 1, when: "both"},
    {xGo: 1, yGo: 1, when: "both"},
    {xGo: -1, yGo: 0, when: "both"},
    {xGo: 1, yGo: 0, when: "both"},
    {xGo: 0, yGo: -1, when: "both"},
    {xGo: 0, yGo: 1, when: "both"}
  ]
};

gamemodes.standard.piece.rook {
  name: "rook",
  category: "standard",
  textChar: "t",
  moves: [
    {xGo: -1, yGo: 0, when: "both"},
    {xGo: 1, yGo: 0, when: "both"},
    {xGo: 0, yGo: -1, when: "both"},
    {xGo: 0, yGo: 1, when: "both"}
  ]
},

gamemodes.standard.piece.bishop {
  name: "bishop",
  category: "standard",
  textChar: "v",
  moves: [
    {xGo: -1, yGo: -1, when: "both"},
    {xGo: 1, yGo: -1, when: "both"},
    {xGo: -1, yGo: 1, when: "both"},
    {xGo: 1, yGo: 1, when: "both"}
  ]
};

gamemodes.standard.piece.knight = {
  name: "knight",
  category: "standard",
  textChar: "m",
  moves: [
    {xGo: 2, yGo: 1, when:"both", max: 1},
    {xGo: 2, yGo: -1, when:"both", max: 1},
    {xGo: -2, yGo: 1, when:"both", max: 1},
    {xGo: -2, yGo: -1, when:"both", max: 1},
    {xGo: 1, yGo: 2, when:"both", max: 1},
    {xGo: 1, yGo: -2, when:"both", max: 1},
    {xGo: -1, yGo: 2, when:"both", max: 1},
    {xGo: -1, yGo: -2, when:"both", max: 1}
  ]
};

gamemodes.standard.piece.pawn: {
  name: "pawn",
  category: "standard",
  textChar: "o",
  moves: [
    {xGo: -1, yGo: 0, when: "move", max: 1},
    {xGo: -1, yGo: 0, when: "move", max: 2, previousUses: 0},
    {xGo: -1, yGo: -1, when: "kill", max: 1},
    {xGo: -1, yGo: 1, when: "kill", max: 1}
  ]
}