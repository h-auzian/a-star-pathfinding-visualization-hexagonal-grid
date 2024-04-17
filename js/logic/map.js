import { keepBetweenValues } from "../misc/functions.js";
import state from "../references/state.js";

const RADIANS = Math.PI / 180;
const HEXAGON_RADIUS = 50;
const HEXAGON_INNER_HORIZONTAL_DISTANCE = Math.cos(60 * RADIANS) * HEXAGON_RADIUS;
const HEXAGON_HORIZONTAL_DISTANCE = HEXAGON_RADIUS + HEXAGON_INNER_HORIZONTAL_DISTANCE;
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

    calculateMapBoundaries();

    if (state.debug.map.boundaries) {
        for (let i = 0; i < state.map.width; i++) {
            for (let j = 0; j < state.map.height; j++) {
                if ((i == 0 || i == state.map.width - 1) || (j == 0 || j == state.map.height - 1)) {
                    state.map.tiles[i][j].type = "impassable";
                }
            }
        }
    }
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
 * Calculates the map boundaries rectangle depending of the width and height.
 */
function calculateMapBoundaries() {
    const map = state.map;
    const lastTile = map.tiles[map.width-1][map.height-1];

    map.boundaries.left = -HEXAGON_INNER_HORIZONTAL_DISTANCE;
    map.boundaries.right = lastTile.center.x + HEXAGON_INNER_HORIZONTAL_DISTANCE;
    map.boundaries.top = 0;
    map.boundaries.bottom = lastTile.center.y;

    if (state.debug.map.boundaries) {
        const offset = 10;
        map.boundaries.left -= offset;
        map.boundaries.right += offset;
        map.boundaries.top -= offset;
        map.boundaries.bottom += offset;
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

    visibleTiles.x1 = keepBetweenValues(0, visibleTiles.x1, state.map.width-1);
    visibleTiles.x2 = keepBetweenValues(0, visibleTiles.x2, state.map.width-1);
    visibleTiles.y1 = keepBetweenValues(0, visibleTiles.y1, state.map.height-1);
    visibleTiles.y2 = keepBetweenValues(0, visibleTiles.y2, state.map.height-1);

    if (state.debug.map.visibleTiles) {
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
