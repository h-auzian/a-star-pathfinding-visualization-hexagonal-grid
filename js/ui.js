import dom from "./global/dom.js";
import state from "./global/state.js";

/**
 * Main UI update function.
 */
function updateUI() {
  updateStateInformation();
}

/**
 * Updates the state information.
 */
function updateStateInformation() {
  dom.info.innerHTML = "Camera (raw size): " + Math.round(state.camera.size.raw.width) + "x" + Math.round(state.camera.size.raw.height) + "<br>";
  dom.info.innerHTML += "Camera (scale): " + state.camera.scale.value.toPrecision(3) + " -> " + state.camera.scale.destination.toPrecision(3) + "<br>";
  dom.info.innerHTML += "Camera (scaled size): " + Math.round(state.camera.size.scaled.width) + "x" + Math.round(state.camera.size.scaled.height) + "<br>";
  dom.info.innerHTML += "Camera (center): " + Math.round(state.camera.center.x) + "x" + Math.round(state.camera.center.y) + "<br>";
  dom.info.innerHTML += "Camera (scroll pos):" + Math.round(state.camera.scrollPosition.x) + "x" + Math.round(state.camera.scrollPosition.y) + "<br>";
  dom.info.innerHTML += "Mouse (window): " + Math.round(state.input.mouse.position.window.x) + "x" + Math.round(state.input.mouse.position.window.y) + "<br>";
  dom.info.innerHTML += "Mouse (map): " + Math.round(state.input.mouse.position.map.x) + "x" + Math.round(state.input.mouse.position.map.y) + "<br>";
  dom.info.innerHTML += "Controls (scale): " + state.controls.scale.current + "<br>";
  dom.info.innerHTML += "Controls (scroll): " + state.controls.scroll.general.current + "<br>";
}

export default updateUI;
