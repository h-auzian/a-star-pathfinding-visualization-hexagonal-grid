import { Control, Point } from "../misc/types";
import { CameraState } from "../state/camera";
import { ControlState } from "../state/controls";
import { InputState } from "../state/input";

/**
 * Returns if the control was just pressed or changed this frame.
 */
function justPressed(control: Control): boolean {
  return control.previous == 0 && control.current != 0;
}

/**
 * Updates all controls from the current raw input.
 */
function updateControls(
  controlState: ControlState,
  inputState: InputState,
  cameraState: CameraState,
): void {
  updateCursorPositions(controlState, cameraState, inputState.mouse.position);

  updateControl(controlState.scale, inputState.mouse.wheel.y);
  updateControl(controlState.scroll.general, inputState.mouse.buttons.middle);
  updateControl(controlState.scroll.directional.up, inputState.keyboard.buttons.w);
  updateControl(controlState.scroll.directional.left, inputState.keyboard.buttons.a);
  updateControl(controlState.scroll.directional.down, inputState.keyboard.buttons.s);
  updateControl(controlState.scroll.directional.right, inputState.keyboard.buttons.d);
}

/**
 * Sets both the window and camera cursor positions. In the latter case, the
 * position is translated taking the camera position and scale into account.
 */
function updateCursorPositions(
  controlState: ControlState,
  cameraState: CameraState,
  mousePosition: Point,
): void {
  const cursor = controlState.cursor;
  const cameraScale = cameraState.scale.value;
  const cameraSize = cameraState.size.scaled;
  const cameraCenter = cameraState.center;

  cursor.window.x = mousePosition.x;
  cursor.window.y = mousePosition.y;

  cursor.map.x = cursor.window.x / cameraScale - cameraSize.width/2 + cameraCenter.x;
  cursor.map.y = cursor.window.y / cameraScale - cameraSize.height/2 + cameraCenter.y;
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
