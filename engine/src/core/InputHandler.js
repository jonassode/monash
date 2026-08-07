/**
 * InputHandler - Handle mouse and keyboard input
 */

export class InputHandler {
  constructor(canvas, eventBus) {
    this.canvas = canvas;
    this.eventBus = eventBus;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragThreshold = 5;
    
    this.keysPressed = new Set();
    
    this.initializeListeners();
  }

  /**
   * Initialize event listeners
   */
  initializeListeners() {
    // Mouse events
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Keyboard events
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  /**
   * Get mouse position relative to canvas
   * @param {MouseEvent} e - Mouse event
   * @returns {{x: number, y: number}}
   */
  getMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  /**
   * Handle mouse move event
   * @param {MouseEvent} e - Mouse event
   */
  handleMouseMove(e) {
    const pos = this.getMousePosition(e);
    this.mouseX = pos.x;
    this.mouseY = pos.y;
    
    if (this.isMouseDown) {
      const dx = Math.abs(pos.x - this.dragStartX);
      const dy = Math.abs(pos.y - this.dragStartY);
      
      if (!this.isDragging && (dx > this.dragThreshold || dy > this.dragThreshold)) {
        this.isDragging = true;
        this.eventBus.emit('dragStart', { x: this.dragStartX, y: this.dragStartY });
      }
      
      if (this.isDragging) {
        this.eventBus.emit('drag', { 
          x: pos.x, 
          y: pos.y, 
          dx: pos.x - this.mouseX,
          dy: pos.y - this.mouseY
        });
      }
    }
    
    this.eventBus.emit('mouseMove', { x: pos.x, y: pos.y });
  }

  /**
   * Handle mouse down event
   * @param {MouseEvent} e - Mouse event
   */
  handleMouseDown(e) {
    const pos = this.getMousePosition(e);
    this.isMouseDown = true;
    this.isDragging = false;
    this.dragStartX = pos.x;
    this.dragStartY = pos.y;
    
    this.eventBus.emit('mouseDown', { 
      x: pos.x, 
      y: pos.y, 
      button: e.button 
    });
  }

  /**
   * Handle mouse up event
   * @param {MouseEvent} e - Mouse event
   */
  handleMouseUp(e) {
    const pos = this.getMousePosition(e);
    
    if (this.isDragging) {
      this.eventBus.emit('dragEnd', { x: pos.x, y: pos.y });
    }
    
    this.isMouseDown = false;
    this.isDragging = false;
    
    this.eventBus.emit('mouseUp', { 
      x: pos.x, 
      y: pos.y, 
      button: e.button 
    });
  }

  /**
   * Handle click event
   * @param {MouseEvent} e - Mouse event
   */
  handleClick(e) {
    if (this.isDragging) return; // Don't emit click if it was a drag
    
    const pos = this.getMousePosition(e);
    this.eventBus.emit('click', { 
      x: pos.x, 
      y: pos.y, 
      button: e.button 
    });
  }

  /**
   * Handle wheel event
   * @param {WheelEvent} e - Wheel event
   */
  handleWheel(e) {
    e.preventDefault();
    const pos = this.getMousePosition(e);
    
    this.eventBus.emit('wheel', { 
      x: pos.x, 
      y: pos.y, 
      deltaY: e.deltaY 
    });
  }

  /**
   * Handle key down event
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    if (this.keysPressed.has(e.key)) return; // Already pressed
    
    this.keysPressed.add(e.key);
    this.eventBus.emit('keyDown', { key: e.key, code: e.code });
  }

  /**
   * Handle key up event
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyUp(e) {
    this.keysPressed.delete(e.key);
    this.eventBus.emit('keyUp', { key: e.key, code: e.code });
  }

  /**
   * Check if a key is currently pressed
   * @param {string} key - Key to check
   * @returns {boolean}
   */
  isKeyPressed(key) {
    return this.keysPressed.has(key);
  }

  /**
   * Get current mouse position
   * @returns {{x: number, y: number}}
   */
  getMousePos() {
    return { x: this.mouseX, y: this.mouseY };
  }
}
