import { getLineY, isPointInsideRectangle, keepBetweenValues } from "../../src/misc/functions";

test.each([
  [10, 9, 20, 10],
  [10, 10, 20, 10],
  [10, 20, 20, 20],
  [10, 21, 20, 20],
])("Keep between values: (%i, %i, %i) -> %i", function(min, value, max, expected) {
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
])("Is point (%i, %i) inside rectangle", function(x, y, expectedValue) {
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
])("Get line Y for X (%i)", function(slope, pointX, pointY, x, expectedY) {
  const point = {
    x: pointX,
    y: pointY,
  };

  expect(getLineY(x, point, slope)).toBeCloseTo(expectedY);
  expect(getLineY(x, point, -slope)).toBeCloseTo(-expectedY);
});
