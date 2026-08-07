/**
 * TaskSystem - Manage building/unit tasks
 */

export class TaskSystem {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.taskDefinitions = new Map();
  }

  /**
   * Register a task definition
   * @param {string} taskId - Task ID
   * @param {Object} taskDef - Task definition
   */
  registerTask(taskId, taskDef) {
    this.taskDefinitions.set(taskId, {
      id: taskId,
      name: taskDef.name,
      description: taskDef.description || '',
      duration: taskDef.duration || 10,
      onComplete: taskDef.onComplete || null
    });
  }

  /**
   * Register multiple task definitions
   * @param {Object} tasks - Object with task IDs and definitions
   */
  registerTasks(tasks) {
    Object.entries(tasks).forEach(([id, def]) => {
      this.registerTask(id, def);
    });
  }

  /**
   * Start a task on an entity
   * @param {Object} entity - Entity (building or unit)
   * @param {string} taskId - Task ID
   * @returns {boolean} Success
   */
  startTask(entity, taskId) {
    const taskDef = this.taskDefinitions.get(taskId);
    
    if (!taskDef) {
      console.error(`Task not found: ${taskId}`);
      return false;
    }
    
    if (entity.type !== 'building') {
      console.error('Only buildings can have tasks in current implementation');
      return false;
    }
    
    const task = {
      id: taskId,
      name: taskDef.name,
      description: taskDef.description,
      duration: taskDef.duration,
      onComplete: taskDef.onComplete
    };
    
    entity.queueTask(task);
    
    this.eventBus.emit('taskQueued', { entity, task });
    
    return true;
  }

  /**
   * Update all tasks (called each frame)
   * @param {number} deltaTime - Time since last update in seconds
   * @param {Array<Object>} entities - All entities with tasks
   */
  update(deltaTime, entities) {
    for (const entity of entities) {
      if (entity.type === 'building' && entity.currentTask) {
        const wasCurrent = entity.currentTask;
        entity.update(deltaTime);
        
        // Check if task was completed
        if (!entity.currentTask && wasCurrent) {
          this.handleTaskComplete(entity, wasCurrent);
        }
      }
    }
  }

  /**
   * Handle task completion
   * @param {Object} entity - Entity that completed the task
   * @param {Object} task - Completed task
   */
  handleTaskComplete(entity, task) {
    this.eventBus.emit('taskCompleted', { entity, task });
    
    if (task.onComplete) {
      task.onComplete(entity, task);
    }
  }

  /**
   * Get task definition
   * @param {string} taskId - Task ID
   * @returns {Object|null}
   */
  getTaskDefinition(taskId) {
    return this.taskDefinitions.get(taskId) || null;
  }

  /**
   * Get available tasks for an entity
   * @param {Object} entity - Entity to get tasks for
   * @returns {Array<Object>}
   */
  getAvailableTasks(entity) {
    if (entity.type !== 'building') return [];
    
    const taskIds = entity.getAvailableTasks();
    return taskIds
      .map(id => this.taskDefinitions.get(id))
      .filter(task => task !== undefined);
  }
}
