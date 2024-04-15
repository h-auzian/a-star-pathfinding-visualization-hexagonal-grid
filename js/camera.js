import { justPressed } from "./controls.js";
import state from "./state.js";

/**
 * Scrolls the camera while the scroll button is held.
 * The greater the distance between the cursor initial position and the current
 * position, the faster the scroll movement will be.
 */
function scrollCamera() {
    const camera = state.camera;
    const scrollControl = state.controls.scroll;
    const mousePosition = state.mouse.position.window;

    if (justPressed(scrollControl)) {
        camera.scrollPosition.x = mousePosition.x;
        camera.scrollPosition.y = mousePosition.y;
    } else if (scrollControl.current) {
        camera.center.x += mousePosition.x - camera.scrollPosition.x;
        camera.center.y += mousePosition.y - camera.scrollPosition.y;
    }
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

export {
    scrollCamera,
    centerCameraOnMap,
};
