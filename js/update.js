import { scaleCamera, scrollCamera } from "./camera.js";
import { updateControls } from "./controls.js";
import state from "./state.js";

/**
 * Main logic update function.
 */
function update(canvas, info) {
    updateInfo(canvas, info);
    updateControls();
    scrollCamera();
    scaleCamera();
}

function updateInfo(canvas, info) {
    info.innerHTML = "Canvas: " + Math.round(canvas.width) + "x" + Math.round(canvas.height) + "<br>";
    info.innerHTML += "Camera (scale): " + state.camera.scale.value.toPrecision(3) + " -> " + state.camera.scale.destination.toPrecision(3) + "<br>";
    info.innerHTML += "Camera (size): " + Math.round(state.camera.size.scaled.width) + "x" + Math.round(state.camera.size.scaled.height) + "<br>";
    info.innerHTML += "Camera (center): " + Math.round(state.camera.center.x) + "x" + Math.round(state.camera.center.y) + "<br>";
    info.innerHTML += "Camera (scroll pos):" + Math.round(state.camera.scrollPosition.x) + "x" + Math.round(state.camera.scrollPosition.y) + "<br>";
    info.innerHTML += "Mouse (window): " + Math.round(state.mouse.position.window.x) + "x" + Math.round(state.mouse.position.window.y) + "<br>";
    info.innerHTML += "Mouse (map): " + Math.round(state.mouse.position.map.x) + "x" + Math.round(state.mouse.position.map.y) + "<br>";
    info.innerHTML += "Controls (scroll): " + state.controls.scroll.current + "<br>";
    info.innerHTML += "Controls (scale): " + state.controls.scale.current + "<br>";
}

export default update;
