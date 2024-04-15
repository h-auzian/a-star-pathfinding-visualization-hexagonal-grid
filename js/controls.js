import state from "./state.js";

/**
 * Returns if the control was just pressed or changed this frame.
 */
function justPressed(control) {
    return control.previous == 0 && control.current != 0;
}

/**
 * Sets all controls. This has to be called every frame.
 */
function updateControls() {
    updateControl(state.controls.scroll, state.mouse.buttons.middle);
    updateControl(state.controls.scale, state.mouse.wheel.y);
    resetInputs();
}

/**
 * Resets inputs that are not normally reset via events.
 */
function resetInputs() {
    state.mouse.wheel.y = 0;
}

/**
 * Sets a control value for the previous and current frame.
 */
function updateControl(control, raw) {
    control.previous = control.current;
    control.current = raw;
}

export {
    justPressed,
    updateControls,
};
