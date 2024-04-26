import { keepBetweenValues } from "../misc/functions";
import state from "../global/state";
import { justPressed } from "./controls";
import { Point, Size } from "../misc/types";

const SCALE_SPEED = 0.05;
const SCALE_MULTIPLIER = 2;
const SCALE_LOWER_LIMIT = Math.pow(1/SCALE_MULTIPLIER, 3);
const SCALE_UPPER_LIMIT = Math.pow(SCALE_MULTIPLIER, 3);
const GENERAL_SCROLL_SPEED = 0.5;
const DIRECTIONAL_SCROLL_SPEED = 15;

/**
 * Positions the camera on the central tile (or closest to it).
 */
function centerCameraOnMap(): void {
  const tileX = Math.floor(state.map.width / 2);
  const tileY = Math.floor(state.map.height / 2);

  const tile = state.map.tiles[tileX][tileY];
  setCameraCenter(tile.center);
}

/**
 * Sets a new scale destination on user input, and slowly approaches the
 * current scale to said value.
 */
function scaleCamera(): void {
  const scale = state.camera.scale;
  const control = state.controls.scale;

  if (scale.value != scale.destination) {
    if (getScaleDifference() > scale.speed) {
      let direction = scale.value < scale.destination ? 1 : -1;
      setCameraScale(scale.value + scale.speed * direction);
    } else {
      setCameraScale(scale.destination);
    }
  } else if (justPressed(control)) {
    const direction = Math.sign(control.current);
    if (direction == 1 && scale.destination > SCALE_LOWER_LIMIT) {
      scale.destination /= SCALE_MULTIPLIER;
    } else if (direction == -1 && scale.destination < SCALE_UPPER_LIMIT) {
      scale.destination *= SCALE_MULTIPLIER;
    }

    if (scale.value != scale.destination) {
      scale.speed = SCALE_SPEED * getScaleDifference();
    }
  }
}

/**
 * Handles both scrolling methods for the camera.
 */
function scrollCamera(): void {
  scrollCameraGeneralControls();
  scrollCameraDirectionalControls();
}

/**
 * Scrolls the camera while the general scroll button is held.
 *
 * The greater the distance between the cursor initial position and the current
 * position, the faster the scroll movement will be.
 */
function scrollCameraGeneralControls(): void {
  const camera = state.camera;
  const scrollControl = state.controls.scroll.general;
  const mousePosition = state.input.mouse.position.window;

  if (justPressed(scrollControl)) {
    camera.scrollPosition.x = mousePosition.x;
    camera.scrollPosition.y = mousePosition.y;
  } else if (scrollControl.current) {
    const speed = GENERAL_SCROLL_SPEED / camera.scale.value;
    const newCenter: Point = {
      x: camera.center.x + (mousePosition.x - camera.scrollPosition.x) * speed,
      y: camera.center.y + (mousePosition.y - camera.scrollPosition.y) * speed,
    };
    setCameraCenter(newCenter);
  }
}

/**
 * Scrolls the camera using directional controls.
 */
function scrollCameraDirectionalControls(): void {
  const camera = state.camera;
  const controls = state.controls.scroll.individual;
  const speed = DIRECTIONAL_SCROLL_SPEED / camera.scale.value;

  let newCenter: Point = {
    x: camera.center.x,
    y: camera.center.y,
  };

  if (controls.left.current) {
    newCenter.x -= speed;
  } else if (controls.right.current) {
    newCenter.x += speed;
  }

  if (controls.up.current) {
    newCenter.y -= speed;
  } else if (controls.down.current) {
    newCenter.y += speed;
  }

  setCameraCenter(newCenter);
}

/**
 * Sets the camera center position and updates dependant values.
 */
function setCameraCenter(center: Point): void {
  const camera = state.camera;

  if (center.x != camera.center.x || center.y != camera.center.y) {
    camera.center.x = center.x;
    camera.center.y = center.y;
    keepCameraCenterInsideBoundaries();
  }
}

/**
 * Sets the camera scale value and updates dependant values.
 */
function setCameraScale(scale: number): void {
  if (scale != state.camera.scale.value) {
    state.camera.scale.value = scale;
    updateCameraScaledSize();
    keepCameraCenterInsideBoundaries();
  }
}

/**
 * Sets the camera raw size and updates dependant values.
 */
function setCameraRawSize(size: Size): void {
  const currentSize = state.camera.size.raw;
  if (size.width != currentSize.width || size.height != currentSize.height) {
    currentSize.width = size.width;
    currentSize.height = size.height;
    updateCameraScaledSize();
    keepCameraCenterInsideBoundaries();
  }
}
/**
 * Keeps the camera center inside the map boundaries.
 *
 * If the boundaries are smaller than the camera size, usually due to the
 * camera being zoomed out to render the whole map, then it just keeps the
 * camera centered on the map.
 */
function keepCameraCenterInsideBoundaries(): void {
  const camera = state.camera;
  const halfWidth = state.camera.size.scaled.width / 2;
  const halfHeight = state.camera.size.scaled.height / 2;

  const boundaries = {
    left: state.map.boundaries.left + halfWidth,
    right: state.map.boundaries.right - halfWidth,
    top: state.map.boundaries.top + halfHeight,
    bottom: state.map.boundaries.bottom - halfHeight,
  };

  if (boundaries.left >= boundaries.right) {
    camera.center.x = state.map.boundaries.left + state.map.boundaries.right / 2;
  } else {
    camera.center.x = keepBetweenValues(boundaries.left, camera.center.x, boundaries.right);
  }

  if (boundaries.top >= boundaries.bottom) {
    camera.center.y = state.map.boundaries.top + state.map.boundaries.bottom / 2;
  } else {
    camera.center.y = keepBetweenValues(boundaries.top, camera.center.y, boundaries.bottom);
  }

  updateCameraScaledRectangle();
}

/**
 * Updates the camera scaled size.
 */
function updateCameraScaledSize(): void {
  const camera = state.camera;
  camera.size.scaled.width = camera.size.raw.width / camera.scale.value;
  camera.size.scaled.height = camera.size.raw.height / camera.scale.value;
  updateCameraScaledRectangle();
}

/**
 * Updates the camera scaled rectangle coordinates.
 */
function updateCameraScaledRectangle(): void {
  const camera = state.camera;
  camera.rectangle.scaled.left = camera.center.x - camera.size.scaled.width / 2;
  camera.rectangle.scaled.right = camera.center.x + camera.size.scaled.width / 2,
  camera.rectangle.scaled.top = camera.center.y - camera.size.scaled.height / 2;
  camera.rectangle.scaled.bottom = camera.center.y + camera.size.scaled.height / 2;
}

/**
 * Returns the absolute difference between the current scale value and its destination.
 */
function getScaleDifference(): number {
  return Math.abs(state.camera.scale.destination - state.camera.scale.value);
}

export {
  centerCameraOnMap,
  scaleCamera,
  scrollCamera,
  setCameraRawSize,
}
