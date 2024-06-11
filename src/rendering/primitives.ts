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
 * Renders an ellipse, which has a different horizontal and vertical radius.
 *
 * The start and end angles are useful to only draw a section of the ellipse.
 */
function renderEllipse(
  context: CanvasRenderingContext2D,
  center: Point,
  horizontalRadius: number,
  verticalRadius: number,
  rotation: number = 0,
  startAngle: number = 0,
  endAngle: number = 360,
): void {
  context.beginPath();
  context.ellipse(
    center.x,
    center.y,
    horizontalRadius,
    verticalRadius,
    rotation * RADIANS,
    startAngle * RADIANS,
    endAngle * RADIANS,
  );
  context.fill();
  context.stroke();
}

/**
 * Renders a trapezium at a given center.
 */
function renderTrapezium(
  context: CanvasRenderingContext2D,
  center: Point,
  topWidth: number,
  bottomWidth: number,
  height: number,
): void {
  context.beginPath();

  let x = center.x - topWidth / 2;
  let y = center.y - height / 2;
  context.moveTo(x, y);

  x += topWidth;
  context.lineTo(x, y);

  x = center.x + bottomWidth / 2;
  y += height;
  context.lineTo(x, y);

  x -= bottomWidth;
  context.lineTo(x, y);

  context.closePath();
  context.fill();
  context.stroke();
}

export {
  renderRectangle,
  renderCircle,
  renderEllipse,
  renderTrapezium,
}
