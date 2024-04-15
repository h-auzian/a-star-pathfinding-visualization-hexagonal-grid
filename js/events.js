import { updateCameraScaledSize } from "./camera.js";
import state from "./state.js";

/**
 * Sets the canvas size to the window size, and also updates the camera
 * dimensions according to the current scale.
 */
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    state.camera.size.raw.width = canvas.width;
    state.camera.size.raw.height = canvas.height;
    updateCameraScaledSize();
}

/**
 * Sets the window mouse position and also translates it relative to the map
 * taking the camera position and canvas scale into account.
 */
function updateMousePosition(x, y) {
    const camera = state.camera;
    const scale = state.camera.scale.value;
    const pos = state.mouse.position;

    pos.window.x = x;
    pos.window.y = y;

    pos.map.x = pos.window.x / scale - camera.size.scaled.width/2 + camera.center.x;
    pos.map.y = pos.window.y / scale - camera.size.scaled.height/2 + camera.center.y;
}

/**
 * Sets in the state whether a mouse button is currently pressed or not.
 */
function setRawMouseButton(buttonIndex, pressed) {
    const buttons = state.mouse.buttons;

    if (buttonIndex == 1) {
        buttons.middle = pressed;
    }
}

/**
 * Sets the mouse wheel delta, which can be a negative or positive integer.
 */
function setMouseWheelDirection(delta) {
    state.mouse.wheel.y = Math.sign(delta);
}

export {
    resizeCanvas,
    updateMousePosition,
    setRawMouseButton,
    setMouseWheelDirection,
};
