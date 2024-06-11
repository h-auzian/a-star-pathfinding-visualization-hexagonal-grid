import { CHARACTER_RADIUS } from "../../logic/character";
import { getAngleBetweenPoints, translatePoint } from "../../misc/math";
import { Point } from "../../types/primitives";
import { CharacterThemeColors } from "../../types/themes";
import { renderEllipse } from "../primitives";

const BODY_LINE_WIDTH = 3;
const BODY_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.9;
const BODY_VERTICAL_RADIUS = CHARACTER_RADIUS;

const FEET_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.4;
const FEET_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.2;
const FEET_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.5;
const FEET_VERTICAL_OFFSET = CHARACTER_RADIUS;

const EYE_LINE_WIDTH = 1;
const EYE_COLOR = "#FFF";
const EYE_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.25;
const EYE_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.33;
const EYE_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.23;
const EYE_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.33;
const EYE_RATIO = EYE_HORIZONTAL_RADIUS / EYE_VERTICAL_RADIUS;
const EYE_TRACKING_DISTANCE = 20;

const PUPIL_HORIZONTAL_RADIUS = EYE_HORIZONTAL_RADIUS * 0.25;
const PUPIL_VERTICAL_RADIUS = EYE_VERTICAL_RADIUS * 0.25;
const PUPIL_LIMIT = EYE_VERTICAL_RADIUS - PUPIL_VERTICAL_RADIUS;

/**
 * Renders the character's body/head.
 */
function renderCharacterBody(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.body) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.body;

  renderEllipse(
    context,
    characterPosition,
    BODY_HORIZONTAL_RADIUS,
    BODY_VERTICAL_RADIUS
  );
}

/**
 * Renders the character's delicate feet.
 */
function renderCharacterFeet(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.feet) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.feet;

  const feetPosition = {
    x: characterPosition.x - FEET_HORIZONTAL_OFFSET,
    y: characterPosition.y + FEET_VERTICAL_OFFSET,
  };
  renderEllipse(
    context,
    feetPosition,
    FEET_HORIZONTAL_RADIUS,
    FEET_VERTICAL_RADIUS
  );

  feetPosition.x = characterPosition.x + FEET_HORIZONTAL_OFFSET;
  renderEllipse(
    context,
    feetPosition,
    FEET_HORIZONTAL_RADIUS,
    FEET_VERTICAL_RADIUS,
  );
}

/**
 * Renders the character's two expressive eyes.
 */
function renderCharacterEyes(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
  focus: Point,
): void {
  const eyePosition = {
    x: characterPosition.x - EYE_HORIZONTAL_OFFSET,
    y: characterPosition.y - EYE_VERTICAL_OFFSET,
  };
  renderCharacterEye(context, colors, eyePosition, focus);

  eyePosition.x = characterPosition.x + EYE_HORIZONTAL_OFFSET;
  renderCharacterEye(context, colors, eyePosition, focus);
}

/**
 * Renders a single eye. The pupil will track the focus point.
 */
function renderCharacterEye(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  eyePosition: Point,
  focus: Point,
): void {
  context.lineWidth = EYE_LINE_WIDTH;
  context.fillStyle = EYE_COLOR;

  const angle = getAngleBetweenPoints(eyePosition, focus);

  const trackingX = PUPIL_LIMIT * EYE_TRACKING_DISTANCE * EYE_RATIO;
  const trackingY = PUPIL_LIMIT * EYE_TRACKING_DISTANCE;

  const focusDeltaX = Math.abs(focus.x - eyePosition.x);
  const focusDeltaY = Math.abs(focus.y - eyePosition.y);

  const limitX = Math.min(trackingX, focusDeltaX) / EYE_TRACKING_DISTANCE;
  const limitY = Math.min(trackingY, focusDeltaY) / EYE_TRACKING_DISTANCE;

  const pupilCenter = {
    x: translatePoint(limitX, angle, eyePosition).x,
    y: translatePoint(limitY, angle, eyePosition).y,
  };

  renderEllipse(
    context,
    eyePosition,
    EYE_HORIZONTAL_RADIUS,
    EYE_VERTICAL_RADIUS,
  );

  context.fillStyle = colors.outline;
  renderEllipse(
    context,
    pupilCenter,
    PUPIL_HORIZONTAL_RADIUS,
    PUPIL_VERTICAL_RADIUS,
  );
}

export {
  BODY_LINE_WIDTH,
  BODY_HORIZONTAL_RADIUS,
  BODY_VERTICAL_RADIUS,
  EYE_VERTICAL_RADIUS,
  renderCharacterBody,
  renderCharacterFeet,
  renderCharacterEyes,
}
