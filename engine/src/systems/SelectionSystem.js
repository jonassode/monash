/**
 * SelectionSystem - Handle entity selection
 */

export class SelectionSystem {
  constructor(hexGrid, eventBus, renderer, movementSystem = null) {
    this.hexGrid = hexGrid;
    this.eventBus = eventBus;
    this.renderer = renderer;
    this.movementSystem = movementSystem;
    
    this.selectedEntity = null;
    
    this.initializeListeners();
  }

  /**
   * Set the movement system
   * @param {Object} movementSystem - MovementSystem instance
   */
  setMovementSystem(movementSystem) {
    this.movementSystem = movementSystem;
  }

  /**
   * Initialize event listeners
   */
  initializeListeners() {
    this.eventBus.on('click', (data) => this.handleClick(data));
    this.eventBus.on('mouseMove', (data) => this.handleMouseMove(data));
    this.eventBus.on('mouseUp', (data) => this.handleMouseUp(data));
  }

  /**
   * Handle click event
   * @param {Object} data - Click event data
   */
  handleClick(data) {
    const worldPos = this.renderer.screenToWorld(data.x, data.y);
    const hexCoords = this.hexGrid.pixelToHex(worldPos.x, worldPos.y);
    
    if (!hexCoords) {
      this.deselectEntity();
      return;
    }
    
    const hex = this.hexGrid.getHex(hexCoords.q, hexCoords.r);
    
    if (hex && hex.entity) {
      this.selectEntity(hex.entity);
    } else {
      this.deselectEntity();
    }
  }

  /**
   * Handle mouse up event (right-click movement)
   * @param {Object} data - Mouse up event data
   */
  handleMouseUp(data) {
    // Right-click (button 2)
    if (data.button !== 2) return;
    
    if (!this.selectedEntity || this.selectedEntity.type !== 'unit') {
      return;
    }
    
    // Get target hex coordinates
    const worldPos = this.renderer.screenToWorld(data.x, data.y);
    const hexCoords = this.hexGrid.pixelToHex(worldPos.x, worldPos.y);
    
    if (!hexCoords) {
      console.log('[Selection] Right-click on invalid hex (outside grid)');
      return;
    }
    
    console.log(`[Selection] Right-click on (${hexCoords.q}, ${hexCoords.r})`);
    
    // Command unit to move
    if (this.movementSystem) {
      this.movementSystem.moveUnit(this.selectedEntity, hexCoords.q, hexCoords.r);
    }
  }

  /**
   * Handle mouse move event
   * @param {Object} data - Mouse move event data
   */
  handleMouseMove(data) {
    const worldPos = this.renderer.screenToWorld(data.x, data.y);
    const hexCoords = this.hexGrid.pixelToHex(worldPos.x, worldPos.y);
    
    if (hexCoords) {
      const hex = this.hexGrid.getHex(hexCoords.q, hexCoords.r);
      this.renderer.setHoveredHex(hex);
    } else {
      this.renderer.setHoveredHex(null);
    }
  }

  /**
   * Select an entity
   * @param {Object} entity - Entity to select
   */
  selectEntity(entity) {
    if (this.selectedEntity) {
      this.selectedEntity.deselect();
    }
    
    this.selectedEntity = entity;
    entity.select();
    
    this.renderer.setSelectedEntity(entity);
    this.eventBus.emit('entitySelected', { entity });
  }

  /**
   * Deselect current entity
   */
  deselectEntity() {
    if (this.selectedEntity) {
      this.selectedEntity.deselect();
      this.selectedEntity = null;
      
      this.renderer.setSelectedEntity(null);
      this.eventBus.emit('entityDeselected', {});
    }
  }

  /**
   * Get selected entity
   * @returns {Object|null}
   */
  getSelectedEntity() {
    return this.selectedEntity;
  }
}
