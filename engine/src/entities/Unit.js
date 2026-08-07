/**
 * Unit - Unit entity with movement and states
 */

import { Entity } from './Entity.js';

export class Unit extends Entity {
  constructor(id, config) {
    super(id, 'unit');
    
    this.name = config.name;
    this.spriteId = config.spriteId;
    this.movementRange = config.movementRange || 3;
    this.movementSpeed = config.movementSpeed || 1.0;
    
    this.state = 'idle'; // idle, moving, working
    this.path = [];
    this.targetQ = null;
    this.targetR = null;
  }

  /**
   * Update unit state
   * @param {number} deltaTime - Time since last update in seconds
   */
  update(deltaTime) {
    // Movement is handled by MovementSystem.update()
    // This method is kept for future enhancements
  }

  /**
   * Set unit state
   * @param {string} state - New state (idle, moving, working)
   */
  setState(state) {
    this.state = state;
  }

  /**
   * Get unit state
   * @returns {string}
   */
  getState() {
    return this.state;
  }

  /**
   * Set movement path
   * @param {Array<{q: number, r: number}>} path - Path to follow
   */
  setPath(path) {
    this.path = path;
    if (path.length > 0) {
      this.state = 'moving';
      const target = path[path.length - 1];
      this.targetQ = target.q;
      this.targetR = target.r;
    }
  }

  /**
   * Get movement range
   * @returns {number}
   */
  getMovementRange() {
    return this.movementRange;
  }

  /**
   * Get movement speed
   * @returns {number}
   */
  getMovementSpeed() {
    return this.movementSpeed;
  }

  /**
   * Check if unit is idle
   * @returns {boolean}
   */
  isIdle() {
    return this.state === 'idle';
  }

  /**
   * Check if unit is moving
   * @returns {boolean}
   */
  isMoving() {
    return this.state === 'moving';
  }

  /**
   * Stop unit movement
   */
  stop() {
    this.state = 'idle';
    this.path = [];
    this.targetQ = null;
    this.targetR = null;
  }
}
