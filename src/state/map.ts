import PriorityQueue from "../misc/priority-queue";
import { FrameValues } from "../types/misc";
import { PathfindingAlgorithm, PathfindingData } from "../types/pathfinding";
import { Rectangle, Size } from "../types/primitives";
import { Tile } from "../types/tiles";

type MapState = {
  dimensions: Size;
  tiles: Tile[][];
  tileUnderCursor: FrameValues<Tile | null>;
  pathfinding: {
    startingTile: FrameValues<Tile | null>;
    algorithm: PathfindingAlgorithm;
    data: PathfindingData;
  };
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
    tiles: Array() as Tile[][],
    tileUnderCursor: {
      previous: null,
      current: null,
    },
    pathfinding: {
      startingTile: {
        previous: null,
        current: null,
      },
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
