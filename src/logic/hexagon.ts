import { getLineY, isPointInsideRectangle } from "../misc/functions";
import { Point, Rectangle } from "../misc/types";

const RADIANS = Math.PI / 180;

const HEXAGON_RADIUS = 50;
const HEXAGON_INNER_HORIZONTAL_DISTANCE = Math.cos(60 * RADIANS) * HEXAGON_RADIUS;
const HEXAGON_HORIZONTAL_DISTANCE = HEXAGON_RADIUS + HEXAGON_INNER_HORIZONTAL_DISTANCE;
const HEXAGON_VERTICAL_DISTANCE = Math.sin(60 * RADIANS) * HEXAGON_RADIUS;

const HEXAGON_QUADRANT_BOUNDING_BOX: Rectangle = {
  left: 0,
  right: HEXAGON_RADIUS,
  top: 0,
  bottom: HEXAGON_VERTICAL_DISTANCE,
};

const HEXAGON_TRIANGLE_SLOPE = -HEXAGON_VERTICAL_DISTANCE / HEXAGON_INNER_HORIZONTAL_DISTANCE;

const HEXAGON_TRIANGLE_POINT: Point = {
  x: HEXAGON_INNER_HORIZONTAL_DISTANCE,
  y: HEXAGON_VERTICAL_DISTANCE,
};

/**
 * Returns the 6 vertices from an hexagon with a given center.
 *
 * The hexagon is represented in "flat top" orientation, that is, the pointy
 * sides are at the left and right sides of the hexagon.
 */
function getHexagonPoints(center: Point): Point[] {
  let points: Point[] = [];

  for (let i = 0; i < 6; i++) {
    let angle = 60 * i * RADIANS;
    points.push({
      x: Math.cos(angle) * HEXAGON_RADIUS + center.x,
      y: Math.sin(angle) * HEXAGON_RADIUS + center.y,
    });
  }

  return points;
}

/**
 * Returns whether a point is inside an hexagon.
 *
 * Before any checks, the point is translated into the hexagon's local
 * coordinates, with (0, 0) being the center of the hexagon.
 *
 * Thanks to the hexagon symmetry, it's only needed to check the point inside
 * one of its quadrants, not inside the hexagon as a whole, so the point can
 * be translated to the hexagon lower right quadrant where both X and Y are
 * positive.
 *
 * A fast check is done to detect if the point is inside the hexagon quadrant's
 * bounding box. If the point is indeed inside, then an additional check is
 * done to detect if the point is outside the quadrant's empty triangle, which
 * is just a matter of checking whether the Y position of the point is above
 * the hypotenuse.
 */
function isPointInsideHexagon(point: Point, hexagonCenter: Point): boolean {
  const localPoint: Point = {
    x: Math.abs(point.x - hexagonCenter.x),
    y: Math.abs(point.y - hexagonCenter.y),
  };

  if (isPointInsideRectangle(localPoint, HEXAGON_QUADRANT_BOUNDING_BOX)) {
    const lineY = getLineY(localPoint.x, HEXAGON_TRIANGLE_POINT, HEXAGON_TRIANGLE_SLOPE);
    if (localPoint.y <= lineY) {
      return true;
    }
  }

  return false;
}

export {
  HEXAGON_RADIUS,
  HEXAGON_INNER_HORIZONTAL_DISTANCE,
  HEXAGON_HORIZONTAL_DISTANCE,
  HEXAGON_VERTICAL_DISTANCE,
  getHexagonPoints,
  isPointInsideHexagon,
}
