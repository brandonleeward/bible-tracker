import React, { useState } from 'react';
import { useAppSettings } from '../hooks/useAppSettings';
import { useProgress } from '../hooks/useProgress';
import { useLongPress } from '../hooks/useLongPress';
import ChapterGrid from '../components/ChapterGrid';

function BookRow({ book, expandedBook, setExpandedBook, progressMap, toggleChapter, toggleBookComplete, isPastProgress }) {
  const isExpanded = expandedBook === book.id;
  const completedChapters = progressMap[book.id] ? Object.keys(progressMap[book.id]).length : 0;
  const percent = Math.round((completedChapters / book.chapterCount) * 100);

  const longPressProps = useLongPress(
    () => {
      // Trigger bulk complete
      toggleBookComplete(book.id, book.chapterCount, isPastProgress);
    },
    () => {
      // Trigger accordion toggle
      setExpandedBook(isExpanded ? null : book.id);
    },
    { delay: 400 }
  );

  return (
    <div key={book.id} style={{ 
      marginBottom: '12px',
      backgroundColor: 'var(--code-bg, #f4f3ec)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid var(--border, #eee)'
    }}>
      {/* Book Header (Click to expand, Long press to complete) */}
      <div 
        {...longPressProps}
        style={{ 
          padding: '16px', 
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          userSelect: 'none',
          WebkitUserSelect: 'none'
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
          toggleChapter={(bId, ch) => toggleChapter(bId, ch, isPastProgress)}
        />
      )}
    </div>
  );
}

export default function Books() {
  const { isLoading: settingsLoading, books } = useAppSettings();
  const { progressMap, toggleChapter, toggleBookComplete } = useProgress();
  const [expandedBook, setExpandedBook] = useState(null);
  const [isPastProgress, setIsPastProgress] = useState(false);

  if (settingsLoading || !progressMap) {
    return <div style={{ padding: '20px' }}>Loading books...</div>;
  }

  // Group books by testament
  const otBooks = books.filter(b => b.testament === 'OT');
  const ntBooks = books.filter(b => b.testament === 'NT');

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h1 style={{ marginBottom: '16px' }}>Books</h1>
      
      {/* Sync Past Progress Toggle */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: isPastProgress ? 'var(--accent-bg, rgba(170, 59, 255, 0.1))' : 'var(--code-bg, #f4f3ec)',
        borderRadius: '12px',
        border: isPastProgress ? '1px solid var(--accent, #aa3bff)' : '1px solid var(--border, #eee)',
        marginBottom: '24px',
        cursor: 'pointer'
      }} onClick={() => setIsPastProgress(!isPastProgress)}>
        <div>
          <div style={{ fontWeight: '600', color: isPastProgress ? 'var(--accent, #aa3bff)' : 'var(--text-h)' }}>
            Sync Past Progress
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text, #666)', marginTop: '4px' }}>
            {isPastProgress 
              ? "Checking chapters will NOT affect today's streak." 
              : "Checking chapters counts toward today's reading."}
          </div>
        </div>
        <div style={{
          width: '40px',
          height: '24px',
          backgroundColor: isPastProgress ? 'var(--accent, #aa3bff)' : 'var(--border, #ccc)',
          borderRadius: '12px',
          position: 'relative',
          transition: 'all 0.3s'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            top: '2px',
            left: isPastProgress ? '18px' : '2px',
            transition: 'all 0.3s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}/>
        </div>
      </div>

      <div style={{ fontSize: '0.85rem', color: 'var(--text, #666)', marginBottom: '16px', fontStyle: 'italic' }}>
        Tip: Long-press a book to complete all chapters instantly!
      </div>
      
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-h)' }}>Old Testament</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {otBooks.map(book => (
          <BookRow 
            key={book.id} 
            book={book}
            expandedBook={expandedBook}
            setExpandedBook={setExpandedBook}
            progressMap={progressMap}
            toggleChapter={toggleChapter}
            toggleBookComplete={toggleBookComplete}
            isPastProgress={isPastProgress}
          />
        ))}
      </div>

      <h2 style={{ fontSize: '1.2rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-h)' }}>New Testament</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ntBooks.map(book => (
          <BookRow 
            key={book.id} 
            book={book}
            expandedBook={expandedBook}
            setExpandedBook={setExpandedBook}
            progressMap={progressMap}
            toggleChapter={toggleChapter}
            toggleBookComplete={toggleBookComplete}
            isPastProgress={isPastProgress}
          />
        ))}
      </div>
    </div>
  );
}
