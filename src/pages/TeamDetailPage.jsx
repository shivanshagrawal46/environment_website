import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { teamMembersData } from '../data/teamData';
import '../styles/TeamDetail.css';

const TeamDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState(teamMembersData);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://www.pcbfoundation.com/api';
  const BASE_URL = API_URL.replace('/api', '');

  const normalize = (m) => ({
    ...m,
    photo: m.photo && !m.photo.startsWith('http') ? `${BASE_URL}${m.photo}` : m.photo,
    image: m.image && !m.image.startsWith('http') ? `${BASE_URL}${m.image}` : m.image,
    coverImage: m.coverImage && !m.coverImage.startsWith('http') ? `${BASE_URL}${m.coverImage}` : m.coverImage,
  });

  const teamMember = useMemo(() => {
    const found = members.find((m) => m.slug === slug);
    return found ? normalize(found) : null;
  }, [slug, members]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/team`);
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setMembers(data);
        } else {
          setMembers(teamMembersData);
        }
      } catch (err) {
        console.error('Team detail fetch failed, using fallback:', err.message);
        setMembers(teamMembersData);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [API_URL]);

  if (!teamMember && loading) {
    return null;
  }

  if (!teamMember) {
    return (
      <div className="team-detail-page">
        <Navigation />
        <div className="team-not-found">
          <h1>Team member not found</h1>
          <button className="primary-btn" onClick={() => navigate('/team')}>Back to Team</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="team-detail-page">
      <Navigation />

      {/* Hero Section with Cover Image */}
      <section className="team-hero">
        <div className="hero-cover">
          <img src={teamMember.coverImage} alt={teamMember.name} />
          <div className="hero-overlay" />
        </div>
        
        <div className="hero-content-wrapper">
          <motion.div 
            className="hero-profile"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="profile-image-wrapper">
              <img src={teamMember.photo} alt={teamMember.name} className="profile-image" />
              <div className="status-indicator" />
            </div>
            
            <div className="profile-info">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {teamMember.name}
              </motion.h1>
              
              <motion.div 
                className="profile-meta"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="role">{teamMember.role}</span>
                {teamMember.department && (
                  <>
                    <span className="meta-divider">•</span>
                    <span className="department">{teamMember.department}</span>
                  </>
                )}
                {teamMember.location && (
                  <>
                    <span className="meta-divider">•</span>
                    <span className="location">📍 {teamMember.location}</span>
                  </>
                )}
              </motion.div>

              {teamMember.socials && (
                <motion.div 
                  className="social-links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {teamMember.socials.linkedin && (
                    <a href={teamMember.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  )}
                  {teamMember.socials.twitter && (
                    <a href={teamMember.socials.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {teamMember.socials.instagram && (
                    <a href={teamMember.socials.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {teamMember.email && (
                    <a href={`mailto:${teamMember.email}`} className="social-link">
                      <i className="fas fa-envelope"></i>
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="team-detail-wrapper">
        <div className="detail-grid">
          {/* Left Column - Bio & Story */}
          <div className="detail-main">
            <motion.section 
              className="bio-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2>About</h2>
              <p className="detailed-bio">{teamMember.detailedBio}</p>
            </motion.section>

            {teamMember.expertise && teamMember.expertise.length > 0 && (
              <motion.section 
                className="expertise-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h2>Areas of Expertise</h2>
                <div className="expertise-tags">
                  {teamMember.expertise.map((skill, idx) => (
                    <motion.span 
                      key={idx} 
                      className="expertise-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + idx * 0.05, duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.section>
            )}

            {teamMember.achievements && teamMember.achievements.length > 0 && (
              <motion.section 
                className="achievements-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h2>Key Achievements</h2>
                <ul className="achievements-list">
                  {teamMember.achievements.map((achievement, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1, duration: 0.5 }}
                    >
                      <span className="achievement-bullet">✓</span>
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>

          {/* Right Column - Info Card */}
          <aside className="detail-sidebar">
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h3>Quick Info</h3>
              
              {teamMember.yearsOfExperience && (
                <div className="info-item">
                  <span className="info-label">Experience</span>
                  <span className="info-value">{teamMember.yearsOfExperience}+ years</span>
                </div>
              )}

              {teamMember.education && (
                <div className="info-item">
                  <span className="info-label">Education</span>
                  <span className="info-value">{teamMember.education}</span>
                </div>
              )}

              {teamMember.email && (
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <a href={`mailto:${teamMember.email}`} className="info-value info-link">
                    {teamMember.email}
                  </a>
                </div>
              )}

              {teamMember.phone && (
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{teamMember.phone}</span>
                </div>
              )}

              <button className="contact-btn" onClick={() => navigate('/contact')}>
                Get in Touch
              </button>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Other Team Members */}
      <section className="related-team-section">
        <div className="related-header">
          <h3>Meet the Team</h3>
          <button className="see-all-btn" onClick={() => navigate('/team')}>See All</button>
        </div>
        <div className="related-team-grid">
          {members
            .filter((m) => m.slug !== teamMember.slug)
            .slice(0, 3)
            .map((member) => {
              const normalizedPhoto =
                member.photo && !member.photo.startsWith('http')
                  ? `${BASE_URL}${member.photo}`
                  : member.photo;
              return (
            <motion.div 
              key={member.slug}
                  className="team-card"
              onClick={() => navigate(`/team/${member.slug}`)}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="team-avatar">
                    <motion.img 
                      src={normalizedPhoto} 
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
            </motion.div>
              );
            })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamDetailPage;

