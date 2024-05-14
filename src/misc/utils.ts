import { FrameValues } from "../types/misc";
import { Point, Rectangle } from "../types/primitives";

/**
 * Sets a new value for the current frame whle keeping the value for the
 * previous frame.
 */
function setFrameValue<Type>(control: FrameValues<Type>, raw: Type): void {
  control.previous = control.current;
  control.current = raw;
}

/**
 * Returns whether the frame value was changed this frame compared to the
 * previous one.
 */
function frameValueChanged<Type>(control: FrameValues<Type>): boolean {
  return control.previous !== control.current;
}

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
 * Returns whether a point is inside a rectangle.
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
 * Returns whether two rectangles intersect.
 */
function rectanglesIntersect(a: Rectangle, b: Rectangle): boolean {
  if (a.left < b.right && a.right > b.left) {
    if (a.top < b.bottom && a.bottom > b.top) {
      return true;
    }
  }

  return false;
}

export {
  setFrameValue,
  frameValueChanged,
  isEven,
  getRandomInteger,
  keepBetweenValues,
  isPointInsideRectangle,
  rectanglesIntersect,
}
