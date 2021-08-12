const downloadButton = document.getElementById("download");

const downloadName = document.getElementById("downloadName");
const tool = document.getElementById("tool");
const imageWidthInput = document.getElementById("ImageSizeX");
const imageHeightInput = document.getElementById("ImageSizeY");
const lineThicknessBox = document.getElementById("line-thickness");
const backgroundCover = document.getElementsByClassName("backgroundImage")[0];
const penColor = document.getElementById("penColor");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

var mouseDown = false;
var data;
var lineThickness = 3;
var isDark = true;
//download image
async function download() {
	var imageDataURL = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
	var link = document.createElement('a');
	link.download = downloadName.value + ".png";
	link.href = imageDataURL;
	link.click();
}
//light mode and dark moed for the background
function switchBackground() {
	isDark = !isDark;
	if (isDark) {
		backgroundCover.style.filter = 'none';
	}
	else {
		backgroundCover.style.filter = 'invert()';
	} lineThicknessBox
}
/*
private void FloodFill(Bitmap bmp, Point pt, Color targetColor, Color replacementColor)
		{
			Stack<Point> pixels = new Stack<Point>();
			targetColor = bmp.GetPixel(pt.X, pt.Y);
			pixels.Push(pt);

			while (pixels.Count > 0)
			{
				Point a = pixels.Pop();
				if (a.X < bmp.Width && a.X > 0 &&
						a.Y < bmp.Height && a.Y > 0)//make sure we stay within bounds
				{

					if (bmp.GetPixel(a.X, a.Y) == targetColor)
					{
						bmp.SetPixel(a.X, a.Y, replacementColor);
						pixels.Push(new Point(a.X - 1, a.Y));
						pixels.Push(new Point(a.X + 1, a.Y));
						pixels.Push(new Point(a.X, a.Y - 1));
						pixels.Push(new Point(a.X, a.Y + 1));
					}
				}
			}
*/
//clear canvas
async function clearcanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//return a object with x and y
function point(x, y) {
	return { x: x, y: y };
}
// fill an area
var imageData;
var image = ctx.getImageData(
	0,
	0,
	canvas.width,
	canvas.height
);
imageData = image.data;

var targetColor;
function fill(x, y) {
	targetColor = getRGB(ctx.strokeStyle);
	var image = ctx.getImageData(
		0,
		0,
		canvas.width,
		canvas.height
	);
	imageData = image.data;
	console.log('data length' + imageData.length);
	var filledPoints = [];
	var fillPoints = [point(x, y)];
	while (fillPoints.length > 0) {
		console.log('fill points' + fillPoints.length);
		console.log('filled points' + filledPoints.length);
		console.log(fillPoints);
		var { _fillPoints, _filledPoints } = fillNext(fillPoints, filledPoints);
		fillPoints = _fillPoints;
		filledPoints = _filledPoints;
		console.log(fillPoints);
		image.data = imageData;
		ctx.putImageData(image, 0, 0);



	}


	console.log('finished');

}
async function fillNext(fillPoints, filledPoints) {
	var nextFillPoints = [];
	for (var i = 0; i < fillPoints.length; i++) {
		if (canFill(fillPoints[i], filledPoints)) {
			setColor(fillPoints[i], targetColor);
			filledPoints.push(fillPoints[i]);

			var left = point(fillPoints[i].x - 1, fillPoints[i].y);
			var right = point(fillPoints[i].x + 1, fillPoints[i].y);
			var up = point(fillPoints[i].x, fillPoints[i].y - 1);
			var down = point(fillPoints[i].x, fillPoints[i].y + 1)

			if (canFill(left, filledPoints)) nextFillPoints.push(left);
			if (canFill(right, filledPoints)) nextFillPoints.push(right);
			if (canFill(up, filledPoints)) nextFillPoints.push(up);
			if (canFill(down, filledPoints)) nextFillPoints.push(down);
		}
	}
	return { nextFillPoints, filledPoints };
}
async function updateCan() {
	image.data = imageData;
	ctx.putImageData(image, 0, 0);
}

function canFill(pixel, filledPoints) {
	//console.log('test color ' + toString(getColor(pixel)) + " and " + toString(targetColor) + " results in " + (getColor(pixel) == targetColor));
	if (checkObjEqual(getColor(pixel), targetColor)) return false;
	if (filledPoints.includes(pixel)) return false;
	return true;
}
function toString(color) {
	return color.r + "," + color.g + "," + color.b + "," + color.a;
}
function getColor(pixel) {
	var index = pixel.y * (canvas.width * 4) + pixel.x * 4;
	return { r: imageData[index], g: imageData[index + 1], b: imageData[index + 2], a: imageData[index + 3] }
}
function setColor(pixel, color) {
	var i = pixel.y * (canvas.width * 4) + pixel.x * 4;

	imageData[i] = color.r;
	imageData[i + 1] = color.g;
	imageData[i + 2] = color.b;
	imageData[i + 3] = color.a;
}
function getRGB(colorHEX) {
	var r = parseInt(colorHEX[1] + colorHEX[2], 16);
	var g = parseInt(colorHEX[3] + colorHEX[4], 16);
	var b = parseInt(colorHEX[5] + colorHEX[6], 16);

	return { r: r, g: g, b: b, a: 255 };
}
function getHex(color) {
	var r = color.r.toString(16);
	var g = color.g.toString(16);
	var b = color.b.toString(16);

	r = (r.length < 2) ? "0" + r : r;
	g = (g.length < 2) ? "0" + g : g;
	b = (b.length < 2) ? "0" + b : b;

	return "#" + r + g + b;
}

function undo() {
	try {
		ctx.putImageData(canvasStates[--curCanvasState], 0, 0);
	} catch (err) {
		alert("cant go back further");
	}
}
function redo() {
	try {
		ctx.putImageData(canvasStates[curCanvasState++], 0, 0);
	} catch (err) {
		alert("cant go forward further");
	}
}

var curCanvasState = 0;
var canvasStates = [ctx.getImageData(0, 0, canvas.width, canvas.height)];

function resize() {
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 120;
	canvas.style.top = 120;

	ctx.putImageData(imageData, 0, 0);
}

var curMouseUpListener = canvas.addEventListener("mousedown", Pencil_MouseDown);
var curMouseDownListener = canvas.addEventListener("mouseup", Pencil_MouseUp);
var curMouseMoveListener = canvas.addEventListener("mousemove", Pencil_MouseMove);

function updateTool(value) {
	canvas.removeEventListener("mousedown", curMouseDownListener);
	canvas.removeEventListener("mouseup", curMouseUpListener);
	canvas.removeEventListener("mousemove", curMouseMoveListener);
	switch (value) {
		case "Pencil": //Pencil tool selected
			curMouseUpListener = canvas.addEventListener("mousedown", Pencil_MouseDown);
			curMouseDownListener = canvas.addEventListener("mouseup", Pencil_MouseUp);
			curMouseMoveListener = canvas.addEventListener("mousemove", Pencil_MouseMove);
			break;
		case "Fill": //Fill tool selected
			curMouseDownListener = canvas.addEventListener("mousedown", Fill_MouseDown);
			break;
		case "Erase":
			break;
		default:
			console.error("UNKOWN TOOL SLEECTED");
	}
}

var lastX;
var lastY;
var lastLastX;
var lastLastY;
function Pencil_MouseDown(event) {
	mouseDown = true;
	lastX = event.offsetX;
	lastY = event.offsetY;
	lastLastX = lastX;
	lastLastY = lastY;

	ctx.lineWidth = lineThickness;
	ctx.strokeStyle = penColor.value;
}

function Pencil_MouseUp(event) {
	mouseDown = false;
	canvasStates[++curCanvasState] = ctx.getImageData(
		0,
		0,
		canvas.width,
		canvas.height
	);
}

function Pencil_MouseMove(event) {
	if (mouseDown) {
		var x = event.offsetX;
		var y = event.offsetY;

		ctx.beginPath();

		ctx.moveTo(lastLastX, lastLastY);
		ctx.lineTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();

		ctx.closePath();
		lastLastX = lastX;
		lastLastY = lastY;
		lastX = x;
		lastY = y;
	}
}

const Fill_MouseDown = (event) => {
	fill(event.offsetX, event.offsetY);
}

window.addEventListener("resize", resize, false);
resize();
function checkObjEqual(obj1, obj2) {
	for (let key in obj1) {
		if (!(key in obj2)) return false;
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
}
