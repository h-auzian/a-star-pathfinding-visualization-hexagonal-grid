import {
  getManhattanDistance,
  getTileNeighbours,
  getVisibleTilesIndices,
  initializeMap,
} from "../../src/logic/map";

import { createMapState } from "../../src/state/map";

const TEST_CAMERA_WIDTH = 1000;
const TEST_CAMERA_HEIGHT = 800;
const TEST_MAP_RIGHT_BOUNDARY = 7450;
const TEST_MAP_BOTTOM_BOUNDARY = 6452;

const mapState = createMapState();

beforeAll(function() {
  mapState.dimensions.width = 100;
  mapState.dimensions.height = 75;
  initializeMap(mapState);
});

test("Map boundaries", function() {
  expect(mapState.boundaries.left).toBeCloseTo(-25, 0);
  expect(mapState.boundaries.right).toBeCloseTo(TEST_MAP_RIGHT_BOUNDARY, 0);
  expect(mapState.boundaries.top).toBe(0);
  expect(mapState.boundaries.bottom).toBeCloseTo(TEST_MAP_BOTTOM_BOUNDARY, 0);
});

test.each([
  // Camera on upper left corner of map.
  [
    {
      left: 0,
      right: TEST_CAMERA_WIDTH,
      top: 0,
      bottom: TEST_CAMERA_HEIGHT,
    },
    {
      left: 0,
      right: 14,
      top: 0,
      bottom: 9,
    },
  ],

  // Camera on upper right corner of map.
  [
    {
      left: TEST_MAP_RIGHT_BOUNDARY - TEST_CAMERA_WIDTH,
      right: TEST_MAP_RIGHT_BOUNDARY,
      top: 0,
      bottom: TEST_CAMERA_HEIGHT,
    },
    {
      left: 86,
      right: 99,
      top: 0,
      bottom: 9,
    },
  ],

  // Camera on lower right corner of map.
  [
    {
      left: TEST_MAP_RIGHT_BOUNDARY - TEST_CAMERA_WIDTH,
      right: TEST_MAP_RIGHT_BOUNDARY,
      top: TEST_MAP_BOTTOM_BOUNDARY - TEST_CAMERA_HEIGHT,
      bottom: TEST_MAP_BOTTOM_BOUNDARY,
    },
    {
      left: 86,
      right: 99,
      top: 65,
      bottom: 74,
    },
  ],

  // Camera on lower left corner of map.
  [
    {
      left: 0,
      right: TEST_CAMERA_WIDTH,
      top: TEST_MAP_BOTTOM_BOUNDARY - TEST_CAMERA_HEIGHT,
      bottom: TEST_MAP_BOTTOM_BOUNDARY,
    },
    {
      left: 0,
      right: 14,
      top: 65,
      bottom: 74,
    },
  ],

  // Camera in center of map.
  [
    {
      left: TEST_MAP_RIGHT_BOUNDARY / 2 - TEST_CAMERA_WIDTH / 2,
      right: TEST_MAP_RIGHT_BOUNDARY / 2 + TEST_CAMERA_WIDTH / 2,
      top: TEST_MAP_BOTTOM_BOUNDARY / 2 - TEST_CAMERA_HEIGHT / 2,
      bottom: TEST_MAP_BOTTOM_BOUNDARY / 2 + TEST_CAMERA_HEIGHT /2,
    },
    {
      left: 43,
      right: 57,
      top: 32,
      bottom: 42,
    },
  ],

  // Camera with same size as than map.
  [
    {
      left: 0,
      right: TEST_MAP_RIGHT_BOUNDARY,
      top: 0,
      bottom: TEST_MAP_BOTTOM_BOUNDARY,
    },
    {
      left: 0,
      right: 99,
      top: 0,
      bottom: 74,
    },
  ]
])("Visible tiles for viewport %s", function(viewport, expectedIndices) {
  expect(getVisibleTilesIndices(mapState, viewport)).toStrictEqual(expectedIndices);
});

test.each([
  // Odd column with all six neighbours.
  [1, 1, [
    [0, 1],
    [1, 0],
    [2, 1],
    [2, 2],
    [1, 2],
    [0, 2],
  ]],

  // Even column with all six neighbours.
  [2, 1, [
    [1, 0],
    [2, 0],
    [3, 0],
    [3, 1],
    [2, 2],
    [1, 1],
  ]],

  // Upper left corner.
  [0, 0, [
    [1, 0],
    [0, 1],
  ]],

  // Upper right corner.
  [99, 0, [
    [98, 0],
    [99, 1],
    [98, 1],
  ]],

  // Lower right corner.
  [99, 74, [
    [98, 74],
    [99, 73],
  ]],

  // Lower left corner.
  [0, 74, [
    [0, 73],
    [1, 73],
    [1, 74],
  ]],
])("Neighbours for tile (%i, %i)", function(centerX, centerY, expectedIndices) {
  const centerTile = mapState.tiles[centerX][centerY];
  const neighbours = getTileNeighbours(mapState.tiles, centerTile);

  let indices: number[][] = [];
  for (let i = 0; i < neighbours.length; i++) {
    const tile = neighbours[i];
    indices.push([tile.index.x, tile.index.y]);
  }

  expect(indices).toStrictEqual(expectedIndices);
});

test.each([
  // Same tile.
  [[10, 10], [10, 10], 0],
  [[11, 10], [11, 10], 0],

  // From tile with even X index to tiles with distance 1.
  [[10, 10], [9, 9], 1],
  [[10, 10], [10, 9], 1],
  [[10, 10], [11, 9], 1],
  [[10, 10], [11, 10], 1],
  [[10, 10], [10, 11], 1],
  [[10, 10], [9, 10], 1],

  // From tile with even X index to tiles with distance 2.
  [[10, 10], [8, 9], 2],
  [[10, 10], [9, 8], 2],
  [[10, 10], [10, 8], 2],
  [[10, 10], [11, 8], 2],
  [[10, 10], [12, 9], 2],
  [[10, 10], [12, 10], 2],
  [[10, 10], [12, 11], 2],
  [[10, 10], [11, 11], 2],
  [[10, 10], [10, 12], 2],
  [[10, 10], [9, 11], 2],
  [[10, 10], [8, 11], 2],
  [[10, 10], [8, 10], 2],

  // From tile with even X index to tiles with distance 3.
  [[10, 10], [7, 8], 3],
  [[10, 10], [8, 8], 3],
  [[10, 10], [9, 7], 3],
  [[10, 10], [10, 7], 3],
  [[10, 10], [11, 7], 3],
  [[10, 10], [12, 8], 3],
  [[10, 10], [13, 8], 3],
  [[10, 10], [13, 9], 3],
  [[10, 10], [13, 10], 3],
  [[10, 10], [13, 11], 3],
  [[10, 10], [12, 12], 3],
  [[10, 10], [11, 12], 3],
  [[10, 10], [10, 13], 3],
  [[10, 10], [9, 12], 3],
  [[10, 10], [8, 12], 3],
  [[10, 10], [7, 11], 3],
  [[10, 10], [7, 10], 3],
  [[10, 10], [7, 9], 3],

  // From tile with odd X index to tiles with distance 1.
  [[11, 10], [10, 10], 1],
  [[11, 10], [11, 9], 1],
  [[11, 10], [12, 10], 1],
  [[11, 10], [12, 11], 1],
  [[11, 10], [11, 11], 1],
  [[11, 10], [10, 11], 1],

  // From tile with odd X index to tiles with distance 2.
  [[11, 10], [9, 9], 2],
  [[11, 10], [10, 9], 2],
  [[11, 10], [11, 8], 2],
  [[11, 10], [12, 9], 2],
  [[11, 10], [13, 9], 2],
  [[11, 10], [13, 10], 2],
  [[11, 10], [13, 11], 2],
  [[11, 10], [12, 12], 2],
  [[11, 10], [11, 12], 2],
  [[11, 10], [10, 12], 2],
  [[11, 10], [9, 11], 2],
  [[11, 10], [9, 10], 2],

  // From tile with odd X index to tiles with distance 3.
  [[11, 10], [8, 9], 3],
  [[11, 10], [9, 8], 3],
  [[11, 10], [10, 8], 3],
  [[11, 10], [11, 7], 3],
  [[11, 10], [12, 8], 3],
  [[11, 10], [13, 8], 3],
  [[11, 10], [14, 9], 3],
  [[11, 10], [14, 10], 3],
  [[11, 10], [14, 11], 3],
  [[11, 10], [14, 12], 3],
  [[11, 10], [13, 12], 3],
  [[11, 10], [12, 13], 3],
  [[11, 10], [11, 13], 3],
  [[11, 10], [10, 13], 3],
  [[11, 10], [9, 12], 3],
  [[11, 10], [8, 12], 3],
  [[11, 10], [8, 11], 3],
  [[11, 10], [8, 10], 3],

  // From top left corner to different edges of the map.
  [[0, 0], [99, 0], 99],
  [[0, 0], [0, 74], 74],
  [[0, 0], [99, 49], 99],
  [[0, 0], [99, 74], 124],

])("Manhattan distance between %s and %s should be %i", function(
  indexA,
  indexB,
  expectedDistance,
) {
  const tileA = mapState.tiles[indexA[0]][indexA[1]];
  const tileB = mapState.tiles[indexB[0]][indexB[1]];

  expect(getManhattanDistance(tileA, tileB)).toBe(expectedDistance);
  expect(getManhattanDistance(tileB, tileA)).toBe(expectedDistance);
});
