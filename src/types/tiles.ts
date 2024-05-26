import { PathNode } from "./pathfinding";
import { Point } from "./primitives";

/**
 * Holds the data for a single map tile, including possible pathfinding
 * information.
 */
type Tile = {
  index: Point;
  center: Point;
  impassable: boolean;
  path: PathNode<Tile>;
};

export {
  Tile,
}
