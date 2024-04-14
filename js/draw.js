import { getHexagonPoints } from "./map.js";
import state from "./state.js";

const HEXAGON_OUTLINE_WIDTH = 5;
const HEXAGON_OUTLINE_COLOR = "#000";
const HEGAXON_TYPE_FILL_COLORS = {
    "passable": "#0F0",
    "impassable": "#F00",
};

/**
 * Main canvas draw function.
 */
function draw(canvas, context) {
    clearCanvas(canvas, context);
    applyCanvasTransformations(context);
    drawMap(context);
}

function clearCanvas(canvas, context) {
    context.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
    context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
}

function applyCanvasTransformations(context) {
    context.scale(state.scale.value, state.scale.value);
    context.translate(-state.camera.center.x, -state.camera.center.y);
}

function drawMap(context) {
    for (let x = 0; x < state.map.width; x++) {
        let column = state.map.tiles[x];
        for (let y = 0; y < state.map.height; y++) {
            let tile = column[y];
            drawTile(context, tile);
        }
    }
}

function drawTile(context, tile) {
    let fillColor = HEGAXON_TYPE_FILL_COLORS[tile.type];
    drawHexagon(context, tile.center.x, tile.center.y, fillColor);
}

function drawHexagon(context, centerX, centerY, fillColor) {
    context.lineWidth = HEXAGON_OUTLINE_WIDTH;
    context.lineStyle = HEXAGON_OUTLINE_COLOR;
    context.fillStyle = fillColor;

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
