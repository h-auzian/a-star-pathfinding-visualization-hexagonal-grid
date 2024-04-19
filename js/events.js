import { setCameraRawSize } from "./logic/camera.js";
import dom from "./global/dom.js";
import state from "./global/state.js";

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

    window.addEventListener('keydown', function(event) {
        setRawKeyboardButton(event.code, true);
    });

    window.addEventListener('keyup', function(event) {
        setRawKeyboardButton(event.code, false);
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

    setCameraRawSize(dom.canvas.width, dom.canvas.height);
}

/**
 * Sets the window mouse position and also translates it relative to the map
 * taking the camera position and canvas scale into account.
 */
function updateMousePosition(x, y) {
    const camera = state.camera;
    const scale = state.camera.scale.value;
    const mousePosition = state.input.mouse.position;

    mousePosition.window.x = x;
    mousePosition.window.y = y;

    mousePosition.map.x = mousePosition.window.x / scale - camera.size.scaled.width/2 + camera.center.x;
    mousePosition.map.y = mousePosition.window.y / scale - camera.size.scaled.height/2 + camera.center.y;
}

/**
 * Sets in the state whether a keyboard button is currently pressed or not.
 */
function setRawKeyboardButton(buttonCode, pressed) {
    const buttons = state.input.keyboard.buttons;

    if (buttonCode == "KeyW") {
        buttons.w = pressed;
    } else if (buttonCode == "KeyA") {
        buttons.a = pressed;
    } else if (buttonCode == "KeyS") {
        buttons.s = pressed;
    } else if (buttonCode == "KeyD") {
        buttons.d = pressed;
    }
}

/**
 * Sets in the state whether a mouse button is currently pressed or not.
 */
function setRawMouseButton(buttonIndex, pressed) {
    const buttons = state.input.mouse.buttons;

    if (buttonIndex == 1) {
        buttons.middle = pressed;
    }
}

/**
 * Sets the mouse wheel delta, which can be a negative or positive integer.
 */
function setMouseWheelDirection(delta) {
    state.input.mouse.wheel.y = Math.sign(delta);
}

export {
    listenToEvents,
    resizeCanvas,
};
