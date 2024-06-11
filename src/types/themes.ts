/**
 * Available visualization themes.
 */
enum Theme {
  Default = "Default",
  OldSchool = "Old School",
  Spooky = "Spooky",
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
  hat?: string;
  moustache?: string;
  monocle?: string;
}

export {
  Theme,
  TileThemeColors,
  CharacterThemeColors,
}
