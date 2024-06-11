import { CHARACTER_RADIUS } from "../../logic/character";
import { Point } from "../../types/primitives";
import { CharacterThemeColors } from "../../types/themes";
import { renderCircle, renderEllipse, renderTrapezium } from "../primitives";
import { BODY_LINE_WIDTH } from "./default";

const SAILOR_CAP_TOP_WIDTH = CHARACTER_RADIUS * 2.0;
const SAILOR_CAP_BOTTOM_WIDTH = CHARACTER_RADIUS * 1.6;
const SAILOR_CAP_HEIGHT = CHARACTER_RADIUS * 0.5;
const SAILOR_CAP_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.9;
const SAILOR_CAP_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.7;
const SAILOR_CAP_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.21;

const CARAVEL_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.8;
const CARAVEL_TOP_WIDTH = CHARACTER_RADIUS * 3;
const CARAVEL_BOTTOM_WIDTH = CHARACTER_RADIUS * 2;
const CARAVEL_HEIGHT = CHARACTER_RADIUS * 0.9;
const CARAVEL_ORANGES_LINE_WIDTH = 1;
const CARAVEL_ORANGES_HORIZONTAL_OFFSET = CARAVEL_TOP_WIDTH * 0.2;
const CARAVEL_ORANGES_RADIUS = CHARACTER_RADIUS * 0.15;
const CARAVEL_ORANGES_COLOR = "#FA0";

/**
 * Renders the character's sailor cap.
 */
function renderCharacterSailorCap(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.sailorCap) {
    return;
  }

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.sailorCap;

  const center = {
    x: characterPosition.x,
    y: characterPosition.y - SAILOR_CAP_VERTICAL_OFFSET,
  };
  renderTrapezium(
    context,
    center,
    SAILOR_CAP_TOP_WIDTH,
    SAILOR_CAP_BOTTOM_WIDTH,
    SAILOR_CAP_HEIGHT,
  );

  const rotation = 0;
  const startAngle = 180;
  const endAngle = 360;
  center.y -= SAILOR_CAP_HEIGHT / 2;
  renderEllipse(
    context,
    center,
    SAILOR_CAP_HORIZONTAL_RADIUS,
    SAILOR_CAP_VERTICAL_RADIUS,
    rotation,
    startAngle,
    endAngle,
  );
}

/**
 * Renders the character's 15th century caravel, along with a few oranges to
 * prevent scurvy.
 */
function renderCharacterCaravel(
  context: CanvasRenderingContext2D,
  colors: CharacterThemeColors,
  characterPosition: Point,
): void {
  if (!colors.caravel) {
    return;
  }
  renderCharacterCaravelOranges(context, characterPosition);

  context.lineWidth = BODY_LINE_WIDTH;
  context.fillStyle = colors.caravel;

  let center = {
    x:  characterPosition.x,
    y:  characterPosition.y + CARAVEL_VERTICAL_OFFSET,
  };
  renderTrapezium(
    context,
    center,
    CARAVEL_TOP_WIDTH,
    CARAVEL_BOTTOM_WIDTH,
    CARAVEL_HEIGHT,
  );
}

/**
 * Renders a pile of oranges.
 */
function renderCharacterCaravelOranges(
  context: CanvasRenderingContext2D,
  characterPosition: Point,
): void {
  context.lineWidth = CARAVEL_ORANGES_LINE_WIDTH;
  context.fillStyle = CARAVEL_ORANGES_COLOR;

  const center = {
    x: 0,
    y: characterPosition.y + CARAVEL_VERTICAL_OFFSET - CARAVEL_HEIGHT / 2,
  };
  const fill = true;
  for (let y = 0; y < 3; y++) {
    center.x = characterPosition.x + CARAVEL_ORANGES_HORIZONTAL_OFFSET + CARAVEL_ORANGES_RADIUS * y;
    for (let x = 0; x < 3-y; x++) {
      renderCircle(context, center, CARAVEL_ORANGES_RADIUS, fill);
      center.x += CARAVEL_ORANGES_RADIUS * 2;
    }
    center.y -= CARAVEL_ORANGES_RADIUS * 1.7;
  }
}

export {
  renderCharacterSailorCap,
  renderCharacterCaravel,
}
