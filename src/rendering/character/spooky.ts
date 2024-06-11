import { CHARACTER_RADIUS } from "../../logic/character";
import { Point, Rectangle } from "../../types/primitives";
import { CharacterThemeColors } from "../../types/themes";
import { renderEllipse, renderRectangle } from "../primitives";
import {
  BODY_HORIZONTAL_RADIUS,
  BODY_LINE_WIDTH,
  BODY_VERTICAL_RADIUS,
} from "./default";

const BLANKET_RECT_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.9;
const BLANKET_RECT_TOP_OFFSET = CHARACTER_RADIUS * 0.1;
const BLANKET_RECT_BOTTOM_OFFSET = CHARACTER_RADIUS * 0.85;
const BLANKET_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.3;
const BLANKET_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.4;
const BLANKET_SEPARATION = CHARACTER_RADIUS * 0.6;

const HAND_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.4;
const HAND_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.2;
const HAND_LEFT_ROTATION = 45;
const HAND_RIGHT_ROTATION = 135;
const HAND_HORIZONTAL_OFFSET = CHARACTER_RADIUS * 0.95;
const HAND_VERTICAL_OFFSET = CHARACTER_RADIUS * 0.1;

const MOUTH_OFFSET_Y = CHARACTER_RADIUS * 0.3;
const MOUTH_HORIZONTAL_RADIUS = CHARACTER_RADIUS * 0.15;
const MOUTH_VERTICAL_RADIUS = CHARACTER_RADIUS * 0.1;

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

  const rect: Rectangle = {
    left: characterPosition.x - BLANKET_RECT_HORIZONTAL_OFFSET,
    right: characterPosition.x + BLANKET_RECT_HORIZONTAL_OFFSET,
    top: characterPosition.y - BLANKET_RECT_TOP_OFFSET,
    bottom: characterPosition.y + BLANKET_RECT_BOTTOM_OFFSET,
  };
  renderRectangle(
    context,
    rect,
  );

  const rotation = 0;
  let startAngle = 180;
  let endAngle = 360;
  renderEllipse(
    context,
    characterPosition,
    BODY_HORIZONTAL_RADIUS,
    BODY_VERTICAL_RADIUS,
    rotation,
    startAngle,
    endAngle,
  );

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
      BLANKET_HORIZONTAL_RADIUS,
      BLANKET_VERTICAL_RADIUS,
      rotation,
      startAngle,
      endAngle,
    );
  }
}

/**
 * Renders the character's spooky hands.
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

  const handPosition = {
    x: characterPosition.x - HAND_HORIZONTAL_OFFSET,
    y: characterPosition.y + HAND_VERTICAL_OFFSET,
  };
  renderEllipse(
    context,
    handPosition,
    HAND_HORIZONTAL_RADIUS,
    HAND_VERTICAL_RADIUS,
    HAND_LEFT_ROTATION,
  );

  handPosition.x = characterPosition.x + HAND_HORIZONTAL_OFFSET;
  renderEllipse(
    context,
    handPosition,
    HAND_HORIZONTAL_RADIUS,
    HAND_VERTICAL_RADIUS,
    HAND_RIGHT_ROTATION,
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
  renderEllipse(
    context,
    mouthPosition,
    MOUTH_VERTICAL_RADIUS,
    MOUTH_HORIZONTAL_RADIUS,
  );
}

export {
  renderCharacterBlanket,
  renderCharacterHands,
  renderCharacterMouth,
}
