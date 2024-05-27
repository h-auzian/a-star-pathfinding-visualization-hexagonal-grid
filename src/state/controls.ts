import { AccumulatedTime, FrameValues } from "../types/misc";
import { Point } from "../types/primitives";

/**
 * Holds the controls for specific actions in the application, which are set
 * from raw inputs each frame.
 */
type ControlState = {
  cursor: {
    window: Point;
    camera: Point;
    insideCamera: boolean;
  };
  scroll: {
    general: FrameValues<boolean>;
    directional: {
      up: FrameValues<boolean>;
      left: FrameValues<boolean>;
      down: FrameValues<boolean>;
      right: FrameValues<boolean>;
    };
  };
  scale: FrameValues<number>;
  followPath: FrameValues<boolean>;
  finishPath: FrameValues<boolean>;
  speedUpPath: AccumulatedTime;
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
      insideCamera: false,
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
    followPath: {
      previous: false,
      current: false,
    },
    finishPath: {
      previous: false,
      current: false,
    },
    speedUpPath: {
      requiredTime: 0.7,
      currentTime: 0,
    },
  };
}

export {
  ControlState,
  createControlState,
}
