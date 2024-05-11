import { PathfindingAlgorithm } from "../logic/pathfinding";
import PriorityQueue from "../misc/priority-queue";
import { PathfindingData, Rectangle, Size, Tile } from "../misc/types";

type MapState = {
  dimensions: Size;
  tiles: Tile[][];
  tileUnderCursor: {
    previous: Tile | null;
    current: Tile | null;
  };
  boundingBox: Rectangle;
  boundaries: Rectangle;
  pathfinding: {
    algorithm: PathfindingAlgorithm;
    data: PathfindingData;
  };
  debug: {
    visibleTiles: boolean;
    boundaries: boolean;
  };
};

function createMapState(): MapState {
  return {
    dimensions: {
      width: 30,
      height: 20,
    },
    tiles: Array() as Tile[][],
    tileUnderCursor: {
      current: null,
      previous: null,
    },
    pathfinding: {
      algorithm: PathfindingAlgorithm.AStar,
      data: {
        candidates: new PriorityQueue<Tile>(),
        checkedTiles: [],
        foundPath: [],
      },
    },
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

export {
  MapState,
  createMapState,
}
