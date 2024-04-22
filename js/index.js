import { listenToEvents, resizeCanvas } from "./events.js";
import { centerCameraOnMap } from "./logic/camera.js";
import { initializeMap } from "./logic/map.js";
import render from "./render.js";
import updateUI from "./ui.js";
import updateLogic from "./update.js";

/**
 * Initialization function that ties everything together.
 */
function init() {
  initializeMap();
  centerCameraOnMap();

  resizeCanvas();
  listenToEvents();

  mainLoop();
}

/**
 * Main loop, updating the logic and drawing the canvas each frame.
 */
function mainLoop() {
  window.requestAnimationFrame(function() {
    mainLoop();
  });

  updateLogic();
  updateUI();
  render();
}

export default init;
