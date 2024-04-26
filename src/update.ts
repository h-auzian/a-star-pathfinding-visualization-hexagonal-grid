import { scaleCamera, scrollCamera } from "./logic/camera";
import { updateControls } from "./logic/controls";
import { detectTileUnderCursor } from "./logic/map";

/**
 * Main logic update function.
 */
function updateLogic(): void {
  updateControls();
  scaleCamera();
  scrollCamera();
  detectTileUnderCursor();
}

export default updateLogic;
