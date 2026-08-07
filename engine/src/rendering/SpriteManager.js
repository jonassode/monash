/**
 * SpriteManager - Load and manage sprite assets
 */

export class SpriteManager {
  constructor() {
    this.sprites = new Map();
    this.loading = new Map();
  }

  /**
   * Load a sprite image
   * @param {string} id - Sprite ID
   * @param {string} url - URL to image file
   * @returns {Promise<HTMLImageElement>}
   */
  async loadSprite(id, url) {
    if (this.sprites.has(id)) {
      return this.sprites.get(id);
    }

    if (this.loading.has(id)) {
      return this.loading.get(id);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.sprites.set(id, img);
        this.loading.delete(id);
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(id);
        reject(new Error(`Failed to load sprite: ${url}`));
      };
      img.src = url;
    });

    this.loading.set(id, promise);
    return promise;
  }

  /**
   * Load multiple sprites
   * @param {Object} spriteMap - Object with sprite IDs and URLs
   * @returns {Promise<void>}
   */
  async loadSprites(spriteMap) {
    const promises = Object.entries(spriteMap).map(([id, url]) => 
      this.loadSprite(id, url)
    );
    
    await Promise.all(promises);
  }

  /**
   * Get a loaded sprite
   * @param {string} id - Sprite ID
   * @returns {HTMLImageElement|null}
   */
  getSprite(id) {
    return this.sprites.get(id) || null;
  }

  /**
   * Check if sprite is loaded
   * @param {string} id - Sprite ID
   * @returns {boolean}
   */
  hasSprite(id) {
    return this.sprites.has(id);
  }

  /**
   * Create a colored rectangle as a sprite (for placeholders)
   * @param {string} id - Sprite ID
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @param {string} color - Fill color
   * @returns {HTMLCanvasElement}
   */
  createColoredSprite(id, width, height, color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);
    
    this.sprites.set(id, canvas);
    return canvas;
  }

  /**
   * Clear all loaded sprites
   */
  clear() {
    this.sprites.clear();
    this.loading.clear();
  }
}
