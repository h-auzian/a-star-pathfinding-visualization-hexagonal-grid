import { getHexagonPoints } from "./hexagon.js";
import state from "./state.js";

const LINE_WIDTH = 5;
const LINE_COLOR = "#000";
const FILL_COLOR = "#F00";;

function draw(canvas, context) {
    clear(canvas, context);
    applyTransformations(context);

    const distance = 200;
    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 5; i++) {
            const centerX = distance * i;
            const centerY = distance * j;
            drawHexagon(context, centerX, centerY);
        }
    }
}

function clear(canvas, context) {
    context.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
    context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
}

function applyTransformations(context) {
    context.scale(state.scale.value, state.scale.value);
    context.translate(-state.camera.x, -state.camera.y);
}

function drawHexagon(context, centerX, centerY) {
    context.lineWidth = LINE_WIDTH;
    context.lineStyle = LINE_COLOR;
    context.fillStyle = FILL_COLOR;

    const points = getHexagonPoints(centerX, centerY);
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        context.lineTo(point.x, point.y);
    }

    context.closePath();
    context.fill();
    context.stroke();
}

export default draw;
