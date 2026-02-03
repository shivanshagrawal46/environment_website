import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/Donate.css';

const donationAmounts = [500, 1000, 2500, 5000, 10000];
const API_URL = 'https://www.pcbfoundation.com/api';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const amount = selectedAmount || parseFloat(customAmount) || 0;
    
    if (amount < 1) {
      setPaymentStatus({ type: 'error', message: 'Please select or enter a valid amount' });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order on backend
      const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          notes: { purpose: 'Donation to PCB Foundation' }
        })
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'PCB Foundation',
        description: 'Donation for Environmental Conservation',
        image: '/images/logo_pcb.png',
        order_id: orderData.order.id,
        handler: async (response) => {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              setPaymentStatus({ 
                type: 'success', 
                message: `Thank you! Your donation of ₹${amount} was successful.` 
              });
            } else {
              setPaymentStatus({ 
                type: 'error', 
                message: 'Payment verification failed. Please contact support.' 
              });
            }
          } catch (error) {
            setPaymentStatus({ 
              type: 'error', 
              message: 'Payment verification failed. Please contact support.' 
            });
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4a6741'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        setPaymentStatus({ 
          type: 'error', 
          message: response.error.description || 'Payment failed. Please try again.' 
        });
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({ 
        type: 'error', 
        message: error.message || 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentAmount = selectedAmount || parseFloat(customAmount) || 0;

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
                    setPaymentStatus(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ₹{amount.toLocaleString('en-IN')}
                </motion.button>
              ))}
            </div>
            <input
              type="number"
              className="custom-amount"
              placeholder="Enter custom amount (₹)"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
                setPaymentStatus(null);
              }}
              min="1"
            />
          </div>

          <div className="donation-impact">
            <h4>Your impact:</h4>
            <div className="impact-items">
              <div className="impact-item">
                <span className="impact-icon">🌳</span>
                <span>{currentAmount ? Math.floor(currentAmount / 50) : 0} trees planted</span>
              </div>
              <div className="impact-item">
                <span className="impact-icon">🌍</span>
                <span>{currentAmount ? Math.floor(currentAmount / 100) : 0} m² restored</span>
              </div>
            </div>
          </div>

          {paymentStatus && (
            <motion.div 
              className={`payment-status ${paymentStatus.type}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {paymentStatus.type === 'success' ? '✓' : '!'} {paymentStatus.message}
            </motion.div>
          )}

          <motion.button 
            className="cta-primary donate-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePayment}
            disabled={isProcessing || currentAmount < 1}
          >
            {isProcessing ? 'Processing...' : `Donate ₹${currentAmount.toLocaleString('en-IN')}`}
          </motion.button>

          <p className="tax-info">Tax-deductible • Secure payment via Razorpay • 100% goes to projects</p>
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
            </div>
          </motion.div>
      </div>
    </section>
  );
};

export default Donate;

