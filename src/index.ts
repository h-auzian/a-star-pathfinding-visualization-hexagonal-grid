import { DOMElements, getDOMElements } from "./dom";
import listenToEvents from "./events";
import { setCameraPosition } from "./logic/camera";
import { setCharacterPosition } from "./logic/character";
import { clearTilesAroundPosition, getCenterTile, initializeMap } from "./logic/map";
import render from "./render";
import { setCanvasAndCameraSize } from "./rendering/canvas";
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
  setCharacterPosition(state.character, getCenterTile(state.map).center);
  clearTilesAroundPosition(state.map, state.character.position);
  setCameraPosition(state.camera, state.character.position);

  setCanvasAndCameraSize(domElements.canvas, state.camera, {
    width: window.innerWidth,
    height: window.innerHeight,
  });

  listenToEvents(state, domElements);

  mainLoop(domElements, state);
}

/**
 * Main loop, updating the logic and drawing the canvas each frame.
 *
 * Internally it works with a variable timestep, which is good enough for this
 * application as it only contains animations, which don't need to be precise.
 *
 * To achieve a variable timestep, the total time of the previous frame is
 * substracted from the total time of the current frame, getting the time
 * delta, which is then passed to the update function. This way, the animations
 * will take around the same time regardless of how many frames per second the
 * application is running for.
 */
function mainLoop(
  domElements: DOMElements,
  state: GlobalState,
  totalTime: number = 0,
  deltaTime: number = 0,
): void {
  window.requestAnimationFrame(function(time: number) {
    time /= 1000;
    deltaTime = time - totalTime;
    mainLoop(domElements, state, time, deltaTime);
  });

  updateLogic(state, deltaTime);
  updateUI(domElements, state);
  render(domElements, state);
}

window.onload = function() {
  init();
}
