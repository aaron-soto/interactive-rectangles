const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.scale(2, 2);

canvas.width = 1000;
canvas.height = 500;

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

const getPageTopLeft = (el) => {
	var rect = el.getBoundingClientRect();
	var docEl = document.documentElement;
	return {
		left: rect.left + (window.pageXOffset || docEl.scrollLeft || 0),
		top: rect.top + (window.pageYOffset || docEl.scrollTop || 0),
	};
};

class Rect {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 40;
		this.height = 5;
		this.rotation = 0;
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate((this.rotation * Math.PI) / 180);
		// ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.fillStyle = colors.white;
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

		console.log(
			Math.atan2(mouse.y - object.y, mouse.x - object.x) * (180 / Math.PI)
		);

		return Math.atan2(mouse.y - object.y, mouse.x - object.x) * (180 / Math.PI);
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

let rect1 = new Rect(100, 100);
let rects = [];

let spacing = 50;

for (let i = spacing; i < canvas.width; i += spacing) {
	for (let j = spacing; j < canvas.height; j += spacing) {
		rects.push(new Rect(i, j));
	}
}

function animate() {
	requestAnimationFrame(animate);
	ctx.fillStyle = colors.backgroundSecondary;
	ctx.fillRect(0, 0, innerWidth, innerHeight);

	// drawGrid();

	rects.forEach((rect) => {
		rect.update(mouse);
		rect.draw();
	});

	rect1.update(mouse);
	rect1.draw();
}

addEventListener('mousemove', (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;

	// console.log(mouse.x, mouse.y);
});

animate();
