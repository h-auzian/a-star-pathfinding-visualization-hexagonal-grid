import state from "../references/state.js";
import { justPressed } from "./controls.js";

const SCALE_SPEED = 0.05;
const SCALE_MULTIPLIER = 2;
const SCALE_LOWER_LIMIT = Math.pow(1/SCALE_MULTIPLIER, 3);
const SCALE_UPPER_LIMIT = Math.pow(SCALE_MULTIPLIER, 3);
const GENERAL_SCROLL_SPEED = 0.5;
const DIRECTIONAL_SCROLL_SPEED = 15;

/**
 * Positions the camera on the central tile (or closest to it).
 */
function centerCameraOnMap() {
    const tileX = Math.floor(state.map.width / 2);
    const tileY = Math.floor(state.map.height / 2);

    const tile = state.map.tiles[tileX][tileY];
    setCameraCenter(tile.center.x, tile.center.y);
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
        const speed = GENERAL_SCROLL_SPEED / camera.scale.value;
        const newX = camera.center.x + (mousePosition.x - camera.scrollPosition.x) * speed;
        const newY = camera.center.y + (mousePosition.y - camera.scrollPosition.y) * speed;
        setCameraCenter(newX, newY);
    }
}

/**
 * Scrolls the camera using directional controls.
 */
function scrollCameraDirectionalControls() {
    const camera = state.camera;
    const controls = state.controls.scroll.individual;
    const speed = DIRECTIONAL_SCROLL_SPEED / camera.scale.value;

    let newX = camera.center.x;
    let newY = camera.center.y;

    if (controls.left.current) {
        newX -= speed;
    } else if (controls.right.current) {
        newX += speed;
    }

    if (controls.up.current) {
        newY -= speed;
    } else if (controls.down.current) {
        newY += speed;
    }

    setCameraCenter(newX, newY);
}

/**
 * Sets the camera center position and updates dependant values.
 */
function setCameraCenter(x, y) {
    if (x != state.camera.center.x || y != state.camera.center.y) {
        state.camera.center.x = x;
        state.camera.center.y = y;
        updateCameraScaledRectangle();
    }
}

/**
 * Sets the camera scale value and updates dependant values.
 */
function setCameraScale(scale) {
    if (scale != state.camera.scale.value) {
        state.camera.scale.value = scale;
        updateCameraScaledSize();
    }
}

/**
 * Sets the camera raw size and updates dependant values.
 */
function setCameraRawSize(width, height) {
    const size = state.camera.size.raw;
    if (width != size.width || height != size.height) {
        size.width = width;
        size.height = height;
        updateCameraScaledSize();
    }
}

/**
 * Updates the camera scaled size.
 */
function updateCameraScaledSize() {
    const camera = state.camera;
    camera.size.scaled.width = camera.size.raw.width / camera.scale.value;
    camera.size.scaled.height = camera.size.raw.height / camera.scale.value;
    updateCameraScaledRectangle();
}

/**
 * Updates the camera scaled rectangle coordinates.
 */
function updateCameraScaledRectangle() {
    const camera = state.camera;
    camera.rectangle.scaled.left = camera.center.x - camera.size.scaled.width / 2;
    camera.rectangle.scaled.right = camera.center.x + camera.size.scaled.width / 2,
    camera.rectangle.scaled.top = camera.center.y - camera.size.scaled.height / 2;
    camera.rectangle.scaled.bottom = camera.center.y + camera.size.scaled.height / 2;
}

/**
 * Returns the absolute difference between the current scale value and its destination.
 */
function getScaleDifference() {
    return Math.abs(state.camera.scale.destination - state.camera.scale.value);
}

export {
    centerCameraOnMap,
    scaleCamera,
    scrollCamera,
    setCameraCenter,
    setCameraScale,
    setCameraRawSize,
};
