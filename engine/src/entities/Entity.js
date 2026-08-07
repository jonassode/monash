/**
 * Entity - Base class for all game entities
 */

export class Entity {
  constructor(id, type) {
    this.id = id;
    this.type = type;
    this.q = 0;
    this.r = 0;
    this.spriteId = null;
    this.selected = false;
  }

  /**
   * Update entity state
   * @param {number} deltaTime - Time since last update in seconds
   */
  update(deltaTime) {
    // Override in subclasses
  }

  /**
   * Get entity position
   * @returns {{q: number, r: number}}
   */
  getPosition() {
    return { q: this.q, r: this.r };
  }

  /**
   * Set entity position
   * @param {number} q - Axial q coordinate
   * @param {number} r - Axial r coordinate
   */
  setPosition(q, r) {
    this.q = q;
    this.r = r;
  }

  /**
   * Select this entity
   */
  select() {
    this.selected = true;
  }

  /**
   * Deselect this entity
   */
  deselect() {
    this.selected = false;
  }

  /**
   * Check if entity is selected
   * @returns {boolean}
   */
  isSelected() {
    return this.selected;
  }
}
