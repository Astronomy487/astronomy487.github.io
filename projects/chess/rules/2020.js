gamerules["2020"] = {
	name: "2020 Election",
	description: "The 2020 election",
	establish() {
		for (piece of "pawn king queen bishop knight rook".split(" ")) {
			c["_"+piece] = JSON.parse(JSON.stringify(c[piece])); //create copies of each piece for dif teams.
		}
		//random team take the new _piece definitions (_piece is always republican)

		if (Math.random() < 0.5) {
			black_rook.type = c._rook;
			black_bish.type = c._bishop;
			black_knig.type = c._knight;
			black_king.type = c._king;
			black_quee.type = c._queen;
			black_pawn.type = c._pawn;
			team_names = ["Democrat", "Republican"];
		} else {
			white_rook.type = c._rook;
			white_bish.type = c._bishop;
			white_knig.type = c._knight;
			white_king.type = c._king;
			white_quee.type = c._queen;
			white_pawn.type = c._pawn;
			team_names = ["Republican", "Democrat"];
		}

		board = [
			[black_rook, black_knig, black_bish, black_quee, black_king, black_bish, black_knig, black_rook],
			[black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn],
			[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
			[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
			[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
			[empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell, empty_cell],
			[white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn],
			[white_rook, white_knig, white_bish, white_quee, white_king, white_bish, white_knig, white_rook],
		];

		//republican images
		c._king.letter = '<img style="width: 4rem; height: 4rem;" src="https://cdn.britannica.com/31/149831-050-83A0E45B/Donald-J-Trump-2010.jpg?w=400&h=300&c=crop">';
		c._pawn.letter = '<img style="width: 4rem; height: 4rem;" src="https://www.shutterstock.com/image-vector/republican-elephant-vector-icon-flat-260nw-1610328151.jpg">'
		c._queen.letter = '<img style="width: 4rem; height: 4rem;" src="https://media.vanityfair.com/photos/5eb835015af441fe3976da8f/2:3/w_887,h_1331,c_limit/Mike-Pence.jpg">';
		c._bishop.letter = '<img style="width: 4rem; height: 4rem;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Mitch_McConnell_2016_official_photo_%281%29.jpg/1200px-Mitch_McConnell_2016_official_photo_%281%29.jpg">';
		c._knight.letter = '<img style="width: 4rem; height: 4rem;" src="https://static.texastribune.org/media/files/600d28682a2731e6cfa9649926acbc5a/Ted-Cruz.jpg">';
		c._rook.letter = '<img style="width: 4rem; height: 4rem;" src="https://bloximages.newyork1.vip.townnews.com/columbiamissourian.com/content/tncms/assets/v3/editorial/4/b8/4b8b00b0-0876-5c4b-aabe-1be814450648/557b9ca7d5ec6.image.jpg?crop=800%2C800%2C0%2C259&resize=1200%2C1200&order=crop%2Cresize">';

		//democrat images
		c.king.letter = '<img style="width: 4rem; height: 4rem;" src="https://www.reuters.com/resizer/8A5i0ug_Mpah25hzxukJYsx19-s=/1200x1500/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/QES3ISDRWFPMDGNEZRRTFLNWZE.jpg">';
		c.pawn.letter = '<img style="width: 4rem; height: 4rem;" src="https://commonwealthmagazine.org/wp-content/uploads/2015/02/DemDonkey.jpg">';
		c.queen.letter = '<img style="width: 4rem; height: 4rem;" src="https://i.guim.co.uk/img/media/e2a3f6459e92dc1799606d6eaf8c8fca4fb64627/0_211_5094_3057/master/5094.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=abefe97d70a9853b1f3a03046dd66b3f">';
		c.bishop.letter = '<img style="width: 4rem; height: 4rem;" src="https://media.vanityfair.com/photos/5f5113571e10df7a77868acf/1:1/w_1336,h_1336,c_limit/nancy.jpg">';
		c.knight.letter = '<img style="width: 4rem; height: 4rem;" src="https://bloximages.chicago2.vip.townnews.com/qchron.com/content/tncms/assets/v3/editorial/b/59/b5941366-abfe-11ea-9bf3-df319e2c6e0e/5ee2588872746.image.jpg">';
		c.rook.letter = '<img style="width: 4rem; height: 4rem;" src="https://npg.si.edu/sites/default/files/blog_obama_martin_schoeller.jpg">';
	}
};