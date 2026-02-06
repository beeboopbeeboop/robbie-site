export interface ThemeTokens {
  bg: string
  fg: string
  accent: string
  muted: string
  border: string
  card: string
  highlight: string
}

export const defaultTheme: ThemeTokens = {
  bg: '#f8f2ea',
  fg: '#221b16',
  accent: '#d46f4d',
  muted: '#6f645d',
  border: '#d7c8bc',
  card: '#fff9f3',
  highlight: '#f0ddc8',
}

export function themeToCssVariables(theme: ThemeTokens = defaultTheme): string {
  return `--bg:${theme.bg};--fg:${theme.fg};--accent:${theme.accent};--muted:${theme.muted};--border:${theme.border};--card:${theme.card};--highlight:${theme.highlight};`
}
