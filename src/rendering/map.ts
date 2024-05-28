import { HEXAGON_VERTICAL_DISTANCE, getHexagonPoints } from "../logic/hexagon";
import { getVisibleTiles } from "../logic/map";
import { getAngleBetweenPoints, rotatePoints } from "../misc/math";
import { GlobalState } from "../state/global";
import { Point } from "../types/primitives";
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
 * The tiles are rendered in multiple passes, first rendering all backgrounds,
 * then all outlines, and so on, to avoid tile backgrounds covering adjacent
 * tiles outlines.
 */
function renderMap(context: CanvasRenderingContext2D, state: GlobalState): void {
  const colors = getTileThemeColors(state.theme);
  const tiles = getVisibleTiles(state.map, state.camera.viewport);
  const hoveredTile = state.map.tileUnderCursor;
  const currentTile = state.map.pathfinding.currentTile;
  const nextTile = state.map.pathfinding.nextTile;
  const startingTile = state.map.pathfinding.startingTile;
  const cameraScale = state.camera.scale.value;
  const assignedCharacterPath = state.character.assignedPath.hasPath;

  tiles.forEach(tile => renderTileBackground(
    context,
    colors,
    tile,
    hoveredTile,
    currentTile,
    nextTile,
    assignedCharacterPath,
  ));

  tiles.forEach(tile => renderTileOutline(
    context,
    colors,
    tile,
  ));

  tiles.forEach(tile => renderTileParentIndicator(
    context,
    colors,
    tile,
    cameraScale,
    assignedCharacterPath,
  ));

  tiles.forEach(tile => renderTilePathfindingInfo(
    context,
    colors,
    tile,
    startingTile,
    cameraScale,
    assignedCharacterPath,
  ));
}

/**
 * Renders a tile's background color.
 */
function renderTileBackground(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tile: Tile,
  hoveredTile: Tile | null,
  currentTile: Tile | null,
  nextTile: Tile | null,
  assignedCharacterPath: boolean,
): void {
  if (tile === currentTile) {
    context.fillStyle = colors.current;
  } else if (tile === nextTile) {
    context.fillStyle = colors.next;
  } else if (tile === hoveredTile || tile.path.used) {
    context.fillStyle = colors.path;
  } else if (tile.path.candidate && !assignedCharacterPath) {
    context.fillStyle = colors.candidate;
  } else if (tile.path.checked && !assignedCharacterPath) {
    context.fillStyle = colors.checked;
  } else if (tile.impassable) {
    context.fillStyle = colors.impassable;
  } else {
    context.fillStyle = colors.passable;
  }

  const points = getHexagonPoints(tile.center);
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }
  context.closePath();
  context.fill();
}

/**
 * Renders a tile's outline depending of the tile type.
 */
function renderTileOutline(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tile: Tile,
): void {
  const tileType = tile.impassable ? "impassable" : "passable";
  context.lineWidth = TILE_OUTLINE_WIDTHS[tileType];
  context.strokeStyle = colors.outline;

  const points = getHexagonPoints(tile.center);
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }
  context.closePath();
  context.stroke();
}

/**
 * Renders an indicator that points to a tile's parent for the pathfinding
 * calculation, if applicable.
 *
 * If the camera is close enough, it renders a small arrow that points to the
 * parent tile, but without leaving the current tile boundaries.
 *
 * If the camera is far, then it renders a line from the current tile's center
 * to its parent's center, to better visualize the checked paths on the map as
 * a whole.
 */
function renderTileParentIndicator(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tile: Tile,
  cameraScale: number,
  assignedCharacterPath: boolean,
): void {
  if (assignedCharacterPath || !tile.path.checked || tile.path.parent === null) {
    return;
  }

  const center = tile.center;
  const parentCenter = tile.path.parent.center;

  context.strokeStyle = colors.outline;
  context.fillStyle = colors.outline;

  if (cameraScale > ARROW_SCALE_LIMIT) {
    const angle = getAngleBetweenPoints(center, parentCenter);
    const arrowPoints = rotatePoints(ARROW_POINTS, angle);

    context.lineWidth = ARROW_NORMAL_WIDTH;
    context.beginPath();
    context.moveTo(center.x + arrowPoints[0].x, center.y + arrowPoints[0].y);
    context.lineTo(center.x + arrowPoints[1].x, center.y + arrowPoints[1].y);
    context.lineTo(center.x + arrowPoints[2].x, center.y + arrowPoints[2].y);
    context.closePath();
    context.fill();

    context.beginPath();
    context.moveTo(center.x + arrowPoints[3].x, center.y + arrowPoints[3].y);
    context.lineTo(center.x + arrowPoints[4].x, center.y + arrowPoints[4].y);
    context.stroke();
  } else {
    context.lineWidth = ARROW_ALTERNATIVE_WIDTH;
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.lineTo(parentCenter.x, parentCenter.y);
    context.stroke();
  }
}

/**
 * Renders a tile's pathfinding information, if applicable.
 *
 * The starting tile is a special case, as the character is on top of that tile
 * and will cover the information. In this case, only the tile index is drawn
 * at the bottom edge.
 */
function renderTilePathfindingInfo(
  context: CanvasRenderingContext2D,
  colors: TileThemeColors,
  tile: Tile,
  startingTile: Tile | null,
  cameraScale: number,
  assignedCharacterPath: boolean,
): void {
  if (assignedCharacterPath || !tile.path.checked || cameraScale < FONT_BIG_SCALE_LIMIT) {
    return;
  }
  const x = tile.center.x;
  const y = tile.center.y;

  context.fillStyle = colors.text;
  context.textAlign = "center";

  if (tile === startingTile) {
    if (cameraScale > FONT_SMALL_SCALE_LIMIT) {
      context.font = FONT_SMALL;
      context.textBaseline = "bottom";
      context.fillText(`(${tile.index.x},${tile.index.y})`, x, y + FONT_LOWER_EDGE_PADDING);
    }
  } else {
    context.font = FONT_BIG;
    context.textBaseline = "middle";
    context.fillText(`${tile.path.heuristic + tile.path.cost}`, x, y);

    if (cameraScale > FONT_SMALL_SCALE_LIMIT) {
      context.font = FONT_SMALL;
      context.textBaseline = "bottom";
      context.fillText(`${tile.path.cost}+${tile.path.heuristic}`, x, y - FONT_LOWER_PADDING);

      context.textBaseline = "top";
      context.fillText(`(${tile.index.x},${tile.index.y})`, x, y + FONT_UPPER_PADDING);
    }
  }
}

export default renderMap;
