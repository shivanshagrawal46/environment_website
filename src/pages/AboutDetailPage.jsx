import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { aboutPageData, teamMembersData } from '../data/teamData';
import '../styles/AboutDetail.css';

const AboutDetailPage = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState(teamMembersData);
  const [about, setAbout] = useState(aboutPageData);
  const API_URL = 'https://www.pcbfoundation.com/api';
  const BASE_URL = API_URL.replace('/api', '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_URL}/about`);
        if (!res.ok) throw new Error('Failed to fetch about');
        const data = await res.json();
        if (data) {
          setAbout(data);
        }
      } catch (err) {
        console.error('About page fetch failed, using fallback:', err.message);
        setAbout(aboutPageData);
      }
    };

    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/team`);
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setTeam(data);
        }
      } catch (err) {
        console.error('About page team fetch failed, using fallback:', err.message);
        setTeam(teamMembersData);
      }
    };
    fetchAbout();
    fetchTeam();
  }, [API_URL]);

  const normalizedAbout = useMemo(() => {
    if (!about) return aboutPageData;
    const heroImage =
      about.heroImage && !about.heroImage.startsWith('http')
        ? `${BASE_URL}${about.heroImage}`
        : about.heroImage;
    return {
      ...about,
      heroImage,
      values: Array.isArray(about.values) ? about.values : aboutPageData.values,
      milestones: Array.isArray(about.milestones) ? about.milestones : aboutPageData.milestones,
      highlights: Array.isArray(about.highlights) ? about.highlights : aboutPageData.highlights,
    };
  }, [about, BASE_URL]);

  const normalizedTeam = useMemo(() => {
    return (team || []).map((m) => ({
      ...m,
      photo: m.photo && !m.photo.startsWith('http') ? `${BASE_URL}${m.photo}` : m.photo,
      image: m.image && !m.image.startsWith('http') ? `${BASE_URL}${m.image}` : m.image,
      coverImage: m.coverImage && !m.coverImage.startsWith('http') ? `${BASE_URL}${m.coverImage}` : m.coverImage,
    }));
  }, [team, BASE_URL]);

  return (
    <div className="about-detail-page">
      <Navigation />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <motion.span 
            className="section-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {normalizedAbout.heroTitle}
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {normalizedAbout.heroSubtitle}
          </motion.h1>
          
          <motion.img
            src={normalizedAbout.heroImage}
            alt="Our Story"
            className="hero-image"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          />
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="mvv-section">
        <div className="mvv-grid">
          <motion.div 
            className="mvv-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="mvv-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>{normalizedAbout.mission}</p>
          </motion.div>

          <motion.div 
            className="mvv-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="mvv-icon">🔭</div>
            <h2>Our Vision</h2>
            <p>{normalizedAbout.vision}</p>
          </motion.div>

          <motion.div 
            className="mvv-card values-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="mvv-icon">💎</div>
            <h2>Our Values</h2>
            <ul className="values-list">
              {normalizedAbout.values.map((value, idx) => (
                <li key={idx}>{value}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <motion.div 
          className="story-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-heading">Our Journey</h2>
          <div
            className="story-text"
            dangerouslySetInnerHTML={{ __html: normalizedAbout.story || '' }}
          />
        </motion.div>
      </section>

      {/* Milestones Timeline */}
      <section className="milestones-section">
        <motion.h2 
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Key Milestones
        </motion.h2>
        
        <div className="timeline">
          {normalizedAbout.milestones.map((milestone, idx) => (
            <motion.div 
              key={idx}
              className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <div className="timeline-dot">
                <span className="year">{milestone.year}</span>
              </div>
              <div className="timeline-content">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-stats-section">
        <motion.h2 
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Our Impact
        </motion.h2>
        
        <div className="stats-grid">
          {aboutPageData.impactStats.map((stat, idx) => (
            <motion.div 
              key={idx}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <p className="stat-description">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="highlights-section">
        <motion.h2 
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          What Sets Us Apart
        </motion.h2>
        
        <div className="highlights-grid">
          {normalizedAbout.highlights.map((highlight, idx) => (
            <motion.div 
              key={idx}
              className="highlight-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Team Preview */}
      <section className="team-preview-section">
        <div className="team-preview-header">
          <h2 className="section-heading">Meet Our Leadership</h2>
          <button className="see-all-btn" onClick={() => navigate('/team')}>Meet the Full Team</button>
        </div>
        
        <div className="team-preview-grid">
          {normalizedTeam.slice(0, 3).map((member, idx) => (
            <motion.div 
              key={member.slug}
              className="team-card"
              onClick={() => navigate(`/team/${member.slug}`)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              style={{ cursor: 'pointer' }}
            >
              <div className="team-avatar">
                <motion.img 
                  src={member.photo} 
                  alt={member.name}
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {member.name}
              </motion.h3>
              <motion.p
                className="team-role"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {member.role}
              </motion.p>
              <p className="team-bio">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>Join Us in Making a Difference</h2>
          <p>Whether through partnership, donation, or volunteering, there are many ways to support our mission.</p>
          <div className="cta-buttons">
            <button className="primary-btn" onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>
              Get in Touch
            </button>
            <button className="secondary-btn" onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('donate');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>
              Support Our Work
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutDetailPage;

