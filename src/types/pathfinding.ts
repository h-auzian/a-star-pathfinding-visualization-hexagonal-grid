import PriorityQueue from "../misc/priority-queue";
import { AccumulatedTime } from "./misc";
import { Tile } from "./tiles";

enum PathfindingAlgorithm {
  Dijkstra = "Dijkstra's",
  Greedy = "Greedy",
  AStar = "A-Star",
}

enum PathfindingStyle {
  Instant = "Instant",
  StepByStep = "Step by step",
}

/**
 * Holds information of a pathfinding calculation as a whole.
 */
type PathfindingData = {
  algorithm: PathfindingAlgorithm;
  style: PathfindingStyle;
  startingTile: Tile | null;
  destinationTile: Tile | null;
  pending: boolean;
  destinationReached: boolean;
  finished: boolean;
  candidates: PriorityQueue<Tile>;
  checkedTiles: Tile[];
  currentTile: Tile | null;
  foundPath: Tile[];
  timeSinceLastStep: AccumulatedTime,
};

/**
 * Holds information for a single pathfinding node.
 */
type PathNode<Type> = {
  candidate: boolean;
  checked: boolean;
  used: boolean;
  cost: number;
  heuristic: number;
  parent: Type | null;
};

export {
  PathfindingAlgorithm,
  PathfindingStyle,
  PathfindingData,
  PathNode,
}
