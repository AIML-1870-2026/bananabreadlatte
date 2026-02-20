# RGB Candy Machine — Color Studio Spec

## Overview
A dreamy, pastel candy shop-themed RGB Color Studio where three candy dispensers (red, green, blue) pour colored candy into a mixing bowl. As users adjust sliders beneath each dispenser, the candy fills and the bowl blends into the resulting color. The mixed color automatically feeds into a complementary palette generator and a color blindness simulator (protanopia + deuteranopia).

## Features
- Animated candy dispenser visualization with three machines (R, G, B)
- RGB sliders beneath each dispenser controlling 0–255 values
- Animated candy "pour" effect when sliders move
- Mixing bowl that fills and glows with the blended color
- Live hex code + RGB readout on the bowl
- Click-to-copy hex code
- Auto-generated complementary color palette from the bowl's color
- Palette displayed as pastel swatch cards with hex codes (click to copy)
- Color blindness simulator showing the bowl color and palette as seen by:
  - Protanopia (red-blind)
  - Deuteranopia (green-blind)

## Layout
Single-page vertical scroll with three sections:
1. **The Candy Machine** — explorer with dispensers + bowl (top, hero section)
2. **Your Palette** — complementary swatches auto-generated below
3. **Color Vision Simulator** — side-by-side simulation panels

## Explorer Details
- **Visual metaphor:** Three tall pastel candy dispensers (red, green, blue themed) with glass windows showing candy fill level
- **Animation:** When a slider moves, candy pieces animate falling from the dispenser into the bowl below; the bowl liquid smoothly transitions color
- **Bowl:** Large round bowl centered below all three dispensers, fills with a glowing radial gradient of the mixed color, shows hex + RGB
- **Sliders:** Soft rounded pill-style sliders, each tinted to its color (red/green/blue), labeled R / G / B with 0–255 numeric display

## Palette Generator Details
- **Harmony:** Complementary only (color directly opposite on the RGB wheel, 180° hue rotation)
- **Display:** 5-swatch row — base color + 4 complementary/derived harmonics (tints and shades)
- **Each swatch:** Rounded card showing the color fill, hex code below, click-to-copy on hover
- **Auto-updates** whenever the bowl color changes

## Color Blindness Simulator
- Two panels side by side: "Protanopia View" and "Deuteranopia View"
- Each panel shows the mixed color and the palette swatches transformed via simulation matrices
- Labels explain what each condition affects
- Matrix transformations applied in JavaScript on the RGB values

## Visual Style
- **Theme:** Dreamy pastel candy shop — soft pinks, lavenders, mint greens, creamy whites
- **Background:** Soft pastel gradient mesh with subtle candy/dot pattern
- **Font:** Fredoka One for headings; Nunito for body text (Google Fonts)
- **Components:** Soft drop shadows, rounded corners everywhere, pastel borders, gentle glow effects
- **Animations:** Bouncy CSS keyframes, smooth color transitions (300ms ease), falling candy particle effects

## Technical Notes
- Single HTML file (HTML + CSS + JS, no build step needed)
- DOM-based candy particle animations
- CSS custom properties for color theming
- Color blindness matrices applied via JS on RGB values
- Complementary color: rotate hue 180° using HSL conversion
- Google Fonts for typography
