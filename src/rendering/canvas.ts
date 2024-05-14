import { DOMElements } from "../dom";
import { CameraState } from "../state/camera";
import { Size } from "../types/primitives";

/**
 * Sets the canvas and camera size.
 */
function setCanvasAndCameraSize(
  canvas: HTMLCanvasElement,
  cameraState: CameraState,
  size: Size,
): void {
  canvas.width = size.width;
  canvas.height = size.height;

  cameraState.size.raw.width = canvas.width;
  cameraState.size.raw.height = canvas.height;
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
  setCanvasAndCameraSize,
  clearCanvas,
  applyCanvasTransformations,
}
