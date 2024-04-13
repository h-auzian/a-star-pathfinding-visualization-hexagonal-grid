import state from "./state.js";

function centerCameraOnMap() {
    const tileX = Math.floor(state.map.width / 2);
    const tileY = Math.floor(state.map.height / 2);

    const tile = state.map.tiles[tileX][tileY];
    state.camera.x = tile.center.x;
    state.camera.y = tile.center.y;
}

export { centerCameraOnMap };
