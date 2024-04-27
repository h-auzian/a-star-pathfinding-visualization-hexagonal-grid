import { DOMElements, getDOMElements } from "./dom";
import listenToEvents from "./events";
import { centerCameraOnMap } from "./logic/camera";
import { initializeMap } from "./logic/map";
import render from "./render";
import { resizeCanvas } from "./rendering/canvas";
import { GlobalState, createGlobalState } from "./state/global";
import updateUI from "./ui";
import updateLogic from "./update";

/**
 * Initialization function that ties everything together.
 */
function init(): void {
  const state = createGlobalState();
  const domElements = getDOMElements();

  initializeMap(state.map);
  centerCameraOnMap(state.camera, state.map);

  resizeCanvas(domElements.canvas, state.camera, state.map);
  listenToEvents(state, domElements);

  mainLoop(domElements, state);
}

/**
 * Main loop, updating the logic and drawing the canvas each frame.
 */
function mainLoop(domElements: DOMElements, state: GlobalState): void {
  window.requestAnimationFrame(function() {
    mainLoop(domElements, state);
  });

  updateLogic(state);
  updateUI(domElements, state);
  render(domElements, state);
}

window.onload = function() {
  init();
}
