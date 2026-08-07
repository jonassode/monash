/**
 * Building - Building entity with tasks
 */

import { Entity } from './Entity.js';

export class Building extends Entity {
  constructor(id, config) {
    super(id, 'building');
    
    this.name = config.name;
    this.spriteId = config.spriteId;
    this.allowedTerrain = config.allowedTerrain || [];
    this.size = config.size || 1;
    this.availableTasks = config.tasks || [];
    
    this.taskQueue = [];
    this.currentTask = null;
  }

  /**
   * Update building state (process tasks)
   * @param {number} deltaTime - Time since last update in seconds
   */
  update(deltaTime) {
    if (this.currentTask) {
      this.currentTask.progress += deltaTime;
      
      if (this.currentTask.progress >= this.currentTask.duration) {
        this.completeTask();
      }
    } else if (this.taskQueue.length > 0) {
      this.startNextTask();
    }
  }

  /**
   * Add a task to the queue
   * @param {Object} task - Task object with name, duration, etc.
   */
  queueTask(task) {
    const taskData = {
      ...task,
      progress: 0,
      queuedAt: Date.now()
    };
    
    this.taskQueue.push(taskData);
    
    if (!this.currentTask) {
      this.startNextTask();
    }
  }

  /**
   * Start the next task in the queue
   */
  startNextTask() {
    if (this.taskQueue.length === 0) return;
    
    this.currentTask = this.taskQueue.shift();
    this.currentTask.startedAt = Date.now();
  }

  /**
   * Complete the current task
   */
  completeTask() {
    if (!this.currentTask) return;
    
    const completedTask = this.currentTask;
    this.currentTask = null;
    
    return completedTask;
  }

  /**
   * Cancel current task
   */
  cancelCurrentTask() {
    this.currentTask = null;
  }

  /**
   * Clear all queued tasks
   */
  clearTaskQueue() {
    this.taskQueue = [];
  }

  /**
   * Get available tasks for this building
   * @returns {Array<string>}
   */
  getAvailableTasks() {
    return this.availableTasks;
  }

  /**
   * Get current task
   * @returns {Object|null}
   */
  getCurrentTask() {
    return this.currentTask;
  }

  /**
   * Get task queue
   * @returns {Array<Object>}
   */
  getTaskQueue() {
    return this.taskQueue;
  }

  /**
   * Check if building can be placed on terrain
   * @param {string} terrainId - Terrain type ID
   * @returns {boolean}
   */
  canPlaceOnTerrain(terrainId) {
    return this.allowedTerrain.length === 0 || this.allowedTerrain.includes(terrainId);
  }
}
