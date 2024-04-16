import state from "./state.js";

/**
 * Main UI update function.
 */
function updateUI(info) {
    updateStateInformation(info);
}

/**
 * Updates the state information.
 */
function updateStateInformation(info) {
    info.innerHTML = "Camera (raw size): " + Math.round(state.camera.size.raw.width) + "x" + Math.round(state.camera.size.raw.height) + "<br>";
    info.innerHTML += "Camera (scale): " + state.camera.scale.value.toPrecision(3) + " -> " + state.camera.scale.destination.toPrecision(3) + "<br>";
    info.innerHTML += "Camera (scaled size): " + Math.round(state.camera.size.scaled.width) + "x" + Math.round(state.camera.size.scaled.height) + "<br>";
    info.innerHTML += "Camera (center): " + Math.round(state.camera.center.x) + "x" + Math.round(state.camera.center.y) + "<br>";
    info.innerHTML += "Camera (scroll pos):" + Math.round(state.camera.scrollPosition.x) + "x" + Math.round(state.camera.scrollPosition.y) + "<br>";
    info.innerHTML += "Mouse (window): " + Math.round(state.mouse.position.window.x) + "x" + Math.round(state.mouse.position.window.y) + "<br>";
    info.innerHTML += "Mouse (map): " + Math.round(state.mouse.position.map.x) + "x" + Math.round(state.mouse.position.map.y) + "<br>";
    info.innerHTML += "Controls (scroll): " + state.controls.scroll.current + "<br>";
    info.innerHTML += "Controls (scale): " + state.controls.scale.current + "<br>";
}

export { updateUI };
