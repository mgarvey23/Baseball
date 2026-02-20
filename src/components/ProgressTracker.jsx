import { useState, useMemo } from 'react';
import './ProgressTracker.css';

const SKILLS = [
  { id: 'throwing',    label: 'Throwing Mechanics', icon: '💪', category: 'Fundamental' },
  { id: 'catching',    label: 'Catching',           icon: '🧤', category: 'Fundamental' },
  { id: 'hitting',     label: 'Hitting / Contact',  icon: '🥎', category: 'Fundamental' },
  { id: 'fielding',    label: 'Fielding Grounders',  icon: '🌿', category: 'Fundamental' },
  { id: 'flyball',     label: 'Tracking Fly Balls',  icon: '☀️', category: 'Fundamental' },
  { id: 'baserunning', label: 'Baserunning IQ',      icon: '🏃', category: 'Game Sense' },
  { id: 'rules',       label: 'Rules Knowledge',     icon: '📖', category: 'Game Sense' },
  { id: 'focus',       label: 'Focus & Attention',   icon: '🧠', category: 'Mental' },
  { id: 'confidence',  label: 'Confidence',          icon: '💬', category: 'Mental' },
  { id: 'agility',     label: 'Speed & Agility',     icon: '⚡', category: 'Athletic' },
  { id: 'armStrength', label: 'Arm Strength',        icon: '🔥', category: 'Athletic' },
];

const CATEGORIES = ['Fundamental', 'Game Sense', 'Mental', 'Athletic'];

const STAR_LABELS = ['', 'Just Starting', 'Getting It', 'Solid', 'Really Good', 'Outstanding'];

export default function ProgressTracker() {
  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem('bb-sessions-progress') || '[]'));
  const [tab, setTab] = useState('log');
  const [form, setForm] = useState({ date: new Date().toLocaleDateString(), ratings: {}, notes: '' });
  const [saved, setSaved] = useState(false);

  function setRating(skillId, val) {
    setForm(f => ({ ...f, ratings: { ...f.ratings, [skillId]: val } }));
    setSaved(false);
  }

  function saveSession() {
    if (Object.keys(form.ratings).length === 0) return;
    const updated = [{ ...form, id: Date.now() }, ...sessions].slice(0, 50);
    setSessions(updated);
    localStorage.setItem('bb-sessions-progress', JSON.stringify(updated));
    setSaved(true);
    setForm({ date: new Date().toLocaleDateString(), ratings: {}, notes: '' });
  }

  // Latest ratings per skill for the overview
  const latestRatings = useMemo(() => {
    const out = {};
    SKILLS.forEach(s => {
      const found = sessions.find(sess => sess.ratings[s.id] !== undefined);
      if (found) out[s.id] = found.ratings[s.id];
    });
    return out;
  }, [sessions]);

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h2>Progress Tracker</h2>
        <p>Rate skills after each session to see your son's improvement over time.</p>
      </div>

      <div className="progress-tabs">
        {[{ id: 'log', label: 'Log Session' }, { id: 'overview', label: 'Skill Overview' }, { id: 'history', label: 'History' }].map(t => (
          <button key={t.id} className={`progress-tab ${tab === t.id ? 'active' : ''}`} onClick={() => { setTab(t.id); setSaved(false); }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="log-section">
          <div className="log-date-row">
            <label>Session Date</label>
            <input className="log-date-input" type="text" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>

          {CATEGORIES.map(cat => (
            <div key={cat} className="skill-category-group">
              <div className="skill-category-label">{cat}</div>
              {SKILLS.filter(s => s.category === cat).map(skill => (
                <div key={skill.id} className="skill-row">
                  <div className="skill-row-label">
                    <span className="skill-icon">{skill.icon}</span>
                    <span>{skill.label}</span>
                  </div>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        className={`star ${(form.ratings[skill.id] || 0) >= n ? 'filled' : ''}`}
                        onClick={() => setRating(skill.id, n)}
                        title={STAR_LABELS[n]}
                      >★</button>
                    ))}
                    {form.ratings[skill.id] && (
                      <span className="star-label">{STAR_LABELS[form.ratings[skill.id]]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="log-notes-wrap">
            <label>Session Notes (optional)</label>
            <textarea
              className="log-notes"
              placeholder="What went well? What to work on next time?"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <button className="log-save-btn" onClick={saveSession} disabled={Object.keys(form.ratings).length === 0}>
            {saved ? '✓ Session Saved!' : '💾 Save Session'}
          </button>

          {Object.keys(form.ratings).length === 0 && (
            <p className="log-hint">Rate at least one skill to save.</p>
          )}
        </div>
      )}

      {tab === 'overview' && (
        <div className="overview-section">
          {sessions.length === 0 ? (
            <div className="overview-empty">
              <span>📈</span>
              <p>Log a session first to see your skill overview.</p>
            </div>
          ) : (
            <>
              <p className="overview-sub">Based on your most recent session ratings.</p>
              {CATEGORIES.map(cat => (
                <div key={cat} className="overview-category">
                  <div className="overview-cat-label">{cat}</div>
                  {SKILLS.filter(s => s.category === cat).map(skill => {
                    const rating = latestRatings[skill.id] || 0;
                    return (
                      <div key={skill.id} className="overview-row">
                        <span className="overview-icon">{skill.icon}</span>
                        <span className="overview-skill-name">{skill.label}</span>
                        <div className="overview-bar-track">
                          <div className="overview-bar-fill" style={{ width: `${(rating / 5) * 100}%` }} />
                        </div>
                        <div className="overview-stars">
                          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="history-section">
          {sessions.length === 0 ? (
            <div className="overview-empty"><span>📋</span><p>No sessions logged yet.</p></div>
          ) : (
            sessions.map(sess => (
              <div key={sess.id} className="history-session">
                <div className="history-session-date">{sess.date}</div>
                <div className="history-skills-grid">
                  {SKILLS.filter(s => sess.ratings[s.id] !== undefined).map(skill => (
                    <div key={skill.id} className="history-skill-chip">
                      <span>{skill.icon}</span>
                      <span>{skill.label}</span>
                      <span className="hchip-stars">{'★'.repeat(sess.ratings[skill.id])}</span>
                    </div>
                  ))}
                </div>
                {sess.notes && <div className="history-notes">📝 {sess.notes}</div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
