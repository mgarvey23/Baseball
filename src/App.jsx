import { useState } from 'react';
import BaseballField from './components/BaseballField';
import DrillLibrary from './components/DrillLibrary';
import PracticePlanner from './components/PracticePlanner';
import ArmHealth from './components/ArmHealth';
import './App.css';

const NAV_ITEMS = [
  { id: 'field',    icon: '🏟️',  label: 'The Field',         component: BaseballField,  live: true },
  { id: 'drills',   icon: '⚾',  label: 'Drill Library',     component: DrillLibrary,   live: true },
  { id: 'practice', icon: '📋',  label: 'Practice Planner',  component: PracticePlanner, live: true },
  { id: 'arm',      icon: '💪',  label: 'Arm Health',        component: ArmHealth,      live: true },
  { id: 'agility',  icon: '⚡',  label: 'Agility & Speed',   component: ComingSoon },
  { id: 'mental',   icon: '🧠',  label: 'Mental Skills',     component: ComingSoon },
  { id: 'rules',    icon: '📖',  label: 'Rules & Knowledge', component: ComingSoon },
  { id: 'progress', icon: '📈',  label: 'Progress Tracker',  component: ComingSoon },
];

function ComingSoon({ label }) {
  return (
    <div className="coming-soon">
      <span className="coming-soon-icon">🚧</span>
      <h2>{label}</h2>
      <p>This feature is coming soon. Build it next!</p>
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState('field');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = NAV_ITEMS.find(n => n.id === activeId);
  const ActiveComponent = active.component;

  return (
    <div className="app">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">⚾</span>
          <div>
            <div className="sidebar-title">Baseball Coach</div>
            <div className="sidebar-sub">Youth Development App</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">FEATURES</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeId === item.id ? 'active' : ''}`}
              onClick={() => { setActiveId(item.id); setSidebarOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label-text">{item.label}</span>
              {!item.live && (
                <span className="nav-badge">Soon</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="player-card">
            <div className="player-avatar">👦</div>
            <div>
              <div className="player-name">Your Player</div>
              <div className="player-age">Age 7 · T-Ball / Coach Pitch</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main">
        {/* Top bar */}
        <header className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div className="topbar-title">
            <span className="topbar-icon">{active.icon}</span>
            {active.label}
          </div>
          <div className="topbar-right">
            <span className="topbar-badge">Age 7</span>
          </div>
        </header>

        {/* Page content */}
        <main className="content">
          <ActiveComponent label={active.label} />
        </main>
      </div>
    </div>
  );
}
