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
  previous: boolean | number,
  current: boolean | number,
};

enum TileType {
  Passable = "passable",
  Impassable = "impassable",
}

type Tile = {
  type: TileType;
  center: Point;
};

export {
  Size,
  Point,
  Rectangle,
  Control,
  TileType,
  Tile,
}
