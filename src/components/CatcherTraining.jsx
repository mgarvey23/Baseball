import { useState } from 'react';
import './CatcherTraining.css';

const TABS = [
  { id: 'gear',      icon: '🥅', label: 'The Gear' },
  { id: 'stance',    icon: '🦵', label: 'Stance' },
  { id: 'receiving', icon: '🧤', label: 'Receiving' },
  { id: 'blocking',  icon: '🛡️', label: 'Blocking' },
  { id: 'throwing',  icon: '💪', label: 'Throwing' },
  { id: 'field',     icon: '🧠', label: 'Field IQ' },
  { id: 'drills',    icon: '⚾', label: 'Drills' },
];

const GEAR_ITEMS = [
  {
    name: 'Helmet & Mask',
    icon: '⛑️',
    description: 'The most important piece. Protects your head and face from fastballs and foul tips. Always wear it — no exceptions.',
    tips: ['Make sure it fits snug — not too loose, not too tight', 'Mask goes on BEFORE you get behind the plate', 'Check the padding inside regularly for wear'],
  },
  {
    name: 'Chest Protector',
    icon: '🛡️',
    description: 'Covers your chest and stomach. Wild pitches and foul balls hit hard — this keeps you safe.',
    tips: ['Should cover from collarbone to waist', 'Adjust the straps so it doesn\'t shift when you move', 'Always wear your cup underneath'],
  },
  {
    name: 'Shin Guards',
    icon: '🦵',
    description: 'Protects your knees and shins from bouncing balls and foul tips off the bat.',
    tips: ['Straps go on the OUTSIDE of your leg', 'Knee flaps should cover the kneecap completely', 'Break them in before game day — wear during practice'],
  },
  {
    name: 'Catcher\'s Mitt',
    icon: '🧤',
    description: 'Bigger and more padded than a fielder\'s glove. Designed to handle fastballs without hurting your hand.',
    tips: ['Break it in by playing catch every day', 'Keep the pocket deep so balls don\'t pop out', 'Oil it lightly and wrap it in a ball when stored'],
  },
];

const STANCE_ITEMS = [
  {
    title: 'Primary Stance (Signs)',
    icon: '🧘',
    when: 'When giving signs to the pitcher with no runners on base',
    steps: [
      'Squat down low — weight balanced on the balls of your feet',
      'Knees out wide for a wide, stable base',
      'Back straight, chest forward, mitt resting on your left knee',
      'Throwing hand hidden behind your right leg (so the other team can\'t see the signs!)',
      'Put your fingers between your thighs to signal the pitch',
    ],
    cue: 'Low, wide, and hidden. Like a frog ready to jump!',
  },
  {
    title: 'Secondary Stance (Receiving)',
    icon: '⚡',
    when: 'When the pitcher is about to throw — ready to receive and react',
    steps: [
      'Rise up slightly from the primary stance — hips just above the knees',
      'Weight on the BALLS of your feet, heels slightly off the ground',
      'Mitt out in front of you as a clear target for the pitcher',
      'Throwing hand BEHIND the mitt or curled in a loose fist to protect fingers',
      'Stay relaxed — tense muscles react slower',
    ],
    cue: 'Athletic, light, and springy. Like you\'re about to take off!',
  },
];

const RECEIVING_STEPS = [
  {
    title: 'Give a Big, Clear Target',
    icon: '🎯',
    detail: 'Hold your mitt in the middle of the strike zone before the pitch. Don\'t move it until the last second — a steady target helps the pitcher aim.',
    tip: 'Keep your elbow slightly bent. A stiff arm will get tired and wobble.',
  },
  {
    title: 'Soft Hands — Catch, Don\'t Stab',
    icon: '🤲',
    detail: 'Let the ball come to you and absorb it softly. Catching is like catching an egg, not slapping a fly. Reach out slightly and pull the glove back as the ball arrives.',
    tip: 'Practice with a soft foam ball first to feel how "quiet" hands work.',
  },
  {
    title: 'Framing — Steal Strikes',
    icon: '🖼️',
    detail: 'A pitch on the edge of the strike zone can look like a strike OR a ball depending on where you catch it. Catch the ball and HOLD it for a split second while pulling it slightly toward the center of the zone — this is framing.',
    tip: 'Never jerk the glove. Smooth, slight movements. The umpire is watching.',
  },
  {
    title: 'Two Hands on Catchable Pitches',
    icon: '👐',
    detail: 'Once the ball is in your glove, close your throwing hand around it immediately. This stops the ball from popping out AND gets you ready to throw faster.',
    tip: 'Keep your throwing hand behind the mitt until the very last moment on wild pitches.',
  },
];

const BLOCKING_STEPS = [
  {
    step: 1,
    title: 'Read the Pitch Early',
    icon: '👁️',
    detail: 'Watch the pitcher\'s release point. A ball that bounces in the dirt needs you to react before it bounces, not after. The key is seeing it early.',
  },
  {
    step: 2,
    title: 'Drop to Your Knees',
    icon: '⬇️',
    detail: 'Drop BOTH knees to the ground simultaneously. Don\'t catch it — BLOCK it. Your goal is to keep the ball in front of you, not necessarily catch it.',
  },
  {
    step: 3,
    title: 'Chin Down, Body Forward',
    icon: '🛡️',
    detail: 'Drop your chin to your chest — this keeps the ball from bouncing off your mask and over your head. Lean forward slightly so the ball bounces DOWN in front of you.',
  },
  {
    step: 4,
    title: 'Angle Your Body',
    icon: '📐',
    detail: 'On balls in the dirt to either side, angle your body toward the ball. Don\'t just reach — move your whole body to get in front of it.',
  },
  {
    step: 5,
    title: 'Find the Ball & Secure It',
    icon: '🔍',
    detail: 'After blocking, immediately look for the ball. If runners are on base, pounce on it quickly. If bases are empty, take your time and get a good grip.',
  },
];

const THROWING_STEPS = [
  {
    title: 'Footwork First',
    icon: '👟',
    detail: 'Good throws start with your feet. As you catch the ball, step toward your target with your right foot (rightie) — this turns your hips toward 2nd base and powers the throw.',
    cue: 'Catch, shuffle, throw. Fast feet = fast throw.',
  },
  {
    title: 'Quick Exchange',
    icon: '🔄',
    detail: 'Get the ball out of your glove FAST. Practice taking the ball from your mitt in one smooth motion — no fumbling. This is called your "exchange."',
    cue: 'Grip across the seams. Four-seam grip gives you the straightest throw.',
  },
  {
    title: 'Strong, Compact Throw',
    icon: '💪',
    detail: 'Throw with a short, powerful arm action — not a long windmill. Keep your elbow up, snap your wrist, and throw to the BASE, not the fielder\'s glove.',
    cue: 'Aim for the front of the base. Low throw = harder to field and tag.',
  },
  {
    title: 'Pop Time Goal',
    icon: '⏱️',
    detail: 'Pop time is from when the ball hits your mitt to when it reaches 2nd base. MLB catchers are under 2.0 seconds. Youth goals: under 2.5 seconds is excellent for age 7!',
    cue: 'Practice the exchange every day without throwing. Speed comes from reps.',
  },
];

const FIELD_IQ = [
  { title: 'You\'re the Captain', icon: '🎖️', detail: 'The catcher sees the whole field. You\'re in charge of communicating on defense. Call out "Two down!" when there are 2 outs. Tell your fielders where to throw. You\'re the quarterback.' },
  { title: 'Calling Pitches', icon: '🤫', detail: 'For age 7, keep it simple: 1 finger = fastball, 2 fingers = slow pitch. Place your hand between your thighs so only the pitcher can see. Change the signs if you think the other team is peeking.' },
  { title: 'Pop-Ups Are Yours', icon: '☀️', detail: 'Any pop-up you can reach, you take. Call "Mine! Mine!" loudly. You come FORWARD toward the field — the spin on the ball pulls it back toward you. Circle under it.' },
  { title: 'Covering Home Plate', icon: '🏠', detail: 'When a runner is scoring, stand just in front of home plate until you catch the throw. Only then do you block the plate. Never block it without the ball — that\'s interference.' },
  { title: 'Back Up 1st Base', icon: '↗️', detail: 'On most ground balls with no runners on, hustle up the first base line to back up the throw. If the first baseman drops it, you\'re there to stop it from rolling away.' },
  { title: 'Talk to Your Pitcher', icon: '💬', detail: 'After a bad pitch or a strikeout, walk out to the mound and say something encouraging. "You\'ve got this!" Catchers protect their pitcher\'s confidence. You\'re a team.' },
];

const CATCHER_DRILLS = [
  {
    name: 'Wall Blocking',
    icon: '🧱',
    duration: 8,
    equipment: ['Ball', 'Wall or fence', 'Catcher\'s gear'],
    steps: [
      'Put on full gear and kneel 3 feet from a wall.',
      'Have a coach roll or bounce balls into the dirt in front of you.',
      'Practice dropping and blocking — keep the ball from hitting the wall.',
      'Focus on chin-down and forward-lean technique.',
    ],
    coachingCue: 'Body big, chin down. Smother that ball!',
    parentTip: 'Do this drill BEFORE every practice. 10 blocks each side. This one skill can save multiple runs per game.',
  },
  {
    name: 'Bare-Hand Exchange Drill',
    icon: '🤲',
    duration: 5,
    equipment: ['Baseball', 'Catcher\'s mitt'],
    steps: [
      'Sit or stand — no throwing needed for this drill.',
      'Receive a slow toss in your mitt.',
      'Practice moving the ball from mitt to throwing hand as fast as possible.',
      'Count how many seconds the exchange takes. Try to get faster each rep.',
    ],
    coachingCue: 'Two-finger grip on the seams every time. No peeking!',
    parentTip: 'Do 20 exchanges daily. This is the single biggest factor in pop time. Watch MLB catchers on YouTube — notice how fast their exchange is.',
  },
  {
    name: 'Framing Target Practice',
    icon: '🎯',
    duration: 8,
    equipment: ['Batting tee or zone mat', 'Pitching machine or coach', 'Gear'],
    steps: [
      'Have a coach throw pitches to the edge of the strike zone.',
      'Catch the pitch and hold it for 2 seconds — don\'t move the glove.',
      'For edge pitches only, practice a SMOOTH small pull toward the center.',
      'Ask a second adult to watch from the umpire position and give feedback.',
    ],
    coachingCue: 'Present the pitch. Sell the strike.',
    parentTip: 'Only work on framing for 10-15 minutes max. Too much can create bad habits. Quality reps over quantity.',
  },
  {
    name: 'Pop-Up Circles',
    icon: '🔄',
    duration: 6,
    equipment: ['Tennis ball', 'Mask'],
    steps: [
      'Have a coach throw or hit a pop-up straight above the catcher.',
      'Remove your mask, toss it AWAY from where you\'re going (don\'t drop it at your feet!).',
      'Circle under the ball — remember it drifts back toward the field.',
      'Catch with two hands using soft hands.',
    ],
    coachingCue: 'Mask away, circle, steady. Two hands!',
    parentTip: 'Use a tennis ball to start — less intimidating than a baseball when learning to look up. Graduate to a baseball once they\'re comfortable.',
  },
  {
    name: 'Throw-Down to 2nd',
    icon: '🎯',
    duration: 10,
    equipment: ['Baseball', 'Full gear', 'Another player at 2nd base'],
    steps: [
      'Get in full secondary stance behind the plate.',
      'Coach calls "Go!" and soft-tosses the ball into the mitt.',
      'Catch, exchange quickly, step right foot toward 2nd, and throw.',
      'Time the pop time with a stopwatch — track improvement over weeks.',
    ],
    coachingCue: 'Feet first! Good feet = good throws.',
    parentTip: 'Track pop times in a notebook. Watching improvement is motivating. Don\'t just throw hard — work on the exchange first, speed will come naturally.',
  },
  {
    name: 'Tag Play Drill',
    icon: '🏠',
    duration: 8,
    equipment: ['Baseball', 'Full gear', 'Base or mat for home plate'],
    steps: [
      'Catcher kneels or stands at home plate.',
      'Coach throws from the outfield while another player runs home from 3rd.',
      'Catch the throw, create a firm, low tag position at the base of the plate.',
      'Make the tag — don\'t reach for the runner, let them come to you.',
    ],
    coachingCue: 'Ball first, then tag. Always.',
    parentTip: 'Never let a young catcher block the plate without the ball in hand — teach legal plate coverage from the start. Safety first!',
  },
];

export default function CatcherTraining() {
  const [activeTab, setActiveTab] = useState('gear');
  const [expandedDrill, setExpandedDrill] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});

  function toggleStep(drillName, stepIdx) {
    const key = `${drillName}-${stepIdx}`;
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="catcher-page">
      <div className="catcher-header">
        <div className="catcher-header-icon">🥅</div>
        <div>
          <h2>Catcher Training</h2>
          <p>The catcher is the most important player on the field. Learn the fundamentals!</p>
        </div>
      </div>

      {/* Hero fact */}
      <div className="catcher-hero-fact">
        <span className="hero-fact-icon">⭐</span>
        <span>The catcher is called the "Field General" — they see the entire field, call pitches, lead the defense, and keep everyone focused. It\'s the hardest and most rewarding position in baseball!</span>
      </div>

      {/* Tabs */}
      <div className="catcher-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`catcher-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="ct-icon">{t.icon}</span>
            <span className="ct-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── GEAR TAB ─────────────────────────────────────────────── */}
      {activeTab === 'gear' && (
        <div className="catcher-content">
          <div className="section-intro">
            <h3>The Catcher's Toolkit</h3>
            <p>Catchers wear more equipment than any other player. Each piece has a job — learn what it does and how to wear it right.</p>
          </div>
          <div className="gear-grid">
            {GEAR_ITEMS.map(item => (
              <div key={item.name} className="gear-card">
                <div className="gear-card-icon">{item.icon}</div>
                <h4 className="gear-card-name">{item.name}</h4>
                <p className="gear-card-desc">{item.description}</p>
                <div className="gear-tips">
                  {item.tips.map((tip, i) => (
                    <div key={i} className="gear-tip">
                      <span className="gear-tip-dot">▸</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="catcher-rule-box">
            <span className="rule-box-icon">⚠️</span>
            <span>Golden Rule: <strong>Never go behind the plate without full gear on.</strong> Even in practice. One foul tip without a mask can end your season. Gear up first, play second.</span>
          </div>
        </div>
      )}

      {/* ── STANCE TAB ───────────────────────────────────────────── */}
      {activeTab === 'stance' && (
        <div className="catcher-content">
          <div className="section-intro">
            <h3>Two Stances to Master</h3>
            <p>A great catcher uses different stances depending on the situation. Get these right and everything else gets easier.</p>
          </div>
          <div className="stance-cards">
            {STANCE_ITEMS.map(s => (
              <div key={s.title} className="stance-card">
                <div className="stance-card-top">
                  <span className="stance-icon">{s.icon}</span>
                  <div>
                    <h4 className="stance-title">{s.title}</h4>
                    <div className="stance-when">Used when: {s.when}</div>
                  </div>
                </div>
                <ol className="stance-steps">
                  {s.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <div className="stance-cue">
                  <span className="cue-label">Coach Cue</span>
                  <span>"{s.cue}"</span>
                </div>
              </div>
            ))}
          </div>
          <div className="catcher-tip-box">
            <span className="tip-icon">🔬</span>
            <span>Research tip: Proper squat mechanics prevent knee injuries. Keep your weight distributed evenly and don't lock your knees. Build leg strength with wall sits and bodyweight squats.</span>
          </div>
        </div>
      )}

      {/* ── RECEIVING TAB ────────────────────────────────────────── */}
      {activeTab === 'receiving' && (
        <div className="catcher-content">
          <div className="section-intro">
            <h3>Receiving: Catching Every Pitch</h3>
            <p>Receiving is the art of making every pitch look as good as possible. Great receivers steal extra strikes for their pitcher every single game.</p>
          </div>
          <div className="receiving-steps">
            {RECEIVING_STEPS.map((step, i) => (
              <div key={i} className="receiving-card">
                <div className="receiving-num">{i + 1}</div>
                <div className="receiving-body">
                  <div className="receiving-title-row">
                    <span className="receiving-icon">{step.icon}</span>
                    <h4 className="receiving-title">{step.title}</h4>
                  </div>
                  <p className="receiving-detail">{step.detail}</p>
                  <div className="receiving-tip">
                    <span className="rec-tip-label">💡 Tip</span>
                    <span>{step.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BLOCKING TAB ─────────────────────────────────────────── */}
      {activeTab === 'blocking' && (
        <div className="catcher-content">
          <div className="section-intro">
            <h3>Blocking: Stop the Ball!</h3>
            <p>Every time you block a ball in the dirt with runners on base, you potentially save a run. This is one of the most team-impacting skills in baseball.</p>
          </div>

          <div className="blocking-rule-card">
            <div className="blocking-rule-icon">🎯</div>
            <div>
              <strong>The #1 Blocking Rule:</strong>
              <p>You don't have to CATCH it — you just have to STOP it. A blocked ball that bounces 2 feet in front of you is a WIN.</p>
            </div>
          </div>

          <div className="blocking-steps">
            {BLOCKING_STEPS.map(s => (
              <div key={s.step} className="blocking-step">
                <div className="blocking-step-num">{s.step}</div>
                <div className="blocking-step-body">
                  <div className="blocking-step-title-row">
                    <span>{s.icon}</span>
                    <h4>{s.title}</h4>
                  </div>
                  <p>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="catcher-tip-box">
            <span className="tip-icon">💪</span>
            <span>Body Language matters! A catcher who blocks everything gives the pitcher confidence to throw in the dirt. Your pitcher will throw more strikes if they trust you behind the plate.</span>
          </div>
        </div>
      )}

      {/* ── THROWING TAB ─────────────────────────────────────────── */}
      {activeTab === 'throwing' && (
        <div className="catcher-content">
          <div className="section-intro">
            <h3>Throwing: Gunning Down Runners</h3>
            <p>A strong, quick throw to 2nd base is one of the most exciting plays in baseball. It starts with your feet and ends with your technique.</p>
          </div>
          <div className="throwing-steps">
            {THROWING_STEPS.map((step, i) => (
              <div key={i} className="throwing-card">
                <div className="throwing-card-icon">{step.icon}</div>
                <div className="throwing-card-body">
                  <h4 className="throwing-card-title">{step.title}</h4>
                  <p className="throwing-card-detail">{step.detail}</p>
                  <div className="throwing-cue">
                    <span className="throw-cue-label">⚡ Cue</span>
                    <span>"{step.cue}"</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pop-time-chart">
            <div className="pop-chart-title">Pop Time Reference (Age 7–8)</div>
            <div className="pop-chart-rows">
              {[
                { label: 'Under 2.2s', grade: 'Elite 🌟', color: '#C4A44A' },
                { label: '2.2 – 2.5s', grade: 'Great ⚾', color: '#005A9C' },
                { label: '2.5 – 2.8s', grade: 'Good 💪', color: '#1a78c2' },
                { label: 'Over 2.8s',  grade: 'Keep Working 🏃', color: '#8a9ab5' },
              ].map(r => (
                <div key={r.label} className="pop-chart-row">
                  <span className="pop-time">{r.label}</span>
                  <span className="pop-grade" style={{ color: r.color }}>{r.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FIELD IQ TAB ─────────────────────────────────────────── */}
      {activeTab === 'field' && (
        <div className="catcher-content">
          <div className="section-intro">
            <h3>Catcher's Field IQ</h3>
            <p>Being a great catcher isn't just about physical skills — it's about using your brain. You're the coach on the field.</p>
          </div>
          <div className="field-iq-grid">
            {FIELD_IQ.map(item => (
              <div key={item.title} className="field-iq-card">
                <div className="field-iq-icon">{item.icon}</div>
                <h4 className="field-iq-title">{item.title}</h4>
                <p className="field-iq-detail">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DRILLS TAB ───────────────────────────────────────────── */}
      {activeTab === 'drills' && (
        <div className="catcher-content">
          <div className="section-intro">
            <h3>Catcher-Specific Drills</h3>
            <p>These drills target exactly what catchers need. Do a few each practice and watch the improvement week over week.</p>
          </div>
          <div className="catcher-drills-list">
            {CATCHER_DRILLS.map(drill => {
              const isOpen = expandedDrill === drill.name;
              const allChecked = drill.steps.every((_, i) => checkedSteps[`${drill.name}-${i}`]);
              return (
                <div key={drill.name} className={`cd-card ${isOpen ? 'open' : ''}`}>
                  <button className="cd-header" onClick={() => setExpandedDrill(isOpen ? null : drill.name)}>
                    <span className="cd-icon">{drill.icon}</span>
                    <div className="cd-header-info">
                      <span className="cd-name">{drill.name}</span>
                      <span className="cd-meta">{drill.duration} min · {drill.equipment[0]}</span>
                    </div>
                    {allChecked && <span className="cd-complete">✓ Done</span>}
                    <span className="cd-chevron">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div className="cd-body">
                      <div className="cd-equipment">
                        <span className="cd-eq-label">Equipment</span>
                        {drill.equipment.map((e, i) => (
                          <span key={i} className="cd-eq-tag">{e}</span>
                        ))}
                      </div>

                      <div className="cd-steps">
                        <div className="cd-steps-label">Steps</div>
                        {drill.steps.map((step, i) => {
                          const key = `${drill.name}-${i}`;
                          return (
                            <label key={i} className={`cd-step-row ${checkedSteps[key] ? 'checked' : ''}`}>
                              <input
                                type="checkbox"
                                className="cd-checkbox"
                                checked={!!checkedSteps[key]}
                                onChange={() => toggleStep(drill.name, i)}
                              />
                              <span className="cd-step-text">{step}</span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="cd-cue-box">
                        <span className="cd-cue-label">⚡ Coach Cue</span>
                        <span>"{drill.coachingCue}"</span>
                      </div>

                      <div className="cd-parent-tip">
                        <span className="cd-parent-icon">👨</span>
                        <div>
                          <span className="cd-parent-label">Parent Tip</span>
                          <p>{drill.parentTip}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
