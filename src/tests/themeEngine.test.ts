import { describe, it, expect } from 'vitest';
import { THEMES_LIST } from '../shared/constants/themes';
import { INITIAL_SETTINGS } from '../shared/constants/initialData';
import { AppTheme } from '../shared/types';

describe('Theme Engine & Palette Configuration', () => {
  it('should provide exactly 8 curated popular developer themes', () => {
    expect(THEMES_LIST).toHaveLength(8);
  });

  it('should include all standard requested developer themes', () => {
    const themeIds = THEMES_LIST.map((t) => t.id);
    const expectedThemes: AppTheme[] = [
      'sumi',
      'tokyo-night',
      'catppuccin',
      'nord',
      'dracula',
      'rose-pine',
      'github-dark',
      'one-dark',
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

      // Check preview swatches
      expect(theme.preview.canvas).toMatch(hexColorRegex);
      expect(theme.preview.surface).toMatch(hexColorRegex);
      expect(theme.preview.border).toMatch(hexColorRegex);
      expect(theme.preview.accent).toMatch(hexColorRegex);
      expect(theme.preview.text).toMatch(hexColorRegex);
    });
  });

  it('should default to Sumi & Slate authentic Japanese theme in INITIAL_SETTINGS', () => {
    expect(INITIAL_SETTINGS.theme).toBe('sumi');
  });
});
