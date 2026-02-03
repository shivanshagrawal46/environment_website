import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { teamMembersData } from '../data/teamData';
import '../styles/TeamPage.css';

const TeamPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState(teamMembersData);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://www.pcbfoundation.com/api';

  const normalized = useMemo(() => {
    const base = API_URL.replace('/api', '');
    return (members || []).map((m) => ({
      ...m,
      photo: m.photo && !m.photo.startsWith('http') ? `${base}${m.photo}` : m.photo,
      image: m.image && !m.image.startsWith('http') ? `${base}${m.image}` : m.image,
      coverImage: m.coverImage && !m.coverImage.startsWith('http') ? `${base}${m.coverImage}` : m.coverImage,
    }));
  }, [members]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/team`);
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setMembers(data);
        }
      } catch (err) {
        console.error('Team fetch failed, using fallback:', err.message);
        setMembers(teamMembersData);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [API_URL]);

  return (
    <div className="team-page">
      <Navigation />

      {/* Hero Section */}
      <section className="team-page-hero">
        <motion.div
          className="team-hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Experts Driving <span className="text-accent">Change</span>
          </motion.h1>
          <motion.p
            className="team-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            A dedicated team of environmental scientists, strategists, and conservation experts
            working together to create a sustainable future.
          </motion.p>
        </motion.div>
      </section>

      {/* Team Grid Section */}
      <section className="team-page-section">
        <div className="team-page-grid">
          {normalized.map((member, index) => (
            <motion.div
              key={member.slug || index}
              className="team-card"
              initial={{ opacity: 0, y: 60, scale: 0.8, rotateY: -20 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.6, 0.05, 0.01, 0.9]
              }}
              viewport={{ once: false, margin: "-80px" }}
              whileHover={{ y: -15, scale: 1.05 }}
              onClick={() => navigate(`/team/${member.slug}`)}
              style={{ cursor: 'pointer' }}
            >
              <motion.div
                className="team-avatar"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1 + 0.2,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
                viewport={{ once: false }}
              >
                <motion.img
                  src={member.photo || member.image}
                  alt={member.name}
                  initial={{ scale: 1.2 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1 + 0.3
                  }}
                  viewport={{ once: false }}
                />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                viewport={{ once: false }}
              >
                {member.name}
              </motion.h3>
              <motion.p
                className="team-role"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                viewport={{ once: false }}
              >
                {member.role}
              </motion.p>
              {member.department && (
                <motion.p
                  className="team-department"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
                  viewport={{ once: false }}
                >
                  {member.department}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="team-page-cta">
        <motion.div
          className="team-cta-content"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <h3>Join Our Mission</h3>
          <p>We're always looking for passionate individuals to join our team and make a difference.</p>
          <motion.button
            className="cta-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamPage;
