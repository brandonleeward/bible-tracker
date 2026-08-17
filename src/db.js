import Dexie from 'dexie';

export const db = new Dexie('BibleTrackerDB');

db.version(1).stores({
  // Keyed by setting key (e.g., 'active_canon', 'goal_chapters_per_day')
  settings: 'key, value',
  
  // Primary key: compound array `[bookId+chapter]`
  // Allows progress for shared books (e.g., Genesis) to persist globally across canons
  progress: '[bookId+chapter], bookId, chapter, completedAt',
  
  // Primary key: date string 'YYYY-MM-DD'
  // Tracks daily read count for streaks and pace calculations
  dailyLog: 'date, chaptersRead'
});
