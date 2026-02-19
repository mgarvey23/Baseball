import { useState, useMemo } from 'react';
import { RULES, RULE_CATEGORIES } from '../data/rules';
import './RulesKnowledge.css';

export default function RulesKnowledge() {
  const [activeCategory, setActiveCategory] = useState('basics');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return RULES.filter(r => {
      const matchCat = r.category === activeCategory;
      const matchSearch = !search || r.question.toLowerCase().includes(search.toLowerCase()) || r.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const allFiltered = useMemo(() => {
    if (!search) return [];
    return RULES.filter(r => r.question.toLowerCase().includes(search.toLowerCase()) || r.answer.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const displayRules = search ? allFiltered : filtered;

  if (selected) {
    const rule = RULES.find(r => r.id === selected);
    const cat = RULE_CATEGORIES.find(c => c.id === rule.category);
    return (
      <div className="rules-page">
        <button className="rules-back" onClick={() => setSelected(null)}>← Back</button>
        <div className="rule-detail">
          <div className="rule-detail-cat">{cat?.icon} {cat?.label}</div>
          <div className="rule-emoji">{rule.emoji}</div>
          <h2>{rule.question}</h2>
          <p className="rule-answer">{rule.answer}</p>
          <div className="rule-level-badge level-{rule.level}">
            {'⭐'.repeat(rule.level)} {rule.level === 1 ? 'Beginner' : rule.level === 2 ? 'Intermediate' : 'Advanced'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rules-page">
      <div className="rules-header">
        <h2>Rules & Knowledge</h2>
        <p>Everything your son needs to understand the game — explained for a 7-year-old.</p>
      </div>

      <div className="rules-search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="rules-search"
          placeholder="Search rules and terms..."
          value={search}
          onChange={e => { setSearch(e.target.value); }}
        />
        {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      {!search && (
        <div className="rule-categories">
          {RULE_CATEGORIES.map(cat => (
            <button key={cat.id} className={`rule-cat-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => setActiveCategory(cat.id)}>
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="cat-count">{RULES.filter(r => r.category === cat.id).length}</span>
            </button>
          ))}
        </div>
      )}

      {search && <div className="search-results-label">{displayRules.length} result{displayRules.length !== 1 ? 's' : ''} for "{search}"</div>}

      <div className="rules-grid">
        {displayRules.map(rule => (
          <button key={rule.id} className="rule-card" onClick={() => setSelected(rule.id)}>
            <div className="rule-card-top">
              <span className="rule-card-emoji">{rule.emoji}</span>
              <span className={`rule-level level-${rule.level}`}>{'⭐'.repeat(rule.level)}</span>
            </div>
            <div className="rule-card-question">{rule.question}</div>
            <div className="rule-card-preview">{rule.answer.slice(0, 80)}...</div>
            <span className="rule-card-arrow">→</span>
          </button>
        ))}
        {displayRules.length === 0 && (
          <div className="rules-empty">No rules found. Try a different search.</div>
        )}
      </div>
    </div>
  );
}
