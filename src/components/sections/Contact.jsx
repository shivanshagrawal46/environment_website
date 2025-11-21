import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <motion.div
          className="contact-info"
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
            Get In Touch
          </motion.span>
          <h2 className="section-title">
            Let's create impact
            <br />
            <span className="text-accent">together</span>
          </h2>
          <p className="contact-description">
            Whether you're a corporation looking to enhance your ESG strategy or 
            an individual passionate about environmental conservation, we'd love to hear from you.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>partnerships@terra.org</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h4>Headquarters</h4>
                <p>San Francisco, CA</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Instagram">Instagram</a>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <motion.button
            type="submit"
            className="cta-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;

