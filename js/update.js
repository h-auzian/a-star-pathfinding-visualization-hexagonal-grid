import state from "./state.js";

function update(info) {
    updateCamera();
    updateInfo(info);
}

function updateCamera() {
    state.camera.x += 0.1;
    state.camera.y += 0.1;
}

function updateInfo(info) {
    info.innerHTML = "Canvas: " + Math.round(canvas.width) + "x" + Math.round(canvas.height) + "<br>";
    info.innerHTML += "Camera: " + Math.round(state.camera.x) + "x" + Math.round(state.camera.y) + "<br>";
    info.innerHTML += "Scale: " + state.scale.value.toPrecision(3);
}

export default update;
