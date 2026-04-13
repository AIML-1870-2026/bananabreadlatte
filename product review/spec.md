# Product Review Generator — spec.md

## Project Overview

A dynamic single-page web application that allows users to generate product reviews using an OpenAI language model. The user selects a specific model, provides product details, and receives a formatted AI-generated review rendered as HTML.

> **Important Legal Notice:** This tool is for educational and demonstration purposes only. The FTC prohibits the creation, dissemination, or use of AI-generated reviews as authentic consumer reviews. Do not publish or use generated output as real product reviews. Violations carry civil penalties up to $51,744 per violation.

---

## Reference Implementation

The `temp/` folder contains my complete LLM Switchboard project (HTML, CSS, and JS files). This is **NOT** part of the current project — do not include it in the final build or deployment.

Use it as a reference for:
- How to parse a `.env` file for API keys (in-memory only)
- The `fetch()` call structure for OpenAI's chat completions API
- Error handling patterns for failed API requests
- How the code is organized across separate files
- The general approach to building a single-page LLM tool

Ignore these Switchboard features (not needed here):
- Anthropic integration (this project is OpenAI-only)
- The model selection dropdown / provider switching logic for multiple providers
- Structured output mode and JSON schema handling

This project uses **unstructured (free-form) responses only**. Render the model's markdown output as formatted HTML.

---

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript (no frameworks)
- **API:** OpenAI Chat Completions API (browser-to-API, no backend server)
- **Markdown rendering:** Use a lightweight library (e.g., `marked.js` via CDN) to render model output as HTML
- **Environment:** API key loaded from a `.env` file, parsed in-memory only — never stored or persisted
- **Deployment:** GitHub Organization repository for this class

---

## Architecture

Single-page application — no backend, no server. All API calls are made directly from the browser using `fetch()`. This is possible because OpenAI's API permits direct browser requests (unlike Anthropic, which blocks them due to CORS).

---

## Features

### 1. Model Selection
- Dropdown to select an OpenAI model (e.g., `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo`)
- OpenAI models only — no provider switching, no Anthropic dropdown

### 2. Product Input Form
Fields the user fills out to describe the product:
- **Product Name** (text input, required)
- **Product Category** (text input or dropdown, e.g., Electronics, Clothing, Kitchen, etc.)
- **Key Features** (textarea — user lists notable features or specs)
- **Target Audience** (text input, optional — e.g., "home cooks", "college students")
- **Tone** (dropdown — e.g., Enthusiastic, Balanced, Critical, Professional)
- **Review Length** (dropdown — Short / Medium / Long)

### 3. Review Generation
- A **Generate Review** button submits the form
- The app constructs a prompt from the user's inputs and sends it to the selected OpenAI model
- The response is streamed or returned as a complete message (streaming preferred if straightforward to implement)
- The generated review is rendered as formatted HTML (bold, lists, headings, etc.) using `marked.js`

### 4. Output Display
- Display the generated review in a clearly styled output panel
- Show the model name used and approximate token count (if available from the API response)
- Provide a **Copy to Clipboard** button for the generated text
- Provide a **Clear / Reset** button to reset the form and output

### 5. API Key Handling
- On page load, read the `.env` file and parse the `OPENAI_API_KEY` into memory
- The key is never written to localStorage, sessionStorage, or any persistent store
- If the key is missing or invalid, display a clear error message

---

## Prompt Construction

Build the system and user prompts dynamically from form inputs. Example structure:

**System prompt:**
> You are an expert product reviewer. Write honest, helpful, and well-structured product reviews based on the product details provided. Format your response using markdown with clear headings, bullet points, and a final verdict.

**User prompt (assembled from form fields):**
> Write a [tone] product review of [LENGTH] length for the following product:
> - **Product Name:** [name]
> - **Category:** [category]
> - **Key Features:** [features]
> - **Target Audience:** [audience]

---

## Error Handling

- Invalid or missing API key → show user-friendly error message before sending any request
- Failed API request (network error, rate limit, etc.) → display the error message in the output panel
- Empty required fields → validate before submitting and highlight missing inputs

---

## UI / UX Guidelines

- Clean, minimal design consistent with the LLM Switchboard visual style (reference `temp/` for CSS patterns)
- Responsive layout — usable on both desktop and mobile
- Loading state: show a spinner or "Generating…" indicator while waiting for the API response
- Output panel should be visually distinct from the input section (e.g., card or panel with a border/background)

---

## File Structure

```
/
├── index.html
├── style.css
├── app.js
├── .env                  # Contains OPENAI_API_KEY (not committed to Git)
├── .gitignore            # Must include .env
├── temp/                 # Reference only — LLM Switchboard project files
│   └── (Switchboard HTML, CSS, JS — do not include in build)
└── spec.md               # This file
```

---

## Deployment

- Deploy to the GitHub Organization repository for this class
- Ensure `.env` is listed in `.gitignore` and is never committed
- The app should work as a static site (no server required)

---

## Out of Scope

- No Anthropic or other LLM provider integration
- No structured JSON output or schema-based responses
- No user accounts, login, or data persistence
- No backend server or serverless functions
- No saving or history of past generated reviews
