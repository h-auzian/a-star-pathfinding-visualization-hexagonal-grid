import {
  scaleCamera,
  scrollCamera,
} from "./logic/camera";
import {
  clearCharacterAssignedPathOnDestination,
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
function updateLogic(state: GlobalState): void {
  updateControls(state.control, state.input, state.camera);
  resetInputs(state.input);

  scaleCamera(state.camera, state.control);
  scrollCamera(state.camera, state.control, state.map);

  clearCharacterAssignedPathOnDestination(state.character);

  detectTileUnderCursor(
    state.map,
    state.control,
    state.character.assignedPath.hasPath,
  );
  detectPathToTileUnderCursor(
    state.map,
    state.character.position,
    state.character.assignedPath.hasPath,
  );

  sendCharacterToSelectedPath(state.character, state.control, state.map);
  moveCharacterThroughPath(state.character);
}

export default updateLogic;
