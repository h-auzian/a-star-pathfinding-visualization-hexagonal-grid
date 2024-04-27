import { applyCanvasTransformations, clearCanvas } from "./rendering/canvas";
import { renderMap } from "./rendering/map";
import { GlobalState } from "./state/global";

/**
 * Main canvas render function.
 */
function render(state: GlobalState): void {
  clearCanvas();
  applyCanvasTransformations(state.camera);
  renderMap(state.map, state.camera);
}

export default render;
