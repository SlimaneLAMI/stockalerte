export const ACCENT_PRESETS = [
  { name: 'Orange',    main: '#e05c2a', light: '#f47c50', dark: '#b84820' },
  { name: 'Bleu',      main: '#2563eb', light: '#60a5fa', dark: '#1d4ed8' },
  { name: 'Vert',      main: '#059669', light: '#34d399', dark: '#047857' },
  { name: 'Bordeaux',  main: '#be123c', light: '#fb7185', dark: '#9f1239' },
  { name: 'Violet',    main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
];

export const ACCENT_KEYS = ['color_orange', 'color_orange_light', 'color_orange_dark'];

export function buildAccentStyle(main, light, dark) {
  return `:root { --orange: ${main}; --orange-light: ${light}; --orange-dark: ${dark}; }`;
}

export function deriveShades(hex) {
  const n = (s, d) => Math.min(255, Math.max(0, parseInt(s, 16) + d)).toString(16).padStart(2, '0');
  const r = hex.slice(1, 3), g = hex.slice(3, 5), b = hex.slice(5, 7);
  return {
    main:  hex,
    light: `#${n(r, 50)}${n(g, 40)}${n(b, 40)}`,
    dark:  `#${n(r, -36)}${n(g, -28)}${n(b, -24)}`,
  };
}
