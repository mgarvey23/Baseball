import { useState, useEffect, useRef } from 'react';
import { MINDSET_FLIPS, BREATHING_STEPS, SELF_TALK, PRE_PRACTICE_ROUTINE } from '../data/mentalSkills';
import './MentalSkills.css';

const TABS = [
  { id: 'mindset',   label: 'Growth Mindset' },
  { id: 'breathing', label: 'Breathing' },
  { id: 'selftalk',  label: 'Self-Talk' },
  { id: 'routine',   label: 'Routine' },
  { id: 'reel',      label: 'Highlight Reel' },
];

export default function MentalSkills() {
  const [tab, setTab] = useState('mindset');

  return (
    <div className="mental-page">
      <div className="mental-header">
        <h2>Mental Skills</h2>
        <p>Baseball is 70% mental. Train your mind like you train your arm.</p>
      </div>

      <div className="mental-tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`mental-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'mindset'   && <MindsetFlips />}
      {tab === 'breathing' && <BreathingExercise />}
      {tab === 'selftalk'  && <SelfTalkCards />}
      {tab === 'routine'   && <PrePracticeRoutine />}
      {tab === 'reel'      && <HighlightReel />}
    </div>
  );
}

// ── Growth Mindset Flip Cards ────────────────────────────────────────────────
function MindsetFlips() {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="mindset-section">
      <div className="section-intro">
        <h3>Flip the Script</h3>
        <p>Tap a card to turn a fixed mindset thought into a growth mindset one. Research shows this reframing builds resilience faster than positive reinforcement alone.</p>
      </div>
      <div className="flip-grid">
        {MINDSET_FLIPS.map((m, i) => {
          const isFlipped = flipped[i];
          return (
            <div key={i} className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}>
              <div className="flip-card-inner">
                <div className="flip-front">
                  <span className="flip-tag">{m.tag}</span>
                  <p className="flip-thought">{m.negative}</p>
                  <span className="flip-hint">Tap to flip →</span>
                </div>
                <div className="flip-back">
                  <span className="flip-tag positive">Growth Mindset</span>
                  <p className="flip-thought">{m.positive}</p>
                  <span className="flip-hint">← Tap to go back</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Breathing Exercise ────────────────────────────────────────────────────────
function BreathingExercise() {
  const [phase, setPhase] = useState(null); // null = idle, 0/1/2 = step index
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const timerRef = useRef(null);

  function start() { setPhase(0); setCount(BREATHING_STEPS[0].count); setRounds(0); }
  function stop()  { clearInterval(timerRef.current); setPhase(null); setCount(0); }

  useEffect(() => {
    if (phase === null) return;
    timerRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          // advance phase
          const next = (phase + 1) % BREATHING_STEPS.length;
          setPhase(next);
          if (next === 0) setRounds(r => r + 1);
          return BREATHING_STEPS[next].count;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const current = phase !== null ? BREATHING_STEPS[phase] : null;

  return (
    <div className="breathing-section">
      <div className="section-intro">
        <h3>4-7-8 Breathing</h3>
        <p>Used by elite athletes before high-pressure moments. Activates the parasympathetic nervous system — calms nerves in under 60 seconds. Use before an at-bat, before pitching, or when feeling overwhelmed.</p>
      </div>

      <div className="breath-circle-wrap">
        <div className={`breath-circle ${phase !== null ? 'active' : ''}`} style={{ borderColor: current?.color || '#e2e8f0' }}>
          {phase === null ? (
            <>
              <div className="breath-idle-num">4·7·8</div>
              <div className="breath-idle-label">Ready</div>
            </>
          ) : (
            <>
              <div className="breath-count" style={{ color: current.color }}>{count}</div>
              <div className="breath-phase-label" style={{ color: current.color }}>{current.label}</div>
            </>
          )}
        </div>
        {rounds > 0 && <div className="breath-rounds">Rounds completed: {rounds}</div>}
      </div>

      {current && <p className="breath-instruction">{current.instruction}</p>}

      <div className="breath-btns">
        {phase === null
          ? <button className="breath-btn start" onClick={start}>▶ Start Breathing</button>
          : <button className="breath-btn stop" onClick={stop}>⏹ Stop</button>
        }
      </div>

      <div className="breath-steps">
        {BREATHING_STEPS.map((s, i) => (
          <div key={i} className={`breath-step ${phase === i ? 'active' : ''}`} style={{ borderColor: s.color }}>
            <span className="breath-step-count" style={{ color: s.color }}>{s.count}s</span>
            <span className="breath-step-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Self-Talk Cards ──────────────────────────────────────────────────────────
function SelfTalkCards() {
  return (
    <div className="selftalk-section">
      <div className="section-intro">
        <h3>Game-Time Self-Talk</h3>
        <p>These aren't just feel-good phrases — they're mental cues that redirect attention from anxiety to execution. Pick 1–2 and memorize them before games.</p>
      </div>
      <div className="selftalk-grid">
        {SELF_TALK.map((s, i) => (
          <div key={i} className="selftalk-card">
            <span className="selftalk-icon">{s.icon}</span>
            <div className="selftalk-phrase">"{s.phrase.replace(/"/g, '')}"</div>
            <div className="selftalk-use">Use when: {s.use}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pre-Practice Routine ─────────────────────────────────────────────────────
function PrePracticeRoutine() {
  const [checked, setChecked] = useState({});

  return (
    <div className="routine-section">
      <div className="section-intro">
        <h3>Pre-Practice Routine</h3>
        <p>Consistent pre-practice routines reduce anxiety and improve focus. Check each step before you practice or play a game.</p>
      </div>
      <div className="routine-list">
        {PRE_PRACTICE_ROUTINE.map(item => (
          <button key={item.id} className={`routine-item ${checked[item.id] ? 'done' : ''}`} onClick={() => setChecked(c => ({ ...c, [item.id]: !c[item.id] }))}>
            <span className="routine-icon">{item.icon}</span>
            <div className="routine-text">
              <div className="routine-step">{item.step}</div>
              <div className="routine-time">{item.time}</div>
            </div>
            <span className="routine-check">{checked[item.id] ? '✓' : ''}</span>
          </button>
        ))}
      </div>
      {Object.values(checked).filter(Boolean).length === PRE_PRACTICE_ROUTINE.length && (
        <div className="routine-complete">🎉 Ready to play your best!</div>
      )}
    </div>
  );
}

// ── Highlight Reel Journal ───────────────────────────────────────────────────
function HighlightReel() {
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('bb-highlight-reel') || '[]'));
  const [form, setForm] = useState({ date: new Date().toLocaleDateString(), h1: '', h2: '', h3: '' });
  const [adding, setAdding] = useState(false);

  function save() {
    if (!form.h1.trim()) return;
    const updated = [{ ...form, id: Date.now() }, ...entries].slice(0, 30);
    setEntries(updated);
    localStorage.setItem('bb-highlight-reel', JSON.stringify(updated));
    setForm({ date: new Date().toLocaleDateString(), h1: '', h2: '', h3: '' });
    setAdding(false);
  }

  return (
    <div className="reel-section">
      <div className="section-intro">
        <h3>Highlight Reel</h3>
        <p>After every practice or game, log 3 things that went well. Research shows this builds confidence faster than focusing on mistakes — baseball has a 70% failure rate at elite levels. Winning the mental game means remembering the good.</p>
      </div>

      {!adding ? (
        <button className="reel-add-btn" onClick={() => setAdding(true)}>+ Log Today's Highlights</button>
      ) : (
        <div className="reel-form">
          <div className="reel-form-header">Today's Highlights</div>
          {['h1', 'h2', 'h3'].map((key, i) => (
            <input
              key={key}
              className="reel-input"
              placeholder={`Highlight #${i + 1}${i > 0 ? ' (optional)' : ''}`}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            />
          ))}
          <div className="reel-form-actions">
            <button className="reel-save-btn" onClick={save}>Save</button>
            <button className="reel-cancel-btn" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="reel-entries">
        {entries.length === 0 && !adding && (
          <div className="reel-empty"><p>No highlights yet. Log your first one after practice!</p></div>
        )}
        {entries.map(e => (
          <div key={e.id} className="reel-entry">
            <div className="reel-entry-date">{e.date}</div>
            {[e.h1, e.h2, e.h3].filter(Boolean).map((h, i) => (
              <div key={i} className="reel-entry-item">
                <span className="reel-star">⭐</span> {h}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
