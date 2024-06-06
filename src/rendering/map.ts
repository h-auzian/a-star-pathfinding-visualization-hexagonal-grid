import { HEXAGON_VERTICAL_DISTANCE, getHexagonPoints } from "../logic/hexagon";
import { getVisibleTiles } from "../logic/map";
import { getAngleBetweenPoints, rotatePoints } from "../misc/math";
import { GlobalState } from "../state/global";
import { Point } from "../types/primitives";
import { RenderingStateValues } from "../types/rendering";
import { TileThemeColors } from "../types/themes";
import { Tile } from "../types/tiles";
import { getTileThemeColors } from "./themes";

const FONT_SMALL = "12px helvetica";
const FONT_BIG = "22px helvetica";
const FONT_UPPER_PADDING = 10;
const FONT_LOWER_PADDING = 12;
const FONT_LOWER_EDGE_PADDING = HEXAGON_VERTICAL_DISTANCE - 1;
const FONT_SMALL_SCALE_LIMIT = 0.75;
const FONT_BIG_SCALE_LIMIT = 0.35;

const ARROW_SCALE_LIMIT = FONT_BIG_SCALE_LIMIT;
const ARROW_NORMAL_WIDTH = 1;
const ARROW_ALTERNATIVE_WIDTH = 5;
const ARROW_POINTS: Point[] = [
  { x: HEXAGON_VERTICAL_DISTANCE, y: 0 },
  { x: HEXAGON_VERTICAL_DISTANCE - 10, y: -4 },
  { x: HEXAGON_VERTICAL_DISTANCE - 10, y: 4 },
  { x: HEXAGON_VERTICAL_DISTANCE - 10, y: 0 },
  { x: HEXAGON_VERTICAL_DISTANCE - 15, y: 0 },
];

const TILE_OUTLINE_WIDTHS: { [key: string]: number } = {
  "passable": 1,
  "impassable": 5,
};

/**
 * Renders the visible tiles of the hexagonal map.
 *
 * The tiles are rendered in multiple passes, first rendering all fill colors,
 * then all outlines, and so on, to avoid a tile's fill color covering the
 * outline of an adjacent tile, and also for performance sake.
 */
function renderMap(context: CanvasRenderingContext2D, state: GlobalState): void {
  const colors = getTileThemeColors(state.theme);
  const tiles = getVisibleTiles(state.map, state.camera.viewport);
  const stateValues: RenderingStateValues = {
    hoveredTile: state.map.tileUnderCursor,
    currentTile: state.map.pathfinding.currentTile,
    nextTile: state.map.pathfinding.nextTile,
    startingTile: state.map.pathfinding.startingTile,
    cameraScale: state.camera.scale.value,
    assignedCharacterPath: state.character.assignedPath.hasPath,
  };

  renderTilesFillColor(context, colors, tiles, stateValues, colors.current);
  renderTilesFillColor(context, colors, tiles, stateValues, colors.next);
  renderTilesFillColor(context, colors, tiles, stateValues, colors.path);
  renderTilesFillColor(context, colors, tiles, stateValues, colors.candidate);
  renderTilesFillColor(context, colors, tiles, stateValues, colors.checked);
  renderTilesFillColor(context, colors, tiles, stateValues, colors.impassable);
  renderTilesFillColor(context, colors, tiles, stateValues, colors.passable);

  renderTilesOutline(context, colors, tiles, false);
  renderTilesOutline(context, colors, tiles, true);

  renderTilesParentIndicator(context, colors, tiles, stateValues);
  renderTilesPathfindingInfo(context, colors, tiles, stateValues);
}

/**
 * Renders in a single draw call the fill color of a group of visible tiles
 * that share the same color.
 */
function renderTilesFillColor(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tiles: Tile[],
  stateValues: RenderingStateValues,
  color: string,
): void {
  context.fillStyle = color;
  context.beginPath();

  tiles.forEach(tile => {
    let tileColor;
    if (tile === stateValues.currentTile) {
      tileColor = colors.current;
    } else if (tile === stateValues.nextTile) {
      tileColor = colors.next;
    } else if (tile === stateValues.hoveredTile || tile.path.used) {
      tileColor = colors.path;
    } else if (tile.path.candidate && !stateValues.assignedCharacterPath) {
      tileColor = colors.candidate;
    } else if (tile.path.checked && !stateValues.assignedCharacterPath) {
      tileColor = colors.checked;
    } else if (tile.impassable) {
      tileColor = colors.impassable;
    } else {
      tileColor = colors.passable;
    }

    if (tileColor !== color) {
      return;
    }

    const points = getHexagonPoints(tile.center);
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.lineTo(points[0].x, points[0].y);
  });

  context.fill();
}

/**
 * Renders in a single draw call the outline of all the visible tiles that are
 * either passable or impassable, but not both, as they have different widths.
 */
function renderTilesOutline(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tiles: Tile[],
  impassable: boolean,
): void {
  const tileType = impassable ? "impassable" : "passable";

  context.strokeStyle = colors.outline;
  context.lineWidth = TILE_OUTLINE_WIDTHS[tileType];
  context.beginPath();

  tiles.forEach(tile => {
    if (tile.impassable !== impassable) {
      return;
    }

    const points = getHexagonPoints(tile.center);
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.lineTo(points[0].x, points[0].y);
  });

  context.stroke();
}

/**
 * Renders the arrow indicator that points to each visible tile's parent for
 * the pathfinding calculation, if applicable.
 *
 * If the camera is close enough, it renders a small arrow that points to the
 * parent tile, but without leaving the current tile boundaries.
 *
 * If the camera is far, then it renders a line from each tile's center to its
 * parent's center, to better visualize the checked paths on the map as a
 * whole.
 */
function renderTilesParentIndicator(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tiles: Tile[],
  stateValues: RenderingStateValues,
): void {
  if (stateValues.assignedCharacterPath) {
    return;
  }

  const drawArrow = stateValues.cameraScale > ARROW_SCALE_LIMIT;

  context.strokeStyle = colors.outline;
  context.fillStyle = colors.outline;
  context.lineWidth = drawArrow ? ARROW_NORMAL_WIDTH : ARROW_ALTERNATIVE_WIDTH;
  context.beginPath();

  tiles.forEach(tile => {
    if (!tile.path.checked || tile.path.parent === null) {
      return;
    }

    const center = tile.center;
    const parentCenter = tile.path.parent.center;

    if (drawArrow) {
      const angle = getAngleBetweenPoints(center, parentCenter);
      const arrowPoints = rotatePoints(ARROW_POINTS, angle);

      context.moveTo(center.x + arrowPoints[0].x, center.y + arrowPoints[0].y);
      context.lineTo(center.x + arrowPoints[1].x, center.y + arrowPoints[1].y);
      context.lineTo(center.x + arrowPoints[2].x, center.y + arrowPoints[2].y);
      context.lineTo(center.x + arrowPoints[0].x, center.y + arrowPoints[0].y);

      context.moveTo(center.x + arrowPoints[3].x, center.y + arrowPoints[3].y);
      context.lineTo(center.x + arrowPoints[4].x, center.y + arrowPoints[4].y);
    } else {
      context.moveTo(center.x, center.y);
      context.lineTo(parentCenter.x, parentCenter.y);
    }
  });

  context.fill();
  context.stroke();
}

/**
 * Renders the pathfinding information for each visible tile, if applicable.
 *
 * The starting tile is a special case, as the character is on top of that tile
 * and will cover the information. In this case, only the tile index is drawn
 * at the bottom edge.
 */
function renderTilesPathfindingInfo(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tiles: Tile[],
  stateValues: RenderingStateValues,
): void {
  if (stateValues.assignedCharacterPath || stateValues.cameraScale < FONT_BIG_SCALE_LIMIT) {
    return;
  }

  context.fillStyle = colors.text;

  tiles.forEach(tile => {
    if (!tile.path.checked) {
      return;
    }

    const x = tile.center.x;
    const y = tile.center.y;

    context.textAlign = "center";

    if (tile === stateValues.startingTile) {
      if (stateValues.cameraScale > FONT_SMALL_SCALE_LIMIT) {
        context.font = FONT_SMALL;
        context.textBaseline = "bottom";
        context.fillText(`(${tile.index.x},${tile.index.y})`, x, y + FONT_LOWER_EDGE_PADDING);
      }
    } else {
      context.font = FONT_BIG;
      context.textBaseline = "middle";
      context.fillText(`${tile.path.heuristic + tile.path.cost}`, x, y);

      if (stateValues.cameraScale > FONT_SMALL_SCALE_LIMIT) {
        context.font = FONT_SMALL;
        context.textBaseline = "bottom";
        context.fillText(`${tile.path.cost}+${tile.path.heuristic}`, x, y - FONT_LOWER_PADDING);

        context.textBaseline = "top";
        context.fillText(`(${tile.index.x},${tile.index.y})`, x, y + FONT_UPPER_PADDING);
      }
    }
  });
}

export default renderMap;
