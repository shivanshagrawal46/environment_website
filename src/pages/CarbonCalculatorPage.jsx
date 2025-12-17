import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import axios from 'axios';
import '../styles/CarbonCalculatorPage.css';

const API_URL = 'https://www.pcbfoundation.com/api';

const CarbonCalculatorPage = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // input, calculating, results
  const [calculationType, setCalculationType] = useState(null); // 'transport' or 'home'
  const [formData, setFormData] = useState({
    transport: {
      mode: 'car',
      subtype: 'medium',
      fuel: 'petrol',
      distanceKm: 100
    },
    home: {
      electricityKwh: 300,
      lpgKg: 12
    }
  });
  const [results, setResults] = useState(null);

  // Scroll to top on major view changes (input/calculating/results)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, calculationType]);

  const handleCalculate = async () => {
    setStep('calculating');

    // Wait for 2 seconds (car animation)
    setTimeout(async () => {
      try {
        const payload = {};
        if (calculationType === 'transport') {
          payload.transport = formData.transport;
        } else if (calculationType === 'home') {
          payload.home = formData.home;
        }

        const response = await axios.post(`${API_URL}/carbon/calculate`, payload);
        // Transform response to match component structure
        const data = response.data;
        setResults({
          totalKg: data.results.totalKgCO2,
          totalTon: data.results.totalTonCO2,
          severity: data.messages.severity,
          message: data.messages.main,
          impactMessage: data.messages.impact,
          eyeOpeners: data.messages.eyeOpeners,
          suggestions: data.messages.suggestions,
          callToAction: data.messages.callToAction
        });
        setStep('results');
      } catch (error) {
        console.error('Calculation failed:', error);
        setStep('input');
      }
    }, 2000);
  };

  const resetCalculator = () => {
    setStep('input');
    setCalculationType(null);
    setResults(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return '#52c41a';
      case 'medium': return '#faad14';
      case 'high': return '#ff4d4f';
      default: return '#4a6741';
    }
  };

  return (
    <div
      className={`carbon-calculator-page ${embedded ? 'carbon-embedded' : ''}`}
      onClick={embedded ? () => navigate('/carbon-calculator') : undefined}
      role={embedded ? 'button' : undefined}
      tabIndex={embedded ? 0 : undefined}
    >
      {!embedded && <Navigation />}
      
      {/* Calculating Overlay with Car Animation */}
      <AnimatePresence>
        {step === 'calculating' && (
          <motion.div
            className="calculating-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="blur-backdrop" />
            
            <div className="car-animation-container">
              <motion.div
                className="road-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              <motion.img
                src="/images/car_icon.png"
                alt="Calculating"
                className="animated-car"
                initial={{ x: '-150%', opacity: 0 }}
                animate={{ x: '150%', opacity: 1 }}
                transition={{ 
                  duration: 2, 
                  ease: [0.6, 0.05, 0.01, 0.9],
                  opacity: { duration: 0.3 }
                }}
              />
              
              <motion.div
                className="calculating-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h3>Analyzing Your Carbon Footprint</h3>
                <p>Crunching the numbers for you...</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="calculator-section">
        <motion.div
          className="calculator-hero"
          initial={{ opacity: 0, y: 30 }}
          {...(embedded ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: false, margin: "-100px" } } : { animate: { opacity: 1, y: 0 } })}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="/images/earth.png"
            alt="Earth"
            className="earth-icon"
            initial={{ scale: 0, rotate: -180 }}
            {...(embedded ? { whileInView: { scale: 1, rotate: 0 }, viewport: { once: false, margin: "-100px" } } : { animate: { scale: 1, rotate: 0 } })}
            transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
          />
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            {...(embedded ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: false, margin: "-100px" } } : { animate: { opacity: 1, y: 0 } })}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Carbon <span className="text-accent">Footprint</span> Calculator
          </motion.h1>
          
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            {...(embedded ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: false, margin: "-100px" } } : { animate: { opacity: 1, y: 0 } })}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Understand your environmental impact and take action towards a sustainable future
          </motion.p>
        </motion.div>

        {step === 'input' && !calculationType && (
          <motion.div
            className="calculator-type-selection"
            initial={{ opacity: 0, y: 40 }}
            {...(embedded ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: false, margin: "-100px" } } : { animate: { opacity: 1, y: 0 } })}
            transition={{ delay: embedded ? 0 : 0.7, duration: 0.8 }}
          >
            <div className="type-cards">
              <motion.div
                className="type-card"
                onClick={() => setCalculationType('transport')}
                initial={{ opacity: 0, x: -30 }}
                {...(embedded ? { whileInView: { opacity: 1, x: 0 }, viewport: { once: false, margin: "-80px" } } : { animate: { opacity: 1, x: 0 } })}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.6, delay: embedded ? 0.2 : 0.8 }}
              >
                <div className="type-icon">🚗</div>
                <h3>Transportation</h3>
                <p>Calculate emissions from your daily commute</p>
                <span className="type-label">Cars • Motorcycles</span>
              </motion.div>

              <motion.div
                className="type-card"
                onClick={() => setCalculationType('home')}
                initial={{ opacity: 0, x: 30 }}
                {...(embedded ? { whileInView: { opacity: 1, x: 0 }, viewport: { once: false, margin: "-80px" } } : { animate: { opacity: 1, x: 0 } })}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.6, delay: embedded ? 0.3 : 0.9 }}
              >
                <div className="type-icon">🏠</div>
                <h3>Home Energy</h3>
                <p>Calculate emissions from household usage</p>
                <span className="type-label">Electricity • LPG • Gas</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'input' && calculationType && (
          <motion.div
            className="calculator-form-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <button className="back-button" onClick={resetCalculator}>
              ← Back to selection
            </button>

            {calculationType === 'transport' && (
              <div className="calculator-form glass-card">
                <div className="form-header">
                  <div className="form-icon">🚗</div>
                  <h2>Transportation Carbon Calculator</h2>
                  <p>Calculate your vehicle's environmental impact</p>
                </div>

                <div className="form-group">
                  <label>Vehicle Type</label>
                  <div className="button-group">
                    {['car', 'motorcycle'].map((mode) => (
                      <button
                        key={mode}
                        className={`option-btn ${formData.transport.mode === mode ? 'active' : ''}`}
                        onClick={() => setFormData({
                          ...formData,
                          transport: { ...formData.transport, mode }
                        })}
                      >
                        {mode === 'car' ? '🚗 Car' : '🏍️ Motorcycle'}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.transport.mode === 'car' && (
                  <div className="form-group">
                    <label>Car Size</label>
                    <div className="button-group">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          className={`option-btn ${formData.transport.subtype === size ? 'active' : ''}`}
                          onClick={() => setFormData({
                            ...formData,
                            transport: { ...formData.transport, subtype: size }
                          })}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Fuel Type</label>
                  <div className="button-group">
                    {['petrol', 'diesel', 'electric', 'hybrid'].map((fuel) => (
                      <button
                        key={fuel}
                        className={`option-btn ${formData.transport.fuel === fuel ? 'active' : ''}`}
                        onClick={() => setFormData({
                          ...formData,
                          transport: { ...formData.transport, fuel }
                        })}
                      >
                        {fuel === 'petrol' ? '⛽ Petrol' : 
                         fuel === 'diesel' ? '🛢️ Diesel' :
                         fuel === 'electric' ? '⚡ Electric' : '🔋 Hybrid'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Monthly Distance (km)</label>
                  <input
                    type="number"
                    className="number-input"
                    value={formData.transport.distanceKm}
                    onChange={(e) => setFormData({
                      ...formData,
                      transport: { ...formData.transport, distanceKm: parseFloat(e.target.value) || 0 }
                    })}
                    placeholder="Enter distance in km"
                    min="0"
                  />
                  <span className="input-hint">Average monthly driving distance</span>
                </div>

                <motion.button
                  className="calculate-button"
                  onClick={handleCalculate}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Calculate My Impact
                </motion.button>
              </div>
            )}

            {calculationType === 'home' && (
              <div className="calculator-form glass-card">
                <div className="form-header">
                  <div className="form-icon">🏠</div>
                  <h2>Home Energy Carbon Calculator</h2>
                  <p>Measure your household's carbon footprint</p>
                </div>

                <div className="form-group">
                  <label>Monthly Electricity Usage (kWh)</label>
                  <input
                    type="number"
                    className="number-input"
                    value={formData.home.electricityKwh}
                    onChange={(e) => setFormData({
                      ...formData,
                      home: { ...formData.home, electricityKwh: parseFloat(e.target.value) || 0 }
                    })}
                    placeholder="Enter kWh"
                    min="0"
                  />
                  <span className="input-hint">Check your electricity bill for this number</span>
                </div>

                <div className="form-group">
                  <label>Monthly LPG/Gas Usage (kg)</label>
                  <input
                    type="number"
                    className="number-input"
                    value={formData.home.lpgKg}
                    onChange={(e) => setFormData({
                      ...formData,
                      home: { ...formData.home, lpgKg: parseFloat(e.target.value) || 0 }
                    })}
                    placeholder="Enter kg"
                    min="0"
                  />
                  <span className="input-hint">Typical cylinder weighs 14-19 kg</span>
                </div>

                <motion.button
                  className="calculate-button"
                  onClick={handleCalculate}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Calculate My Impact
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'results' && results && (
          <motion.div
            className="results-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Result Card */}
            <motion.div
              className="result-main-card glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="result-header">
                <h2>Your Carbon Footprint</h2>
                <motion.div
                  className={`severity-badge severity-${results.severity}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  style={{ background: getSeverityColor(results.severity) }}
                >
                  {results.severity.toUpperCase()}
                </motion.div>
              </div>

              <motion.div
                className="result-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
              >
                <span className="co2-value">{results.totalKg.toFixed(2)}</span>
                <span className="co2-unit">kg CO₂e</span>
              </motion.div>

              {results.totalKg >= 1000 && (
                <motion.div
                  className="result-ton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  = {results.totalTon.toFixed(2)} tonnes of CO₂
                </motion.div>
              )}

              <motion.p
                className="result-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {results.message}
              </motion.p>
            </motion.div>

            {/* Impact Visualization */}
            <div className="impact-grid">
              {results.eyeOpeners.map((opener, index) => (
                <motion.div
                  key={index}
                  className="impact-card glass-card"
                  initial={{ opacity: 0, y: 30, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1), duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="impact-icon">{opener.icon}</div>
                  <h3>{opener.label}</h3>
                  <div className="impact-value">{opener.value}</div>
                  <p>{opener.message}</p>
                </motion.div>
              ))}
            </div>

            {/* What You've Done */}
            <motion.div
              className="destruction-section glass-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              <div className="destruction-header">
                <h2>Environmental Impact</h2>
                <div className="warning-icon">⚠️</div>
              </div>
              
              <div className="destruction-content">
                <p className="destruction-main">
                  Your monthly carbon emissions contribute to:
                </p>
                
                <ul className="impact-list">
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <span className="impact-bullet">🔥</span>
                    <strong>Rising Global Temperatures:</strong> Contributing to climate change and extreme weather events
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    <span className="impact-bullet">🌊</span>
                    <strong>Ocean Acidification:</strong> Harming marine ecosystems and coral reefs
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 }}
                  >
                    <span className="impact-bullet">🦋</span>
                    <strong>Biodiversity Loss:</strong> Threatening species habitats and ecosystems
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                  >
                    <span className="impact-bullet">🏔️</span>
                    <strong>Melting Ice Caps:</strong> Contributing to rising sea levels
                  </motion.li>
                </ul>
              </div>
            </motion.div>

            {/* What We're Doing */}
            <motion.div
              className="solution-section glass-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
            >
              <div className="solution-header">
                <h2>How We're Making a Difference</h2>
                <div className="hope-icon">🌱</div>
              </div>
              
              <div className="solution-grid">
                {results.suggestions.map((suggestion, index) => {
                  const isPartnerTreesSuggestion =
                    typeof suggestion === 'string' &&
                    suggestion.toLowerCase().includes('partner with us to plant trees');

                  const handleContactClick = () => {
                    const el = document.getElementById('contact');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/'); // fall back to home
                    }
                  };

                  return (
                    <motion.div
                      key={index}
                      className="solution-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.0 + index * 0.1 }}
                    >
                    <div className="solution-number">{index + 1}</div>
                    <div className="solution-item-content">
                      <p>{suggestion}</p>
                      {isPartnerTreesSuggestion && (
                        <motion.button
                          className="solution-contact-btn"
                          type="button"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={handleContactClick}
                        >
                          Contact Us
                        </motion.button>
                      )}
                    </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="cta-section"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.8 }}
            >
              <div className="cta-content glass-card">
                <h2>Join Us in Reversing Climate Change</h2>
                <p>Every action counts. Together, we can offset these emissions and create a sustainable future.</p>
                
                <div className="cta-buttons">
                  <motion.a
                    href="#contact"
                    className="cta-button primary"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Us
                  </motion.a>
                  
                  <motion.a
                    href="#donate"
                    className="cta-button secondary"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Support Our Mission
                  </motion.a>
                </div>
              </div>
            </motion.div>

            <motion.button
              className="recalculate-button"
              onClick={resetCalculator}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Calculate Again
            </motion.button>
          </motion.div>
        )}
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default CarbonCalculatorPage;

