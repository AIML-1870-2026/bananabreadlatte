# Bread Chase Game - Specification Document

## Overview
A whimsical twist on the classic Snake game where a piece of bread chases banana slices and various food power-ups while avoiding a chomping mouth enemy.

---

## Core Gameplay

### Player Character
- **Type:** Piece of bread
- **Visual:** Segmented body where each segment represents a slice of bread
- **Starting Length:** 3 segments
- **Movement:** Grid-based, continuous movement in current direction
- **Controls:** Arrow keys or WASD to change direction

### Win/Loss Conditions
- **Game Over:** Chomping mouth catches bread when length is 1 segment
- **Objective:** Achieve highest score and longest bread length possible

---

## Game Elements

### Regular Food Items (Always Present)

#### Banana Slices
- **Function:** Standard food item
- **Effect:** Increases bread length by 1 segment
- **Scoring:** +10 points
- **Spawn:** Always one banana on the map
- **Respawn:** New banana appears immediately after consumption

#### Sugar Cube
- **Function:** Bonus item with risk
- **Effect:** 
  - Awards bonus points
  - **Spawns the Chomping Mouth enemy**
- **Scoring:** +50 points
- **Spawn:** Appears randomly on map
- **Risk/Reward:** High points but triggers danger

### Power-Ups (One Random at a Time)

#### Coffee Bean
- **Effect:** Super speed boost
- **Duration:** 10 seconds
- **Visual Indicator:** Coffee icon in HUD, bread has speed lines/glow
- **Scoring:** +20 points

#### Peanut Butter
- **Effect:** Slow motion (easier precision control)
- **Duration:** 10 seconds
- **Visual Indicator:** Peanut butter icon in HUD, bread has sticky/amber glow
- **Scoring:** +20 points

#### Strawberry
- **Effect:** Score multiplier (2x points for all items)
- **Duration:** 15 seconds
- **Visual Indicator:** Strawberry icon in HUD, sparkle effects on bread
- **Scoring:** +20 points

#### Cheese
- **Effect:** Invincibility - can phase through walls and mouth can't hurt you
- **Duration:** 8 seconds
- **Visual Indicator:** Cheese icon in HUD, bread has golden/translucent glow
- **Scoring:** +20 points

#### Pretzel
- **Effect:** Emergency shrink - removes one bread segment
- **Duration:** Instant (one-time use)
- **Use Case:** Escape tight spots or mouth pursuit
- **Scoring:** +15 points
- **Special:** Cannot be used if bread is only 1 segment long

### Power-Up Spawn System
- **Rule:** Only ONE power-up present on map at a time (in addition to banana)
- **Spawn Rate:** Random, new power-up appears 3-5 seconds after previous one is consumed
- **Selection:** Randomly chosen from the 5 power-up types with equal probability

---

## Enemy System

### Chomping Mouth
- **Appearance:** Pac-Man style chomping mouth
- **Trigger:** Spawns when player eats a Sugar Cube
- **Behavior:** 
  - Moves randomly across the grid
  - Gravitates toward bread head (pathfinding with randomness)
  - Movement speed: Slightly slower than normal bread speed
- **Attack:** Removes one bread segment when it catches the bread
- **Defeat Condition:** Game over if it catches bread at 1 segment length
- **Avoidance:** 
  - Can be avoided with cheese (invincibility)
  - Cannot harm bread during cheese power-up
  - CAN catch bread during plastic wrap freeze
- **Spawn Limit:** Only one mouth on map at a time
- **Persistence:** Remains on map once spawned (doesn't despawn)

---

## Map & Boundaries

### Play Area
- **Type:** Rectangular grid-based arena
- **Grid Size:** 30x30 cells (adjustable for screen size)
- **Boundaries:** Solid walls on all four sides

### Wall Design
- **Visual Theme:** Bread bag plastic wrap
- **Appearance:** 
  - Translucent plastic texture
  - Bread bag pattern/print
  - Slight shine/reflection effect
  - Twist-tie or clip graphics at corners (optional)

### Wall Collision Mechanic
- **Effect:** Bread gets encased in plastic wrap
- **Duration:** 1 second freeze
- **Behavior During Freeze:**
  - Bread is completely frozen (cannot move)
  - All controls disabled
  - Mouth CAN still catch bread during this time
  - Active power-ups continue counting down
- **Visual Effect:**
  - Plastic wrap overlay appears around entire bread body
  - Crinkle/wrapping animation
  - Bread slightly compressed/squished appearance

---

## Scoring System

### Score Display
- **Primary Score:** Total points accumulated
- **Bread Length:** Number of segments (bananas consumed)
- **Display Location:** Top of screen HUD

### Point Values
| Item | Points | Notes |
|------|--------|-------|
| Banana | +10 | Standard food |
| Sugar Cube | +50 | Spawns mouth |
| Coffee Bean | +20 | Power-up |
| Peanut Butter | +20 | Power-up |
| Strawberry | +20 | Power-up (then 2x multiplier active) |
| Cheese | +20 | Power-up |
| Pretzel | +15 | Power-up |

### Multiplier Effects
- **Strawberry Active:** All subsequent points are doubled
- **Example:** Banana = 20 points instead of 10 during strawberry effect

---

## User Interface

### HUD Elements
1. **Score Counter:** Top-left
2. **Bread Length:** Top-right (e.g., "Length: 12")
3. **Active Power-Up Indicator:** Top-center
   - Icon of active power-up
   - Countdown timer if applicable
4. **Game Title:** Center-top (optional, can fade after game starts)

### Active Power-Up Display
- **Visual:** Small icon with timer bar/countdown
- **Multiple Effects:** Stack vertically if somehow multiple are active
- **Color Coding:** Each power-up has distinct color

### Start Screen
- **Title:** "Bread Chase" or creative name
- **Instructions:** Brief control explanation
- **Start Button:** Click or press Space to begin

### Game Over Screen
- **Display:** Final score and bread length
- **High Score:** Show if new record
- **Restart Button:** Play again option

---

## Visual Effects & Polish

### Animation Effects

#### Eating Food
- **Particle burst:** Crumbs/sparkles when eating items
- **Color:** Matches the food item eaten
- **Sound:** Satisfying chomp sound (optional)

#### Bread Movement
- **Smooth interpolation:** Segments follow smoothly, not grid-jumping
- **Slight bob/bounce:** Bread has personality in movement

#### Power-Up Active
- **Glow effect:** Bread glows with power-up color
- **Trail effect:** Slight trail behind bread during coffee bean
- **Pulsing:** Breathing glow effect during active power-ups

#### Mouth Animation
- **Chomping:** Constant open/close animation
- **Movement:** Slight rotation toward bread direction
- **Catch:** Bite animation when catching bread segment

#### Plastic Wrap Freeze
- **Wrap animation:** Plastic wrapping around bread
- **Shimmer effect:** Reflective plastic appearance
- **Unwrap animation:** Plastic peeling off after 1 second

### Color Scheme
- **Bread:** Warm golden-brown tones
- **Banana:** Bright yellow
- **Sugar Cube:** White/crystalline
- **Coffee Bean:** Dark brown
- **Peanut Butter:** Creamy tan/brown
- **Strawberry:** Bright red
- **Cheese:** Yellow-orange
- **Pretzel:** Brown with salt crystals
- **Mouth:** Pink/red with white teeth
- **Background:** Light neutral (cream/beige) or checkered tablecloth pattern

---

## Technical Requirements

### Controls
- **Arrow Keys:** Up, Down, Left, Right
- **WASD:** W (up), A (left), S (down), D (right)
- **Space Bar:** Pause/unpause (optional)
- **Click/Enter:** Start game, restart after game over

### Game Loop
- **Frame Rate:** 60 FPS
- **Update Speed:** Bread moves every X frames (adjustable difficulty)
- **Grid System:** Position tracking via coordinates

### Collision Detection
- **Bread to Food:** Check head position against food positions
- **Bread to Wall:** Check if head position exceeds boundaries
- **Bread to Self:** Check if head position matches any body segment
- **Mouth to Bread:** Check if mouth position matches any bread segment

### Data Persistence
- **High Score:** Store in localStorage
- **Settings:** Save preferred controls/difficulty (optional)

---

## Difficulty & Progression

### Difficulty Options (Optional)
- **Easy:** Slower base speed, mouth moves slower
- **Normal:** Standard speeds as specified
- **Hard:** Faster base speed, mouth pathfinding more aggressive

### Progressive Difficulty (Optional)
- Speed increases slightly every 10 bananas consumed
- Sugar cubes spawn more frequently at higher scores
- Multiple mouths spawn at very high scores (advanced feature)

---

## Future Enhancement Ideas

### Potential Additions
- **Sound effects:** Eating, power-ups, collisions
- **Background music:** Upbeat, whimsical theme
- **Achievements:** Unlock badges for milestones
- **Skins:** Different bread types (bagel, croissant, etc.)
- **Game modes:** Time attack, survival with limited segments
- **Leaderboard:** Track top scores across sessions
- **Mobile support:** Touch controls for mobile devices

---

## Development Notes

### Technology Stack
- **HTML5:** Structure
- **CSS3:** Styling, animations, visual effects
- **JavaScript (Vanilla):** Game logic, no frameworks needed
- **Canvas API:** For smooth rendering and animations

### File Structure
```
bread-chase-game.html
├── Embedded CSS (in <style> tag)
├── Embedded JavaScript (in <script> tag)
└── Single file artifact for easy deployment
```

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- HTML5 Canvas support required
- localStorage for high scores

---

## Game Flow

```
1. Start Screen
   ↓
2. Player clicks Start/presses Space
   ↓
3. Game initializes (spawn bread, banana, walls)
   ↓
4. Game loop begins
   ↓
5. Player moves bread with arrow keys
   ↓
6. Bread eats banana → grows, score increases, new banana spawns
   ↓
7. Power-up spawns randomly → player collects → effect activates
   ↓
8. Player eats sugar cube → mouth spawns and chases
   ↓
9. Bread hits wall → frozen in plastic wrap for 1 second
   ↓
10. Mouth catches bread → loses one segment
    ↓
11. Continue until mouth catches 1-segment bread → Game Over
    ↓
12. Display final score and length
    ↓
13. Option to restart
```

---

## Success Criteria

The game is complete when:
- ✅ Bread moves smoothly on grid
- ✅ All food items spawn and function correctly
- ✅ All power-ups work with proper durations and effects
- ✅ Sugar cube spawns mouth enemy
- ✅ Mouth AI chases bread with random movement
- ✅ Wall collisions trigger 1-second plastic wrap freeze
- ✅ Scoring system tracks points and bread length
- ✅ Visual effects enhance polish (particles, glows, animations)
- ✅ Game over triggers correctly
- ✅ Restart functionality works
- ✅ Bread bag themed walls are visually appealing
- ✅ Controls are responsive and intuitive

---

## Design Philosophy

**Theme:** Whimsical, food-based humor
**Feel:** Light-hearted, accessible, addictive
**Challenge:** Strategic depth through power-up management and mouth avoidance
**Replayability:** High score chasing, length competition
**Polish:** Smooth animations, satisfying feedback, charming visuals

---

*End of Specification Document*
