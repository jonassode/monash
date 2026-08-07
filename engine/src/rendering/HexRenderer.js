/**
 * HexRenderer - Utilities for rendering hexagons
 */

export class HexRenderer {
  /**
   * Draw a flat-top hexagon
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center x coordinate
   * @param {number} y - Center y coordinate
   * @param {number} size - Hex size (radius)
   * @param {boolean} flatTop - Flat-top orientation
   */
  static drawHex(ctx, x, y, size, flatTop = true) {
    const points = this.getHexPoints(x, y, size, flatTop);
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.closePath();
  }

  /**
   * Get the corner points of a hexagon
   * @param {number} x - Center x coordinate
   * @param {number} y - Center y coordinate
   * @param {number} size - Hex size (radius)
   * @param {boolean} flatTop - Flat-top orientation
   * @returns {Array<{x: number, y: number}>}
   */
  static getHexPoints(x, y, size, flatTop = true) {
    const points = [];
    const angleOffset = flatTop ? 0 : Math.PI / 6;
    
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + angleOffset;
      points.push({
        x: x + size * Math.cos(angle),
        y: y + size * Math.sin(angle)
      });
    }
    
    return points;
  }

  /**
   * Fill a hexagon
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center x coordinate
   * @param {number} y - Center y coordinate
   * @param {number} size - Hex size (radius)
   * @param {string} color - Fill color
   * @param {boolean} flatTop - Flat-top orientation
   */
  static fillHex(ctx, x, y, size, color, flatTop = true) {
    this.drawHex(ctx, x, y, size, flatTop);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /**
   * Stroke a hexagon outline
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center x coordinate
   * @param {number} y - Center y coordinate
   * @param {number} size - Hex size (radius)
   * @param {string} color - Stroke color
   * @param {number} lineWidth - Line width
   * @param {boolean} flatTop - Flat-top orientation
   */
  static strokeHex(ctx, x, y, size, color, lineWidth = 1, flatTop = true) {
    this.drawHex(ctx, x, y, size, flatTop);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  /**
   * Draw a hexagon with fill and stroke
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center x coordinate
   * @param {number} y - Center y coordinate
   * @param {number} size - Hex size (radius)
   * @param {string} fillColor - Fill color
   * @param {string} strokeColor - Stroke color
   * @param {number} lineWidth - Line width
   * @param {boolean} flatTop - Flat-top orientation
   */
  static drawFilledHex(ctx, x, y, size, fillColor, strokeColor, lineWidth = 1, flatTop = true) {
    this.drawHex(ctx, x, y, size, flatTop);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  /**
   * Draw a highlighted hexagon (selection)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center x coordinate
   * @param {number} y - Center y coordinate
   * @param {number} size - Hex size (radius)
   * @param {string} color - Highlight color
   * @param {boolean} flatTop - Flat-top orientation
   */
  static highlightHex(ctx, x, y, size, color = '#ffff00', flatTop = true) {
    this.drawHex(ctx, x, y, size, flatTop);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
