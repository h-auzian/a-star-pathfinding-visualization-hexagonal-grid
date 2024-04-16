import state from "../references/state.js";

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
    const controls = state.controls;
    const mouse = state.input.mouse;
    const keyboard = state.input.keyboard;

    updateControl(controls.scale, mouse.wheel.y);
    updateControl(controls.scroll.general, mouse.buttons.middle);
    updateControl(controls.scroll.individual.up, keyboard.buttons.w);
    updateControl(controls.scroll.individual.left, keyboard.buttons.a);
    updateControl(controls.scroll.individual.down, keyboard.buttons.s);
    updateControl(controls.scroll.individual.right, keyboard.buttons.d);

    resetInputs();
}

/**
 * Resets inputs that are not normally reset via events.
 */
function resetInputs() {
    state.input.mouse.wheel.y = 0;
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
