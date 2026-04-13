# NEO Close Approach Tracker — Project Specification

## Project Summary

A single-page web dashboard that pulls live data from NASA and JPL APIs to track
near-Earth objects (NEOs). The UI is styled as a "cute mission control" — deep space
dark background, soft pink/blush/rose accents, glassy cards, and a slow-moving star
field. Data-dense but delightful.

**Single HTML file. No build step. No backend. All API calls from the browser.**

---

## APIs Used

| API | Base URL | Key required |
|-----|----------|-------------|
| NASA NeoWs (feed) | `https://api.nasa.gov/neo/rest/v1/feed` | Yes — `DEMO_KEY` default |
| JPL SBDB Close-Approach | `https://ssd-api.jpl.nasa.gov/cad.api` | No |
| JPL Sentry | `https://ssd-api.jpl.nasa.gov/sentry.api` | No |

---

## Tab Structure

### Tab 1 — 🪐 This Week (NeoWs)
- **Purpose:** Live snapshot of asteroids flying past Earth this week.
- **Stat cards:** Closest approach, largest asteroid, fastest flyby, total count.
- **Card list:** Every asteroid in the date range with name, date, miss distance (LD + km),
  diameter range, velocity, and a Potentially Hazardous / Safe Flyby badge.
- **Controls:** Start/end date pickers (max 7-day window enforced), Load button.
  Defaults to current week on page load.

### Tab 2 — 🔭 Approach Explorer (SBDB)
- **Purpose:** Explore close approaches across a broader time window.
- **Filters:** Date range (default: next 12 months), max distance slider (0.5–10 LD),
  min diameter (optional), sort selector (closest / largest / fastest / soonest).
- **Results:** Sortable table — object name (links to JPL SBDB), date, miss distance,
  diameter with size analogy, velocity. Clicking a row expands it to show all raw fields.

### Tab 3 — ⚠️ Sentry Watch List
- **Purpose:** All objects flagged by JPL Sentry for non-zero Earth impact probability.
- **Intro blurb** explaining that most probabilities are extremely low.
- **Stat row:** Total objects, highest Torino Scale object, highest impact probability object.
- **Table columns:** Designation, diameter, impact probability (1-in-X and %), Palermo Scale
  (tooltip explanation), Torino Scale (color-coded), velocity, number of solutions.
- Default sort: impact probability descending.

### Tab 4 — 🌍 3D Globe (globe.gl + NeoWs)
- **Purpose:** Interactive 3D Earth with this week's asteroids shown at their relative
  miss distances as **floating points** away from the globe surface.
- Altitude mapped on a compressed logarithmic scale (0 LD → ground, 1 LD → ~20% globe
  radius, 10+ LD → ~60%).
- Moon shown as a distinct white reference marker at exactly 1 LD.
- Potentially hazardous asteroids: red-pink glow. Safe flybys: lavender.
- Click a marker → tooltip with name, date, distance, diameter, velocity, hazard status.
- Auto-rotates when idle; drag to rotate, scroll to zoom.
- Lat/Lng positions are illustrative (seeded by asteroid ID for stable placement);
  altitude is the meaningful dimension.

---

## Visual Design

- **Background:** `#0d0a12` (deep space dark with purple undertone)
- **Accent:** `#ff6eb4` (hot pink) / `#ffb3d9` (blush) / `#ff3d9a` (vivid rose)
- **Text:** `#ffe0f0` (warm white-pink) / `#c48aaa` (muted mauve)
- **Danger:** `#ff4466` · **Safe:** `#c084fc`
- Glassmorphism cards with pink border glow
- Animated star field (canvas, slow-moving dots with twinkle)
- Google Fonts: **Orbitron** (headings) + **Inter** (body)
- Distances shown in **lunar distances (LD)** with km secondary
- Size analogies (e.g. "about the size of a skyscraper")

---

## Technical Constraints

- Single `index.html` — all CSS and JS inline
- No external dependencies beyond Google Fonts, `globe.gl` (CDN), and the three APIs
- Graceful error cards with retry on API failure
- Shimmer/spinner loading states
- Mobile-responsive (single-column cards, horizontally scrollable tabs)
- `NASA_API_KEY` constant clearly commented at top of JS section

---

## Deployment

- GitHub Pages: `https://aiml-1870-2026.github.io/bananabreadlatte/`
- Push `index.html` as-is — no build step needed.
