import { Tile } from "./tiles";

/**
 * Indicates a tile type for the sake of rendering, which is not necessarily
 * the same as in the internal logic.
 */
enum RenderingTileType {
  current,
  next,
  path,
  candidate,
  checked,
  impassable,
  passable,
}

/**
 * Convenience type to hold the state values that are relevant for rendering,
 * to avoid passing each value separatedly to the rendering functions.
 */
type RenderingStateValues = {
  hoveredTile: Tile | null;
  currentTile: Tile | null;
  nextTile: Tile | null;
  startingTile: Tile | null;
  cameraScale: number;
  assignedCharacterPath: boolean;
};

export {
  RenderingTileType,
  RenderingStateValues,
}
