recolor();
function recolor() {
	let elements = document.getElementsByClassName("recolor");
	for (el of elements) {
		let text = el.innerHTML;
		if (text == "0123") {
			el.innerHTML = "<span class=\"n0\">0</span><span class=\"n1\">1</span><span class=\"n2\">2</span><span class=\"n3\">3</span>";
			//el.innerHTML = "<span class=\"n0\">0</span><span class=\"n1\">1</span><span class=\"n2\">2</span><span class=\"n3\">3</span><span class=\"n4\">4</span><span class=\"n5\">5</span>";
		} else {
			let b64stream = text_to_b64stream(text);
			let wordids = b64stream_to_wordids(b64stream);
			let analysis = grammar_analysis(wordids);
			let html = [];
			for (word of analysis) {
				let b64sequence = wordid_to_b64stream(word.id);
				let word_text = b64stream_to_text(b64sequence);
				html.push("<span class=\"n"+word.arity+"\">"+word_text+"</span>");
			}
			el.innerHTML = html.join(" ");
		}
	}
}