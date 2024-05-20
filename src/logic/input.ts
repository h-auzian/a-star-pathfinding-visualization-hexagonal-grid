import { InputState } from "../state/input";
import { Point } from "../types/primitives";

/**
 * Sets in the state whether a keyboard button is currently pressed or not.
 */
function setRawKeyboardButton(
  inputState: InputState,
  buttonCode: string,
  pressed: boolean,
): void {
  const buttons = inputState.keyboard.buttons;

  if (buttonCode == "KeyQ") {
    buttons.q = pressed;
  } else if (buttonCode == "KeyW") {
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

  if (buttonIndex == 0) {
    buttons.left = pressed;
  } else if (buttonIndex == 1) {
    buttons.middle = pressed;
  }
}

/**
 * Sets the mouse wheel delta, which can be a negative or positive integer.
 */
function setMouseWheelDirection(inputState: InputState, delta: number): void {
  inputState.mouse.wheel.y = Math.sign(delta);
}

/**
 * Sets the raw mouse position.
 */
function setMousePosition(inputState: InputState, position: Point): void {
  inputState.mouse.position.x = position.x;
  inputState.mouse.position.y = position.y;
}

/**
 * Resets inputs that are not normally reset via events.
 */
function resetInputs(inputState: InputState): void {
  inputState.mouse.wheel.y = 0;
}

export {
  setRawKeyboardButton,
  setRawMouseButton,
  setMouseWheelDirection,
  setMousePosition,
  resetInputs,
}
