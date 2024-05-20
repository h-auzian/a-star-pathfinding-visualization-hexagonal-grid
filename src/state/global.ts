import { CameraState, createCameraState } from "./camera"
import { CharacterState, createCharacterState } from "./character";
import { ControlState, createControlState } from "./controls"
import { InputState, createInputState } from "./input"
import { MapState, createMapState } from "./map"

/**
 * Convenience container to hold all the different states in the application.
 */
type GlobalState = {
  camera: CameraState;
  map: MapState;
  character: CharacterState,
  input: InputState;
  control: ControlState;
};

function createGlobalState(): GlobalState {
  return {
    camera: createCameraState(),
    map: createMapState(),
    character: createCharacterState(),
    input: createInputState(),
    control: createControlState(),
  };
}

export {
  GlobalState,
  createGlobalState,
}
