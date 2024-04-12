import draw from "./draw.js";
import {resizeCanvas} from "./events.js";
import update from "./update.js";

function init() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let info = document.getElementById("info");

    resizeCanvas(canvas);
    listenToEvents(canvas);
    mainLoop(canvas, context, info);
}

function listenToEvents(canvas) {
    window.addEventListener("resize", function() {
        resizeCanvas(canvas);
    });
}

function mainLoop(canvas, context, info) {
    window.requestAnimationFrame(function() {
        mainLoop(canvas, context, info);
    });

    update(info);
    draw(canvas, context);
}

export default init;
