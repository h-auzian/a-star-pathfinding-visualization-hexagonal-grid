import dom from "./dom.js";
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
function draw() {
    clearCanvas();
    applyCanvasTransformations();
    drawMap();
}

function clearCanvas() {
    dom.context.setTransform(1, 0, 0, 1, dom.canvas.width/2, dom.canvas.height/2);
    dom.context.clearRect(-dom.canvas.width/2, -dom.canvas.height/2, dom.canvas.width, dom.canvas.height);
}

function applyCanvasTransformations() {
    dom.context.scale(state.camera.scale.value, state.camera.scale.value);
    dom.context.translate(-state.camera.center.x, -state.camera.center.y);
}

function drawMap() {
    for (let x = 0; x < state.map.width; x++) {
        let column = state.map.tiles[x];
        for (let y = 0; y < state.map.height; y++) {
            let tile = column[y];
            drawTile(tile);
        }
    }
}

function drawTile(tile) {
    let fillColor = HEGAXON_TYPE_FILL_COLORS[tile.type];
    drawHexagon(tile.center.x, tile.center.y, fillColor);
}

function drawHexagon(centerX, centerY, fillColor) {
    dom.context.lineWidth = HEXAGON_OUTLINE_WIDTH;
    dom.context.lineStyle = HEXAGON_OUTLINE_COLOR;
    dom.context.fillStyle = fillColor;

    const points = getHexagonPoints(centerX, centerY);
    dom.context.beginPath();
    dom.context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        dom.context.lineTo(point.x, point.y);
    }

    dom.context.closePath();
    dom.context.fill();
    dom.context.stroke();
}

export default draw;
