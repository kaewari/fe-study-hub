import { describe, it, expect } from 'vitest';
import { INITIAL_STUDY_NOTES } from '../shared/constants/initialData';
import { StudyNoteItem } from '../shared/types';

describe('Study Notes Domain & Filtering Engine', () => {
  it('should initialize high-value notes covering core FE syllabus domains', () => {
    expect(INITIAL_STUDY_NOTES.length).toBeGreaterThanOrEqual(4);

    const categories = INITIAL_STUDY_NOTES.map((n) => n.category);
    expect(categories).toContain('algorithm');
    expect(categories).toContain('security');
    expect(categories).toContain('technology');
    expect(categories).toContain('management');
    expect(categories).toContain('strategy');
  });

  it('should prioritize pinned notes over unpinned notes in sort order', () => {
    const mockNotes: StudyNoteItem[] = [
      {
        id: '1',
        title: 'Note 1 - Older but Pinned',
        category: 'technology',
        content: 'content 1',
        tags: ['tag1'],
        pinned: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: '2',
        title: 'Note 2 - Newer unpinned',
        category: 'security',
        content: 'content 2',
        tags: ['tag2'],
        pinned: false,
        createdAt: '2026-09-20T00:00:00.000Z',
        updatedAt: '2026-09-20T00:00:00.000Z',
      },
      {
        id: '3',
        title: 'Note 3 - Even newer unpinned',
        category: 'algorithm',
        content: 'content 3',
        tags: ['tag3'],
        pinned: false,
        createdAt: '2026-09-21T00:00:00.000Z',
        updatedAt: '2026-09-21T00:00:00.000Z',
      },
    ];

    const sorted = [...mockNotes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });

    expect(sorted[0].id).toBe('1');
    expect(sorted[0].pinned).toBe(true);
    expect(sorted[1].id).toBe('3');
    expect(sorted[2].id).toBe('2');
  });

  it('should filter notes accurately by search query across title, content, and tags', () => {
    const notes = INITIAL_STUDY_NOTES;

    // Search by Japanese tag
    const pseudocodeNotes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes('擬似言語') ||
        n.content.toLowerCase().includes('擬似言語') ||
        n.tags.some((t) => t.toLowerCase().includes('擬似言語'))
    );
    expect(pseudocodeNotes.length).toBeGreaterThan(0);
    expect(pseudocodeNotes[0].category).toBe('algorithm');

    // Search by English abbreviation
    const rsaNotes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes('rsa') ||
        n.content.toLowerCase().includes('rsa') ||
        n.tags.some((t) => t.toLowerCase().includes('rsa'))
    );
    expect(rsaNotes.length).toBeGreaterThan(0);
    expect(rsaNotes[0].category).toBe('security');
  });
});
