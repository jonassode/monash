/**
 * HexMath - Utilities for hexagonal grid mathematics
 * Uses axial coordinate system (q, r)
 */

export class HexMath {
  /**
   * Convert axial coordinates to pixel coordinates
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @param {number} size - Hex size (radius)
   * @param {boolean} flatTop - Flat-top orientation (default: true)
   * @returns {{x: number, y: number}}
   */
  static axialToPixel(q, r, size, flatTop = true) {
    if (flatTop) {
      const x = size * (3/2 * q);
      const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
      return { x, y };
    } else {
      const x = size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
      const y = size * (3/2 * r);
      return { x, y };
    }
  }

  /**
   * Convert pixel coordinates to axial coordinates
   * @param {number} x - Pixel x coordinate
   * @param {number} y - Pixel y coordinate
   * @param {number} size - Hex size (radius)
   * @param {boolean} flatTop - Flat-top orientation (default: true)
   * @returns {{q: number, r: number}}
   */
  static pixelToAxial(x, y, size, flatTop = true) {
    let q, r;
    
    if (flatTop) {
      q = (2/3 * x) / size;
      r = (-1/3 * x + Math.sqrt(3)/3 * y) / size;
    } else {
      q = (Math.sqrt(3)/3 * x - 1/3 * y) / size;
      r = (2/3 * y) / size;
    }

    return this.roundAxial(q, r);
  }

  /**
   * Round fractional axial coordinates to nearest hex
   * @param {number} q - Fractional q coordinate
   * @param {number} r - Fractional r coordinate
   * @returns {{q: number, r: number}}
   */
  static roundAxial(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }

  /**
   * Get the six neighbors of a hex
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @returns {Array<{q: number, r: number}>}
   */
  static getNeighbors(q, r) {
    const directions = [
      { q: 1, r: 0 },   // East
      { q: 1, r: -1 },  // Northeast
      { q: 0, r: -1 },  // Northwest
      { q: -1, r: 0 },  // West
      { q: -1, r: 1 },  // Southwest
      { q: 0, r: 1 }    // Southeast
    ];

    return directions.map(dir => ({
      q: q + dir.q,
      r: r + dir.r
    }));
  }

  /**
   * Calculate distance between two hexes
   * @param {number} q1 - First hex q coordinate
   * @param {number} r1 - First hex r coordinate
   * @param {number} q2 - Second hex q coordinate
   * @param {number} r2 - Second hex r coordinate
   * @returns {number}
   */
  static distance(q1, r1, q2, r2) {
    const s1 = -q1 - r1;
    const s2 = -q2 - r2;
    return (Math.abs(q1 - q2) + Math.abs(r1 - r2) + Math.abs(s1 - s2)) / 2;
  }

  /**
   * Create a unique key for a hex coordinate
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   * @returns {string}
   */
  static coordKey(q, r) {
    return `${q},${r}`;
  }

  /**
   * Parse a coordinate key back to {q, r}
   * @param {string} key - Coordinate key
   * @returns {{q: number, r: number}}
   */
  static parseCoordKey(key) {
    const [q, r] = key.split(',').map(Number);
    return { q, r };
  }
}
