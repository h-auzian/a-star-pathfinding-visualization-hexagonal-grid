import state from "../references/state.js";

const RADIANS = Math.PI / 180;
const HEXAGON_RADIUS = 50;
const HEXAGON_HORIZONTAL_DISTANCE = HEXAGON_RADIUS + Math.cos(60 * RADIANS) * HEXAGON_RADIUS;
const HEXAGON_VERTICAL_DISTANCE = Math.sin(60 * RADIANS) * HEXAGON_RADIUS;

/**
 * Initializes the map state data as a two dimensional array.
 */
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

/**
 * Initializes a tile state data, calculating its center position acorrding to
 * the X and Y index.
 */
function initializeTile(indexX, indexY) {
    const centerX = HEXAGON_HORIZONTAL_DISTANCE * indexX;
    const centerY = HEXAGON_VERTICAL_DISTANCE * (indexY * 2 + indexX % 2);

    state.map.tiles[indexX][indexY] = {
        type: "passable",
        center: {
            x: centerX,
            y: centerY,
        },
    }
}

/**
 * Returns the four indices of the corners of the rectangle of tiles that are
 * visible on the camera.
 *
 * Since the columns with even index have a vertical offset in their position,
 * this rectangle is not completely accurate and may include a row of
 * invisible tiles at the top and bottom, but in practice the effect is
 * minor and gets the job done.
 */
function getVisibleTiles() {
    const rect = state.camera.rectangle.scaled;

    const visibleTiles = {
        x1: Math.floor((rect.left + HEXAGON_RADIUS / 2) / HEXAGON_HORIZONTAL_DISTANCE),
        x2: Math.floor((rect.right + HEXAGON_RADIUS) / HEXAGON_HORIZONTAL_DISTANCE),
        y1: Math.floor(rect.top / (HEXAGON_VERTICAL_DISTANCE * 2)),
        y2: Math.floor((rect.bottom + HEXAGON_VERTICAL_DISTANCE) / (HEXAGON_VERTICAL_DISTANCE * 2)),
    };

    visibleTiles.x1 = Math.max(0, Math.min(visibleTiles.x1, state.map.width-1));
    visibleTiles.x2 = Math.max(0, Math.min(visibleTiles.x2, state.map.width-1));
    visibleTiles.y1 = Math.max(0, Math.min(visibleTiles.y1, state.map.height-1));
    visibleTiles.y2 = Math.max(0, Math.min(visibleTiles.y2, state.map.height-1));

    if (state.map.debugVisibleTiles) {
        visibleTiles.x1++;
        visibleTiles.x2--;
        visibleTiles.y1++;
        visibleTiles.y2--;
    }

    return visibleTiles;
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
    getVisibleTiles,
    getHexagonPoints,
};
