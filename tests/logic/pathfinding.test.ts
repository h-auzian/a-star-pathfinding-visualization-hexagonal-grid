import { findPath } from "../../src/logic/pathfinding";
import { createPathfindingData } from "../../src/state/map";
import { PathfindingData } from "../../src/types/pathfinding";
import { Tile } from "../../src/types/tiles";

/**
 * String representations for test hexagonal maps, which are read to create the
 * actual test tiles. The dots are normal tiles and the Xs are impassable
 * tiles.
 */
const MAP_REPRESENTATIONS: { [key: string]: string } = {
  "open": `
    .       .       .       .       .
        .       .       .       .       .
    .       .       .       .       .
        .       .       .       .       .
    .       .       .       .       .
        .       .       .       .       .
    .       .       .       .       .
        .       .       .       .       .
    .       .       .       .       .
        .       .       .       .       .
  `,

  "obstacles": `
    .       .       .       .       .
        .       .       .       X       .
    X       X       X       .       .
        X       X       X       X       .
    .       .       .       .       .
        .       .       .       X       X
    .       X       X       X       X
        X       X       X       X       X
    .       .       .       .       .
        .       .       .       .       .
  `,
};

test.each([
  // From top left corner to bottom right corner on an open map.
  ["open", [0, 0], [9, 4], [
    [0, 0],
    [1, 0],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 2],
    [6, 3],
    [7, 3],
    [8, 4],
    [9, 4],
  ]],

  // From top left corner to bottom right corner.
  ["obstacles", [0, 0], [9, 4], [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 1],
    [6, 2],
    [5, 2],
    [4, 2],
    [3, 2],
    [2, 2],
    [1, 2],
    [0, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
    [8, 4],
    [9, 4],
  ]],

  // From top of right section to bottom of right section.
  ["obstacles", [8, 0], [8, 2], [
    [8, 0],
    [8, 1],
    [8, 2],
  ]],

  // From left side to inaccesible right side.
  ["obstacles", [0, 0], [9, 0], []],

  // From right side to inaccesible left side.
  ["obstacles", [9, 0], [0, 0], []],
])("Find path on map '%s' from %s to %s", function(
  mapName,
  start,
  destination,
  expectedRoute,
) {
  const map = MAP_REPRESENTATIONS[mapName];
  const tiles = getTilesFromStringRepresentation(map);

  const data: PathfindingData = createPathfindingData();

  const startTile = tiles[start[0]][start[1]];
  const destinationTile = tiles[destination[0]][destination[1]];

  findPath(
    data,
    tiles,
    startTile,
    destinationTile,
  );

  let routeIndices: number[][] = [];
  for (let i = 0; i < data.foundPath.length; i++) {
    let tile = data.foundPath[i];
    routeIndices.push([tile.index.x, tile.index.y]);
  }

  expect(routeIndices).toStrictEqual(expectedRoute);
});

/**
 * Utility function to create a matrix of tiles from a string representation.
 */
function getTilesFromStringRepresentation(representation: string): Tile[][] {
  const tiles: Tile[][] = Array(10);
  for (let i = 0; i < tiles.length; i++) {
    tiles[i] = Array(3);
  }

  let currentColumn = 0;
  let currentRow = 0;
  for (let i = 0; i < representation.length; i++) {
    const char = representation.charAt(i);
    if (char == "." || char == "X") {
      tiles[currentColumn][currentRow] = {
        index: {
          x: currentColumn,
          y: currentRow,
        },
        impassable: char == "X" ? true : false,
        center: {
          x: 0,
          y: 0,
        },
        path: {
          candidate: false,
          checked: false,
          used: false,
          cost: 0,
          heuristic: 0,
          parent: null,
        },
      };

      currentColumn += 2;
      if (currentColumn == tiles.length) {
        currentColumn = 1;
      } else if (currentColumn == tiles.length + 1) {
        currentColumn = 0;
        currentRow++;
      }
    }
  }

  return tiles;
}
