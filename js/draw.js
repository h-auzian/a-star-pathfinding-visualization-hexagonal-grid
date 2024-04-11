import state from "./state.js";

function draw(canvas, context, info) {
    clear(canvas, context);
    applyTransformations(context);
    drawScene(context);
    updateInfo(info);
}

function clear(canvas, context) {
    context.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
    context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
}

function applyTransformations(context) {
    context.translate(-state.camera.x, -state.camera.y);
}

function drawScene(context) {
    const squareSize = 50;
    context.fillStyle = "red";
    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 5; i++) {
            const positionX = squareSize * 3 * i;
            const positionY = squareSize * 3 * j;
            context.fillRect(positionX, positionY, squareSize, squareSize);
        }
    }
}

function updateInfo(info) {
    info.innerHTML = "Canvas: " + Math.round(canvas.width) + "x" + Math.round(canvas.height) + "<br>";
    info.innerHTML += "Camera: " + Math.round(state.camera.x) + "x" + Math.round(state.camera.y) + "<br>";
}

export default draw;
