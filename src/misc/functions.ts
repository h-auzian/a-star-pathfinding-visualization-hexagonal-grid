import { Point, Rectangle } from "../misc/types";

/**
 * Returns whether the absolute value of the received number is even or not. If
 * the number contains decimals, then it is rounded down.
 */
function isEven(x: number): boolean {
  return Math.floor(Math.abs(x)) % 2 === 0;
}

/**
 * Returns a random integer between min and max, both inclusive.
 */
function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Keeps the value between min and max, both inclusive.
 */
function keepBetweenValues(min: number, value: number, max: number): number {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}

/**
 * Returns a boolean if a point is inside a rectangle.
 */
function isPointInsideRectangle(point: Point, rectangle: Rectangle): boolean {
  if (point.x >= rectangle.left && point.x <= rectangle.right) {
    if (point.y >= rectangle.top && point.y <= rectangle.bottom) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the Y coordinate of a line with a known point and slope for a given
 * X coordinate.
 *
 * The straight line equation (y - y1) = m(x - x1) is used.
 */
function getLineY(x: number, point: Point, slope: number): number {
  return slope * (x - point.x) + point.y;
}

export {
  isEven,
  getRandomInteger,
  keepBetweenValues,
  isPointInsideRectangle,
  getLineY,
}
