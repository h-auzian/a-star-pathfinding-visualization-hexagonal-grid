import { Rectangle, Size, Tile } from "../misc/types";

type MapState = {
  dimensions: Size;
  tiles: Tile[][];
  tileUnderCursor: Tile | null;
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
      width: 30,
      height: 20,
    },
    tiles: Array() as Tile[][],
    tileUnderCursor: null as Tile | null,
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
