import { useAppSettings } from '../hooks/useAppSettings';

export default function Settings() {
  const { isLoading, activeCanonKey, includeSupplemental, setSetting } = useAppSettings();

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading settings...</div>;
  }

  return (
    <div className="page-container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1>Settings</h1>
      
      <div className="settings-section" style={{ marginTop: '2rem' }}>
        <h2>Bible Canon</h2>
        <p style={{ color: 'var(--text-muted, #666)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Select the biblical canon you want to track. Your progress is saved safely across all traditions for shared books.
        </p>
        
        <select 
          value={activeCanonKey}
          onChange={(e) => setSetting('active_canon', e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            backgroundColor: 'var(--bg-element, #fff)'
          }}
        >
          <option value="protestant">Protestant (66 Books)</option>
          <option value="catholic">Catholic (73 Books)</option>
          <option value="orthodox">Orthodox (77 Books)</option>
        </select>
      </div>

      <div className="settings-section" style={{ marginTop: '2rem' }}>
        <h2>Progress Tracking</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input 
            type="checkbox"
            checked={includeSupplemental}
            onChange={(e) => setSetting('include_supplemental', e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ fontSize: '1rem' }}>Include Extra-Canonical Supplemental Books in Progress Goals</span>
        </label>
        <p style={{ color: 'var(--text-muted, #666)', fontSize: '0.85rem', marginTop: '8px', marginLeft: '32px' }}>
          If enabled, any supplemental books outside your chosen canon (e.g. Enoch, if added later) will count towards your total percentage and daily goals.
        </p>
      </div>

      <div className="settings-section" style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <h2>Data Management</h2>
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <button 
            disabled
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: '#f5f5f5',
              cursor: 'not-allowed',
              fontSize: '1rem'
            }}
          >
            Export Backup JSON (Coming Soon)
          </button>
          <button 
            disabled
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#ffebee',
              color: '#c62828',
              cursor: 'not-allowed',
              fontSize: '1rem'
            }}
          >
            Clear All Data (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
