import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import '../styles/CarbonCalculator.css';

const carImage = '/images/car.png'; // place the provided car icon in public/images/car.png

const defaultInputs = {
  transport: {
    mode: 'car',
    subtype: 'medium',
    fuel: 'petrol',
    distanceKm: 30,
  },
  home: {
    electricityKwh: 350,
    lpgKg: 0,
  },
};

const presets = {
  transport: [
    { label: 'Small petrol car, 15 km/day', value: { mode: 'car', subtype: 'small', fuel: 'petrol', distanceKm: 15 } },
    { label: 'Medium diesel car, 30 km/day', value: { mode: 'car', subtype: 'medium', fuel: 'diesel', distanceKm: 30 } },
    { label: 'Large electric car, 20 km/day', value: { mode: 'car', subtype: 'large', fuel: 'electric', distanceKm: 20 } },
    { label: 'Motorcycle, 10 km/day', value: { mode: 'motorcycle', subtype: 'n/a', fuel: 'petrol', distanceKm: 10 } },
  ],
  home: [
    { label: 'Apartment, low use', value: { electricityKwh: 150, lpgKg: 0 } },
    { label: 'Family home, average', value: { electricityKwh: 350, lpgKg: 10 } },
    { label: 'High usage home', value: { electricityKwh: 600, lpgKg: 20 } },
  ],
};

const CarbonCalculator = () => {
  const [inputs, setInputs] = useState(defaultInputs);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleTransportChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      transport: {
        ...prev.transport,
        [field]: value,
      },
    }));
  };

  const handleHomeChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        [field]: value,
      },
    }));
  };

  const applyTransportPreset = (value) => {
    setInputs((prev) => ({ ...prev, transport: { ...prev.transport, ...value } }));
  };

  const applyHomePreset = (value) => {
    setInputs((prev) => ({ ...prev, home: { ...prev.home, ...value } }));
  };

  const calculate = async () => {
    setLoading(true);
    setAnimating(true);

    // stop animation after 2s
    setTimeout(() => setAnimating(false), 2000);

    try {
      const response = await fetch('/api/carbon/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transport: {
            ...inputs.transport,
            distanceKm: Number(inputs.transport.distanceKm) || 0,
          },
          home: {
            electricityKwh: Number(inputs.home.electricityKwh) || 0,
            lpgKg: Number(inputs.home.lpgKg) || 0,
          },
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (severity) => {
    if (severity === 'high') return '#d9534f';
    if (severity === 'medium') return '#f0ad4e';
    return '#4a6741';
  };

  return (
    <div className="carbon-page">
      <Navigation />

      <section className="carbon-hero">
        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Carbon Insights
        </motion.span>
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Carbon Calculator
        </motion.h1>
        <motion.p
          className="carbon-subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Elegant, minimal, and eye-opening. Understand your footprint across transport and home energy.
        </motion.p>
      </section>

      <section className="carbon-layout">
        <div className="carbon-form">
          <div className="card glass">
            <div className="card-header">
              <div>
                <p className="eyebrow">Transport</p>
                <h3>Vehicle emissions</h3>
              </div>
              <div className="preset-row">
                {presets.transport.map((p) => (
                  <button key={p.label} className="pill-btn" onClick={() => applyTransportPreset(p.value)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <label className="form-item">
                <span>Mode</span>
                <select
                  value={inputs.transport.mode}
                  onChange={(e) => handleTransportChange('mode', e.target.value)}
                >
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bike">Bike</option>
                </select>
              </label>

              {inputs.transport.mode === 'car' && (
                <>
                  <label className="form-item">
                    <span>Size</span>
                    <select
                      value={inputs.transport.subtype}
                      onChange={(e) => handleTransportChange('subtype', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                  <label className="form-item">
                    <span>Fuel</span>
                    <select
                      value={inputs.transport.fuel}
                      onChange={(e) => handleTransportChange('fuel', e.target.value)}
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </label>
                </>
              )}

              {inputs.transport.mode === 'motorcycle' && (
                <label className="form-item">
                  <span>Fuel</span>
                  <select
                    value={inputs.transport.fuel}
                    onChange={(e) => handleTransportChange('fuel', e.target.value)}
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </label>
              )}

              <label className="form-item">
                <span>Distance (km)</span>
                <input
                  type="number"
                  value={inputs.transport.distanceKm}
                  onChange={(e) => handleTransportChange('distanceKm', e.target.value)}
                  min="0"
                  step="1"
                />
              </label>
            </div>
          </div>

          <div className="card glass">
            <div className="card-header">
              <div>
                <p className="eyebrow">Home</p>
                <h3>Energy emissions</h3>
              </div>
              <div className="preset-row">
                {presets.home.map((p) => (
                  <button key={p.label} className="pill-btn" onClick={() => applyHomePreset(p.value)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <label className="form-item">
                <span>Electricity (kWh)</span>
                <input
                  type="number"
                  value={inputs.home.electricityKwh}
                  onChange={(e) => handleHomeChange('electricityKwh', e.target.value)}
                  min="0"
                  step="1"
                />
              </label>

              <label className="form-item">
                <span>LPG (kg)</span>
                <input
                  type="number"
                  value={inputs.home.lpgKg}
                  onChange={(e) => handleHomeChange('lpgKg', e.target.value)}
                  min="0"
                  step="1"
                />
              </label>
            </div>
          </div>

          <div className="actions">
            <button className="primary-btn" onClick={calculate} disabled={loading}>
              Calculate
            </button>
            <button className="ghost-btn" onClick={() => { setInputs(defaultInputs); setResult(null); }}>
              Reset
            </button>
          </div>

          <AnimatePresence>
            {animating && (
              <motion.div
                className="car-animation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="road" />
                <motion.img
                  src={carImage}
                  alt="Car animation"
                  className="car-icon"
                  initial={{ x: '-10%' }}
                  animate={{ x: '110%' }}
                  transition={{ duration: 2, ease: [0.6, 0.05, 0.01, 0.9] }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="carbon-results">
          <div className="card glass">
            <div className="card-header">
              <div>
                <p className="eyebrow">Results</p>
                <h3>Impact overview</h3>
              </div>
            </div>

            {!result && (
              <p className="placeholder">Run a calculation to see your footprint and insights.</p>
            )}

            {result && (
              <div className="results-grid">
                <div className="result-tile">
                  <p className="eyebrow">Total</p>
                  <h2>{result.results.totalKgCO2.toLocaleString()} kg CO2e</h2>
                  <p className="muted">{result.results.totalTonCO2} tons</p>
                </div>

                {result.messages?.severity && (
                  <div className="result-tile">
                    <p className="eyebrow">Severity</p>
                    <span className="pill" style={{ background: severityColor(result.messages.severity), color: '#fff' }}>
                      {result.messages.severity.toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="result-tile">
                  <p className="eyebrow">Tree offset (yr)</p>
                  <h3>{result.impacts.treesNeeded.toLocaleString()} trees</h3>
                </div>

                <div className="result-tile">
                  <p className="eyebrow">Car distance equivalent</p>
                  <h3>{result.impacts.carKmEquivalent.toLocaleString()} km</h3>
                </div>

                <div className="result-tile">
                  <p className="eyebrow">Flight equivalent</p>
                  <h3>{result.impacts.flightKmEquivalent.toLocaleString()} km</h3>
                </div>

                <div className="result-wide">
                  <p className="eyebrow">Eye-openers</p>
                  <ul>
                    {result.messages.eyeOpeners.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>

                <div className="result-wide">
                  <p className="eyebrow">Suggestions</p>
                  <ul>
                    {result.messages.suggestions.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>

                <div className="cta-row">
                  <a className="link-btn" href="/contact">Contact Us</a>
                  <a className="link-btn" href="/donate">Donate</a>
                  <a className="link-btn" href="/partner">Partner</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CarbonCalculator;

