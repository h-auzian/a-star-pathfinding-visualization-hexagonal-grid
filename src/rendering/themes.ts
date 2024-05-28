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
    hat: "#563A10",
    moustache: "#563A10",
    monocle: "#563A10",
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
    state.theme = Theme.Default;
  }
}

export {
  getTileThemeColors,
  getCharacterThemeColors,
  changeRenderingTheme,
}
