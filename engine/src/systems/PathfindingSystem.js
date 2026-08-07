/**
 * PathfindingSystem - Hex grid pathfinding using A*
 */

import { HexMath } from '../utils/HexMath.js';

export class PathfindingSystem {
  constructor(hexGrid) {
    this.hexGrid = hexGrid;
  }

  /**
   * Find path between two hexes using A*
   * @param {number} startQ - Start q coordinate
   * @param {number} startR - Start r coordinate
   * @param {number} goalQ - Goal q coordinate
   * @param {number} goalR - Goal r coordinate
   * @returns {Array<{q: number, r: number}>|null}
   */
  findPath(startQ, startR, goalQ, goalR, debug = false) {
    // Validate inputs
    if (startQ === undefined || startQ === null || startR === undefined || startR === null) {
      console.error(`Invalid start position: (${startQ}, ${startR})`);
      return null;
    }
    
    if (goalQ === undefined || goalQ === null || goalR === undefined || goalR === null) {
      console.error(`Invalid goal position: (${goalQ}, ${goalR})`);
      return null;
    }
    
    const startKey = HexMath.coordKey(startQ, startR);
    const goalKey = HexMath.coordKey(goalQ, goalR);
    
    if (startKey === goalKey) {
      if (debug) console.log(`[Pathfinding] Start and goal are the same: (${startQ}, ${startR})`);
      return [];
    }
    
    const startHex = this.hexGrid.getHex(startQ, startR);
    const goalHex = this.hexGrid.getHex(goalQ, goalR);
    
    if (debug) {
      console.log(`[Pathfinding] Start: (${startQ}, ${startR}), Goal: (${goalQ}, ${goalR})`);
      console.log(`[Pathfinding] Start hex exists: ${!!startHex}, Goal hex exists: ${!!goalHex}`);
      if (startHex) console.log(`[Pathfinding] Start terrain: ${startHex.terrain ? startHex.terrain.name : 'none'}`);
      if (goalHex) console.log(`[Pathfinding] Goal terrain: ${goalHex.terrain ? goalHex.terrain.name : 'none'}`);
    }
    
    if (!startHex || !goalHex) {
      console.error(`[Pathfinding] Start or goal hex does not exist: start=${!!startHex}, goal=${!!goalHex}`);
      return null;
    }
    
    // Check if goal is passable
    if (goalHex.terrain && !goalHex.terrain.isPassable()) {
      console.error(`[Pathfinding] Goal hex is not passable: ${goalHex.terrain.name}`);
      return null;
    }
    
    // Note: We don't check if start is passable because units can pathfind from an impassable hex
    
    const openSet = new Map();
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    gScore.set(startKey, 0);
    fScore.set(startKey, this.heuristic(startQ, startR, goalQ, goalR));
    openSet.set(startKey, { q: startQ, r: startR });
    
    while (openSet.size > 0) {
      // Get node with lowest fScore
      let current = null;
      let currentKey = null;
      let lowestF = Infinity;
      
      for (const [key, coord] of openSet) {
        const f = fScore.get(key) || Infinity;
        if (f < lowestF) {
          lowestF = f;
          currentKey = key;
          current = coord;
        }
      }
      
      if (!currentKey) {
        if (debug) console.log(`[Pathfinding] No current key found in openSet`);
        continue; // Skip to next iteration
      }
      
      if (currentKey === goalKey) {
        if (debug) console.log(`[Pathfinding] Found goal!`);
        return this.reconstructPath(cameFrom, currentKey);
      }
      
      openSet.delete(currentKey);
      closedSet.add(currentKey);
      
      const neighbors = this.hexGrid.getNeighbors(current.q, current.r);
      
      if (debug && neighbors.length === 0) {
        console.log(`[Pathfinding] No neighbors for (${current.q}, ${current.r})`);
      }
      
      for (const neighbor of neighbors) {
        const neighborKey = HexMath.coordKey(neighbor.q, neighbor.r);
        
        if (closedSet.has(neighborKey)) continue;
        
        // Check if passable
        if (neighbor.terrain && !neighbor.terrain.isPassable()) {
          continue;
        }
        
        const movementCost = neighbor.terrain ? neighbor.terrain.getMovementCost() : 1;
        const tentativeGScore = (gScore.get(currentKey) || Infinity) + movementCost;
        
        if (!openSet.has(neighborKey)) {
          openSet.set(neighborKey, { q: neighbor.q, r: neighbor.r });
        } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
          continue;
        }
        
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor.q, neighbor.r, goalQ, goalR));
      }
    }
    
    if (debug) console.log(`[Pathfinding] A* exhausted openSet without finding goal`);
    return null; // No path found
  }

  /**
   * Heuristic function for A* (Manhattan distance for hexes)
   * @param {number} q1 - Start q coordinate
   * @param {number} r1 - Start r coordinate
   * @param {number} q2 - Goal q coordinate
   * @param {number} r2 - Goal r coordinate
   * @returns {number}
   */
  heuristic(q1, r1, q2, r2) {
    return HexMath.distance(q1, r1, q2, r2);
  }

  /**
   * Reconstruct path from A* results
   * @param {Map} cameFrom - Map of visited nodes
   * @param {string} currentKey - Current node key
   * @returns {Array<{q: number, r: number}>}
   */
  reconstructPath(cameFrom, currentKey) {
    const path = [];
    const finalCoords = HexMath.parseCoordKey(currentKey);
    path.push(finalCoords);
    
    while (cameFrom.has(currentKey)) {
      currentKey = cameFrom.get(currentKey);
      const coords = HexMath.parseCoordKey(currentKey);
      path.unshift(coords);
    }
    
    return path;
  }

  /**
   * Get all hexes within range
   * @param {number} q - Center q coordinate
   * @param {number} r - Center r coordinate
   * @param {number} range - Range in hexes
   * @returns {Array<{q: number, r: number}>}
   */
  getHexesInRange(q, r, range) {
    const results = [];
    
    for (let dq = -range; dq <= range; dq++) {
      for (let dr = Math.max(-range, -dq - range); dr <= Math.min(range, -dq + range); dr++) {
        const targetQ = q + dq;
        const targetR = r + dr;
        const hex = this.hexGrid.getHex(targetQ, targetR);
        
        if (hex) {
          results.push({ q: targetQ, r: targetR });
        }
      }
    }
    
    return results;
  }
}
