import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/Donate.css';

const donationAmounts = [50, 100, 250, 500, 1000];

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');

  return (
    <section className="donate" id="donate">
      <div className="donate-container">
        <motion.div
          className="donate-content"
          initial={{ opacity: 0, x: -80, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.span 
            className="section-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
          >
            Make A Difference
          </motion.span>
          <h2 className="section-title">
            Support our mission to
            <br />
            <span className="text-accent">restore our planet</span>
          </h2>
          <p className="donate-description">
            Your contribution directly funds reforestation, conservation, and 
            community programs. 100% of donations go directly to environmental projects.
          </p>

          <div className="donation-options">
            <h3>Choose an amount</h3>
            <div className="amount-buttons">
              {donationAmounts.map((amount) => (
                <motion.button
                  key={amount}
                  className={`amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ${amount}
                </motion.button>
              ))}
            </div>
            <input
              type="number"
              className="custom-amount"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
            />
          </div>

          <div className="donation-impact">
            <h4>Your impact:</h4>
            <div className="impact-items">
              <div className="impact-item">
                <span className="impact-icon">🌳</span>
                <span>{selectedAmount || customAmount ? Math.floor((selectedAmount || customAmount) / 5) : 0} trees planted</span>
              </div>
              <div className="impact-item">
                <span className="impact-icon">🌍</span>
                <span>{selectedAmount || customAmount ? Math.floor((selectedAmount || customAmount) / 10) : 0} m² restored</span>
              </div>
            </div>
          </div>

          <motion.button 
            className="cta-primary donate-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Donate ${selectedAmount || customAmount || 0}
          </motion.button>

          <p className="tax-info">Tax-deductible • Secure payment • Monthly & one-time options</p>
        </motion.div>

          <motion.div
            className="donate-visual"
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
            viewport={{ once: false, margin: "-100px" }}
          >
            <motion.img 
              src="/images/download8.png" 
              alt="Environmental impact"
              initial={{ scale: 1.2, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
              viewport={{ once: false }}
            />
            <div className="visual-stats">
              <motion.div 
                className="stat-badge"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: false }}
              >
                <strong>98%</strong>
                <span>Efficiency Rating</span>
              </motion.div>
              <motion.div 
                className="stat-badge"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: false }}
              >
                <strong>$15M</strong>
                <span>Raised in 2024</span>
              </motion.div>
            </div>
          </motion.div>
      </div>
    </section>
  );
};

export default Donate;

