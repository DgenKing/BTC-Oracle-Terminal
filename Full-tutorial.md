# 🔮 BTC Oracle Terminal: The Definitive User Guide

Welcome to the **BTC Oracle Terminal** — a disciplined, systematic trading framework designed for high-probability Bitcoin setups. This is **not** a gambling tool. It enforces structural market bias, real-time technical signals, AI-powered sentiment, and strict risk rules to filter noise and deliver only quality trades.

The terminal is fully hosted — just open the link in your browser (desktop or mobile). No installation required.

---

## 🛠️ Command Directory (All 13 Commands)

### 1. Market Analysis Commands
- **price**  
  Fetches live BTC/USD price + 24h change from CoinGecko.
- **bias**  
  Compares current price to Monday 00:00 UTC open.  
  → Above = **BULLISH** weekly bias  
  → Below = **BEARISH** weekly bias
- **rsi**  
  14-period Relative Strength Index (daily timeframe).  
  → < 30: Oversold (potential bounce)  
  → > 70: Overbought (potential reversal)
- **gaps**  
  Lists unfilled CME Bitcoin futures gaps (price magnets that fill ~90% of the time).
- **sentiment**  
  Current Crypto Fear & Greed Index.  
  → < 20: Extreme Fear → long opportunities  
  → > 80: Extreme Greed → caution / short exits
- **analyze <text>**  
  Paste any social media post, news headline, or tweet. AI classifies it as **BULLISH**, **BEARISH**, or **NOISE/COPE**.
- **ask <question>**  
  Ask the AI anything. The model automatically receives live price, RSI, bias, and sentiment for context-aware answers.

### 2. Execution & Risk Commands
- **play**  
  Full system scan. Aggregates bias, RSI, sentiment, and gaps into an **Oracle Report Card** with a clear verdict: **LONG**, **SHORT**, or **NO TRADE** + confidence %.
- **calc <entry> <stop> [target]**  
  Checks your trade setup against **The Bouncer**.  
  Mandatory rule: **Reward:Risk must be ≥ 6:1** or the trade is **REJECTED**.  
  Example: `calc 65000 64500 68500`
- **size <risk%> <entry> <stop>**  
  Calculates exact position size in BTC based on your account balance and chosen risk %. Uses the account size saved in **settings**.

### 3. Utility & Navigation Commands
- **settings**  
  Set or update your account balance (in USD) for accurate position sizing. Value is saved in your browser (localStorage).
- **help**  
  Displays the full visual command grid.
- **clear**  
  Wipes the terminal log history.

---

## 🎮 How to Use the Terminal (UX/UI Guide)

### Desktop Experience
1. **Input**: Type commands in the glowing input bar at the bottom.
2. **Execute**: Press **Enter**.
3. **Command History**: Use **↑ / ↓ arrow keys** to cycle through previous commands.
4. **Scrolling**: The log auto-scrolls to new outputs. When you run **help**, it intelligently scrolls to the top of the help section for easy reading.

### Mobile Experience
1. **Input**: Tap the input bar at the bottom to type.
2. **Quick Command Grid** (12 buttons at the very bottom):
   - **One-tap buttons**: price, bias, rsi, gaps, sentiment, play, help, clear → instantly run the command.
   - **Pre-fill buttons**: calc, size, analyze, ask → insert the command template so you only need to add parameters.
3. The grid stays fixed at the bottom for fast access without scrolling.

### Visual Feedback
- **Green** text: Bullish / success / approved
- **Red/Alert** text: Bearish / danger / rejected
- **Amber** text: System messages / processing
- **Loading**: "[SYSTEM]: PROCESSING..." with pulse animation while fetching data or AI responses.

---

## 📖 Step-by-Step: How to Find and Take a Trade

### Step 1: Establish Weekly Bias (Monday Morning)
Run: `bias`  
→ This is your anchor for the entire week.  
**Rule**: Only trade in the direction of the bias unless RSI is extreme (>80 for shorts in bull bias, <20 for longs in bear bias).

### Step 2: Check Price Magnets
Run: `gaps`  
→ Look for unfilled CME gaps. Price is strongly attracted to fill them.

### Step 3: Get Full System Verdict
Run: `play`  
→ Read the **Oracle Report Card**.  
Only proceed if confidence > 75% and verdict is LONG or SHORT.

### Step 4: Validate Risk (The Bouncer)
Plan your levels, then run:  
`calc <entry> <stop> <target>`  
→ If **APPROVED** (R:R ≥ 6:1) → proceed.  
→ If **REJECTED** → adjust stop or target until approved.

### Step 5: Size the Position
First ensure your account balance is set: `settings`  
Then run:  
`size 1 65000 64500` (example: risk 1% of account)

### Step 6: Execute & Manage
- Enter the trade on your exchange.
- Never hold over weekend → close by Friday NY close.

---

## 📈 Core Strategy: "Monday-Tuesday Quality Trade" (1 Trade Per Week)

**Goal**: Maximum discipline, minimum screen time.

1. **Sunday/Monday — Wait**  
   Do nothing Sunday night. Let CME open Monday 00:00 UTC to set the weekly anchor price.

2. **Tuesday — Confirmation**  
   Run `bias`.  
   → Price above Monday open → look for **LONGS** only  
   → Price below Monday open → look for **SHORTS** only

3. **Wait for Retrace**  
   Watch for price to retrace/touch the Monday open level again.

4. **Confluence Check** (when price touches Monday open):
   - Run `rsi` → ideal 40–50 for longs, 50–60 for shorts
   - Run `play` → need >75% confidence
   - Build a 6:1 R:R setup and validate with `calc`

5. **Enter** only when all checks pass.

6. **Exit**  
   - Primary: Hit your 6:1 target  
   - Latest: Friday New York close (no weekend holds)

---

## 💡 Pro Tips
- Use `ask` for clarification: e.g., `ask Why is the bias still bullish despite the drop?`
- Paste wild Twitter takes into `analyze` to cut through hype.
- Always start a new week with `clear` for a clean mental slate.
- The terminal enforces discipline — if The Bouncer rejects your trade, walk away.

Structural discipline over hype. Trade like a machine. 🔮🚀
