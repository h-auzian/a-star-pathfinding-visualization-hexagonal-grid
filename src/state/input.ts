import { Point } from "../types/primitives";

/**
 * Holds the raw input without being associated to any specific action.
 */
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
    insideCanvas: boolean;
  };
  keyboard: {
    buttons: {
      q: boolean;
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
      insideCanvas: false,
    },
    keyboard: {
      buttons: {
        q: false,
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
