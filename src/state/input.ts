import { Point } from "../misc/types";

type InputState = {
  mouse: {
    position: Point;
    buttons: {
      left: boolean;
      middle: boolean;
    };
    wheel: {
      y: number;
    };
  };
  keyboard: {
    buttons: {
      w: boolean;
      a: boolean;
      s: boolean;
      d: boolean;
    }
  };
};

function createInputState(): InputState {
  return {
    mouse: {
      position: {
        x: 0,
        y: 0,
      },
      buttons: {
        left: false,
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
