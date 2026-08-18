import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getTodayDateString } from '../utils/date';

export function useProgress() {
  const progressRaw = useLiveQuery(() => db.progress.toArray(), []);
  
  // Creates a fast lookup map: map[bookId][chapter] = true
  const progressMap = (progressRaw || []).reduce((acc, row) => {
    if (!acc[row.bookId]) acc[row.bookId] = {};
    acc[row.bookId][row.chapter] = true;
    return acc;
  }, {});

  const toggleChapter = async (bookId, chapter, isPastProgress = false) => {
    const key = [bookId, chapter];
    const existing = await db.progress.get(key);
    const today = getTodayDateString();

    await db.transaction('rw', db.progress, db.dailyLog, async () => {
      let daily = await db.dailyLog.get(today);
      if (!daily) {
        daily = { date: today, chaptersRead: 0 };
      }

      if (existing) {
        // Untoggle
        await db.progress.delete(key);
        if (!isPastProgress) {
          daily.chaptersRead = Math.max(0, daily.chaptersRead - 1);
        }
      } else {
        // Toggle
        await db.progress.put({
          bookId,
          chapter,
          completedAt: Date.now()
        });
        if (!isPastProgress) {
          daily.chaptersRead += 1;
        }
      }
      await db.dailyLog.put(daily);
    });
  };

  const toggleBookComplete = async (bookId, chapterCount, isPastProgress = false) => {
    const today = getTodayDateString();
    
    await db.transaction('rw', db.progress, db.dailyLog, async () => {
      let daily = await db.dailyLog.get(today);
      if (!daily) {
        daily = { date: today, chaptersRead: 0 };
      }

      const bookProgress = progressMap[bookId] || {};
      const completedCount = Object.keys(bookProgress).length;
      const isFullyComplete = completedCount === chapterCount;

      if (isFullyComplete) {
        // Un-complete entire book
        for (let i = 1; i <= chapterCount; i++) {
          await db.progress.delete([bookId, i]);
          if (!isPastProgress) {
            daily.chaptersRead = Math.max(0, daily.chaptersRead - 1);
          }
        }
      } else {
        // Complete all uncompleted chapters
        for (let i = 1; i <= chapterCount; i++) {
          if (!bookProgress[i]) {
            await db.progress.put({ bookId, chapter: i, completedAt: Date.now() });
            if (!isPastProgress) {
              daily.chaptersRead += 1;
            }
          }
        }
      }
      await db.dailyLog.put(daily);
    });
  };

  return {
    progressRaw,
    progressMap,
    toggleChapter,
    toggleBookComplete
  };
}
