# spec.md — Bloom 🌸
### Exploring Drug Safety, Beautifully
*A Drug Safety Explorer built on live FDA data*

---

## Vision & Concept

**Bloom** is a single-page drug safety explorer that makes FDA data feel beautiful, approachable,
and genuinely fun to use. It's designed for curious students and general audiences — not clinicians
— and should feel like the lovechild of a medical dashboard and a Pinterest mood board. Think:
frosted glass cards floating over a cherry blossom background, animated stats, fairy dust, and
genuinely useful drug safety information all in one place.

The aesthetic is **floral glassmorphism**: botanical decorations, soft cherry blossom pinks, drifting
petal animations, and frosted/blurred glass-style cards throughout. Cute but credible.

---

## Branding

- **App name:** Bloom
- **Tagline:** *Exploring drug safety, beautifully*
- **Logo/wordmark:** Elegant serif or semi-serif font for "Bloom" with a small cherry blossom
  icon (🌸) integrated into or beside the name
- **Color palette:**
  - Primary: Cherry blossom pink (`#F9A8C9` / `#FADADD`)
  - Background: Soft white with a very pale pink tint (`#FFF5F7`)
  - Glass cards: `rgba(255, 255, 255, 0.55)` with `backdrop-filter: blur(16px)`
  - Accent: Deep rose for hover/active states (`#E75480`)
  - Chart palette: Shades of pink, rose, blush, mauve, and soft coral
  - Severity colors: Deep rose (Class I), warm amber (Class II), sage green (Class III)
- **Typography:**
  - Headings: An elegant serif (e.g., Playfair Display or Lora, loaded from Google Fonts)
  - Body: A clean sans-serif (e.g., DM Sans or Inter)
  - Stat numbers: Bold, large, animated

---

## Mascot — Petal 🌸

A small illustrated SVG character named **Petal** lives in the header and occasionally throughout
the page. She is a cherry blossom fairy in a tiny lab coat — delicate wings, pink hair with a
blossom tucked in, holding a miniature clipboard or test tube. She should be drawn in a soft
kawaii-adjacent illustration style with clean lines and the cherry blossom color palette.

- **Header:** Petal appears beside the PetalRx wordmark, waving or pointing toward the search bar
- **Empty state:** When no drug is searched yet (or a drug returns no data), Petal reappears with
  a friendly message (e.g., *"Search a drug above and I'll bloom with data! 🌸"*)
- **Loading state:** Petal does a little spin or sparkle animation while data loads
- Petal is rendered as an inline SVG — no external image dependency

---

## Background & Animations

The page background should feel alive and magical:

1. **Animated gradient background** — a slow, looping CSS gradient that gently shifts between
   pale pink, soft blush, and near-white tones (cycle time ~10–15 seconds, very subtle)
2. **Floating cherry blossom petals** — CSS/JS animated petals (simple SVG petal shapes) that
   drift downward across the full page continuously, varying in size, opacity, speed, and
   horizontal drift. Should feel like a gentle spring breeze, not a snowstorm — maybe 12–18
   petals on screen at a time
3. **Floral corner decorations on cards** — soft watercolor-style SVG floral clusters in the
   corners of major cards (top-left and/or bottom-right), very low opacity so they don't
   overwhelm the content

All animations should respect `prefers-reduced-motion` — if the user has this set, disable
petal falling and gradient animation.

---

## Page Structure

### 1. Header / Hero

A full-width hero section at the top of the page containing:

- **PetalRx wordmark + Petal mascot** (left-aligned or centered)
- **Tagline:** *"Exploring drug safety, beautifully"*
- **Floating stat cards** — four animated stat cards displayed horizontally beneath the wordmark,
  each with an animated counting number (count up from 0 on page load):
  - 💊 `1.5M+` — Emergency department visits for adverse drug events annually
  - 🏥 `~500K` — Of those visits result in hospitalization
  - 📋 `10,000+` — Prescription medications available to clinicians
  - 🩷 `1 in 3` — U.S. adults take 5+ medications simultaneously
  - Each stat card is a frosted glass card with a pink icon, bold animated number, and small
    descriptor label
- **Search bar** (see below) — sits at the bottom of the hero section

### 2. Search Bar

- Prominent, centered, rounded pill-shaped search input
- Placeholder: *"Search any drug — brand or generic... 🌸"*
- Autocomplete dropdown powered by OpenFDA `/drug/label.json` — shows matching drug names as
  the user types
- A secondary optional input field below: *"+ Add a second drug for co-administration analysis"*
  (also autocompleted)
- A soft pink search button: **Bloom →**
- On first load, the bar is pre-populated with **Adderall** and **Lexapro**, and data loads
  automatically so users see a full dashboard immediately
- A small note beneath: *"Showing an example search — try your own drugs below ✨"*

### 3. Dashboard (below search)

The main content area. On load it shows results for Adderall + Lexapro. All sections are frosted
glass cards with floral corner decorations, flower icons in headers, and help (ⓘ) buttons.

---

## Data Sections & Visualizations

### 🌸 Section 1 — Drug Overview (Label Data)
- **Endpoint:** `/drug/label.json`
- **Card header:** 🌸 Drug Overview
- **Display:**
  - Drug name (brand + generic), manufacturer, dosage forms
  - Indications & usage — truncated with "Read more 🌸" toggle
  - Warnings & contraindications — displayed in a soft rose-tinted highlight box
  - Known drug interactions from the label
  - Adverse reactions listed in the label
- **Visualization:** A **radial/spider chart** (radar chart via Chart.js) comparing the drug's
  profile across 5–6 axes: number of warnings, number of interactions listed, number of label
  adverse reactions, recall count, adverse event report count, and approval age (years since
  approval). This gives a beautiful at-a-glance "safety fingerprint" for the drug. If two drugs
  are searched, both are overlaid on the same radar chart in different pink shades.
- **Help button (ⓘ):** *"What Drug Labels Actually Tell You"*

### 💊 Section 2 — Adverse Events (FAERS Reports)
- **Endpoint:** `/drug/event.json`
- **Card header:** 💊 Adverse Event Reports
- **Display:**
  - **Animated count-up number** — total FAERS reports found, counting up dramatically on load
  - **Bar chart** — top 10–15 most reported adverse reactions (reaction vs. count), in the pink
    palette, rendered with Chart.js. Horizontal bars preferred for readability.
  - **Timeline chart** — line or area chart showing adverse event reports submitted per year over
    time. Use a soft pink fill under the line.
  - **Donut/pie chart** — breakdown of report outcomes (e.g., hospitalization, death, recovery,
    other) as a donut chart with a total count in the center hole
  - **Bubble chart** — top adverse reactions displayed as bubbles where bubble size = report
    count. Rendered in varying pink/rose tones. More reports = bigger, deeper-colored bubble.
  - Small italic note beneath all charts: *"FAERS reports are voluntarily submitted. More reports
    do not mean a drug is more dangerous — popular drugs naturally receive more reports."*
- **Help button (ⓘ):** *"How to Interpret Adverse Event Data"*

### 📋 Section 3 — Recall History
- **Endpoint:** `/drug/enforcement.json`
- **Card header:** 📋 Recall History
- **Display:**
  - **Animated count-up** — total recall events found
  - **Recall severity timeline** — an interactive horizontal timeline of recall events plotted
    over time, each event rendered as a colored dot:
    - 🔴 Class I — deep rose (serious risk)
    - 🟡 Class II — warm amber (moderate risk)
    - 🟢 Class III — sage green (low risk)
  - Hovering/clicking a dot reveals a tooltip or expanded card: recall date, reason, recalling
    firm, product description
  - If no recalls found: Petal appears with *"No recalls found — that's a good sign! 🌸"*
- **Help button (ⓘ):** *"Understanding Recall Classifications"*

### ✨ Section 4 — Drug Approval Info
- **Endpoint:** `/drug/drugsfda.json`
- **Card header:** ✨ Approval History
- **Display:**
  - Application number, approval type (NDA / ANDA / BLA) with a plain-language label
  - Sponsor/manufacturer
  - Approval date — displayed with an animated "X years ago" tag
  - Available products: dosage forms, strengths, routes — displayed as cute pill-shaped tags/chips
- **Help button (ⓘ):** *"What Drug Approval Means"*

---

## Stretch Features

### Contextual Help Modals
- Every section card has a small **ⓘ** button in the top-right corner of the header
- Clicking opens a frosted-glass modal overlay with:
  - A flower icon and section title
  - Plain-language explanation of the data (see per-section descriptions above)
  - A "Got it 🌸" close button
- Additional global help items in the page header (small links or icon buttons):
  - *"About Bloom"* — disclaimer, data sources, educational purpose
  - *"Why Some Drugs Have More Reports"* — reporting bias explainer
  - *"Dangerous Drug Combinations"* — highlights Warfarin + NSAIDs, MAOIs + SSRIs,
    Methotrexate + NSAIDs
- Modal behavior: backdrop blur, smooth fade + scale-in animation, close on outside click or
  Escape key

### Co-Administration Analysis
- When a second drug is entered in the search bar:
  - Query FAERS for reports listing **both drugs** in the same adverse event report
  - Display an additional card: *"🩷 Together: [Drug A] + [Drug B]"*
  - Show: total co-administration reports, top adverse reactions when both are taken together,
    a donut chart of outcomes
  - Disclaimer: *"These reports listed both drugs — this does not prove the combination caused
    these reactions."*
  - **Radar chart overlay:** the drug profile radar chart (Section 1) overlays both drugs
    simultaneously for visual comparison

---

## Visual Summary — All Charts Used

| Section | Chart Type | Library |
|---|---|---|
| Drug Overview | Radar/spider chart | Chart.js |
| Adverse Events | Horizontal bar chart | Chart.js |
| Adverse Events | Line/area timeline | Chart.js |
| Adverse Events | Donut chart (outcomes) | Chart.js |
| Adverse Events | Bubble chart (reactions) | Chart.js |
| Recall History | Interactive dot timeline | Chart.js / custom CSS |
| Stats (header) | Animated count-up numbers | Vanilla JS |

All charts use the cherry blossom pink palette. Chart.js loaded from cdnjs CDN.

---

## Empty & Loading States

- **Loading:** Petal spins with sparkle CSS animation; a soft pink shimmer/skeleton appears
  where cards will load
- **No data found:** Petal reappears with a kind message specific to the section
- **Drug not found:** Full-page friendly message with Petal: *"Hmm, I couldn't find that one!
  Try a different spelling or brand name 🌸"*
- **API error:** *"Something went wrong fetching data. Please try again in a moment 💊"*

---

## Required Compliance

**Footer disclaimer:**
> *"This tool is for educational purposes only and is not a substitute for medical advice.
> Always consult a qualified healthcare professional before making decisions about medications."*

**OpenFDA attribution (footer):**
> *"This product uses publicly available data from the U.S. Food and Drug Administration (FDA).
> FDA is not responsible for the product and does not endorse or recommend this or any other
> product."*

Both displayed in small text in a soft pink footer alongside the Bloom wordmark.

---

## Technical Constraints

- **Single HTML file** — all CSS and JavaScript embedded inline. No build tools, no frameworks,
  no backend.
- All API calls client-side directly to `https://api.fda.gov/` — no proxy needed, CORS-friendly.
- **Chart.js** loaded from `https://cdnjs.cloudflare.com` CDN.
- **Google Fonts** loaded for Playfair Display + DM Sans (or similar).
- No API key required (OpenFDA public endpoints, ≤240 req/min).
- Mascot (Petal) rendered as inline SVG — no external image files.
- Petal animations and falling petals implemented in vanilla CSS/JS.
- Deployable to **GitHub Pages** as a static site (single `index.html`).
- Tested on modern desktop browsers (Chrome, Firefox, Safari).
- Respects `prefers-reduced-motion` for all decorative animations.

---

## Out of Scope

- Mobile-optimized layout (nice to have, not required)
- User accounts or saved searches
- Drug class exploration
- Any data source other than OpenFDA

---

*Bloom 🌸 — Built for AIML 1870 · Vibe Coding · University of Nebraska at Omaha*
