import state from "./state.js";

const RADIANS = Math.PI / 180;
const HEXAGON_RADIUS = 50;

function initializeMap() {
    state.map.tiles = new Array(state.map.width);
    for (let i = 0; i < state.map.width; i++) {
        state.map.tiles[i] = Array(state.map.height);
        for (let j = 0; j < state.map.height; j++) {
            initializeTile(i, j);
        }
    }

    state.map.tiles[5][3].type = "impassable";
}

function initializeTile(indexX, indexY) {
    let angle = 60 * RADIANS;
    const centerX = (HEXAGON_RADIUS + Math.cos(angle) * HEXAGON_RADIUS) * indexX;
    const centerY = Math.sin(angle) * HEXAGON_RADIUS * (indexY * 2 + indexX % 2);

    state.map.tiles[indexX][indexY] = {
        type: "passable",
        center: {
            x: centerX,
            y: centerY,
        },
    }
}

/**
 * Returns the 6 vertices from an hexagon with a given center.
 */
function getHexagonPoints(centerX, centerY) {
    let points = [];

    for (let i = 0; i < 6; i++) {
        let angle = 60 * i * RADIANS;
        const x = Math.cos(angle) * HEXAGON_RADIUS + centerX;
        const y = Math.sin(angle) * HEXAGON_RADIUS + centerY;
        points.push({x, y});
    }

    return points;
}

export {
    initializeMap,
    getHexagonPoints,
};
