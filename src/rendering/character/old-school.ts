import { CHARACTER_RADIUS } from "../../logic/character";
import { Point } from "../../types/primitives";
import { CharacterThemeColors } from "../../types/themes";
import { renderCircle, renderEllipse, renderRectangle } from "../primitives";
import { BODY_LINE_WIDTH, EYE_VERTICAL_RADIUS } from "./default";

const TOP_HAT_TOP_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.7;
const TOP_HAT_TOP_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.15;
const TOP_HAT_BOTTOM_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 1.1;
const TOP_HAT_BOTTOM_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.22;
const TOP_HAT_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.8;
const TOP_HAT_HEIGHT = CHARACTER_RADIUS * 0.5;

const MOUSTACHE_LINE_WIDTH = 6;
const MOUSTACHE_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.05;
const MOUSTACHE_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.3;
const MOUSTACHE_HORIZONTAL_STEP = CHARACTER_RADIUS * 0.18;
const MOUSTACHE_VERTICAL_STEP = CHARACTER_RADIUS * 0.4;

const MONOCLE_LINE_WIDTH = 1;
const MONOCLE_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.30;
const MONOCLE_VERTICAL_OFFSET = - CHARACTER_RADIUS * 0.08;
const MONOCLE_RADIUS = EYE_VERTICAL_RADIUS * 0.6;

/**
 * Renders the character's fancy top hat.
 */
function renderCharacterTopHat(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.topHat) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.topHat;

  const rectangle = {
    left: characterPosition.x - TOP_HAT_TOP_HORIZONTAL_RADIUS,
    right: characterPosition.x + TOP_HAT_TOP_HORIZONTAL_RADIUS,
    top: characterPosition.y - TOP_HAT_VERTICAL_OFFSET - TOP_HAT_HEIGHT,
    bottom: characterPosition.y - TOP_HAT_VERTICAL_OFFSET,
  };
  renderRectangle(context, rectangle);

  const center = {
    x: characterPosition.x,
    y: rectangle.top,
  };
  renderEllipse(
    context,
    center,
    TOP_HAT_TOP_HORIZONTAL_RADIUS,
    TOP_HAT_TOP_VERTICAL_RADIUS,
  );

  center.y = rectangle.bottom;
  renderEllipse(
    context,
    center,
    TOP_HAT_BOTTOM_HORIZONTAL_RADIUS,
    TOP_HAT_BOTTOM_VERTICAL_RADIUS,
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

export {
  renderCharacterTopHat,
  renderCharacterMonocle,
  renderCharacterMoustache,
}
