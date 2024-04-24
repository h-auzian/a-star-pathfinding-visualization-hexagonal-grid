import { getRandomInteger, isPointInsideRectangle, keepBetweenValues } from "../misc/functions.js";
import state from "../global/state.js";
import {
  HEXAGON_HORIZONTAL_DISTANCE,
  HEXAGON_INNER_HORIZONTAL_DISTANCE,
  HEXAGON_RADIUS,
  HEXAGON_VERTICAL_DISTANCE,
  isPointInsideHexagon,
} from "./hexagon.js";

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

  calculateMapBoundingBoxAndBoundaries();

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

  const random = getRandomInteger(0, 1);
  const type = random == 0 ? "passable" : "impassable";

  state.map.tiles[indexX][indexY] = {
    type: type,
    center: {
      x: centerX,
      y: centerY,
    },
  }
}

/**
 * Detects and marks the tile that is currently under the cursor.
 */
function detectTileUnderCursor() {
  const mouse = state.input.mouse.position.map;
  state.map.tileUnderCursor = getTileByPoint(mouse.x, mouse.y);
}

/**
 * Calculates the map bounding box and boundaries rectangles for the current
 * width and height.
 *
 * The bounding box is the rectangle of the whole map, including the empty
 * gaps, while the boundaries exclude the gaps, so it's a little smaller than
 * the bounding box and it's useful to limit the camera.
 */
function calculateMapBoundingBoxAndBoundaries() {
  const map = state.map;

  const leftTile = map.tiles[0][0];
  const rightTile = map.tiles[map.width-1][0];
  const topTile = map.tiles[0][0];
  const bottomTile = map.width > 1 ? map.tiles[1][map.height-1] : map.tiles[0][map.height-1];

  map.boundingBox.left = leftTile.center.x - HEXAGON_RADIUS;
  map.boundingBox.right = rightTile.center.x + HEXAGON_RADIUS;
  map.boundingBox.top = topTile.center.x - HEXAGON_VERTICAL_DISTANCE;
  map.boundingBox.bottom = bottomTile.center.y + HEXAGON_VERTICAL_DISTANCE;

  map.boundaries.left = map.boundingBox.left + HEXAGON_INNER_HORIZONTAL_DISTANCE;
  map.boundaries.right = map.boundingBox.right - HEXAGON_INNER_HORIZONTAL_DISTANCE;
  map.boundaries.top = map.boundingBox.top + HEXAGON_VERTICAL_DISTANCE;
  map.boundaries.bottom = map.boundingBox.bottom - HEXAGON_VERTICAL_DISTANCE;

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
    x1: Math.floor((rect.left + HEXAGON_INNER_HORIZONTAL_DISTANCE) / HEXAGON_HORIZONTAL_DISTANCE),
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
 * Returns the hexagon that contains a given point.
 *
 * In a square grid, getting the exact tile for a given point is done by simply
 * dividing the point coordinates with the square size, but since this is an
 * hexagonal map the tiles bounding boxes overlap, so this method won't
 * necessarily return the exact tile.
 *
 * To avoid iterating the whole map, we can still use the method for square
 * grids mentioned above to get an approximated index, then expand said index
 * one tile up and one tile right to get a 2x2 grid of tiles, which are then
 * checked individually in a more precise way until the exact tile is found.
 */
function getTileByPoint(pointX, pointY) {
  if (!isPointInsideRectangle(pointX, pointY, state.map.boundingBox)) {
    return null;
  }

  const xWithMapOffset = pointX + HEXAGON_INNER_HORIZONTAL_DISTANCE;
  const yWithMapOffset = pointY + HEXAGON_VERTICAL_DISTANCE;

  const approximateIndexX = Math.floor(xWithMapOffset / HEXAGON_HORIZONTAL_DISTANCE);
  const approximateIndexY = Math.floor(yWithMapOffset / (HEXAGON_VERTICAL_DISTANCE * 2));

  const leftIndex = keepBetweenValues(0, approximateIndexX, state.map.width-1);
  const rightIndex = keepBetweenValues(0, approximateIndexX+1, state.map.width-1);
  const topIndex = keepBetweenValues(0, approximateIndexY-1, state.map.height-1);
  const bottomIndex = keepBetweenValues(0, approximateIndexY, state.map.height-1);

  for (let i = leftIndex; i <= rightIndex; i++) {
    for (let j = topIndex; j <= bottomIndex; j++) {
      const tile = state.map.tiles[i][j];
      if (isPointInsideHexagon(pointX, pointY, tile.center)) {
        return tile;
      }
    }
  }

  return null;
}

export {
  initializeMap,
  detectTileUnderCursor,
  getVisibleTiles,
};
