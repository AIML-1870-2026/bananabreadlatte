# Science Experiment Generator — Project Spec

## Overview

A single-page, browser-based tool that uses the OpenAI chat completions API to generate
grade-appropriate science experiments from a list of user-supplied materials. The app
is deployed as a single `index.html` file suitable for GitHub Pages (no backend required).

---

## Reference Implementation

The `temp/` folder contains my complete LLM Switchboard project (HTML, CSS, and JS files).
This is **NOT** part of the current project — do not include it in the final build or deployment.

Use it as a reference for:

- How to parse a `.env` file for API keys (in-memory only)
- The `fetch()` call structure for OpenAI's chat completions API
- Error handling patterns for failed API requests
- How the code is organized across separate files
- The general approach to building a single-page LLM tool

Ignore these Switchboard features (not needed here):

- Anthropic integration — this project is **OpenAI-only**
- The model selection dropdown / provider switching
- Structured output mode and JSON schema handling

This project uses **unstructured (free-form) responses only**.
Render the model's markdown output as **formatted HTML**.

---

## Functional Requirements

### Inputs

| Field | Type | Details |
|---|---|---|
| Grade Level | Dropdown | Options: K–2, 3–5, 6–8, 9–12 |
| Available Supplies | Text input (multi-line or single-line) | Free-form list of materials the user has on hand |

### Output

- The LLM returns a free-form science experiment tailored to the selected grade level and
  the supplied materials.
- The raw response will contain markdown (headings, bold, bullet lists, etc.).
- The app must render this markdown as properly formatted HTML — not raw text or escaped characters.
- A loading/thinking indicator should be displayed while the API request is in flight.

---

## Technical Constraints

### API & Authentication

- **OpenAI only.** No Anthropic, no Google, no provider switching.
- OpenAI's API permits direct browser-to-API calls (no CORS issue), making a backend unnecessary.
- The API key is loaded from a `.env` file using the same in-memory-only pattern as the Switchboard.
  - The key is read once at startup and held in memory.
  - It is never written to localStorage, sessionStorage, or any persistent store.
  - It is never exposed in the rendered UI.

### Model

- Use a current, capable OpenAI chat completions model (e.g., `gpt-4o`).
- No model-selection UI is needed; the model is hardcoded in the source.

### Response Handling

- Responses are **unstructured / free-form text** — no JSON schema, no structured output mode.
- Parse `response.choices[0].message.content` and render it as HTML via a markdown library
  (e.g., `marked.js` loaded from a CDN).

### Error Handling

- Follow the same error handling patterns used in the Switchboard:
  - Catch network errors (failed `fetch`)
  - Handle non-2xx HTTP responses (display the status code and error message)
  - Show a user-visible error message in the output area — never silently swallow errors

### Deployment

- **Single-file deployment:** one `index.html` file that embeds or references all CSS and JS.
- Must be deployable to **GitHub Pages** with no build step and no server.
- Any external dependencies (markdown renderer, etc.) should be loaded via CDN `<script>` tags.

---

## Prompt Design

The system prompt sent to the model should:

1. Establish the role: a science educator creating experiments for K–12 students.
2. Specify the selected grade level and its corresponding developmental expectations.
3. Include the user's supply list as the set of available materials.
4. Instruct the model to return a complete, structured experiment including:
   - Experiment title
   - Learning objective / scientific concept
   - Materials list (drawn from the user's supplies)
   - Step-by-step procedure
   - Expected results / what to observe
   - Discussion questions appropriate for the grade level
5. Instruct the model to use markdown formatting (headings, bold, lists) — the app will render it.

---

## UI / UX Requirements

- Clean, minimal single-page layout.
- Form at the top: grade level dropdown + supplies input + a "Generate Experiment" button.
- Output section below the form where the rendered experiment appears.
- Loading state: disable the button and show a visible indicator (spinner or status text) while
  the request is in flight.
- On error: display a clear, human-readable message in the output area.
- On success: render the markdown response as formatted HTML.
- Responsive layout — usable on both desktop and mobile.

---

## File Structure

```
/
├── index.html       # Complete single-page app (HTML + embedded or linked CSS/JS)
├── .env             # API key (gitignored — never committed)
├── .gitignore       # Must include .env
└── temp/            # Reference implementation only — excluded from build and deployment
```

> **Note:** If CSS and JS are broken out into separate files, follow the same decomposition
> pattern used in the Switchboard (as seen in `temp/`). However, for GitHub Pages compatibility,
> all paths must be relative and all files must be committed (except `.env`).

---

## Out of Scope

The following features are explicitly **not** part of this project:

- Backend server or Node.js runtime
- Multiple LLM providers or model-switching UI
- Structured / JSON output mode
- Conversation history or multi-turn chat
- User accounts, login, or any form of persistence
- Saving or exporting experiment results
