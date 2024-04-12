import state from "./state.js";

function update() {
    state.camera.x += 0.1;
    state.camera.y += 0.1;
}

export default update;
