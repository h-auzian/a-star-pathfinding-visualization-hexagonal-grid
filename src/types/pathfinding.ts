import PriorityQueue from "../misc/priority-queue";
import { AccumulatedTime } from "./misc";
import { Tile } from "./tiles";

/**
 * Available algorithms for pathfinding calculation.
 */
enum PathfindingAlgorithm {
  Dijkstra = "Dijkstra's",
  Greedy = "Greedy",
  AStar = "A-Star",
}

/**
 * Available styles for pathfinding calculation.
 */
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
  nextTile: Tile | null;
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

/**
 * Utility function to initialize the pathfinding data.
 */
function createPathfindingData(): PathfindingData {
  return {
    algorithm: PathfindingAlgorithm.AStar,
    style: PathfindingStyle.Instant,
    startingTile: null,
    destinationTile: null,
    pending: false,
    destinationReached: false,
    finished: false,
    candidates: new PriorityQueue<Tile>(),
    checkedTiles: [],
    currentTile: null,
    nextTile: null,
    foundPath: [],
    timeSinceLastStep: {
      requiredTime: 0.015,
      currentTime: 0,
    },
  };
}

export {
  PathfindingAlgorithm,
  PathfindingStyle,
  PathfindingData,
  PathNode,
  createPathfindingData,
}
