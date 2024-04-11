let canvas;
let context;
let info;

const canvasWidth = 500;
const canvasHeight = 400;

let cameraX = 0;
let cameraY = 0;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    info = document.getElementById("info");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    mainLoop();
}

function mainLoop() {
    window.requestAnimationFrame(mainLoop);
    update();
    draw();
}

function update() {
    cameraX += 0.1;
    cameraY += 0.1;
}

function draw() {
    context.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
    context.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);

    context.translate(-cameraX, -cameraY);

    const squareSize = 50;
    context.fillStyle = "red";
    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 5; i++) {
            const positionX = squareSize * 3 * i;
            const positionY = squareSize * 3 * j;
            context.fillRect(positionX, positionY, squareSize, squareSize);
        }
    }

    info.innerHTML = "Camera: " + Math.round(cameraX) + "x" + Math.round(cameraY) + "<br>";
}

export default init;
