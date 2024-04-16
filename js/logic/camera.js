import state from "../references/state.js";
import { justPressed } from "./controls.js";

const SCALE_SPEED = 0.05;
const SCALE_MULTIPLIER = 2;
const SCALE_LOWER_LIMIT = Math.pow(1/SCALE_MULTIPLIER, 3);
const SCALE_UPPER_LIMIT = Math.pow(SCALE_MULTIPLIER, 3);
const DIRECTIONAL_SCROLL_SPEED = 10;

/**
 * Updates the camera scaled size.
 * Useful after resizing the camera or changing the scale.
 */
function updateCameraScaledSize() {
    const scale = state.camera.scale.value;
    const size = state.camera.size;
    size.scaled.width = size.raw.width / scale;
    size.scaled.height = size.raw.height / scale;
}

/**
 * Positions the camera on the central tile (or closest to it).
 */
function centerCameraOnMap() {
    const tileX = Math.floor(state.map.width / 2);
    const tileY = Math.floor(state.map.height / 2);

    const tile = state.map.tiles[tileX][tileY];
    state.camera.center.x = tile.center.x;
    state.camera.center.y = tile.center.y;
}

/**
 * Sets a new scale destination on user input, and slowly approaches the
 * current scale to said value.
 */
function scaleCamera() {
    const scale = state.camera.scale;
    const control = state.controls.scale;

    if (scale.value != scale.destination) {
        if (getScaleDifference() > scale.speed) {
            let direction = scale.value < scale.destination ? 1 : -1;
            scale.value += scale.speed * direction;
        } else {
            scale.value = scale.destination;
        }
        updateCameraScaledSize();
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
function scrollCamera() {
    scrollCameraGeneralControls();
    scrollCameraDirectionalControls();
}

/**
 * Scrolls the camera while the general scroll button is held.
 * The greater the distance between the cursor initial position and the current
 * position, the faster the scroll movement will be.
 */
function scrollCameraGeneralControls() {
    const camera = state.camera;
    const scrollControl = state.controls.scroll.general;
    const mousePosition = state.input.mouse.position.window;

    if (justPressed(scrollControl)) {
        camera.scrollPosition.x = mousePosition.x;
        camera.scrollPosition.y = mousePosition.y;
    } else if (scrollControl.current) {
        camera.center.x += mousePosition.x - camera.scrollPosition.x;
        camera.center.y += mousePosition.y - camera.scrollPosition.y;
    }
}

/**
 * Scrolls the camera using directional controls.
 */
function scrollCameraDirectionalControls() {
    const camera = state.camera;
    const controls = state.controls.scroll.individual;

    if (controls.up.current) {
        camera.center.y -= DIRECTIONAL_SCROLL_SPEED;
    } else if (controls.down.current) {
        camera.center.y += DIRECTIONAL_SCROLL_SPEED;
    }

    if (controls.left.current) {
        camera.center.x -= DIRECTIONAL_SCROLL_SPEED;
    } else if (controls.right.current) {
        camera.center.x += DIRECTIONAL_SCROLL_SPEED;
    }
}

/**
 * Returns the absolute difference between the current scale value and its destination.
 */
function getScaleDifference() {
    return Math.abs(state.camera.scale.destination - state.camera.scale.value);
}

export {
    updateCameraScaledSize,
    centerCameraOnMap,
    scaleCamera,
    scrollCamera,
};
