import PriorityQueue from "../misc/priority-queue";
import { Tile } from "./tiles";

enum PathfindingAlgorithm {
  Dijkstra,
  Greedy,
  AStar,
}

/**
 * Holds information of a pathfinding calculation as a whole.
 */
type PathfindingData = {
  candidates: PriorityQueue<Tile>;
  checkedTiles: Tile[];
  foundPath: Tile[];
};

/**
 * Holds information for a single pathfinding node.
 */
type PathNode<Type> = {
  checked: boolean;
  used: boolean;
  cost: number;
  heuristic: number;
  parent: Type | null;
};

export {
  PathfindingAlgorithm,
  PathfindingData,
  PathNode,
}
