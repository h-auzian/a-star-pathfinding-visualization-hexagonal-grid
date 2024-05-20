import {
  scaleCamera,
  scrollCamera,
} from "./logic/camera";
import {
  clearPathOnDestination,
  moveCharacterThroughPath,
  sendCharacterToSelectedPath,
} from "./logic/character";
import { updateControls } from "./logic/controls";
import { resetInputs } from "./logic/input";
import {
  detectPathToTileUnderCursor,
  detectTileUnderCursor,
} from "./logic/map";
import { GlobalState } from "./state/global";

/**
 * Main logic update function.
 */
function updateLogic(state: GlobalState, deltaTime: number): void {
  updateControls(state.control, state.input, state.camera, deltaTime);
  resetInputs(state.input);

  scaleCamera(state.camera, state.control, deltaTime);
  scrollCamera(state.camera, state.control, state.map, deltaTime);

  clearPathOnDestination(state.character, state.map.pathfinding);

  detectTileUnderCursor(
    state.map,
    state.control,
    state.character.assignedPath.hasPath,
  );
  detectPathToTileUnderCursor(
    state.map,
    state.control,
    state.character.position,
    state.character.assignedPath.hasPath,
    deltaTime,
  );

  sendCharacterToSelectedPath(
    state.character,
    state.control,
    state.map.pathfinding,
  );
  moveCharacterThroughPath(state.character, deltaTime);
}

export default updateLogic;
