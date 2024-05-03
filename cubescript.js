
let faces = [
	{dx: 0, dy: 1, dz: 0, color: "#ff0", darkColor: ["#880", "#660"]},
	{dx: 0, dy: -1, dz: 0, color: "#ff0", darkColor: ["#880", "#660"]},
	{dx: 1, dy: 0, dz: 0, color: "#0ff", darkColor: ["#088", "#066"]},
	{dx: -1, dy: 0, dz: 0, color: "#0ff", darkColor: ["#088", "#066"]},
	{dx: 0, dy: 0, dz: 1, color: "#f0f", darkColor: ["#808", "#606"]},
	{dx: 0, dy: 0, dz: -1, color: "#f0f", darkColor: ["#808", "#606"]}
];

let friction = 0;
let midX = 0; let midY = 0;
let tX = 0; let tY = 0;
let rotationX = 0; let rotationY = 0;
let scroll = 0;
let theScale = 0;
let canvas;
function setup() {
	//establish canvas
	createCanvas(0, 0, WEBGL);
	canvas = document.body.querySelector("canvas");
	document.body.querySelector("#container").appendChild(canvas);
	frameRate(60);
	noStroke();
	windowResized();
	smooth();
}
let holeRatio = 0.36; //radius frmo center to the hole edge
function draw() {
	let lookingAt = "#ff0";
	scroll = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	background(0);
	scale(200 * theScale);
	tX = (mouseX / midX - 1) * (1-friction) + tX * friction;
	tY = ((mouseY-scroll*2) / midY + 10) * (1-friction) + tY * friction;
	translate(tX*0.2, 0, 0);
	rotationX = -tY * 0.1 + Math.PI / 4 - frameCount * 0.001;
	rotationY = tX * 0.1 + Math.PI * 2/3 + frameCount * 0.001;
	if (Math.cos(2*rotationX) > 0) {
		lookingAt = (Math.cos(2*rotationY) > 0) ? "#f0f" : "#0ff";
	}
	rotateX(rotationX);
	rotateY(rotationY);
	if (mouseX || mouseY) friction = friction*0.8 + 0.9 * 0.2; //meta friction whoaa
	if (!friction) return;
	theScale = 0.9*theScale + 0.1;
	/* quad(-1, -1, -1,      -1, -1, 1,      -1, 1, -1,      -1, 1, 1); //x = -1;
	quad(1, -1, -1,       1, -1, 1,       1, 1, -1,       1, 1, 1); //x = 1;
	quad(-1, -1, -1,      -1, -1, 1,      1, -1, -1,      1, -1, 1); //y = -1;
	quad(-1, 1, -1,       -1, 1, 1,       1, 1, -1,       1, 1, 1); //y = 1;
	quad(-1, -1, -1,      -1, 1, -1,      1, -1, -1,      1, 1, -1); //z = -1;
	quad(-1, -1, 1,       -1, 1, 1,       1, -1, 1,       1, 1, 1); //z = 1; */
	for (let face of faces) {
		push();
		translate(face.dx, face.dy, face.dz);
		if (face.dy != 0) rotateX(Math.PI * 0.5);
		if (face.dx != 0) rotateY(Math.PI * 0.5);
		fill(face.color);
		for (let i = 0; i < 4; i++) {
			push();
			rotateZ(i * Math.PI / 2);
			translate(0, 1-(1-holeRatio)/2, 0);
			plane(2, 1-holeRatio);
			pop();
		}
		pop();
		//if (Math.random() > 0.2) continue;
		push();
		let tubeDistance = 1 - holeRatio;
		if (lookingAt == face.color) tubeDistance = 1;
		//tubeDistance = 1;
		for (let i = 0; i < 4; i++) {
			push();
			let angle = i * Math.PI / 2;
			translate(face.dx * (1 - tubeDistance/2), face.dy * (1 - tubeDistance/2), face.dz * (1 - tubeDistance/2));
			if (face.dx != 0) rotateX(angle);
			if (face.dy != 0) rotateY(angle);
			if (face.dz != 0) {rotateX(angle); rotateY(angle);}
			if (face.dz != 0 && i%2 == 0) {rotateX(Math.PI/2);} //this is soooo messy
			fill(face.darkColor[i%2]);
			translate(0, 0, holeRatio);
			if (face.dx != 0) rotateZ(Math.PI/2);
			plane(holeRatio * 2, tubeDistance);
			pop();
		}
		pop();
		
		/* {
			push();
			translate(face.dx, face.dy, face.dz);
			sphere(0.01);
			pop();
		} */
	}
	
	//quad(-distance, -distance, -distance,      -distance, distance, -distance,      distance, -distance, -distance,      distance, distance, -distance); //z = -distance;
}

function windowResized() {
	midX = window.innerWidth / 2;
	midY = window.innerHeight / 2;
	resizeCanvas(windowWidth * 4/5, windowHeight);
}

if (window.innerWidth < 1100) {
	setup = function(){};
	draw = function(){};
	document.querySelector("#main-container").style.textAlign = "center";
	document.querySelector("main").style.marginTop = "4rem";
}

for (let a of document.querySelectorAll("a")) {
	a.setAttribute("target", "_blank");
}