# Stellar Web - Interactive 3D Particle Network System

## Project Overview
The Stellar Web is an interactive 3D particle network visualization that creates a dynamic web of connected nodes in three-dimensional space. Users can control various parameters through interactive sliders to customize the appearance and behavior of the network.

## Visual Description
The Stellar Web displays a network of colorful particles (nodes) floating in 3D space, connected by dynamic edges that form and break as nodes move. The system creates a living, breathing web of connections with the following visual characteristics:

- **Nodes**: Colorful glowing particles in 3D space
- **Edges**: Lines connecting nearby nodes, creating a web-like structure
- **3D Depth**: Particles appear larger and brighter when closer to the viewer
- **Dynamic Motion**: Nodes continuously drift through space, causing the web to constantly reconfigure
- **Interactive Mouse Control**: Nodes respond to mouse position with attraction or repulsion forces

## Technical Features

### Core Particle System
1. **3D Space Simulation**
   - Nodes positioned in 3D coordinates (x, y, z)
   - Perspective projection to 2D screen space
   - Depth-based size and opacity scaling
   - Wrap-around boundaries for continuous motion

2. **Dynamic Edge Connections**
   - Edges drawn between nodes within connectivity radius
   - Distance-based opacity (closer connections are more visible)
   - Color gradients blending between connected nodes
   - Depth-aware thickness and opacity

3. **Visual Effects**
   - Pulsing animation for nodes and edges
   - Velocity-based color intensity
   - Glowing halos around nodes
   - Bright cores for highly-connected nodes
   - Non-linear depth effects for dramatic perspective

### Interactive Controls

The system provides 12 adjustable parameters via sliders:

1. **Node Count** (20-300)
   - Controls the number of particles in the system
   - Default: 100

2. **Node Size** (1-8)
   - Base size of each particle
   - Default: 3

3. **Movement Speed** (0-2)
   - Controls how fast nodes move through space
   - Default: 0.5

4. **Connectivity Radius** (50-300)
   - Maximum distance for drawing edges between nodes
   - Dramatically affects network density
   - Default: 150

5. **Edge Thickness** (0.5-4)
   - Width of connection lines
   - Default: 1.5

6. **Edge Opacity** (0.1-1)
   - Transparency of edges
   - Default: 0.4

7. **Node Opacity** (0.1-1)
   - Transparency of nodes
   - Default: 0.8

8. **3D Depth Range** (200-1000)
   - How deep the 3D space extends
   - Default: 600

9. **Rotation Speed** (0-1)
   - Adds subtle 3D rotation to the entire system
   - Default: 0.2

10. **Node Glow Intensity** (0-1)
    - Controls how much nodes glow
    - Default: 0.5

11. **Pulse Speed** (0-3)
    - Speed of pulsing animation
    - 0 disables pulsing
    - Default: 1.0

12. **Mouse Interaction** (-2 to 2)
    - Positive values: Mouse attracts nodes
    - Negative values: Mouse repels nodes
    - 0: No mouse interaction
    - Default: 1.0 (Attract)

### Mouse Interaction
- **Move Mouse**: Attract or repel nodes based on slider setting
- **Mouse Wheel**: Control Z-axis depth for 3D interaction
- **Leave Canvas**: Deactivates mouse interaction

### Network Statistics Panel

Real-time statistics displayed in top-left corner:

1. **Total Edges**: Current number of connections
2. **Avg Connections**: Average connections per node
3. **Network Density**: Percentage of possible connections (shows connectivity)
4. **Active Nodes**: Current node count
5. **FPS**: Performance monitoring

### User Interface

1. **Collapsible Side Panel**
   - Slides in from the right
   - "Controls" toggle button on right edge
   - Doesn't cover the animation when hidden
   - Smooth transitions

2. **Statistics Panel**
   - Fixed position, top-left
   - Transparent background with blur effect
   - Real-time updates

3. **Reset Button**
   - Restores all parameters to default values

## Color Palette

The system uses six vibrant colors for nodes:
- Cyan (#4DD4FF)
- Blue (#8AB4F8)
- Purple (#B48EFF)
- Pink (#FF8AC8)
- Mint (#8AFFC8)
- Orange (#FFC88A)

## Technical Implementation

### Performance Optimizations
- Efficient O(n²) edge detection with early exit
- Depth sorting for proper rendering
- FPS monitoring and display
- Smooth velocity damping for natural motion

### Visual Enhancements
- **Color Gradients**: Based on edge length and node velocity
- **Depth Effects**: Non-linear scaling for dramatic perspective
- **Pulsing**: Individual phase offsets create wave patterns
- **Connection Highlighting**: Nodes with many connections get bright cores

### Physics
- Velocity-based movement with damping
- Mouse force fields (attraction/repulsion)
- 3D rotation simulation
- Boundary wrapping for infinite space effect

## Use Cases

1. **Network Visualization**: Understanding how connectivity radius affects network density
2. **Artistic Display**: Creating mesmerizing animated backgrounds
3. **Educational Tool**: Demonstrating particle systems and 3D rendering
4. **Interactive Art**: Real-time manipulation of complex systems
5. **Performance Testing**: Monitoring FPS with different parameter settings

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- Hardware acceleration recommended for smooth performance
- Mouse wheel events for Z-axis interaction
- Responsive design adapts to window size

## File Structure

```
stellar-web.html - Complete single-file application
├── CSS Styles (embedded)
│   ├── Controls panel
│   ├── Statistics panel
│   ├── Toggle button
│   └── Custom scrollbar
└── JavaScript (embedded)
    ├── Canvas setup
    ├── Node class
    ├── Edge rendering
    ├── Statistics calculation
    ├── Animation loop
    ├── Mouse interaction
    └── Control handlers
```

## Credits

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

## Live Demo

View the live demo at:
https://aiml-1870-2026.github.io/bananabreadlatte/stellar-web.html
