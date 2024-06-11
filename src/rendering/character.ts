import { CHARACTER_OFFSET_Y, CHARACTER_RADIUS } from "../logic/character";
import { RADIANS, getAngleBetweenPoints, translatePoint } from "../misc/math";
import { rectanglesIntersect } from "../misc/utils";
import { GlobalState } from "../state/global";
import { Point, Rectangle } from "../types/primitives";
import { CharacterThemeColors } from "../types/themes";
import { getCharacterThemeColors } from "./themes";

const BODY_LINE_WIDTH = 3;
const BODY_WIDTH_MULTIPLIER = 0.9;

const BLANKET_RECT_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.9;
const BLANKET_RECT_TOP_OFFSET = CHARACTER_RADIUS * 0.1;
const BLANKET_RECT_BOTTOM_OFFSET = CHARACTER_RADIUS * 0.85;
const BLANKET_RADIUS = CHARACTER_RADIUS * 0.3;
const BLANKET_WIDTH_MULTIPLIER = 1.3;
const BLANKET_SEPARATION = CHARACTER_RADIUS * 0.6;

const HAND_RADIUS = CHARACTER_RADIUS * 0.2;
const HAND_WIDTH_MULTIPLIER = 2;
const HAND_OFFSET_X = CHARACTER_RADIUS * 0.95;
const HAND_OFFSET_Y = CHARACTER_RADIUS * 0.1;

const FEET_RADIUS = CHARACTER_RADIUS * 0.2;
const FEET_WIDTH_MULTIPLIER = 2;
const FEET_OFFSET_X = CHARACTER_RADIUS * 0.5;
const FEET_OFFSET_Y = CHARACTER_RADIUS;

const EYE_LINE_WIDTH = 1;
const EYE_COLOR = "#FFF";
const EYE_OFFSET_X = CHARACTER_RADIUS * 0.25;
const EYE_OFFSET_Y = CHARACTER_RADIUS * 0.33;
const EYE_RADIUS = CHARACTER_RADIUS * 0.33;
const EYE_WIDTH_MULTIPLIER = 0.7;
const EYE_TRACKING_DISTANCE = 20;

const PUPIL_RADIUS = EYE_RADIUS * 0.25;
const PUPIL_LIMIT = EYE_RADIUS - PUPIL_RADIUS;

const MOUTH_OFFSET_Y = CHARACTER_RADIUS * 0.3;
const MOUTH_RADIUS = CHARACTER_RADIUS * 0.1;
const MOUTH_WIDTH_MULTIPLIER = 1.5;

const HAT_TOP_RADIUS = CHARACTER_RADIUS * 0.7;
const HAT_BOTTOM_RADIUS = CHARACTER_RADIUS * 1.1;
const HAT_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.8;
const HAT_HEIGHT = CHARACTER_RADIUS * 0.5;
const HAT_HEIGHT_MULTIPLIER = 0.2;

const MOUSTACHE_LINE_WIDTH = 6;
const MOUSTACHE_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.05;
const MOUSTACHE_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.3;
const MOUSTACHE_HORIZONTAL_STEP = CHARACTER_RADIUS * 0.18;
const MOUSTACHE_VERTICAL_STEP = CHARACTER_RADIUS * 0.4;

const MONOCLE_LINE_WIDTH = 1;
const MONOCLE_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.30;
const MONOCLE_VERTICAL_OFFSET = - CHARACTER_RADIUS * 0.08;
const MONOCLE_RADIUS = EYE_RADIUS * 0.6;

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

  const characterPosition = {
    x: state.character.position.x,
    y: state.character.position.y - CHARACTER_OFFSET_Y,
  };

  const pathData = state.map.pathfinding;
  const characterMoving = state.character.assignedPath.hasPath;
  const eyeFocus = pathData.destinationTile && (pathData.pending || characterMoving)
    ? pathData.destinationTile.center
    : state.control.cursor.camera;

  const colors = getCharacterThemeColors(state.theme);
  context.strokeStyle = colors.outline;

  renderCharacterFeet(context, colors, characterPosition);
  renderCharacterHands(context, colors, characterPosition);

  renderCharacterBody(context, colors, characterPosition);
  renderCharacterBlanket(context, colors, characterPosition);

  renderCharacterEyes(context, colors, characterPosition, eyeFocus);
  renderCharacterMouth(context, colors, characterPosition);

  renderCharacterHat(context, colors, characterPosition);
  renderCharacterMoustache(context, colors, characterPosition);
  renderCharacterMonocle(context, colors, characterPosition);
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

  const multiplierOnWidth = true;
  const feetPosition = {
    x: characterPosition.x - FEET_OFFSET_X,
    y: characterPosition.y + FEET_OFFSET_Y,
  };
  renderEllipse(
    context,
    feetPosition,
    FEET_RADIUS,
    FEET_WIDTH_MULTIPLIER,
    multiplierOnWidth,
  );

  feetPosition.x = characterPosition.x + FEET_OFFSET_X;
  renderEllipse(
    context,
    feetPosition,
    FEET_RADIUS,
    FEET_WIDTH_MULTIPLIER,
    multiplierOnWidth,
  );
}

/**
 * Renders the character's tiny hands.
 */
function renderCharacterHands(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.hands) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.hands;

  const multiplierOnWidth = true;
  const handPosition = {
    x: characterPosition.x - HAND_OFFSET_X,
    y: characterPosition.y + HAND_OFFSET_Y,
  };
  let rotation = 45;
  renderEllipse(
    context,
    handPosition,
    HAND_RADIUS,
    HAND_WIDTH_MULTIPLIER,
    multiplierOnWidth,
    rotation,
  );

  handPosition.x = characterPosition.x + HAND_OFFSET_X;
  rotation = 135;
  renderEllipse(
    context,
    handPosition,
    HAND_RADIUS,
    HAND_WIDTH_MULTIPLIER,
    multiplierOnWidth,
    rotation,
  );
}

/**
 * Renders the character's body and... uuh, face?
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

  const multiplierOnWidth = true;
  renderEllipse(
    context,
    characterPosition,
    CHARACTER_RADIUS,
    BODY_WIDTH_MULTIPLIER,
    multiplierOnWidth,
  );
}

/**
 * Renders the character's spooky blanket, which replaces its usual body.
 */
function renderCharacterBlanket(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.blanket) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.blanket;

  const rect = {
    left: characterPosition.x - BLANKET_RECT_HORIZONTAL_OFFSET,
    right: characterPosition.x + BLANKET_RECT_HORIZONTAL_OFFSET,
    top: characterPosition.y - BLANKET_RECT_TOP_OFFSET,
    bottom: characterPosition.y + BLANKET_RECT_BOTTOM_OFFSET,
  };
  renderRectangle(
    context,
    rect,
  );

  let multiplierOnWidth = true;
  const rotation = 0;
  let startAngle = 180;
  let endAngle = 360;
  renderEllipse(
    context,
    characterPosition,
    CHARACTER_RADIUS,
    BODY_WIDTH_MULTIPLIER,
    multiplierOnWidth,
    rotation,
    startAngle,
    endAngle,
  );

  multiplierOnWidth = false;
  startAngle = 0;
  endAngle = 180;
  for (let i = 0; i < 3; i++) {
    const position = {
      x: characterPosition.x - CHARACTER_RADIUS * 0.6 + BLANKET_SEPARATION * i,
      y: characterPosition.y + CHARACTER_RADIUS * 0.73,
    };
    renderEllipse(
      context,
      position,
      BLANKET_RADIUS,
      BLANKET_WIDTH_MULTIPLIER,
      multiplierOnWidth,
      rotation,
      startAngle,
      endAngle,
    );
  }
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
    x: characterPosition.x - EYE_OFFSET_X,
    y: characterPosition.y - EYE_OFFSET_Y,
  };
  renderCharacterEye(context, colors, eyePosition, focus);

  eyePosition.x = characterPosition.x + EYE_OFFSET_X;
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

  const trackingX = PUPIL_LIMIT * EYE_WIDTH_MULTIPLIER * EYE_TRACKING_DISTANCE;
  const trackingY = PUPIL_LIMIT * EYE_TRACKING_DISTANCE;

  const focusDeltaX = Math.abs(focus.x - eyePosition.x);
  const focusDeltaY = Math.abs(focus.y - eyePosition.y);

  const limitX = Math.min(trackingX, focusDeltaX) / EYE_TRACKING_DISTANCE;
  const limitY = Math.min(trackingY, focusDeltaY) / EYE_TRACKING_DISTANCE;

  const pupilCenter = {
    x: translatePoint(limitX, angle, eyePosition).x,
    y: translatePoint(limitY, angle, eyePosition).y,
  };

  const multiplierOnWidth = true;
  renderEllipse(
    context,
    eyePosition,
    EYE_RADIUS,
    EYE_WIDTH_MULTIPLIER,
    multiplierOnWidth,
  );

  context.fillStyle = colors.outline;
  renderEllipse(
    context,
    pupilCenter,
    PUPIL_RADIUS,
    EYE_WIDTH_MULTIPLIER,
    multiplierOnWidth,
  );
}

/**
 * Renders the character's mouth.
 */
function renderCharacterMouth(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.mouth) {
    return;
  }

  const mouthPosition = {
    x: characterPosition.x,
    y: characterPosition.y + MOUTH_OFFSET_Y,
  };
  const multiplierOnWidth = false;
  renderEllipse(
    context,
    mouthPosition,
    MOUTH_RADIUS,
    MOUTH_WIDTH_MULTIPLIER,
    multiplierOnWidth,
  );
}

/**
 * Renders the character's fancy hat.
 */
function renderCharacterHat(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.hat) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.hat;

  const rectangle = {
    left: characterPosition.x - HAT_TOP_RADIUS,
    right: characterPosition.x + HAT_TOP_RADIUS,
    top: characterPosition.y - HAT_VERTICAL_OFFSET - HAT_HEIGHT,
    bottom: characterPosition.y - HAT_VERTICAL_OFFSET,
  };
  renderRectangle(context, rectangle);

  const multiplierOnWidth = false;
  const center = {
    x: characterPosition.x,
    y: rectangle.top,
  };
  renderEllipse(
    context,
    center,
    HAT_TOP_RADIUS,
    HAT_HEIGHT_MULTIPLIER,
    multiplierOnWidth,
  );

  center.y = rectangle.bottom;
  renderEllipse(
    context,
    center,
    HAT_BOTTOM_RADIUS,
    HAT_HEIGHT_MULTIPLIER,
    multiplierOnWidth,
  );
}

/**
 * Renders the character's fancy moustache.
 */
function renderCharacterMoustache(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.moustache) {
    return;
  }

  context.lineWidth = MOUSTACHE_LINE_WIDTH;
  context.strokeStyle = colors.moustache;

  const position = {
    x: characterPosition.x - MOUSTACHE_HORIZONTAL_OFFSET,
    y: characterPosition.y + MOUSTACHE_VERTICAL_OFFSET,
  };
  let mirrored = true;
  renderCharacterIndividualMoustache(context, position, mirrored);

  position.x = characterPosition.x + MOUSTACHE_HORIZONTAL_OFFSET;
  mirrored = false;
  renderCharacterIndividualMoustache(context, position, mirrored);
}

/**
 * Renders half a moustache.
 */
function renderCharacterIndividualMoustache(
  context: CanvasRenderingContext2D,
  startingPoint: Point,
  mirrored: boolean,
): void {
  const multiplier = mirrored ? -1 : 1;
  context.beginPath();
  context.moveTo(startingPoint.x, startingPoint.y);
  context.bezierCurveTo(
    startingPoint.x + MOUSTACHE_HORIZONTAL_STEP * multiplier,
    startingPoint.y - MOUSTACHE_VERTICAL_STEP,
    startingPoint.x + MOUSTACHE_HORIZONTAL_STEP * 2 * multiplier,
    startingPoint.y + MOUSTACHE_VERTICAL_STEP,
    startingPoint.x + MOUSTACHE_HORIZONTAL_STEP * 3 * multiplier,
    startingPoint.y - MOUSTACHE_VERTICAL_STEP / 3,
  );
  context.stroke();
}

/**
 * Renders the character's fancy monocle.
 */
function renderCharacterMonocle(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.monocle) {
    return;
  }

  context.lineWidth = MONOCLE_LINE_WIDTH;
  context.strokeStyle = colors.monocle;

  const position = {
    x: characterPosition.x + MONOCLE_HORIZONTAL_OFFSET,
    y: characterPosition.y + MONOCLE_VERTICAL_OFFSET,
  };
  const fill = false;
  renderCircle(context, position, MONOCLE_RADIUS, fill);
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

export default renderCharacter;
