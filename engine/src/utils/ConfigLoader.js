/**
 * ConfigLoader - Load game configurations from JSON files
 */

export class ConfigLoader {
  /**
   * Load a JSON configuration file
   * @param {string} url - URL to the JSON file
   * @returns {Promise<Object>}
   */
  static async loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading configuration from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Load multiple JSON files
   * @param {Object} urls - Object with keys and URLs
   * @returns {Promise<Object>}
   */
  static async loadMultiple(urls) {
    const entries = Object.entries(urls);
    const promises = entries.map(([key, url]) => 
      this.loadJSON(url).then(data => [key, data])
    );
    
    const results = await Promise.all(promises);
    return Object.fromEntries(results);
  }

  /**
   * Load terrain configuration
   * @param {string} url - URL to terrain.json
   * @returns {Promise<Object>}
   */
  static async loadTerrain(url) {
    return this.loadJSON(url);
  }

  /**
   * Load buildings configuration
   * @param {string} url - URL to buildings.json
   * @returns {Promise<Object>}
   */
  static async loadBuildings(url) {
    return this.loadJSON(url);
  }

  /**
   * Load units configuration
   * @param {string} url - URL to units.json
   * @returns {Promise<Object>}
   */
  static async loadUnits(url) {
    return this.loadJSON(url);
  }

  /**
   * Load map data
   * @param {string} url - URL to map JSON file
   * @returns {Promise<Object>}
   */
  static async loadMap(url) {
    return this.loadJSON(url);
  }

  /**
   * Load game rules
   * @param {string} url - URL to game-rules.json
   * @returns {Promise<Object>}
   */
  static async loadGameRules(url) {
    return this.loadJSON(url);
  }
}
