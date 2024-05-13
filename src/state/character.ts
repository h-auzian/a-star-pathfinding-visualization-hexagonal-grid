import { Point, Rectangle, Tile } from "../misc/types";

type CharacterState = {
  position: Point;
  boundingBox: Rectangle;
  assignedPath: {
    hasPath: boolean;
    path: Tile[];
    currentIndex: number;
    speed: number;
  };
};

function createCharacterState(): CharacterState {
  return {
    position: {
      x: 0,
      y: 0,
    },
    boundingBox: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    assignedPath: {
      hasPath: false,
      path: [],
      currentIndex: 0,
      speed: 0,
    },
  };
}

export {
  CharacterState,
  createCharacterState,
}
