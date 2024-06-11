/**
 * Available visualization themes.
 */
enum Theme {
  Default = "Default",
  OldSchool = "Old School",
  Spooky = "Spooky",
  Explorer = "Explorer",
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
  blanket?: string;
  hands?: string;
  feet?: string;
  mouth?: string;
  topHat?: string;
  moustache?: string;
  monocle?: string;
  sailorCap?: string;
  caravel?: string;
}

export {
  Theme,
  TileThemeColors,
  CharacterThemeColors,
}
