const downloadButton = document.getElementById("download");

const downloadName = document.getElementById("downloadName");
const downloadType = document.getElementById("downloadType");
const imageWidthInput = document.getElementById("ImageSizeX");
const imageHeightInput = document.getElementById("ImageSizeY");
const lineThicknessBox = document.getElementById("line-thickness");
const backgroundCover = document.getElementsByClassName("backgroundImage")[0];
const penColor = document.getElementById("penColor");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

var mouseDown = false;
var imageData;
var data;
var lineThickness = 3;
//download image
async function download() {
	var imageSettings = getImageSettings();
	image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
	var link = document.createElement('a');
	link.download = imageSettings.name + " " + imageSettings.extension;
	link.href = image;
	link.click();
}
//get download name from user
function getImageSettings() {
	return {
		name: downloadName.value,
		extension: downloadType.value,
	};
}
//light mode and dark moed for the background
var isDark = true;
function switchBackground() {
	isDark = !isDark;
	if (isDark) {
		backgroundCover.style.filter = 'none';
	}
	else {
		backgroundCover.style.filter = 'invert()';
	} lineThicknessBox
}
//clear canvas
async function clearcanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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
var lastX;
var lastY;
var curCanvasState = 0;
var canvasStates = [ctx.getImageData(0, 0, canvas.width, canvas.height)];

function resize() {
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 120;
	canvas.style.top = 120;

	ctx.putImageData(imageData, 0, 0);
}
window.addEventListener("resize", resize, false);
resize();

canvas.addEventListener("mousedown", (event) => {
	mouseDown = true;
	lastX = event.offsetX;
	lastY = event.offsetY;

	ctx.lineWidth = lineThickness;
	ctx.strokeStyle = penColor.value;

});
canvas.addEventListener("mouseup", (event) => {
	mouseDown = false;
	canvasStates[++curCanvasState] = ctx.getImageData(
		0,
		0,
		canvas.width,
		canvas.height
	);
});
canvas.addEventListener("mousemove", (event) => {
	if (mouseDown) {
		var x = event.offsetX;
		var y = event.offsetY;

		ctx.beginPath();

		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();

		ctx.closePath();

		lastX = x;
		lastY = y;
	}
});


