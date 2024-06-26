import { DOMElements } from "./dom";
import { applyCanvasTransformations, clearCanvas } from "./rendering/canvas";
import renderCharacter from "./rendering/character";
import renderMap from "./rendering/map";
import { GlobalState } from "./state/global";

/**
 * Main canvas render function.
 */
function render(domElements: DOMElements, state: GlobalState): void {
  clearCanvas(domElements);
  applyCanvasTransformations(domElements.context, state.camera);
  renderMap(domElements.context, state);
  renderCharacter(domElements.context, state);
}

export default render;
