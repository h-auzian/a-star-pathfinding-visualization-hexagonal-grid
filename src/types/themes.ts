/**
 * Available visualization themes.
 */
enum Theme {
  Default = "Default",
  OldSchool = "Old School",
  Spooky = "Spooky",
  Explorer = "Explorer",
  Heck = "Heck",
}

/**
 * Tile colors for an specific theme.
 */
type TileThemeColors = {
  passable: string;
  impassable: string;
  current: string;
  next: string;
  candidate: string;
  checked: string;
  path: string;
  outline: string;
  text: string;
};

/**
 * Character colors for an specific theme.
 */
type CharacterThemeColors = {
  outline: string;
  body?: string;
  feet?: string;
  topHat?: string;
  moustache?: string;
  monocle?: string;
  blanket?: string;
  hands?: string;
  mouth?: string;
  sailorCap?: string;
  caravel?: string;
  horns?: string;
  tail?: string;
}

export {
  Theme,
  TileThemeColors,
  CharacterThemeColors,
}
