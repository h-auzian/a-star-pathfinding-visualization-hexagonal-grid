import { Point } from "../misc/types";

type InputState = {
  mouse: {
    position: Point,
    buttons: {
      middle: boolean,
    },
    wheel: {
      y: number,
    },
  },
  keyboard: {
    buttons: {
      w: boolean,
      a: boolean,
      s: boolean,
      d: boolean,
    }
  },
};

function createInputState(): InputState {
  return {
    mouse: {
      position: {
        x: 0,
        y: 0,
      },
      buttons: {
        middle: false,
      },
      wheel: {
        y: 0,
      },
    },
    keyboard: {
      buttons: {
        w: false,
        a: false,
        s: false,
        d: false,
      },
    },
  };
}

export {
  InputState,
  createInputState,
}
