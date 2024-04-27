import { getRandomInteger, isPointInsideRectangle, keepBetweenValues } from "../misc/functions";
import {
  HEXAGON_HORIZONTAL_DISTANCE,
  HEXAGON_INNER_HORIZONTAL_DISTANCE,
  HEXAGON_RADIUS,
  HEXAGON_VERTICAL_DISTANCE,
  isPointInsideHexagon,
} from "./hexagon";
import { Point, Rectangle, Tile, TileType } from "../misc/types";
import { MapState } from "../state/map";
import { ControlState } from "../state/controls";

/**
 * Initializes the map data as a two dimensional array.
 */
function initializeMap(mapState: MapState): void {
  mapState.tiles = Array(mapState.dimensions.width);
  for (let i = 0; i < mapState.dimensions.width; i++) {
    mapState.tiles[i] = Array(mapState.dimensions.height);
    for (let j = 0; j < mapState.dimensions.height; j++) {
      mapState.tiles[i][j] = createTile(i, j);
    }
  }

  calculateMapBoundingBoxAndBoundaries(mapState);

  if (mapState.debug.boundaries) {
    for (let i = 0; i < mapState.dimensions.width; i++) {
      for (let j = 0; j < mapState.dimensions.height; j++) {
        if ((i == 0 || i == mapState.dimensions.width - 1) || (j == 0 || j == mapState.dimensions.height - 1)) {
          mapState.tiles[i][j].type = TileType.Passable;
        }
      }
    }
  }
}

/**
 * Returns a tile object with its center position according to the indices
 * received.
 */
function createTile(indexX: number, indexY: number): Tile {
  const centerX = HEXAGON_HORIZONTAL_DISTANCE * indexX;
  const centerY = HEXAGON_VERTICAL_DISTANCE * (indexY * 2 + indexX % 2);

  const random = getRandomInteger(0, 1);
  const type = random == 0 ? TileType.Passable : TileType.Impassable;

  return {
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
function detectTileUnderCursor(mapState: MapState, controlState: ControlState): void {
  mapState.tileUnderCursor = getTileByPoint(mapState, controlState.cursor.map);
}

/**
 * Calculates the map bounding box and boundaries rectangles for the current
 * width and height.
 *
 * The bounding box is the rectangle of the whole map, including the empty
 * gaps, while the boundaries exclude the gaps, so it's a little smaller than
 * the bounding box and it's useful to limit the camera.
 */
function calculateMapBoundingBoxAndBoundaries(mapState: MapState): void {
  const leftTile = mapState.tiles[0][0];
  const rightTile = mapState.tiles[mapState.dimensions.width-1][0];
  const topTile = mapState.tiles[0][0];
  let bottomTile = mapState.tiles[0][mapState.dimensions.height-1];
  if (mapState.dimensions.width > 1) {
    bottomTile = mapState.tiles[1][mapState.dimensions.height-1];
  }

  mapState.boundingBox.left = leftTile.center.x - HEXAGON_RADIUS;
  mapState.boundingBox.right = rightTile.center.x + HEXAGON_RADIUS;
  mapState.boundingBox.top = topTile.center.x - HEXAGON_VERTICAL_DISTANCE;
  mapState.boundingBox.bottom = bottomTile.center.y + HEXAGON_VERTICAL_DISTANCE;

  mapState.boundaries.left = mapState.boundingBox.left + HEXAGON_INNER_HORIZONTAL_DISTANCE;
  mapState.boundaries.right = mapState.boundingBox.right - HEXAGON_INNER_HORIZONTAL_DISTANCE;
  mapState.boundaries.top = mapState.boundingBox.top + HEXAGON_VERTICAL_DISTANCE;
  mapState.boundaries.bottom = mapState.boundingBox.bottom - HEXAGON_VERTICAL_DISTANCE;

  if (mapState.debug.boundaries) {
    const offset = 10;
    mapState.boundaries.left -= offset;
    mapState.boundaries.right += offset;
    mapState.boundaries.top -= offset;
    mapState.boundaries.bottom += offset;
  }
}

/**
 * Returns the four indices of the corners of the rectangle of tiles that are
 * visible on the viewport rectangle.
 *
 * Since the columns with even index have a vertical offset in their position,
 * this rectangle is not completely accurate and may include a row of
 * invisible tiles at the top and bottom, but in practice the effect is
 * minor and gets the job done.
 */
function getVisibleTiles(mapState: MapState, viewport: Rectangle): Rectangle {
  const visibleTiles: Rectangle = {
    left: Math.floor((viewport.left + HEXAGON_INNER_HORIZONTAL_DISTANCE) / HEXAGON_HORIZONTAL_DISTANCE),
    right: Math.floor((viewport.right + HEXAGON_RADIUS) / HEXAGON_HORIZONTAL_DISTANCE),
    top: Math.floor(viewport.top / (HEXAGON_VERTICAL_DISTANCE * 2)),
    bottom: Math.floor((viewport.bottom + HEXAGON_VERTICAL_DISTANCE) / (HEXAGON_VERTICAL_DISTANCE * 2)),
  };

  visibleTiles.left = keepBetweenValues(0, visibleTiles.left, mapState.dimensions.width - 1);
  visibleTiles.right = keepBetweenValues(0, visibleTiles.right, mapState.dimensions.width - 1);
  visibleTiles.top = keepBetweenValues(0, visibleTiles.top, mapState.dimensions.height - 1);
  visibleTiles.bottom = keepBetweenValues(0, visibleTiles.bottom, mapState.dimensions.height - 1);

  if (mapState.debug.visibleTiles) {
    visibleTiles.left++;
    visibleTiles.right--;
    visibleTiles.top++;
    visibleTiles.bottom--;
  }

  return visibleTiles;
}

/**
 * Returns the tile that contains a given point.
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
function getTileByPoint(mapState: MapState, point: Point): Tile | null {
  if (!isPointInsideRectangle(point, mapState.boundingBox)) {
    return null;
  }

  const xWithMapOffset = point.x + HEXAGON_INNER_HORIZONTAL_DISTANCE;
  const yWithMapOffset = point.y + HEXAGON_VERTICAL_DISTANCE;

  const approximateIndexX = Math.floor(xWithMapOffset / HEXAGON_HORIZONTAL_DISTANCE);
  const approximateIndexY = Math.floor(yWithMapOffset / (HEXAGON_VERTICAL_DISTANCE * 2));

  const leftIndex = keepBetweenValues(0, approximateIndexX, mapState.dimensions.width - 1);
  const rightIndex = keepBetweenValues(0, approximateIndexX + 1, mapState.dimensions.width - 1);
  const topIndex = keepBetweenValues(0, approximateIndexY - 1, mapState.dimensions.height - 1 );
  const bottomIndex = keepBetweenValues(0, approximateIndexY, mapState.dimensions.height - 1);

  for (let i = leftIndex; i <= rightIndex; i++) {
    for (let j = topIndex; j <= bottomIndex; j++) {
      const tile = mapState.tiles[i][j];
      if (isPointInsideHexagon(point, tile.center)) {
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
}
