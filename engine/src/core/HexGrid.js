/**
 * HexGrid - Manages the hexagonal grid and map data
 */

import { HexMath } from '../utils/HexMath.js';

export class HexGrid {
  constructor(width, height, hexSize = 32, flatTop = true) {
    this.width = width;
    this.height = height;
    this.hexSize = hexSize;
    this.flatTop = flatTop;
    
    // Store hex data by coordinate key
    this.hexes = new Map();
    
    this.initializeGrid();
  }

  /**
   * Initialize empty grid
   */
  initializeGrid() {
    for (let q = 0; q < this.width; q++) {
      const qOffset = Math.floor(q / 2);
      for (let r = -qOffset; r < this.height - qOffset; r++) {
        const key = HexMath.coordKey(q, r);
        this.hexes.set(key, {
          q,
          r,
          terrain: null,
          entity: null
        });
      }
    }
  }

  /**
   * Get hex data at coordinates
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @returns {Object|null}
   */
  getHex(q, r) {
    const key = HexMath.coordKey(q, r);
    return this.hexes.get(key) || null;
  }

  /**
   * Set terrain type for a hex
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @param {Object} terrain - Terrain object
   */
  setTerrain(q, r, terrain) {
    const hex = this.getHex(q, r);
    if (hex) {
      hex.terrain = terrain;
    }
  }

  /**
   * Place an entity on a hex
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @param {Object} entity - Entity object
   */
  setEntity(q, r, entity) {
    const hex = this.getHex(q, r);
    if (hex) {
      hex.entity = entity;
      entity.q = q;
      entity.r = r;
    }
  }

  /**
   * Remove entity from a hex
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   */
  removeEntity(q, r) {
    const hex = this.getHex(q, r);
    if (hex) {
      hex.entity = null;
    }
  }

  /**
   * Convert pixel coordinates to hex coordinates
   * @param {number} x - Pixel x coordinate
   * @param {number} y - Pixel y coordinate
   * @returns {{q: number, r: number}|null}
   */
  pixelToHex(x, y) {
    const coords = HexMath.pixelToAxial(x, y, this.hexSize, this.flatTop);
    return this.getHex(coords.q, coords.r) ? coords : null;
  }

  /**
   * Convert hex coordinates to pixel coordinates
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @returns {{x: number, y: number}}
   */
  hexToPixel(q, r) {
    return HexMath.axialToPixel(q, r, this.hexSize, this.flatTop);
  }

  /**
   * Get all hexes in the grid
   * @returns {Array<Object>}
   */
  getAllHexes() {
    return Array.from(this.hexes.values());
  }

  /**
   * Get neighbors of a hex
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @returns {Array<Object>}
   */
  getNeighbors(q, r) {
    const neighborCoords = HexMath.getNeighbors(q, r);
    return neighborCoords
      .map(coord => this.getHex(coord.q, coord.r))
      .filter(hex => hex !== null);
  }

  /**
   * Calculate distance between two hexes
   * @param {number} q1 - First hex q coordinate
   * @param {number} r1 - First hex r coordinate
   * @param {number} q2 - Second hex q coordinate
   * @param {number} r2 - Second hex r coordinate
   * @returns {number}
   */
  distance(q1, r1, q2, r2) {
    return HexMath.distance(q1, r1, q2, r2);
  }
}
