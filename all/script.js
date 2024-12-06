setInterval(function() {
	if (document.body.offsetHeight-500 < window.innerHeight + window.scrollY) process();
}, 0);
document.head.appendChild(document.createElement("title")).innerText = document.querySelector("h1").innerText;