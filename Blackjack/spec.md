# Blackjack Game Spec

## Visual Design

**Theme:** Pink luxury — think high-fashion casino meets Y2K glam. Bold, unapologetic, memorable.

**Color Palette:**
- Table felt: Deep rose `#8B1A4A` with a lighter `#A82160` radial gradient center
- Background: Near-black with pink tint `#1A0810`
- Accent / gold replacement: Hot pink `#FF6EB4` and rose gold `#E8A0B4`
- Card background: Crisp white `#FDFCFC` with subtle warm tint
- Card suits (hearts/diamonds): `#C0392B` red
- Card suits (spades/clubs): `#1a1a2e` near-black
- Text on table: Soft blush `#F9D0E0`
- Buttons (primary): Gradient from `#E91E8C` to `#C2185B`
- Buttons (disabled): Muted mauve `#6D3050`
- Chips: Color-coded (see Chips section)

**Typography:**
- Display / headings: *Playfair Display* — elegant serif with personality
- Labels / UI: *Josefin Sans* — geometric, fashion-forward

**Aesthetic Details:**
- Table shape: Oval / stadium top, sharp bottom corners — classic casino silhouette
- Table border: Dark wood `#2C0F1A` outer ring, thin rose-gold inner line
- Background: Subtle repeating diamond pattern texture overlay at low opacity, plus a deep radial vignette darkening the corners
- Glow effects: Soft pink glow on active buttons and winning hands; pulsing neon-pink outline on the active player hand
- Chip stack uses stacked disc illusion with CSS shadows
- Deck visual: A physical "shoe" stack of card backs shown in the top-right corner of the table — shrinks as cards are dealt
- Table felt has a subtle noise/grain texture overlay at 8% opacity for realism
- Scrolling ticker tape of small pink diamond `◆` symbols along the outer border of the table as a decorative motif

---

## Card Images

Use the **free vector playing card SVG set** hosted at:
`https://deckofcardsapi.com/static/img/` — each card image URL follows the pattern:
`https://deckofcardsapi.com/static/img/{VALUE}{SUIT}.png`
where VALUE is `A`, `2`–`9`, `0` (for 10), `J`, `Q`, `K` and SUIT is `S`, `H`, `D`, `C`.
Examples: `AS.png` = Ace of Spades, `0H.png` = 10 of Hearts, `KD.png` = King of Diamonds.

Card back image: `https://deckofcardsapi.com/static/img/back.png`

**Card rendering:**
- Each card is an `<img>` element displaying the PNG from the URL above
- Card dimensions: 80px wide × 112px tall (standard ratio), scaling up to 90×126 on wider screens
- Cards have a subtle drop shadow: `0 4px 12px rgba(0,0,0,0.5)`
- Cards have `border-radius: 6px` and a 1px white border
- Slight random rotation (±3°) applied to each card for an organic, hand-dealt feel — but the active/newest card is always upright
- On hover, cards in the player's hand lift slightly (`translateY(-4px)`) for tactile feedback

---

## Layout

```
┌──────────────────────────────────────────────┐
│              ROYAL PINK BLACKJACK             │  ← Header / title
│         Balance: $1000   Bet: $50             │  ← Stats bar
├──────────────────────────────────────────────┤
│                                              │
│        DEALER  [score]  [cards]              │  ← Dealer area
│        ─────────────────────────             │
│        PLAYER  [score]  [cards]              │  ← Player area (split = two hands)
│                                              │
│   [Chip tray: 1 · 5 · 10 · 25 · 100]        │  ← Betting chips
│   [Clear Bet]  [Deal ▶]                      │
│   [Hit] [Stand] [Double] [Split] [Insurance] │  ← Action buttons
│                                              │
│   ♠ Running Count: +2  |  Hint: Stand        │  ← Count / strategy bar
├──────────────────────────────────────────────┤
│   History: W $50 · L $25 · W $100 · Push $50 │  ← Betting history strip
└──────────────────────────────────────────────┘
```

- Dealer hand anchored to top of table, player hand to bottom
- On split: player area shows two side-by-side hands; active hand highlighted with pink glow
- Chip tray horizontally centered above action buttons
- Action buttons appear only during the play phase; chip/deal buttons appear only during betting phase
- History scrolls horizontally at the bottom, newest entry on the left

---

## Game States

### State 1 — Betting
- Chip tray and [Clear Bet] / [Deal] buttons are visible and enabled
- Action buttons (Hit, Stand, etc.) are hidden
- Current bet displayed prominently
- Deck and hands are cleared from previous round

### State 2 — Insurance Prompt *(conditional)*
- Triggered when dealer's face-up card is an Ace
- Overlay or highlighted prompt: "Dealer shows Ace — Take Insurance? (costs half your bet)"
- [Yes – Take Insurance] and [No – Decline] buttons shown
- All other buttons disabled until decision is made

### State 3 — Playing
- Chip tray hidden; action buttons shown
- Available actions depend on situation:
  - **Hit**: always available (unless bust/21)
  - **Stand**: always available
  - **Double Down**: only on first two cards, if balance ≥ current bet
  - **Split**: only when both cards have equal value, if balance ≥ current bet
- On split: player plays left hand to completion, then right hand auto-activates
- Active hand indicated by a glowing pink border
- Running count and strategy hint update after each card

### State 4 — Dealer Reveal
- Dealer flips hole card with animation
- Dealer draws automatically (hits on ≤ 16, stands on ≥ 17)
- Brief 600ms delay between each dealer draw for drama
- No player input during this phase

### State 5 — Round Complete
- Result banner shown: WIN / LOSE / PUSH / BLACKJACK
- Payout applied to balance
- [New Round] button appears (maps to Enter or Space key)
- History strip updates with result

---

## Blackjack Rules

**Deck:** Single standard 52-card deck, reshuffled each round.

**Card Values:**
- Number cards (2–10): face value
- Face cards (J, Q, K): 10
- Ace: 11, reduced to 1 if hand would bust

**Deal:** Player gets 2 cards face-up; dealer gets 1 face-up, 1 face-down (hole card).

**Natural Blackjack:**
- Player blackjack (Ace + 10-value on first two cards) pays **1.5×** the bet
- If dealer also has blackjack → **Push** (bet returned, no payout)
- Player blackjack checked before play begins; round ends immediately unless dealer also has Ace showing (insurance offered first)

**Hit:** Player draws one card. Auto-stand on 21. Auto-bust on >21.

**Stand:** Player ends their turn; dealer reveals and draws.

**Double Down:** Player doubles bet, receives exactly one more card, then stands.

**Split:**
- Only when initial two cards have equal value (e.g., 8-8, A-A, K-K, Q-J are NOT splittable — must be same value, not just same rank category)
- Bet is matched for the second hand
- Each hand plays independently
- Aces split: each Ace receives exactly one more card (no further hitting)
- No re-splitting after split

**Insurance:**
- Offered when dealer's face-up card is an Ace
- Costs half the current bet
- Pays 2:1 if dealer has blackjack; lost if dealer does not

**Dealer Rules:** Dealer hits on hard 16 or less, stands on hard 17 or more. Dealer hits on soft 16 (Ace + 5), stands on soft 17 (Ace + 6).

**Push:** Player and dealer finish with equal scores → bet is returned.

**Bust:** Any hand exceeding 21 loses immediately.

**Winning Payouts Summary:**
| Outcome | Payout |
|---|---|
| Player wins (non-blackjack) | 1:1 (win equal to bet) |
| Player natural blackjack | 3:2 (win 1.5× bet) |
| Insurance win | 2:1 on insurance side bet |
| Push | Bet returned |
| Player bust or lower score | Bet lost |

---

## Chips

| Chip | Color | Value |
|---|---|---|
| Pink | Hot pink `#FF6EB4` | $1 |
| Rose | Rose `#E8536A` | $5 |
| Magenta | Magenta `#C2185B` | $10 |
| Purple | Deep purple `#7B1FA2` | $25 |
| Black | `#1A1A2E` with pink rim | $100 |

Clicking a chip adds that value to the current bet. Bet cannot exceed current balance. Minimum bet is $1.

---

## Animations

### Card Sliding (Deal Animation)
Cards originate from the **deck/shoe position** (top-right corner of the table). Each card:
1. Starts at the deck position, face-down, at scale 0.6
2. Slides along a curved arc path to its destination slot using CSS `@keyframes` with `transform: translate()` + `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing
3. Scales up to full size as it travels (0.6 → 1.0)
4. Lands with a subtle bounce (`scale(1.05)` then back to `1.0`) — like a card being slid across felt
5. Each card in a multi-card deal is staggered by 180ms so they don't all arrive at once
6. Total travel time: ~400ms per card
7. Player cards arrive face-up; dealer's second card arrives face-down (back image shown)

### Card Flip (Hole Card Reveal)
When the dealer reveals the hole card:
1. Card performs a CSS 3D `rotateY(0deg → 90deg)` over 200ms (card "disappears" edge-on)
2. At 90° the `src` swaps from back image to face image
3. Card then rotates `rotateY(90deg → 0deg)` over 200ms (card "reappears" face-up)
4. Total flip duration: 400ms with `ease-in-out`
5. A subtle scale pulse (1.0 → 1.08 → 1.0) accompanies the flip for emphasis

### Hit (New Card Deal)
- Same sliding arc animation as initial deal, but originates from deck and travels only to the player's hand
- Newly arrived card glows hot pink (`box-shadow: 0 0 20px #FF6EB4`) for 600ms then fades

### Win Particle Effects
Triggered on: player win, player blackjack, dealer bust. Uses a **canvas-based particle system** layered over the table:

**Standard Win:**
- 60 particles burst from the winning hand area
- Particle shapes: small circles and `◆` diamond shapes (drawn on canvas)
- Colors: hot pink `#FF6EB4`, rose gold `#E8A0B4`, white `#FFFFFF`, magenta `#E91E8C`
- Particles shoot outward with randomized velocity, then arc downward under simulated gravity
- Each particle fades out over 1.2–1.8s with size shrinking to 0
- Canvas cleared after all particles expire (~2s total)

**Blackjack Win (extra special):**
- 120 particles — larger, faster, more spread
- Additional `★` star shapes mixed in
- A shower of particles also falls from the top of the screen like confetti for 2.5s
- Falling confetti pieces are thin rectangles that rotate as they fall, in the pink palette

**Bust (player):**
- 20 small gray/dark particles scatter downward from the busted hand — "shattered" feel
- No upward burst; just a downward droop effect
- Busted cards dim to 40% opacity with a desaturate CSS filter

### Chip Add
- Chip bounces: `scale(1.0 → 1.3 → 1.0)` over 200ms when clicked
- A ghost duplicate of the chip flies from the tray to the bet stack area, fading out as it arrives

### Result Banner
- Banner fades in + scales up from `scale(0.7)` to `scale(1.0)` over 300ms with `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot/bounce)
- **WIN**: Green-tinted banner with pink glow
- **BLACKJACK!**: Animated rainbow/shimmer gradient text using `background-clip: text` and a moving gradient keyframe
- **LOSE**: Red-tinted, dims slightly after 1s
- **PUSH**: Neutral gray-pink, no glow

### Balance Change
- When balance increases: number briefly turns gold and scales up `(1.0 → 1.15 → 1.0)` over 300ms
- When balance decreases: number briefly turns red and shakes (`translateX` jitter) over 300ms

### Table Idle State
- Between rounds, the deck shoe in the corner has a very subtle continuous float animation (`translateY 0px → -4px → 0px`, 3s loop) to keep the scene feeling alive

---

## Card Counting Display

- Shows **Running Count** using Hi-Lo system (2–6 = +1, 7–9 = 0, 10–A = −1)
- Count updates every time a card is revealed (including dealer hole card at reveal)
- Displayed as: `Count: +3` with color coding (green = positive, red = negative, white = 0)
- Count resets to 0 when deck is reshuffled

---

## Strategy Hints

Basic strategy hint shown as a one-word label: **Hit**, **Stand**, **Double**, **Split**, or **Surrender** (display only, not enforced).

Hint is based on standard blackjack basic strategy table using:
- Player hand total (and whether it's soft)
- Dealer's face-up card

Displayed in the hint bar below the table during the playing state only. Label prefixed with: `💡 Hint:`

---

## Betting History

- Shown as a horizontal scrolling strip at the bottom of the screen
- Each entry shows: result label + amount (e.g., `✓ +$75`, `✗ -$50`, `= $0`)
- Color coded: green for win, red for loss, gray for push
- Max 20 entries stored; oldest removed when exceeded
- Summary stats shown to the right of the strip: **W/L/P record** and **net profit/loss**

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `H` | Hit |
| `S` | Stand |
| `D` | Double Down |
| `P` or `V` | Split |
| `I` | Take Insurance |
| `Enter` or `Space` | Deal / New Round |
| `C` | Clear Bet |
| `1` | Add $1 chip |
| `5` | Add $5 chip |
| `0` | Add $10 chip |
| `2` | Add $25 chip |
| `9` | Add $100 chip |

Shortcuts only active when the corresponding action is valid (e.g., `H` does nothing during betting phase).

---

## Visual Enhancements Summary

A consolidated list of all extra polish to implement:

### Table & Environment
- **Felt grain texture:** CSS `filter: url(#noise)` SVG filter or a semi-transparent PNG grain overlay at 8% opacity on the table surface
- **Vignette:** A radial gradient overlay on the full page background — dark at corners, lighter in the center — creates a spotlight-on-the-table feel
- **Decorative border motif:** A repeating `◆ ◆ ◆` pattern in rose-gold inside the table border
- **Ambient glow:** The table itself casts a faint pink glow onto the background (`box-shadow: 0 0 80px 20px rgba(139, 26, 74, 0.4)`)

### Cards
- **Real card images** from Deck of Cards API (see Card Images section)
- **Organic rotation:** Each dealt card gets a CSS `rotate(Xdeg)` where X is a seeded random value between -3 and +3 — newest card always 0°
- **Card back design:** Uses the API back image; back should have a subtle pink tint CSS filter (`hue-rotate` + `saturate`) to match the theme
- **Drop shadows:** Rich shadows under every card for depth
- **Hover lift:** Player cards lift on hover (cursor: pointer only when an action is available)

### Deck Shoe
- Shown as a stacked visual of 4–5 card backs in the top-right corner of the table
- Visually shrinks (fewer cards visible) as the round progresses — purely decorative
- Label underneath: `SHOE` in Josefin Sans, small caps

### Scoring Badge
- Score shown in a pill-shaped badge next to each hand label
- Soft hand (Ace counted as 11): badge has a star/sparkle prefix `✦`
- Blackjack: badge glows and shows `BJ ✦`
- Bust: badge turns red and shows `BUST`

### Buttons
- Primary action buttons have a gradient background, 1px rose-gold border, and a glow on hover
- Buttons use `letter-spacing: 0.12em` and all-caps Josefin Sans
- On press: brief `scale(0.95)` depression effect
- Disabled state: 35% opacity, no hover effects, `cursor: not-allowed`

### Background
- Full page background: very dark `#1A0810` with a subtle repeating CSS diamond pattern (`background-image: repeating-linear-gradient`) in slightly lighter `#220F14`
- Pink radial gradient from center outward fades the pattern for a spotlight effect

## Testing Scenarios

### Required Tests

1. **Player Blackjack, Dealer No Blackjack**
   - Deal: Player gets Ace + King (21), Dealer gets 7 + 5 (12, then hits)
   - Expected: Player wins 1.5× bet. Balance increases by 1.5× bet amount.

2. **Both Player and Dealer Blackjack**
   - Deal: Player gets Ace + Jack, Dealer has Ace + Queen
   - Expected: Push. Bet returned. Balance unchanged.

### Additional Tests

3. **Bust:** Player hits until >21 → bet lost immediately, dealer does not reveal.
4. **Dealer Bust:** Dealer draws past 21 → all non-busted player hands win 1:1.
5. **Push (tie, non-blackjack):** Both end on same score (e.g., 18 vs 18) → bet returned.
6. **Double Down:** Bet doubles, exactly one card dealt, then stand. Verify balance deduction.
7. **Split Aces:** Each Ace gets exactly one card; no further hits allowed.
8. **Insurance Win:** Player takes insurance; dealer has blackjack → insurance pays 2:1.
9. **Insurance Loss:** Player takes insurance; dealer does not have blackjack → insurance bet lost.
10. **Soft Ace handling:** Ace + 6 + 8 = 15 (not 25); Ace + 5 = soft 16 (dealer must hit).
11. **Balance protection:** Bet chips are disabled when remaining balance is insufficient.
12. **Running count accuracy:** Deal 2, 5, King → count should be +2 (2=+1, 5=+1, K=−1... net +1). Verify after each card.

---

## Starting Conditions

- Starting balance: **$1,000**
- Default bet: **$10** (pre-loaded on new game)
- If balance reaches $0: show "Out of chips" message with [Reload $1000] button
