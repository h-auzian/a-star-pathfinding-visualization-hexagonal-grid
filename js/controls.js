import state from "./state.js";

/**
 * Returns if the control was just pressed this frame.
 */
function justPressed(control) {
    return !control.previous && control.current;
}

/**
 * Sets all controls. This has to be called every frame.
 */
function updateControls() {
    updateControl(state.controls.scroll, state.mouse.buttons.middle);
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
