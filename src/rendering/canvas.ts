import dom from "../global/dom";
import { CameraState } from "../state/camera";

/**
 * Clears the canvas to allow rendering a new frame.
 */
function clearCanvas(): void {
  dom.context.setTransform(1, 0, 0, 1, dom.canvas.width/2, dom.canvas.height/2);
  dom.context.clearRect(-dom.canvas.width/2, -dom.canvas.height/2, dom.canvas.width, dom.canvas.height);
}

/**
 * Applies various transformations to the canvas to simulate a "camera".
 * Must be called every frame after clearing the canvas but before any rendering.
 */
function applyCanvasTransformations(cameraState: CameraState): void {
  dom.context.scale(cameraState.scale.value, cameraState.scale.value);
  dom.context.translate(-cameraState.center.x, -cameraState.center.y);
}

export {
  clearCanvas,
  applyCanvasTransformations,
}
