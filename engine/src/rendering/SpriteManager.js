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
   * Create a hexagonal sprite (for terrain tiles)
   * @param {string} id - Sprite ID
   * @param {number} size - Hex radius (distance from center to corner)
   * @param {string} color - Fill color
   * @param {boolean} flatTop - Flat-top orientation (default: true)
   * @returns {HTMLCanvasElement}
   */
  createHexagonalSprite(id, size, color, flatTop = true) {
    // Calculate canvas size to fit the hexagon
    const width = flatTop ? size * 2 : size * Math.sqrt(3);
    const height = flatTop ? size * Math.sqrt(3) : size * 2;
    
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width) + 2; // Add padding for border
    canvas.height = Math.ceil(height) + 2;
    
    const ctx = canvas.getContext('2d');
    
    // Center the hexagon in the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = flatTop 
        ? (Math.PI / 180) * (60 * i)
        : (Math.PI / 180) * (60 * i + 30);
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    
    // Fill hexagon
    ctx.fillStyle = color;
    ctx.fill();
    
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
