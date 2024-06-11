import { RADIANS } from "../misc/math";
import { Point, Rectangle } from "../types/primitives";

/**
 * Render a rectangle at a given center.
 */
function renderRectangle(
  context: CanvasRenderingContext2D,
  rectangle: Rectangle,
): void {
  const width = rectangle.right - rectangle.left;
  const height = rectangle.bottom - rectangle.top;

  context.beginPath();
  context.rect(
    rectangle.left,
    rectangle.top,
    width,
    height,
  );
  context.fill();
  context.stroke();
}

/**
 * Renders a circle at a given center.
 */
function renderCircle(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  fill: boolean,
): void {
  const startAngle = 0;
  const endAngle = 360 * RADIANS;

  context.beginPath();
  context.arc(
    center.x,
    center.y,
    radius,
    startAngle,
    endAngle,
  );
  if (fill) {
    context.fill();
  }
  context.stroke();
}

/**
 * Renders an ellipse.
 *
 * The multiplier parameter multiplies the radius either for the width or the
 * height.
 *
 * The start and end angles are useful to only draw a section of the ellipse.
 */
function renderEllipse(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  multiplier: number,
  multiplierOnWidth: boolean,
  rotation: number = 0,
  startAngle: number = 0,
  endAngle: number = 360,
): void {
  let width = radius;
  let height = radius;

  if (multiplierOnWidth) {
    width *= multiplier;
  } else {
    height *= multiplier;
  }

  context.beginPath();
  context.ellipse(
    center.x,
    center.y,
    width,
    height,
    rotation * RADIANS,
    startAngle * RADIANS,
    endAngle * RADIANS,
  );
  context.fill();
  context.stroke();
}

export {
  renderRectangle,
  renderCircle,
  renderEllipse,
}
