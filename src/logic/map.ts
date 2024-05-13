import {
  getRandomInteger,
  isEven,
  isPointInsideRectangle,
  keepBetweenValues,
} from "../misc/functions";

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
import { clearPreviousPathData, findPath } from "./pathfinding";

const NEIGHBOURS = {
  even: [
    [-1, -1], [0, -1], [1, -1], [1, 0], [0, 1], [-1, 0],
  ],
  odd: [
    [-1, 0], [0, -1], [1, 0], [1, 1], [0, 1], [-1, 1],
  ],
}

/**
 * Initializes the map data as a two dimensional array of hexagonal tiles.
 *
 * There are many ways to represent an hexagonal map. In this case, "offset"
 * coordinates are used with odd columns shoved down.
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
}

/**
 * Returns a tile object with its center position according to the indices
 * received.
 */
function createTile(indexX: number, indexY: number): Tile {
  const centerX = HEXAGON_HORIZONTAL_DISTANCE * indexX;
  const centerY = HEXAGON_VERTICAL_DISTANCE * (indexY * 2 + indexX % 2);

  const random = getRandomInteger(0, 3);
  const type = random == 0 ? TileType.Impassable : TileType.Passable;

  return {
    index: {
      x: indexX,
      y: indexY,
    },
    center: {
      x: centerX,
      y: centerY,
    },
    type: type,
    path: {
      checked: false,
      used: false,
      cost: 0,
      heuristic: 0,
      parent: null,
    },
  }
}


/**
 * Clears any impassable tiles around a position's small radius.
 */
function clearTilesAroundPosition(
  mapState: MapState,
  position: Point,
): void {
  const tile = getTileByPoint(mapState, position);
  if (tile === null) {
    return;
  }

  const tilesToClear: Tile[] = [tile];
  const neighbours = getTileNeighbours(mapState.tiles, tile);
  tilesToClear.push(...neighbours);

  neighbours.forEach(neighbour => {
    tilesToClear.push(...getTileNeighbours(mapState.tiles, neighbour));
  });

  tilesToClear.forEach(tile => tile.type = TileType.Passable);
}

/**
 * Returns the centermost tile of the map.
 */
function getCenterTile(mapState: MapState): Tile {
  const x = Math.floor(mapState.dimensions.width / 2);
  const y = Math.floor(mapState.dimensions.height / 2);
  return mapState.tiles[x][y];
}

/**
 * Detects and marks the tile that is currently under the cursor.
 */
function detectTileUnderCursor(mapState: MapState, controlState: ControlState): void {
  const tileCursor = mapState.tileUnderCursor;
  tileCursor.previous = tileCursor.current;
  tileCursor.current = getTileByPoint(mapState, controlState.cursor.camera);
}

/**
 * Updates the path from the starting tile to the hovered tile, and stores the
 * route in the state.
 *
 * To avoid redundant path calculations, a new path is only calculated if the
 * start or destination tiles changed compared to the previous path.
 */
function detectPathToTileUnderCursor(
  mapState: MapState,
  startingPosition: Point,
): void {
  const start = mapState.pathfinding.startingTile;
  const destination = mapState.tileUnderCursor;

  start.previous = start.current;
  start.current = getTileByPoint(mapState, startingPosition);

  if (start.current === null || destination.current === null) {
    return;
  }

  if (start.previous === start.current && destination.previous === destination.current) {
    return;
  }

  const data = mapState.pathfinding.data;
  clearPreviousPathData(data);

  mapState.pathfinding.data = findPath(
    mapState.tiles,
    start.current,
    destination.current,
    mapState.pathfinding.algorithm,
    mapState.pathfinding.data,
  );
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
  const rightTile = mapState.tiles[mapState.dimensions.width - 1][0];
  const topTile = mapState.tiles[0][0];
  let bottomTile = mapState.tiles[0][mapState.dimensions.height - 1];
  if (mapState.dimensions.width > 1) {
    bottomTile = mapState.tiles[1][mapState.dimensions.height - 1];
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
    const offset = 20;
    mapState.boundaries.left -= offset;
    mapState.boundaries.right += offset;
    mapState.boundaries.top -= offset;
    mapState.boundaries.bottom += offset;
  }
}

/**
 * Returns a rectangle with the indices of the four corners of the group of
 * tiles that are visible on the received viewport rectangle.
 *
 * Since the columns with even index have a vertical offset in their position,
 * this rectangle is not completely accurate and may include a row of
 * invisible tiles at the top and bottom, but in practice the effect is
 * minor and gets the job done.
 */
function getVisibleTilesIndices(mapState: MapState, viewport: Rectangle): Rectangle {
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
 * Returns a list of tiles that are visible on the received viewport rectangle.
 */
function getVisibleTiles(mapState: MapState, viewport: Rectangle): Tile[] {
  const visibleTilesIndices = getVisibleTilesIndices(mapState, viewport);

  const tiles = [];
  for (let x = visibleTilesIndices.left; x <= visibleTilesIndices.right; x++) {
    for (let y = visibleTilesIndices.top; y <= visibleTilesIndices.bottom; y++) {
      tiles.push(mapState.tiles[x][y]);
    }
  }

  return tiles;
}

/**
 * For the given tile, returns its possible six neighbours in clockwise order
 * starting from the upper left corner.
 */
function getTileNeighbours(tiles: Tile[][], tile: Tile): Tile[] {
  const width = tiles.length;
  const height = tiles[0].length;
  const offsets = isEven(tile.index.x) ? NEIGHBOURS.even : NEIGHBOURS.odd;

  let neighbouringTiles: Tile[] = [];
  for (let i = 0; i < offsets.length; i++) {
    const x = tile.index.x + offsets[i][0];
    const y = tile.index.y + offsets[i][1];
    if (x >= 0 && x < width && y >= 0 && y < height) {
      neighbouringTiles.push(tiles[x][y]);
    }
  }

  return neighbouringTiles;
}

/**
 * Returns the Manhattan distance between two tiles, that is, how many tiles
 * they are apart only allowing tile-to-tile movements, which is not the same
 * as the euclidean distance.
 *
 * Since offset coordinates are used, odd columns must be taken into account.
 */
function getManhattanDistance(a: Tile, b: Tile): number {
  const x1 = a.index.x;
  const y1 = a.index.y;
  const x2 = b.index.x;
  const y2 = b.index.y;

  let offset = 0;
  if (isEven(x1) && !isEven(x2) && (y1 < y2)) {
    offset = 1;
  } else if (!isEven(x1) && isEven(x2) && (y1 > y2)) {
    offset = 1;
  }

  let dx = Math.abs(x1 - x2);
  let dy = Math.abs(y1 - y2) + Math.floor(dx / 2) + offset;

  return Math.max(dx, dy);
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
  const topIndex = keepBetweenValues(0, approximateIndexY - 1, mapState.dimensions.height - 1);
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
  clearTilesAroundPosition,
  getCenterTile,
  detectTileUnderCursor,
  detectPathToTileUnderCursor,
  getVisibleTilesIndices,
  getVisibleTiles,
  getTileNeighbours,
  getManhattanDistance,
}
