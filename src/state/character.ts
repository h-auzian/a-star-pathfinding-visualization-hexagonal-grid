import { Point, Rectangle } from "../misc/types";

type CharacterState = {
  position: Point;
  boundingBox: Rectangle;
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
  };
}

export {
  CharacterState,
  createCharacterState,
}
