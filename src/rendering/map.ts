import dom from "../global/dom";
import state from "../global/state";
import { getHexagonPoints } from "../logic/hexagon";
import { getVisibleTiles } from "../logic/map";
import { Tile } from "../misc/types";

const HEXAGON_OUTLINE_WIDTH = 5;
const HEXAGON_OUTLINE_COLOR = "#000";
const HEXAGON_TYPE_FILL_COLORS = {
  "passable": "#0F0",
  "impassable": "#F00",
  "hover": "#FF0",
};

/**
 * Renders the visible tiles of the hexagonal map.
 */
function renderMap(): void {
  const visibleTiles = getVisibleTiles();
  for (let x = visibleTiles.left; x <= visibleTiles.right; x++) {
    const column = state.map.tiles[x];
    for (let y = visibleTiles.top; y <= visibleTiles.bottom; y++) {
      const tile = column[y];
      renderTile(tile);
    }
  }
}

/**
 * Renders a single hexagonal tile.
 */
function renderTile(tile: Tile): void {
  dom.context.lineWidth = HEXAGON_OUTLINE_WIDTH;
  dom.context.strokeStyle = HEXAGON_OUTLINE_COLOR;

  if (Object.is(tile, state.map.tileUnderCursor)) {
    dom.context.fillStyle = HEXAGON_TYPE_FILL_COLORS["hover"];
  } else {
    dom.context.fillStyle = HEXAGON_TYPE_FILL_COLORS[tile.type];
  }

  const points = getHexagonPoints(tile.center);
  dom.context.beginPath();
  dom.context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    dom.context.lineTo(point.x, point.y);
  }

  dom.context.closePath();
  dom.context.fill();
  dom.context.stroke();
}

export {
  renderMap,
}
