import { DOMElements } from "../dom";
import { setCameraRawSize } from "../logic/camera";
import { CameraState } from "../state/camera";
import { MapState } from "../state/map";

/**
 * Sets the canvas size to the window size, and also updates the camera
 * dimensions according to the current scale.
 */
function resizeCanvas(
  canvas: HTMLCanvasElement,
  cameraState: CameraState,
  mapState: MapState,
): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  setCameraRawSize(cameraState, mapState, {
    width: canvas.width,
    height: canvas.height,
  });
}

/**
 * Clears the canvas to allow rendering a new frame.
 */
function clearCanvas(domElements: DOMElements): void {
  const width = domElements.canvas.width;
  const height = domElements.canvas.height;

  domElements.context.setTransform(1, 0, 0, 1, width/2, height/2);
  domElements.context.clearRect(-width/2, -height/2, width, height);
}

/**
 * Applies various transformations to the canvas to simulate a "camera".
 * Must be called every frame after clearing the canvas but before any rendering.
 */
function applyCanvasTransformations(
  context: CanvasRenderingContext2D,
  cameraState: CameraState,
): void {
  context.scale(cameraState.scale.value, cameraState.scale.value);
  context.translate(-cameraState.center.x, -cameraState.center.y);
}

export {
  resizeCanvas,
  clearCanvas,
  applyCanvasTransformations,
}
