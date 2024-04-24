import dom from "../global/dom.js";
import state from "../global/state.js";
import { getHexagonPoints } from "../logic/hexagon.js";
import { getVisibleTiles } from "../logic/map.js";

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
function renderMap() {
  const visibleTiles = getVisibleTiles();
  for (let x = visibleTiles.x1; x <= visibleTiles.x2; x++) {
    const column = state.map.tiles[x];
    for (let y = visibleTiles.y1; y <= visibleTiles.y2; y++) {
      const tile = column[y];
      renderTile(tile);
    }
  }
}

/**
 * Renders a single hexagonal tile.
 */
function renderTile(tile) {
  dom.context.lineWidth = HEXAGON_OUTLINE_WIDTH;
  dom.context.lineStyle = HEXAGON_OUTLINE_COLOR;

  if (Object.is(tile, state.map.tileUnderCursor)) {
    dom.context.fillStyle = HEXAGON_TYPE_FILL_COLORS["hover"];
  } else {
    dom.context.fillStyle = HEXAGON_TYPE_FILL_COLORS[tile.type];
  }

  const points = getHexagonPoints(tile.center.x, tile.center.y);
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

export { renderMap };
