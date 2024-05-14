import {
  getAngleBetweenPoints,
  getDistanceBetweenPoints,
  getLineY,
  rotatePoint,
  translatePoint,
} from "../../src/misc/math";

test.each([
  [1, 0, 0, -10, -10],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 10, 10],
  [1, 10, 0, 0, -10],
  [1, 10, 0, 10, 0],
  [1, 10, 0, 20, 10],
  [1.5, 0, 0, 10, 15],
  [2, 0, 0, 10, 20],
])("Get Y position for line with slope %i and point (%i, %i) at X %i should be %i", function(
  slope,
  pointX,
  pointY,
  x,
  expectedY,
) {
  const point = {
    x: pointX,
    y: pointY,
  };

  expect(getLineY(x, point, slope)).toBeCloseTo(expectedY);
  expect(getLineY(x, point, -slope)).toBeCloseTo(-expectedY);
});

test.each([
  [0, 0, 0, 0, 0],
  [0, 0, 10, 0, 0],
  [0, 0, 10, 10, 45],
  [0, 0, 0, 10, 90],
  [0, 0, -10, 10, 135],
  [0, 0, -10, 0, 180],
  [0, 0, -10, -10, -135],
  [0, 0, 0, -10, -90],
  [0, 0, 10, -10, -45],
])("Angle between points (%i, %i) and (%i, %i) should be %i", function(x1, y1, x2, y2, expected) {
  const pointA = {
    x: x1,
    y: y1,
  };

  const pointB = {
    x: x2,
    y: y2,
  };

  expect(getAngleBetweenPoints(pointA, pointB)).toBe(expected);
});

test.each([
  [10, 10, 10, 10, 0],
  [10, 10, 20, 10, 10],
  [10, 10, 10, 20, 10],
  [10, 10, 20, 20, 14.14],
])("Distance between points (%i, %i) and (%i, %i) should be %i", function(x1, y1, x2, y2, expected) {
  const pointA = {
    x: x1,
    y: y1,
  };

  const pointB = {
    x: x2,
    y: y2,
  };

  expect(getDistanceBetweenPoints(pointA, pointB)).toBeCloseTo(expected);
  expect(getDistanceBetweenPoints(pointB, pointA)).toBeCloseTo(expected);
});

test.each([
  [10, 5, 90, -5, 10],
  [10, 5, 180, -10, -5],
  [10, 5, 270, 5, -10],
  [-10, -5, 90, 5, -10],
  [-10, -5, 180, 10, 5],
  [-10, -5, 270, -5, 10],
])("Rotating point (%i, %i) by %i degrees should return point (%i, %i)", function(
  x,
  y,
  degrees,
  expectedX,
  expectedY,
) {
  const point = {
    x: x,
    y: y,
  };

  const rotatedPoint = rotatePoint(point, degrees);
  expect(rotatedPoint.x).toBeCloseTo(expectedX);
  expect(rotatedPoint.y).toBeCloseTo(expectedY);
});

test.each([
  [0, 20, 10],
  [30, 18.6, 15],
  [45, 17, 17],
  [60, 15, 18.6],
  [90, 10, 20],
  [135, 3, 17],
  [180, 0, 10],
  [225, 3, 3],
  [270, 10, 0],
  [315, 17, 3],
])("Translate point with angle %i should result in point (%i, %i)", function(
  angle,
  expectedX,
  expectedY,
) {
  const point = {
    x: 10,
    y: 10,
  };
  const distance = 10;
  const translatedPoint = translatePoint(distance, angle, point);

  expect(translatedPoint.x).toBeCloseTo(expectedX, 0);
  expect(translatedPoint.y).toBeCloseTo(expectedY, 0);
});
