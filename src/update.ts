import { scaleCamera, scrollCamera } from "./logic/camera";
import { updateControls } from "./logic/controls";
import { resetInputs } from "./logic/input";
import { detectTileUnderCursor } from "./logic/map";
import { GlobalState } from "./state/global";

/**
 * Main logic update function.
 */
function updateLogic(state: GlobalState): void {
  updateControls(state.control, state.input, state.camera);
  resetInputs(state.input);

  scaleCamera(state.camera, state.control, state.map);
  scrollCamera(state.camera, state.control, state.map);

  detectTileUnderCursor(state.map, state.control);
}

export default updateLogic;
