import { CHARACTER_RADIUS } from "../logic/character";
import { RADIANS, getAngleBetweenPoints, translatePoint } from "../misc/math";
import { rectanglesIntersect } from "../misc/utils";
import { GlobalState } from "../state/global";
import { Point } from "../types/primitives";

const CHARACTER_LINE_WIDTH = 3;
const CHARACTER_COLOR = "#FF0";
const CHARACTER_WIDTH_RATIO = 0.9;
const CHARACTER_OFFSET_Y = CHARACTER_RADIUS / 6;

const FEET_RADIUS = CHARACTER_RADIUS / 5;
const FEET_WIDTH_RATIO = 2;
const FEET_OFFSET_X = CHARACTER_RADIUS / 2;
const FEET_OFFSET_Y = CHARACTER_RADIUS;

const EYE_OFFSET_X = CHARACTER_RADIUS / 4;
const EYE_OFFSET_Y = CHARACTER_RADIUS / 3;
const EYE_RADIUS = CHARACTER_RADIUS / 3;
const EYE_WIDTH_RATIO = 0.7;
const EYE_TRACKING_DISTANCE = 20;

const PUPIL_RADIUS = EYE_RADIUS / 4;
const PUPIL_LIMIT = EYE_RADIUS - PUPIL_RADIUS;

/**
 * Render the character if it's inside the viewport.
 */
function renderCharacter(
  context: CanvasRenderingContext2D,
  state: GlobalState,
): void {
  if (!rectanglesIntersect(state.character.boundingBox, state.camera.viewport)) {
    return;
  }

  const position = {
    x: state.character.position.x,
    y: state.character.position.y - CHARACTER_OFFSET_Y,
  };

  const pathData = state.map.pathfinding;
  const characterMoving = state.character.assignedPath.hasPath;
  const eyeFocus = pathData.destinationTile && (pathData.pending || characterMoving)
    ? pathData.destinationTile.center
    : state.control.cursor.camera;

  renderCharacterFeet(context, position);
  renderCharacterBody(context, position);
  renderCharacterEyes(context, position, eyeFocus);
}

/**
 * Renders the character's delicate feet.
 */
function renderCharacterFeet(
  context: CanvasRenderingContext2D,
  position: Point,
): void {
  context.lineWidth = CHARACTER_LINE_WIDTH;
  context.fillStyle = CHARACTER_COLOR;

  let feetPosition = {
    x: position.x - FEET_OFFSET_X,
    y: position.y + FEET_OFFSET_Y,
  };
  renderEllipse(context, feetPosition, FEET_RADIUS, FEET_WIDTH_RATIO);

  feetPosition.x = position.x + FEET_OFFSET_X;
  renderEllipse(context, feetPosition, FEET_RADIUS, FEET_WIDTH_RATIO);
}

/**
 * Renders the character's body and... uuh, face?
 */
function renderCharacterBody(
  context: CanvasRenderingContext2D,
  position: Point,
): void {
  context.lineWidth = CHARACTER_LINE_WIDTH;
  context.fillStyle = CHARACTER_COLOR;
  renderEllipse(context, position, CHARACTER_RADIUS, CHARACTER_WIDTH_RATIO);
}

/**
 * Renders the character's two expressive eyes.
 */
function renderCharacterEyes(
  context: CanvasRenderingContext2D,
  position: Point,
  focus: Point,
): void {
  let eyePosition = {
    x: position.x - EYE_OFFSET_X,
    y: position.y - EYE_OFFSET_Y,
  };
  renderCharacterEye(context, eyePosition, focus);

  eyePosition.x = position.x + EYE_OFFSET_X;
  renderCharacterEye(context, eyePosition, focus);
}

/**
 * Renders a single eye. The pupil will track the focus point.
 */
function renderCharacterEye(
  context: CanvasRenderingContext2D,
  center: Point,
  focus: Point,
): void {
  const angle = getAngleBetweenPoints(center, focus);

  const trackingX = PUPIL_LIMIT * EYE_WIDTH_RATIO * EYE_TRACKING_DISTANCE;
  const trackingY = PUPIL_LIMIT * EYE_TRACKING_DISTANCE;

  const focusDeltaX = Math.abs(focus.x - center.x);
  const focusDeltaY = Math.abs(focus.y - center.y);

  const limitX = Math.min(trackingX, focusDeltaX) / EYE_TRACKING_DISTANCE;
  const limitY = Math.min(trackingY, focusDeltaY) / EYE_TRACKING_DISTANCE;

  const pupilCenter = {
    x: translatePoint(limitX, angle, center).x,
    y: translatePoint(limitY, angle, center).y,
  };

  context.lineWidth = 1;
  context.fillStyle = "#FFF";
  renderEllipse(context, center, EYE_RADIUS, EYE_WIDTH_RATIO);

  context.fillStyle = "#000";
  renderEllipse(context, pupilCenter, PUPIL_RADIUS, EYE_WIDTH_RATIO);
}

/**
 * Renders an ellipse.
 */
function renderEllipse(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  widthRatio: number,
): void {
  const rotation = 0;
  const startAngle = 0;
  const endAngle = 360 * RADIANS;

  context.beginPath();
  context.ellipse(
    center.x,
    center.y,
    radius * widthRatio,
    radius,
    rotation,
    startAngle,
    endAngle,
  );
  context.fill();
  context.stroke();
}

export {
  renderCharacter,
}
