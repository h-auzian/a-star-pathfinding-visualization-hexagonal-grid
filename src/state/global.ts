import { CameraState, createCameraState } from "./camera"
import { ControlState, createControlState } from "./controls"
import { InputState, createInputState } from "./input"
import { MapState, createMapState } from "./map"

type GlobalState = {
  camera: CameraState,
  map: MapState,
  input: InputState,
  control: ControlState,
};

function createGlobalState(): GlobalState {
  return {
    camera: createCameraState(),
    map: createMapState(),
    input: createInputState(),
    control: createControlState(),
  };
}

export {
  GlobalState,
  createGlobalState,
}
