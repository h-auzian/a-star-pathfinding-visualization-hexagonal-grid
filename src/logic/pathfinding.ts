import PriorityQueue from "../misc/priority-queue";
import { PathfindingData, Tile, TileType } from "../misc/types";
import { getManhattanDistance, getTileNeighbours } from "./map";

enum PathfindingAlgorithm {
  Dijkstra,
  Greedy,
  AStar,
}

const TILE_DISTANCE_COST = 1;

/**
 * Finds a path between two tiles in an hexagonal map using different
 * algorithms:
 *
 * - Dijkstra's: Travel cost only.
 * - Greedy: Heuristic only.
 * - A-Star: Travel cost plus heuristic.
 *
 * In an ideal implementation, a pathfinding function would receive an abstract
 * graph so that the algorithm would work regardless of the actual map layout,
 * be it a square grid, an hexagonal grid, or just any type of graph, but in
 * this case the function just receives the tiles as-is and knows that the map
 * is hexagonal, as that is the focus of this application.
 *
 * Since this application also needs to render the algorithm steps screen, the
 * calculated costs per tile are stored in the tiles themselves instead of
 * being stored in a new data structure. The downside is that the costs need to
 * be cleared out before calculating a new path to avoid rendering info from a
 * previous path calculation.
 *
 * To avoid iterating the whole array of tiles to clear the data, the
 * "pathfindingData.checkedTiles" array stores the tiles that were updated,
 * which then can be cleared on the next path calculation. This cleanup must be
 * done outside of this function.
 */
function findPath(
  tiles: Tile[][],
  start: Tile,
  destination: Tile,
  algorithm: PathfindingAlgorithm,
  pathfindingData?: PathfindingData
): PathfindingData {
  if (pathfindingData === undefined) {
    pathfindingData = {
      candidates: new PriorityQueue<Tile>(),
      checkedTiles: [],
      foundPath: [],
    };
  }

  if (destination.type === TileType.Impassable) {
    return pathfindingData;
  };

  start.path.checked = true;
  pathfindingData.candidates.add(start, 0);
  pathfindingData.checkedTiles.push(start);

  let lastRouteTile: Tile | null = null;
  while (pathfindingData.candidates.length() > 0) {
    const currentTile = pathfindingData.candidates.poll();
    if (currentTile === null) {
      break;
    }

    if (currentTile === destination) {
      lastRouteTile = currentTile;
      break;
    }

    let neighbours = getTileNeighbours(tiles, currentTile);

    for (let i = 0; i < neighbours.length; i++) {
      const neighbourTile = neighbours[i];
      if (neighbourTile.type === TileType.Impassable) {
        continue;
      }

      let newCost = 0;
      if (algorithm === PathfindingAlgorithm.Dijkstra || algorithm === PathfindingAlgorithm.AStar) {
        newCost = currentTile.path.cost + TILE_DISTANCE_COST;
      }

      if (!neighbourTile.path.checked || newCost < neighbourTile.path.cost) {
        if (!neighbourTile.path.checked) {
          let heuristic = 0;
          if (algorithm === PathfindingAlgorithm.Greedy || algorithm === PathfindingAlgorithm.AStar) {
            heuristic = getManhattanDistance(neighbourTile, destination);
          }
          neighbourTile.path.heuristic = heuristic;
        }

        neighbourTile.path.checked = true;
        neighbourTile.path.cost = newCost;
        neighbourTile.path.parent = currentTile;

        const priority = newCost + neighbourTile.path.heuristic;
        pathfindingData.candidates.add(neighbourTile, priority);
        pathfindingData.checkedTiles.push(neighbourTile);
      }
    }
  }

  while (lastRouteTile !== null) {
    pathfindingData.foundPath.push(lastRouteTile);
    lastRouteTile.path.used = true;
    lastRouteTile = lastRouteTile.path.parent;
  }
  pathfindingData.foundPath.reverse();

  return pathfindingData;
}

/**
 * Clears the pathfinding data from a previous path calculation.
 */
function clearPreviousPathData(data: PathfindingData): void {
  data.checkedTiles.forEach(function(tile) {
    tile.path.checked = false;
    tile.path.used = false;
    tile.path.cost = 0;
    tile.path.heuristic = 0;
    tile.path.parent = null;
  });

  data.candidates.clear();
  data.checkedTiles = [];
  data.foundPath = [];
}

export {
  PathfindingAlgorithm,
  PathfindingData,
  findPath,
  clearPreviousPathData,
};
