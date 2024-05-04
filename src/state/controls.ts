import { Control, Point } from "../misc/types";

type ControlState = {
  cursor: {
    window: Point;
    camera: Point;
  };
  scroll: {
    general: Control;
    directional: {
      up: Control;
      left: Control;
      down: Control;
      right: Control;
    };
  };
  scale: Control;
};

function createControlState(): ControlState {
  return {
    cursor: {
      window: {
        x: 0,
        y: 0,
      },
      camera: {
        x: 0,
        y: 0,
      },
    },
    scroll: {
      general: {
        previous: false,
        current: false,
      },
      directional: {
        up: {
          previous: false,
          current: false,
        },
        left: {
          previous: false,
          current: false,
        },
        down: {
          previous: false,
          current: false,
        },
        right: {
          previous: false,
          current: false,
        },
      },
    },
    scale: {
      previous: 0,
      current: 0,
    },
  };
}

export {
  ControlState,
  createControlState,
}
