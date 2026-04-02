# CLAUDE.md — NEO Close Approach Tracker Dashboard

## Project Overview

Build a single-page web dashboard that pulls live data from NASA and JPL APIs to track
near-Earth objects (NEOs). The dashboard should feel like a **cute mission control** —
think soft pinks, blush tones, rose accents, and sparkly space energy. Data-dense but
delightful. Like if a planetary defense scientist decorated her desk with fairy lights.

Single HTML file. No build step. No backend. All API calls made directly from the browser.

---

## Visual Design

### Color Palette
- Background: deep space dark — `#0d0a12` (near-black with a purple undertone)
- Primary accent: `#ff6eb4` (hot pink)
- Secondary accent: `#ffb3d9` (soft blush)
- Highlight / glow: `#ff3d9a` (vivid rose)
- Text primary: `#ffe0f0` (warm white-pink)
- Text secondary: `#c48aaa` (muted mauve)
- Card background: `#1a1025` with a subtle pink border or glow
- Danger / hazard: `#ff4466` (red-pink — for potentially hazardous asteroids)
- Safe: `#c084fc` (soft lavender)

### Typography
- Headings: `'Orbitron'` (Google Fonts) — futuristic, space-y
- Body: `'Inter'` or `'DM Sans'` — clean and readable
- Numbers / data: monospace, slightly glowing pink

### UI Details
- Glassmorphism cards: semi-transparent backgrounds with a pink border glow
- Subtle animated star field in the background (CSS or canvas — small, slow-moving dots)
- Active tab has a hot-pink underline and glow
- Hover states: soft pink glow on interactive elements
- Loading states: a pulsing pink spinner or shimmer skeleton
- All distances shown in **lunar distances (LD)** with km as secondary
- All sizes shown with a fun comparison (e.g., "about the size of a football stadium")

---

## API Configuration

### NASA NeoWs
- Base URL: `https://api.nasa.gov/neo/rest/v1/feed`
- Requires API key — use `DEMO_KEY` as the default but leave a clearly commented
  `const NASA_API_KEY = "DEMO_KEY";` near the top of the file so it's easy to swap
- Params: `start_date`, `end_date` (max 7-day window), `api_key`
- Use: current week's close approaches

### JPL SBDB Close-Approach Data
- Base URL: `https://ssd-api.jpl.nasa.gov/cad.api`
- No API key required
- Useful params: `dist-max` (max approach distance), `date-min`, `date-max`,
  `diameter` (filter by size), `sort` (sort field), `limit`
- Use: historical + future approach explorer

### JPL Sentry
- Base URL: `https://ssd-api.jpl.nasa.gov/sentry.api`
- No API key required
- Returns list of objects with non-zero Earth impact probability
- Fields include: `des` (designation), `ip` (impact probability), `ps` (Palermo scale),
  `ts` (Torino scale), `diam` (diameter km), `v_inf` (velocity), `n_imp` (number of
  potential impacts)
- Use: impact risk watch list

---

## Tab Structure

The dashboard has **four tabs**:

---

### Tab 1 — 🪐 This Week (NeoWs)

**Purpose:** Live snapshot of asteroids flying past Earth this week.

**Layout:**
- Top row: 3–4 headline stat cards
  - Closest approach this week (name + distance in LD)
  - Largest asteroid this week (name + estimated diameter)
  - Fastest flyby (name + velocity in km/s)
  - Total count of close approaches this week
- Main section: a scrollable card list of every asteroid in the date range
  - Each card shows: name, approach date/time, miss distance (LD + km),
    estimated diameter range, velocity (km/s), and a "Potentially Hazardous" badge
    (hot pink/red) or "Safe Flyby" badge (lavender) as appropriate
  - Cards for potentially hazardous asteroids get a subtle red-pink glow
- Date range controls: two date pickers (start + end, max 7-day span enforced)
  with a "Load" button — defaults to the current week on page load

---

### Tab 2 — 🔭 Approach Explorer (SBDB)

**Purpose:** Explore close approaches across a broader time window.

**Layout:**
- Filter controls at the top:
  - Date range (start / end) — default to next 12 months
  - Max distance slider: 0.5 LD to 10 LD
  - Min diameter input (meters) — optional filter
  - Sort selector: closest approach / largest object / fastest / soonest
  - "Search" button
- Results count shown after search ("Showing 47 approaches")
- Sortable data table with columns:
  - Object name (links to JPL Small-Body Database page for that object)
  - Close approach date
  - Miss distance (LD, with km in a tooltip or smaller text)
  - Diameter estimate (km, with size analogy)
  - Velocity (km/s)
  - Potentially hazardous? (badge)
- Table rows are zebra-striped in dark pink/purple tones
- Clicking a row expands it inline to show any additional SBDB fields available

---

### Tab 3 — ⚠️ Sentry Watch List

**Purpose:** Display all objects currently flagged by JPL's Sentry impact monitoring system.

**Layout:**
- Intro blurb: 1–2 sentences explaining what Sentry is and that most of these have
  very low probabilities
- Summary stats row:
  - Total objects on watch list
  - Highest Torino Scale object (name + score)
  - Highest impact probability object (name + probability)
- Sortable table with columns:
  - Object designation / name
  - Diameter (km)
  - Impact probability (formatted as "1 in X" and as a percentage)
  - Palermo Scale score (with a tooltip explaining what it means)
  - Torino Scale (color-coded: 0 = lavender, 1+ = increasingly pink/red)
  - Velocity (km/s)
  - Number of potential impact solutions
- Default sort: by impact probability descending
- Torino scale 0 rows are slightly dimmed; any row with Torino ≥ 1 glows pink

---

### Tab 4 — 🌍 3D Globe (globe.gl + NeoWs)

**Purpose:** Interactive 3D Earth showing this week's asteroids at their relative miss distances.

**Implementation:**
- Load globe.gl from CDN: `https://unpkg.com/globe.gl`
- Reuse the NeoWs data already fetched for Tab 1 (don't re-fetch)
- Render an interactive globe:
  - Earth texture from a public CDN (globe.gl's default or NASA Blue Marble)
  - Dark space background matching the site's dark purple-black
  - Pink atmospheric glow on the Earth

**Asteroid markers:**
- Each asteroid is a glowing pink dot or ring floating above the Earth
- Altitude is mapped using a **compressed logarithmic scale**:
  - 0 LD → ground level
  - 1 LD (Moon) → about 20% of globe radius above surface
  - 10+ LD → about 60% of globe radius
  - This keeps everything visible and avoids asteroids floating off-screen
- Moon is shown as a distinct white/silver reference marker at exactly 1 LD altitude
  with a label "🌕 Moon (1 LD)"
- Potentially hazardous asteroids: red-pink glowing rings
- Safe flybys: soft lavender/pink dots

**Interaction:**
- Drag to rotate the globe
- Scroll to zoom
- Click an asteroid marker → a tooltip/popup appears showing:
  - Name, approach date, miss distance, diameter, velocity, hazard status
- A small legend in the corner explains the color coding
- Globe auto-rotates slowly when idle

**Note on positioning:** Since NeoWs does not provide lat/lng for closest approach,
distribute asteroids at randomized but stable lat/lng positions (seeded by asteroid ID
so they don't jump on re-render). The altitude (miss distance) is the meaningful
dimension — the lat/lng is illustrative.

---

## General Technical Requirements

- Single HTML file with all CSS and JS inline (no separate files, no bundler)
- Google Fonts loaded via `<link>` in `<head>`
- globe.gl loaded from `unpkg.com` CDN
- Graceful error handling: if an API call fails, show a pink error card with a retry button
- Graceful loading states: shimmer skeletons or a pulsing pink spinner while data loads
- Mobile-responsive: tabs should stack or scroll horizontally on small screens;
  cards should be single-column on mobile
- All data fetched fresh on page load for Tab 1 (NeoWs) and Tab 3 (Sentry);
  Tab 2 (SBDB) fetches on user-initiated search; Tab 4 reuses Tab 1 data
- No external dependencies beyond Google Fonts, globe.gl, and the three NASA/JPL APIs
- Comment the `NASA_API_KEY` constant clearly at the top of the JS section

---

## Size Comparison Helper

Include a small utility function that maps asteroid diameter to a fun size analogy:

| Diameter | Analogy |
|----------|---------|
| < 10 m | a large SUV |
| 10–25 m | a house |
| 25–50 m | a city block |
| 50–100 m | the Eiffel Tower |
| 100–250 m | a skyscraper |
| 250–500 m | the Empire State Building |
| 500m–1km | a small mountain |
| 1–5 km | a large city |
| > 5 km | a continent-ender |

---

## Deployment Notes

- Deploy to GitHub Pages under the course org
- Final URL pattern: `https://aiml-1870-2026.github.io/<gamertag>/`
- No build step needed — push the single HTML file as `index.html`
