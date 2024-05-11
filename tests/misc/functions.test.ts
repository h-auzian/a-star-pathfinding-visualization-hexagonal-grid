import {
  getAngleBetweenPoints,
  getLineY,
  isEven,
  isPointInsideRectangle,
  keepBetweenValues,
  rotatePoint,
} from "../../src/misc/functions";

test.each([
  [-3, false],
  [-2.5, true],
  [-2, true],
  [-1.5, false],
  [-1, false],
  [-0.5, true],
  [0, true],
  [0.5, true],
  [1, false],
  [1.5, false],
  [2, true],
  [2.5, true],
  [3, false],
])("Is number even for value %d should be %s", function(value, expected) {
  expect(isEven(value)).toBe(expected);
});

test.each([
  [10, 9, 20, 10],
  [10, 10, 20, 10],
  [10, 20, 20, 20],
  [10, 21, 20, 20],
])("Keep between values (%i, %i, %i) should be %i", function(min, value, max, expected) {
  expect(keepBetweenValues(min, value, max)).toBe(expected);
});

test.each([
  [0, 0, true],
  [-100, 0, true],
  [-101, 0, false],
  [100, 0, true],
  [101, 0, false],
  [0, -100, true],
  [0, -101, false],
  [0, 100, true],
  [0, 101, false],
  [100, 100, true],
  [101, 100, false],
  [100, 101, false],
])("Is point (%i, %i) inside rectangle should be %s", function(x, y, expectedValue) {
  const testRectangle = {
    left: -100,
    right: 100,
    top: -100,
    bottom: 100,
  };

  const point = {
    x: x,
    y: y,
  };

  expect(isPointInsideRectangle(point, testRectangle)).toBe(expectedValue);
});

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
])("Angle between points (%i, %i) and (%i, %i) should be %i", function(
  x1,
  y1,
  x2,
  y2,
  expectedValue,
) {
  const pointA = {
    x: x1,
    y: y1,
  };

  const pointB = {
    x: x2,
    y: y2,
  };

  expect(getAngleBetweenPoints(pointA, pointB)).toBe(expectedValue);
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
