import { useState, useMemo } from 'react';
import { REST_RULES_7_8, ARM_STRENGTH_PHASES, RECOVERY_CHECKLIST, WARNING_SIGNS } from '../data/armProgram';
import './ArmHealth.css';

const TABS = [
  { id: 'tracker', label: 'Pitch Tracker' },
  { id: 'strength', label: 'Arm Strengthening' },
  { id: 'recovery', label: 'Recovery' },
];

export default function ArmHealth() {
  const [tab, setTab] = useState('tracker');

  return (
    <div className="arm-page">
      <div className="arm-header">
        <h2>Arm Health</h2>
        <p>Pitch count tracking, rest rules, and a full arm-building program.</p>
      </div>

      <div className="arm-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`arm-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'tracker'  && <PitchTracker />}
      {tab === 'strength' && <ArmStrengthening />}
      {tab === 'recovery' && <RecoveryTab />}
    </div>
  );
}

// ─── Pitch Tracker ──────────────────────────────────────────────────────────

function PitchTracker() {
  const [log, setLog] = useState(() => {
    const saved = localStorage.getItem('bb-pitch-log');
    return saved ? JSON.parse(saved) : [];
  });
  const [todayCount, setTodayCount] = useState(0);
  const [increment, setIncrement] = useState(5);

  const today = new Date().toLocaleDateString();
  const todayEntry = log.find((e) => e.date === today);
  const displayCount = todayEntry ? todayEntry.pitches : todayCount;

  const restRule = useMemo(() => {
    return REST_RULES_7_8.find((r) => displayCount >= r.min && displayCount <= r.max)
      || (displayCount > 50 ? { ...REST_RULES_7_8[3], label: 'Daily limit exceeded!', color: '#c0392b' } : REST_RULES_7_8[0]);
  }, [displayCount]);

  const pct = Math.min((displayCount / 50) * 100, 100);

  function logPitches(n) {
    const newCount = Math.min(displayCount + n, 50);
    const newLog = log.filter((e) => e.date !== today);
    newLog.unshift({ date: today, pitches: newCount });
    setLog(newLog);
    setTodayCount(newCount);
    localStorage.setItem('bb-pitch-log', JSON.stringify(newLog));
  }

  function resetToday() {
    const newLog = log.filter((e) => e.date !== today);
    setLog(newLog);
    setTodayCount(0);
    localStorage.setItem('bb-pitch-log', JSON.stringify(newLog));
  }

  return (
    <div className="tracker-wrap">
      {/* Pitch gauge */}
      <div className="pitch-gauge-card">
        <div className="gauge-label-row">
          <span className="gauge-title">Today's Pitch Count</span>
          <span className="gauge-date">{today}</span>
        </div>

        <div className="gauge-number" style={{ color: restRule.color }}>
          {displayCount}<span className="gauge-max">/50</span>
        </div>

        {/* Progress arc */}
        <div className="gauge-bar-track">
          <div
            className="gauge-bar-fill"
            style={{ width: `${pct}%`, background: restRule.color }}
          />
        </div>

        {/* Zone labels */}
        <div className="gauge-zones">
          <span style={{ color: '#27ae60' }}>0–25: No rest</span>
          <span style={{ color: '#f39c12' }}>26–37: 1 day</span>
          <span style={{ color: '#e67e22' }}>38–49: 2 days</span>
          <span style={{ color: '#e74c3c' }}>50: 3 days</span>
        </div>

        {/* Rest status */}
        <div className="rest-status" style={{ borderColor: restRule.color }}>
          <span className="rest-status-icon" style={{ color: restRule.color }}>
            {restRule.days === 0 ? '✅' : restRule.days === 1 ? '⚠️' : '🛑'}
          </span>
          <div>
            <div className="rest-status-label" style={{ color: restRule.color }}>
              {restRule.label}
            </div>
            {restRule.days > 0 && (
              <div className="rest-status-sub">
                Must not pitch again for {restRule.days} calendar day{restRule.days > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="pitch-controls">
          <div className="increment-select">
            {[1, 5, 10, 15].map((n) => (
              <button
                key={n}
                className={`inc-btn ${increment === n ? 'active' : ''}`}
                onClick={() => setIncrement(n)}
              >+{n}</button>
            ))}
          </div>
          <div className="pitch-btn-row">
            <button
              className="btn-log-pitch"
              onClick={() => logPitches(increment)}
              disabled={displayCount >= 50}
            >
              Log +{increment} Pitches
            </button>
            <button className="btn-reset" onClick={resetToday}>Reset Today</button>
          </div>
        </div>
      </div>

      {/* History */}
      {log.length > 1 && (
        <div className="pitch-history">
          <h4>Recent Sessions</h4>
          {log.slice(0, 7).map((entry) => {
            const rule = REST_RULES_7_8.find((r) => entry.pitches >= r.min && entry.pitches <= r.max) || REST_RULES_7_8[3];
            return (
              <div key={entry.date} className="history-row">
                <span className="history-date">{entry.date}</span>
                <div className="history-bar-track">
                  <div
                    className="history-bar-fill"
                    style={{ width: `${Math.min((entry.pitches / 50) * 100, 100)}%`, background: rule.color }}
                  />
                </div>
                <span className="history-count" style={{ color: rule.color }}>{entry.pitches}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="pitch-rule-note">
        <span>📋</span>
        <span>
          Official Little League Pitch Smart rules for ages 7–8. Daily maximum is 50 pitches.
          Rest days are <strong>calendar days</strong> — not just days without practice.
        </span>
      </div>
    </div>
  );
}

// ─── Arm Strengthening ──────────────────────────────────────────────────────

function ArmStrengthening() {
  const [openPhase, setOpenPhase] = useState('phase1');
  const [checked, setChecked] = useState({});

  function toggleExercise(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="strength-wrap">
      <div className="strength-intro">
        <div className="strength-intro-icon">💪</div>
        <div>
          <h3>Age 7 Arm Strengthening Program</h3>
          <p>
            Three structured phases: shoulder stability first, then long toss to build distance,
            then mechanics-based velocity drills. No weights or resistance bands — all bodyweight
            and throwing-based, safe for pre-pubescent athletes.
          </p>
        </div>
      </div>

      {ARM_STRENGTH_PHASES.map((phase) => (
        <div key={phase.id} className={`phase-card ${openPhase === phase.id ? 'open' : ''}`}>
          <button
            className="phase-header"
            onClick={() => setOpenPhase(openPhase === phase.id ? null : phase.id)}
          >
            <div>
              <span className="phase-tag">{phase.phase}</span>
              <div className="phase-title">{phase.title}</div>
              <div className="phase-subtitle">{phase.subtitle}</div>
            </div>
            <span className="phase-chevron">{openPhase === phase.id ? '▲' : '▼'}</span>
          </button>

          {openPhase === phase.id && (
            <div className="phase-body">
              <p className="phase-desc">{phase.description}</p>
              <div className="phase-meta-row">
                <span className="phase-meta-chip">🎯 Goal: {phase.goal}</span>
                <span className="phase-meta-chip">⏱ Rest: {phase.restBetweenSets}</span>
              </div>

              <div className="exercise-list">
                {phase.exercises.map((ex, idx) => {
                  const key = `${phase.id}-${idx}`;
                  const done = !!checked[key];
                  return (
                    <div key={key} className={`exercise-card ${done ? 'done' : ''}`}>
                      <button
                        className="exercise-check"
                        onClick={() => toggleExercise(key)}
                        title="Mark as done"
                      >
                        {done ? '✓' : ''}
                      </button>
                      <div className="exercise-icon">{ex.icon}</div>
                      <div className="exercise-info">
                        <div className="exercise-name">{ex.name}</div>
                        <div className="exercise-sets">{ex.sets} set{ex.sets > 1 ? 's' : ''} · {ex.reps}</div>
                        <div className="exercise-cue">"{ex.cue}"</div>
                        <div className="exercise-purpose">Why: {ex.purpose}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="clear-phase" onClick={() => {
                const keys = phase.exercises.map((_, i) => `${phase.id}-${i}`);
                setChecked((prev) => {
                  const next = { ...prev };
                  keys.forEach((k) => delete next[k]);
                  return next;
                });
              }}>
                Reset checkboxes
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="strength-warning">
        <span>⚠️</span>
        <span>
          <strong>No resistance bands, weighted balls, or weight training</strong> until growth plates
          close (typically age 13–16). These phases use only bodyweight and throwing to build
          strength safely.
        </span>
      </div>
    </div>
  );
}

// ─── Recovery Tab ───────────────────────────────────────────────────────────

function RecoveryTab() {
  const [checked, setChecked] = useState({});

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="recovery-wrap">
      <div className="recovery-intro">
        <h3>Post-Throwing Recovery Checklist</h3>
        <p>
          Research (PMC10745648) shows that less than 8 hours of sleep increases injury risk
          by 1.7x. Recovery isn't optional — it IS training. Check these off after every session.
        </p>
      </div>

      <div className="checklist">
        {RECOVERY_CHECKLIST.map((item) => (
          <button
            key={item.id}
            className={`checklist-item ${checked[item.id] ? 'checked' : ''}`}
            onClick={() => toggle(item.id)}
          >
            <span className="checklist-icon">{item.icon}</span>
            <span className="checklist-label">{item.label}</span>
            <span className="checklist-check">{checked[item.id] ? '✓' : ''}</span>
          </button>
        ))}
      </div>

      <div className="warning-signs-card">
        <h4>Stop Throwing — See a Doctor If:</h4>
        <ul className="warning-list">
          {WARNING_SIGNS.map((sign, i) => (
            <li key={i}>{sign}</li>
          ))}
        </ul>
      </div>

      <div className="sleep-card">
        <div className="sleep-icon">😴</div>
        <div>
          <h4>Sleep = Arm Recovery</h4>
          <p>
            At age 7, your son needs <strong>9–11 hours of sleep per night</strong>.
            This is when growth hormone is released and arm muscles repair from throwing stress.
            A late night before a game day is genuinely worse for performance and arm health than skipping an extra drill.
          </p>
        </div>
      </div>
    </div>
  );
}
