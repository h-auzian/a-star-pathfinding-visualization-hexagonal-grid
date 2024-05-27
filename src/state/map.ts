import PriorityQueue from "../misc/priority-queue";
import { ObstacleFrequency } from "../types/misc";
import {
  PathfindingAlgorithm,
  PathfindingData,
  PathfindingStyle,
} from "../types/pathfinding";
import { Rectangle, Size } from "../types/primitives";
import { Tile } from "../types/tiles";

/**
 * Holds the representation of the hexagonal map.
 */
type MapState = {
  dimensions: Size;
  obstacleFrequency: ObstacleFrequency,
  tiles: Tile[][];
  tileUnderCursor: Tile | null;
  pathfinding: PathfindingData;
  boundingBox: Rectangle;
  boundaries: Rectangle;
    debug: {
    visibleTiles: boolean;
    boundaries: boolean;
  };
};

function createMapState(): MapState {
  return {
    dimensions: {
      width: 100,
      height: 50,
    },
    obstacleFrequency: ObstacleFrequency.Medium,
    tiles: Array() as Tile[][],
    tileUnderCursor: null,
    pathfinding: createPathfindingData(),
    boundingBox: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    boundaries: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    debug: {
      visibleTiles: false,
      boundaries: false,
    },
  };
}

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
  MapState,
  createMapState,
  createPathfindingData,
}
