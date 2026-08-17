import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { 
    isLoading, 
    completionPercent, 
    currentStreak, 
    chaptersReadToday, 
    projectedDate, 
    velocity,
    completedChapters,
    totalChapters
  } = useMetrics();

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading metrics...</div>;
  }

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted, #666)', marginBottom: '32px' }}>Welcome back. Let's keep the streak alive!</p>

      {/* Main Progress Card */}
      <div style={{
        backgroundColor: 'var(--code-bg, #f4f3ec)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid var(--border, #eee)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--accent, #aa3bff)', lineHeight: '1' }}>
          {completionPercent}%
        </div>
        <div style={{ color: 'var(--text-h)', marginTop: '8px', fontSize: '1.1rem', fontWeight: '500' }}>
          Bible Completed
        </div>
        <div style={{ color: 'var(--text, #666)', fontSize: '0.9rem', marginTop: '4px' }}>
          {completedChapters} of {totalChapters} Chapters
        </div>
        
        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: 'var(--border, #ddd)', 
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '20px'
        }}>
          <div style={{ 
            width: `${completionPercent}%`, 
            height: '100%', 
            backgroundColor: 'var(--accent, #aa3bff)',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        {/* Streak */}
        <div style={{
          backgroundColor: 'var(--code-bg, #f4f3ec)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border, #eee)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-h)' }}>
            {currentStreak} <span style={{ fontSize: '1.5rem' }}>🔥</span>
          </div>
          <div style={{ color: 'var(--text, #666)', fontSize: '0.9rem', marginTop: '4px' }}>
            Day Streak
          </div>
        </div>

        {/* Read Today */}
        <div style={{
          backgroundColor: 'var(--code-bg, #f4f3ec)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border, #eee)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-h)' }}>
            {chaptersReadToday}
          </div>
          <div style={{ color: 'var(--text, #666)', fontSize: '0.9rem', marginTop: '4px' }}>
            Read Today
          </div>
        </div>
      </div>

      {/* Pace Forecasting */}
      <div style={{
        backgroundColor: 'var(--code-bg, #f4f3ec)',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '16px',
        border: '1px solid var(--border, #eee)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--text-h)' }}>Pace Forecast</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text, #666)' }}>Current Velocity (7d):</span>
          <span style={{ fontWeight: '600', color: 'var(--text-h)' }}>{velocity} ch/day</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text, #666)' }}>Est. Completion:</span>
          <span style={{ fontWeight: '600', color: 'var(--accent, #aa3bff)' }}>
            {projectedDate || 'Keep reading!'}
          </span>
        </div>
      </div>

      <Link 
        to="/books" 
        style={{
          display: 'block',
          width: '100%',
          padding: '16px',
          backgroundColor: 'var(--accent, #aa3bff)',
          color: '#fff',
          textAlign: 'center',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: '600',
          marginTop: '24px',
          fontSize: '1.1rem'
        }}
      >
        Continue Reading
      </Link>
    </div>
  );
}
