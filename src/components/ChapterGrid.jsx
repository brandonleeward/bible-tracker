import React from 'react';

export default function ChapterGrid({ bookId, chapterCount, progressMap, toggleChapter }) {
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
      gap: '8px',
      padding: '16px',
      backgroundColor: 'var(--bg, #fff)',
      borderTop: '1px solid var(--border, #eee)'
    }}>
      {chapters.map(chapter => {
        const isCompleted = progressMap[bookId] && progressMap[bookId][chapter];
        return (
          <button
            key={chapter}
            onClick={() => toggleChapter(bookId, chapter)}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: '500',
              borderRadius: '8px',
              border: isCompleted ? 'none' : '1px solid var(--border, #ccc)',
              backgroundColor: isCompleted ? 'var(--accent, #aa3bff)' : 'transparent',
              color: isCompleted ? '#fff' : 'var(--text-h, #333)',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out'
            }}
          >
            {chapter}
          </button>
        );
      })}
    </div>
  );
}
