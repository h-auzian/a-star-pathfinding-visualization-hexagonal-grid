import { scaleCamera, scrollCamera } from "./camera.js";
import { updateControls } from "./controls.js";
import { updateUI } from "./ui.js";

/**
 * Main logic update function.
 */
function update(info) {
    updateControls();
    scrollCamera();
    scaleCamera();
    updateUI(info);
}


export default update;
