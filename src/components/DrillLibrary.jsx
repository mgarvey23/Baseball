import { useState, useMemo } from 'react';
import { DRILLS, CATEGORIES } from '../data/drills';
import './DrillLibrary.css';

export default function DrillLibrary() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDrill, setSelectedDrill] = useState(null);

  const filtered = useMemo(() => {
    return DRILLS.filter((d) => {
      const matchCat = activeCategory === 'all' || d.category === activeCategory;
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  if (selectedDrill) {
    return <DrillDetail drill={selectedDrill} onBack={() => setSelectedDrill(null)} />;
  }

  return (
    <div className="drill-page">
      <div className="drill-header">
        <h2>Drill Library</h2>
        <p>{DRILLS.length} age 7 drills from research-backed coaching programs</p>
      </div>

      {/* Search */}
      <div className="drill-search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="drill-search"
          type="text"
          placeholder="Search drills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Category filters */}
      <div className="category-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="drill-count">
        {filtered.length === 0
          ? 'No drills match your search'
          : `${filtered.length} drill${filtered.length !== 1 ? 's' : ''}`}
      </div>

      {/* Drill grid */}
      <div className="drill-grid">
        {filtered.map((drill) => (
          <DrillCard key={drill.id} drill={drill} onClick={() => setSelectedDrill(drill)} />
        ))}
      </div>
    </div>
  );
}

function DrillCard({ drill, onClick }) {
  const cat = CATEGORIES.find((c) => c.id === drill.category);
  return (
    <button className="drill-card" onClick={onClick}>
      <div className="drill-card-top">
        <span className="drill-cat-icon">{cat?.icon}</span>
        <span className={`drill-difficulty ${drill.difficulty.toLowerCase()}`}>{drill.difficulty}</span>
      </div>
      <h3 className="drill-card-name">{drill.name}</h3>
      <p className="drill-card-desc">{drill.description}</p>
      <div className="drill-card-footer">
        <span className="drill-meta">⏱ {drill.duration} min</span>
        <span className="drill-meta">🏷 {cat?.label}</span>
        <span className="drill-arrow">→</span>
      </div>
    </button>
  );
}

function DrillDetail({ drill, onBack }) {
  const cat = CATEGORIES.find((c) => c.id === drill.category);

  return (
    <div className="drill-detail">
      <button className="drill-back" onClick={onBack}>← Back to Library</button>

      <div className="detail-header">
        <div className="detail-cat-badge">
          <span>{cat?.icon}</span> {cat?.label}
        </div>
        <h2>{drill.name}</h2>
        <div className="detail-meta-row">
          <span className="detail-meta-chip">⏱ {drill.duration} min</span>
          <span className={`detail-meta-chip difficulty-chip ${drill.difficulty.toLowerCase()}`}>
            {drill.difficulty}
          </span>
        </div>
        <p className="detail-desc">{drill.description}</p>
      </div>

      {/* Equipment */}
      <section className="detail-section">
        <h3>Equipment Needed</h3>
        <div className="equipment-list">
          {drill.equipment.map((item, i) => (
            <span key={i} className="equipment-chip">{item}</span>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="detail-section">
        <h3>How to Do It</h3>
        <ol className="steps-list">
          {drill.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Coaching cues */}
      <section className="detail-section">
        <h3>Coaching Cues</h3>
        <div className="cues-list">
          {drill.coachingCues.map((cue, i) => (
            <div key={i} className="cue-item">
              <span className="cue-quote">"</span>{cue}<span className="cue-quote">"</span>
            </div>
          ))}
        </div>
      </section>

      {/* Parent tip */}
      {drill.parentTip && (
        <div className="parent-tip">
          <div className="parent-tip-label">Parent Tip</div>
          <p>{drill.parentTip}</p>
        </div>
      )}

      {/* Progressions */}
      {drill.progressions && (
        <section className="detail-section">
          <h3>Make It Harder (Progressions)</h3>
          <ul className="progression-list">
            {drill.progressions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
