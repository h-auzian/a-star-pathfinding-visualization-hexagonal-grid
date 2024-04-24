/**
 * Returns a random integer between min and max, both inclusive.
 */
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Keeps the value between min and max, both inclusive.
 */
function keepBetweenValues(min, value, max) {
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
function isPointInsideRectangle(pointX, pointY, rectangle) {
  if (pointX >= rectangle.left && pointX <= rectangle.right) {
    if (pointY >= rectangle.top && pointY <= rectangle.bottom) {
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
function getLineY(x, point, slope) {
  return slope * (x - point.x) + point.y;
}

export {
  getRandomInteger,
  keepBetweenValues,
  isPointInsideRectangle,
  getLineY,
};
