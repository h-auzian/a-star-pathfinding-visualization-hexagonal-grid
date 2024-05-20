import {
  PathfindingAlgorithm,
  PathfindingData,
  PathfindingStyle,
} from "../types/pathfinding";
import { Tile, TileType } from "../types/tiles";
import { getManhattanDistance, getTileNeighbours } from "./map";

const TILE_DISTANCE_COST = 1;

/**
 * Finds a path between two tiles in an hexagonal map using different
 * search algorithms:
 *
 * - Dijkstra's: Travel cost only.
 * - Greedy: Heuristic only.
 * - A-Star: Travel cost plus heuristic.
 *
 * In all three cases the steps are the same: a list of candidate tiles is
 * kept, always ordered from lowest to highest movement cost. The first tile of
 * the list is removed and all of its neighbours are checked, which are then
 * added to the list while keeping it ordered, and then the process is repeated
 * again with the first element of the list, and so on, until reaching the
 * destination. If reached, the tiles are iterated in reverse until getting
 * back to the starting position, as each tile has a reference to the tile
 * where it came from.
 *
 * In an ideal implementation, a pathfinding function would receive an abstract
 * graph so that the algorithm would work regardless of the actual map layout,
 * be it a square grid, an hexagonal grid, or just any type of graph, but in
 * this case the function just receives the tiles as-is and knows that the map
 * is hexagonal, as that is the focus of this application.
 *
 * This implementation supports both instant and step-by-step calculation of
 * the path, so is a little more complex (and uglier) than the pure algorithm
 * implementation. Instead of function-scoped variables to store the
 * candidates, the costs, etc, the data is stored in the application's state
 * and thus the path can be calculated in small steps on multiple calls to this
 * function on user input.
 *
 * The calculated costs per tile are stored in the tiles themselves instead of
 * being stored in a new data structure, to avoid constantly creating new
 * arrays. The downside is that the costs need to be cleared out before
 * calculating a new path to avoid rendering info from a previous calculation.
 * To avoid iterating the whole array of tiles to clear the data, the
 * "pathfindingData.checkedTiles" array stores the tiles that were updated,
 * which then can be cleared on the next path calculation.
 */
function findPath(
  data: PathfindingData,
  tiles: Tile[][],
  start: Tile | null,
  destination: Tile | null,
  interruptOnLastIteration: boolean = false,
  forceInstantFinish: boolean = false,
): void {
  if (start !== data.startingTile || destination != data.destinationTile) {
    clearPreviousPathData(data);
    data.startingTile = start;
    data.destinationTile = destination;
  }

  if (data.finished) {
    return;
  }

  if (start === null || destination === null || destination.type === TileType.Impassable) {
    return;
  }

  const usesCost = data.algorithm === PathfindingAlgorithm.Dijkstra
    || data.algorithm === PathfindingAlgorithm.AStar;

  const usesHeuristic = data.algorithm === PathfindingAlgorithm.Greedy
    || data.algorithm === PathfindingAlgorithm.AStar;

  const stepByStep = data.style === PathfindingStyle.StepByStep && !forceInstantFinish;

  if (!data.pending) {
    start.path.candidate = true;
    start.path.checked = true;
    data.pending = true;
    data.candidates.add(start, 0);
    data.checkedTiles.push(start);
  }

  if (!data.destinationReached && data.candidates.length() > 0) {
    while (data.candidates.length() > 0) {
      data.currentTile = data.candidates.poll();

      const current = data.currentTile;
      if (current === null) {
        break;
      }

      if (current === destination) {
        data.destinationReached = true;
        break;
      }

      current.path.candidate = false;
      let neighbours = getTileNeighbours(tiles, current);
      for (let i = 0; i < neighbours.length; i++) {
        const neighbourTile = neighbours[i];
        if (neighbourTile.type === TileType.Impassable) {
          continue;
        }

        let newCost = 0;
        if (usesCost) {
          newCost = current.path.cost + TILE_DISTANCE_COST;
        }

        if (!neighbourTile.path.checked || newCost < neighbourTile.path.cost) {
          if (!neighbourTile.path.checked) {
            let heuristic = 0;
            if (usesHeuristic) {
              heuristic = getManhattanDistance(neighbourTile, destination);
            }
            neighbourTile.path.heuristic = heuristic;
          }

          neighbourTile.path.cost = newCost;
          neighbourTile.path.parent = current;
          const priority = newCost + neighbourTile.path.heuristic;

          neighbourTile.path.candidate = true;
          data.candidates.add(neighbourTile, priority);

          if (!neighbourTile.path.checked) {
            neighbourTile.path.checked = true;
            data.checkedTiles.push(neighbourTile);
          }
        }
      }

      if (stepByStep) {
        return;
      }
    }

    if (stepByStep) {
      return;
    }
  }

  let finished = false;
  if (data.destinationReached) {
    while (data.currentTile !== null) {
      const nextTile = data.currentTile.path.parent;
      if (nextTile === null && (interruptOnLastIteration || forceInstantFinish)) {
        break;
      }

      data.foundPath.push(data.currentTile);
      data.currentTile.path.used = true;
      data.currentTile = nextTile;

      if (stepByStep) {
        break;
      }
    }

    if (data.currentTile === null) {
      data.foundPath.reverse();
      finished = true;
    }
  } else if (data.candidates.length() == 0) {
    finished = true;
    if (stepByStep) {
      clearPreviousPathData(data);
    }
  }

  if (finished) {
    data.pending = false;
    data.finished = true;
    data.currentTile = null;
  }
}

/**
 * Clears the pathfinding data from a previous path calculation.
 */
function clearPreviousPathData(data: PathfindingData): void {
  data.checkedTiles.forEach(function(tile) {
    tile.path.candidate = false;
    tile.path.checked = false;
    tile.path.used = false;
    tile.path.cost = 0;
    tile.path.heuristic = 0;
    tile.path.parent = null;
  });

  data.startingTile = null;
  data.destinationTile = null;
  data.pending = false;
  data.destinationReached = false;
  data.finished = false;
  data.candidates.clear();
  data.checkedTiles = [];
  data.currentTile = null;
  data.foundPath = [];
}

export {
  findPath,
  clearPreviousPathData,
};
