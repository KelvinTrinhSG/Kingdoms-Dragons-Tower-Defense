---
doc: scope
status: approved
---

# Kingdoms & Dragons Tower Defense

A browser-based tower defense + clicker game: click the castle in the center of the map to earn money, place traps to stop enemies coming from 4 directions, and evolve the castle through 5 eras.

## The Unique Kernel
Three things together. Lose any one and it stops being this game:
- **Click the castle to earn money.** The player has to keep clicking for income while also managing the defense.
- **The castle and the enemies evolve through the eras together.** When the castle reaches a new era, the traps, enemies, buildings, and trees on the map all change to match it.
- **Attacks come from 4 directions at once** (North, South, East, West), with the castle in the middle.

## Who It's For
Anyone. Open a link in a browser and play right away, with nothing to install and no account to make.

## The Core Loop
Click the castle to earn **money** → buy **traps** and place them on enemy paths → killed enemies drop **stone, wood, and gold** → spend those resources to **upgrade the castle** → the castle enters a new era, the traps get stronger, and the next waves bring that era's enemies → repeat until the final wave.

Each era has **3 enemy types** and **3 trap types**. Each trap counters one enemy type, and traps range from cheap to expensive.

## Inspiration & Identity
The look combines two sources:
- **Game world (map, castle, enemies, traps, buildings, trees) follows Kingdom Rush / Age of War.** Kingdom Rush supplies the art style and color palette; Age of War supplies the era theme. These are style references only; the gameplay is not copied. https://armorgames.com/play/616/age-of-war · https://ageofwargame.io/ · https://aowg.fandom.com/wiki/Age_of_War
- **Interface (menu, HUD, buttons, stats screen) follows Market Royale** (`D:\AI\Dorahack Winners\Market Royale`: `brand.md`, `app/globals.css`, `app/testnet.css`):
  - Font: **Fredoka** (400–700), falling back to `Inter, ui-rounded, system-ui`. Headings are bold and uppercase. Numbers use `tabular-nums`.
  - Colors: navy text `#141F3D`, secondary text `#406394`, white cards, inset panels `#EAF9FF`. Blue gradient `#00A5FF → #1259E0`, purple `#9A48F8 → #5636D5`, orange `#FF6B0A → #FF9E16`. Primary button neon green `#35EC00` with dark text `#144509`. Highlight yellow `#FFF04D`. Danger/defeat red `#C7141F`.
  - Shapes: cards rounded 28–34px, pill buttons rounded 32px, soft shadows. Buttons have a light inner highlight along the top edge and lift slightly on hover. Frosted-glass panels sit on gradient backgrounds.
  - Results screen: large numbers and a grid of stat tiles. Use it as the model for the win/lose stats screen.
- Every era has its own buildings and trees that fit the period.
- 5 eras: **prehistoric cave → wooden fort (feudal) → stone castle → pre-modern barracks → modern barracks**.

## Why This Matters to the Learner
Learn how to make games with Phaser, learn how to work with an agent, and get the game running smoothly.

## What "Working" Looks Like
The player sees the **main menu** → clicks **Play** → plays until **game over** (the castle is destroyed) or **wins** by surviving the final wave → a **stats screen** appears after a win or a loss.

The "oh, that's cool" moment: the castle evolves into a new era, and the map, traps, and enemies all change with it.

## The POC Boundary
- Main menu, the main game screen, and a stats screen for both win and loss.
- One map with the castle in the center and 4 attack paths.
- Click the castle to earn money. Buy traps and place them on the paths.
- All 5 eras. Each era has 3 enemy types and 3 counter traps, priced from cheap to expensive.
- Enemies drop stone, wood, and gold. Spend them to upgrade the castle to the next era.
- Waves, enemies, and map visuals change with the era.
- Playable from a link in a browser, with nothing to install and no account.

## Later
- Detailed hand-drawn art fully in the Kingdom Rush style. The POC uses simpler art in the same style and palette; the spec chooses the art source.
- Upgrading individual traps within an era. In the POC, traps only upgrade with the castle's era.
- Multiple maps and difficulty levels.

## Explicitly Cut
- **Accounts and login:** players must be able to start playing immediately.
- **Requiring an install:** the game runs in the browser.
