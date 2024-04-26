import { setCameraRawSize } from "./logic/camera";
import dom from "./global/dom";
import state from "./global/state";
import { Point } from "./misc/types";

/**
 * Setup all event listeners, useful for canvas resize and user input.
 */
function listenToEvents(): void {
  window.addEventListener("resize", function() {
    resizeCanvas();
  });

  window.addEventListener('mousemove', function(event: MouseEvent) {
    updateMousePosition({
      x: event.pageX,
      y: event.pageY,
    });
  });

  window.addEventListener('mousedown', function(event: MouseEvent) {
    setRawMouseButton(event.button, true);
  });

  window.addEventListener('mouseup', function(event: MouseEvent) {
    setRawMouseButton(event.button, false);
  });

  window.addEventListener('wheel', function(event: WheelEvent) {
    setMouseWheelDirection(event.deltaY);
  });

  window.addEventListener('keydown', function(event: KeyboardEvent) {
    setRawKeyboardButton(event.code, true);
  });

  window.addEventListener('keyup', function(event: KeyboardEvent) {
    setRawKeyboardButton(event.code, false);
  });

  // Disable middle click default scrolling.
  document.body.onmousedown = function(event: MouseEvent) {
    if (event.button == 1) {
      return false;
    }
  }
}

/**
 * Sets the canvas size to the window size, and also updates the camera
 * dimensions according to the current scale.
 */
function resizeCanvas(): void {
  dom.canvas.width = window.innerWidth;
  dom.canvas.height = window.innerHeight;

  setCameraRawSize({
    width: dom.canvas.width,
    height: dom.canvas.height,
  });
}

/**
 * Sets the window mouse position and also translates it relative to the map
 * taking the camera position and canvas scale into account.
 */
function updateMousePosition(position: Point): void {
  const camera = state.camera;
  const scale = state.camera.scale.value;
  const mousePosition = state.input.mouse.position;

  mousePosition.window.x = position.x;
  mousePosition.window.y = position.y;

  mousePosition.map.x = mousePosition.window.x / scale - camera.size.scaled.width/2 + camera.center.x;
  mousePosition.map.y = mousePosition.window.y / scale - camera.size.scaled.height/2 + camera.center.y;
}

/**
 * Sets in the state whether a keyboard button is currently pressed or not.
 */
function setRawKeyboardButton(buttonCode: string, pressed: boolean): void {
  const buttons = state.input.keyboard.buttons;

  if (buttonCode == "KeyW") {
    buttons.w = pressed;
  } else if (buttonCode == "KeyA") {
    buttons.a = pressed;
  } else if (buttonCode == "KeyS") {
    buttons.s = pressed;
  } else if (buttonCode == "KeyD") {
    buttons.d = pressed;
  }
}

/**
 * Sets in the state whether a mouse button is currently pressed or not.
 */
function setRawMouseButton(buttonIndex: number, pressed: boolean): void {
  const buttons = state.input.mouse.buttons;

  if (buttonIndex == 1) {
    buttons.middle = pressed;
  }
}

/**
 * Sets the mouse wheel delta, which can be a negative or positive integer.
 */
function setMouseWheelDirection(delta: number): void {
  state.input.mouse.wheel.y = Math.sign(delta);
}

export {
  listenToEvents,
  resizeCanvas,
}
