# 🌸 Weather Dashboard — Project Spec

> *A sparkly little static webpage that fetches real-time weather data from the OpenWeatherMap API — cute, functional, and cloud-approved ☁️✨*

---

## 💖 Overview & Goals

The **Weather Dashboard** is a browser-based application built as a single static HTML page. It lets users look up live weather conditions for any city on Earth, choose their preferred temperature units, and (via stretch features) explore forecasts, air quality, UV levels, and interactive maps.

**Core Goals**

- Provide real-time weather data through the OpenWeatherMap REST API
- Keep the implementation simple enough to deploy on any static host (GitHub Pages, Netlify, etc.)
- Teach the fundamentals of client-side API calls, JSON parsing, and DOM manipulation
- Lay a foundation that stretch features can build on without a rewrite

**Audience:** Students and developers learning front-end web development and API integration.

---

## 🌺 UI / UX Design

### Layout

The page is a single-column centered layout, max ~680 px wide, so it feels cozy on both desktop and mobile.

```
┌──────────────────────────────────┐
│       🌸 Weather Dashboard       │
│  ── ── ── ── ── ── ── ── ── ──  │
│  [ API Key field               ] │
│  Units: [ °F ]  [ °C ]           │
│  [ City input        ] [Search]  │
│                                  │
│  ╔══════════════════════════════╗ │
│  ║  Tokyo 🌤️                   ║ │
│  ║  68°F  feels like 65°F      ║ │
│  ║  partly cloudy               ║ │
│  ║  ┌──────────┐ ┌──────────┐  ║ │
│  ║  │ Humidity │ │   Wind   │  ║ │
│  ║  │   62 %   │ │  8 mph   │  ║ │
│  ║  └──────────┘ └──────────┘  ║ │
│  ║  🌅 6:12 AM   🌇 6:48 PM   ║ │
│  ║  Low ━━━━●━━━━━━━━━ High    ║ │
│  ╚══════════════════════════════╝ │
└──────────────────────────────────┘
```

### Visual Style

| Element | Spec |
|---|---|
| Background | Deep navy `#0a0f1e` with radial glow accents |
| Cards | Slightly lighter navy `#0f1629`, 1 px border, 18 px radius |
| Accent color | Sky blue `#4fc3f7` for temperatures & interactive elements |
| Typography | **Syne** (display/headings) + **DM Mono** (data/labels) |
| Animations | Fade-in on load; weather card slides up on new search result |
| Decorative | Twinkling star field in background (pure CSS + JS) |

### Inputs & Controls

- **API Key field** — password-type input at the top; persists in `sessionStorage` so users don't retype it every search
- **Units toggle** — two-button pill (`°F` / `°C`); active unit is highlighted; switching units auto-refreshes the current city
- **City input** — text field that accepts both plain city names (`Omaha`) and country-qualified names (`Paris, FR`); pressing **Enter** submits
- **Search button** — triggers the API call; shows a pulsing loading indicator while the request is in-flight

### Error Handling

Errors appear in a red-tinted dismissible banner above the weather card. Common cases:

- Missing API key → *"Please enter your OpenWeatherMap API key."*
- Empty city → *"Please enter a city name."*
- City not found (API 404) → *"City not found. Try a different spelling or add a country code."*
- Invalid API key (API 401) → *"Invalid API key. Check your OpenWeatherMap account."*
- Network error → *"Could not reach the weather service. Check your connection."*

---

## 🌼 API Endpoints & Data

### Authentication

All requests use a free-tier API key passed as a URL query parameter:

```
?appid=YOUR_API_KEY
```

Keys are free at [openweathermap.org](https://openweathermap.org/api). The free tier is rate-limited to **60 calls/minute** and grants access to all endpoints used in this project.

### Main Task — Current Weather

**Endpoint:** `GET /data/2.5/weather`

```
https://api.openweathermap.org/data/2.5/weather
  ?q={city}
  &units={imperial|metric}
  &appid={key}
```

**Fields used:**

| JSON path | Displayed as |
|---|---|
| `name` + `sys.country` | City name & country badge |
| `weather[0].id` | Emoji icon (mapped by condition code) |
| `weather[0].description` | Description text |
| `main.temp` | Main temperature |
| `main.feels_like` | "Feels like" line |
| `main.temp_min` / `temp_max` | Range bar endpoints |
| `main.humidity` | Humidity stat card |
| `main.pressure` | Pressure stat card |
| `wind.speed` | Wind speed stat card |
| `visibility` | Visibility stat card |
| `sys.sunrise` / `sys.sunset` + `timezone` | Sunrise & sunset times (UTC-adjusted) |

---

## 🛡️ Security Model

The dashboard uses the **Static Page — Basic** security approach: the API key is typed by the user at runtime and sent directly in browser requests. This is appropriate for this project because:

- The OpenWeatherMap free tier key has low monetary value and can be regenerated in seconds
- The key is never hardcoded into source files or committed to version control
- The audience is students learning API fundamentals, not production deployments

For reference, here is how security scales up in more serious applications:

| Approach | Key visible to users? | Infrastructure needed |
|---|---|---|
| ✅ Static page (this project) | Yes — in network requests | None |
| Static + build process | Yes — in built JS | Build tool (Vite, Webpack) |
| Serverless function | **No** | Netlify / Vercel functions |
| Full backend | **No** | Your own server |

**In production** with a paid API key, always use a serverless function or backend server so the key is never exposed to the client.

---

## 🌟 Stretch Challenges

Each stretch feature adds a new OpenWeatherMap endpoint and a new UI section below the main weather card. At least **two** stretch features are required.

---

### 🗓️ Stretch 1 — 5-Day Forecast

**Endpoint:** `GET /data/2.5/forecast`

```
https://api.openweathermap.org/data/2.5/forecast
  ?q={city}
  &units={imperial|metric}
  &cnt=40
  &appid={key}
```

The forecast endpoint returns up to 40 three-hourly data points (5 days × 8 per day). Group them by calendar date and display one card per day showing:

- Day name (Mon, Tue, Wed…)
- Weather emoji
- High and low temperature for that day
- Short description

**UI suggestion:** A horizontal scrollable row of 5 compact cards below the main weather card.

---

### 🌿 Stretch 2 — Air Quality / AQI

**Endpoint:** `GET /data/2.5/air_pollution`

```
https://api.openweathermap.org/data/2.5/air_pollution
  ?lat={lat}
  &lon={lon}
  &appid={key}
```

⚠️ This endpoint requires **latitude and longitude**, not a city name. Grab `coord.lat` and `coord.lon` from the current weather response and pass them here.

**Fields to display:**

| JSON path | Meaning |
|---|---|
| `list[0].main.aqi` | AQI index (1 = Good … 5 = Very Poor) |
| `list[0].components.pm2_5` | Fine particulate matter (µg/m³) |
| `list[0].components.pm10` | Coarse particulate matter (µg/m³) |
| `list[0].components.no2` | Nitrogen dioxide (µg/m³) |
| `list[0].components.o3` | Ozone (µg/m³) |

**AQI label mapping:**

| Value | Label | Suggested color |
|---|---|---|
| 1 | Good | 🟢 green |
| 2 | Fair | 🟡 yellow |
| 3 | Moderate | 🟠 orange |
| 4 | Poor | 🔴 red |
| 5 | Very Poor | 🟣 purple |

---

### ☀️ Stretch 3 — UV Index

**Endpoint:** `GET /data/2.5/onecall` (or `/uvi` on older free-tier accounts)

```
https://api.openweathermap.org/data/2.5/onecall
  ?lat={lat}
  &lon={lon}
  &exclude=minutely,hourly,daily,alerts
  &appid={key}
```

Pull `current.uvi` from the response.

**UV Index scale:**

| UVI | Exposure level | Protection needed |
|---|---|---|
| 0–2 | Low | Minimal |
| 3–5 | Moderate | Sunscreen recommended |
| 6–7 | High | Sunscreen required |
| 8–10 | Very High | Extra protection |
| 11+ | Extreme | Avoid outdoors at midday |

Display as a labeled gauge or colored badge alongside a protection tip.

---

### 🗺️ Stretch 4 — Weather Map Layers

**Endpoint:** OpenWeatherMap Tile Layer

```
https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={key}
```

Embed an interactive map using the [Leaflet.js](https://leafletjs.com/) library (free, open source) with one or more OpenWeatherMap tile overlays. Recommended layers:

| Layer key | Shows |
|---|---|
| `precipitation_new` | Rain & snow intensity |
| `temp_new` | Surface temperature color map |
| `wind_new` | Wind speed |
| `clouds_new` | Cloud coverage |

**Implementation notes:**
- Load Leaflet from its CDN — no npm required
- Center the map on the searched city's coordinates (`coord.lat`, `coord.lon`)
- Add a layer picker so users can switch between overlay types
- Keep the map height around 320 px so it doesn't overwhelm the page

---

## 📋 Deliverables Summary

| Deliverable | Status |
|---|---|
| Single-file static HTML page | Main task |
| City search with live API call | Main task |
| °F / °C unit toggle | Main task |
| Current conditions card (temp, humidity, wind, pressure, visibility, sunrise/sunset) | Main task |
| 5-day forecast row | Stretch |
| Air quality / AQI panel | Stretch |
| UV index badge | Stretch |
| Interactive weather map | Stretch |

---

*Built with 💗 and OpenWeatherMap · Weather Dashboard Quest*
