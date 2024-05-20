import { Point, Rectangle, Size } from "../types/primitives";

/**
 * Holds the camera state to control the rendering.
 */
type CameraState = {
  size: {
    raw: Size;
    scaled: Size;
  };
  center: Point;
  viewport: Rectangle;
  scrollPosition: Point;
  scale: {
    value: number;
    destination: number;
    speed: number;
  };
};

function createCameraState(): CameraState {
  return {
    size: {
      raw: {
        width: 0,
        height: 0,
      },
      scaled: {
        width: 0,
        height: 0,
      },
    },
    center: {
      x: 0,
      y: 0,
    },
    viewport: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    scrollPosition: {
      x: 0,
      y: 0,
    },
    scale: {
      value: 1,
      destination: 1,
      speed: 0,
    },
  };
}

export {
  CameraState,
  createCameraState,
}
