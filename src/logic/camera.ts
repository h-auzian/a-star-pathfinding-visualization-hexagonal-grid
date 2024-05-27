import { justPressed } from "./controls";
import { CameraState } from "../state/camera";
import { MapState } from "../state/map";
import { ControlState } from "../state/controls";
import { Point } from "../types/primitives";
import { keepBetweenValues } from "../misc/utils";

const SCALE_SPEED = 3;
const SCALE_MULTIPLIER = 2;
const SCALE_LOWER_LIMIT = Math.pow(1/SCALE_MULTIPLIER, 2);
const SCALE_UPPER_LIMIT = Math.pow(SCALE_MULTIPLIER, 2);
const GENERAL_SCROLL_SPEED = 30;
const DIRECTIONAL_SCROLL_SPEED = 900;

/**
 * Sets the camera position.
 */
function setCameraPosition(cameraState: CameraState, position: Point): void {
  cameraState.center.x = position.x;
  cameraState.center.y = position.y;
}

/**
 * Sets a new scale destination on user input, and slowly approaches the
 * current scale to said value.
 */
function scaleCamera(
  cameraState: CameraState,
  controlState: ControlState,
  deltaTime: number,
): void {
  const scale = cameraState.scale;
  const scaleControl = controlState.scale;

  if (scale.value != scale.destination) {
    if (getScaleDifference(cameraState) > scale.speed) {
      let direction = scale.value < scale.destination ? 1 : -1;
      scale.value = scale.value + scale.speed * direction;
    } else {
      scale.value = scale.destination;
    }
  } else if (justPressed(scaleControl)) {
    const direction = Math.sign(Number(scaleControl.current));
    if (direction == 1 && scale.destination > SCALE_LOWER_LIMIT) {
      scale.destination /= SCALE_MULTIPLIER;
    } else if (direction == -1 && scale.destination < SCALE_UPPER_LIMIT) {
      scale.destination *= SCALE_MULTIPLIER;
    }

    if (scale.value != scale.destination) {
      scale.speed = SCALE_SPEED * deltaTime * getScaleDifference(cameraState);
    }
  }

  updateCameraScaledSize(cameraState);
}

/**
 * Scroll the camera with different methods and updates its viewport.
 */
function scrollCamera(
  cameraState: CameraState,
  controlState: ControlState,
  mapState: MapState,
  deltaTime: number,
): void {
  const scrolled = scrollCameraGeneralControls(
    cameraState,
    controlState,
    deltaTime,
  );

  if (!scrolled) {
    scrollCameraDirectionalControls(cameraState, controlState, deltaTime);
  }

  keepCameraCenterInsideBoundaries(cameraState, mapState);
  updateCameraViewport(cameraState);
}

/**
 * Scrolls the camera while the general scroll button is held. The greater the
 * distance between the cursor initial position and the current position, the
 * faster the scroll movement will be.
 *
 * Returns a boolean if the camera was scrolled, useful to disable other types
 * of scrolling.
 */
function scrollCameraGeneralControls(
  cameraState: CameraState,
  controlState: ControlState,
  deltaTime: number,
): boolean {
  const scrollControl = controlState.scroll.general;
  const cursorPosition = controlState.cursor.window;
  const scrollPosition = cameraState.scrollPosition;

  let scrolled = false;
  if (justPressed(scrollControl)) {
    scrollPosition.x = cursorPosition.x;
    scrollPosition.y = cursorPosition.y;
    scrolled = true;
  } else if (scrollControl.current) {
    const speed = GENERAL_SCROLL_SPEED * deltaTime / cameraState.scale.value;
    const center = cameraState.center;
    center.x = center.x + (cursorPosition.x - scrollPosition.x) * speed;
    center.y = center.y + (cursorPosition.y - scrollPosition.y) * speed;
    scrolled = true;
  }

  return scrolled;
}

/**
 * Scrolls the camera using directional controls.
 */
function scrollCameraDirectionalControls(
  cameraState: CameraState,
  controlState: ControlState,
  deltaTime: number,
): void {
  const directionalControls = controlState.scroll.directional;
  const speed = DIRECTIONAL_SCROLL_SPEED * deltaTime / cameraState.scale.value;
  const center = cameraState.center;

  if (directionalControls.left.current) {
    center.x -= speed;
  } else if (directionalControls.right.current) {
    center.x += speed;
  }

  if (directionalControls.up.current) {
    center.y -= speed;
  } else if (directionalControls.down.current) {
    center.y += speed;
  }
}

/**
 * Keeps the camera center inside the map boundaries.
 *
 * If the boundaries are smaller than the camera size, usually due to the
 * camera being zoomed out to render the whole map, then it just keeps the
 * camera centered on the map.
 */
function keepCameraCenterInsideBoundaries(
  cameraState: CameraState,
  mapState: MapState,
): void {
  const halfWidth = cameraState.size.scaled.width / 2;
  const halfHeight = cameraState.size.scaled.height / 2;

  const mapBoundaries = mapState.boundaries;
  const cameraBoundaries = {
    left: mapBoundaries.left + halfWidth,
    right: mapBoundaries.right - halfWidth,
    top: mapBoundaries.top + halfHeight,
    bottom: mapBoundaries.bottom - halfHeight,
  };

  if (cameraBoundaries.left >= cameraBoundaries.right) {
    cameraState.center.x = (mapBoundaries.left + mapBoundaries.right) / 2;
  } else {
    cameraState.center.x = keepBetweenValues(
      cameraBoundaries.left,
      cameraState.center.x,
      cameraBoundaries.right,
    );
  }

  if (cameraBoundaries.top >= cameraBoundaries.bottom) {
    cameraState.center.y = (mapBoundaries.top + mapBoundaries.bottom) / 2;
  } else {
    cameraState.center.y = keepBetweenValues(
      cameraBoundaries.top,
      cameraState.center.y,
      cameraBoundaries.bottom,
    );
  }
}

/**
 * Updates the camera current scaled size, useful after changing the raw size
 * and/or scale.
 */
function updateCameraScaledSize(cameraState: CameraState): void {
  const size = cameraState.size;
  const scale = cameraState.scale.value;
  size.scaled.width = size.raw.width / scale;
  size.scaled.height = size.raw.height / scale;
}

/**
 * Updates the camera current viewport, useful after moving the center of the
 * camera.
 */
function updateCameraViewport(cameraState: CameraState): void {
  const viewport = cameraState.viewport;
  const size = cameraState.size;
  const center = cameraState.center;

  viewport.left = center.x - size.scaled.width / 2;
  viewport.right = center.x + size.scaled.width / 2,
  viewport.top = center.y - size.scaled.height / 2;
  viewport.bottom = center.y + size.scaled.height / 2;
}

/**
 * Returns the absolute difference between the current scale value and its
 * destination.
 */
function getScaleDifference(cameraState: CameraState): number {
  return Math.abs(cameraState.scale.destination - cameraState.scale.value);
}

export {
  setCameraPosition,
  scaleCamera,
  scrollCamera,
}
