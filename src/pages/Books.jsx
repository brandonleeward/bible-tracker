import React, { useState } from 'react';
import { useAppSettings } from '../hooks/useAppSettings';
import { useProgress } from '../hooks/useProgress';
import ChapterGrid from '../components/ChapterGrid';

export default function Books() {
  const { isLoading: settingsLoading, books } = useAppSettings();
  const { progressMap, toggleChapter } = useProgress();
  const [expandedBook, setExpandedBook] = useState(null);

  if (settingsLoading || !progressMap) {
    return <div style={{ padding: '20px' }}>Loading books...</div>;
  }

  // Group books by testament
  const otBooks = books.filter(b => b.testament === 'OT');
  const ntBooks = books.filter(b => b.testament === 'NT');

  const renderBookRow = (book) => {
    const isExpanded = expandedBook === book.id;
    const completedChapters = progressMap[book.id] ? Object.keys(progressMap[book.id]).length : 0;
    const percent = Math.round((completedChapters / book.chapterCount) * 100);

    return (
      <div key={book.id} style={{ 
        marginBottom: '12px',
        backgroundColor: 'var(--code-bg, #f4f3ec)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border, #eee)'
      }}>
        {/* Book Header (Click to expand) */}
        <div 
          onClick={() => setExpandedBook(isExpanded ? null : book.id)}
          style={{ 
            padding: '16px', 
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-h)' }}>
              {book.name}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text, #666)' }}>
              {completedChapters} / {book.chapterCount}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div style={{ 
            width: '100%', 
            height: '6px', 
            backgroundColor: 'var(--border, #ddd)', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${percent}%`, 
              height: '100%', 
              backgroundColor: percent === 100 ? '#10b981' : 'var(--accent, #aa3bff)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Expandable Chapter Grid */}
        {isExpanded && (
          <ChapterGrid 
            bookId={book.id}
            chapterCount={book.chapterCount}
            progressMap={progressMap}
            toggleChapter={toggleChapter}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h1 style={{ marginBottom: '24px' }}>Books</h1>
      
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-h)' }}>Old Testament</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {otBooks.map(renderBookRow)}
      </div>

      <h2 style={{ fontSize: '1.2rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-h)' }}>New Testament</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ntBooks.map(renderBookRow)}
      </div>
    </div>
  );
}
