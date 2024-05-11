import {
  HEXAGON_INNER_HORIZONTAL_DISTANCE,
  HEXAGON_VERTICAL_DISTANCE,
  getHexagonPoints,
} from "../logic/hexagon";

import { getVisibleTiles } from "../logic/map";
import { Tile } from "../misc/types";
import { CameraState } from "../state/camera";
import { MapState } from "../state/map";

const FONT_SMALL = "14px helvetica";
const FONT_BIG = "24px helvetica";
const FONT_COLOR = "#000";
const FONT_MARGIN = 5;
const FONT_SMALL_SCALE_LIMIT = 0.75;
const FONT_BIG_SCALE_LIMIT = 0.35;

const HEXAGON_OUTLINE_WIDTH = 5;
const HEXAGON_OUTLINE_COLOR = "#000";
const HEXAGON_TYPE_FILL_COLORS = {
  "passable": "#0F0",
  "impassable": "#F00",
  "hover": "#FF0",
  "frontier": "#FFF",
  "path": "#0AF",
};

/**
 * Renders the visible tiles of the hexagonal map.
 */
function renderMap(
  context: CanvasRenderingContext2D,
  mapState: MapState,
  cameraState: CameraState,
): void {
  const visibleTiles = getVisibleTiles(mapState, cameraState.viewport);
  for (let x = visibleTiles.left; x <= visibleTiles.right; x++) {
    const column = mapState.tiles[x];
    for (let y = visibleTiles.top; y <= visibleTiles.bottom; y++) {
      renderTile(context, column[y], mapState, cameraState);
    }
  }
}

/**
 * Renders a single hexagonal tile.
 */
function renderTile(
  context: CanvasRenderingContext2D,
  tile: Tile,
  mapState: MapState,
  cameraState: CameraState,
): void {
  context.lineWidth = HEXAGON_OUTLINE_WIDTH;
  context.strokeStyle = HEXAGON_OUTLINE_COLOR;

  let fillStyle;
  if (Object.is(tile, mapState.tileUnderCursor.current)) {
    fillStyle = HEXAGON_TYPE_FILL_COLORS["hover"];
  } else if (tile.path.used) {
    fillStyle = HEXAGON_TYPE_FILL_COLORS["path"];
  } else if (tile.path.checked) {
    fillStyle = HEXAGON_TYPE_FILL_COLORS["frontier"];
  } else {
    fillStyle = HEXAGON_TYPE_FILL_COLORS[tile.type];
  }
  context.fillStyle = fillStyle;

  const points = getHexagonPoints(tile.center);
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    context.lineTo(point.x, point.y);
  }

  context.closePath();
  context.fill();
  context.stroke();

  if (tile.path.checked) {
    context.fillStyle = FONT_COLOR;

    if (cameraState.scale.value > FONT_SMALL_SCALE_LIMIT) {
      context.font = FONT_SMALL;
      context.textAlign = "center";
      context.textBaseline = "bottom";
      context.fillText(
        `${tile.index.x}x${tile.index.y}`,
        tile.center.x,
        tile.center.y + HEXAGON_VERTICAL_DISTANCE - FONT_MARGIN,
      );

      context.textAlign = "left";
      context.textBaseline = "top";
      context.fillText(
        `${tile.path.cost}`,
        tile.center.x - HEXAGON_INNER_HORIZONTAL_DISTANCE + FONT_MARGIN,
        tile.center.y - HEXAGON_VERTICAL_DISTANCE + FONT_MARGIN,
      );

      context.textAlign = "right";
      context.fillText(
        `${tile.path.heuristic}`,
        tile.center.x + HEXAGON_INNER_HORIZONTAL_DISTANCE - FONT_MARGIN,
        tile.center.y - HEXAGON_VERTICAL_DISTANCE + FONT_MARGIN,
      );
    }

    if (cameraState.scale.value > FONT_BIG_SCALE_LIMIT) {
      context.font = FONT_BIG;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        `${tile.path.heuristic + tile.path.cost}`,
        tile.center.x,
        tile.center.y,
      );
    }
  }
}

export {
  renderMap,
}
