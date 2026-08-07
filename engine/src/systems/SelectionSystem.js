/**
 * SelectionSystem - Handle entity selection
 */

export class SelectionSystem {
  constructor(hexGrid, eventBus, renderer) {
    this.hexGrid = hexGrid;
    this.eventBus = eventBus;
    this.renderer = renderer;
    
    this.selectedEntity = null;
    
    this.initializeListeners();
  }

  /**
   * Initialize event listeners
   */
  initializeListeners() {
    this.eventBus.on('click', (data) => this.handleClick(data));
    this.eventBus.on('mouseMove', (data) => this.handleMouseMove(data));
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
