import { Point } from "../types/primitives";

const RADIANS = Math.PI / 180;
const DEGREES = 180 / Math.PI;

/**
 * Returns the Y coordinate of a line with a known point and slope for a given
 * X coordinate.
 *
 * The straight line equation (y - y1) = m(x - x1) is used.
 */
function getLineY(x: number, point: Point, slope: number): number {
  return slope * (x - point.x) + point.y;
}

/**
 * Returns the angle between two points in degrees.
 */
function getAngleBetweenPoints(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.atan2(dy, dx) * DEGREES;
}

/**
 * Returns the distance between two points.
 */
function getDistanceBetweenPoints(a: Point, b: Point): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

/**
 * Rotates a point relative to the origin by the received degrees.
 */
function rotatePoint(a: Point, degrees: number): Point {
  const radians = degrees * RADIANS;
  return {
    x: a.x * Math.cos(radians) - a.y * Math.sin(radians),
    y: a.y * Math.cos(radians) + a.x * Math.sin(radians),
  };
}

/**
 * Convenience function to rotate multiple points by the received degrees.
 */
function rotatePoints(points: Point[], degrees: number): Point[] {
  const rotatedPoints: Point[] = [];
  points.forEach(point => {
    rotatedPoints.push(rotatePoint(point, degrees));
  });

  return rotatedPoints;
}

/**
 * Applies a translation with the given distance and angle to a given point.
 *
 * If the point is undefined, then it assumes the origin.
 */
function translatePoint(distance: number, angle: number, point?: Point): Point {
  if (point === undefined) {
    point = {
      x: 0,
      y: 0,
    };
  }

  return {
    x: point.x + Math.cos(angle * RADIANS) * distance,
    y: point.y + Math.sin(angle * RADIANS) * distance,
  };
}

export {
  RADIANS,
  DEGREES,
  getLineY,
  getAngleBetweenPoints,
  getDistanceBetweenPoints,
  rotatePoint,
  rotatePoints,
  translatePoint,
}
