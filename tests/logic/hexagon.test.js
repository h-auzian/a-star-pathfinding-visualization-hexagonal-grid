import { getHexagonPoints } from "../../js/logic/hexagon";

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
