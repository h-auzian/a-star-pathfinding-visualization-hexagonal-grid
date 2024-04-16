import { scaleCamera, scrollCamera } from "./logic/camera.js";
import { updateControls } from "./logic/controls.js";

/**
 * Main logic update function.
 */
function updateLogic() {
    updateControls();
    scrollCamera();
    scaleCamera();
}

export default updateLogic;
