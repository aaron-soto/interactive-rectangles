const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.scale(2, 2);

canvas.width = window.innerWidth;
// canvas.width = 500;
canvas.height = window.innerHeight;
// canvas.height = 500;

const centerX = innerWidth / 2;
const centerY = innerHeight / 2;

const mouse = {
	x: 0,
	y: 0,
};

let colors = {
	white: '#ffffff',
	gray: '#f8f9fa',
	graySecondary: '#354f52',
	background: '#090D16',
	backgroundSecondary: '#11152C',
	red: '#961E1E',
	green: '#008148',
	blue: '#219ebc',
	yellow: '#D0C832',
};
let grays = {
	100: '#EEEEEE',
	200: '#CCCCCC',
	300: '#999999',
	400: '#666666',
	500: '#333333',
	600: '#000000',
};

const getPageTopLeft = (el) => {
	var rect = el.getBoundingClientRect();
	var docEl = document.documentElement;
	return {
		left: rect.left + (window.pageXOffset || docEl.scrollLeft || 0),
		top: rect.top + (window.pageYOffset || docEl.scrollTop || 0),
	};
};

function getDistance(xA, yA, xB, yB) {
	var xDiff = xA - xB;
	var yDiff = yA - yB;

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

class Rect {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 40;
		this.height = 4;
		this.rotation = 0;
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate((this.rotation * Math.PI) / 180);
		// ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		let dist = this.checkDist(mouse);
		if (dist >= 300) {
			ctx.fillStyle = grays[100];
		} else if (dist >= 200) {
			ctx.fillStyle = grays[200];
		} else if (dist >= 100) {
			ctx.fillStyle = grays[400];
		} else {
			ctx.fillStyle = grays[600];
		}

		ctx.beginPath();
		ctx.rect(0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
		// ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
		ctx.fill();
		ctx.restore();
	}

	update(mouse) {
		ctx.save();

		// ctx.translate(this.x - this.width / 2, this.y - this.height / 2);

		this.rotation = this.checkAngle(mouse);

		ctx.restore();
	}

	checkAngle(mouse) {
		let distance = getPageTopLeft(canvas);
		let object = {
			x: distance.left + this.x,
			y: distance.top + this.y,
		};

		return Math.atan2(mouse.y - object.y, mouse.x - object.x) * (180 / Math.PI);
	}

	checkDist(mouse) {
		let distance = getPageTopLeft(canvas);
		let object = {
			x: distance.left + this.x,
			y: distance.top + this.y,
		};

		let result = getDistance(mouse.x, mouse.y, object.x, object.y);

		return result;
	}
}

function drawGrid() {
	ctx.save();

	let cols = canvas.width / 100;
	let rows = canvas.height / 100;

	// ctx.fillStyle = "#90dbf4"
	ctx.fillStyle = '#a2d2ff';

	// Draw Vertical grid lines
	for (let i = 0; i < cols + 1; i++) {
		ctx.beginPath();
		ctx.rect(100 * i - 0.5, 0, 1, canvas.height);
		ctx.fill();

		for (let j = 0; j < 10; j++) {
			ctx.beginPath();
			ctx.rect(100 * i + 10 * j - 0.25, 0, 0.5, canvas.height);
			ctx.fill();
		}
	}
	// Draw Horizontal grid lines
	for (let i = 0; i < rows + 1; i++) {
		ctx.beginPath();
		ctx.rect(0, 100 * i - 0.5, canvas.width, 1);
		ctx.fill();

		for (let j = 0; j < 10; j++) {
			ctx.beginPath();
			ctx.rect(0, 100 * i + 10 * j - 0.25, canvas.width, 0.5);
			ctx.fill();
		}
	}

	ctx.restore();
}

let spacing = 50;
let rects = [];

for (let i = spacing; i < canvas.width; i += spacing) {
	for (let j = spacing; j < canvas.height; j += spacing) {
		rects.push(new Rect(i, j));
	}
}

function animate() {
	requestAnimationFrame(animate);
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, innerWidth, innerHeight);

	// drawGrid();

	rects.forEach((rect) => {
		rect.update(mouse);
		rect.draw();
	});
}

addEventListener('mousemove', (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;

	// console.log(mouse.x, mouse.y);
});

animate();
