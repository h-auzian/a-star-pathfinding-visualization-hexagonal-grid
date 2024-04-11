import draw from "./draw.js";
import update from "./update.js";

function init() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let info = document.getElementById("info");

    canvas.width = 500;
    canvas.height = 400;

    mainLoop(canvas, context, info);
}

function mainLoop(canvas, context, info) {
    window.requestAnimationFrame(function() {
        mainLoop(canvas, context, info);
    });

    update();
    draw(canvas, context, info);
}

export default init;
