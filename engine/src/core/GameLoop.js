/**
 * GameLoop - Real-time game loop with fixed time step
 */

export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDeltaTime = 1000 / 60; // 60 FPS
    
    this.frameId = null;
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
    
    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /**
   * Pause the game loop
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume the game loop
   */
  resume() {
    if (!this.isRunning) return;
    
    this.isPaused = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
  }

  /**
   * Main game loop
   * @param {number} currentTime - Current timestamp
   */
  loop(currentTime) {
    if (!this.isRunning) return;

    // Calculate delta time
    const deltaTime = Math.min(currentTime - this.lastTime, 250); // Cap at 250ms
    this.lastTime = currentTime;

    if (!this.isPaused) {
      // Fixed time step updates
      this.accumulator += deltaTime;
      
      while (this.accumulator >= this.fixedDeltaTime) {
        this.updateCallback(this.fixedDeltaTime / 1000); // Pass delta in seconds
        this.accumulator -= this.fixedDeltaTime;
      }
    }

    // Always render to show current state
    const alpha = this.isPaused ? 0 : (this.accumulator / this.fixedDeltaTime);
    this.renderCallback(alpha);

    // Continue loop
    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }

  /**
   * Toggle pause state
   */
  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }
}
