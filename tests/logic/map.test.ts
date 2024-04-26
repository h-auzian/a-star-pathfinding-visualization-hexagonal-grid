import state from "../../src/global/state";
import { getVisibleTiles, initializeMap } from "../../src/logic/map";

const TEST_CAMERA_WIDTH = 1000;
const TEST_CAMERA_HEIGHT = 800;
const TEST_MAP_RIGHT_BOUNDARY = 7450;
const TEST_MAP_BOTTOM_BOUNDARY = 6452;

beforeAll(function() {
  state.map.width = 100;
  state.map.height = 75;

  initializeMap();
});

test("Map boundaries", function() {
  const boundaries = state.map.boundaries;
  expect(boundaries.left).toBeCloseTo(-25, 0);
  expect(boundaries.right).toBeCloseTo(TEST_MAP_RIGHT_BOUNDARY, 0);
  expect(boundaries.top).toBe(0);
  expect(boundaries.bottom).toBeCloseTo(TEST_MAP_BOTTOM_BOUNDARY, 0);
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
])("Get visible tiles for rectangle %s", function(cameraRectangle, expectedIndices) {
  state.camera.rectangle.scaled = cameraRectangle
  expect(getVisibleTiles()).toStrictEqual(expectedIndices);
});
