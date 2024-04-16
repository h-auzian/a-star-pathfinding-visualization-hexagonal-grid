import dom from "./references/dom.js";
import state from "./references/state.js";
import { updateCameraScaledSize } from "./logic/camera.js";

/**
 * Setup all event listeners, useful for canvas resize and user input.
 */
function listenToEvents() {
    window.addEventListener("resize", function() {
        resizeCanvas();
    });

    window.addEventListener('mousemove', function(event) {
        updateMousePosition(event.pageX, event.pageY);
    });

    window.addEventListener('mousedown', function(event) {
        setRawMouseButton(event.button, true);
    });

    window.addEventListener('mouseup', function(event) {
        setRawMouseButton(event.button, false);
    });

    window.addEventListener('wheel', function(event) {
        setMouseWheelDirection(event.deltaY);
    });

    // Disable middle click default scrolling.
    document.body.onmousedown = function(e) {
        if (e.button == 1) {
            return false;
        }
    }
}

/**
 * Sets the canvas size to the window size, and also updates the camera
 * dimensions according to the current scale.
 */
function resizeCanvas() {
    dom.canvas.width = window.innerWidth;
    dom.canvas.height = window.innerHeight;

    state.camera.size.raw.width = dom.canvas.width;
    state.camera.size.raw.height = dom.canvas.height;
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
    listenToEvents,
    resizeCanvas,
};
