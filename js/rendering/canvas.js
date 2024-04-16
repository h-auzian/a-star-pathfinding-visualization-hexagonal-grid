import dom from "../references/dom.js";
import state from "../references/state.js";

/**
 * Clears the canvas to allow rendering a new frame.
 */
function clearCanvas() {
    dom.context.setTransform(1, 0, 0, 1, dom.canvas.width/2, dom.canvas.height/2);
    dom.context.clearRect(-dom.canvas.width/2, -dom.canvas.height/2, dom.canvas.width, dom.canvas.height);
}

/**
 * Applies various transformations to the canvas to simulate a "camera".
 * Must be called every frame after clearing the canvas but before any rendering.
 */
function applyCanvasTransformations() {
    dom.context.scale(state.camera.scale.value, state.camera.scale.value);
    dom.context.translate(-state.camera.center.x, -state.camera.center.y);
}

export {
    clearCanvas,
    applyCanvasTransformations,
};
