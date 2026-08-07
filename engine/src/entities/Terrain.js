/**
 * Terrain - Terrain type with traits
 */

export class Terrain {
  constructor(id, config) {
    this.id = id;
    this.name = config.name;
    this.passable = config.passable;
    this.movementCost = config.movementCost;
    this.isWater = config.isWater;
    this.blocksBuilding = config.blocksBuilding;
    this.spriteId = config.spriteId;
  }

  /**
   * Check if units can traverse this terrain
   * @returns {boolean}
   */
  isPassable() {
    return this.passable;
  }

  /**
   * Get movement cost multiplier
   * @returns {number}
   */
  getMovementCost() {
    return this.movementCost;
  }

  /**
   * Check if this is water terrain
   * @returns {boolean}
   */
  isWaterTerrain() {
    return this.isWater;
  }

  /**
   * Check if buildings can be placed on this terrain
   * @returns {boolean}
   */
  allowsBuilding() {
    return !this.blocksBuilding;
  }
}
