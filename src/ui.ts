import { DOMElements } from "./dom";
import { CameraState } from "./state/camera";
import { ControlState } from "./state/controls";
import { GlobalState } from "./state/global";

/**
 * Main UI update function.
 */
function updateUI(domElements: DOMElements, state: GlobalState): void {
  updateStateInformation(domElements.info, state.camera, state.control);
}

/**
 * Updates the state information.
 */
function updateStateInformation(
  info: HTMLElement,
  cameraState: CameraState,
  controlState: ControlState,
): void {
  info.innerHTML = "Camera (raw size): " + Math.round(cameraState.size.raw.width) + "x" + Math.round(cameraState.size.raw.height) + "<br>";
  info.innerHTML += "Camera (scale): " + cameraState.scale.value.toPrecision(3) + " -> " + cameraState.scale.destination.toPrecision(3) + "<br>";
  info.innerHTML += "Camera (scaled size): " + Math.round(cameraState.size.scaled.width) + "x" + Math.round(cameraState.size.scaled.height) + "<br>";
  info.innerHTML += "Camera (center): " + Math.round(cameraState.center.x) + "x" + Math.round(cameraState.center.y) + "<br>";
  info.innerHTML += "Camera (scroll pos):" + Math.round(cameraState.scrollPosition.x) + "x" + Math.round(cameraState.scrollPosition.y) + "<br>";
  info.innerHTML += "Mouse (window): " + Math.round(controlState.cursor.window.x) + "x" + Math.round(controlState.cursor.window.y) + "<br>";
  info.innerHTML += "Mouse (map): " + Math.round(controlState.cursor.map.x) + "x" + Math.round(controlState.cursor.map.y) + "<br>";
  info.innerHTML += "Controls (scale): " + controlState.scale.current + "<br>";
  info.innerHTML += "Controls (scroll): " + controlState.scroll.general.current + "<br>";
}

export default updateUI;
