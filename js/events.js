import state from "./state.js";

/**
 * Sets the canvas size to the window size, and also updates the camera
 * dimensions according to the current scale.
 */
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    state.camera.width = canvas.width / state.scale.value;
    state.camera.height = canvas.height / state.scale.value;
}

/**
 * Sets the window mouse position and also translates it relative to the map
 * taking the camera position and canvas scale into account.
 */
function updateMousePosition(x, y) {
    const camera = state.camera;
    const scale = state.scale.value;
    const pos = state.mouse.position;

    pos.window.x = x;
    pos.window.y = y;

    pos.map.x = pos.window.x / scale - camera.width/2 + camera.center.x;
    pos.map.y = pos.window.y / scale - camera.height/2 + camera.center.y;
}

export { resizeCanvas, updateMousePosition };
