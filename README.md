# Monash - Hex-Based Game Engine

A web-based, real-time hex map game engine with a modular architecture that separates the core engine from game-specific implementations.

## Project Structure

```
monash/
├── engine/                    # Core game engine (reusable)
│   └── src/
│       ├── core/              # Core game systems
│       ├── entities/          # Entity classes
│       ├── rendering/         # Rendering system
│       ├── systems/           # Game systems (selection, tasks, pathfinding)
│       └── utils/             # Utility functions
│
└── games/                     # Game implementations
    └── test-game/             # Test game demonstration
        ├── config/            # Game configuration files
        ├── assets/            # Game assets and maps
        └── src/               # Game-specific code
```

## Features

- **Hex Grid System**: Axial coordinate system with full hex math utilities
- **Real-Time Game Loop**: Fixed time-step game loop for smooth gameplay
- **Entity System**: Buildings, units, and terrain with configurable properties
- **Rendering**: Canvas-based rendering with camera controls (pan, zoom)
- **Selection System**: Click to select buildings and units
- **Task System**: Buildings can queue and execute tasks over time
- **Pathfinding**: A* pathfinding for hex grids
- **Configuration-Based**: JSON configuration for terrain, buildings, units, and game rules

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install engine dependencies:
```bash
cd engine
npm install
```

2. Install test game dependencies:
```bash
cd games/test-game
npm install
```

### Running the Test Game

1. Start the development server:
```bash
cd games/test-game
npm run dev
```

2. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Controls

- **Click**: Select buildings or units
- **Drag**: Pan the camera
- **Scroll**: Zoom in/out
- **Space**: Pause/resume the game

## Test Game

The included test game demonstrates all core features:

- **Buildings**: Town Hall, Farm, Barracks, Mine
- **Units**: Worker, Scout, Soldier
- **Terrain**: Grassland, Forest, Mountain, Water, Road
- **Tasks**: Train units, harvest resources, extract ore

Click on buildings to see available tasks and start them. Tasks process in real-time and can be queued.

## Engine Architecture

### Core Systems

- **HexGrid**: Manages hex map and coordinate conversions
- **GameLoop**: Fixed time-step game loop at 60 FPS
- **EventBus**: Pub/sub event system for game events
- **InputHandler**: Mouse and keyboard input processing

### Entity Types

- **Entity**: Base class for all game entities
- **Terrain**: Terrain types with traits (passable, movement cost, etc.)
- **Building**: Buildings with task queues
- **Unit**: Units with movement and states

### Game Systems

- **SelectionSystem**: Handle entity selection and highlighting
- **TaskSystem**: Manage building tasks and execution
- **PathfindingSystem**: A* pathfinding for units

### Rendering

- **Renderer**: Main rendering engine with camera controls
- **HexRenderer**: Hex-specific drawing utilities
- **SpriteManager**: Load and manage sprite assets

## Configuration

Games are configured via JSON files:

- `terrain.json`: Define terrain types and properties
- `buildings.json`: Define building types and available tasks
- `units.json`: Define unit types and attributes
- `game-rules.json`: Define tasks and victory conditions
- `default-map.json`: Define the game map layout

## Development

### Building the Engine

```bash
cd engine
npm run build
```

### Building the Test Game

```bash
cd games/test-game
npm run build
```

## License

MIT
