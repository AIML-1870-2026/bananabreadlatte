# Interactive Starfield Particle System - Specification

## Overview
An interactive, animated starfield webpage featuring a 3D particle system with pastel-colored stars emanating from the center of the screen. The webpage includes a draggable, minimizable control panel for real-time customization of the animation.

## Visual Design

### Color Palette
The starfield uses a 10-color pastel palette:
- Light Pink: `rgb(255, 179, 217)`
- Light Blue: `rgb(179, 229, 252)`
- Peach: `rgb(255, 223, 186)`
- Baby Blue: `rgb(186, 225, 255)`
- Rose: `rgb(255, 200, 221)`
- Mint: `rgb(200, 255, 220)`
- Light Coral: `rgb(255, 218, 185)`
- Lavender: `rgb(221, 200, 255)`
- Light Yellow: `rgb(255, 255, 186)`
- Cyan: `rgb(186, 255, 255)`

### Background
- Black background (`#000`)
- Full-screen canvas

## Animation System

### Particle Behavior
1. **Origin Point**: All stars emanate from the center of the screen
2. **Distribution**: Stars are evenly distributed using the golden angle (φ = π(3 - √5)) for natural, spiral dispersion
3. **3D Depth Simulation**: Stars move along the z-axis from far (maximum depth) to near (z = 0)
4. **Continuous Flow**: Stars are staggered at different depths to create continuous, uninterrupted animation
5. **Recycling**: When a star reaches z = 0, it resets to maximum depth while maintaining its directional trajectory

### Visual Effects
1. **Trail Effect**: Motion blur trails behind each star using gradient strokes
2. **Size Scaling**: Stars grow larger as they approach the viewer (perspective effect)
3. **Brightness Scaling**: Stars become brighter as they get closer
4. **Glow Effect**: Stars in the closest third of depth range have radial gradient glow halos
5. **Color Variation**: Each star randomly assigned one pastel color from the palette

### Mathematical Implementation
- **Perspective Projection**: `scale = depth / z`
- **Screen Position**: `x = particleX × scale + centerX`
- **Depth Factor**: `(1 - z / maxDepth)` - controls brightness and size
- **Golden Angle Distribution**: `angle = index × goldenAngle + randomOffset`

## Control Panel

### Design
- **Position**: Fixed, top-right corner (initially)
- **Style**:
  - Semi-transparent background: `rgba(20, 20, 30, 0.3)`
  - Light pink text: `#ffb3d9`
  - Backdrop blur: 5px
  - Rounded corners: 8px border-radius
  - Compact size: 220px min-width, 12px padding

### Functionality
1. **Draggable**: Can be repositioned anywhere on screen by clicking and dragging
2. **Minimizable**: Toggle button (−/+) to collapse/expand the control content
3. **Touch Support**: Works on both desktop and mobile devices

### Controls (6 Sliders)

#### 1. Star Count
- Range: 100 - 2000
- Default: 500
- Step: 50
- Effect: Adjusts number of particles in the system

#### 2. Speed
- Range: 0.1 - 5.0
- Default: 1.0
- Step: 0.1
- Effect: Controls animation velocity (z-axis movement)

#### 3. Trail Length
- Range: 0 - 150
- Default: 50
- Step: 5
- Effect: Modifies motion blur trail length

#### 4. Star Size
- Range: 0.5 - 4.0
- Default: 1.5
- Step: 0.1
- Effect: Changes base particle size

#### 5. Depth Effect
- Range: 500 - 2000
- Default: 1000
- Step: 100
- Effect: Adjusts 3D depth perception range

#### 6. Trail Opacity
- Range: 0.1 - 1.0
- Default: 0.8
- Step: 0.1
- Effect: Controls transparency of motion trails

### Reset Button
- Restores all parameters to default values
- Regenerates star positions

## Technical Implementation

### Canvas Rendering
- Full viewport dimensions
- Responsive (resizes with window)
- 2D rendering context
- requestAnimationFrame for smooth 60fps animation

### Particle System Architecture
- Object-oriented Star class
- Each star tracks:
  - Current position (x, y, z)
  - Previous position (for trails)
  - Color assignment
  - Index and total count (for distribution)

### Performance Considerations
- Trail effect achieved through semi-transparent black overlay
- Culling: Stars outside viewport bounds (±100px margin) are not drawn
- Efficient gradient creation for trails and glows

### Browser Compatibility
- Standard HTML5 Canvas
- CSS3 for styling and effects
- Vanilla JavaScript (no dependencies)
- Touch event support for mobile

## User Interactions

### Primary Actions
1. **View**: Experience the continuous starfield animation
2. **Adjust**: Use sliders to customize appearance in real-time
3. **Move Panel**: Click and drag control panel to reposition
4. **Minimize**: Toggle panel visibility with −/+ button
5. **Reset**: Return to default settings with reset button

### Interaction States
- Slider hover: Thumb scales to 1.2x and changes to lighter pink
- Reset button hover: Background lightens
- Toggle button hover: Color shifts to lighter pink, scales to 1.2x
- Drag cursor: Move cursor when hovering over draggable areas

## File Structure
- Single HTML file containing:
  - CSS styles (embedded)
  - JavaScript logic (embedded)
  - Canvas element
  - Control panel UI
  - Info footer text

## Responsive Design
- Adapts to any screen size
- Touch-friendly controls for mobile devices
- Panel remains accessible and functional at all viewports

## Accessibility Notes
- High contrast between text and background (light pink on dark semi-transparent)
- Clear visual feedback for all interactions
- Smooth transitions for UI state changes
- Real-time value displays next to each slider

## Performance Specifications
- Target: 60 FPS
- Default particle count: 500 (adjustable)
- Smooth animation even at maximum particle count (2000)
- Minimal CPU overhead through efficient rendering techniques
