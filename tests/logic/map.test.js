import state from "../../js/global/state";
import { getHexagonPoints, getVisibleTiles, initializeMap } from "../../js/logic/map";

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
            x1: 0,
            x2: 14,
            y1: 0,
            y2: 9,
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
            x1: 86,
            x2: 99,
            y1: 0,
            y2: 9,
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
            x1: 86,
            x2: 99,
            y1: 65,
            y2: 74,
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
            x1: 0,
            x2: 14,
            y1: 65,
            y2: 74,
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
            x1: 43,
            x2: 57,
            y1: 32,
            y2: 42,
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
            x1: 0,
            x2: 99,
            y1: 0,
            y2: 74,
        },
    ]
])("Get visible tiles for rectangle %s", function(cameraRectangle, expectedIndices) {
    state.camera.rectangle.scaled = cameraRectangle
    expect(getVisibleTiles()).toStrictEqual(expectedIndices);
});

test.each([
    [0, 0],
    [-1000, -1000],
    [1000, -1000],
    [1000, 1000],
    [1000, -1000],
])("Get hexagon points with center (%i, %i)", function(centerX, centerY) {
    let expectedPoints = [
        {x: 50, y: 0},
        {x: 25, y: 43},
        {x: -25, y: 43},
        {x: -50, y: 0},
        {x: -25, y: -43},
        {x: 25, y: -43},
    ];

    expectedPoints.forEach(function(point) {
        point.x += centerX;
        point.y += centerY;
    });

    const points = getHexagonPoints(centerX, centerY);
    for (let i = 0; i < 6; i++) {
        expect(points[i].x).toBeCloseTo(expectedPoints[i].x, 0);
        expect(points[i].y).toBeCloseTo(expectedPoints[i].y, 0);
    }
});
