import { CHARACTER_OFFSET_Y } from "../logic/character";
import { rectanglesIntersect } from "../misc/utils";
import { GlobalState } from "../state/global";
import {
  renderCharacterBody,
  renderCharacterEyes,
  renderCharacterFeet,
} from "./character/default";
import {
  renderCharacterCaravel,
  renderCharacterSailorCap,
} from "./character/explorer";
import {
  renderCharacterMonocle,
  renderCharacterMoustache,
  renderCharacterTopHat,
} from "./character/old-school";
import {
  renderCharacterBlanket,
  renderCharacterHands,
  renderCharacterMouth,
} from "./character/spooky";
import { getCharacterThemeColors } from "./themes";

/**
 * Render the character if it's inside the viewport.
 */
function renderCharacter(
  context: CanvasRenderingContext2D,
  state: GlobalState,
): void {
  if (!rectanglesIntersect(state.character.boundingBox, state.camera.viewport)) {
    return;
  }

  const characterPosition = {
    x: state.character.position.x,
    y: state.character.position.y - CHARACTER_OFFSET_Y,
  };

  const pathData = state.map.pathfinding;
  const characterMoving = state.character.assignedPath.hasPath;
  const eyeFocus = pathData.destinationTile && (pathData.pending || characterMoving)
    ? pathData.destinationTile.center
    : state.control.cursor.camera;

  const colors = getCharacterThemeColors(state.theme);
  context.strokeStyle = colors.outline;

  renderCharacterFeet(context, colors, characterPosition);
  renderCharacterHands(context, colors, characterPosition);

  renderCharacterBody(context, colors, characterPosition);
  renderCharacterBlanket(context, colors, characterPosition);

  renderCharacterEyes(context, colors, characterPosition, eyeFocus);
  renderCharacterMouth(context, colors, characterPosition);

  renderCharacterTopHat(context, colors, characterPosition);
  renderCharacterMoustache(context, colors, characterPosition);
  renderCharacterMonocle(context, colors, characterPosition);

  renderCharacterSailorCap(context, colors, characterPosition);
  renderCharacterCaravel(context, colors, characterPosition);
}

export default renderCharacter;
