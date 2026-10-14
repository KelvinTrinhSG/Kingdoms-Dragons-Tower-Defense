---
doc: prd
status: approved
---

# Kingdoms & Dragons Tower Defense — Product Requirements

A browser tower defense + clicker game for anyone with a link: click the central castle for money, stock traps from a shop, place them on a grid along 4 enemy paths, and evolve the castle through 5 eras until you survive the final wave.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > What "Working" Looks Like`.

1. The player opens the link. The **Main Menu** shows the game logo over a themed background, a **Play** button, and a **How to Play** button.
2. The player clicks **Play**. The **Game Screen** opens in **Era 1 (Prehistoric Cave), Wave 1**. The castle sits in the center of a grid map; 4 paths, each 2 cells wide, lead to it from North, South, East, and West.
3. The player clicks the castle to earn **money**.
4. The player can open the **Shop** (button on the middle of the left edge) to buy traps of the current era ahead of time; they go into the **Inventory**.
5. The player taps a path cell. A picker shows the current era's 3 traps: owned ones with their Inventory counts, unowned ones with their price (dimmed if unaffordable). Tapping one places that trap on the cell, buying it on the spot if it isn't owned.
6. A **"GET READY!"** notice counts down the seconds until Wave 1, then waves start automatically. Enemies spawn at the map edges and walk the 4 paths toward the castle. Stepping on a trap damages the enemy and uses up one of the trap's uses.
7. Killed enemies drop **stone, wood, and gold** plus some **money**, which are added to the player's resources.
8. Enemies that reach the castle damage it and disappear.
9. When the player has enough resources, they press **Upgrade** (above the castle's health bar) at any time. The castle evolves to the next era, its health is restored, the map's buildings and trees change to the new era, the Shop offers the new era's traps, and the next wave is **Wave 1 of the new era**. All old-era traps (on the map and in the Inventory) disappear and are converted into money, and the player gets a bonus worth 2 of the new era's cheapest trap. Old-era enemies still on the map are cleared and count as kills (with their drops). The new era's name and a countdown show until its Wave 1 starts.
10. If the player finishes Wave 20 of an era without upgrading, the next waves keep repeating that era's Wave 20 until they upgrade.
11. **Win:** surviving Wave 20 of Era 5 (Modern Barracks). **Lose:** castle health reaches 0. Either way, the **Stats Screen** appears.

## Screens and Layout
Source: `scope.md > The POC Boundary`.

- **Main Menu:** logo, themed background, **Play** button, **How to Play** button. How to Play opens a short panel explaining the loop (click castle → buy traps → place traps → collect resources → upgrade castle) with a close button.
- **Game Screen:**
  - Top-left: current **era and wave** (e.g., "Stone Age · Wave 7/20") and the **speed button**.
  - Top-right: **money, stone, wood, gold**.
  - Middle of the left edge: **Shop** button. Opens the **Shop panel** (buy traps) and shows the **Inventory** (each trap type and its count).
  - Center: the **castle**, with its **health bar** above it and the **Upgrade** button above the health bar.
  - Map: a full grid; 4 paths, each 2 cells wide, from each edge to the castle. Era-specific buildings and trees off the paths.
  - **Trap picker:** appears when a path cell is tapped; lists the current era's 3 traps — Inventory count on owned ones, price on the rest, unaffordable ones dimmed.
- **Stats Screen:** a Win or Defeat title, plus **time to finish**, **enemies killed**, and **money remaining**.

## Look and Feel
Source: `scope.md > Inspiration & Identity`. Already decided in scope; not re-asked.

- **Game world (map, castle, enemies, traps, buildings, trees):** Kingdom Rush art style and palette; Age of War era theme. Each era has its own castle, buildings, and trees.
- **Interface (Main Menu, HUD, Shop, Inventory, trap picker, Stats Screen):** Market Royale style. Fredoka font, bold uppercase headings, pill buttons (32px radius), cards rounded 28–34px, soft shadows, frosted-glass panels. Navy text `#141F3D`, blue `#00A5FF → #1259E0`, purple `#9A48F8 → #5636D5`, orange `#FF6B0A → #FF9E16`, primary green `#35EC00` with `#144509` text, yellow highlight `#FFF04D`, danger red `#C7141F`. Numbers use tabular figures.
- **Stats Screen:** modeled on Market Royale's results screen: large numbers in a grid of stat tiles.

## Features and Behavior

### Clicking the Castle
- Each click on the castle adds money and shows a small "+money" pop-up.
  - [ ] Clicking the castle visibly increases the money counter in the top-right.

### Shop and Inventory
- The Shop lists the **3 traps of the current era**, each with price and number of uses. Traps range from cheap to expensive; the more expensive a trap, the more uses it has. The cheapest has 1 use.
- Buying a trap deducts money and adds one to that trap's count in the Inventory.
- Traps cannot be sold back.
  - [ ] Buying a trap lowers money by its price and raises its Inventory count by 1.
  - [ ] A trap the player can't afford cannot be bought (its buy button is disabled).
  - [ ] There is no sell option.

### Placing Traps
- The whole map is a grid; each path is 2 cells wide. Tapping a path cell opens the trap picker with all **3 traps of the current era**. A trap in the Inventory shows its count; tapping it places it and reduces its count by 1. A trap not in the Inventory shows its price; tapping it buys and places it in one step. Traps the player can't afford are dimmed and can't be tapped.
  - [ ] Tapping a path cell and choosing an owned trap places it there and lowers its Inventory count.
  - [ ] Choosing an unowned, affordable trap places it there and lowers money by its price.
  - [ ] Unaffordable traps in the picker are dimmed and do nothing when tapped.
  - [ ] Tapping a cell that is not on a path does nothing.

### Traps in Action
- When an enemy steps on a trap, the trap damages it and loses 1 use. A trap at 0 uses disappears.
- Each trap **counters one enemy type**: it damages every enemy but deals extra damage to the type it counters.
  - [ ] An enemy stepping on a trap loses health, and the trap's remaining uses go down by 1.
  - [ ] A trap deals visibly more damage to its countered enemy type than to the others.
  - [ ] A 1-use trap disappears after one enemy steps on it.

### Waves and Enemies
- Waves start automatically one after another. Enemies come from all 4 directions.
- Before Wave 1, a **"GET READY!"** notice at the top of the map counts down the seconds left (6 s) so the player can earn money and place traps first.
- Each era has **3 enemy types**. Each era has **20 waves**, getting harder as they go: early waves have few, slow, low-health enemies; each later wave brings more enemies that move faster and have more health.
- Killed enemies drop stone, wood, and gold, plus money. Tougher enemies give more money: heavier types more than lighter ones, and later waves more than earlier ones.
- An enemy reaching the castle damages it and disappears.
  - [ ] Enemies appear from all 4 map edges and walk the paths to the castle.
  - [ ] Killing an enemy increases stone/wood/gold and money.
  - [ ] A heavy enemy or a later-wave enemy gives more money than a light, early one.
  - [ ] Wave 1 has fewer, slower, weaker enemies than later waves.
  - [ ] After pressing Play, a countdown shows the seconds until Wave 1, and no enemy appears before it ends.
  - [ ] An enemy reaching the castle lowers the castle's health bar and vanishes.

### Speed Button
- A speed button speeds up the game so a full run can be shown in a short demo.
  - [ ] Pressing the speed button makes enemies, spawns, and waves visibly run faster; pressing again changes the speed back.

### Pause
- A pause button on the HUD (also **P** or **Esc**) freezes the game and shows a "Paused" panel with **Resume** and **Main Menu**. Time spent paused doesn't count toward the run time.
  - [ ] While paused, enemies, wave timers, countdowns, and music stop, and the castle, path cells, and Upgrade don't respond; Resume continues exactly where it stopped.

### Sound
- Sound effects for castle clicks, placing and triggering traps, kills, castle hits, countdown ticks, wave starts, upgrades, win/lose, and UI buttons, plus a looping background tune during a run. A speaker button on the HUD mutes everything. Sound starts after the player's first tap (a browser rule).
  - [ ] Each of those actions makes a sound, music plays during a run and stops on pause/game over, and the mute button silences everything.

### Castle Upgrade and Eras
- The Upgrade button above the health bar is usable whenever the player has enough stone, wood, and gold, even mid-era.
- Upgrading: spends the resources, moves the castle to the next era (new castle art), **restores castle health**, swaps the map's buildings and trees to the new era, switches the Shop to the new era's traps, and makes the next wave **Wave 1 of the new era** with the new era's enemies.
- **Old traps are cashed out:** every old-era trap, both placed on the map and still in the Inventory, disappears and is converted into money for the player (Assumption: refund = trap price × remaining uses ÷ total uses).
- **Era bonus:** on each upgrade the player also receives money equal to the price of **2 of the new era's cheapest trap**.
- **Old enemies are cleared:** old-era enemies still on the map vanish as kills — the player gets their money and stone/wood/gold, and the kill count goes up.
- **Breather:** the new era's name (e.g., "WOODEN FORT!") and "Enemies arrive in Ns" count down a 7 s break before Wave 1 of the new era.
- Era 5 is the last; there is no upgrade beyond it.
- Eras: **1 Prehistoric Cave → 2 Wooden Fort (feudal) → 3 Stone Castle → 4 Pre-modern Barracks → 5 Modern Barracks.**
  - [ ] With enough resources, pressing Upgrade changes the castle, map scenery, Shop traps, and enemy types to the next era, and refills castle health.
  - [ ] Without enough resources, the Upgrade button is disabled and shows what is still needed.
  - [ ] After finishing Wave 20 without upgrading, the next wave repeats Wave 20 of the same era.
  - [ ] After an upgrade, no old-era traps remain on the map or in the Inventory, and money increases by their refund plus the era bonus.
  - [ ] The era bonus alone is enough to buy 2 of the new era's cheapest trap.
  - [ ] After an upgrade, no old-era enemies remain on the map, their drops are added, and the new era's name counts down to its Wave 1.

### Era Roster
Pattern in every era: a fast/light enemy, a standard enemy, a heavy enemy; the cheap trap counters the fast enemy, the mid trap the standard enemy, the expensive trap the heavy enemy.

| Era | Enemies (fast · standard · heavy) | Traps (cheap · mid · expensive) |
|---|---|---|
| 1 Prehistoric Cave | Cave runner · Club brute · Mammoth rider | Sharpened stakes · Rolling boulder · Fire pit |
| 2 Wooden Fort | Peasant raider · Spearman · Mounted knight | Caltrops · Bear trap · Burning oil |
| 3 Stone Castle | Scout · Swordsman · Battering ram | Iron spikes · Pendulum blade · Boulder drop |
| 4 Pre-modern Barracks | Skirmisher · Musketeer · Cannon cart | Tripwire · Powder keg · Buried cannon charge |
| 5 Modern Barracks | Motorbike raider · Rifleman · Tank | Barbed wire · Landmine · Anti-tank mine |

### Stats Screen
- Shown on win or loss. Displays **time to finish**, **enemies killed**, and **money remaining**.
  - [ ] Losing (castle health 0) shows the Defeat stats screen with the three numbers.
  - [ ] Surviving Wave 20 of Era 5 shows the Win stats screen with the three numbers.

## States and Boundaries
- **First play:** Era 1, Wave 1, empty Inventory, starting money (Assumption: enough for a couple of cheap traps), full castle health.
- **Empty Inventory and not enough money:** tapping a path cell shows the 3 traps dimmed plus a message telling the player to tap the castle to earn money.
- **Occupied cell:** one trap per cell; tapping an occupied cell shows that trap's remaining uses instead of the picker (Assumption).
- **Not enough money / resources:** Shop buy buttons and the Upgrade button are disabled, with the missing amount shown.
- **Final era:** in Era 5 the Upgrade button is hidden or shows "Max era".
- **Game over:** castle health 0 → Defeat stats screen.
- **Win:** Wave 20 of Era 5 survived → Win stats screen.
- **Persistence:** nothing is saved between sessions; closing the tab ends the run (no accounts).

## Product Decisions
- Shop buys traps into an Inventory; traps are placed by tapping a path cell. The picker uses an owned trap first, otherwise buys and places in one tap — so the player never has to detour through the Shop (learner request after the final review; replaces the earlier "Inventory empty — open the Shop" message).
- Traps cannot be sold — once bought, they can only be placed.
- Traps have limited uses; more expensive means more uses; the cheapest has 1 use.
- Counter traps damage every enemy but deal extra damage to their countered type.
- Each era has 20 waves; without upgrading, Wave 20 repeats — pushes the player to upgrade.
- Killed enemies also drop money, more for tougher enemies; difficulty ramps from few/slow/weak to many/fast/tanky (learner feedback at the first hands-on checkpoint).
- Upgrade can happen any time resources allow, even mid-era; the next wave becomes Wave 1 of the new era.
- Upgrading restores castle health.
- On upgrade, old-era traps (placed and in Inventory) disappear and are converted into money — the map is cleared for the new era without wasting the player's spending.
- On upgrade, the player gets a bonus equal to 2 of the new era's cheapest trap — so they can defend the first new-era waves right away.
- Era Roster: the proposed enemy and trap names were accepted ("PRD ổn").
- Enemies reaching the castle damage it and disappear.
- Waves start automatically; a speed button exists so a full run fits a demo.
- On-screen countdowns before Wave 1 of a run and of each new era, and a longer 7 s break after an upgrade, so the player always knows how long they have to prepare (learner request after the final review).
- On upgrade, old-era enemies are cleared as kills with rewards — the new era starts on a clean map and the player isn't punished for upgrading mid-wave (learner choice).
- Stats screen: time to finish, enemies killed, money remaining.
- HUD layout: wave top-left, resources top-right, Shop button middle-left, health bar above the castle, Upgrade button above the health bar.

## What We're Building
- Main Menu (logo, background, Play, How to Play).
- Game Screen with the HUD above, grid map with 4 two-cell-wide paths, central castle.
- Clicking the castle for money.
- Shop + Inventory; trap picker on path cells that also buys on the spot.
- Traps with limited uses and counter bonuses.
- 5 eras × 3 enemies × 3 traps; 20 waves per era with Wave-20 repeat; resource drops; castle damage.
- Castle Upgrade with health restore and full era swap (castle, scenery, Shop, enemies).
- Speed button, pause button, sound effects + music with a mute button.
- Win/Defeat Stats Screen.

## Deferred From the POC
- **Upgrading individual traps within an era** — in the POC, traps only change when the castle changes era.
- **Detailed hand-drawn Kingdom Rush–quality art** — the POC uses simpler art in the same style and palette.
- **Saving progress** — no accounts and nothing persisted; a run lasts one session.

## Possible Later Enhancements
- Multiple maps and difficulty levels.
- Sound effects and music.
- Pause menu and settings.

## Non-Goals
- **Accounts or login** — players must start playing instantly.
- **Installing anything** — the game runs in the browser from a link.
- **Selling traps** — the player chose to make purchases final.
- **Copying Kingdom Rush / Age of War gameplay** — they are style and theme references only.

## Open Questions
1. **Wave length and speed levels** — Assumption: a wave lasts about 20–30 seconds at normal speed, and the speed button cycles 1× → 2× → 4×. *(Can be tuned during build.)*
2. **Balance numbers** — money per click, trap prices, uses (Assumption: 1 / 3 / 5), damage, enemy health, castle health, drops, upgrade costs, and the refund formula for old traps (Assumption: price × remaining uses ÷ total uses). *(Tuned during build.)*
