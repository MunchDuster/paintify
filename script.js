const downloadButton = document.getElementById("download");

const downloadName = document.getElementById("downloadName");
const downloadType = document.getElementById("downloadType");
const imageWidthInput = document.getElementById("ImageSizeX");
const imageHeightInput = document.getElementById("ImageSizeY");
const penColor = document.getElementById("penColor");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

var mouseDown = false;
var imageData;
var data;

//download image
async function download() {
  var imageSettings = getImageSettings();
  var imageName = imageSettings.name;
  var imageExtension = imageSettings.extension;
  let canvasImage = canvas.toDataURL("image/" + imageExtension);

  // this can be used to download any image from webpage to local disk
  let xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = function () {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = imageName + "." + imageExtension;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  xhr.open("GET", canvasImage); // This is to download the canvas Image
  xhr.send();
}
//get download name from user
function getImageSettings() {
  return {
    name: downloadName.value,
    extension: downloadType.value,
  };
}

//clear canvas
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
var lastX;
var lastY;

canvas.addEventListener("mousedown", (event) => {
  mouseDown = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
  ctx.moveTo(event.offsetX, event.offsetY);
});
canvas.addEventListener("mouseup", (event) => {
  mouseDown = false;
});
canvas.addEventListener("mousemove", (event) => {
  if (mouseDown) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.strokeStyle = penColor.value;
    ctx.stroke();
    ctx.closePath();

    lastX = event.offsetX;
    lastY = event.offsetY;
  }
});
