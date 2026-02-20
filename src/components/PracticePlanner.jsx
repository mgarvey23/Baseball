import { useState, useMemo } from 'react';
import { DRILLS, CATEGORIES } from '../data/drills';
import './PracticePlanner.css';

/* ── Preset 7-day rotation ───────────────────────────────────────────── */
const DEFAULT_ROTATION = [
  {
    day: 1,
    label: 'Hitting Day',
    icon: '🥎',
    accent: '#002D72',
    drillIds: ['tee-work', 'soft-toss', 'small-ball-hitting'],
    duration: 45,
  },
  {
    day: 2,
    label: 'Fielding Day',
    icon: '🌿',
    accent: '#1a5c1a',
    drillIds: ['ground-ball-basics', 'react-ball-field', 'fly-ball-tracking'],
    duration: 45,
  },
  {
    day: 3,
    label: 'Speed & Agility',
    icon: '⚡',
    accent: '#005A9C',
    drillIds: ['ladder-two-feet', 'cone-shuffle', 'reactive-agility'],
    duration: 45,
  },
  {
    day: 4,
    label: 'Throwing Day',
    icon: '💪',
    accent: '#7a1f1f',
    drillIds: ['throwing-motion-dry', 'short-toss-accuracy', 'relay-throw'],
    duration: 45,
  },
  {
    day: 5,
    label: 'Catching Day',
    icon: '🧤',
    accent: '#7a5500',
    drillIds: ['two-hand-catch', 'ping-pong-short-hop', 'ball-drop-reaction'],
    duration: 45,
  },
  {
    day: 6,
    label: 'Game Prep',
    icon: '🏆',
    accent: '#C4A44A',
    drillIds: ['lead-off-acceleration', 'base-awareness', 'bat-control-bunt'],
    duration: 45,
  },
  {
    day: 7,
    label: 'Vision & Rest',
    icon: '👁️',
    accent: '#4a5a75',
    drillIds: ['wall-ball', 'color-call-ball', 'run-through-first'],
    duration: 30,
  },
];

function loadRotation() {
  try {
    const saved = JSON.parse(localStorage.getItem('bb-rotation') || 'null');
    if (saved && saved.length === 7) return saved;
  } catch {}
  return DEFAULT_ROTATION.map(d => ({ ...d, drillIds: [...d.drillIds] }));
}

function saveRotation(rotation) {
  localStorage.setItem('bb-rotation', JSON.stringify(rotation));
}

/* Today's day index (0-6) based on real date so it advances daily */
function getTodayIndex() {
  const epoch = new Date('2024-01-01');
  const today = new Date();
  const days = Math.floor((today - epoch) / 86400000);
  return days % 7;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ── Component ───────────────────────────────────────────────────────── */
export default function PracticePlanner() {
  const [tab, setTab] = useState('rotation'); // 'rotation' | 'builder'
  const [rotation, setRotation] = useState(loadRotation);
  const [viewDay, setViewDay] = useState(getTodayIndex()); // 0-6
  const [editingDay, setEditingDay] = useState(null);      // day index or null

  /* Builder state */
  const [sessionDrills, setSessionDrills] = useState([]);
  const [sessionName, setSessionName]     = useState('Practice Session');
  const [targetMinutes, setTargetMinutes] = useState(60);
  const [addingDrill, setAddingDrill]     = useState(false);
  const [filterCat, setFilterCat]         = useState('all');
  const [saved, setSaved]                 = useState(false);

  /* ── Rotation helpers ─────────────────────────────────────────────── */
  function getDrillsForDay(dayData) {
    return dayData.drillIds.map(id => DRILLS.find(d => d.id === id)).filter(Boolean);
  }

  function loadDayIntoBuilder(dayData) {
    const drills = getDrillsForDay(dayData);
    setSessionDrills(drills.map(d => ({ ...d, uid: crypto.randomUUID() })));
    setSessionName(dayData.label);
    setTargetMinutes(dayData.duration);
    setSaved(false);
    setTab('builder');
  }

  function removeDrillFromDay(dayIdx, drillId) {
    const next = rotation.map((d, i) =>
      i === dayIdx ? { ...d, drillIds: d.drillIds.filter(id => id !== drillId) } : d
    );
    setRotation(next);
    saveRotation(next);
  }

  function addDrillToDay(dayIdx, drillId) {
    if (rotation[dayIdx].drillIds.includes(drillId)) return;
    const next = rotation.map((d, i) =>
      i === dayIdx ? { ...d, drillIds: [...d.drillIds, drillId] } : d
    );
    setRotation(next);
    saveRotation(next);
  }

  function resetDay(dayIdx) {
    const next = rotation.map((d, i) =>
      i === dayIdx ? { ...DEFAULT_ROTATION[dayIdx], drillIds: [...DEFAULT_ROTATION[dayIdx].drillIds] } : d
    );
    setRotation(next);
    saveRotation(next);
    setEditingDay(null);
  }

  /* ── Builder helpers ──────────────────────────────────────────────── */
  const totalMinutes = useMemo(
    () => sessionDrills.reduce((sum, d) => sum + d.duration, 0),
    [sessionDrills]
  );
  const remaining = targetMinutes - totalMinutes;
  const overTime  = remaining < 0;

  function addDrill(drill) {
    setSessionDrills(prev => [...prev, { ...drill, uid: crypto.randomUUID() }]);
    setAddingDrill(false);
    setSaved(false);
  }

  function removeDrill(uid) {
    setSessionDrills(prev => prev.filter(d => d.uid !== uid));
    setSaved(false);
  }

  function moveDrill(uid, dir) {
    setSessionDrills(prev => {
      const idx = prev.findIndex(d => d.uid === uid);
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

  function clearSession() { setSessionDrills([]); setSaved(false); }

  const available = DRILLS.filter(d => filterCat === 'all' || d.category === filterCat);
  const todayIdx  = getTodayIndex();

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div className="planner-page">

      {/* Header */}
      <div className="planner-header">
        <h2>Practice Planner</h2>
        <p>Follow your weekly rotation or build a custom session.</p>
      </div>

      {/* Tab switcher */}
      <div className="planner-tabs">
        <button
          className={`planner-tab ${tab === 'rotation' ? 'active' : ''}`}
          onClick={() => setTab('rotation')}
        >
          📅 Weekly Rotation
        </button>
        <button
          className={`planner-tab ${tab === 'builder' ? 'active' : ''}`}
          onClick={() => setTab('builder')}
        >
          🔨 Build Session
        </button>
      </div>

      {/* ── ROTATION TAB ─────────────────────────────────────────────── */}
      {tab === 'rotation' && (
        <div className="rotation-section">

          {/* Day strip */}
          <div className="day-strip">
            {rotation.map((day, idx) => (
              <button
                key={day.day}
                className={`day-chip
                  ${idx === viewDay ? 'selected' : ''}
                  ${idx === todayIdx ? 'today' : ''}`}
                onClick={() => { setViewDay(idx); setEditingDay(null); }}
              >
                <span className="day-chip-name">{DAY_NAMES[idx]}</span>
                <span className="day-chip-icon">{day.icon}</span>
                {idx === todayIdx && <span className="today-dot" />}
              </button>
            ))}
          </div>

          {/* Viewed day card */}
          {(() => {
            const day = rotation[viewDay];
            const drills = getDrillsForDay(day);
            const totalMin = drills.reduce((s, d) => s + d.duration, 0);
            const isToday = viewDay === todayIdx;

            return (
              <div className="rotation-card" style={{ '--day-accent': day.accent }}>
                <div className="rotation-card-header">
                  <div className="rotation-card-title">
                    <span className="rotation-day-icon">{day.icon}</span>
                    <div>
                      <div className="rotation-day-label">{day.label}</div>
                      <div className="rotation-day-meta">
                        {DAY_NAMES[viewDay]} · {totalMin} min · {drills.length} drills
                        {isToday && <span className="today-tag">Today</span>}
                      </div>
                    </div>
                  </div>
                  <div className="rotation-card-actions">
                    {editingDay === viewDay ? (
                      <>
                        <button className="rc-btn rc-btn-reset" onClick={() => resetDay(viewDay)}>
                          Reset
                        </button>
                        <button className="rc-btn rc-btn-done" onClick={() => setEditingDay(null)}>
                          Done
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="rc-btn rc-btn-edit" onClick={() => setEditingDay(viewDay)}>
                          ✏️ Edit
                        </button>
                        <button className="rc-btn rc-btn-load" onClick={() => loadDayIntoBuilder(day)}>
                          ▶ Load &amp; Run
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Drill list */}
                <div className="rotation-drills">
                  {drills.length === 0 && (
                    <div className="rotation-empty">No drills — add some below.</div>
                  )}
                  {drills.map((drill, i) => {
                    const cat = CATEGORIES.find(c => c.id === drill.category);
                    return (
                      <div key={drill.id} className="rotation-drill-row">
                        <span className="rotation-drill-num">{i + 1}</span>
                        <span className="rotation-drill-icon">{cat?.icon}</span>
                        <div className="rotation-drill-info">
                          <span className="rotation-drill-name">{drill.name}</span>
                          <span className="rotation-drill-meta">{cat?.label} · {drill.duration} min</span>
                        </div>
                        {editingDay === viewDay && (
                          <button
                            className="rotation-remove"
                            onClick={() => removeDrillFromDay(viewDay, drill.id)}
                            title="Remove from day"
                          >✕</button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add drill panel when editing */}
                {editingDay === viewDay && (
                  <div className="rotation-add-panel">
                    <div className="rotation-add-title">Add a drill to this day:</div>
                    <div className="rotation-add-grid">
                      {DRILLS.filter(d => !rotation[viewDay].drillIds.includes(d.id)).map(drill => {
                        const cat = CATEGORIES.find(c => c.id === drill.category);
                        return (
                          <button
                            key={drill.id}
                            className="rotation-add-btn"
                            onClick={() => addDrillToDay(viewDay, drill.id)}
                          >
                            <span>{cat?.icon}</span>
                            <span className="rotation-add-name">{drill.name}</span>
                            <span className="rotation-add-dur">{drill.duration}m</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Quick week overview */}
          <div className="week-overview">
            <div className="week-overview-title">Full Week at a Glance</div>
            <div className="week-overview-grid">
              {rotation.map((day, idx) => {
                const drills = getDrillsForDay(day);
                const totalMin = drills.reduce((s, d) => s + d.duration, 0);
                return (
                  <button
                    key={idx}
                    className={`week-cell ${idx === todayIdx ? 'today' : ''} ${idx === viewDay ? 'selected' : ''}`}
                    onClick={() => { setViewDay(idx); setEditingDay(null); }}
                  >
                    <span className="week-cell-icon">{day.icon}</span>
                    <span className="week-cell-label">{day.label}</span>
                    <span className="week-cell-meta">{totalMin}m</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ── BUILDER TAB ──────────────────────────────────────────────── */}
      {tab === 'builder' && (
        <>
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
                <p>No drills yet. Load a rotation day or add drills manually.</p>
              </div>
            ) : (
              sessionDrills.map((drill, idx) => {
                const cat = CATEGORIES.find(c => c.id === drill.category);
                return (
                  <div key={drill.uid} className="session-drill-row">
                    <div className="session-drill-num">{idx + 1}</div>
                    <div className="session-drill-icon">{cat?.icon}</div>
                    <div className="session-drill-info">
                      <div className="session-drill-name">{drill.name}</div>
                      <div className="session-drill-meta">{cat?.label} · {drill.duration} min</div>
                    </div>
                    <div className="session-drill-actions">
                      <button className="row-btn" onClick={() => moveDrill(drill.uid, -1)} disabled={idx === 0} title="Move up">↑</button>
                      <button className="row-btn" onClick={() => moveDrill(drill.uid, 1)} disabled={idx === sessionDrills.length - 1} title="Move down">↓</button>
                      <button className="row-btn remove" onClick={() => removeDrill(drill.uid)} title="Remove">✕</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action buttons */}
          <div className="planner-actions">
            <button className="btn-add-drill" onClick={() => setAddingDrill(true)}>+ Add Drill</button>
            <button className="btn-rotation-day" onClick={() => setTab('rotation')}>📅 Pick Rotation Day</button>
            {sessionDrills.length > 0 && (
              <>
                <button className="btn-save" onClick={saveSession}>{saved ? '✓ Saved!' : '💾 Save'}</button>
                <button className="btn-clear" onClick={clearSession}>Clear</button>
              </>
            )}
          </div>

          {/* Research tip */}
          <div className="planner-tip">
            <span className="tip-icon">🔬</span>
            <span>Research tip: Keep individual drills under 10 minutes and total sessions under 75 minutes for 7-year-olds. Quality over quantity.</span>
          </div>

          {/* Add drill modal */}
          {addingDrill && (
            <div className="modal-overlay" onClick={() => setAddingDrill(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Choose a Drill</h3>
                  <button className="modal-close" onClick={() => setAddingDrill(false)}>✕</button>
                </div>
                <div className="modal-filters">
                  {CATEGORIES.map(cat => (
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
                  {available.map(drill => {
                    const cat = CATEGORIES.find(c => c.id === drill.category);
                    const alreadyAdded = sessionDrills.some(d => d.id === drill.id);
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
                          : <span className="mdrill-add">+</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
