/**
 * Test Game - Main game initialization
 */

import {
  HexGrid,
  GameLoop,
  EventBus,
  InputHandler,
  Renderer,
  SpriteManager,
  SelectionSystem,
  TaskSystem,
  PathfindingSystem,
  Terrain,
  Building,
  Unit,
  ConfigLoader
} from '../../../engine/src/index.js';

class TestGame {
  constructor() {
    this.canvas = null;
    this.eventBus = null;
    this.hexGrid = null;
    this.spriteManager = null;
    this.renderer = null;
    this.inputHandler = null;
    this.gameLoop = null;
    this.selectionSystem = null;
    this.taskSystem = null;
    this.pathfindingSystem = null;
    
    this.terrainTypes = new Map();
    this.buildingTypes = new Map();
    this.unitTypes = new Map();
    this.entities = [];
    
    this.resources = 0;
    this.uiPanel = null;
  }

  async init() {
    console.log('Initializing Test Game...');
    
    // Get canvas
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }
    
    // Resize canvas to window
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Initialize event bus
    this.eventBus = new EventBus();
    
    // Initialize task system (needed for loadConfigurations)
    this.taskSystem = new TaskSystem(this.eventBus);
    
    // Load configurations
    await this.loadConfigurations();
    
    // Initialize hex grid
    this.hexGrid = new HexGrid(20, 15, 32, true);
    
    // Initialize sprite manager
    this.spriteManager = new SpriteManager();
    await this.createPlaceholderSprites();
    
    // Initialize renderer
    this.renderer = new Renderer(this.canvas, this.hexGrid, this.spriteManager);
    
    // Center camera
    this.renderer.setCameraPosition(100, 100);
    
    // Initialize input handler
    this.inputHandler = new InputHandler(this.canvas, this.eventBus);
    
    // Initialize remaining systems
    this.selectionSystem = new SelectionSystem(this.hexGrid, this.eventBus, this.renderer);
    this.pathfindingSystem = new PathfindingSystem(this.hexGrid);
    
    // Load map
    await this.loadMap();
    
    // Setup UI
    this.setupUI();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize game loop
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      (alpha) => this.render(alpha)
    );
    
    console.log('Test Game initialized!');
    
    // Start game loop
    this.gameLoop.start();
  }

  async loadConfigurations() {
    console.log('Loading configurations...');
    
    const configs = await ConfigLoader.loadMultiple({
      terrain: 'config/terrain.json',
      buildings: 'config/buildings.json',
      units: 'config/units.json',
      gameRules: 'config/game-rules.json'
    });
    
    // Store terrain types
    Object.entries(configs.terrain).forEach(([id, config]) => {
      this.terrainTypes.set(id, new Terrain(id, config));
    });
    
    // Store building types
    Object.entries(configs.buildings).forEach(([id, config]) => {
      this.buildingTypes.set(id, config);
    });
    
    // Store unit types
    Object.entries(configs.units).forEach(([id, config]) => {
      this.unitTypes.set(id, config);
    });
    
    // Register tasks
    this.taskSystem.registerTasks(configs.gameRules.tasks);
    
    console.log('Configurations loaded');
  }

  async createPlaceholderSprites() {
    console.log('Creating placeholder sprites...');
    
    // Terrain sprites - use hexagonal shape with size matching the hex grid
    const hexSize = 32; // Match the hex grid size
    this.spriteManager.createHexagonalSprite('terrain_grass', hexSize, '#90EE90', true);
    this.spriteManager.createHexagonalSprite('terrain_forest', hexSize, '#228B22', true);
    this.spriteManager.createHexagonalSprite('terrain_mountain', hexSize, '#A9A9A9', true);
    this.spriteManager.createHexagonalSprite('terrain_water', hexSize, '#4169E1', true);
    this.spriteManager.createHexagonalSprite('terrain_road', hexSize, '#8B4513', true);
    
    // Building sprites - keep as colored squares
    this.spriteManager.createColoredSprite('building_town_hall', 32, 32, '#FFD700');
    this.spriteManager.createColoredSprite('building_farm', 32, 32, '#8B4513');
    this.spriteManager.createColoredSprite('building_barracks', 32, 32, '#DC143C');
    this.spriteManager.createColoredSprite('building_mine', 32, 32, '#696969');
    
    // Unit sprites - keep as colored squares
    this.spriteManager.createColoredSprite('unit_worker', 24, 24, '#FFFF00');
    this.spriteManager.createColoredSprite('unit_scout', 24, 24, '#00FF00');
    this.spriteManager.createColoredSprite('unit_soldier', 24, 24, '#FF0000');
    
    console.log('Placeholder sprites created');
  }

  async loadMap() {
    console.log('Loading map...');
    
    const mapData = await ConfigLoader.loadMap('assets/maps/default-map.json');
    
    // Load terrain
    mapData.hexes.forEach(hexData => {
      const terrain = this.terrainTypes.get(hexData.terrain);
      if (terrain) {
        this.hexGrid.setTerrain(hexData.q, hexData.r, terrain);
      }
    });
    
    // Load entities
    mapData.entities.forEach(entityData => {
      if (entityData.type === 'building') {
        const config = this.buildingTypes.get(entityData.id);
        if (config) {
          const building = new Building(entityData.id, config);
          this.hexGrid.setEntity(entityData.q, entityData.r, building);
          this.entities.push(building);
        }
      } else if (entityData.type === 'unit') {
        const config = this.unitTypes.get(entityData.id);
        if (config) {
          const unit = new Unit(entityData.id, config);
          this.hexGrid.setEntity(entityData.q, entityData.r, unit);
          this.entities.push(unit);
        }
      }
    });
    
    console.log('Map loaded');
  }

  setupUI() {
    this.uiPanel = document.getElementById('uiPanel');
    this.updateUI();
  }

  setupEventListeners() {
    // Entity selection
    this.eventBus.on('entitySelected', (data) => {
      console.log('Entity selected:', data.entity);
      this.updateUI();
    });
    
    this.eventBus.on('entityDeselected', () => {
      console.log('Entity deselected');
      this.updateUI();
    });
    
    // Task events
    this.eventBus.on('taskQueued', (data) => {
      console.log('Task queued:', data.task.name);
      this.updateUI();
    });
    
    this.eventBus.on('taskCompleted', (data) => {
      console.log('Task completed:', data.task.name);
      this.resources += 10;
      this.updateUI();
    });
    
    // Camera controls
    this.eventBus.on('drag', (data) => {
      this.renderer.moveCamera(data.dx, data.dy);
    });
    
    this.eventBus.on('wheel', (data) => {
      const zoomDelta = data.deltaY > 0 ? -0.1 : 0.1;
      this.renderer.setZoom(zoomDelta, data.x, data.y);
    });
    
    // Keyboard shortcuts
    this.eventBus.on('keyDown', (data) => {
      if (data.key === ' ') {
        this.gameLoop.togglePause();
      }
    });
  }

  updateUI() {
    if (!this.uiPanel) return;
    
    const selectedEntity = this.selectionSystem.getSelectedEntity();
    
    let html = `
      <div style="padding: 10px; background: rgba(0,0,0,0.7); color: white; font-family: monospace;">
        <h2>Test Game</h2>
        <p>Resources: ${this.resources}</p>
        <p>Entities: ${this.entities.length}</p>
        <hr>
    `;
    
    if (selectedEntity) {
      html += `
        <h3>Selected: ${selectedEntity.name || selectedEntity.id}</h3>
        <p>Type: ${selectedEntity.type}</p>
        <p>Position: (${selectedEntity.q}, ${selectedEntity.r})</p>
      `;
      
      if (selectedEntity.type === 'building') {
        html += '<h4>Available Tasks:</h4>';
        const tasks = this.taskSystem.getAvailableTasks(selectedEntity);
        tasks.forEach(task => {
          html += `
            <button onclick="window.game.startTask('${task.id}')" style="display: block; margin: 5px 0; padding: 5px;">
              ${task.name} (${task.duration}s)
            </button>
          `;
        });
        
        if (selectedEntity.currentTask) {
          html += `
            <hr>
            <h4>Current Task:</h4>
            <p>${selectedEntity.currentTask.name}</p>
            <p>Progress: ${Math.floor((selectedEntity.currentTask.progress / selectedEntity.currentTask.duration) * 100)}%</p>
          `;
        }
        
        if (selectedEntity.taskQueue.length > 0) {
          html += `<p>Queue: ${selectedEntity.taskQueue.length} task(s)</p>`;
        }
      }
    } else {
      html += '<p>Click on a building or unit to select it</p>';
    }
    
    html += `
        <hr>
        <p style="font-size: 0.8em;">
          Controls:<br>
          - Click to select<br>
          - Drag to pan camera<br>
          - Scroll to zoom<br>
          - Space to pause
        </p>
      </div>
    `;
    
    this.uiPanel.innerHTML = html;
  }

  startTask(taskId) {
    const selectedEntity = this.selectionSystem.getSelectedEntity();
    if (selectedEntity && selectedEntity.type === 'building') {
      this.taskSystem.startTask(selectedEntity, taskId);
    }
  }

  update(deltaTime) {
    // Update task system
    this.taskSystem.update(deltaTime, this.entities);
    
    // Update entities
    this.entities.forEach(entity => {
      entity.update(deltaTime);
    });
    
    // Update UI if there's a selected entity with a current task
    const selectedEntity = this.selectionSystem.getSelectedEntity();
    if (selectedEntity && selectedEntity.type === 'building' && selectedEntity.currentTask) {
      this.updateUI();
    }
  }

  render(alpha) {
    this.renderer.render();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth - 300;
    this.canvas.height = window.innerHeight;
  }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const game = new TestGame();
    window.game = game; // Make accessible for UI buttons
    await game.init();
  } catch (error) {
    console.error('Failed to initialize game:', error);
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace;">
        <h1>Error</h1>
        <pre>${error.message}\n${error.stack}</pre>
      </div>
    `;
  }
});
