import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import protestant from '../data/protestant.json';
import catholic from '../data/catholic.json';
import orthodox from '../data/orthodox.json';

const CANONS = {
  protestant,
  catholic,
  orthodox
};

export function useAppSettings() {
  const settingsArray = useLiveQuery(() => db.settings.toArray(), []);
  
  if (!settingsArray) return { isLoading: true };

  const settings = settingsArray.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const activeCanonKey = settings['active_canon'] || 'protestant';
  const includeSupplemental = settings['include_supplemental'] || false;
  
  const goalType = settings['goal_type'] || 'pace'; // 'pace' or 'date'
  const goalPace = settings['goal_pace'] !== undefined ? settings['goal_pace'] : 3;
  const goalFrequency = settings['goal_frequency'] || 'day'; // 'day', 'week', 'month'
  const goalDate = settings['goal_date'] || ''; // YYYY-MM-DD
  const startedReadingDate = settings['started_reading_date'] || ''; // YYYY-MM-DD
  
  const books = CANONS[activeCanonKey] || CANONS['protestant'];
  
  const setSetting = async (key, value) => {
    await db.settings.put({ key, value });
  };

  return {
    isLoading: false,
    activeCanonKey,
    includeSupplemental,
    goalType,
    goalPace,
    goalFrequency,
    goalDate,
    startedReadingDate,
    books,
    setSetting
  };
}
