import { useState, useEffect, useRef } from 'react';
import { AGILITY_PROGRAMS, SPEED_TIPS } from '../data/agility';
import './AgilitySpeed.css';

export default function AgilitySpeed() {
  const [activeProgram, setActiveProgram] = useState('week1');
  const [expandedDrill, setExpandedDrill] = useState(null);
  const [times, setTimes] = useState(() => JSON.parse(localStorage.getItem('bb-agility-times') || '{}'));
  const [tab, setTab] = useState('program');

  const program = AGILITY_PROGRAMS.find(p => p.id === activeProgram);

  function saveTime(drillId, time) {
    const updated = { ...times, [drillId]: [...(times[drillId] || []), { time, date: new Date().toLocaleDateString() }].slice(-10) };
    setTimes(updated);
    localStorage.setItem('bb-agility-times', JSON.stringify(updated));
  }

  return (
    <div className="agility-page">
      <div className="agility-header">
        <h2>Agility & Speed</h2>
        <p>8-week progression from foundation footwork to reactive agility — baseball-specific.</p>
      </div>

      <div className="agility-tabs">
        {[{ id: 'program', label: 'Training Program' }, { id: 'tips', label: 'Speed Tips' }, { id: 'times', label: 'My Times' }].map(t => (
          <button key={t.id} className={`agility-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'program' && (
        <>
          <div className="program-selector">
            {AGILITY_PROGRAMS.map(p => (
              <button key={p.id} className={`prog-btn ${activeProgram === p.id ? 'active' : ''}`} onClick={() => { setActiveProgram(p.id); setExpandedDrill(null); }}>
                <span className="prog-week">{p.week}</span>
                <span className="prog-title">{p.title}</span>
              </button>
            ))}
          </div>

          <div className="program-intro">
            <h3>{program.title} Phase</h3>
            <p>{program.description}</p>
          </div>

          <div className="drill-cards">
            {program.drills.map(drill => {
              const isOpen = expandedDrill === drill.id;
              const drillTimes = times[drill.id] || [];
              return (
                <div key={drill.id} className={`agility-drill-card ${isOpen ? 'open' : ''}`}>
                  <button className="agility-drill-header" onClick={() => setExpandedDrill(isOpen ? null : drill.id)}>
                    <span className="agility-drill-icon">{drill.icon}</span>
                    <div className="agility-drill-info">
                      <div className="agility-drill-name">{drill.name}</div>
                      <div className="agility-drill-meta">{drill.duration} {drill.timed ? '· ⏱ Timed' : ''}</div>
                    </div>
                    <span className="agility-chevron">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div className="agility-drill-body">
                      <div className="agility-setup"><strong>Setup:</strong> {drill.setup}</div>
                      <ol className="agility-steps">
                        {drill.steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                      <div className="agility-cue">{drill.cue}</div>
                      <div className="agility-coach-tip">
                        <span className="coach-tip-label">Parent Tip</span>
                        <p>{drill.coachTip}</p>
                      </div>

                      {drill.timed && (
                        <StopwatchSection drillId={drill.id} pastTimes={drillTimes} onSave={saveTime} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'tips' && (
        <div className="speed-tips-grid">
          {SPEED_TIPS.map((t, i) => (
            <div key={i} className="speed-tip-card">
              <span className="speed-tip-icon">{t.icon}</span>
              <p>{t.tip}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'times' && (
        <div className="times-section">
          {Object.keys(times).length === 0 ? (
            <div className="times-empty">
              <span>⏱</span>
              <p>No times recorded yet. Complete a timed drill to start tracking!</p>
            </div>
          ) : (
            Object.entries(times).map(([drillId, entries]) => {
              const drillName = AGILITY_PROGRAMS.flatMap(p => p.drills).find(d => d.id === drillId)?.name || drillId;
              const best = Math.min(...entries.map(e => e.time));
              return (
                <div key={drillId} className="times-card">
                  <h4>{drillName}</h4>
                  <div className="times-best">Best: <strong>{best.toFixed(2)}s</strong></div>
                  <div className="times-list">
                    {entries.slice().reverse().map((e, i) => (
                      <div key={i} className={`time-entry ${e.time === best ? 'best' : ''}`}>
                        <span>{e.date}</span>
                        <span>{e.time.toFixed(2)}s {e.time === best ? '🏆' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function StopwatchSection({ drillId, pastTimes, onSave }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 0.01), 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start() { setElapsed(0); setRunning(true); }
  function stop() { setRunning(false); }
  function save() { if (elapsed > 0) { onSave(drillId, elapsed); setElapsed(0); } }

  const best = pastTimes.length ? Math.min(...pastTimes.map(e => e.time)) : null;

  return (
    <div className="stopwatch">
      <div className="stopwatch-display">{elapsed.toFixed(2)}<span>s</span></div>
      {best !== null && <div className="stopwatch-best">Personal best: {best.toFixed(2)}s</div>}
      <div className="stopwatch-btns">
        {!running
          ? <button className="sw-btn start" onClick={start}>▶ Start</button>
          : <button className="sw-btn stop" onClick={stop}>⏹ Stop</button>
        }
        {!running && elapsed > 0 && <button className="sw-btn save" onClick={save}>💾 Save Time</button>}
        {!running && elapsed > 0 && <button className="sw-btn reset" onClick={() => setElapsed(0)}>↺ Reset</button>}
      </div>
    </div>
  );
}
