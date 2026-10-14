import { bus } from '../bus.js';

// Trap pictures come from the same code-drawn textures the map uses (filled in by BootScene).
export const trapIcons = {};
bus.on('art:ready', ({ trapIcons: urls }) => Object.assign(trapIcons, urls));

// Small inline SVG icons for the HUD (no emoji, so they look the same everywhere).
const O = '#2b1d12';

export const ICONS = {
  money: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#FFC21A" stroke="${O}" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#E08A00" stroke-width="1.8"/><path d="M8 8.5a5 5 0 0 1 5-2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/></svg>`,
  stone: `<svg viewBox="0 0 24 24"><path d="M4 16 6 8l6-4 7 3 2 8-5 5H8z" fill="#9AA0A6" stroke="${O}" stroke-width="2" stroke-linejoin="round"/><path d="M8 9l4-2.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></svg>`,
  wood: `<svg viewBox="0 0 24 24"><rect x="3" y="7" width="15" height="10" rx="3" fill="#A86A32" stroke="${O}" stroke-width="2"/><ellipse cx="18" cy="12" rx="3.2" ry="5" fill="#E2B57A" stroke="${O}" stroke-width="2"/><ellipse cx="18" cy="12" rx="1.2" ry="2" fill="none" stroke="#A86A32" stroke-width="1.2"/></svg>`,
  pause: `<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4.2" height="14" rx="1.5" fill="currentColor"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.5" fill="currentColor"/></svg>`,
  soundOn: `<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  soundOff: `<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  gold: `<svg viewBox="0 0 24 24"><path d="M3 18 6 9h12l3 9z" fill="#FFD23A" stroke="${O}" stroke-width="2" stroke-linejoin="round"/><path d="M8 11h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></svg>`,
};
