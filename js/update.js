import { scaleCamera, scrollCamera } from "./logic/camera.js";
import { updateControls } from "./logic/controls.js";
import { detectTileUnderCursor } from "./logic/map.js";

/**
 * Main logic update function.
 */
function updateLogic() {
  updateControls();
  scaleCamera();
  scrollCamera();
  detectTileUnderCursor();
}

export default updateLogic;
