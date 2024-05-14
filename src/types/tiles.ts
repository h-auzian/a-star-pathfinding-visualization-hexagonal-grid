import { PathNode } from "./pathfinding";
import { Point } from "./primitives";

enum TileType {
  Passable = "passable",
  Impassable = "impassable",
}

/**
 * Holds the data for a single map tile, including possible pathfinding
 * information.
 */
type Tile = {
  index: Point;
  center: Point;
  type: TileType;
  path: PathNode<Tile>;
};

export {
  TileType,
  Tile,
}
