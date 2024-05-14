import {
  isEven,
  isPointInsideRectangle,
  keepBetweenValues,
  rectanglesIntersect,
} from "../../src/misc/utils";

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
])("Is point (%i, %i) inside rectangle should be %s", function(x, y, expected) {
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

  expect(isPointInsideRectangle(point, testRectangle)).toBe(expected);
});

test.each([
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 9, right: 19, top: 0, bottom: 10 },
    true,
  ],
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 10, right: 20, top: 0, bottom: 10 },
    false,
  ],
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 0, right: 10, top: 9, bottom: 19 },
    true,
  ],
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 0, right: 10, top: 10, bottom: 20 },
    false,
  ],
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 9, right: 19, top: 9, bottom: 19 },
    true,
  ],
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 10, right: 20, top: 10, bottom: 20 },
    false,
  ],
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 0, right: 10, top: 0, bottom: 10 },
    true,
  ],
  [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 1, right: 9, top: 1, bottom: 9 },
    true,
  ],
])("Rectangle intersection between %s and %s should return %s", function(a, b, expected) {
  expect(rectanglesIntersect(a, b)).toBe(expected);
  expect(rectanglesIntersect(b, a)).toBe(expected);
});
