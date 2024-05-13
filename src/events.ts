import { GlobalState } from "./state/global";
import { DOMElements } from "./dom";
import {
  setMousePosition,
  setMouseWheelDirection,
  setRawKeyboardButton,
  setRawMouseButton,
} from "./logic/input";
import { setCanvasAndCameraSize } from "./rendering/canvas";

/**
 * Setup all event listeners, useful for canvas resize and user input.
 */
function listenToEvents(state: GlobalState, domElements: DOMElements): void {
  window.addEventListener("resize", function() {
    setCanvasAndCameraSize(domElements.canvas, state.camera, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  window.addEventListener('mousemove', function(event: MouseEvent) {
    setMousePosition(state.input, {
      x: event.pageX,
      y: event.pageY,
    });
  });

  window.addEventListener('mousedown', function(event: MouseEvent) {
    setRawMouseButton(state.input, event.button, true);
  });

  window.addEventListener('mouseup', function(event: MouseEvent) {
    setRawMouseButton(state.input, event.button, false);
  });

  window.addEventListener('wheel', function(event: WheelEvent) {
    setMouseWheelDirection(state.input, event.deltaY);
  });

  window.addEventListener('keydown', function(event: KeyboardEvent) {
    setRawKeyboardButton(state.input, event.code, true);
  });

  window.addEventListener('keyup', function(event: KeyboardEvent) {
    setRawKeyboardButton(state.input, event.code, false);
  });

  // Disable middle click default scrolling.
  document.body.onmousedown = function(event: MouseEvent) {
    if (event.button == 1) {
      return false;
    }
  }
}

export default listenToEvents;
