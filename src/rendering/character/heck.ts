import { CHARACTER_RADIUS } from "../../logic/character";
import { Point } from "../../types/primitives";
import { CharacterThemeColors } from "../../types/themes";
import { renderEllipse, renderTriangle } from "../primitives";
import { BODY_LINE_WIDTH } from "./default";

const HORNS_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.7;
const HORNS_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.7;
const HORNS_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.4;
const HORNS_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.15;
const HORNS_LEFT_ROTATION = 60;
const HORNS_RIGHT_ROTATION = 120;

const TAIL_LINE_WIDTH = 2;
const TAIL_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.4;
const TAIL_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.2;
const TAIL_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.9;
const TAIL_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.9;
const TAIL_TIP_WIDTH = CHARACTER_RADIUS * 0.4;
const TAIL_TIP_HEIGHT = CHARACTER_RADIUS * 0.4;

/**
 * Renders the character's extremely evil horns.
 */
function renderCharacterHorns(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.horns) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.horns;

  const feetPosition = {
    x: characterPosition.x - HORNS_HORIZONTAL_OFFSET,
    y: characterPosition.y - HORNS_VERTICAL_OFFSET,
  };
  renderEllipse(
    context,
    feetPosition,
    HORNS_HORIZONTAL_RADIUS,
    HORNS_VERTICAL_RADIUS,
    HORNS_LEFT_ROTATION,
  );

  feetPosition.x = characterPosition.x + HORNS_HORIZONTAL_OFFSET;
  renderEllipse(
    context,
    feetPosition,
    HORNS_HORIZONTAL_RADIUS,
    HORNS_VERTICAL_RADIUS,
    HORNS_RIGHT_ROTATION,
  );
}

/**
 * Renders the character's extremely evil tail.
 */
function renderCharacterTail(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.tail) {
    return;
  }

  context.lineWidth = TAIL_LINE_WIDTH;
  context.fillStyle = colors.tail;

  let center = {
    x: characterPosition.x + TAIL_HORIZONTAL_OFFSET,
    y: characterPosition.y - TAIL_VERTICAL_OFFSET,
  };
  const rotation = 0;
  const startAngle = 0;
  const endAngle = 90;
  const fill = false;
  renderEllipse(
    context,
    center,
    TAIL_HORIZONTAL_RADIUS,
    TAIL_VERTICAL_RADIUS,
    rotation,
    startAngle,
    endAngle,
    fill,
  );

  center.x += TAIL_HORIZONTAL_RADIUS;
  center.y -= TAIL_TIP_HEIGHT / 2;
  renderTriangle(
    context,
    center,
    TAIL_TIP_WIDTH,
    TAIL_TIP_HEIGHT,
  );
}

export {
  renderCharacterHorns,
  renderCharacterTail,
}
