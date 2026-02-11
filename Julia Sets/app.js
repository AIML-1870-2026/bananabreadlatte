/* =============================================
   Julia Set Explorer - Application Logic
   ============================================= */

// --- Color Palettes ---
const PALETTES = [
  {
    name: 'Labubu Dream',
    emoji: '🧸',
    colors: ['#1A0A2E', '#5B2C8E', '#D46ABF', '#FFB3D9', '#FFF5F7', '#FFE5F1', '#A78BFA', '#3B0764'],
    preview: '#D46ABF',
  },
  {
    name: 'Dubai Luxe',
    emoji: '🍫',
    colors: ['#1A0E06', '#3D2817', '#6B4423', '#C19A6B', '#F5D89A', '#FFE5CC', '#E8C4B8', '#8B6F47', '#2A1508'],
    preview: '#C19A6B',
  },
  {
    name: 'Matcha Latte',
    emoji: '🍵',
    colors: ['#0D2818', '#1B5E3A', '#3A8F5C', '#7FA881', '#D4E7C5', '#FFF8E7', '#A8C69F', '#2D6A4F'],
    preview: '#3A8F5C',
  },
  {
    name: 'Pistachio Velvet',
    emoji: '🌿',
    colors: ['#1A1A06', '#4A6E23', '#93C47D', '#C1D5A4', '#FFEFD5', '#E8DCC4', '#B4A76C', '#5C6B2F'],
    preview: '#93C47D',
  },
  {
    name: 'Strawberry Milk',
    emoji: '🍓',
    colors: ['#4A0020', '#8B1A4A', '#D63384', '#FF6B9D', '#FFC9D6', '#FFF0F5', '#FF9EB3', '#A0204C'],
    preview: '#D63384',
  },
  {
    name: 'Ube Cloud',
    emoji: '☁️',
    colors: ['#1A0533', '#4A1680', '#7B3FBF', '#C5A3FF', '#EFE5FF', '#F8F5FF', '#9B7EBD', '#5C2D91'],
    preview: '#7B3FBF',
  },
];

// --- Presets ---
const PRESETS = [
  { name: 'Pistachio Swirl', emoji: '🌀', cr: 0.0, ci: 0.8 },
  { name: 'Chocolate Dream', emoji: '🍫', cr: -0.75, ci: 0.0 },
  { name: 'Matcha Spiral', emoji: '🍵', cr: 0.285, ci: 0.01 },
  { name: 'Strawberry Bunny', emoji: '🐰', cr: -0.123, ci: 0.745 },
  { name: 'Ube Dragon', emoji: '🐉', cr: -0.8, ci: 0.156 },
  { name: 'Rose Gold Dust', emoji: '✨', cr: 0.355, ci: 0.355 },
  { name: 'Velvet Cloud', emoji: '☁️', cr: -0.54, ci: 0.54 },
  { name: 'Golden Swirl', emoji: '🌟', cr: -0.391, ci: -0.587 },
];

// --- State ---
const state = {
  cr: 0.355,
  ci: 0.355,
  maxIter: 256,
  paletteIndex: 0,
  interiorColor: '#1A0A2E',
  gradientSpeed: 1,
  zoom: 1,
  panX: 0,
  panY: 0,
  exportRes: 800,
  activePreset: 5, // Rose Gold Dust
};

// --- DOM References ---
const canvas = document.getElementById('julia-canvas');
const ctx = canvas.getContext('2d');
const sliderReal = document.getElementById('slider-real');
const sliderImag = document.getElementById('slider-imag');
const sliderIter = document.getElementById('slider-iter');
const inputReal = document.getElementById('input-real');
const inputImag = document.getElementById('input-imag');
const realValueEl = document.getElementById('real-value');
const imagValueEl = document.getElementById('imag-value');
const iterValueEl = document.getElementById('iter-value');
const speedSlider = document.getElementById('slider-speed');
const speedLabel = document.getElementById('speed-label');
const interiorColorPicker = document.getElementById('interior-color');
const gradientPreview = document.getElementById('gradient-preview');
const canvasCoords = document.getElementById('canvas-coords');
const canvasLoading = document.getElementById('canvas-loading');
const paramPills = document.getElementById('param-pills');

// --- Utility: Parse hex to RGB ---
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// --- Utility: Lerp RGB ---
function lerpColor(c1, c2, t) {
  return [
    c1[0] + (c2[0] - c1[0]) * t,
    c1[1] + (c2[1] - c1[1]) * t,
    c1[2] + (c2[2] - c1[2]) * t,
  ];
}

// --- Build gradient LUT from palette ---
function buildGradientLUT(palette, size = 1024) {
  const colors = palette.colors.map(hexToRgb);
  const lut = new Uint8Array(size * 3);
  for (let i = 0; i < size; i++) {
    const t = (i / size) * (colors.length - 1);
    const idx = Math.floor(t);
    const frac = t - idx;
    const c1 = colors[Math.min(idx, colors.length - 1)];
    const c2 = colors[Math.min(idx + 1, colors.length - 1)];
    const c = lerpColor(c1, c2, frac);
    lut[i * 3] = c[0];
    lut[i * 3 + 1] = c[1];
    lut[i * 3 + 2] = c[2];
  }
  return lut;
}

// --- Julia Set Rendering ---
function renderJulia(targetCanvas, width, height) {
  const tCtx = targetCanvas.getContext('2d');
  const imageData = tCtx.createImageData(width, height);
  const data = imageData.data;

  const palette = PALETTES[state.paletteIndex];
  const lut = buildGradientLUT(palette);
  const lutSize = 1024;
  const interior = hexToRgb(state.interiorColor);

  const cr = state.cr;
  const ci = state.ci;
  const maxIter = state.maxIter;
  const speed = state.gradientSpeed;

  const rangeX = 4 / state.zoom;
  const rangeY = 4 / state.zoom;
  const xMin = state.panX - rangeX / 2;
  const yMin = state.panY - rangeY / 2;

  const escapeRadius = 256; // Use large escape radius for smoother coloring
  const logEscape = Math.log(escapeRadius);
  const log2 = Math.log(2);

  for (let py = 0; py < height; py++) {
    const y0 = yMin + (py / height) * rangeY;
    for (let px = 0; px < width; px++) {
      const x0 = xMin + (px / width) * rangeX;

      let zr = x0;
      let zi = y0;
      let n = 0;

      while (n < maxIter) {
        const zr2 = zr * zr;
        const zi2 = zi * zi;
        if (zr2 + zi2 > escapeRadius) break;
        zi = 2 * zr * zi + ci;
        zr = zr2 - zi2 + cr;
        n++;
      }

      const idx = (py * width + px) * 4;

      if (n === maxIter) {
        data[idx] = interior[0];
        data[idx + 1] = interior[1];
        data[idx + 2] = interior[2];
        data[idx + 3] = 255;
      } else {
        // Smooth iteration count
        const mag = Math.sqrt(zr * zr + zi * zi);
        const smooth = n + 1 - Math.log(Math.log(mag)) / log2;
        const t = ((smooth * speed) % lutSize + lutSize) % lutSize;
        const li = Math.floor(t) % lutSize;

        data[idx] = lut[li * 3];
        data[idx + 1] = lut[li * 3 + 1];
        data[idx + 2] = lut[li * 3 + 2];
        data[idx + 3] = 255;
      }
    }
  }

  tCtx.putImageData(imageData, 0, 0);
}

// --- Debounced Render ---
let renderTimeout = null;
function scheduleRender() {
  if (renderTimeout) cancelAnimationFrame(renderTimeout);
  renderTimeout = requestAnimationFrame(() => {
    renderJulia(canvas, canvas.width, canvas.height);
    updateParamPills();
  });
}

// --- Update UI displays ---
function updateDisplays() {
  realValueEl.textContent = state.cr.toFixed(3);
  imagValueEl.textContent = state.ci.toFixed(3);
  iterValueEl.textContent = state.maxIter;
  updateSpeedLabel();
  updateGradientPreview();
}

function updateSpeedLabel() {
  const s = state.gradientSpeed;
  if (s <= 0.5) speedLabel.textContent = '🐌 Slow';
  else if (s <= 1.5) speedLabel.textContent = '🐢 Normal';
  else if (s <= 3) speedLabel.textContent = '🐇 Fast';
  else speedLabel.textContent = '🚀 Turbo';
}

function updateGradientPreview() {
  const palette = PALETTES[state.paletteIndex];
  const stops = palette.colors.map((c, i) => {
    const pct = (i / (palette.colors.length - 1)) * 100;
    return `${c} ${pct}%`;
  });
  gradientPreview.style.background = `linear-gradient(90deg, ${stops.join(', ')})`;
}

function updateParamPills() {
  paramPills.innerHTML = '';
  const pills = [
    `c = ${state.cr.toFixed(3)} + ${state.ci.toFixed(3)}i`,
    `iter: ${state.maxIter}`,
    PALETTES[state.paletteIndex].name,
  ];
  pills.forEach(text => {
    const el = document.createElement('span');
    el.className = 'param-pill';
    el.textContent = text;
    paramPills.appendChild(el);
  });
}

// --- Initialize Palette Grid ---
function initPaletteGrid() {
  const grid = document.getElementById('palette-grid');
  PALETTES.forEach((palette, i) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn' + (i === state.paletteIndex ? ' active' : '');
    btn.title = `${palette.emoji} ${palette.name}`;

    // Create conic gradient from palette colors
    const angleStep = 360 / palette.colors.length;
    const stops = palette.colors.map((c, j) => `${c} ${j * angleStep}deg ${(j + 1) * angleStep}deg`);
    btn.style.background = `conic-gradient(${stops.join(', ')})`;

    btn.addEventListener('click', () => {
      state.paletteIndex = i;
      document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateGradientPreview();
      scheduleRender();
    });
    grid.appendChild(btn);
  });
}

// --- Initialize Preset Grid ---
function initPresetGrid() {
  const grid = document.getElementById('preset-grid');
  PRESETS.forEach((preset, i) => {
    const card = document.createElement('div');
    card.className = 'preset-card' + (i === state.activePreset ? ' active' : '');

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 120;
    previewCanvas.height = 120;
    card.appendChild(previewCanvas);

    const nameEl = document.createElement('div');
    nameEl.className = 'preset-name';
    nameEl.textContent = `${preset.emoji} ${preset.name}`;
    card.appendChild(nameEl);

    card.addEventListener('click', () => {
      state.cr = preset.cr;
      state.ci = preset.ci;
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
      state.activePreset = i;
      sliderReal.value = preset.cr;
      sliderImag.value = preset.ci;
      inputReal.value = preset.cr;
      inputImag.value = preset.ci;
      updateDisplays();
      scheduleRender();
      document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });

    grid.appendChild(card);

    // Render thumbnail async
    setTimeout(() => {
      const saved = { ...state };
      state.cr = preset.cr;
      state.ci = preset.ci;
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
      renderJulia(previewCanvas, 120, 120);
      Object.assign(state, saved);
    }, i * 50);
  });
}

// --- Slider/Input Wiring ---
function wireControls() {
  // Real slider
  sliderReal.addEventListener('input', () => {
    state.cr = parseFloat(sliderReal.value);
    inputReal.value = state.cr;
    realValueEl.textContent = state.cr.toFixed(3);
    state.activePreset = -1;
    scheduleRender();
  });

  inputReal.addEventListener('change', () => {
    const v = parseFloat(inputReal.value);
    if (!isNaN(v)) {
      state.cr = Math.max(-2, Math.min(2, v));
      sliderReal.value = state.cr;
      inputReal.value = state.cr;
      realValueEl.textContent = state.cr.toFixed(3);
      state.activePreset = -1;
      scheduleRender();
    }
  });

  // Imaginary slider
  sliderImag.addEventListener('input', () => {
    state.ci = parseFloat(sliderImag.value);
    inputImag.value = state.ci;
    imagValueEl.textContent = state.ci.toFixed(3);
    state.activePreset = -1;
    scheduleRender();
  });

  inputImag.addEventListener('change', () => {
    const v = parseFloat(inputImag.value);
    if (!isNaN(v)) {
      state.ci = Math.max(-2, Math.min(2, v));
      sliderImag.value = state.ci;
      inputImag.value = state.ci;
      imagValueEl.textContent = state.ci.toFixed(3);
      state.activePreset = -1;
      scheduleRender();
    }
  });

  // Iteration slider
  sliderIter.addEventListener('input', () => {
    state.maxIter = parseInt(sliderIter.value);
    iterValueEl.textContent = state.maxIter;
    scheduleRender();
  });

  // Speed slider
  speedSlider.addEventListener('input', () => {
    state.gradientSpeed = parseFloat(speedSlider.value);
    updateSpeedLabel();
    scheduleRender();
  });

  // Interior color
  interiorColorPicker.addEventListener('input', () => {
    state.interiorColor = interiorColorPicker.value;
    scheduleRender();
  });

  // Surprise Me
  document.getElementById('btn-surprise').addEventListener('click', () => {
    const interesting = [
      [-0.4, 0.6], [0.285, 0.01], [-0.75, 0.11], [-0.1, 0.651],
      [0.3, -0.01], [-0.12, -0.77], [0.28, 0.008], [-0.62, 0.43],
      [-0.79, 0.15], [0.355, 0.355], [-0.54, 0.54], [-0.391, -0.587],
      [0.0, 0.8], [-0.75, 0.0], [-0.123, 0.745], [-0.8, 0.156],
      [-0.70176, -0.3842], [0.37, 0.1], [-0.52, 0.57], [0.32, 0.043],
    ];
    const pick = interesting[Math.floor(Math.random() * interesting.length)];
    state.cr = pick[0];
    state.ci = pick[1];
    state.zoom = 1;
    state.panX = 0;
    state.panY = 0;
    state.activePreset = -1;
    sliderReal.value = state.cr;
    sliderImag.value = state.ci;
    inputReal.value = state.cr;
    inputImag.value = state.ci;
    updateDisplays();
    scheduleRender();
    document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
  });

  // Reset View
  document.getElementById('btn-reset-view').addEventListener('click', () => {
    state.zoom = 1;
    state.panX = 0;
    state.panY = 0;
    scheduleRender();
  });

  // Export resolution buttons
  document.querySelectorAll('.export-res').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.export-res').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.exportRes = parseInt(btn.dataset.res);
    });
  });

  // Download
  document.getElementById('btn-download').addEventListener('click', () => {
    const res = state.exportRes;
    const loading = canvasLoading;

    if (res > 800) {
      loading.style.display = 'flex';
    }

    setTimeout(() => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = res;
      exportCanvas.height = res;
      renderJulia(exportCanvas, res, res);

      const link = document.createElement('a');
      const paletteName = PALETTES[state.paletteIndex].name.toLowerCase().replace(/\s+/g, '_');
      link.download = `julia_${state.cr.toFixed(3)}_${state.ci.toFixed(3)}_${paletteName}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();

      loading.style.display = 'none';
    }, 50);
  });
}

// --- Pan, Zoom & Interactive Explore ---
function initCanvasInteraction() {
  let isPanning = false;
  let lastX, lastY;
  let locked = false;

  // Right-click drag to pan
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
      isPanning = true;
      lastX = e.clientX;
      lastY = e.clientY;
      e.preventDefault();
    }
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    const rangeX = 4 / state.zoom;
    const rangeY = 4 / state.zoom;
    state.panX -= (dx / canvas.clientWidth) * rangeX;
    state.panY -= (dy / canvas.clientHeight) * rangeY;
    scheduleRender();
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 2) isPanning = false;
  });

  // Interactive explore: moving cursor changes c parameter
  canvas.addEventListener('mousemove', (e) => {
    if (isPanning || locked) return;

    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;

    // Map mouse position to c parameter range [-2, 2]
    const newCr = (mx * 4) - 2;
    const newCi = (my * 4) - 2;

    state.cr = newCr;
    state.ci = newCi;
    state.activePreset = -1;

    sliderReal.value = newCr;
    sliderImag.value = newCi;
    inputReal.value = newCr.toFixed(3);
    inputImag.value = newCi.toFixed(3);
    realValueEl.textContent = newCr.toFixed(3);
    imagValueEl.textContent = newCi.toFixed(3);
    canvasCoords.textContent = `c = ${newCr.toFixed(3)} + ${newCi.toFixed(3)}i`;

    scheduleRender();
  });

  // Left-click to lock/unlock the current c value
  canvas.addEventListener('click', (e) => {
    if (e.button !== 0) return;
    locked = !locked;
    canvas.style.cursor = locked ? 'crosshair' : 'none';
    if (locked) {
      canvasCoords.textContent = `c = ${state.cr.toFixed(3)} + ${state.ci.toFixed(3)}i (locked)`;
    }
  });

  // Scroll to zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;

    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const rangeX = 4 / state.zoom;
    const rangeY = 4 / state.zoom;
    const worldX = state.panX - rangeX / 2 + mx * rangeX;
    const worldY = state.panY - rangeY / 2 + my * rangeY;

    state.zoom *= factor;

    const newRangeX = 4 / state.zoom;
    const newRangeY = 4 / state.zoom;
    state.panX = worldX - (mx - 0.5) * newRangeX;
    state.panY = worldY - (my - 0.5) * newRangeY;

    scheduleRender();
  }, { passive: false });
}

// --- About Toggle ---
function initAboutToggle() {
  const toggle = document.getElementById('about-toggle');
  const card = toggle.closest('.card-about');
  toggle.addEventListener('click', () => {
    card.classList.toggle('collapsed');
  });
}

// --- Init ---
function init() {
  initAboutToggle();
  initPaletteGrid();
  initPresetGrid();
  wireControls();
  initCanvasInteraction();
  updateDisplays();
  scheduleRender();
}

init();
