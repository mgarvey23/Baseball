import { useState, useMemo } from 'react';
import { DRILLS, CATEGORIES } from '../data/drills';
import './PracticePlanner.css';

const DEFAULT_DURATION = 60; // total session minutes

export default function PracticePlanner() {
  const [sessionDrills, setSessionDrills] = useState([]);
  const [sessionName, setSessionName] = useState('Practice Session');
  const [targetMinutes, setTargetMinutes] = useState(DEFAULT_DURATION);
  const [addingDrill, setAddingDrill] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [saved, setSaved] = useState(false);

  const totalMinutes = useMemo(
    () => sessionDrills.reduce((sum, d) => sum + d.duration, 0),
    [sessionDrills]
  );

  const remaining = targetMinutes - totalMinutes;
  const overTime = remaining < 0;

  function addDrill(drill) {
    setSessionDrills((prev) => [...prev, { ...drill, uid: crypto.randomUUID() }]);
    setAddingDrill(false);
    setSaved(false);
  }

  function removeDrill(uid) {
    setSessionDrills((prev) => prev.filter((d) => d.uid !== uid));
    setSaved(false);
  }

  function moveDrill(uid, dir) {
    setSessionDrills((prev) => {
      const idx = prev.findIndex((d) => d.uid === uid);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  function saveSession() {
    const session = { name: sessionName, drills: sessionDrills, totalMinutes, savedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('bb-sessions') || '[]');
    existing.unshift(session);
    localStorage.setItem('bb-sessions', JSON.stringify(existing.slice(0, 20)));
    setSaved(true);
  }

  function clearSession() {
    setSessionDrills([]);
    setSaved(false);
  }

  const available = DRILLS.filter((d) =>
    filterCat === 'all' || d.category === filterCat
  );

  return (
    <div className="planner-page">
      <div className="planner-header">
        <h2>Practice Planner</h2>
        <p>Build a session, track total time, save for later.</p>
      </div>

      {/* Session settings */}
      <div className="planner-settings">
        <div className="setting-group">
          <label>Session name</label>
          <input
            className="setting-input"
            value={sessionName}
            onChange={(e) => { setSessionName(e.target.value); setSaved(false); }}
          />
        </div>
        <div className="setting-group">
          <label>Target duration</label>
          <div className="duration-select">
            {[30, 45, 60, 75, 90].map((m) => (
              <button
                key={m}
                className={`dur-btn ${targetMinutes === m ? 'active' : ''}`}
                onClick={() => setTargetMinutes(m)}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time bar */}
      <div className="time-bar-wrap">
        <div className="time-bar-labels">
          <span className={overTime ? 'over-time' : ''}>{totalMinutes} min used</span>
          <span>{overTime ? `${Math.abs(remaining)} min over` : `${remaining} min left`}</span>
        </div>
        <div className="time-bar-track">
          <div
            className={`time-bar-fill ${overTime ? 'over' : totalMinutes / targetMinutes > 0.8 ? 'warn' : 'ok'}`}
            style={{ width: `${Math.min((totalMinutes / targetMinutes) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Session drill list */}
      <div className="session-drills">
        {sessionDrills.length === 0 ? (
          <div className="session-empty">
            <span className="empty-icon">📋</span>
            <p>No drills added yet. Hit "Add Drill" to build your session.</p>
          </div>
        ) : (
          <>
            {sessionDrills.map((drill, idx) => {
              const cat = CATEGORIES.find((c) => c.id === drill.category);
              return (
                <div key={drill.uid} className="session-drill-row">
                  <div className="session-drill-num">{idx + 1}</div>
                  <div className="session-drill-icon">{cat?.icon}</div>
                  <div className="session-drill-info">
                    <div className="session-drill-name">{drill.name}</div>
                    <div className="session-drill-meta">{cat?.label} · {drill.duration} min</div>
                  </div>
                  <div className="session-drill-actions">
                    <button
                      className="row-btn"
                      onClick={() => moveDrill(drill.uid, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >↑</button>
                    <button
                      className="row-btn"
                      onClick={() => moveDrill(drill.uid, 1)}
                      disabled={idx === sessionDrills.length - 1}
                      title="Move down"
                    >↓</button>
                    <button
                      className="row-btn remove"
                      onClick={() => removeDrill(drill.uid)}
                      title="Remove"
                    >✕</button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="planner-actions">
        <button className="btn-add-drill" onClick={() => setAddingDrill(true)}>
          + Add Drill
        </button>
        {sessionDrills.length > 0 && (
          <>
            <button className="btn-save" onClick={saveSession}>
              {saved ? '✓ Saved!' : '💾 Save Session'}
            </button>
            <button className="btn-clear" onClick={clearSession}>
              Clear
            </button>
          </>
        )}
      </div>

      {/* Research tip */}
      <div className="planner-tip">
        <span className="tip-icon">🔬</span>
        <span>Research tip: Keep individual drills under 10 minutes and total sessions under 75 minutes for 7-year-olds. Attention spans are short — quality over quantity.</span>
      </div>

      {/* Add drill modal */}
      {addingDrill && (
        <div className="modal-overlay" onClick={() => setAddingDrill(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose a Drill</h3>
              <button className="modal-close" onClick={() => setAddingDrill(false)}>✕</button>
            </div>

            <div className="modal-filters">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-btn ${filterCat === cat.id ? 'active' : ''}`}
                  onClick={() => setFilterCat(cat.id)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            <div className="modal-drill-list">
              {available.map((drill) => {
                const cat = CATEGORIES.find((c) => c.id === drill.category);
                const alreadyAdded = sessionDrills.some((d) => d.id === drill.id);
                return (
                  <button
                    key={drill.id}
                    className={`modal-drill-row ${alreadyAdded ? 'already' : ''}`}
                    onClick={() => !alreadyAdded && addDrill(drill)}
                    disabled={alreadyAdded}
                  >
                    <span className="mdrill-icon">{cat?.icon}</span>
                    <div className="mdrill-info">
                      <div className="mdrill-name">{drill.name}</div>
                      <div className="mdrill-meta">{drill.duration} min · {drill.difficulty}</div>
                    </div>
                    {alreadyAdded
                      ? <span className="mdrill-added">Added</span>
                      : <span className="mdrill-add">+</span>
                    }
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
