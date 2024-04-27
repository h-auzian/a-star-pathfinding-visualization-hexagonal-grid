import { keepBetweenValues } from "../misc/functions";
import { justPressed } from "./controls";
import { Point, Size } from "../misc/types";
import { CameraState } from "../state/camera";
import { MapState } from "../state/map";
import { ControlState } from "../state/controls";

const SCALE_SPEED = 0.05;
const SCALE_MULTIPLIER = 2;
const SCALE_LOWER_LIMIT = Math.pow(1/SCALE_MULTIPLIER, 3);
const SCALE_UPPER_LIMIT = Math.pow(SCALE_MULTIPLIER, 3);
const GENERAL_SCROLL_SPEED = 0.5;
const DIRECTIONAL_SCROLL_SPEED = 15;

/**
 * Positions the camera on the central tile (or closest to it).
 */
function centerCameraOnMap(cameraState: CameraState, mapState: MapState): void {
  const tileX = Math.floor(mapState.dimensions.width / 2);
  const tileY = Math.floor(mapState.dimensions.height / 2);
  const tile = mapState.tiles[tileX][tileY];
  setCameraCenter(cameraState, mapState, tile.center);
}

/**
 * Sets a new scale destination on user input, and slowly approaches the
 * current scale to said value.
 */
function scaleCamera(
  cameraState: CameraState,
  controlState: ControlState,
  mapState: MapState,
): void {
  const scale = cameraState.scale;
  const scaleControl = controlState.scale;

  if (scale.value != scale.destination) {
    let newScale;
    if (getScaleDifference(cameraState) > scale.speed) {
      let direction = scale.value < scale.destination ? 1 : -1;
      newScale = scale.value + scale.speed * direction;
    } else {
      newScale = scale.destination;
    }
    setCameraScale(cameraState, mapState, newScale);
  } else if (justPressed(scaleControl)) {
    const direction = Math.sign(Number(scaleControl.current));
    if (direction == 1 && scale.destination > SCALE_LOWER_LIMIT) {
      scale.destination /= SCALE_MULTIPLIER;
    } else if (direction == -1 && scale.destination < SCALE_UPPER_LIMIT) {
      scale.destination *= SCALE_MULTIPLIER;
    }

    if (scale.value != scale.destination) {
      scale.speed = SCALE_SPEED * getScaleDifference(cameraState);
    }
  }
}

/**
 * Handles both scrolling methods for the camera.
 */
function scrollCamera(
  cameraState: CameraState,
  controlState: ControlState,
  mapState: MapState,
): void {
  scrollCameraGeneralControls(cameraState, controlState, mapState);
  scrollCameraDirectionalControls(cameraState, controlState, mapState);
}

/**
 * Scrolls the camera while the general scroll button is held.
 *
 * The greater the distance between the cursor initial position and the current
 * position, the faster the scroll movement will be.
 */
function scrollCameraGeneralControls(
  cameraState: CameraState,
  controlState: ControlState,
  mapState: MapState,
): void {
  const scrollControl = controlState.scroll.general;
  const cursorPosition = controlState.cursor.window;

  if (justPressed(scrollControl)) {
    cameraState.scrollPosition.x = cursorPosition.x;
    cameraState.scrollPosition.y = cursorPosition.y;
  } else if (scrollControl.current) {
    const speed = GENERAL_SCROLL_SPEED / cameraState.scale.value;
    const newCenter: Point = {
      x: cameraState.center.x + (cursorPosition.x - cameraState.scrollPosition.x) * speed,
      y: cameraState.center.y + (cursorPosition.y - cameraState.scrollPosition.y) * speed,
    };
    setCameraCenter(cameraState, mapState, newCenter);
  }
}

/**
 * Scrolls the camera using directional controls.
 */
function scrollCameraDirectionalControls(
  cameraState: CameraState,
  controlState: ControlState,
  mapState: MapState,
): void {
  const directionalControls = controlState.scroll.directional;
  const speed = DIRECTIONAL_SCROLL_SPEED / cameraState.scale.value;

  let newCenter: Point = {
    x: cameraState.center.x,
    y: cameraState.center.y,
  };

  if (directionalControls.left.current) {
    newCenter.x -= speed;
  } else if (directionalControls.right.current) {
    newCenter.x += speed;
  }

  if (directionalControls.up.current) {
    newCenter.y -= speed;
  } else if (directionalControls.down.current) {
    newCenter.y += speed;
  }

  setCameraCenter(cameraState, mapState, newCenter);
}

/**
 * Sets the camera center position and updates dependant values.
 */
function setCameraCenter(
  cameraState: CameraState,
  mapState: MapState,
  center: Point,
): void {
  if (center.x != cameraState.center.x || center.y != cameraState.center.y) {
    cameraState.center.x = center.x;
    cameraState.center.y = center.y;
    keepCameraCenterInsideBoundaries(cameraState, mapState);
  }
}

/**
 * Sets the camera scale value and updates dependant values.
 */
function setCameraScale(
  cameraState: CameraState,
  mapState: MapState,
  scale: number,
): void {
  if (scale != cameraState.scale.value) {
    cameraState.scale.value = scale;
    updateCameraScaledSize(cameraState);
    keepCameraCenterInsideBoundaries(cameraState, mapState);
  }
}

/**
 * Sets the camera raw size and updates dependant values.
 */
function setCameraRawSize(
  cameraState: CameraState,
  mapState: MapState,
  size: Size,
): void {
  const currentSize = cameraState.size.raw;
  if (size.width != currentSize.width || size.height != currentSize.height) {
    currentSize.width = size.width;
    currentSize.height = size.height;
    updateCameraScaledSize(cameraState);
    keepCameraCenterInsideBoundaries(cameraState, mapState);
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

  const boundaries = {
    left: mapState.boundaries.left + halfWidth,
    right: mapState.boundaries.right - halfWidth,
    top: mapState.boundaries.top + halfHeight,
    bottom: mapState.boundaries.bottom - halfHeight,
  };

  if (boundaries.left >= boundaries.right) {
    cameraState.center.x = mapState.boundaries.left + mapState.boundaries.right / 2;
  } else {
    cameraState.center.x = keepBetweenValues(boundaries.left, cameraState.center.x, boundaries.right);
  }

  if (boundaries.top >= boundaries.bottom) {
    cameraState.center.y = mapState.boundaries.top + mapState.boundaries.bottom / 2;
  } else {
    cameraState.center.y = keepBetweenValues(boundaries.top, cameraState.center.y, boundaries.bottom);
  }

  updateCameraScaledRectangle(cameraState);
}

/**
 * Updates the camera scaled size.
 */
function updateCameraScaledSize(cameraState: CameraState): void {
  cameraState.size.scaled.width = cameraState.size.raw.width / cameraState.scale.value;
  cameraState.size.scaled.height = cameraState.size.raw.height / cameraState.scale.value;
  updateCameraScaledRectangle(cameraState);
}

/**
 * Updates the camera scaled rectangle coordinates.
 */
function updateCameraScaledRectangle(cameraState: CameraState): void {
  cameraState.viewport.left = cameraState.center.x - cameraState.size.scaled.width / 2;
  cameraState.viewport.right = cameraState.center.x + cameraState.size.scaled.width / 2,
  cameraState.viewport.top = cameraState.center.y - cameraState.size.scaled.height / 2;
  cameraState.viewport.bottom = cameraState.center.y + cameraState.size.scaled.height / 2;
}

/**
 * Returns the absolute difference between the current scale value and its destination.
 */
function getScaleDifference(cameraState: CameraState): number {
  return Math.abs(cameraState.scale.destination - cameraState.scale.value);
}

export {
  centerCameraOnMap,
  scaleCamera,
  scrollCamera,
  setCameraRawSize,
}
