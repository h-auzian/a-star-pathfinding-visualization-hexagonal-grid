import {
  HEXAGON_VERTICAL_DISTANCE,
  getHexagonPoints,
} from "../logic/hexagon";
import { getVisibleTiles } from "../logic/map";
import { getAngleBetweenPoints, rotatePoints } from "../misc/math";
import { CameraState } from "../state/camera";
import { CharacterState } from "../state/character";
import { MapState } from "../state/map";
import { Point } from "../types/primitives";
import { Tile } from "../types/tiles";

const HEXAGON_OUTLINE_COLOR = "#000";
const HEXAGON_OUTLINE_WIDTHS = {
  "passable": 1,
  "impassable": 5,
};
const HEXAGON_FILL_COLORS = {
  "passable": "#0F0",
  "impassable": "#F00",
  "hover": "#09D",
  "current": "#0A8",
  "candidate": "#FFF",
  "checked": "#CCC",
  "path": "#2BF",
};

const FONT_SMALL = "12px helvetica";
const FONT_BIG = "22px helvetica";
const FONT_COLOR = "#000";
const FONT_UPPER_PADDING = 10;
const FONT_LOWER_PADDING = 12;
const FONT_LOWER_EDGE_PADDING = HEXAGON_VERTICAL_DISTANCE - 1;
const FONT_SMALL_SCALE_LIMIT = 0.75;
const FONT_BIG_SCALE_LIMIT = 0.35;

const ARROW_SCALE_LIMIT = FONT_BIG_SCALE_LIMIT;
const ARROW_NORMAL_WIDTH = 1;
const ARROW_ALTERNATIVE_WIDTH = 5;
const ARROW_COLOR = "#000";
const ARROW_POINTS: Point[] = [
  { x: HEXAGON_VERTICAL_DISTANCE, y: 0 },
  { x: HEXAGON_VERTICAL_DISTANCE - 10, y: -4 },
  { x: HEXAGON_VERTICAL_DISTANCE - 10, y: 4 },
  { x: HEXAGON_VERTICAL_DISTANCE - 10, y: 0 },
  { x: HEXAGON_VERTICAL_DISTANCE - 15, y: 0 },
];

/**
 * Renders the visible tiles of the hexagonal map.
 *
 * The tiles are rendered in multiple passes, first rendering all backgrounds,
 * then all outlines, and so on, to avoid tile backgrounds covering adjacent
 * tiles outlines.
 */
function renderMap(
  context: CanvasRenderingContext2D,
  mapState: MapState,
  cameraState: CameraState,
  characterState: CharacterState,
): void {
  const tiles = getVisibleTiles(mapState, cameraState.viewport);
  const hoveredTile = mapState.tileUnderCursor;
  const currentTile = mapState.pathfinding.currentTile;
  const startingTile = mapState.pathfinding.startingTile;
  const cameraScale = cameraState.scale.value;
  const assignedCharacterPath = characterState.assignedPath.hasPath;

  tiles.forEach(tile => renderTileBackground(
    context,
    tile,
    hoveredTile,
    currentTile,
    assignedCharacterPath,
  ));

  tiles.forEach(tile => renderTileOutline(
    context,
    tile,
  ));

  tiles.forEach(tile => renderTileParentIndicator(
    context,
    tile,
    cameraScale,
    assignedCharacterPath,
  ));

  tiles.forEach(tile => renderTilePathfindingInfo(
    context,
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
  tile: Tile,
  hoveredTile: Tile | null,
  currentTile: Tile | null,
  assignedCharacterPath: boolean,
): void {
  let fillStyle;
  if (tile === currentTile) {
    fillStyle = HEXAGON_FILL_COLORS["current"];
  } else if (tile === hoveredTile) {
    fillStyle = HEXAGON_FILL_COLORS["hover"];
  } else if (tile.path.used) {
    fillStyle = HEXAGON_FILL_COLORS["path"];
  } else if (tile.path.candidate && !assignedCharacterPath) {
    fillStyle = HEXAGON_FILL_COLORS["candidate"];
  } else if (tile.path.checked && !assignedCharacterPath) {
    fillStyle = HEXAGON_FILL_COLORS["checked"];
  } else if (tile.impassable) {
    fillStyle = HEXAGON_FILL_COLORS["impassable"];
  } else {
    fillStyle = HEXAGON_FILL_COLORS["passable"];
  }
  context.fillStyle = fillStyle;

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
  tile: Tile,
): void {
  const tileType = tile.impassable ? "impassable" : "passable";
  context.lineWidth = HEXAGON_OUTLINE_WIDTHS[tileType];
  context.strokeStyle = HEXAGON_OUTLINE_COLOR;

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
  tile: Tile,
  cameraScale: number,
  assignedCharacterPath: boolean,
): void {
  if (assignedCharacterPath || !tile.path.checked || tile.path.parent === null) {
    return;
  }

  const center = tile.center;
  const parentCenter = tile.path.parent.center;

  context.strokeStyle = ARROW_COLOR;
  context.fillStyle = ARROW_COLOR;

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

  context.fillStyle = FONT_COLOR;
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

export {
  renderMap,
}
