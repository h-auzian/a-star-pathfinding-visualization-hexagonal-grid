import { GlobalState } from "../state/global";
import { CharacterThemeColors, Theme, TileThemeColors } from "../types/themes";

const TILE_COLORS: { [key: string]: TileThemeColors } = {
  "Default": {
    passable: "#0F0",
    impassable: "#F00",
    current: "#0A8",
    next: "#AFD",
    candidate: "#FFF",
    checked: "#CCC",
    path: "#2BF",
    outline: "#000",
    text: "#000",
  },
  "Old School": {
    passable: "#EADBCB",
    impassable: "#CDA882",
    current: "#F7CB9D",
    next: "#FCE0C2",
    candidate: "#FBF7F3",
    checked: "#DAD3CB",
    path: "#FFBF7B",
    outline: "#563A1D",
    text: "#563A1D",
  },
  "Spooky": {
    passable: "#100",
    impassable: "#303",
    current: "#450",
    next: "#123",
    candidate: "#204",
    checked: "#002",
    path: "#042",
    outline: "#707",
    text: "#FFF",
  },
  "Explorer": {
    passable: "#00F",
    impassable: "#0C0",
    current: "#FA5",
    next: "#FDA",
    candidate: "#DDF",
    checked: "#AAD",
    path: "#F85",
    outline: "#000",
    text: "#000",
  },
};

const CHARACTER_COLORS: { [key: string]: CharacterThemeColors } = {
  "Default": {
    outline: "#000",
    body: "#FF0",
    feet: "#FF0",
  },
  "Old School": {
    outline: "#563A1D",
    body: "#FFD6AD",
    feet: "#563A10",
    topHat: "#563A10",
    moustache: "#563A10",
    monocle: "#563A10",
  },
  "Spooky": {
    outline: "#000",
    blanket: "#FFF",
    hands: "#FFF",
    mouth: "#000",
  },
  "Explorer": {
    outline: "#000",
    body: "#FD0",
    sailorCap: "#FFF",
    caravel: "#D50",
  },
};

/**
 * Returns the tile colors for an specific theme.
 */
function getTileThemeColors(theme: Theme): TileThemeColors {
  return TILE_COLORS[theme];
}

/**
 * Returns the character colors for an specific theme.
 */
function getCharacterThemeColors(theme: Theme): CharacterThemeColors {
  return CHARACTER_COLORS[theme];
}

/**
 * Cycles through the available rendering themes.
 */
function changeRenderingTheme(state: GlobalState) {
  if (state.theme === Theme.Default) {
    state.theme = Theme.OldSchool;
  } else if (state.theme === Theme.OldSchool) {
    state.theme = Theme.Spooky;
  } else if (state.theme === Theme.Spooky) {
    state.theme = Theme.Explorer;
  } else if (state.theme === Theme.Explorer) {
    state.theme = Theme.Default;
  }
}

export {
  getTileThemeColors,
  getCharacterThemeColors,
  changeRenderingTheme,
}
