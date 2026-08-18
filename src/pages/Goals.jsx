import React from 'react';
import { useAppSettings } from '../hooks/useAppSettings';
import { useMetrics } from '../hooks/useMetrics';

export default function Goals() {
  const { goalType, goalPace, goalFrequency, goalDate, startedReadingDate, setSetting, isLoading: settingsLoading } = useAppSettings();
  const { requiredPace, chaptersRemaining, isLoading: metricsLoading } = useMetrics();

  if (settingsLoading || metricsLoading) {
    return <div style={{ padding: '20px' }}>Loading goals...</div>;
  }

  // Calculate daily pace equivalent based on frequency
  const paceNum = Number(goalPace) || 0;
  const daysPerFrequency = goalFrequency === 'week' ? 7 : goalFrequency === 'month' ? 30 : 1;
  const equivalentDailyPace = paceNum / daysPerFrequency;
  const estimatedDaysRemaining = equivalentDailyPace > 0 ? Math.ceil(chaptersRemaining / equivalentDailyPace) : 0;

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h1 style={{ marginBottom: '8px' }}>Reading Goals</h1>
      <p style={{ color: 'var(--text-muted, #666)', marginBottom: '32px' }}>
        Set your pace or pick a finish date.
      </p>
      
      {/* Starting Tracking Box */}
      <div style={{
        backgroundColor: 'var(--code-bg, #f4f3ec)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border, #eee)',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Started Reading Date</h2>
        <p style={{ color: 'var(--text, #666)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Set the date you started your reading plan to accurately track your lifetime reading pace.
        </p>
        <input 
          type="date" 
          value={startedReadingDate}
          onChange={(e) => setSetting('started_reading_date', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border, #ccc)',
            fontSize: '1rem',
            backgroundColor: 'var(--bg, #fff)'
          }}
        />
      </div>

      <div style={{
        backgroundColor: 'var(--code-bg, #f4f3ec)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border, #eee)',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Target Type</h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={() => setSetting('goal_type', 'pace')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: goalType === 'pace' ? '2px solid var(--accent, #aa3bff)' : '1px solid var(--border, #ccc)',
              backgroundColor: goalType === 'pace' ? 'var(--accent-bg, rgba(170, 59, 255, 0.1))' : 'transparent',
              color: 'var(--text-h)',
              fontWeight: goalType === 'pace' ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Target Pace
          </button>
          
          <button 
            onClick={() => setSetting('goal_type', 'date')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: goalType === 'date' ? '2px solid var(--accent, #aa3bff)' : '1px solid var(--border, #ccc)',
              backgroundColor: goalType === 'date' ? 'var(--accent-bg, rgba(170, 59, 255, 0.1))' : 'transparent',
              color: 'var(--text-h)',
              fontWeight: goalType === 'date' ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Target Date
          </button>
        </div>

        {goalType === 'pace' && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Target Chapters
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                min="1"
                value={goalPace}
                onChange={(e) => setSetting('goal_pace', e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border, #ccc)',
                  fontSize: '1rem',
                  backgroundColor: 'var(--bg, #fff)'
                }}
              />
              <select
                value={goalFrequency}
                onChange={(e) => setSetting('goal_frequency', e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border, #ccc)',
                  fontSize: '1rem',
                  backgroundColor: 'var(--bg, #fff)',
                  appearance: 'none'
                }}
              >
                <option value="day">per Day</option>
                <option value="week">per Week</option>
                <option value="month">per Month</option>
              </select>
            </div>
            {paceNum > 0 && (
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text, #666)' }}>
                At this pace, you'll finish the remaining {chaptersRemaining} chapters in about {estimatedDaysRemaining} days.
              </p>
            )}
          </div>
        )}

        {goalType === 'date' && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Target Finish Date
            </label>
            <input 
              type="date" 
              value={goalDate}
              onChange={(e) => setSetting('goal_date', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border, #ccc)',
                fontSize: '1rem',
                backgroundColor: 'var(--bg, #fff)'
              }}
            />
            {goalDate && requiredPace > 0 && (
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text, #666)' }}>
                To hit this goal, you need to read <strong>{requiredPace}</strong> chapters per day.
              </p>
            )}
            {goalDate && requiredPace <= 0 && (
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--accent, #aa3bff)', fontWeight: '600' }}>
                You're already done or the date is in the past!
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
