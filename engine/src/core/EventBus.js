/**
 * EventBus - Simple pub/sub event system for game events
 */

export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    
    this.listeners.get(eventName).push(callback);

    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function to remove
   */
  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return;

    const callbacks = this.listeners.get(eventName);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }

    if (callbacks.length === 0) {
      this.listeners.delete(eventName);
    }
  }

  /**
   * Emit an event
   * @param {string} eventName - Name of the event
   * @param {*} data - Event data
   */
  emit(eventName, data) {
    if (!this.listeners.has(eventName)) return;

    const callbacks = this.listeners.get(eventName);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventName}:`, error);
      }
    });
  }

  /**
   * Subscribe to an event once
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   */
  once(eventName, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(eventName, onceCallback);
    };
    
    this.on(eventName, onceCallback);
  }

  /**
   * Clear all listeners or listeners for a specific event
   * @param {string} [eventName] - Optional event name to clear
   */
  clear(eventName) {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }
}
