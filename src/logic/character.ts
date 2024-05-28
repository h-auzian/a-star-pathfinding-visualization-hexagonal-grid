import {
  getAngleBetweenPoints,
  getDistanceBetweenPoints,
  translatePoint,
} from "../misc/math";
import { CharacterState } from "../state/character";
import { ControlState } from "../state/controls";
import { PathfindingData } from "../types/pathfinding";
import { Point } from "../types/primitives";
import { justPressed } from "./controls";
import { HEXAGON_RADIUS } from "./hexagon";
import { clearPreviousPathData } from "./pathfinding";

const CHARACTER_RADIUS = HEXAGON_RADIUS / 2;
const CHARACTER_OFFSET_Y = CHARACTER_RADIUS * 0.16;
const BOUNDING_BOX_RADIUS = CHARACTER_RADIUS * 1.5;
const BASE_MOVEMENT_SPEED = 300;
const MAX_SPEED = BASE_MOVEMENT_SPEED * 3;
const DISTANCE_PER_SPEED_MULTIPLIER = 10;

/**
 * Assigns a new path to the character if the respective control was pressed
 * and the character doesn't have a currently assigned path.
 *
 * If the map has a path but it's length 1, then it doesn't do anything because
 * a path of length 1 means the destination is the current tile, so moving the
 * character is unnecessary.
 */
function sendCharacterToSelectedPath(
  characterState: CharacterState,
  controlState: ControlState,
  pathfindingData: PathfindingData,
): void {
  if (characterState.assignedPath.hasPath) {
    return;
  }

  const path = pathfindingData.foundPath;
  if (!pathfindingData.finished || path.length <= 1) {
    return;
  }

  if (justPressed(controlState.followPath)) {
    const assignedPath = characterState.assignedPath;
    assignedPath.hasPath = true;
    assignedPath.path = path;
    assignedPath.currentIndex = 0;

    const speedMultiplier = Math.floor(assignedPath.path.length / DISTANCE_PER_SPEED_MULTIPLIER) + 1;
    assignedPath.speed = Math.min(BASE_MOVEMENT_SPEED * speedMultiplier, MAX_SPEED);
  }
}

/**
 * If the character has an assigned path, makes the character move slowly to
 * each tile until reaching the destination.
 *
 * The character may overshoot its position while passing between tiles, but
 * that's OK, as it will correct itself after reaching the final tile.
 *
 * An alternative is to round out the movement so that the character arrives at
 * the exact center of each tile before continuing to the next one, but that
 * produces an unpleasant stuttering effect, which is why correcting on the
 * last tile is preferred.
 */
function moveCharacterThroughPath(
  characterState: CharacterState,
  deltaTime: number,
): void {
  const assignedPath = characterState.assignedPath;
  if (!assignedPath.hasPath || assignedPath.currentIndex >= assignedPath.path.length) {
    return;
  }

  const position = characterState.position;
  const destination = assignedPath.path[assignedPath.currentIndex].center;

  if (position.x == destination.x && position.y == destination.y) {
    assignedPath.currentIndex++;
  } else {
    const angle = getAngleBetweenPoints(position, destination);
    const speed = assignedPath.speed * deltaTime;

    let newPosition = translatePoint(speed, angle, position);

    const remainingDistance = getDistanceBetweenPoints(position, destination);
    if (remainingDistance <= speed) {
      assignedPath.currentIndex++;
      if (assignedPath.currentIndex >= assignedPath.path.length) {
        newPosition = destination;
      }
    }

    setCharacterPosition(characterState, newPosition);
  }
}

/**
 * Detects if the character has arrived to its assigned path destination, and
 * if so, clears the assigned path and the calculated path to allow new path
 * calculations from the current position.
 *
 * Originally this was done in the same function that moves the character
 * through the path, but that had the side effect of rendering the old path for
 * a single frame when the character arrived to its destination, only
 * calculating a new path the next frame.
 *
 * To avoid that, the logic was moved to this function, which should be called
 * the frame after the character arrives to its destination, but before
 * calculating a new path on that frame.
 */
function clearPathOnDestination(
  characterState: CharacterState,
  pathfindingData: PathfindingData,
): void {
  const assignedPath = characterState.assignedPath;
  if (!assignedPath.hasPath || assignedPath.currentIndex < assignedPath.path.length) {
    return;
  }

  assignedPath.hasPath = false;
  assignedPath.path = [];
  assignedPath.currentIndex = 0;
  assignedPath.speed = 0;

  clearPreviousPathData(pathfindingData);
}

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
 * shapes put together, so the rectangle is slightly bigger to compensate.
 */
function updateCharacterBoundingBox(characterState: CharacterState): void {
  const pos = characterState.position;
  const box = characterState.boundingBox;

  box.left = pos.x - BOUNDING_BOX_RADIUS;
  box.right = pos.x + BOUNDING_BOX_RADIUS;
  box.top = pos.y - BOUNDING_BOX_RADIUS - CHARACTER_OFFSET_Y;
  box.bottom = pos.y + BOUNDING_BOX_RADIUS - CHARACTER_OFFSET_Y;
}

export {
  CHARACTER_RADIUS,
  CHARACTER_OFFSET_Y,
  sendCharacterToSelectedPath,
  moveCharacterThroughPath,
  setCharacterPosition,
  clearPathOnDestination,
}
