import { DOMElements } from "./dom";
import {
  allowPathfindingOptionChanges,
  changePathfindingAlgorithm,
  changePathfindingStyle,
} from "./logic/pathfinding";
import { GlobalState } from "./state/global";

const HIDDEN_CLASS = "hidden";
const ENABLED_CLASS = "enabled";
const DISABLED_CLASS = "disabled";
const VALUE_CLASS = "ui-value";

/**
 * Sets up the UI button events on click, and also updates the current values.
 */
function initializeUIEvents(domElements: DOMElements, state: GlobalState): void {
  const options = domElements.options;
  const buttons = options.buttons;

  options.toggle.addEventListener("click", function() {
    options.container.classList.toggle(HIDDEN_CLASS);
  });

  buttons.algorithm.addEventListener("click", function() {
    if (allowPathfindingOptionChanges(state.map.pathfinding, state.character)) {
      changePathfindingAlgorithm(state.map.pathfinding);
      updateButtonValue(this, state.map.pathfinding.algorithm);
    }
  });

  buttons.calculation.addEventListener("click", function() {
    if (allowPathfindingOptionChanges(state.map.pathfinding, state.character)) {
      changePathfindingStyle(state.map.pathfinding);
      updateButtonValue(this, state.map.pathfinding.style);
    }
  });

  updateButtonValue(buttons.algorithm, state.map.pathfinding.algorithm);
  updateButtonValue(buttons.calculation, state.map.pathfinding.style);
}

/**
 * Updates the value of a UI button with its string option.
 */
function updateButtonValue(element: HTMLElement, value: string): void {
  const uiValues = element.getElementsByClassName(VALUE_CLASS);
  if (uiValues.length > 0) {
    uiValues[0].innerHTML = value;
  }
}

/**
 * Update necessary UI elements each frame.
 */
function updateUI(domElements: DOMElements, state: GlobalState): void {
  const buttons = domElements.options.buttons;
  const enableOptions = allowPathfindingOptionChanges(
    state.map.pathfinding,
    state.character,
  );

  toggleEnabled(buttons.algorithm, enableOptions);
  toggleEnabled(buttons.calculation, enableOptions);
}

/**
 * Toggles the CSS classes to show a UI element as enabled or disabled.
 */
function toggleEnabled(element: HTMLElement, enabled: boolean): void {
  if (enabled) {
    element.classList.remove(DISABLED_CLASS);
    element.classList.add(ENABLED_CLASS);
  } else {
    element.classList.remove(ENABLED_CLASS);
    element.classList.add(DISABLED_CLASS);
  }
}

export {
  initializeUIEvents,
  updateUI,
}
