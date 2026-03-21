import { useState, useCallback } from 'react';
import { POSITIONS, BASES } from '../data/positions';
import { SCENARIOS, BASE_COORDS } from '../data/fieldScenarios';
import './BaseballField.css';

const POSITION_ORDER = [
  'pitcher', 'catcher', 'firstBase', 'secondBase',
  'thirdBase', 'shortstop', 'leftField', 'centerField', 'rightField',
];

/* Shuffle helper */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BaseballField() {
  const [mode, setMode]           = useState('explore'); // 'explore' | 'quiz'
  const [quizFilter, setQuizFilter] = useState('all'); // 'all' | 'baserunning' | 'defense'

  /* Explore state */
  const [selected, setSelected]   = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  /* Quiz state */
  const [queue, setQueue]         = useState([]);
  const [qIdx, setQIdx]           = useState(0);
  const [picked, setPicked]       = useState(null);   // index of chosen answer
  const [score, setScore]         = useState(0);
  const [quizDone, setQuizDone]   = useState(false);

  const selectedPosition = selected ? POSITIONS[selected] : null;

  /* ── Start / restart quiz ─────────────────────────────────────── */
  const startQuiz = useCallback((filter = quizFilter) => {
    const pool = filter === 'all'
      ? SCENARIOS
      : SCENARIOS.filter(s => s.category === filter);
    setQueue(shuffle(pool).slice(0, 10));
    setQIdx(0);
    setPicked(null);
    setScore(0);
    setQuizDone(false);
  }, [quizFilter]);

  function handleFilterChange(f) {
    setQuizFilter(f);
    startQuiz(f);
  }

  /* ── Quiz answer handling ─────────────────────────────────────── */
  function handlePick(choiceIdx) {
    if (picked !== null) return;
    const correct = queue[qIdx].choices[choiceIdx].correct;
    setPicked(choiceIdx);
    if (correct) setScore(s => s + 1);
  }

  function handleNext() {
    if (qIdx + 1 >= queue.length) {
      setQuizDone(true);
    } else {
      setQIdx(i => i + 1);
      setPicked(null);
    }
  }

  const currentScenario = queue[qIdx];

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="field-page">
      <div className="field-header">
        <h2>{mode === 'explore' ? 'The Baseball Field' : 'Field Situation Quiz'}</h2>
        <p>{mode === 'explore'
          ? 'Click any player or base to learn what it is!'
          : 'Read the situation and choose the best play!'}
        </p>
      </div>

      {/* Mode tabs */}
      <div className="field-tabs">
        <button className={`field-tab ${mode === 'explore' ? 'active' : ''}`} onClick={() => setMode('explore')}>
          🗺️ Explore Field
        </button>
        <button className={`field-tab ${mode === 'quiz' ? 'active' : ''}`} onClick={() => {
          setMode('quiz');
          if (queue.length === 0) startQuiz();
        }}>
          🎮 Situation Quiz
        </button>
      </div>

      <div className="field-layout">
        {/* SVG Field */}
        <div className="field-svg-wrapper">
          <svg
            viewBox="0 0 400 380"
            xmlns="http://www.w3.org/2000/svg"
            className="field-svg"
            aria-label="Interactive baseball field diagram"
          >
            <defs>
              <radialGradient id="grassGrad" cx="50%" cy="70%" r="70%">
                <stop offset="0%" stopColor="#4a9e4a" />
                <stop offset="100%" stopColor="#2d7a2d" />
              </radialGradient>
              <radialGradient id="infield" cx="50%" cy="60%" r="45%">
                <stop offset="0%" stopColor="#c8a56e" />
                <stop offset="100%" stopColor="#a0804a" />
              </radialGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Field geometry */}
            <rect x="0" y="0" width="400" height="380" fill="#2d7a2d" />
            <path d="M 30 370 Q 30 20 200 20 Q 370 20 370 370 Z" fill="#b8936a" opacity="0.6" />
            <path d="M 40 370 Q 40 32 200 32 Q 360 32 360 370 Z" fill="url(#grassGrad)" />
            <polygon points="200,155 302,243 200,332 98,243" fill="url(#infield)" />
            <polygon points="200,175 282,243 200,312 118,243" fill="#4a9e4a" opacity="0.5" />
            <line x1="200" y1="345" x2="30" y2="370" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="345" x2="370" y2="370" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <circle cx="200" cy="243" r="14" fill="#c8a56e" stroke="#a0804a" strokeWidth="1.5" />
            <rect x="193" y="241" width="14" height="4" rx="1" fill="#f0f0f0" />
            <line x1="200" y1="332" x2="302" y2="243" stroke="#a0804a" strokeWidth="1" opacity="0.6" />
            <line x1="302" y1="243" x2="200" y2="155" stroke="#a0804a" strokeWidth="1" opacity="0.6" />
            <line x1="200" y1="155" x2="98" y2="243" stroke="#a0804a" strokeWidth="1" opacity="0.6" />
            <line x1="98" y1="243" x2="200" y2="332" stroke="#a0804a" strokeWidth="1" opacity="0.6" />

            {/* Bases */}
            {BASES.map((base) => {
              const isHome = base.id === 'home';
              const isBaseSelected = mode === 'explore' && selected === base.id;
              return (
                <g
                  key={base.id}
                  style={{ cursor: mode === 'explore' ? 'pointer' : 'default' }}
                  onClick={() => mode === 'explore' && setSelected(isBaseSelected ? null : base.id)}
                  onMouseEnter={() => mode === 'explore' && setHoveredId(base.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  filter={isBaseSelected || hoveredId === base.id ? 'url(#glow)' : undefined}
                >
                  {isHome ? (
                    <polygon
                      points={`${base.cx},${base.cy - 9} ${base.cx + 8},${base.cy - 3} ${base.cx + 8},${base.cy + 5} ${base.cx - 8},${base.cy + 5} ${base.cx - 8},${base.cy - 3}`}
                      fill={isBaseSelected ? '#ffe066' : '#f0f0f0'}
                      stroke={isBaseSelected ? '#e6b800' : '#aaa'}
                      strokeWidth="1.5"
                    />
                  ) : (
                    <rect
                      x={base.cx - 8} y={base.cy - 8} width="16" height="16" rx="2"
                      fill={isBaseSelected ? '#ffe066' : '#f0f0f0'}
                      stroke={isBaseSelected ? '#e6b800' : '#aaa'}
                      strokeWidth="1.5"
                      transform={`rotate(45 ${base.cx} ${base.cy})`}
                    />
                  )}
                  {base.id !== 'home' && (
                    <text x={base.cx} y={base.cy + (base.id === 'second' ? -18 : 22)}
                      textAnchor="middle" fontSize="9" fill="white" fontWeight="600"
                      style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                      {base.name}
                    </text>
                  )}
                  {base.id === 'home' && (
                    <text x={base.cx} y={base.cy + 20} textAnchor="middle" fontSize="9" fill="white" fontWeight="600"
                      style={{ pointerEvents: 'none' }}>Home Plate</text>
                  )}
                </g>
              );
            })}

            {/* Players */}
            {POSITION_ORDER.map((posId) => {
              const pos = POSITIONS[posId];
              const isSelected = mode === 'explore' && selected === posId;
              const isHovered  = mode === 'explore' && hoveredId === posId;
              const active     = isSelected || isHovered;
              return (
                <g key={posId}
                  style={{ cursor: mode === 'explore' ? 'pointer' : 'default' }}
                  onClick={() => mode === 'explore' && setSelected(isSelected ? null : posId)}
                  onMouseEnter={() => mode === 'explore' && setHoveredId(posId)}
                  onMouseLeave={() => setHoveredId(null)}
                  filter={active ? 'url(#glow)' : 'url(#shadow)'}
                >
                  {active && <circle cx={pos.cx} cy={pos.cy} r="20" fill="none" stroke={pos.color} strokeWidth="2.5" opacity="0.8" />}
                  <circle cx={pos.cx} cy={pos.cy} r="15" fill={active ? pos.color : `${pos.color}cc`} stroke="white" strokeWidth="2" />
                  <text x={pos.cx} y={pos.cy + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fill="white" fontWeight="700"
                    style={{ pointerEvents: 'none', fontFamily: 'monospace' }}>{pos.number}</text>
                  <text x={pos.cx} y={pos.cy + 26} textAnchor="middle" fontSize="8" fill="white" fontWeight="700"
                    style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,1)', paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.7)', strokeWidth: 3 }}>
                    {pos.abbr}
                  </text>
                </g>
              );
            })}

            {/* Quiz runner overlays */}
            {mode === 'quiz' && !quizDone && currentScenario && currentScenario.runners.map((runner) => {
              const coord = BASE_COORDS[runner.base];
              return (
                <g key={runner.base}>
                  <circle cx={coord.cx} cy={coord.cy} r="13" fill={runner.color} opacity="0.25" className="runner-pulse" />
                  <circle cx={coord.cx} cy={coord.cy} r="9" fill={runner.color} stroke="white" strokeWidth="2" />
                  <text x={coord.cx} y={coord.cy + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fill="white" fontWeight="900" style={{ pointerEvents: 'none' }}>R</text>
                </g>
              );
            })}

            <text x="10" y="375" fontSize="8" fill="rgba(255,255,255,0.5)">
              {mode === 'explore' ? 'Numbers = official scoring position #' : '🟠 R = baserunner'}
            </text>
          </svg>
        </div>

        {/* Right panel */}
        <div className="field-info-panel">
          {mode === 'explore' ? (
            /* ── EXPLORE MODE ── */
            !selected ? (
              <div className="field-info-placeholder">
                <div className="placeholder-icon">⚾</div>
                <h3>Tap a player or base</h3>
                <p>Learn where everyone stands, what their job is, and a cool fact about each position!</p>
                <div className="positions-list">
                  <h4>All 9 Positions</h4>
                  {POSITION_ORDER.map((posId) => {
                    const pos = POSITIONS[posId];
                    return (
                      <button key={posId} className="position-chip"
                        style={{ borderColor: pos.color, color: pos.color }}
                        onClick={() => setSelected(posId)}>
                        <span className="chip-num">#{pos.number}</span>
                        <span className="chip-abbr">{pos.abbr}</span>
                        <span className="chip-name">{pos.name}</span>
                      </button>
                    );
                  })}
                  <h4 style={{ marginTop: '1rem' }}>The Bases</h4>
                  {BASES.map((base) => (
                    <button key={base.id} className="position-chip base-chip" onClick={() => setSelected(base.id)}>
                      {base.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="field-info-card">
                {BASES.find(b => b.id === selected)
                  ? <BaseInfo base={BASES.find(b => b.id === selected)} onClose={() => setSelected(null)} />
                  : <PositionInfo pos={selectedPosition} onClose={() => setSelected(null)} />
                }
              </div>
            )
          ) : (
            /* ── QUIZ MODE ── */
            <QuizPanel
              queue={queue}
              qIdx={qIdx}
              picked={picked}
              score={score}
              quizDone={quizDone}
              quizFilter={quizFilter}
              onPick={handlePick}
              onNext={handleNext}
              onFilterChange={handleFilterChange}
              onRestart={() => startQuiz()}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Quiz Panel ────────────────────────────────────────────────────────── */
function QuizPanel({ queue, qIdx, picked, score, quizDone, quizFilter, onPick, onNext, onFilterChange, onRestart }) {
  if (quizDone) {
    const pct = Math.round((score / queue.length) * 100);
    const grade = pct >= 90 ? { label: 'All-Star! 🌟', color: '#C4A44A' }
                : pct >= 70 ? { label: 'Solid Player! ⚾', color: '#005A9C' }
                : pct >= 50 ? { label: 'Keep Practicing! 💪', color: '#1a78c2' }
                : { label: 'Keep at it! 🏃', color: '#EF3E42' };
    return (
      <div className="quiz-done">
        <div className="quiz-done-icon">🏆</div>
        <h3 className="quiz-done-title">Quiz Complete!</h3>
        <div className="quiz-done-score">{score} / {queue.length}</div>
        <div className="quiz-done-grade" style={{ color: grade.color }}>{grade.label}</div>
        <p className="quiz-done-msg">
          {pct >= 70
            ? 'Great baseball IQ! You know when to run and when to throw.'
            : 'Keep studying the situations — you\'ll get it! Every pro had to learn these too.'}
        </p>
        <button className="quiz-restart-btn" onClick={onRestart}>🔄 Play Again</button>
      </div>
    );
  }

  if (queue.length === 0) return null;
  const s = queue[qIdx];
  const totalQ = queue.length;
  const answered = picked !== null;
  const correctIdx = s.choices.findIndex(c => c.correct);

  return (
    <div className="quiz-panel">
      {/* Filter + progress */}
      <div className="quiz-top-row">
        <div className="quiz-filters">
          {[['all', '⚾ All'], ['baserunning', '🏃 Running'], ['defense', '🌿 Defense']].map(([f, l]) => (
            <button key={f} className={`quiz-filter-btn ${quizFilter === f ? 'active' : ''}`} onClick={() => onFilterChange(f)}>{l}</button>
          ))}
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${((qIdx) / totalQ) * 100}%` }} />
        </div>
        <div className="quiz-score-row">
          <span className="quiz-q-num">Q{qIdx + 1} of {totalQ}</span>
          <span className="quiz-score-badge">⭐ {score}</span>
        </div>
      </div>

      {/* Category tag */}
      <div className={`quiz-category-tag cat-${s.category}`}>{s.categoryLabel}</div>

      {/* Situation */}
      <div className="quiz-situation">
        <div className="quiz-situation-title">{s.title}</div>
        <p className="quiz-situation-text">{s.situation}</p>
        {s.runners.length > 0 && (
          <div className="quiz-runner-legend">
            {s.runners.map((r, i) => (
              <span key={i} className="runner-dot-label" style={{ background: r.color }}>
                Runner on {r.base.charAt(0).toUpperCase() + r.base.slice(1)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Choices */}
      <div className="quiz-choices">
        {s.choices.map((choice, i) => {
          let cls = 'quiz-choice';
          if (answered) {
            if (i === correctIdx) cls += ' correct';
            else if (i === picked && !choice.correct) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button key={i} className={cls} onClick={() => onPick(i)} disabled={answered}>
              <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
              <span className="choice-text">{choice.text}</span>
              {answered && i === correctIdx && <span className="choice-check">✓</span>}
              {answered && i === picked && !choice.correct && <span className="choice-x">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={`quiz-explanation ${picked === correctIdx ? 'correct-exp' : 'wrong-exp'}`}>
          <span className="exp-icon">{picked === correctIdx ? '✅' : '❌'}</span>
          <span>{s.explanation}</span>
        </div>
      )}

      {/* Next */}
      {answered && (
        <button className="quiz-next-btn" onClick={onNext}>
          {qIdx + 1 >= queue.length ? '🏁 See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

/* ── Explore sub-components ─────────────────────────────────────────────── */
function PositionInfo({ pos, onClose }) {
  return (
    <>
      <button className="info-close" onClick={onClose} aria-label="Close">✕</button>
      <div className="info-badge" style={{ background: pos.color }}>
        <span className="info-num">#{pos.number}</span>
        <span className="info-abbr">{pos.abbr}</span>
      </div>
      <h3 className="info-title">{pos.name}</h3>
      <p className="info-description">{pos.description}</p>
      <div className="info-section">
        <h4>Key Skills</h4>
        <ul className="skills-list">
          {pos.keySkills.map((skill, i) => <li key={i}>{skill}</li>)}
        </ul>
      </div>
      <div className="info-fun-fact">
        <span className="fun-fact-label">Fun Fact</span>
        <p>{pos.funFact}</p>
      </div>
    </>
  );
}

function BaseInfo({ base, onClose }) {
  return (
    <>
      <button className="info-close" onClick={onClose} aria-label="Close">✕</button>
      <div className="info-badge base-badge"><span style={{ fontSize: '1.5rem' }}>🏁</span></div>
      <h3 className="info-title">{base.name}</h3>
      <p className="info-description">{base.description}</p>
    </>
  );
}
