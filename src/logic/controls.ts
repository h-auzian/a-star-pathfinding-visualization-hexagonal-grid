import { Control } from "../misc/types";
import { ControlState } from "../state/controls";
import { InputState } from "../state/input";

/**
 * Returns if the control was just pressed or changed this frame.
 */
function justPressed(control: Control): boolean {
  return control.previous == 0 && control.current != 0;
}

/**
 * Updates all controls. This has to be called every frame.
 */
function updateControls(controlState: ControlState, inputState: InputState): void {
  updateControl(controlState.scale, inputState.mouse.wheel.y);
  updateControl(controlState.scroll.general, inputState.mouse.buttons.middle);
  updateControl(controlState.scroll.directional.up, inputState.keyboard.buttons.w);
  updateControl(controlState.scroll.directional.left, inputState.keyboard.buttons.a);
  updateControl(controlState.scroll.directional.down, inputState.keyboard.buttons.s);
  updateControl(controlState.scroll.directional.right, inputState.keyboard.buttons.d);

  resetInputs(inputState);
}

/**
 * Resets inputs that are not normally reset via events.
 */
function resetInputs(inputState: InputState): void {
  inputState.mouse.wheel.y = 0;
}

/**
 * Sets a control value for the previous and current frame.
 */
function updateControl(control: Control, raw: boolean | number): void {
  control.previous = control.current;
  control.current = raw;
}

export {
  justPressed,
  updateControls,
}
