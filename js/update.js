import state from "./state.js";

function update() {
    state.camera.x += 0.1;
    state.camera.y += 0.1;

    if (state.scale.value > 3) {
        state.scale.direction = -1;
    } else if (state.scale.value < 0.3) {
        state.scale.direction = 1;
    }
    state.scale.value += 0.01 * state.scale.direction;
}

export default update;
