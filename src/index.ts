import { listenToEvents, resizeCanvas } from "./events";
import { centerCameraOnMap } from "./logic/camera";
import { initializeMap } from "./logic/map";
import render from "./render";
import updateUI from "./ui";
import updateLogic from "./update";

/**
 * Initialization function that ties everything together.
 */
function init(): void {
  initializeMap();
  centerCameraOnMap();

  resizeCanvas();
  listenToEvents();

  mainLoop();
}

/**
 * Main loop, updating the logic and drawing the canvas each frame.
 */
function mainLoop(): void {
  window.requestAnimationFrame(function() {
    mainLoop();
  });

  updateLogic();
  updateUI();
  render();
}

init();
