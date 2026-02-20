# Boids Simulation Lab Specification

## Overview
An interactive emergent flocking simulation based on Craig Reynolds' Boids algorithm, rendered on an HTML5 Canvas with a real-time control panel.

## Requirements

### Core Requirements
1. **Boids Flocking**: Simulate autonomous agents (boids) exhibiting emergent flocking behavior via three classic steering rules — separation, alignment, and cohesion
2. **Real-Time Controls**: Provide a sidebar panel with sliders and toggles to adjust simulation parameters live
3. **Canvas Rendering**: Render boids as directional triangles on a full-height canvas with optional motion trails

### Technical Requirements
- Single HTML file (HTML + CSS + JavaScript)
- HTML5 Canvas for rendering
- No external dependencies (aside from Google Fonts)
- Responsive canvas sizing on window resize

## Implementation

### Completed Features

#### Core Steering Behaviors
- ✅ **Separation** — Repulsion force to avoid crowding nearby boids (weight 0–3)
- ✅ **Alignment** — Steer to match the average heading of neighbors (weight 0–3)
- ✅ **Cohesion** — Steer toward the average position of neighbors (weight 0–3)
- ✅ Adjustable neighbor perception radius (10–150px)
- ✅ Configurable max speed and max steering force

#### Advanced Features
- ✅ **Perception Cone** — Optional FOV-limited vision (60°–360°) with visual arc overlay
- ✅ **Obstacle Avoidance** — Three static circular obstacles with adjustable avoidance weight
- ✅ **Leader Following** — Designate a leader boid that the flock steers toward
- ✅ **Predator Evasion** — A predator agent chases the nearest boid; flock flees within range
- ✅ **Mouse Following** — Boids attract toward the cursor position when hovering over the canvas

#### Environment
- ✅ **Boundary Modes** — Toggle between wrap-around and bounce-off-walls
- ✅ **Boid Count** — Adjustable population (10–300), triggers simulation reset on change

#### Behavior Presets
- ✅ **Schooling** — Tight alignment and cohesion for fish-like movement
- ✅ **Chaotic** — High separation, low alignment for scattered behavior
- ✅ **Cluster** — Strong cohesion for dense group formation

#### Appearance & UI
- ✅ Dark sci-fi themed UI with Orbitron and Roboto Mono fonts
- ✅ Customizable boid, leader, and predator colors via color pickers
- ✅ Adjustable motion trail intensity (0–100)
- ✅ Stats overlay showing FPS, boid count, average speed, and average neighbors
- ✅ Canvas legend identifying boid types and mouse target indicator
- ✅ Pause/Resume and Reset controls

#### Rendering
- ✅ Directional triangle rendering with glow effects
- ✅ Perception cone visualization when FOV mode is active
- ✅ Mouse target indicator with animated concentric rings
- ✅ Obstacle rendering with semi-transparent fill and stroke
- ✅ Partial-clear trail effect for motion blur

## Live URL
https://aiml-1870-2026.github.io/bananabreadlatte/Boids/
