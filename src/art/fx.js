// Small feedback effects: floating text pop-ups.

export const FONT = 'Fredoka, Inter, ui-rounded, system-ui, sans-serif';

export function popText(scene, x, y, text, color = '#FFF04D', size = 22) {
  const t = scene.add
    .text(x, y, text, {
      fontFamily: FONT,
      fontSize: `${size}px`,
      fontStyle: '700',
      color,
      stroke: '#2b1d12',
      strokeThickness: 5,
    })
    .setOrigin(0.5)
    .setDepth(10000);
  scene.tweens.add({
    targets: t,
    y: y - 46,
    alpha: { from: 1, to: 0 },
    scale: { from: 0.7, to: 1.1 },
    duration: 800,
    ease: 'Cubic.easeOut',
    onComplete: () => t.destroy(),
  });
  return t;
}

// Big center-screen announcement, e.g. "WAVE 3".
export function banner(scene, text, color = '#FFFFFF') {
  const t = scene.add
    .text(640, 150, text, {
      fontFamily: FONT,
      fontSize: '56px',
      fontStyle: '700',
      color,
      stroke: '#141F3D',
      strokeThickness: 10,
    })
    .setOrigin(0.5)
    .setDepth(10001)
    .setScale(0.6)
    .setAlpha(0);
  scene.tweens.chain({
    targets: t,
    tweens: [
      { scale: 1, alpha: 1, duration: 260, ease: 'Back.easeOut' },
      { alpha: 0, y: 120, duration: 400, delay: 900, ease: 'Cubic.easeIn' },
    ],
    onComplete: () => t.destroy(),
  });
}
