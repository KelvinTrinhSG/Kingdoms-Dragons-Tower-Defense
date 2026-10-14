# Kingdoms & Dragons Tower Defense

A browser tower defense + clicker game. Click the castle in the middle of the map to earn money, buy traps, place them on the 4 paths, and evolve your castle through 5 eras — from a prehistoric cave to a modern barracks — while enemies attack from North, South, East, and West.

**Play it:** https://kelvintrinhsg.github.io/Kingdoms-Dragons-Tower-Defense/

Nothing to install, no account.

## How to play

1. **Click the castle** to earn money.
2. **Tap a path cell** to place a trap. The picker shows the era's 3 traps: ones in your Inventory are placed for free, the rest are bought on the spot (dimmed when you can't afford them). Each trap deals triple damage to the enemy type it counters and has limited uses.
3. You can also stock up in the **Shop** (left edge) to fill your Inventory ahead of time.
4. Killed enemies drop **money, stone, wood, and gold**. Tougher enemies pay more.
5. Press **Upgrade** (above the castle) to evolve into the next era: the castle, scenery, traps, and enemies all change. Old traps are refunded, old enemies are cleared (you keep their drops), you get a bonus, and a countdown gives you 7 seconds to prepare.
6. Survive **Wave 20 of the Modern era** to win. If you don't upgrade after Wave 20, it repeats.

Use the **speed button** (top left) to play at 1×, 2×, or 4×. **Pause** with the ⏸ button, **P**, or **Esc**, and mute the sound with the speaker button.

## Eras

| Era | Enemies | Traps |
|---|---|---|
| Prehistoric Cave | Cave runner · Club brute · Mammoth rider | Sharpened stakes · Rolling boulder · Fire pit |
| Wooden Fort | Peasant raider · Spearman · Mounted knight | Caltrops · Bear trap · Burning oil |
| Stone Castle | Scout · Swordsman · Battering ram | Iron spikes · Pendulum blade · Boulder drop |
| Pre-modern Barracks | Skirmisher · Musketeer · Cannon cart | Tripwire · Powder keg · Buried cannon charge |
| Modern Barracks | Motorbike raider · Rifleman · Tank | Barbed wire · Landmine · Anti-tank mine |

## Run it locally

Requires Node.js 20.19+ (built with Node 24).

```
npm install
npm run dev        # http://localhost:5173
npm test           # game rule tests (Vitest)
npm run build      # static files in dist/
npm run preview    # serve the production build
```

Testing shortcuts (URL parameters): `?era=3&wave=18&money=5000&res=999` starts a run at that era and wave with that money and stone/wood/gold.

## How it's built

- **Phaser 4** draws the world: map, castle, enemies, traps. All art is drawn with code (Canvas 2D) at startup — there are no image files.
- Sound effects and the background music loop are synthesized with the **Web Audio API** (`src/audio/sound.js`) — there are no audio files either.
- **HTML/CSS** draws the interface (menu, HUD, shop, upgrade button, results screen) on top of the canvas.
- The two layers talk through a small event bus (`src/bus.js`).
- Game rules live in `src/logic/` as plain functions with unit tests in `tests/`; all numbers live in `src/data/`.
- **Vite** builds the site; **GitHub Actions** tests, builds, and deploys it to **GitHub Pages** on every push to `main`.

Style references: Kingdom Rush (art style) and Age of War (era theme). Gameplay is original.
