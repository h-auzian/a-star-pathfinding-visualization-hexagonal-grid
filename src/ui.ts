import { DOMElements } from "./dom";
import { changeObstacleFrequency, regenerateMap } from "./logic/map";
import {
  allowPathfindingOptionChanges,
  changePathfindingAlgorithm,
  changePathfindingStyle,
} from "./logic/pathfinding";
import { changeRenderingTheme } from "./rendering/themes";
import { GlobalState } from "./state/global";

const HIDDEN_CLASS = "hidden";
const ENABLED_CLASS = "enabled";
const DISABLED_CLASS = "disabled";
const VALUE_CLASS = "ui-value";

/**
 * Initializes the UI menus and buttons.
 */
function initializeUI(domElements: DOMElements, state: GlobalState): void {
  initializeExpandableMenus(domElements);
  initializeButtons(domElements, state);
}

/**
 * Initializes the button events for the expandable menus. Opening an
 * expandable menu may close other opened menus of that same row.
 */
function initializeExpandableMenus(domElements: DOMElements): void {
  domElements.info.toggle.addEventListener("click", function() {
    domElements.info.container.classList.toggle(HIDDEN_CLASS);
    domElements.explanation.container.classList.add(HIDDEN_CLASS);
  });

  domElements.explanation.toggle.addEventListener("click", function() {
    domElements.explanation.container.classList.toggle(HIDDEN_CLASS);
    domElements.info.container.classList.add(HIDDEN_CLASS);
  });

  domElements.options.toggle.addEventListener("click", function() {
    domElements.options.container.classList.toggle(HIDDEN_CLASS);
  });
}

/**
 * Initializes the button events for the options.
 */
function initializeButtons(domElements: DOMElements, state: GlobalState): void {
  const buttons = domElements.options.buttons;
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

  buttons.obstacleFrequency.addEventListener("click", function() {
    if (allowPathfindingOptionChanges(state.map.pathfinding, state.character)) {
      changeObstacleFrequency(state.map);
      regenerateMap(state.map, state.character.position);
      updateButtonValue(this, state.map.obstacleFrequency);
    }
  });

  buttons.regenerateMap.addEventListener("click", function() {
    if (allowPathfindingOptionChanges(state.map.pathfinding, state.character)) {
      regenerateMap(state.map, state.character.position);
    }
  });

  buttons.theme.addEventListener("click", function() {
    changeRenderingTheme(state);
    updateButtonValue(buttons.theme, state.theme);
  });

  updateButtonValue(buttons.algorithm, state.map.pathfinding.algorithm);
  updateButtonValue(buttons.calculation, state.map.pathfinding.style);
  updateButtonValue(buttons.obstacleFrequency, state.map.obstacleFrequency);
  updateButtonValue(buttons.theme, state.theme);
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
  toggleEnabled(buttons.obstacleFrequency, enableOptions);
  toggleEnabled(buttons.regenerateMap, enableOptions);
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
  initializeUI,
  updateUI,
}
