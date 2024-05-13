import { Point } from "../misc/types";
import { CharacterState } from "../state/character";
import { HEXAGON_RADIUS } from "./hexagon";

const CHARACTER_RADIUS = HEXAGON_RADIUS / 2;
const BOUNDING_BOX_RADIUS = CHARACTER_RADIUS * 1.5;

/**
 * Sets the character position and updates dependant values.
 */
function setCharacterPosition(
  characterState: CharacterState,
  position: Point,
): void {
  characterState.position.x = position.x;
  characterState.position.y = position.y;
  updateCharacterBoundingBox(characterState);
}

/**
 * Updates the character's bounding box, useful to check if the character is
 * inside a viewport before drawing.
 *
 * It's not a precise bounding box, as the character is rendered using several
 * shapes put together, so the bounding box is slightly bigger than the real
 * radious to compensate.
 */
function updateCharacterBoundingBox(characterState: CharacterState): void {
  const pos = characterState.position;
  const box = characterState.boundingBox;

  box.left = pos.x - BOUNDING_BOX_RADIUS;
  box.right = pos.x + BOUNDING_BOX_RADIUS;
  box.top = pos.y - BOUNDING_BOX_RADIUS;
  box.bottom = pos.y + BOUNDING_BOX_RADIUS;
}

export {
  CHARACTER_RADIUS,
  setCharacterPosition,
}
