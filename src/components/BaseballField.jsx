import { useState } from 'react';
import { POSITIONS, BASES } from '../data/positions';
import './BaseballField.css';

const POSITION_ORDER = [
  'pitcher', 'catcher', 'firstBase', 'secondBase',
  'thirdBase', 'shortstop', 'leftField', 'centerField', 'rightField',
];

export default function BaseballField() {
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const selectedPosition = selected ? POSITIONS[selected] : null;

  return (
    <div className="field-page">
      <div className="field-header">
        <h2>The Baseball Field</h2>
        <p>Click any player or base to learn what it is!</p>
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
            {/* Sky / outfield background */}
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

            {/* Outfield grass */}
            <rect x="0" y="0" width="400" height="380" fill="#2d7a2d" />

            {/* Warning track arc */}
            <path
              d="M 30 370 Q 30 20 200 20 Q 370 20 370 370 Z"
              fill="#b8936a"
              opacity="0.6"
            />

            {/* Outfield grass inside warning track */}
            <path
              d="M 40 370 Q 40 32 200 32 Q 360 32 360 370 Z"
              fill="url(#grassGrad)"
            />

            {/* Infield dirt diamond */}
            <polygon
              points="200,155 302,243 200,332 98,243"
              fill="url(#infield)"
            />

            {/* Infield grass (inner square) */}
            <polygon
              points="200,175 282,243 200,312 118,243"
              fill="#4a9e4a"
              opacity="0.5"
            />

            {/* Foul lines */}
            <line x1="200" y1="345" x2="30" y2="370" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="345" x2="370" y2="370" stroke="white" strokeWidth="1.5" opacity="0.7" />

            {/* Pitcher's mound circle */}
            <circle cx="200" cy="243" r="14" fill="#c8a56e" stroke="#a0804a" strokeWidth="1.5" />
            {/* Pitcher's rubber */}
            <rect x="193" y="241" width="14" height="4" rx="1" fill="#f0f0f0" />

            {/* Base paths */}
            <line x1="200" y1="332" x2="302" y2="243" stroke="#a0804a" strokeWidth="1" opacity="0.6" />
            <line x1="302" y1="243" x2="200" y2="155" stroke="#a0804a" strokeWidth="1" opacity="0.6" />
            <line x1="200" y1="155" x2="98" y2="243" stroke="#a0804a" strokeWidth="1" opacity="0.6" />
            <line x1="98" y1="243" x2="200" y2="332" stroke="#a0804a" strokeWidth="1" opacity="0.6" />

            {/* Bases */}
            {BASES.map((base) => {
              const isHome = base.id === 'home';
              const isBaseSelected = selected === base.id;
              return (
                <g
                  key={base.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(isBaseSelected ? null : base.id)}
                  onMouseEnter={() => setHoveredId(base.id)}
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
                      x={base.cx - 8}
                      y={base.cy - 8}
                      width="16"
                      height="16"
                      rx="2"
                      fill={isBaseSelected ? '#ffe066' : '#f0f0f0'}
                      stroke={isBaseSelected ? '#e6b800' : '#aaa'}
                      strokeWidth="1.5"
                      transform={`rotate(45 ${base.cx} ${base.cy})`}
                    />
                  )}
                  {/* Base label */}
                  {base.id !== 'home' && (
                    <text
                      x={base.cx}
                      y={base.cy + (base.id === 'second' ? -18 : base.id === 'first' ? 22 : 22)}
                      textAnchor="middle"
                      fontSize="9"
                      fill="white"
                      fontWeight="600"
                      style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {base.name}
                    </text>
                  )}
                  {base.id === 'home' && (
                    <text
                      x={base.cx}
                      y={base.cy + 20}
                      textAnchor="middle"
                      fontSize="9"
                      fill="white"
                      fontWeight="600"
                      style={{ pointerEvents: 'none' }}
                    >
                      Home Plate
                    </text>
                  )}
                </g>
              );
            })}

            {/* Players */}
            {POSITION_ORDER.map((posId) => {
              const pos = POSITIONS[posId];
              const isSelected = selected === posId;
              const isHovered = hoveredId === posId;
              const active = isSelected || isHovered;

              return (
                <g
                  key={posId}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(isSelected ? null : posId)}
                  onMouseEnter={() => setHoveredId(posId)}
                  onMouseLeave={() => setHoveredId(null)}
                  filter={active ? 'url(#glow)' : 'url(#shadow)'}
                >
                  {/* Outer ring when active */}
                  {active && (
                    <circle
                      cx={pos.cx}
                      cy={pos.cy}
                      r="20"
                      fill="none"
                      stroke={pos.color}
                      strokeWidth="2.5"
                      opacity="0.8"
                    />
                  )}
                  {/* Player circle */}
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r="15"
                    fill={active ? pos.color : `${pos.color}cc`}
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Jersey number */}
                  <text
                    x={pos.cx}
                    y={pos.cy + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="white"
                    fontWeight="700"
                    style={{ pointerEvents: 'none', fontFamily: 'monospace' }}
                  >
                    {pos.number}
                  </text>
                  {/* Position label below circle */}
                  <text
                    x={pos.cx}
                    y={pos.cy + 26}
                    textAnchor="middle"
                    fontSize="8"
                    fill="white"
                    fontWeight="700"
                    style={{
                      pointerEvents: 'none',
                      textShadow: '0 1px 3px rgba(0,0,0,1)',
                      paintOrder: 'stroke',
                      stroke: 'rgba(0,0,0,0.7)',
                      strokeWidth: 3,
                    }}
                  >
                    {pos.abbr}
                  </text>
                </g>
              );
            })}

            {/* Position number legend label */}
            <text x="10" y="375" fontSize="8" fill="rgba(255,255,255,0.5)">
              Numbers = official scoring position #
            </text>
          </svg>
        </div>

        {/* Info Panel */}
        <div className="field-info-panel">
          {!selected ? (
            <div className="field-info-placeholder">
              <div className="placeholder-icon">⚾</div>
              <h3>Tap a player or base</h3>
              <p>Learn where everyone stands, what their job is, and a cool fact about each position!</p>

              <div className="positions-list">
                <h4>All 9 Positions</h4>
                {POSITION_ORDER.map((posId) => {
                  const pos = POSITIONS[posId];
                  return (
                    <button
                      key={posId}
                      className="position-chip"
                      style={{ borderColor: pos.color, color: pos.color }}
                      onClick={() => setSelected(posId)}
                    >
                      <span className="chip-num">#{pos.number}</span>
                      <span className="chip-abbr">{pos.abbr}</span>
                      <span className="chip-name">{pos.name}</span>
                    </button>
                  );
                })}

                <h4 style={{ marginTop: '1rem' }}>The Bases</h4>
                {BASES.map((base) => (
                  <button
                    key={base.id}
                    className="position-chip base-chip"
                    onClick={() => setSelected(base.id)}
                  >
                    {base.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="field-info-card">
              {/* Check if it's a base or a position */}
              {BASES.find(b => b.id === selected) ? (
                <BaseInfo base={BASES.find(b => b.id === selected)} onClose={() => setSelected(null)} />
              ) : (
                <PositionInfo pos={selectedPosition} onClose={() => setSelected(null)} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
          {pos.keySkills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
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
      <div className="info-badge base-badge">
        <span style={{ fontSize: '1.5rem' }}>🏁</span>
      </div>
      <h3 className="info-title">{base.name}</h3>
      <p className="info-description">{base.description}</p>
    </>
  );
}
