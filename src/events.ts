import { setCameraRawSize } from "./logic/camera";
import { Point } from "./misc/types";
import { CameraState } from "./state/camera";
import { MapState } from "./state/map";
import { InputState } from "./state/input";
import { ControlState } from "./state/controls";
import { GlobalState } from "./state/global";
import { DOMElements } from "./dom";

/**
 * Setup all event listeners, useful for canvas resize and user input.
 */
function listenToEvents(state: GlobalState, domElements: DOMElements): void {
  window.addEventListener("resize", function() {
    resizeCanvas(domElements.canvas, state.camera, state.map);
  });

  window.addEventListener('mousemove', function(event: MouseEvent) {
    updateMousePosition(state.camera, state.input, state.control, {
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

/**
 * Sets the canvas size to the window size, and also updates the camera
 * dimensions according to the current scale.
 */
function resizeCanvas(
  canvas: HTMLCanvasElement,
  cameraState: CameraState,
  mapState: MapState,
): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  setCameraRawSize(cameraState, mapState, {
    width: canvas.width,
    height: canvas.height,
  });
}

/**
 * Sets the window mouse position and also translates it relative to the map
 * taking the camera position and canvas scale into account.
 */
function updateMousePosition(
  cameraState: CameraState,
  inputState: InputState,
  controlState: ControlState,
  position: Point,
): void {
  const mousePosition = inputState.mouse.position;
  const cursor = controlState.cursor;
  const cameraScale = cameraState.scale.value;
  const cameraSize = cameraState.size.scaled;
  const cameraCenter = cameraState.center;

  mousePosition.x = position.x;
  mousePosition.y = position.y;

  cursor.window.x = mousePosition.x;
  cursor.window.y = mousePosition.y;

  cursor.map.x = cursor.window.x / cameraScale - cameraSize.width/2 + cameraCenter.x;
  cursor.map.y = cursor.window.y / cameraScale - cameraSize.height/2 + cameraCenter.y;
}

/**
 * Sets in the state whether a keyboard button is currently pressed or not.
 */
function setRawKeyboardButton(
  inputState: InputState,
  buttonCode: string,
  pressed: boolean,
): void {
  const buttons = inputState.keyboard.buttons;

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
function setRawMouseButton(
  inputState: InputState,
  buttonIndex: number,
  pressed: boolean,
): void {
  const buttons = inputState.mouse.buttons;

  if (buttonIndex == 1) {
    buttons.middle = pressed;
  }
}

/**
 * Sets the mouse wheel delta, which can be a negative or positive integer.
 */
function setMouseWheelDirection(inputState: InputState, delta: number): void {
  inputState.mouse.wheel.y = Math.sign(delta);
}

export {
  listenToEvents,
  resizeCanvas,
}
