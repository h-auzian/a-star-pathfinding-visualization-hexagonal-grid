import { CharacterState } from "../state/character";
import {
  PathfindingAlgorithm,
  PathfindingData,
  PathfindingStyle,
} from "../types/pathfinding";
import { Tile } from "../types/tiles";
import { getManhattanDistance, getTileNeighbours } from "./map";

const TILE_DISTANCE_COST = 1;

/**
 * Finds a path between two tiles in an hexagonal map using different search
 * algorithms:
 *
 * - Dijkstra's: Travel cost only.
 * - Greedy: Heuristic only.
 * - A-Star: Travel cost plus heuristic.
 *
 * In all three cases the steps are the same: a priority queue of candidate
 * tiles is kept, always ordered from lowest to highest movement cost. The
 * first tile of the queue is removed and all of its neighbours are checked,
 * which are then added to the queue while keeping it ordered. Then the process
 * is repeated with the new first element of the queue, and so on, until
 * reaching the destination or exhausting the queue. If the destination is
 * reached, the tiles are iterated in reverse until getting back to the
 * starting position, as each tile has a reference to the tile where it came
 * from.
 *
 * In some cases, a tile may be added as a candidate more than once if it can
 * be reached from a different path with a lower cost, and thus it can exist in
 * the priority queue multiple times with different priority values. When a
 * tile is removed from the queue, its "candidate" flag is unset, so if that
 * same tile is fetched again from the queue with a higher cost, it can be
 * ignored. This is easier than avoiding the duplicate, as that requires
 * detecting and updating the previous value and then reordering the queue.
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
 * calculating a new path to avoid mixing info from a previous calculation.
 * Instead of iterating the whole map to clear the data, the checked tiles are
 * stored in an array of references, which can be iterated and clared before
 * the next path calculation.
 *
 * In an ideal implementation, a pathfinding function would receive an abstract
 * graph so that the algorithm would work regardless of the actual map layout,
 * be it a square grid, an hexagonal grid, or just any type of graph, but in
 * this case the function just receives the tiles as-is and knows that the map
 * is hexagonal, as that is the focus of this application.
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

  if (start === null || destination === null || destination.impassable) {
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
    data.nextTile = start;
    data.checkedTiles.push(start);
  }

  if (!data.destinationReached && data.nextTile !== null) {
    while (data.nextTile !== null) {
      data.currentTile = data.nextTile;
      if (data.currentTile === null) {
        data.nextTile = null;
        break;
      }

      if (data.currentTile === destination) {
        data.destinationReached = true;
        data.nextTile = null;
        break;
      }

      data.currentTile.path.candidate = false;
      let neighbours = getTileNeighbours(tiles, data.currentTile);
      for (let i = 0; i < neighbours.length; i++) {
        const neighbourTile = neighbours[i];
        if (neighbourTile.impassable) {
          continue;
        }

        let newCost = 0;
        if (usesCost) {
          newCost = data.currentTile.path.cost + TILE_DISTANCE_COST;
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
          neighbourTile.path.parent = data.currentTile;
          const priority = newCost + neighbourTile.path.heuristic;

          neighbourTile.path.candidate = true;
          data.candidates.add(neighbourTile, priority);

          if (!neighbourTile.path.checked) {
            neighbourTile.path.checked = true;
            data.checkedTiles.push(neighbourTile);
          }
        }
      }

      // Getting a new candidate may return a tile that was already checked
      // previously with a lower cost, and thus it's "candidate" flag will be
      // false. If that's the case, that tile should be ignored, getting the
      // subsequent one.
      data.nextTile = data.candidates.poll();
      while (data.nextTile && !data.nextTile.path.candidate) {
        data.nextTile = data.candidates.poll();
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
      const parentTile = data.currentTile.path.parent;
      if (parentTile === null && (interruptOnLastIteration || forceInstantFinish)) {
        break;
      }

      data.foundPath.push(data.currentTile);
      data.currentTile.path.used = true;
      data.currentTile = parentTile;

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
  data.nextTile = null;
  data.foundPath = [];
}

/**
 * Cycles through pathfinding algorithms.
 */
function changePathfindingAlgorithm(data: PathfindingData) {
  if (data.algorithm === PathfindingAlgorithm.Dijkstra) {
    data.algorithm = PathfindingAlgorithm.Greedy;
  } else if (data.algorithm === PathfindingAlgorithm.Greedy) {
    data.algorithm = PathfindingAlgorithm.AStar;
  } else if (data.algorithm === PathfindingAlgorithm.AStar) {
    data.algorithm = PathfindingAlgorithm.Dijkstra;
  }
}

/**
 * Cycles through pathfinding calculation styles.
 */
function changePathfindingStyle(data: PathfindingData) {
  if (data.style === PathfindingStyle.Instant) {
    data.style = PathfindingStyle.StepByStep;
  } else if (data.style === PathfindingStyle.StepByStep) {
    data.style = PathfindingStyle.Instant;
  }
  clearPreviousPathData(data);
}

/**
 * Returns if changing pathfinding options is allowed, to avoid changing them
 * mid-calculation.
 */
function allowPathfindingOptionChanges(
  data: PathfindingData,
  characterState: CharacterState,
): boolean {
  return !data.pending && !characterState.assignedPath.hasPath;
}

export {
  findPath,
  clearPreviousPathData,
  changePathfindingAlgorithm,
  changePathfindingStyle,
  allowPathfindingOptionChanges,
};
