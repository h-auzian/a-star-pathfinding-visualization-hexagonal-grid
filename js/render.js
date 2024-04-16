import { applyCanvasTransformations, clearCanvas } from "./rendering/canvas.js";
import { renderMap } from "./rendering/map.js";

/**
 * Main canvas render function.
 */
function render() {
    clearCanvas();
    applyCanvasTransformations();
    renderMap();
}

export default render;
