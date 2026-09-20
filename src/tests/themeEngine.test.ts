import { describe, it, expect } from 'vitest';
import { THEMES_LIST } from '../shared/constants/themes';
import { INITIAL_SETTINGS } from '../shared/constants/initialData';
import { AppTheme } from '../shared/types';

describe('Theme Engine & Palette Configuration', () => {
  it('should provide exactly 8 curated popular developer themes', () => {
    expect(THEMES_LIST).toHaveLength(8);
  });

  it('should include 5 high-contrast dark themes and 3 clean light themes', () => {
    const darkThemes = THEMES_LIST.filter((t) => t.mode === 'dark');
    const lightThemes = THEMES_LIST.filter((t) => t.mode === 'light');

    expect(darkThemes).toHaveLength(5);
    expect(lightThemes).toHaveLength(3);

    const themeIds = THEMES_LIST.map((t) => t.id);
    const expectedThemes: AppTheme[] = [
      'sumi',
      'tokyo-night',
      'cyberpunk',
      'dracula',
      'catppuccin',
      'sakura',
      'nord-light',
      'matcha',
    ];

    expectedThemes.forEach((theme) => {
      expect(themeIds).toContain(theme);
    });
  });

  it('should have complete metadata and preview color swatches for each theme', () => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    THEMES_LIST.forEach((theme) => {
      expect(theme.id).toBeTruthy();
      expect(theme.name).toBeTruthy();
      expect(theme.jpName).toBeTruthy();
      expect(theme.description).toBeTruthy();
      expect(theme.category).toBeTruthy();
      expect(['dark', 'light']).toContain(theme.mode);

      // Check preview swatches
      expect(theme.preview.canvas).toMatch(hexColorRegex);
      expect(theme.preview.surface).toMatch(hexColorRegex);
      expect(theme.preview.border).toMatch(hexColorRegex);
      expect(theme.preview.accent).toMatch(hexColorRegex);
      expect(theme.preview.text).toMatch(hexColorRegex);
    });
  });

  it('should guarantee distinct canvas lightness between dark and light themes', () => {
    const lightThemes = THEMES_LIST.filter((t) => t.mode === 'light');
    const darkThemes = THEMES_LIST.filter((t) => t.mode === 'dark');

    // Light themes should have high RGB canvas values (e.g. starting with #f or #e)
    lightThemes.forEach((t) => {
      const firstHex = t.preview.canvas.slice(1, 3);
      const r = parseInt(firstHex, 16);
      expect(r).toBeGreaterThan(200); // Clearly a light canvas
    });

    // Dark themes should have low RGB canvas values
    darkThemes.forEach((t) => {
      const firstHex = t.preview.canvas.slice(1, 3);
      const r = parseInt(firstHex, 16);
      expect(r).toBeLessThan(50); // Clearly a dark canvas
    });
  });

  it('should default to Sumi & Slate authentic Japanese theme in INITIAL_SETTINGS', () => {
    expect(INITIAL_SETTINGS.theme).toBe('sumi');
  });
});
