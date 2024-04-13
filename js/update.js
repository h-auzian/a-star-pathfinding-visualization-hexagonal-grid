import state from "./state.js";

/**
 * Main logic update function.
 */
function update(info) {
    updateInfo(info);
}

function updateInfo(info) {
    info.innerHTML = "Canvas: " + Math.round(canvas.width) + "x" + Math.round(canvas.height) + "<br>";
    info.innerHTML += "Camera: " + Math.round(state.camera.x) + "x" + Math.round(state.camera.y) + "<br>";
    info.innerHTML += "Scale: " + state.scale.value.toPrecision(3);
}

export default update;
