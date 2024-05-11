import {
  HEXAGON_INNER_HORIZONTAL_DISTANCE,
  HEXAGON_RADIUS,
  HEXAGON_VERTICAL_DISTANCE,
  getHexagonPoints,
  isPointInsideHexagon,
} from "../../src/logic/hexagon";

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

  const points = getHexagonPoints({
    x: centerX,
    y: centerY,
  });

  for (let i = 0; i < 6; i++) {
    expect(points[i].x).toBeCloseTo(expectedPoints[i].x, 0);
    expect(points[i].y).toBeCloseTo(expectedPoints[i].y, 0);
  }
});

test.each([
  [0, 0, true],
  [HEXAGON_RADIUS, 0, true],
  [HEXAGON_RADIUS+1, 0, false],
  [0, HEXAGON_VERTICAL_DISTANCE, true],
  [0, HEXAGON_VERTICAL_DISTANCE+1, false],
  [HEXAGON_INNER_HORIZONTAL_DISTANCE, HEXAGON_VERTICAL_DISTANCE, true],
  [HEXAGON_INNER_HORIZONTAL_DISTANCE+1, HEXAGON_VERTICAL_DISTANCE, false],
  [HEXAGON_INNER_HORIZONTAL_DISTANCE*1.5, HEXAGON_VERTICAL_DISTANCE*0.5, true],
  [HEXAGON_INNER_HORIZONTAL_DISTANCE*1.5, HEXAGON_VERTICAL_DISTANCE*0.5+1, false],
])("Detect point (%i, %i) inside hexagon on all quadrants", function(
  offsetX,
  offsetY,
  expectedResult,
) {
  const hexagonGlobalCenter = {
    x: 1000,
    y: 1000,
  };

  const pointsPerQuadrant = [
    {
      x: hexagonGlobalCenter.x - offsetX,
      y: hexagonGlobalCenter.y - offsetY,
    },
    {
      x: hexagonGlobalCenter.x + offsetX,
      y: hexagonGlobalCenter.y - offsetY,
    },
    {
      x: hexagonGlobalCenter.x - offsetX,
      y: hexagonGlobalCenter.y + offsetY,
    },
    {
      x: hexagonGlobalCenter.x + offsetX,
      y: hexagonGlobalCenter.y + offsetY,
    },
  ];

  pointsPerQuadrant.forEach(function(point) {
    expect(isPointInsideHexagon(point, hexagonGlobalCenter)).toBe(expectedResult);
  });
});
