import React, { useState } from 'react';
import { MapPin, Briefcase, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';
import PlanViewer from '../components/PlanViewer';

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [budget, setBudget] = useState('');
  const [planData, setPlanData] = useState(null);

  const [ideaSource, setIdeaSource] = useState('suggest'); // 'suggest' or 'custom'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSuggestions = async () => {
    if (!location) {
      setError('Please enter a location/area before proceeding.');
      return;
    }
    setError('');
    setIdeaSource('suggest');
    setSelectedSuggestion('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/suggest-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });
      const data = await response.json();

      if (response.ok) {
        setSuggestions(data.suggestions);
        setStep(2);
      } else {
        setError(data.error || 'Failed to fetch suggestions');
      }
    } catch (err) {
      setError('Server Error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomIdea = () => {
    if (!location) {
      setError('Please enter a location/area before proceeding.');
      return;
    }
    setError('');
    setIdeaSource('custom');
    setStep(1.5);
  };

  const handleGeneratePlan = async () => {
    if (!budget) {
      setError('Please enter your available budget.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, suggestion: selectedSuggestion, budget })
      });
      const data = await response.json();

      if (response.ok) {
        setPlanData(data.plan);
        setStep(4);
      } else {
        setError(data.error || 'Failed to generate plan');
      }
    } catch (err) {
      setError('Server Error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      {/* STEP 1: Location Input */}
      {step === 1 && (
        <div className="step-content">
          <h2 style={{ marginBottom: "1.5rem" }}>Where do you want to start? <span role="img" aria-label="world">🌍</span></h2>
          <div className="form-group">
            <label className="form-label">
              <MapPin size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
              Enter specific Location, Area, or City in India
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Kukatpally, Hyderabad or Vizag Beach Road"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestions()}
            />
          </div>

          {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              className="btn"
              onClick={handleGetSuggestions}
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner"></div> Analyzing Area Demographics...</>
              ) : (
                <>Suggest Business Ideas <ArrowRight size={20} /></>
              )}
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleCustomIdea}
              disabled={loading}
            >
              I already have a Business Idea
            </button>
          </div>
        </div>
      )}

      {/* STEP 1.5: Custom Business Idea Input */}
      {step === 1.5 && (
        <div className="step-content">
          <h2 style={{ marginBottom: "1.5rem" }}>Your Business Idea <span role="img" aria-label="lightbulb">💡</span></h2>
          <div className="form-group">
            <label className="form-label">
              <Briefcase size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
              What kind of business do you want to start in {location}?
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., A Premium Coffee Shop, Pet Grooming Clinic..."
              value={selectedSuggestion}
              onChange={(e) => setSelectedSuggestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (selectedSuggestion) { setStep(3); setError(''); }
                  else setError('Please enter your business idea.');
                }
              }}
            />
          </div>

          {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
              Back
            </button>
            <button
              className="btn"
              style={{ flex: 2 }}
              onClick={() => {
                if (selectedSuggestion) {
                  setError('');
                  setStep(3);
                }
                else setError('Please enter your business idea.');
              }}
            >
              Continue to Budget <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Suggestions */}
      {step === 2 && (
        <div className="step-content">
          <h2 style={{ marginBottom: "1rem" }}>Top Ideas for {location} <span role="img" aria-label="star">⭐</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Based on the demographics and market patterns of {location}, here are AI-curated business types that generally succeed well.
          </p>

          <div className="suggestions-grid">
            {suggestions.map((sug, idx) => (
              <div
                key={idx}
                className={`suggestion-card ${selectedSuggestion === sug ? 'selected' : ''}`}
                onClick={() => setSelectedSuggestion(sug)}
              >
                <Briefcase size={28} color={selectedSuggestion === sug ? 'var(--accent-primary)' : '#94a3b8'} />
                <h4 style={{ fontSize: '1.1rem' }}>{sug}</h4>
                {selectedSuggestion === sug && <CheckCircle2 size={20} color="var(--accent-primary)" style={{ marginTop: '5px' }} />}
              </div>
            ))}
          </div>

          {error && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
              Back
            </button>
            <button
              className="btn"
              style={{ flex: 2 }}
              onClick={() => {
                if (selectedSuggestion) {
                  setError('');
                  setStep(3);
                }
                else setError('Please select a business idea.');
              }}
            >
              Continue with Selection <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Budget Setting */}
      {step === 3 && (
        <div className="step-content">
          <h2 style={{ marginBottom: "1.5rem" }}>What's your Budget? <span role="img" aria-label="money">💰</span></h2>

          <div className="form-group">
            <label className="form-label">
              <Wallet size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
              Available Capital for {selectedSuggestion}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., 5 Lakhs, 10 Lakhs, or ₹500,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGeneratePlan()}
            />
          </div>

          {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" disabled={loading} onClick={() => {
              setError('');
              setStep(ideaSource === 'custom' ? 1.5 : 2);
            }} style={{ flex: 1 }}>
              Back
            </button>
            <button
              className="btn"
              style={{ flex: 2 }}
              onClick={handleGeneratePlan}
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner"></div> Crafting Plan & Compliance Checks...</>
              ) : (
                <>Generate Master Plan <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Render Final Document */}
      {step === 4 && planData && (
        <div className="step-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="gradient-text">Your AI Action Plan <span role="img" aria-label="rocket">🚀</span></h2>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => {
              setStep(1); setLocation(''); setBudget(''); setSelectedSuggestion('');
            }}>Start Over</button>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <PlanViewer markdownContent={planData} />
          </div>
        </div>
      )}
    </div>
  );
}
