import { Tile } from "./tiles";

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
  RenderingStateValues,
}
