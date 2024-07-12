let modalOpen = null;
function hiModal(el) {
	if (el.getAttribute("transitionbusy") == "true") return;
	modalOpen = el;
	el.style.animation = "0.5s modal-in";
	el.style.display = "block";
	el.setAttribute("transitionbusy", "true");
	setTimeout(function() {
		el.setAttribute("transitionbusy", "false");
	}, 500)
}
function byeModal(el) {
	if (el.getAttribute("transitionbusy") == "true") return;
	modalOpen = null;
	el.style.animation = "0.5s modal-out";
	el.setAttribute("transitionbusy", "true");
	setTimeout(function() {
		el.setAttribute("transitionbusy", "false");
		el.style.display = "none";
	}, 500)
}