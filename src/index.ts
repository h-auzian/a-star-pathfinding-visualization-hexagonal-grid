import { listenToEvents, resizeCanvas } from "./events";
import { centerCameraOnMap } from "./logic/camera";
import { initializeMap } from "./logic/map";
import render from "./render";
import { GlobalState, createGlobalState } from "./state/global";
import updateUI from "./ui";
import updateLogic from "./update";

/**
 * Initialization function that ties everything together.
 */
function init(): void {
  const state = createGlobalState();

  initializeMap(state.map);
  centerCameraOnMap(state.camera, state.map);

  resizeCanvas(state.camera, state.map);
  listenToEvents(state);

  mainLoop(state);
}

/**
 * Main loop, updating the logic and drawing the canvas each frame.
 */
function mainLoop(state: GlobalState): void {
  window.requestAnimationFrame(function() {
    mainLoop(state);
  });

  updateLogic(state);
  updateUI(state);
  render(state);
}

init();
