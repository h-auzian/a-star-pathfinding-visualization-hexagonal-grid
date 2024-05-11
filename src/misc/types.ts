import PriorityQueue from "./priority-queue";

type Size = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type Rectangle = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type Control = {
  previous: boolean | number;
  current: boolean | number;
};

enum TileType {
  Passable = "passable",
  Impassable = "impassable",
}

type Tile = {
  index: Point;
  center: Point;
  type: TileType;
  path: PathNode<Tile>;
};

type PathNode<Type> = {
  checked: boolean;
  used: boolean;
  cost: number;
  heuristic: number;
  parent: Type | null;
};

type PathfindingData = {
  candidates: PriorityQueue<Tile>;
  checkedTiles: Tile[];
  foundPath: Tile[];
};

export {
  Size,
  Point,
  Rectangle,
  Control,
  TileType,
  Tile,
  PathNode,
  PathfindingData,
}
