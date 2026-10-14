---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Click the castle in the middle of a 4-path map and watch money go up**
  Becomes usable: `npm run dev` opens the Main Menu (logo, Play) over an Era 1 map; Play shows the Game Screen with the 32×20 grid, 4 two-cell paths, the code-drawn Era 1 castle, and the HUD. Clicking the castle adds money with a "+money" pop-up.
  Why now: Bootstraps everything (Vite, Phaser 4.2.1, Fredoka, Vitest, event bus, world + interface layers) through the first kernel behavior. Also proves the risky Phaser 4 APIs (`generateTexture`, pointer input, `Scale.FIT`) before any more art is drawn.
  PRD ref: `prd.md > The Core Journey` (steps 1–3), `prd.md > Screens and Layout`, `prd.md > Clicking the Castle`
  Spec ref: `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Components` (Bootstrap and Layout, Event Bus, Game State, Economy Rules, Grid and Paths, Procedural Art, Scenes, Interface Screens: `menu.js`, `hud.js`), `spec.md > Data Model`, `spec.md > File Structure`
  Build: Scaffold `package.json` (scripts dev/build/preview/test), `vite.config.js` (Pages base path), `index.html` with `#game` + `#ui`; install `phaser@4.2.1`, `@fontsource/fredoka`, `vite`, `vitest`. Add `bus.js`, `data/balance.js`, `logic/state.js`, `logic/economy.js` (`clickCastle`), `world/grid.js`, `art/palette.js`, `art/castle.js` (Era 1), `art/scenery.js` (Era 1), `art/fx.js`, Boot/Menu/Game scenes, `ui/styles.css`, `ui/menu.js`, `ui/hud.js`. First rule tests in `tests/economy.test.js`.
  Verify (mechanical): `npm test` passes; `npm run build` succeeds; dev server starts with no console errors; in a browser, Play shows the map and clicking the castle raises the HUD money counter.
  Learner check: Run `npm run dev`, open http://localhost:5173, press PLAY, click the castle a few times. You should see 4 dirt paths leading to a cave-style castle and the money in the top-right going up with a "+money" pop-up each click.
  Commit: `Add playable map with clickable castle and money HUD`

- [x] **2. Enemies attack from all 4 directions and can destroy the castle**
  Becomes usable: Waves of Era 1 enemies start automatically, spawn at all 4 map edges, walk their lanes to the castle, damage it, and vanish. The health bar drops; at 0 the Defeat Stats Screen shows time, kills, and money, with Play Again and Main Menu.
  Why now: Completes the second kernel piece (4-direction attack) and gives the game a real start-to-end loop, so every later slice is tested inside a game that can actually be lost.
  PRD ref: `prd.md > The Core Journey` (steps 6, 8, 11), `prd.md > Waves and Enemies`, `prd.md > Stats Screen`
  Spec ref: `spec.md > Components` (Wave Manager, Enemies, Combat Rules: `castleHit`, Scenes: GameScene, Game Data, Interface Screens: `stats.js`), `spec.md > Data Model`
  Build: `data/eras.js` (Era 1 enemies, castle health), `logic/waves.js` (`buildWave`), `logic/combat.js` (`castleHit`), `art/enemy.js` (shared template + Era 1 accessories), `world/Enemy.js`, wave timer/break/HUD era-wave label, Phaser health bar above the castle, castle shake, `game:over` → `ui/stats.js`. Tests in `tests/waves.test.js` and `tests/combat.test.js`.
  Verify (mechanical): `npm test` passes (wave grows with number, spawns cover all 4 directions); in a browser, enemies appear from N/S/E/W, health bar drops on contact, and leaving the castle undefended reaches the Defeat screen with three numbers; Play Again starts a fresh run.
  Learner check: Press PLAY and don't defend. Watch enemies come from all four edges, see the castle's health bar shrink, and confirm the DEFEAT screen shows time, kills, and money. Try PLAY AGAIN.
  Commit: `Add 4-direction waves, castle damage, and defeat screen`

- [x] **3. Buy traps, place them on the paths, and kill enemies for resources**
  Becomes usable: The full Era 1 loop. The Shop (middle-left) sells the 3 Era 1 traps into the Inventory; tapping a path cell opens the trap picker; placed traps damage enemies (×3 vs their countered type), lose uses, and disappear at 0. Killed enemies drop stone/wood/gold shown in the HUD.
  Why now: Turns survival into a game you can win waves in, and creates the resources the upgrade slice needs. This is the first point the learner can judge feel and balance.
  PRD ref: `prd.md > The Core Journey` (steps 4–7), `prd.md > Shop and Inventory`, `prd.md > Placing Traps`, `prd.md > Traps in Action`, `prd.md > States and Boundaries` (empty Inventory, occupied cell, not enough money)
  Spec ref: `spec.md > Components` (Economy Rules: `canAfford`, `buyTrap`, `placeTrap`, `addDrop`; Combat Rules; Traps; Procedural Art: `trap.js`; Interface Screens: `shop.js`, `picker.js`), `spec.md > Important Failure Modes` (interface misaligned with canvas)
  Build: Era 1 traps in `eras.js`, economy + combat functions with tests, `art/trap.js`, `world/Trap.js` with uses badge, cell tap → `cell:tapped`/`cell:info`, `ui/shop.js`, `ui/picker.js` positioned via the canvas bounding box, drop pop-ups, hit flash, kill counter.
  Verify (mechanical): `npm test` passes (buy deducts price, unaffordable rejected, countered damage ×3, uses decrement, drops add up); in a browser, buying lowers money and raises Inventory count, tapping a non-path cell does nothing, a 1-use trap vanishes after one hit, kills raise stone/wood/gold.
  Learner check: Click the castle for money, open SHOP and buy a few traps, tap a path cell and place one. Watch an enemy step on it, take damage, and drop resources. Try tapping grass (nothing should happen) and an empty Inventory (picker should point you to the Shop).
  Commit: `Add shop, inventory, trap placement, and combat`

- [ ] **4. Upgrade the castle and watch the whole world evolve through all 5 eras**
  Becomes usable: The "oh, that's cool" moment. The Upgrade button above the health bar (disabled with missing amounts listed) evolves the castle; castle art, scenery, Shop traps, and enemies switch to the next era; old traps are refunded plus the era bonus; health refills; next wave is Wave 1. Wave 20 repeats without upgrading; "MAX ERA" in Era 5; clearing Era 5 Wave 20 shows the Victory screen. Dev shortcuts (`?era=&wave=&money=&res=`) work.
  Why now: The last and most visible kernel piece; it depends on slices 1–3. Building the remaining 4 eras' art and data here keeps all era content in one coherent step.
  PRD ref: `prd.md > The Core Journey` (steps 9–11), `prd.md > Castle Upgrade and Eras`, `prd.md > Era Roster`, `prd.md > Stats Screen` (win)
  Spec ref: `spec.md > Components` (Economy Rules: `upgradeCost`, `canUpgrade`, `refundTraps`, `eraBonus`, `applyUpgrade`; Wave Manager; Procedural Art; Game Data; Interface Screens: `upgrade.js`), `spec.md > Look and Feel` (era palettes), `spec.md > Where It Runs and How Someone Tries It` (dev shortcuts)
  Build: Complete `eras.js` for eras 2–5, era palettes and per-era castle/scenery/enemy/trap art, upgrade economy with tests (refund never negative, bonus buys exactly 2 cheapest traps), `ui/upgrade.js` following `castle:moved` and resize, era redraw + evolve flash, Wave-20 repeat and win detection, dev-shortcut parsing in `main.js`.
  Verify (mechanical): `npm test` passes; in a browser via `?res=999&money=5000`, upgrading each era changes castle, scenery, Shop, and enemies with no old traps left and money increased by refund + bonus; `?era=1&wave=20` shows Wave 20 repeating; `?era=5&wave=20` with traps reaches the Victory screen.
  Learner check: Open `http://localhost:5173/?res=999&money=5000`, press PLAY, place a few traps, then press UPGRADE repeatedly. Each time the castle, trees/buildings, Shop traps, and enemies should change era. Then open `?era=5&wave=20&money=5000`, defend, and see VICTORY.
  Commit: `Add castle upgrades across all 5 eras with win condition`

- [ ] **5. Speed button, How to Play, and a smooth, balanced run**
  Becomes usable: The speed button cycles 1× → 2× → 4× (enemies, spawns, waves, pop-ups), How to Play explains the loop, and the balance lets a real run go from Era 1 to a win or loss without stalling. Holds up with many enemies at 4×.
  Why now: Needs the whole game in place to tune; delivers the learner's "game runs smoothly" goal and makes a full run demo-able.
  PRD ref: `prd.md > Speed Button`, `prd.md > Screens and Layout` (How to Play), `prd.md > Open Questions`
  Spec ref: `spec.md > Components` (Scenes: GameScene speed control, Interface Screens: `menu.js`, `hud.js`, Game Data: `balance.js`), `spec.md > Important Failure Modes` (slowdown, balance)
  Build: Speed control (frame-time multiplier + timer/tween time scales), HUD speed button, How to Play panel, enemies-alive cap, balance pass in `balance.js`/`eras.js`, responsive check of HUD/picker/Upgrade on a narrow window.
  Verify (mechanical): `npm test` passes; in a browser, 4× visibly speeds waves and returns to 1×; a long 4× run stays smooth with no console errors; a narrow window keeps the Upgrade button and picker aligned.
  Learner check: Play a run using the speed button, reading How to Play first. Say whether the pace, prices, and difficulty feel right and whether anything feels slow or confusing.
  Commit: `Add speed control, How to Play, and balance pass`

- [ ] **6. Anyone can play from the public link**
  Becomes usable: The game runs at https://kelvintrinhsg.github.io/Kingdoms-Dragons-Tower-Defense/ after a push to `main`; README explains how to play and run it.
  Why now: Needs the finished game; the deploy itself is low-risk but must be checked on the real URL before shipping.
  PRD ref: `prd.md > Non-Goals` (no install, no accounts), `scope.md > Who It's For`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Components` (Deployment), `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes` (blank page on Pages)
  Build: `.github/workflows/deploy.yml` (install → test → build → deploy, current action versions), `README.md`, confirm the git remote, and push to `main` with the learner's agreement.
  Verify (mechanical): `npm run build && npm run preview` serves the game under the base path; the Actions run succeeds; the live URL loads the Main Menu with no 404s.
  Learner check: Open the public link on your phone or another browser and play a minute.
  Commit: `Add GitHub Pages deploy workflow and README`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 3 (full Era 1 loop: click, buy, place, kill, lose), before the 5-era content is built
  Feedback: kills should also give money; difficulty should ramp from few/slow/low-health enemies to many/fast/tanky ones; tougher enemies should pay more. Done: per-enemy base money × wave toughness, Wave 1 = 3 slow weak enemies, count/health/speed grow every wave (Wave 20 ≈ 24 enemies, ×2.5 health, ×1.6 speed). Verified with unit tests and in the browser.
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

- Art is drawn with the Canvas 2D API into Phaser canvas textures (`textures.createCanvas`) at 2x resolution instead of `Graphics.generateTexture` — Phaser 4.2.1's `generateTexture` renders through the Canvas renderer and drops gradients, which the Kingdom Rush look needs. Helpers live in `src/art/palette.js`; a shared `src/world/map.js` places ground, scenery, and castle for both Menu and Game scenes, and `src/ui/layout.js` keeps the HTML overlay aligned with the scaled canvas.
- Killed enemies now drop money as well as stone/wood/gold, scaled by enemy type and wave toughness, and waves ramp in count, health, and speed — learner feedback at the early checkpoint; `prd.md` (Core Journey step 7, Waves and Enemies, Product Decisions) and `spec.md` (Core Journey, Economy Rules, Wave Manager, Game Data) updated to match. Slices 4–5 build on this: eras 2–5 enemies need a `money` value, and the slice 5 balance pass tunes these numbers.
- The How to Play panel was built in slice 1 alongside the Main Menu (it was planned for slice 5) — it is a few lines in `menu.js` and avoided shipping a dead button.

