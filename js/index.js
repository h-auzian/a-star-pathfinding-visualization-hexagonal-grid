import { centerCameraOnMap } from "./camera.js";
import draw from "./draw.js";
import { resizeCanvas, setMouseWheelDirection, setRawMouseButton, updateMousePosition } from "./events.js";
import { initializeMap } from "./map.js";
import update from "./update.js";

function init() {
    initializeMap();
    centerCameraOnMap();

    resizeCanvas();
    listenToEvents();

    mainLoop();
}

/**
 * Setup all event listeners, useful for canvas resize or user input.
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
 * Main loop, updating the logic and drawing the canvas each frame.
 */
function mainLoop() {
    window.requestAnimationFrame(function() {
        mainLoop();
    });

    update();
    draw();
}

export default init;
