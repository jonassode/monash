/**
 * MovementSystem - Handle unit movement along paths
 */

export class MovementSystem {
  constructor(hexGrid, pathfindingSystem, eventBus) {
    this.hexGrid = hexGrid;
    this.pathfindingSystem = pathfindingSystem;
    this.eventBus = eventBus;
    
    this.movingUnits = new Map(); // Map of unit -> {targetQ, targetR, startTime}
  }

  /**
   * Command a unit to move to a target location
   * @param {Object} unit - Unit to move
   * @param {number} targetQ - Target q coordinate
   * @param {number} targetR - Target r coordinate
   * @returns {boolean} Success
   */
  moveUnit(unit, targetQ, targetR) {
    // Validate unit position
    if (unit.q === undefined || unit.q === null || unit.r === undefined || unit.r === null) {
      console.error(`Unit ${unit.id} does not have a valid position: (${unit.q}, ${unit.r})`);
      return false;
    }
    
    // Validate target position
    if (targetQ === undefined || targetQ === null || targetR === undefined || targetR === null) {
      console.error(`Invalid target position: (${targetQ}, ${targetR})`);
      return false;
    }
    
    console.log(`[Movement] Moving ${unit.id} from (${unit.q}, ${unit.r}) to (${targetQ}, ${targetR})`);
    
    // Check if target hex exists and is valid
    const targetHex = this.hexGrid.getHex(targetQ, targetR);
    console.log(`[Movement] Target hex (${targetQ}, ${targetR}) exists: ${!!targetHex}, has terrain: ${targetHex && targetHex.terrain ? true : false}`);
    
    // Find path with debug enabled
    const path = this.pathfindingSystem.findPath(unit.q, unit.r, targetQ, targetR, true);
    
    if (path === null) {
      console.log(`No path found for unit ${unit.id}`);
      return false;
    }
    
    if (path.length === 0) {
      console.log(`Unit ${unit.id} is already at target`);
      return false;
    }
    
    // Set path on unit
    unit.setPath(path);
    this.movingUnits.set(unit, {
      targetQ: targetQ,
      targetR: targetR,
      pathIndex: 0
    });
    
    this.eventBus.emit('unitMovementStarted', { unit, targetQ, targetR, path });
    
    return true;
  }

  /**
   * Stop a unit's movement
   * @param {Object} unit - Unit to stop
   */
  stopUnit(unit) {
    unit.stop();
    this.movingUnits.delete(unit);
    this.eventBus.emit('unitMovementStopped', { unit });
  }

  /**
   * Update movement for all units
   * @param {number} deltaTime - Time since last update in seconds
   */
  update(deltaTime) {
    const unitsToRemove = [];
    
    for (const [unit, data] of this.movingUnits) {
      if (!unit.isMoving() || unit.path.length === 0) {
        unitsToRemove.push(unit);
        continue;
      }
      
      // Move unit along path
      this.updateUnitMovement(unit, deltaTime);
      
      // Check if unit reached destination
      if (unit.q === data.targetQ && unit.r === data.targetR) {
        unit.stop();
        unitsToRemove.push(unit);
        this.eventBus.emit('unitMovementComplete', { unit });
      }
    }
    
    // Clean up finished movements
    unitsToRemove.forEach(unit => this.movingUnits.delete(unit));
  }

  /**
   * Update a single unit's movement
   * @param {Object} unit - Unit to update
   * @param {number} deltaTime - Time since last update in seconds
   */
  updateUnitMovement(unit, deltaTime) {
    
    if (unit.path.length === 0) return;
    console.log('moving unit');
    
    // Calculate distance the unit can travel this frame
    // movementSpeed is in hexes per second
    const distancePerFrame = unit.getMovementSpeed() * deltaTime;
    
    // Move towards current target hex in path
    const currentPos = { q: unit.q, r: unit.r };
    let remainingDistance = distancePerFrame;
    let pathIndex = 0;
    
    // Traverse path hexes
    while (pathIndex < unit.path.length && remainingDistance > 0) {
      
      const nextHex = unit.path[pathIndex];
      
      // Calculate terrain movement cost
      const nextHexData = this.hexGrid.getHex(nextHex.q, nextHex.r);
      const terrainCost = nextHexData.terrain ? nextHexData.terrain.getMovementCost() : 1;

      console.log('remaining distance ' + remainingDistance);
      console.log('terrainCost ' + terrainCost);

      
      // Check if we have enough distance to move to this hex
      if (remainingDistance >= terrainCost) {
        remainingDistance -= terrainCost;
        pathIndex++;
        
        // Remove entity from current hex
        this.hexGrid.removeEntity(currentPos.q, currentPos.r);
        
        // Move to next hex
        currentPos.q = nextHex.q;
        currentPos.r = nextHex.r;
        this.hexGrid.setEntity(currentPos.q, currentPos.r, unit);
      } else {
        // Not enough distance to move to next hex, stop here
        break;
      }
    }
    
    // Remove the hexes we've traversed from the path
    unit.path.splice(0, pathIndex);
    
    // Update unit's actual coordinates to match the movement
    unit.q = currentPos.q;
    unit.r = currentPos.r;
    
    // If path is empty or we've reached the target, mark as arrived
    if (unit.path.length === 0) {
      unit.stop();
    }
  }

  /**
   * Check if a unit is moving
   * @param {Object} unit - Unit to check
   * @returns {boolean}
   */
  isUnitMoving(unit) {
    return this.movingUnits.has(unit);
  }

  /**
   * Get movement status for a unit
   * @param {Object} unit - Unit to check
   * @returns {Object|null} Movement data or null
   */
  getMovementStatus(unit) {
    return this.movingUnits.get(unit) || null;
  }
}
