import dom from "./global/dom";
import { CameraState } from "./state/camera";
import { ControlState } from "./state/controls";
import { GlobalState } from "./state/global";

/**
 * Main UI update function.
 */
function updateUI(state: GlobalState): void {
  updateStateInformation(state.camera, state.control);
}

/**
 * Updates the state information.
 */
function updateStateInformation(
  cameraState: CameraState,
  controlState: ControlState,
): void {
  dom.info.innerHTML = "Camera (raw size): " + Math.round(cameraState.size.raw.width) + "x" + Math.round(cameraState.size.raw.height) + "<br>";
  dom.info.innerHTML += "Camera (scale): " + cameraState.scale.value.toPrecision(3) + " -> " + cameraState.scale.destination.toPrecision(3) + "<br>";
  dom.info.innerHTML += "Camera (scaled size): " + Math.round(cameraState.size.scaled.width) + "x" + Math.round(cameraState.size.scaled.height) + "<br>";
  dom.info.innerHTML += "Camera (center): " + Math.round(cameraState.center.x) + "x" + Math.round(cameraState.center.y) + "<br>";
  dom.info.innerHTML += "Camera (scroll pos):" + Math.round(cameraState.scrollPosition.x) + "x" + Math.round(cameraState.scrollPosition.y) + "<br>";
  dom.info.innerHTML += "Mouse (window): " + Math.round(controlState.cursor.window.x) + "x" + Math.round(controlState.cursor.window.y) + "<br>";
  dom.info.innerHTML += "Mouse (map): " + Math.round(controlState.cursor.map.x) + "x" + Math.round(controlState.cursor.map.y) + "<br>";
  dom.info.innerHTML += "Controls (scale): " + controlState.scale.current + "<br>";
  dom.info.innerHTML += "Controls (scroll): " + controlState.scroll.general.current + "<br>";
}

export default updateUI;
