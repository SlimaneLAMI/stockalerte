export const COLOR_DEFAULTS = {
  color_orange:       '#e05c2a',
  color_orange_light: '#f47c50',
  color_orange_dark:  '#b84820',
  color_background:   '#fafaf8',
  color_foreground:   '#1a1a1a',
  color_card:         '#ffffff',
  color_muted:        '#f4f4f2',
  color_muted_fg:     '#737373',
  color_border:       '#e5e5e3',
  color_dark_bg:      '#1a1a1a',
  color_dark_card:    '#242424',
  color_dark_muted:   '#2d2d2d',
};

export const COLOR_KEYS = Object.keys(COLOR_DEFAULTS);

export function buildColorStyle(colors) {
  const g = (key) => colors[key] || COLOR_DEFAULTS[key];
  return `
:root {
  --orange: ${g('color_orange')};
  --orange-light: ${g('color_orange_light')};
  --orange-dark: ${g('color_orange_dark')};
  --background: ${g('color_background')};
  --foreground: ${g('color_foreground')};
  --card: ${g('color_card')};
  --card-foreground: ${g('color_foreground')};
  --popover: ${g('color_card')};
  --popover-foreground: ${g('color_foreground')};
  --primary: ${g('color_foreground')};
  --secondary: ${g('color_muted')};
  --secondary-foreground: ${g('color_foreground')};
  --muted: ${g('color_muted')};
  --muted-foreground: ${g('color_muted_fg')};
  --accent: ${g('color_muted')};
  --accent-foreground: ${g('color_foreground')};
  --border: ${g('color_border')};
  --input: ${g('color_border')};
  --ring: ${g('color_foreground')};
  --sidebar: ${g('color_background')};
  --sidebar-foreground: ${g('color_foreground')};
  --sidebar-primary: ${g('color_foreground')};
  --sidebar-accent: ${g('color_muted')};
  --sidebar-border: ${g('color_border')};
}
.dark {
  --orange: ${g('color_orange')};
  --orange-light: ${g('color_orange_light')};
  --orange-dark: ${g('color_orange_dark')};
  --background: ${g('color_dark_bg')};
  --card: ${g('color_dark_card')};
  --card-foreground: #fafaf8;
  --popover: ${g('color_dark_card')};
  --popover-foreground: #fafaf8;
  --muted: ${g('color_dark_muted')};
  --secondary: ${g('color_dark_muted')};
  --accent: ${g('color_dark_muted')};
  --sidebar: ${g('color_dark_bg')};
  --sidebar-accent: ${g('color_dark_muted')};
}`.trim();
}
