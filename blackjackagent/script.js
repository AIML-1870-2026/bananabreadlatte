// ── CONSTANTS ─────────────────────────────────────────────────────────────
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RED_SUITS = new Set(['♥','♦']);

const DEALER_COLS = ['2','3','4','5','6','7','8','9','10','A'];
const STRATEGY_ROWS = ['≤8','9','10','11','12','13','14','15','16','17+'];

// H=Hit, S=Stand, D=Double (treated as Hit for action)
const BASIC_STRATEGY = {
  '≤8': ['H','H','H','H','H','H','H','H','H','H'],
  '9':  ['H','D','D','D','D','H','H','H','H','H'],
  '10': ['D','D','D','D','D','D','D','D','H','H'],
  '11': ['D','D','D','D','D','D','D','D','D','D'],
  '12': ['H','H','S','S','S','H','H','H','H','H'],
  '13': ['S','S','S','S','S','H','H','H','H','H'],
  '14': ['S','S','S','S','S','H','H','H','H','H'],
  '15': ['S','S','S','S','S','H','H','H','H','H'],
  '16': ['S','S','S','S','S','H','H','H','H','H'],
  '17+':['S','S','S','S','S','S','S','S','S','S'],
};

const RISK_DESCS = {
  conservative: 'Avoid busting at all costs — stand on lower totals.',
  balanced:     'Standard basic strategy — balanced risk/reward.',
  aggressive:   'Take more risks — hit on higher totals to chase 21.',
};

const DETAIL_DESCS = {
  brief:    'One sentence recommendation.',
  standard: '2–3 sentences with statistical reasoning.',
  detailed: 'Full analysis with probabilities, bust odds, and expected value.',
};

// ── STATE ─────────────────────────────────────────────────────────────────
let apiKey        = null;
let deck          = [];
let playerHand    = [];
let dealerHand    = [];
let balance       = 200;
const BET         = 10;
let gamePhase     = 'idle'; // idle | playing | dealer | result
let riskTolerance = 'balanced';
let explainDetail = 'standard';
let curAI         = null;  // current AI response object
let aiExecuted    = false; // did player click Execute this round?

const stats = {
  handsPlayed: 0,
  wins: 0,
  losses: 0,
  pushes: 0,
  streak: 0,
  bankrollHistory: [200],
  aiTotal: 0,
  aiCorrect: 0,
};

// ── DECK ──────────────────────────────────────────────────────────────────
function makeDeck() {
  const d = [];
  for (const s of SUITS) for (const r of RANKS) d.push({ suit: s, rank: r });
  return d;
}

function shuffle(d) {
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function draw() {
  if (deck.length < 15) {
    deck = shuffle(makeDeck());
    console.log('[GAME] Deck reshuffled');
  }
  return deck.pop();
}

function faceValue(rank) {
  if (rank === 'A') return 11;
  if ('JQK'.includes(rank)) return 10;
  return parseInt(rank);
}

function total(hand) {
  let sum = 0, aces = 0;
  for (const { rank } of hand) { sum += faceValue(rank); if (rank === 'A') aces++; }
  while (sum > 21 && aces-- > 0) sum -= 10;
  return sum;
}

function isSoft(hand) {
  let sum = 0, aces = 0;
  for (const { rank } of hand) { sum += faceValue(rank); if (rank === 'A') aces++; }
  return aces > 0 && sum <= 21;
}

function handStr(hand) {
  return hand.map(c => `${c.rank}${c.suit}`).join(', ');
}

// ── ENV PARSING ───────────────────────────────────────────────────────────
function parseEnv(text) {
  const m = text.match(/ANTHROPIC_API_KEY\s*=\s*([^\s\n\r"']+)/i);
  if (m) return m[1].trim();
  const m2 = text.match(/sk-ant-[A-Za-z0-9_-]+/);
  return m2 ? m2[0] : null;
}

// ── CARD RENDERING ────────────────────────────────────────────────────────
function makeCardEl(card, faceDown = false) {
  const el = document.createElement('div');
  el.className = 'playing-card';

  if (faceDown) {
    el.classList.add('face-down');
    el.innerHTML = '<div class="card-back">💖</div>';
    return el;
  }

  el.classList.add(RED_SUITS.has(card.suit) ? 'red' : 'black');
  el.innerHTML = `
    <div class="card-rank-top">${card.rank}<br>${card.suit}</div>
    <div class="card-suit-mid">${card.suit}</div>
    <div class="card-rank-bot">${card.rank}<br>${card.suit}</div>
  `;
  return el;
}

// ── RENDERING ─────────────────────────────────────────────────────────────
function renderHands() {
  const dealerEl = document.getElementById('dealerHand');
  const playerEl = document.getElementById('playerHand');
  const dTot     = document.getElementById('dealerTotal');
  const pTot     = document.getElementById('playerTotal');

  dealerEl.innerHTML = '';
  playerEl.innerHTML = '';

  if (!playerHand.length) {
    dTot.style.display = 'none';
    pTot.style.display = 'none';
    return;
  }

  // Dealer cards
  dealerHand.forEach((card, i) => {
    dealerEl.appendChild(makeCardEl(card, i === 1 && gamePhase === 'playing'));
  });

  if (gamePhase === 'playing') {
    dTot.textContent = `Showing: ${faceValue(dealerHand[0].rank)}`;
  } else {
    const dt = total(dealerHand);
    dTot.textContent = `Total: ${dt}${dt > 21 ? ' 💥 Bust' : ''}`;
  }
  dTot.style.display = 'block';

  // Player cards
  playerHand.forEach(card => playerEl.appendChild(makeCardEl(card)));
  const pt = total(playerHand);
  pTot.textContent = `Total: ${pt}${pt > 21 ? ' 💥 BUST' : ''}`;
  pTot.style.display = 'block';

  document.getElementById('balanceDisplay').textContent = `$${balance}`;
}

function showPhase() {
  ['idleActions','playingActions','resultActions'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('aiSection').style.display = 'none';

  if (gamePhase === 'idle') {
    document.getElementById('idleActions').style.display = 'flex';
  } else if (gamePhase === 'playing') {
    document.getElementById('playingActions').style.display = 'flex';
    document.getElementById('aiSection').style.display = 'block';
  } else if (gamePhase === 'result') {
    document.getElementById('resultActions').style.display = 'flex';
  }
  // dealer phase: nothing shown, renderHands handles it
}

function render() {
  renderHands();
  showPhase();
}

// ── GAME ENGINE ───────────────────────────────────────────────────────────
function deal() {
  if (balance < BET) { showToast('💔 Not enough balance!'); return; }

  playerHand = [draw(), draw()];
  dealerHand = [draw(), draw()];
  gamePhase  = 'playing';
  curAI      = null;
  aiExecuted = false;

  resetAIPanel();

  console.log(`[GAME] New hand — Player: ${handStr(playerHand)} (${total(playerHand)}), Dealer up: ${dealerHand[0].rank}${dealerHand[0].suit}`);

  render();
  updateStrategyHighlight();

  if (total(playerHand) === 21) {
    console.log('[GAME] Player Blackjack!');
    setTimeout(() => endRound('blackjack'), 400);
  }
}

function resetAIPanel() {
  document.getElementById('aiLoading').style.display = 'none';
  document.getElementById('aiResult').style.display  = 'none';
  document.getElementById('executeBtn').style.display = 'none';
  const badge = document.getElementById('aiBadge');
  badge.textContent = '';
  badge.className   = 'ai-badge';
  document.getElementById('strategyMatch').style.display = 'none';
}

function hitManual()   { if (gamePhase === 'playing') doHit(); }
function standManual() { if (gamePhase === 'playing') doStand(); }

function executeAI() {
  if (!curAI) return;
  aiExecuted = true;
  const action = curAI.action;
  console.log(`[GAME] Executing action: ${action}`);
  if (action === 'hit') doHit(); else doStand();
}

function doHit() {
  const card = draw();
  playerHand.push(card);
  const t = total(playerHand);
  console.log(`[GAME] Player hits: ${card.rank}${card.suit}`);
  console.log(`[GAME] New hand total: ${t}`);

  curAI = null;
  resetAIPanel();
  render();
  updateStrategyHighlight();

  if (t > 21) {
    animate('playerSection', 'shake-anim');
    setTimeout(() => endRound('bust'), 400);
  } else if (t === 21) {
    setTimeout(doStand, 300);
  }
}

function doStand() {
  if (gamePhase !== 'playing') return;
  gamePhase = 'dealer';
  console.log(`[GAME] Player stands with ${total(playerHand)}`);
  document.getElementById('playingActions').style.display = 'none';
  document.getElementById('aiSection').style.display      = 'none';
  renderHands();
  setTimeout(runDealer, 500);
}

function runDealer() {
  const step = () => {
    const t = total(dealerHand);
    // Dealer hits on hard ≤16 or soft 16
    if (t < 17 || (t === 16 && isSoft(dealerHand))) {
      const card = draw();
      dealerHand.push(card);
      console.log(`[GAME] Dealer hits: ${card.rank}${card.suit} (total: ${total(dealerHand)})`);
      renderHands();
      setTimeout(step, 650);
    } else {
      console.log(`[GAME] Dealer stands with ${t}`);
      setTimeout(resolve, 500);
    }
  };
  step();
}

function resolve() {
  const pt = total(playerHand);
  const dt = total(dealerHand);
  let outcome;
  if      (pt > 21)  outcome = 'bust';
  else if (dt > 21)  outcome = 'dealer_bust';
  else if (pt > dt)  outcome = 'win';
  else if (pt < dt)  outcome = 'loss';
  else               outcome = 'push';
  endRound(outcome);
}

function endRound(outcome) {
  gamePhase = 'result';
  stats.handsPlayed++;

  let payout = 0, msg = '', cls = '';

  switch (outcome) {
    case 'blackjack':
      payout = Math.floor(BET * 1.5);
      balance += payout;
      msg = `Blackjack! ✨ +$${payout}`;
      cls = 'win';
      stats.wins++;
      bump(true);
      break;
    case 'dealer_bust':
    case 'win':
      payout = BET;
      balance += payout;
      msg = outcome === 'dealer_bust' ? `Dealer busted! 🎉 +$${BET}` : `You win! 💖 +$${BET}`;
      cls = 'win';
      stats.wins++;
      bump(true);
      break;
    case 'bust':
      payout = -BET;
      balance += payout;
      msg = `Oh no! You busted! 💥 -$${BET}`;
      cls = 'loss';
      stats.losses++;
      bump(false);
      break;
    case 'loss':
      payout = -BET;
      balance += payout;
      msg = `Dealer wins. 💔 -$${BET}`;
      cls = 'loss';
      stats.losses++;
      bump(false);
      break;
    case 'push':
      msg = `Push! 🤝 No change`;
      cls = 'push';
      stats.pushes++;
      stats.streak = 0;
      break;
  }

  // AI accuracy
  if (aiExecuted) {
    stats.aiTotal++;
    if (cls === 'win') stats.aiCorrect++;
  }

  stats.bankrollHistory.push(balance);

  console.log(`[GAME] Round result: ${outcome}`);
  console.log(`[GAME] Balance: $${balance}`);

  if (cls === 'win')  animate('playerSection', 'win-anim');
  if (cls === 'loss') animate('playerSection', 'shake-anim');

  const winRate = Math.round((stats.wins / stats.handsPlayed) * 100);
  const rc = document.getElementById('resultCard');
  rc.className = `result-card ${cls}`;
  document.getElementById('resultMsg').textContent = msg;
  document.getElementById('resultSub').textContent =
    `Win rate: ${winRate}% · ${stats.wins}W / ${stats.losses}L / ${stats.pushes}P`;

  render();
  renderHands(); // show dealer hole card

  if (balance <= 0) {
    setTimeout(() => showToast('💔 Out of chips! Balance reset to $200.'), 600);
    balance = 200;
    stats.bankrollHistory.push(200);
  }

  updateAnalyticsDisplay();
}

function bump(won) {
  if (won) stats.streak = stats.streak > 0 ? stats.streak + 1 : 1;
  else     stats.streak = stats.streak < 0 ? stats.streak - 1 : -1;
}

function animate(id, cls) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}

function newHand() {
  playerHand = [];
  dealerHand = [];
  gamePhase  = 'idle';
  render();
}

// ── AI AGENT ──────────────────────────────────────────────────────────────
async function getAIAdvice() {
  if (!apiKey) { showToast('💔 No API key loaded. Please reload and upload .env.'); return; }
  if (gamePhase !== 'playing') return;

  const pt = total(playerHand);
  const up = dealerHand[0];

  document.getElementById('aiLoading').style.display  = 'flex';
  document.getElementById('aiResult').style.display   = 'none';
  document.getElementById('getAiBtn').disabled        = true;

  const state = {
    playerHand: handStr(playerHand),
    playerTotal: pt,
    dealerUpCard: `${up.rank}${up.suit}`,
    balance,
    currentBet: BET,
    riskTolerance,
    explainDetail,
  };

  try {
    const result = await callClaude(state, false);
    curAI = result;
    showAIResult(result);
  } catch (err) {
    document.getElementById('aiLoading').style.display = 'none';
    showToast(`💔 Couldn't reach Claude. ${err.message}`);
    console.error('[AGENT] Error:', err);
  } finally {
    document.getElementById('getAiBtn').disabled = false;
  }
}

async function callClaude(state, isRetry) {
  console.log('[AGENT] Sending game state to Claude...');

  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: 'You are a Blackjack strategy expert. Always respond with valid JSON only. No text outside the JSON object.',
    messages: [{ role: 'user', content: buildPrompt(state, isRetry) }],
  };

  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':                              apiKey,
        'anthropic-version':                      '2023-06-01',
        'content-type':                           'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Network error — check your connection.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('Invalid API key.');
    if (res.status === 429) throw new Error('Rate limit reached. Try again in a moment.');
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data    = await res.json();
  const rawText = data.content[0].text;
  console.log('[AGENT] Raw response:', rawText);

  return parseAIResponse(rawText, state, isRetry);
}

async function parseAIResponse(rawText, state, isRetry) {
  const cleaned = rawText.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.action || !['hit','stand'].includes(parsed.action.toLowerCase())) {
      throw new Error('Invalid action');
    }
    parsed.action = parsed.action.toLowerCase();
    console.log(`[AGENT] Parsed action: ${parsed.action}`);
    console.log(`[AGENT] Confidence: ${parsed.confidence}`);
    return parsed;
  } catch {
    if (isRetry) {
      console.warn('[AGENT] JSON parse failed on retry — defaulting to stand');
      showToast('⚠️ Unexpected AI format. Defaulting to stand.');
      return { action: 'stand', confidence: 0.5, reasoning: 'Could not parse AI response. Defaulting to stand.', strategy_note: '' };
    }
    console.warn('[AGENT] JSON parse failed, retrying with stricter prompt...');
    return await callClaude(state, true);
  }
}

function buildPrompt(s, strict = false) {
  const base = `Game State:
- Player hand: ${s.playerHand} (total: ${s.playerTotal})
- Dealer up card: ${s.dealerUpCard}
- Player balance: $${s.balance}
- Current bet: $${s.currentBet}
- Risk tolerance: ${s.riskTolerance}
- Explanation detail: ${s.explainDetail}

${detailInstruction(s.explainDetail)}
${riskInstruction(s.riskTolerance)}
Respond ONLY with a JSON object in this exact format:
{
  "action": "hit" | "stand",
  "confidence": 0.0-1.0,
  "reasoning": "...",
  "strategy_note": "..."
}`;

  return strict
    ? base + '\n\nCRITICAL: Your entire response must be ONLY the JSON object. Start with { and end with }.'
    : base;
}

function detailInstruction(d) {
  if (d === 'brief')    return 'Keep the reasoning field to one short sentence only.';
  if (d === 'detailed') return 'Make the reasoning comprehensive: include hand probabilities, dealer bust odds, and expected value for both hit and stand.';
  return 'Keep the reasoning to 2-3 sentences with basic statistical reasoning.';
}

function riskInstruction(r) {
  if (r === 'conservative') return 'Risk profile: Conservative. Prioritize avoiding busts — stand earlier than basic strategy suggests.';
  if (r === 'aggressive')   return 'Risk profile: Aggressive. Take more risks to chase 21 — hit on totals where basic strategy says stand if improvement odds are meaningful.';
  return 'Risk profile: Balanced. Follow standard basic strategy.';
}

function showAIResult(result) {
  document.getElementById('aiLoading').style.display = 'none';
  document.getElementById('aiResult').style.display  = 'block';

  const action = result.action;
  const pct    = Math.round(Math.min(1, Math.max(0, result.confidence || 0.5)) * 100);

  document.getElementById('aiReasoning').textContent      = result.reasoning || '';
  document.getElementById('confidenceFill').style.width   = `${pct}%`;
  document.getElementById('confidencePct').textContent    = `${pct}%`;
  document.getElementById('deepDive').textContent         = result.strategy_note || '';
  document.getElementById('deepDive').style.display       = 'none';
  document.getElementById('deepDiveToggle').textContent   = '🔍 Deep Dive';

  const badge = document.getElementById('aiBadge');
  badge.textContent = action.toUpperCase();
  badge.className   = `ai-badge ${action}`;

  document.getElementById('executeLabel').textContent    = action.toUpperCase();
  document.getElementById('executeBtn').style.display   = 'block';

  checkStrategyMatch(result);
}

function checkStrategyMatch(result) {
  const pt     = total(playerHand);
  const rowKey = stratRowKey(pt);
  const colIdx = stratColIdx(dealerHand[0].rank);
  if (!rowKey || colIdx === -1) return;

  const basic   = BASIC_STRATEGY[rowKey][colIdx];
  const bHit    = basic === 'H' || basic === 'D';
  const matches = (result.action === 'hit') === bHit;
  const basicLabel = basic === 'D' ? 'Double/Hit' : basic === 'H' ? 'Hit' : 'Stand';

  const el = document.getElementById('strategyMatch');
  el.style.display     = 'block';
  el.textContent       = matches
    ? `✅ AI agrees with basic strategy (${basicLabel})`
    : `⚠️ AI deviates from basic strategy (basic says ${basicLabel})`;
  el.style.background  = matches ? '#d1fae5' : '#fff7ed';
  el.style.borderColor = matches ? '#6ee7b7' : '#fed7aa';
  el.style.color       = matches ? '#065f46' : '#9a3412';
  el.style.border      = '1.5px solid';
}

function toggleDeepDive() {
  const dd  = document.getElementById('deepDive');
  const btn = document.getElementById('deepDiveToggle');
  const open = dd.style.display === 'none';
  dd.style.display  = open ? 'block' : 'none';
  btn.textContent   = open ? '🔍 Hide Deep Dive' : '🔍 Deep Dive';
}

// ── STRATEGY MATRIX ────────────────────────────────────────────────────────
function buildStrategyTable() {
  const table = document.getElementById('strategyTable');
  let html = '<thead><tr><th>You \\ Dealer</th>';
  for (const d of DEALER_COLS) html += `<th>${d}</th>`;
  html += '</tr></thead><tbody>';

  for (const row of STRATEGY_ROWS) {
    html += `<tr><td class="row-label">${row}</td>`;
    BASIC_STRATEGY[row].forEach((action, i) => {
      html += `<td class="cell-${action}" id="sc-${row}-${i}">${action}</td>`;
    });
    html += '</tr>';
  }
  html += '</tbody>';
  table.innerHTML = html;
}

function updateStrategyHighlight() {
  // Clear previous highlight
  document.querySelectorAll('[data-orig]').forEach(el => {
    el.className = el.dataset.orig;
    delete el.dataset.orig;
  });

  if (!playerHand.length || !dealerHand.length) return;

  const rowKey = stratRowKey(total(playerHand));
  const colIdx = stratColIdx(dealerHand[0].rank);
  if (!rowKey || colIdx === -1) return;

  const cell = document.getElementById(`sc-${rowKey}-${colIdx}`);
  if (cell) {
    cell.dataset.orig = cell.className;
    cell.className    = 'cell-current';
  }
}

function stratRowKey(t) {
  if (t <= 8)  return '≤8';
  if (t >= 17) return '17+';
  return String(t);
}

function stratColIdx(rank) {
  if (!rank) return -1;
  if (rank === 'A') return 9;
  if (['J','Q','K','10'].includes(rank)) return 8;
  const i = parseInt(rank) - 2;
  return (i >= 0 && i <= 7) ? i : -1;
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────
function updateAnalyticsDisplay() {
  const wr = stats.handsPlayed ? Math.round((stats.wins / stats.handsPlayed) * 100) : 0;
  document.getElementById('statHands').textContent   = stats.handsPlayed;
  document.getElementById('statWins').textContent    = stats.wins;
  document.getElementById('statLosses').textContent  = stats.losses;
  document.getElementById('statPushes').textContent  = stats.pushes;
  document.getElementById('statWinRate').textContent = `${wr}%`;

  const sEl = document.getElementById('statStreak');
  sEl.textContent = stats.streak > 0 ? `🔥 ${stats.streak}` : stats.streak < 0 ? `💔 ${Math.abs(stats.streak)}` : '—';

  const aEl = document.getElementById('statAiAcc');
  aEl.textContent = stats.aiTotal
    ? `${Math.round((stats.aiCorrect / stats.aiTotal) * 100)}%`
    : '—';
}

function drawSparkline() {
  const canvas = document.getElementById('sparklineCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const h   = stats.bankrollHistory;
  if (h.length < 2) return;

  const W = canvas.parentElement.offsetWidth || 360;
  canvas.width  = W;
  canvas.height = 80;

  ctx.clearRect(0, 0, W, 80);

  const mn    = Math.min(...h);
  const mx    = Math.max(...h);
  const range = mx - mn || 1;
  const pad   = 10;
  const xStep = (W - pad) / (h.length - 1);

  const fy = v => 80 - pad - ((v - mn) / range) * (80 - pad * 2);

  // Fill gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 80);
  grad.addColorStop(0, 'rgba(255,105,180,0.28)');
  grad.addColorStop(1, 'rgba(255,105,180,0.02)');

  ctx.beginPath();
  ctx.moveTo(pad / 2, fy(h[0]));
  for (let i = 1; i < h.length; i++) ctx.lineTo(pad / 2 + i * xStep, fy(h[i]));
  ctx.lineTo(pad / 2 + (h.length - 1) * xStep, 80);
  ctx.lineTo(pad / 2, 80);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(pad / 2, fy(h[0]));
  for (let i = 1; i < h.length; i++) ctx.lineTo(pad / 2 + i * xStep, fy(h[i]));
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  ctx.stroke();

  // End dot
  const ex = pad / 2 + (h.length - 1) * xStep;
  const ey = fy(h[h.length - 1]);
  ctx.beginPath();
  ctx.arc(ex, ey, 4, 0, Math.PI * 2);
  ctx.fillStyle   = h[h.length - 1] >= h[h.length - 2] ? '#6ee7b7' : '#fca5a5';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth   = 2;
  ctx.stroke();
}

// ── SETTINGS ──────────────────────────────────────────────────────────────
function setRisk(value) {
  riskTolerance = value;
  document.querySelectorAll('#riskPills .pill').forEach(b => b.classList.toggle('active', b.dataset.value === value));
  document.getElementById('riskDesc').textContent = RISK_DESCS[value];
}

function setDetail(value) {
  explainDetail = value;
  document.querySelectorAll('#detailPills .pill').forEach(b => b.classList.toggle('active', b.dataset.value === value));
  document.getElementById('detailDesc').textContent = DETAIL_DESCS[value];
}

// ── PANELS ─────────────────────────────────────────────────────────────────
function openPanel(id) {
  document.getElementById(id).style.display = 'flex';
  if (id === 'analyticsPanel') { updateAnalyticsDisplay(); setTimeout(drawSparkline, 50); }
  if (id === 'strategyPanel')  { updateStrategyHighlight(); }
}

function closePanel(id) {
  document.getElementById(id).style.display = 'none';
}

// ── TOAST ─────────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent  = msg;
  el.style.display = 'block';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3500);
}

// ── PASTE KEY ─────────────────────────────────────────────────────────────
function submitPastedKey() {
  const val = document.getElementById('keyPasteInput').value.trim();
  if (!val || !val.startsWith('sk-ant-')) {
    document.getElementById('keyError').textContent = '💔 That doesn\'t look like an Anthropic key (should start with sk-ant-).';
    document.getElementById('keyError').style.display = 'block';
    return;
  }
  apiKey = val;
  console.log('[INIT] API key set via paste (in-memory only)');
  document.getElementById('keyStatus').style.display    = 'block';
  document.getElementById('keyError').style.display     = 'none';
  document.getElementById('startGameBtn').style.display = 'block';
  document.getElementById('keyPasteInput').value        = '';
}

// ── INIT ──────────────────────────────────────────────────────────────────
(function init() {
  const fileInput  = document.getElementById('envFileInput');
  const uploadArea = document.getElementById('uploadArea');

  function handleFile(file) {

    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const key = parseEnv(e.target.result);
      if (key) {
        apiKey = key;
        console.log('[INIT] API key loaded from .env (never stored, in-memory only)');
        document.getElementById('keyStatus').style.display  = 'block';
        document.getElementById('keyError').style.display   = 'none';
        document.getElementById('startGameBtn').style.display = 'block';
      } else {
        document.getElementById('keyError').textContent =
          '💔 Could not find ANTHROPIC_API_KEY in that file. Ensure it contains ANTHROPIC_API_KEY=sk-ant-...';
        document.getElementById('keyError').style.display = 'block';
      }
    };
    reader.readAsText(file);
  }

  fileInput.addEventListener('change', e => { handleFile(e.target.files[0]); e.target.value = ''; });

  // Allow pressing Enter in the paste input
  document.getElementById('keyPasteInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitPastedKey();
  });

  uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
  uploadArea.addEventListener('dragleave', ()  => uploadArea.classList.remove('drag-over'));
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  document.getElementById('startGameBtn').addEventListener('click', () => {
    document.getElementById('welcome-screen').style.display  = 'none';
    document.getElementById('game-container').style.display = 'block';
    deck = shuffle(makeDeck());
    buildStrategyTable();
    render();
  });

  document.getElementById('analyticsBtn').addEventListener('click', () => openPanel('analyticsPanel'));
  document.getElementById('strategyBtn').addEventListener('click',  () => openPanel('strategyPanel'));
  document.getElementById('settingsBtn').addEventListener('click',  () => openPanel('settingsPanel'));

  document.querySelectorAll('.panel-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) ov.style.display = 'none'; });
  });
})();
