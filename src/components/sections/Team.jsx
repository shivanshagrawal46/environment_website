import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { teamMembersData } from '../../data/teamData';
import '../../styles/Team.css';

const Team = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState(teamMembersData);
  const API_URL = import.meta.env.VITE_API_URL || 'https://www.pcbfoundation.com/api';

  const normalized = useMemo(() => {
    const base = API_URL.replace('/api', '');
    return (members || []).map((m) => ({
      ...m,
      photo: m.photo && !m.photo.startsWith('http') ? `${base}${m.photo}` : m.photo,
      image: m.image && !m.image.startsWith('http') ? `${base}${m.image}` : m.image,
      coverImage: m.coverImage && !m.coverImage.startsWith('http') ? `${base}${m.coverImage}` : m.coverImage,
    }));
  }, [members, API_URL]);

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
      }
    };
    fetchTeam();
  }, [API_URL]);

  return (
    <section className="team" id="team">
      <motion.div
        className="team-header"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
      >
        <motion.span 
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false }}
        >
          Our Team
        </motion.span>
        <h2 className="section-title">Experts driving change</h2>
        <p className="team-subtitle">
          A dedicated team of environmental scientists, strategists, and conservation experts
        </p>
      </motion.div>

      <div className="team-grid">
        {normalized.slice(0, 4).map((member, index) => (
          <motion.div
            key={index}
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
            {/* Expertise hidden on home cards as requested */}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="team-cta"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
      >
        <h3>Join our mission</h3>
        <p>We're always looking for passionate individuals to join our team</p>
        <motion.button 
          className="cta-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          View Careers
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Team;

