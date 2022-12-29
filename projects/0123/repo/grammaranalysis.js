function grammar_analysis(stream) { //given stream of word ids
  for (let i = 0; i < stream.length; i++) { //transform to obj w all attributes we need
    let arity = 0; //arity calc
    if (stream[i]%16>=3) arity = 1;
    if (stream[i]%16>=12) arity = 2;
    if (stream[i]%16>=15) arity = 3;
    stream[i] = {id: stream[i], arity: arity, children: [], root: false, final_child: false, translation: ""};
  }
  for (let i = 0; i < stream.length; i++) { //for each word we read
    let parent_found = false;
    let passed_a_root = false;
    for (let j = i-1; j >= 0 && !parent_found && !passed_a_root; j--) { //find most recent word that needs parent. stop at textstart, parent, or known roots
      if (stream[j].children.length < stream[j].arity) { //j needs kid!! i is that kid
        stream[j].children.push(i);
        parent_found = true;
      }
      if (stream[j].root) passed_a_root = true;
    }
    if (!parent_found) stream[i].root = true;
		if (parent_found && stream[i].arity == 0) { //check if this word (i) closes off fully satisfied sentence
			passed_a_root = false; //reuse this hahaha
			let all_satisfied = true;
			for (let j = i-1; j >= 0 && !passed_a_root; j--) {
				if (stream[j].arity != stream[j].children.length) all_satisfied = false;
				if (stream[j].root) passed_a_root = true;
			}
			if (all_satisfied) stream[i].final_child = true;
		}
  }
	//now each word knows it children, its roothood, and its final_childhood
	for (let i = stream.length-1; i >= 0; i--) { //get translations. back to front
		stream[i].translation = dict[stream[i].id].split("; ")[0];
		if (stream[i].children.length >= 1)
			stream[i].translation = stream[i].translation.replace("X", stream[stream[i].children[0]].translation);
		if (stream[i].children.length >= 2)
			stream[i].translation = stream[i].translation.replace("Y", stream[stream[i].children[1]].translation);
		if (stream[i].children.length >= 3)
			stream[i].translation = stream[i].translation.replace("Z", stream[stream[i].children[2]].translation);
		//repeat code like a boss
	}
  return stream;
}