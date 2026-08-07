/**
 * Renderer - Main rendering engine
 */

import { HexRenderer } from './HexRenderer.js';

export class Renderer {
  constructor(canvas, hexGrid, spriteManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hexGrid = hexGrid;
    this.spriteManager = spriteManager;
    
    this.cameraX = 0;
    this.cameraY = 0;
    this.zoom = 1.0;
    
    this.selectedEntity = null;
    this.hoveredHex = null;
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render the game
   */
  render() {
    this.clear();
    
    this.ctx.save();
    
    // Apply camera transform
    this.ctx.translate(this.cameraX, this.cameraY);
    this.ctx.scale(this.zoom, this.zoom);
    
    // Render layers
    this.renderHexGrid();
    this.renderTerrain();
    this.renderBuildings();
    this.renderUnits();
    this.renderSelection();
    
    this.ctx.restore();
  }

  /**
   * Render the hex grid
   */
  renderHexGrid() {
    const hexes = this.hexGrid.getAllHexes();
    
    for (const hex of hexes) {
      const pos = this.hexGrid.hexToPixel(hex.q, hex.r);
      
      // Draw hex outline
      HexRenderer.strokeHex(
        this.ctx, 
        pos.x, 
        pos.y, 
        this.hexGrid.hexSize, 
        '#cccccc', 
        1, 
        this.hexGrid.flatTop
      );
    }
  }

  /**
   * Render terrain sprites
   */
  renderTerrain() {
    const hexes = this.hexGrid.getAllHexes();
    
    for (const hex of hexes) {
      if (!hex.terrain) continue;
      
      const pos = this.hexGrid.hexToPixel(hex.q, hex.r);
      const sprite = this.spriteManager.getSprite(hex.terrain.spriteId);
      
      if (sprite) {
        const size = this.hexGrid.hexSize * 1.5;
        this.ctx.drawImage(
          sprite,
          pos.x - size / 2,
          pos.y - size / 2,
          size,
          size
        );
      }
    }
  }

  /**
   * Render buildings
   */
  renderBuildings() {
    const hexes = this.hexGrid.getAllHexes();
    
    for (const hex of hexes) {
      if (!hex.entity || hex.entity.type !== 'building') continue;
      
      const building = hex.entity;
      const pos = this.hexGrid.hexToPixel(hex.q, hex.r);
      const sprite = this.spriteManager.getSprite(building.spriteId);
      
      if (sprite) {
        const size = this.hexGrid.hexSize;
        this.ctx.drawImage(
          sprite,
          pos.x - size / 2,
          pos.y - size / 2,
          size,
          size
        );
      }
    }
  }

  /**
   * Render units
   */
  renderUnits() {
    const hexes = this.hexGrid.getAllHexes();
    
    for (const hex of hexes) {
      if (!hex.entity || hex.entity.type !== 'unit') continue;
      
      const unit = hex.entity;
      const pos = this.hexGrid.hexToPixel(hex.q, hex.r);
      const sprite = this.spriteManager.getSprite(unit.spriteId);
      
      if (sprite) {
        const size = this.hexGrid.hexSize * 0.8;
        this.ctx.drawImage(
          sprite,
          pos.x - size / 2,
          pos.y - size / 2,
          size,
          size
        );
      }
    }
  }

  /**
   * Render selection highlights
   */
  renderSelection() {
    // Highlight selected entity
    if (this.selectedEntity) {
      const pos = this.hexGrid.hexToPixel(this.selectedEntity.q, this.selectedEntity.r);
      HexRenderer.highlightHex(
        this.ctx,
        pos.x,
        pos.y,
        this.hexGrid.hexSize,
        '#ffff00',
        this.hexGrid.flatTop
      );
    }
    
    // Highlight hovered hex
    if (this.hoveredHex) {
      const pos = this.hexGrid.hexToPixel(this.hoveredHex.q, this.hoveredHex.r);
      HexRenderer.highlightHex(
        this.ctx,
        pos.x,
        pos.y,
        this.hexGrid.hexSize,
        '#00ffff',
        this.hexGrid.flatTop
      );
    }
  }

  /**
   * Set selected entity
   * @param {Object} entity - Entity to select
   */
  setSelectedEntity(entity) {
    this.selectedEntity = entity;
  }

  /**
   * Set hovered hex
   * @param {Object} hex - Hex being hovered
   */
  setHoveredHex(hex) {
    this.hoveredHex = hex;
  }

  /**
   * Move camera
   * @param {number} dx - Delta x
   * @param {number} dy - Delta y
   */
  moveCamera(dx, dy) {
    this.cameraX += dx;
    this.cameraY += dy;
  }

  /**
   * Set camera position
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  setCameraPosition(x, y) {
    this.cameraX = x;
    this.cameraY = y;
  }

  /**
   * Zoom in/out
   * @param {number} delta - Zoom delta
   * @param {number} mouseX - Mouse x for zoom center
   * @param {number} mouseY - Mouse y for zoom center
   */
  setZoom(delta, mouseX = null, mouseY = null) {
    const oldZoom = this.zoom;
    this.zoom = Math.max(0.5, Math.min(2.0, this.zoom + delta));
    
    if (mouseX !== null && mouseY !== null) {
      // Zoom towards mouse position
      const zoomFactor = this.zoom / oldZoom;
      this.cameraX = mouseX - (mouseX - this.cameraX) * zoomFactor;
      this.cameraY = mouseY - (mouseY - this.cameraY) * zoomFactor;
    }
  }

  /**
   * Convert screen coordinates to world coordinates
   * @param {number} screenX - Screen x coordinate
   * @param {number} screenY - Screen y coordinate
   * @returns {{x: number, y: number}}
   */
  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.cameraX) / this.zoom,
      y: (screenY - this.cameraY) / this.zoom
    };
  }

  /**
   * Resize canvas
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
