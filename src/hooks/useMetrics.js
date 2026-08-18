import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useAppSettings } from './useAppSettings';
import { useProgress } from './useProgress';
import { getTodayDateString } from '../utils/date';

export function useMetrics() {
  const { books, includeSupplemental, goalType, goalPace, goalDate, startedReadingDate } = useAppSettings();
  const { progressMap } = useProgress();
  
  const dailyLogs = useLiveQuery(() => db.dailyLog.toArray(), []) || [];
  
  if (!books || !progressMap) {
    return { isLoading: true };
  }

  // 1. Total Completion
  let totalChapters = 0;
  let completedChapters = 0;
  
  books.forEach(book => {
    if (!includeSupplemental && book.isSupplementary) return;
    
    totalChapters += book.chapterCount;
    if (progressMap[book.id]) {
      const completed = Object.keys(progressMap[book.id]).length;
      completedChapters += completed;
    }
  });

  const completionPercent = totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100);

  // 2. Streak Math
  const activeDates = new Set(dailyLogs.filter(l => l.chaptersRead > 0).map(l => l.date));
  let currentStreak = 0;
  
  const todayStr = getTodayDateString();
  if (activeDates.has(todayStr)) {
    currentStreak++;
  }

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  
  while (true) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    if (activeDates.has(dateStr)) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // 3. Velocity (7-day or Lifetime if Started Date is set)
  let velocity = 0;
  
  if (startedReadingDate) {
    const start = new Date(startedReadingDate);
    const now = new Date();
    const diffTime = now - start;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    velocity = +(completedChapters / diffDays).toFixed(1);
  } else {
    let last7DaysRead = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const log = dailyLogs.find(l => l.date === dateStr);
      if (log) {
        last7DaysRead += log.chaptersRead;
      }
    }
    velocity = +(last7DaysRead / 7).toFixed(1);
  }

  // 4. Pace Forecasting
  const chaptersRemaining = totalChapters - completedChapters;
  const daysRemaining = velocity > 0 ? Math.ceil(chaptersRemaining / velocity) : null;
  
  let projectedDate = null;
  if (daysRemaining !== null) {
    const pd = new Date();
    pd.setDate(pd.getDate() + daysRemaining);
    projectedDate = pd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Goal logic
  let requiredPace = 0;
  if (goalType === 'date' && goalDate) {
    const target = new Date(goalDate);
    const now = new Date();
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      requiredPace = +(chaptersRemaining / diffDays).toFixed(1);
    }
  }

  // 5. Today's Read Count
  const todayLog = dailyLogs.find(l => l.date === todayStr);
  const chaptersReadToday = todayLog ? todayLog.chaptersRead : 0;

  return {
    isLoading: false,
    totalChapters,
    completedChapters,
    completionPercent,
    currentStreak,
    velocity,
    projectedDate,
    chaptersReadToday,
    chaptersRemaining,
    requiredPace
  };
}
