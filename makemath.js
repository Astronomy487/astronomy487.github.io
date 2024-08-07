MathJax = {
	tex: {
		inlineMath: [['$', '$']]
	}
};

//helper functions
function add_script(url, callback) {
	let script = document.body.appendChild(document.createElement("script"));
	script.setAttribute("async", "");
	script.setAttribute("src", url);
	if (callback) script.onload = callback;
}

//load mathjax
add_script("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js");
add_script("https://smartquotes.js.org/src/smartquotes.js", function(){smartquotes();});

function makeMath(phrase, a = "$$", tag = "span") {
	let math = document.createElement(tag);
	//math.setAttribute("class", "math");
	//math.setAttribute("title", phrase.uuid);
	math.innerHTML = a+phrase+a;
	typeset(() => {
		return [math];
	});
	return math;
}
let ongoingPromise = Promise.resolve();
function typeset(code) {
	ongoingPromise = ongoingPromise.then(() => MathJax.typesetPromise(code())).catch((err) => console.log('Typeset failed: ' + err.message));
	return ongoingPromise;
}