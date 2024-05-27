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
  const mouse = inputState.mouse;
  const keyboard = inputState.keyboard;

  updateCursor(controlState, cameraState, mouse.position, mouse.insideCanvas);

  setFrameValue(controlState.scroll.general, mouse.buttons.middle);
  setFrameValue(controlState.scroll.directional.up, keyboard.buttons.w);
  setFrameValue(controlState.scroll.directional.left, keyboard.buttons.a);
  setFrameValue(controlState.scroll.directional.down, keyboard.buttons.s);
  setFrameValue(controlState.scroll.directional.right, keyboard.buttons.d);
  setFrameValue(controlState.scale, mouse.wheel.y);
  setFrameValue(controlState.followPath, mouse.buttons.left && mouse.insideCanvas);
  setFrameValue(controlState.finishPath, keyboard.buttons.q);

  updateAccumulatedTime(
    controlState.speedUpPath,
    mouse.buttons.left && mouse.insideCanvas,
    deltaTime,
  );
}

/**
 * Sets both the window and camera cursor positions and if the cursor is inside
 * the camera wihout being on top of any UI elements.
 *
 * The camera position is the window position translated to camera coordinates,
 * taking the camera center and scale into account.
 */
function updateCursor(
  controlState: ControlState,
  cameraState: CameraState,
  mousePosition: Point,
  mouseInsideCanvas: boolean,
): void {
  const cursor = controlState.cursor;
  const cameraScale = cameraState.scale.value;
  const cameraSize = cameraState.size.scaled;
  const cameraCenter = cameraState.center;

  cursor.window.x = mousePosition.x;
  cursor.window.y = mousePosition.y;

  cursor.camera.x = cursor.window.x / cameraScale - cameraSize.width/2 + cameraCenter.x;
  cursor.camera.y = cursor.window.y / cameraScale - cameraSize.height/2 + cameraCenter.y;

  cursor.insideCamera = mouseInsideCanvas;
}

export {
  justPressed,
  updateControls,
}
