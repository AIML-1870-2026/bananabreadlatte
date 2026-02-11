# Julia Set Explorer - Technical Specification

## Project Overview
A web-based Julia Set fractal explorer designed for creating beautiful visualizations with real-time parameter control and artistic color customization.

**Design Theme**: Labubu × Dubai Chocolate × Matcha - Cute, kawaii aesthetic with soft pastels, rounded corners, and playful charm inspired by Labubu monsters, luxury Dubai chocolate vibes, and serene matcha aesthetics.

## Target Audience
Artists and creative individuals interested in generating beautiful fractal visualizations for artistic purposes.

## Core Requirements

### 1. Rendering Engine
- **Algorithm**: Escape-time algorithm for Julia set computation
- **Formula**: z_{n+1} = z_n^2 + c, where c is the complex parameter
- **Iterations**: Configurable max iterations (default: 256, range: 50-1000)
- **Smooth Coloring**: Implement continuous/smooth coloring algorithm to eliminate banding
  - Use normalized iteration count: `n + 1 - log(log(|z|))/log(2)`
  - Provides smooth gradients instead of discrete bands

### 2. Canvas & Display
- **Resolution**: 800x800px canvas (adjustable via settings)
- **Aspect Ratio**: Square (1:1) for aesthetic consistency
- **Rendering**: HTML5 Canvas with 2D context
- **Performance**: Render on parameter change with minimal lag (<500ms target)

### 3. Parameter Controls

#### Complex Parameter (c = a + bi)
- **Real Part (a)**: Slider, range [-2.0, 2.0], step 0.001, default 0.355
- **Imaginary Part (b)**: Slider, range [-2.0, 2.0], step 0.001, default 0.355
- **Live Preview**: Update fractal in real-time as sliders move
- **Precise Input**: Optional text input fields for exact values
- **Random Button**: Generate random interesting c values

#### View Controls
- **Zoom Level**: Default view shows approximately -2 to 2 on both axes
- **Pan**: Click and drag to pan the view
- **Reset View**: Button to return to default zoom/pan
- **Mouse Wheel Zoom**: Scroll to zoom in/out (optional enhancement)

### 4. Color Scheme System

#### Design Theme Integration
The color palettes should evoke the Labubu × Dubai Chocolate × Matcha aesthetic:
- Soft, dreamy pastels mixed with rich chocolate tones
- Creamy matcha greens and gentle earth tones
- Luxurious gold/rose gold accents
- Kawaii monster-inspired playful colors

#### Palette Options
Provide themed color schemes:
1. **Labubu Dream** - Soft pink, lavender, baby blue with creamy whites (default)
2. **Dubai Luxe** - Rich chocolate browns, gold, caramel, rose gold
3. **Matcha Latte** - Creamy matcha green, vanilla cream, soft beige
4. **Pistachio Velvet** - Pistachio green, cream, soft gold (Dubai chocolate filling vibes)
5. **Strawberry Milk** - Pink, peachy cream, soft coral
6. **Ube Cloud** - Purple ube, lavender, white cream

#### Color Customization
- **Palette Selector**: Cute button grid with rounded corners and emoji/icon indicators
- **Color Gradient**: Display the current gradient visually with soft glow effect
- **Interior Color**: Separate control for points inside the set (suggest soft pastels, not harsh black)
- **Gradient Speed**: Control how fast colors cycle (multiplier on iteration count)

#### Color Mapping
- Map normalized iteration count to color gradient
- Use smooth interpolation between gradient stops with soft transitions
- Support gradient reversal (optional)
- Consider adding subtle glow/blur effects for extra softness

### 5. Preset Gallery
Provide 6-8 interesting Julia set presets with cute, themed names:
- **Pistachio Swirl** 🌀: c = 0.0 + 0.8i (dendrite pattern)
- **Chocolate Dream** 🍫: c = -0.75 + 0.0i (San Marco)
- **Matcha Spiral** 🍵: c = 0.285 + 0.01i
- **Strawberry Bunny** 🐰: c = -0.123 + 0.745i (Douady rabbit)
- **Ube Dragon** 🐉: c = -0.8 + 0.156i
- **Rose Gold Dust** ✨: c = 0.355 + 0.355i
- **Velvet Cloud** ☁️: c = -0.54 + 0.54i
- **Golden Swirl** 🌟: c = -0.391 - 0.587i (Siegel disk)

Each preset should:
- Show a cute rounded thumbnail preview with soft shadow
- Display emoji + cute name below thumbnail
- Gentle hover animation (lift + glow)
- Load both c parameters and optimal zoom when clicked
- Render with the default "Labubu Dream" palette initially

### 6. Export Functionality

#### Image Export
- **Format**: PNG (high quality, lossless)
- **Resolution Options**:
  - Current canvas size (800x800)
  - High-res (2000x2000)
  - Ultra-res (4000x4000) - may take longer to generate
- **Filename**: Auto-generate based on parameters, e.g., `julia_0.355_0.355_cosmic.png`
- **Download Button**: Clear, prominent export button

#### Settings Export (Optional)
- **JSON Export**: Save current parameters, colors, zoom state
- **JSON Import**: Load previously saved configurations

### 7. User Interface Layout

```
┌─────────────────────────────────────────────────┐
│    ✨ Julia Set Explorer ✨ 🍫🍵              │
│         (cute title with emoji/icons)           │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│   Controls   │         Canvas Area              │
│   Sidebar    │         (800x800)                │
│   (Rounded)  │      (Soft rounded corners)      │
│              │      (Subtle shadow/glow)        │
│  🎨 Params   │                                  │
│  🌈 Colors   │                                  │
│  ⭐ Presets  │                                  │
│  💾 Export   │                                  │
│              │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

#### Visual Design Language - Labubu Kawaii Aesthetic

**Typography:**
- Primary font: Rounded sans-serif (like Quicksand, Nunito, or Poppins)
- Soft, friendly letterforms
- Slightly increased letter-spacing for airiness
- Medium weight for readability, bold for headings

**Color Palette (UI elements):**
- Background: Soft cream/off-white (#FFF8F0 or similar warm white)
- Sidebar: Very light pastel pink/lavender (#FFF5F7 or #F8F5FF)
- Accents: Soft matcha green (#D4E7C5) and rose gold (#E8C4B8)
- Text: Warm dark brown (#4A3428) instead of black
- Borders: Very soft, barely-there borders in light pastels

**Shapes & Elements:**
- Border radius: 16-24px for all containers (very rounded!)
- Buttons: Pill-shaped (full rounded) with 12-16px padding
- Sliders: Chunky, rounded track with circular thumb
- Cards: Soft shadows (0 4px 12px rgba(0,0,0,0.06))
- Icons: Rounded style icons or cute emoji

**Interactive Elements:**
- Hover: Gentle scale (1.02-1.05) and subtle glow
- Active: Soft press effect (scale 0.98)
- Transitions: Smooth, 200-300ms ease-out
- Focus: Soft colored outline instead of harsh blue

**Decorative Elements:**
- Subtle sparkles ✨ or stars ⭐ near title
- Small Labubu-style monster doodles as section dividers (optional)
- Soft gradient backgrounds (linear or radial)
- Frosted glass effect (backdrop-filter) for overlays

#### Control Panel (Left Sidebar, ~320px wide)
Organized in soft, rounded card sections with gentle spacing:

1. **🎨 Parameters**
   - Cute emoji headers for each section
   - Real (a) slider + input (rounded inputs)
   - Imaginary (b) slider + input
   - "✨ Surprise Me" button (instead of "Random")
   - Max iterations slider with playful labels

2. **🌈 Colors**
   - Grid of circular palette buttons with previews
   - Smooth gradient preview bar (rounded, glowing)
   - Interior color: Soft color picker circle
   - "Speed" slider with cute labels (Slow 🐌 → Fast 🚀)

3. **⭐ Presets**
   - Grid of preset cards (2 columns)
   - Rounded thumbnail previews with soft shadows
   - Cute names displayed below thumbnails
   - Hover effect: lift and glow

4. **💾 Export**
   - Resolution buttons (pill-shaped, inline)
   - Large, friendly "Download ⬇️" button
   - Show parameters in cute pill badges

#### Canvas Area (Main)
- Rounded corners (16px)
- Soft drop shadow for depth
- Subtle border in complementary pastel
- Loading: Cute spinner or animated Labubu character
- Optional: Small coordinate display in bottom corner (rounded pill)

**Background Pattern** (optional):
- Very subtle repeating pattern of tiny stars, hearts, or abstract shapes
- Or soft gradient background (cream to light matcha/pink)

### 8. Technical Stack

#### Recommended Technologies
- **Framework**: React (for component state management) OR vanilla JavaScript
- **Canvas**: HTML5 Canvas 2D API
- **Styling**: CSS3 with Flexbox/Grid
- **Fonts**: Google Fonts (Quicksand, Nunito, or Poppins for rounded look)
- **Icons**: Emoji (native) or rounded icon set (Phosphor, Lucide with rounded variant)
- **No external dependencies** for fractal computation (pure JS)

#### CSS Design Tokens (for consistency)
```css
/* Color Palette */
--cream-bg: #FFF8F0;
--pastel-pink: #FFF5F7;
--pastel-lavender: #F8F5FF;
--matcha: #D4E7C5;
--rose-gold: #E8C4B8;
--chocolate: #8B6F47;
--warm-brown: #4A3428;

/* Spacing (multiples of 8) */
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;

/* Border Radius */
--radius-sm: 12px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-full: 9999px;

/* Shadows */
--shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.06);
--shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.08);
--shadow-glow: 0 0 24px rgba(232, 196, 184, 0.3);

/* Transitions */
--transition-fast: 150ms ease-out;
--transition-base: 250ms ease-out;
```

#### File Structure
```
/src
  /components
    - Canvas.jsx (or .js)
    - ControlPanel.jsx
    - ColorPicker.jsx
    - PresetGallery.jsx
    - ExportDialog.jsx
  /utils
    - juliaSet.js (computation logic)
    - colorUtils.js (gradient generation)
    - presets.js (preset definitions)
  /styles
    - main.css
  - App.jsx (or index.html + app.js)
```

### 9. Performance Considerations

- **Debouncing**: Debounce slider changes (50-100ms) to prevent excessive re-renders
- **Web Workers** (optional): Offload computation to worker thread for responsiveness
- **Progressive Rendering** (optional): Render at low resolution first, then refine
- **Caching**: Cache rendered frames when only color scheme changes

### 10. Smooth Coloring Algorithm Details

Implement the continuous iteration count formula:
```
smooth_iteration = n + 1 - log(log(|z|)) / log(2)
```

Where:
- `n` is the iteration count when |z| exceeds escape radius (typically 2)
- `|z|` is the magnitude of z at escape
- Result is a floating-point value for smooth color interpolation

Map this smooth value to your color gradient using linear or cosine interpolation between color stops.

### 11. User Experience Goals

- **Immediate Feedback**: Real-time preview as parameters change
- **Beautiful Defaults**: Start with the "Labubu Dream" palette and "Rose Gold Dust" preset
- **Easy Exploration**: Cute presets make it easy to find interesting patterns
- **High-Quality Output**: Export at print-quality resolution
- **Intuitive Controls**: Clear labels, logical grouping, responsive sliders
- **Kawaii Vibes**: Every interaction should feel soft, friendly, and delightful
- **Cohesive Theme**: All UI elements reflect the Dubai chocolate × matcha × Labubu aesthetic

### 12. Color Palette Definitions (Hex Values)

For implementation, here are suggested gradient stops for each themed palette:

**1. Labubu Dream** (Default)
```
[#FFF5F7, #FFE5F1, #E5DEFF, #D4E5FF, #FFF8DC]
// Soft pink → lavender → baby blue → cream
```

**2. Dubai Luxe**
```
[#3D2817, #6B4423, #8B6F47, #C19A6B, #E8C4B8, #FFE5CC]
// Deep chocolate → caramel → rose gold → cream
```

**3. Matcha Latte**
```
[#FFF8E7, #EEE8D5, #D4E7C5, #A8C69F, #7FA881]
// Vanilla cream → soft matcha → deeper green
```

**4. Pistachio Velvet**
```
[#FFEFD5, #E8DCC4, #C1D5A4, #93C47D, #B4A76C]
// Cream → pistachio → soft gold
```

**5. Strawberry Milk**
```
[#FFF0F5, #FFE4E9, #FFC9D6, #FFB3C6, #FF9EB3, #FFA07A]
// White → pink → peachy coral
```

**6. Ube Cloud**
```
[#F8F5FF, #EFE5FF, #D8C7FF, #C5A3FF, #9B7EBD]
// White → lavender → ube purple
```

### 13. Optional Enhancements (Future)

- **Sparkle Animation**: Subtle animated sparkles that appear on the canvas edges
- **Cute Loading States**: Animated Labubu character or bouncing matcha cup while rendering
- **Transition Effects**: Smooth morphing between presets with fade/dissolve
- **Sound Effects** (optional): Soft, pleasant UI sounds (clicks, whooshes)
- **Stickers/Decorations**: Add cute digital stickers to exported images
- **Gallery Mode**: Save favorite renders with auto-generated cute names
- **Share Cards**: Generate social media cards with gradient backgrounds
- **Theme Toggle**: Switch between different cute themes (Labubu, Matcha, Chocolate)
- **Easter Eggs**: Hidden cute animations on special interactions

## Success Criteria

The application should:
1. ✓ Render Julia sets with smooth, band-free coloring
2. ✓ Update visualization in real-time (<500ms) as parameters change
3. ✓ Embody the Labubu × Dubai chocolate × matcha aesthetic throughout
4. ✓ Provide 6 themed color palettes with soft, dreamy gradients
5. ✓ Include 8 cute-named preset Julia sets with one-click loading
6. ✓ Export high-resolution PNG images (up to 4000x4000)
7. ✓ Feature rounded corners, soft shadows, and gentle animations throughout
8. ✓ Use warm, pastel color scheme for UI (cream, pink, matcha, rose gold)
9. ✓ Work in modern browsers (Chrome, Firefox, Safari, Edge)
10. ✓ Make every interaction feel delightful and kawaii

## Implementation Notes for Claude Code

- **Start with the aesthetic**: Set up the CSS design tokens and cute UI first
- Implement cute, rounded UI components before fractal logic
- Add smooth coloring algorithm early (critical for aesthetic quality)
- Implement themed color palettes with exact hex values provided
- Use rounded sans-serif fonts (Quicksand, Nunito, or Poppins)
- Apply generous border-radius (16-24px) to all containers
- Add soft shadows and subtle hover effects throughout
- Use emoji in section headers and button labels
- Test with various c values to ensure stability
- Optimize canvas rendering (avoid unnecessary clears/redraws)
- Consider using `requestAnimationFrame` for smooth slider updates
- **Most important**: Every detail should feel soft, friendly, and delightful

## Design Inspiration

The UI should evoke the feeling of:
- **Labubu toys**: Cute, slightly quirky, collectible charm with rounded features
- **Dubai chocolate**: Luxury, richness, indulgence (pistachio filling, velvet textures)
- **Matcha cafés**: Calm, serene, soft aesthetics with natural tones
- **Kawaii design**: Rounded shapes, soft colors, friendly interactions

Reference aesthetics:
- Pop Mart toy packaging (soft pastels, rounded fonts, playful vibe)
- Café menus with matcha drinks (gentle greens and creams)
- Luxury chocolate boxes (gold accents, rich browns, elegant simplicity)
- Sanrio-style interfaces (friendly, accessible, cute without being childish)

**The overall vibe**: "What if a Labubu opened a luxury matcha-chocolate café and made a fractal explorer?"

Think soft, dreamy, indulgent, and delightful at every touchpoint. The math is beautiful, but the presentation should feel like unwrapping a gift.
