import { centerCameraOnMap } from "./camera.js";
import draw from "./draw.js";
import { resizeCanvas } from "./events.js";
import { initializeMap } from "./map.js";
import update from "./update.js";

function init() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const info = document.getElementById("info");

    initializeMap();
    centerCameraOnMap();

    resizeCanvas(canvas);
    listenToEvents(canvas);
    mainLoop(canvas, context, info);
}

/**
 * Setup all event listeners, useful for canvas resize or user input.
 */
function listenToEvents(canvas) {
    window.addEventListener("resize", function() {
        resizeCanvas(canvas);
    });
}

/**
 * Main loop, updating the logic and drawing the canvas each frame.
 */
function mainLoop(canvas, context, info) {
    window.requestAnimationFrame(function() {
        mainLoop(canvas, context, info);
    });

    update(info);
    draw(canvas, context);
}

export default init;
