let apiKey = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const keyInput     = document.getElementById('key-input');
const eyeBtn       = document.getElementById('eye-btn');
const uploadBtn    = document.getElementById('upload-btn');
const envFileEl    = document.getElementById('env-file');
const keyStatus    = document.getElementById('key-status');
const modelEl      = document.getElementById('model');
const productName  = document.getElementById('product-name');
const categoryEl   = document.getElementById('category');
const featuresEl   = document.getElementById('features');
const audienceEl   = document.getElementById('audience');
const toneEl        = document.getElementById('tone');
const lengthEl      = document.getElementById('length');
const toneValues    = ['Serious', 'Balanced', 'Funny'];
const lengthValues  = ['Short', 'Medium', 'Long'];

function getTone()   { return toneValues[toneEl.value]; }
function getLength() { return lengthValues[lengthEl.value]; }

// Highlight active marker
function updateMarkers(slider, values) {
  const markers = slider.closest('.slider-wrap').querySelectorAll('.slider-markers span');
  markers.forEach((el, i) => el.classList.toggle('active', i === +slider.value));
}
toneEl.addEventListener('input',   () => updateMarkers(toneEl, toneValues));
lengthEl.addEventListener('input', () => updateMarkers(lengthEl, lengthValues));
updateMarkers(toneEl, toneValues);
updateMarkers(lengthEl, lengthValues);
const generateBtn  = document.getElementById('generate-btn');
const resetBtn     = document.getElementById('reset-btn');
const copyBtn      = document.getElementById('copy-btn');
const outputPanel  = document.getElementById('output-panel');
const loadingEl    = document.getElementById('loading');
const outputMeta   = document.getElementById('output-meta');
const metaModel    = document.getElementById('meta-model');
const metaTokens   = document.getElementById('meta-tokens');
const apiErrorEl   = document.getElementById('api-error');

// ── Key handling ──────────────────────────────────────────────────────────────
function setKey(value) {
  apiKey = value.trim();
  keyInput.value = apiKey;
  if (apiKey) {
    keyStatus.textContent = '✓ Key loaded';
    keyStatus.className = 'key-status ok';
    generateBtn.disabled = false;
    apiErrorEl.classList.add('hidden');
  } else {
    keyStatus.textContent = '';
    generateBtn.disabled = true;
  }
}

// Manual key entry
keyInput.addEventListener('input', () => {
  setKey(keyInput.value);
});

// Show/hide key
eyeBtn.addEventListener('click', () => {
  const masked = keyInput.classList.toggle('masked');
  eyeBtn.querySelector('svg').style.opacity = masked ? '1' : '0.5';
});

// Upload .env file button
uploadBtn.addEventListener('click', () => envFileEl.click());

envFileEl.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const text = ev.target.result;
    const match = text.match(/OPENAI_API_KEY\s*=\s*["']?([^\s"'\n]+)["']?/i);
    if (match) {
      setKey(match[1]);
    } else {
      keyStatus.textContent = 'OPENAI_API_KEY not found in file';
      keyStatus.className = 'key-status err';
    }
  };
  reader.readAsText(file);
  envFileEl.value = '';
});

// ── Validation ────────────────────────────────────────────────────────────────
function validate() {
  if (!apiKey) {
    apiErrorEl.textContent = 'Please enter your OpenAI API key above.';
    apiErrorEl.classList.remove('hidden');
    return false;
  }
  apiErrorEl.classList.add('hidden');

  let ok = true;
  [productName, categoryEl, featuresEl].forEach(el => {
    const empty = !el.value.trim();
    el.classList.toggle('invalid', empty);
    if (empty) ok = false;
  });
  return ok;
}

// ── Prompt builder ────────────────────────────────────────────────────────────
function buildPrompts() {
  const system = `You are an expert product reviewer. Write honest, helpful, and well-structured product reviews based on the product details provided. Format your response using markdown with clear headings, bullet points, and a final verdict.`;

  const audienceLine = audienceEl.value.trim()
    ? `- **Target Audience:** ${audienceEl.value.trim()}\n`
    : '';

  const user =
    `Write a ${getTone()} product review of ${getLength()} length for the following product:\n\n` +
    `- **Product Name:** ${productName.value.trim()}\n` +
    `- **Category:** ${categoryEl.value}\n` +
    `- **Key Features:** ${featuresEl.value.trim()}\n` +
    audienceLine;

  return { system, user };
}

// ── API call ──────────────────────────────────────────────────────────────────
async function generate() {
  if (!validate()) return;

  setLoading(true);
  outputMeta.classList.add('hidden');
  copyBtn.disabled = true;

  const { system, user } = buildPrompts();
  const model = modelEl.value;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user',   content: user   },
        ],
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';
    const tokens = data.usage?.total_tokens;

    renderReview(text, model, tokens);
  } catch (err) {
    setLoading(false);
    outputPanel.innerHTML = `<div class="review-content" style="color:var(--error)"><strong>Error:</strong> ${escapeHtml(err.message)}</div>`;
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderReview(markdown, model, tokens) {
  setLoading(false);
  outputPanel.innerHTML = `<div class="review-content">${marked.parse(markdown)}</div>`;

  metaModel.textContent  = `Model: ${model}`;
  metaTokens.textContent = tokens != null ? `Tokens: ${tokens}` : '';
  outputMeta.classList.remove('hidden');
  if (!tokens) metaTokens.classList.add('hidden');

  copyBtn.disabled = false;
  copyBtn.dataset.text = markdown;
}

// ── Loading state ─────────────────────────────────────────────────────────────
function setLoading(on) {
  generateBtn.disabled = on;
  loadingEl.classList.toggle('hidden', !on);
  if (on) {
    outputPanel.innerHTML = '';
    outputMeta.classList.add('hidden');
  }
}

// ── Copy to clipboard ─────────────────────────────────────────────────────────
copyBtn.addEventListener('click', async () => {
  const text = copyBtn.dataset.text || '';
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.innerHTML = `✓ Copied!`;
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch {
    copyBtn.textContent = 'Failed';
  }
});

// ── Reset ─────────────────────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => {
  productName.value = '';
  categoryEl.value  = '';
  featuresEl.value  = '';
  audienceEl.value  = '';
  toneEl.value   = 1;
  lengthEl.value = 1;
  updateMarkers(toneEl, toneValues);
  updateMarkers(lengthEl, lengthValues);
  [productName, categoryEl, featuresEl].forEach(el => el.classList.remove('invalid'));
  outputPanel.innerHTML = `
    <div class="placeholder">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <p>Fill in the product details and click <strong>Generate Review</strong> to get started.</p>
    </div>`;
  outputMeta.classList.add('hidden');
  copyBtn.disabled = true;
  delete copyBtn.dataset.text;
  apiErrorEl.classList.add('hidden');
});

// ── Clear invalid on input ────────────────────────────────────────────────────
[productName, categoryEl, featuresEl].forEach(el => {
  el.addEventListener('input', () => el.classList.remove('invalid'));
});

// ── Generate on click ─────────────────────────────────────────────────────────
generateBtn.addEventListener('click', generate);

// ── Helpers ───────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Init — try auto-loading .env from server ──────────────────────────────────
(async () => {
  try {
    const res = await fetch('.env');
    if (!res.ok) return;
    const text = await res.text();
    const match = text.match(/OPENAI_API_KEY\s*=\s*["']?([^\s"'\n]+)["']?/i);
    if (match) setKey(match[1]);
  } catch {
    // no server or no .env — user will enter key manually or upload
  }
})();
