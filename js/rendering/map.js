import dom from "../references/dom.js";
import state from "../references/state.js";
import { getHexagonPoints } from "../logic/map.js";

const HEXAGON_OUTLINE_WIDTH = 5;
const HEXAGON_OUTLINE_COLOR = "#000";
const HEGAXON_TYPE_FILL_COLORS = {
    "passable": "#0F0",
    "impassable": "#F00",
};

/**
 * Renders the hexagonal map.
 */
function renderMap() {
    for (let x = 0; x < state.map.width; x++) {
        let column = state.map.tiles[x];
        for (let y = 0; y < state.map.height; y++) {
            let tile = column[y];
            renderTile(tile);
        }
    }
}

/**
 * Renders a single hexagonal tile.
 */
function renderTile(tile) {
    const points = getHexagonPoints(tile.center.x, tile.center.y);

    dom.context.lineWidth = HEXAGON_OUTLINE_WIDTH;
    dom.context.lineStyle = HEXAGON_OUTLINE_COLOR;
    dom.context.fillStyle = HEGAXON_TYPE_FILL_COLORS[tile.type];

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

export { renderMap };
