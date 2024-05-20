import { updateAccumulatedTime, setFrameValue } from "../misc/utils";
import { CameraState } from "../state/camera";
import { ControlState } from "../state/controls";
import { InputState } from "../state/input";
import { FrameValues } from "../types/misc";
import { Point } from "../types/primitives";

/**
 * Returns if the control was just pressed or changed this frame.
 */
function justPressed(control: FrameValues<boolean | number>): boolean {
  return control.previous == 0 && control.current != 0;
}

/**
 * Updates all controls from the current raw input.
 */
function updateControls(
  controlState: ControlState,
  inputState: InputState,
  cameraState: CameraState,
  deltaTime: number,
): void {
  updateCursorPositions(controlState, cameraState, inputState.mouse.position);

  setFrameValue(controlState.scroll.general, inputState.mouse.buttons.middle);
  setFrameValue(controlState.scroll.directional.up, inputState.keyboard.buttons.w);
  setFrameValue(controlState.scroll.directional.left, inputState.keyboard.buttons.a);
  setFrameValue(controlState.scroll.directional.down, inputState.keyboard.buttons.s);
  setFrameValue(controlState.scroll.directional.right, inputState.keyboard.buttons.d);
  setFrameValue(controlState.scale, inputState.mouse.wheel.y);
  setFrameValue(controlState.followPath, inputState.mouse.buttons.left);

  updateAccumulatedTime(controlState.speedUpPath, inputState.mouse.buttons.left, deltaTime);
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

  cursor.camera.x = cursor.window.x / cameraScale - cameraSize.width/2 + cameraCenter.x;
  cursor.camera.y = cursor.window.y / cameraScale - cameraSize.height/2 + cameraCenter.y;
}

export {
  justPressed,
  updateControls,
}
