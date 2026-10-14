---
doc: spec
status: approved
---

# Kingdoms & Dragons Tower Defense — Technical Spec

## How This Works, In Plain Language
The game is a single web page with **two layers stacked on top of each other**:

1. **The world layer (Phaser 4 canvas).** Phaser draws and runs everything that lives on the map: the grid, the 4 paths, the castle, the enemies walking, the traps, the scenery. All of it is **drawn with code** (shapes, gradients, outlines) when the game starts and saved as reusable images (textures), so there are no image files to load.
2. **The interface layer (HTML/CSS on top).** Normal web elements styled like Market Royale handle the Main Menu, How to Play, HUD, Shop, Inventory, trap picker, Upgrade button, and Stats Screen. CSS makes pill buttons, rounded cards, gradients, frosted glass, and the Fredoka font easy.

The two layers talk through a small **event bus**: a shared messenger. The game says "money changed" or "a path cell was tapped"; the interface listens and updates. The interface says "the player bought a trap" or "pressed Upgrade"; the game listens and acts.

All the numbers and content (5 eras, their enemies, traps, prices, wave sizes, upgrade costs) live in **data files**, separate from the code. Balancing the game means editing numbers in one place.

**Vite** runs the game locally while building (reloading on every save) and packs it into plain static files. **GitHub Actions** builds those files on every push to `main` and publishes them to **GitHub Pages**, so anyone can play from a link with nothing to install.

Why this shape: one page and no server means nothing can go down, nothing to log in to, and free hosting. Splitting world and interface lets each tool do what it is best at.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Open the link** → GitHub Pages serves `index.html` → `main.js` starts Phaser → `BootScene` draws every texture with code → `MenuScene` shows Era 1 scenery as a background → the interface shows the **Main Menu** (logo, Play, How to Play).
2. **Click Play** → the Main Menu emits `ui:play` → `GameScene` starts with a fresh **game state** (Era 1, Wave 1, starting money, full castle health, empty Inventory) → the interface hides the menu and shows the HUD.
3. **Click the castle** → `GameScene` adds money to the state → emits `state:changed` → the HUD's money counter updates; a "+money" pop-up floats over the castle.
4. **Open Shop, buy a trap** → the interface emits `ui:buyTrap` → the economy logic checks money, deducts it, adds 1 to the Inventory → `state:changed` → Shop and Inventory update.
5. **Tap a path cell** → `GameScene` converts the tap to a grid cell; if it is an empty path cell it emits `cell:tapped` with the cell and screen position → the interface opens the **trap picker** there with the era's 3 traps (owned → count, unowned → price, dimmed if unaffordable) → the player taps a trap → `ui:placeTrap` → `buyAndPlaceTrap` uses an owned trap or buys one on the spot → `GameScene` places a trap sprite → `state:changed`.
6. **Waves** → the **wave manager** builds each wave from the era data and spawns enemies at the 4 map edges → each enemy walks its lane toward the castle each frame → when it enters a cell with a trap it hasn't hit yet, the trap deals damage (extra against its countered type) and loses 1 use; at 0 uses it is removed.
7. **Enemy dies** → its stone/wood/gold drop plus money (scaled by the wave's toughness) is added to the state and pops up → `state:changed` → HUD updates; the kill counter goes up.
8. **Enemy reaches the castle** → castle health drops; the enemy is removed → the health bar above the castle updates.
9. **Press Upgrade** (enabled only when affordable) → `ui:upgrade` → economy logic spends the resources, refunds every old-era trap (map and Inventory) as money, adds the era bonus, refills castle health, moves to the next era → `GameScene` redraws castle and scenery for the new era → the Shop lists the new era's traps → the wave manager makes the next wave Wave 1 of the new era.
10. **Wave 20 finished without upgrading** → the wave manager repeats that era's Wave 20.
11. **Game ends** → castle health 0 → `game:over` (lose); Era 5 Wave 20 cleared → `game:over` (win) → `GameScene` pauses → the interface shows the **Stats Screen** with time, kills, and money remaining, plus Play Again and Main Menu buttons.

## Stack
- **Phaser 4.2.1** (`phaser` on npm, `latest` tag checked 2026-10-14). Game framework for the world layer. Chosen by the learner to learn Phaser. Docs: https://docs.phaser.io · Source: https://github.com/phaserjs/phaser · Official Vite template: https://github.com/phaserjs/template-vite
  - **Verify early in the build:** the learner's past Phaser experience may be Phaser 3; Phaser 4 is close to Phaser 3 but its renderer changed. Confirm that `Graphics.generateTexture`, `this.time.timeScale` / `this.tweens.timeScale`, and pointer input behave as expected in 4.2.1 before drawing all the art.
- **Vite 8.3.4.** Dev server with live reload and production bundler. Chosen by the learner. Docs: https://vite.dev/guide/ · GitHub Pages deploy guide: https://vite.dev/guide/static-deploy#github-pages
- **JavaScript (ES modules)**, no TypeScript. Chosen by the learner.
- **@fontsource/fredoka 5.3.0.** Self-hosted Fredoka font bundled by Vite, so it works without Google Fonts. Docs: https://fontsource.org/fonts/fredoka
- **Vitest** (dev only). Small unit tests for the pure game rules (economy, refunds, wave building, damage). Supports the learner's goal "get the game running smoothly". Docs: https://vitest.dev
- **Node.js 24.15.0 / npm 11.12.1** (installed on the learner's machine; Vite 8 requires Node 20.19+ or 22.12+).

## Where It Runs and How Someone Tries It
- **Runtime:** any modern desktop or mobile browser. No server, no API keys, no accounts.
- **Local development:**
  ```
  npm install
  npm run dev        # opens http://localhost:5173
  npm test           # runs the Vitest rule tests
  npm run build      # outputs static files to dist/
  npm run preview    # serves dist/ locally to check the production build
  ```
- **Public link (chosen by the learner):** GitHub Pages at **https://kelvintrinhsg.github.io/Kingdoms-Dragons-Tower-Defense/**.
  - `vite.config.js` sets `base: '/Kingdoms-Dragons-Tower-Defense/'` so assets load from the repo subpath.
  - `.github/workflows/deploy.yml` runs on every push to `main`: install → test → build → upload `dist/` → deploy to Pages.
  - One-time setup: repo **Settings → Pages → Source: GitHub Actions**; repo must be **public** (also required for submission).
  - Docs: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- **Demo recording (required for submission):** open the public link (or `npm run dev`), show Main Menu → Play → click castle → buy and place traps → waves → Upgrade (era swap is the "oh, that's cool" moment) → use the **speed button** to move through the run → Stats Screen. For a reliable short video, the **dev shortcuts** below can start at a later era/wave.
- **Dev shortcuts (testing only, URL parameters):** `?era=3&wave=18&money=5000&res=999` starts the run at that point with those amounts. Ignored when absent. Lets the build verify late eras, the win condition, and the Wave-20 repeat without playing 100 waves.

## Look and Feel
From `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.

### World layer (Phaser, drawn with code)
- **Style:** Kingdom Rush–like: chunky, slightly cartoonish shapes; thick dark outlines (`#2b1d12`, 3–4px); soft top-left highlight and a dark drop shadow under every object; warm, saturated earthy colors. No emoji (they render differently on each OS).
- **Shared drawing templates:** every enemy is built from one enemy template (body, head, era accessory such as club, spear, sword, musket, rifle; size by role: fast = small, standard = medium, heavy = large with mount/vehicle). Every trap is built from one trap template (base plate plus era-specific top). Every castle is drawn by its era's function. Scenery uses tree, rock, and building templates.
- **Era palettes** (ground / path / accent):
  1. Prehistoric Cave — dry grass `#9bb35a` / dirt `#b98b55` / stone grey `#8a7f73`, ferns and boulders.
  2. Wooden Fort — meadow `#7fae4a` / dirt `#c9a66b` / timber `#8b5a2b`, oak trees and wooden huts.
  3. Stone Castle — green `#6f9e45` / cobble `#b9ad97` / stone `#8a8f96`, pines and stone cottages.
  4. Pre-modern Barracks — olive `#8a9a52` / gravel `#a89a7a` / brick `#9c4a33`, tents and cannons.
  5. Modern Barracks — dark green `#5d7d44` / asphalt `#5f6166` / steel `#4b5563`, sandbags and bunkers.
- **Feedback:** floating "+money" and resource pop-ups; enemies flash white when hit; a short shake when the castle is hit; a scale-up "evolve" flash when upgrading.

### Interface layer (HTML/CSS, Market Royale style)
- **Font:** Fredoka 400–700 (`@fontsource/fredoka`), fallback `Inter, ui-rounded, system-ui, sans-serif`. Headings and buttons bold and uppercase. Numbers use `font-variant-numeric: tabular-nums`.
- **Colors (CSS variables):** `--text #141F3D`, `--muted #406394`, `--surface #FFF`, `--inset #EAF9FF`, `--line #DCEBF4`, blue gradient `#00A5FF → #1259E0`, purple `#9A48F8 → #5636D5`, orange `#FF6B0A → #FF9E16`, primary `--green #35EC00` with `#144509` text, `--yellow #FFF04D`, `--danger #C7141F`.
- **Shapes:** cards 28–34px radius; pill buttons 32px radius with `box-shadow: 0 5px 9px rgba(0,46,89,.14), inset 0 2px 1px rgba(255,255,255,.25)`; hover lifts 2px; soft shadow `0 10px 26px rgba(0,46,89,.13)`; frosted-glass panels `rgba(255,255,255,.16)` with `backdrop-filter: blur`.
- **Stats Screen:** Market Royale results style: big Win/Defeat title (green/purple for win, red for defeat), 3 large stat tiles in a grid.
- **Interface copy:** short, upbeat, uppercase labels ("PLAY", "UPGRADE", "SHOP", "VICTORY!", "DEFEAT").

## Components

### Bootstrap and Layout (`index.html`, `src/main.js`)
Creates the page with a `#game` container for the Phaser canvas and a `#ui` overlay container above it. Starts Phaser with `Scale.FIT` on a fixed logical size (1280×800) so the map scales to any screen, then starts the interface. Reads dev-shortcut URL parameters.
PRD ref: `prd.md > Screens and Layout`.

### Event Bus (`src/bus.js`)
One shared `Phaser.Events.EventEmitter` imported by both layers. Events:
- Game → UI: `state:changed` (full state snapshot), `cell:tapped` ({col,row,x,y}), `cell:info` (occupied cell, remaining uses), `castle:moved` (screen position of castle for the Upgrade button), `game:over` ({won, timeMs, kills, money}).
- UI → Game: `ui:play`, `ui:buyTrap` (trapId), `ui:placeTrap` ({trapId,col,row}), `ui:upgrade`, `ui:speed`, `ui:menu`, `ui:restart`.
PRD ref: supports every `prd.md > Features and Behavior` heading.

### Game State (`src/logic/state.js`)
Creates the run's state object and holds it during play (see Data Model). Only the logic modules change it; after every change `GameScene` emits `state:changed`.
PRD ref: `prd.md > States and Boundaries`.

### Economy Rules (`src/logic/economy.js`)
Pure functions, unit-tested: `clickCastle`, `canAfford`, `buyTrap`, `placeTrap`, `buyAndPlaceTrap` (checks the cell first, then uses an owned trap or buys one — never spends on a failed placement), `killReward` (drop + money × wave reward multiplier), `addDrop`, `upgradeCost`, `canUpgrade`, `refundTraps` (price × remaining uses ÷ total uses, rounded down), `eraBonus` (2 × cheapest trap of the new era), `applyUpgrade` (spend, refund, bonus, health refill, era + 1, wave reset to 1).
PRD ref: `prd.md > Clicking the Castle`, `prd.md > Shop and Inventory`, `prd.md > Castle Upgrade and Eras`.

### Combat Rules (`src/logic/combat.js`)
Pure functions, unit-tested: `trapDamage(trap, enemy)` (base damage × counter multiplier, e.g. ×3 against the countered type), `hitTrap` (applies damage, uses − 1, reports if the trap is used up or the enemy died), `castleHit`.
PRD ref: `prd.md > Traps in Action`, `prd.md > Waves and Enemies`.

### Wave Manager (`src/logic/waves.js` + used by `GameScene`)
`buildWave(era, waveNumber)` returns a list of spawns (enemy type, direction, lane, delay) from the era data plus health, speed, and reward multipliers: Wave 1 is small, slow, and weak; enemy count, health, and speed grow with the wave number; heavier enemies appear more in later waves; the money reward grows with the health multiplier; enemies are spread across all 4 directions. Unit-tested. `GameScene` runs the spawn timer, detects wave end (all spawned and none alive), waits a short break (~3 s), then starts the next wave: Wave + 1, or Wave 20 again if Wave 20 just ended without an upgrade. Clearing Era 5 Wave 20 triggers a win.
PRD ref: `prd.md > Waves and Enemies`, `prd.md > Castle Upgrade and Eras`.

### Grid and Paths (`src/world/grid.js`)
Defines the 32×20 grid of 40px cells (1280×800). The castle occupies the center block (cols 14–17, rows 8–11). Four straight paths, each 2 cells wide: North (cols 15–16, rows 0–7), South (cols 15–16, rows 12–19), West (rows 9–10, cols 0–13), East (rows 9–10, cols 18–31). Helpers: `isPathCell`, `cellAt(x,y)`, `cellCenter`, and each lane's waypoint list from the edge to the castle.
PRD ref: `prd.md > Placing Traps`, `prd.md > Screens and Layout`.

### Procedural Art (`src/art/*.js`)
Drawing functions using `Phaser.GameObjects.Graphics`; `BootScene` calls them once and saves each result with `generateTexture` under keys like `enemy-1-fast`, `trap-3-mid`, `castle-2`, `tree-4`. Files: `palette.js` (era palettes, outline color), `castle.js`, `enemy.js` (one template + per-era accessories), `trap.js`, `scenery.js`, `fx.js` (pop-up text, hit flash).
PRD ref: `prd.md > Look and Feel`, `prd.md > Castle Upgrade and Eras`.

### Scenes (`src/scenes/`)
- **BootScene** — generates all textures, then starts `MenuScene`.
- **MenuScene** — draws an Era 1 map as the live menu background; waits for `ui:play`.
- **GameScene** — the world: grid, scenery, castle (clickable), castle health bar (Phaser), traps, enemies, wave manager, speed control (multiplies frame time by 1/2/4 and sets timer/tween time scales), tap-to-cell handling, era redraw on upgrade, game-over detection. Calls the logic modules and emits bus events.
PRD ref: `prd.md > The Core Journey`, `prd.md > Speed Button`.

### Enemies (`src/world/Enemy.js`)
A sprite with type, health, speed, lane waypoints, and a set of trap cells it has already triggered (so a trap fires once per enemy). Moves along waypoints each frame (no physics engine needed); reports when it enters a new cell or reaches the castle.
PRD ref: `prd.md > Waves and Enemies`, `prd.md > Traps in Action`.

### Traps (`src/world/Trap.js`)
A sprite on a path cell with trap type and remaining uses; shows a small uses badge; removed at 0 uses or on era upgrade.
PRD ref: `prd.md > Traps in Action`, `prd.md > Placing Traps`.

### Interface Screens (`src/ui/`)
Plain DOM modules, each rendering into `#ui` and talking only through the bus:
- `menu.js` — Main Menu (logo wordmark in CSS, Play, How to Play panel). PRD ref: `prd.md > Screens and Layout`.
- `hud.js` — top-left era/wave + speed button; top-right money/stone/wood/gold; middle-left Shop button. PRD ref: `prd.md > Screens and Layout`, `prd.md > Speed Button`.
- `shop.js` — Shop panel (3 current-era traps with price, uses, countered enemy, disabled when unaffordable) and Inventory list with counts. No sell option. PRD ref: `prd.md > Shop and Inventory`.
- `picker.js` — trap picker positioned at the tapped cell, showing the era's 3 traps (Inventory count or price; unaffordable ones disabled and dimmed, re-rendered on `state:changed`); a "tap the castle to earn more" message when nothing is owned or affordable; remaining-uses note for occupied cells. PRD ref: `prd.md > Placing Traps`, `prd.md > States and Boundaries`.
- `upgrade.js` — Upgrade button kept positioned above the castle's health bar (follows `castle:moved` and window resize); disabled with missing amounts listed; "MAX ERA" in Era 5. PRD ref: `prd.md > Castle Upgrade and Eras`.
- `stats.js` — Win/Defeat Stats Screen with time, kills, money; Play Again and Main Menu buttons. PRD ref: `prd.md > Stats Screen`.
- `styles.css` — Market Royale variables and components.

### Game Data (`src/data/`)
- `eras.js` — the 5 eras: name, palette key, castle health, upgrade cost to the *next* era (stone/wood/gold), the 3 enemies (id, name, role, health, speed, castle damage, drop of stone/wood/gold, base money reward), the 3 traps (id, name, price, uses 1/3/5, base damage, countered enemy id). Names from `prd.md > Era Roster`.
- `balance.js` — starting money, money per click, counter multiplier, wave growth, spawn interval, break between waves, wave count per era (20), speed levels (1, 2, 4).
PRD ref: `prd.md > Era Roster`, `prd.md > Open Questions` (balance numbers).

### Deployment (`vite.config.js`, `.github/workflows/deploy.yml`)
Sets the Pages base path; the workflow tests, builds, and deploys on push to `main`.
PRD ref: `scope.md > Who It's For` (play from a link).

## Data Model
Everything lives **in memory in the browser tab** for one run. Nothing is saved; closing or reloading the tab ends the run (`prd.md > States and Boundaries`, Persistence).

```js
state = {
  era: 1,                 // 1..5
  wave: 1,                // 1..20 within the era
  waveRepeating: false,   // true while Wave 20 repeats
  money: 0, stone: 0, wood: 0, gold: 0,
  castleHp: 0, castleMaxHp: 0,
  inventory: { 'trap-1-cheap': 0, ... },  // current-era trap counts
  traps: [ { id, trapId, col, row, usesLeft } ],  // placed traps
  kills: 0,
  startedAt: 0,           // real clock time when Play was pressed
  speed: 1,               // 1 | 2 | 4
  over: false, won: false
}
```
- **Created** by `state.js` when Play is pressed (or Play Again), using `balance.js` and dev shortcuts if present.
- **Updated** only by `economy.js` / `combat.js` / wave logic called from `GameScene`; every change emits `state:changed`.
- **Read** by the interface from the `state:changed` snapshot.
- **Era data** is static and read-only (`src/data/`).
- **Time to finish** = real elapsed time from Play to game over (not sped-up game time).

## File Structure
```
Kingdoms-Dragons-Tower-Defense/
├── index.html                 # #game canvas container + #ui overlay
├── package.json               # scripts: dev, build, preview, test
├── vite.config.js             # base path for GitHub Pages
├── .github/
│   └── workflows/
│       └── deploy.yml         # test → build → deploy to GitHub Pages
├── src/
│   ├── main.js                # starts Phaser + interface, reads dev shortcuts
│   ├── bus.js                 # shared event bus between world and interface
│   ├── data/
│   │   ├── eras.js            # 5 eras: enemies, traps, castle, upgrade costs
│   │   └── balance.js         # all tunable numbers in one place
│   ├── logic/                 # pure rules, no Phaser, unit-tested
│   │   ├── state.js
│   │   ├── economy.js
│   │   ├── combat.js
│   │   └── waves.js
│   ├── world/
│   │   ├── grid.js            # grid, paths, lanes, cell helpers
│   │   ├── Enemy.js
│   │   └── Trap.js
│   ├── art/                   # code-drawn textures
│   │   ├── palette.js
│   │   ├── castle.js
│   │   ├── enemy.js
│   │   ├── trap.js
│   │   ├── scenery.js
│   │   └── fx.js
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   └── GameScene.js
│   └── ui/                    # HTML/CSS interface (Market Royale style)
│       ├── styles.css
│       ├── menu.js
│       ├── hud.js
│       ├── shop.js
│       ├── picker.js
│       ├── upgrade.js
│       └── stats.js
├── tests/
│   ├── economy.test.js
│   ├── combat.test.js
│   └── waves.test.js
├── devpost/                   # Devpost learning workspace
├── .agents/ .claude/ agent/   # course skills (already in the repo)
└── README.md                  # what it is, how to play, link, how to run
```

## External Services and Dependencies
- **GitHub Pages + GitHub Actions** — hosting and automatic deploy. Free for public repositories. No keys needed in the code; the workflow uses the built-in `GITHUB_TOKEN` with `pages: write` and `id-token: write` permissions. Actions used: `actions/checkout`, `actions/setup-node`, `actions/upload-pages-artifact`, `actions/deploy-pages` (verify current major versions when writing the workflow). Docs: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- **npm packages:** `phaser`, `@fontsource/fredoka` (runtime); `vite`, `vitest` (dev). No other external services, APIs, or costs.

## Important Failure Modes
- **Blank page on GitHub Pages** (wrong asset paths) → `base` set in `vite.config.js`; check with `npm run preview` and the live URL after the first deploy.
- **Slowdown with many enemies at 4× speed** → enemies and traps reuse pre-generated textures (no per-frame drawing); cap enemies alive at once (e.g. 60) by delaying extra spawns; remove dead sprites immediately.
- **Interface misaligned with the canvas** (Upgrade button, trap picker) on resize or mobile → convert world coordinates to screen coordinates through the canvas's bounding box on every resize and `castle:moved`.
- **Balance unwinnable or trivial** → all numbers in `balance.js`/`eras.js`; dev shortcuts to jump to any era/wave; rule tests check that the era bonus buys exactly 2 cheapest traps and refunds are never negative.

## What Was Simplified and Why
- **Code-drawn art** instead of sprite sheets or hand-drawn art — chosen by the learner; no asset hunting or licensing, and all 5 eras get consistent art. A fuller version would replace the art functions with sprite images, without changing game logic.
- **Straight paths** from each edge to the castle instead of winding Kingdom Rush roads — keeps the 2-cell-wide grid paths, lanes, and trap placement simple. Winding paths would only need new waypoint lists in `grid.js`.
- **Waypoint movement** instead of a physics engine — enemies follow fixed lanes, so physics adds nothing.
- **No sound** — not in the PRD; listed under `prd.md > Possible Later Enhancements`.
- **Dev shortcuts** (URL parameters) — a testing aid, not a player feature; they make late eras and the win screen checkable and recordable.

## Decisions and Open Issues

### Learner decisions
- **Phaser 4 + Vite + JavaScript** — to learn Phaser on the current version; accepted tradeoff: Phaser 4 differs a little from Phaser 3.
- **GitHub Pages** — free, lives in the existing repo, auto-deploys; accepted tradeoff: the repo must be public.
- **Art drawn with code** — fastest route to all 5 eras; accepted tradeoff: it won't match Kingdom Rush's hand-painted quality.
- **HTML/CSS interface over the Phaser canvas** — Market Royale styling is natural in CSS; accepted tradeoff: a small event bus to sync the two layers.

### Implementation details derived from those decisions (Claude)
- Event bus as a shared Phaser EventEmitter; pure logic modules with Vitest tests; 1280×800 logical size with `Scale.FIT`; 32×20 grid of 40px cells; counter multiplier ×3; refund rounded down; enemies already on the map when the player upgrades keep walking (only the *next* wave changes era); time to finish measured in real time; dev-shortcut URL parameters.

### Learner uncertainty
None identified. The learner asked Claude to implement freely and plans to read the documentation after the build to deepen their understanding of Phaser. `5-build`'s code tour and app map should point to the key Phaser concepts used (scenes, `generateTexture`, the update loop, input, time scale) with links to https://docs.phaser.io.

### Open issues (carried from `prd.md > Open Questions`, tuned during build)
- Wave length (~20–30 s at 1×) and speed levels (1× / 2× / 4×).
- Balance numbers: money per click, trap prices, uses (1/3/5), damage, enemy health/speed, castle health, drops, upgrade costs.
- **Verify early:** Phaser 4.2.1 APIs used here (`generateTexture`, time scales, input), and current major versions of the GitHub Pages actions.
