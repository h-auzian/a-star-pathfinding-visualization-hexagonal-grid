import { applyCanvasTransformations, clearCanvas } from "./rendering/canvas";
import { renderMap } from "./rendering/map";

/**
 * Main canvas render function.
 */
function render(): void {
  clearCanvas();
  applyCanvasTransformations();
  renderMap();
}

export default render;
