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
