import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { projectsData } from '../data/projectsData';
import '../styles/ProjectsPage.css';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState(projectsData);
  const API_URL = import.meta.env.VITE_API_URL || 'https://www.pcbfoundation.com/api';
  const BASE_URL = useMemo(() => API_URL.replace('/api', ''), [API_URL]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/projects`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data?.data)) {
          setProjects(data.data);
        }
      } catch (err) {
        console.error('Projects fetch failed, using static data:', err.message);
        setProjects(projectsData);
      }
    };
    fetchProjects();
  }, [API_URL]);

  const categories = useMemo(() => {
    const unique = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(unique)];
  }, [projects]);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const resolveImage = (p) => {
    const url = p.mainImage || p.image;
    if (!url) return '';
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
  };

  return (
    <div className="projects-page">
      <Navigation />
      
      <section className="projects-page-section">
        <motion.div
          className="projects-header"
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
            Our Work
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false }}
          >
            Projects Making <span className="text-accent">Difference</span>
          </motion.h2>
          <motion.p 
            className="projects-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: false }}
          >
            Explore our global initiatives creating lasting environmental impact
          </motion.p>
        </motion.div>

        <motion.div 
          className="projects-filters"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5 + (index * 0.05),
                ease: [0.6, 0.05, 0.01, 0.9]
              }}
              viewport={{ once: false }}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          className="projects-grid"
          layout
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                layout
                initial={{ opacity: 0, y: 80, scale: 0.85, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -30 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: [0.6, 0.05, 0.01, 0.9],
                  layout: { duration: 0.5 }
                }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.02,
                  rotateX: 5,
                  transition: { duration: 0.4 }
                }}
                onClick={() => navigate(`/projects/${project.slug}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-image-wrapper">
                  <motion.div
                    className="project-shimmer"
                    initial={{ x: '-100%' }}
                    whileInView={{ x: '100%' }}
                    transition={{ 
                      duration: 1.5,
                      delay: index * 0.1,
                      ease: [0.6, 0.05, 0.01, 0.9]
                    }}
                    viewport={{ once: false }}
                  />
                  <img 
                    src={resolveImage(project)} 
                    alt={project.title}
                    loading="lazy"
                  />
                  <div className="project-overlay">
                    <span className="project-category">{project.category}</span>
                  </div>
                </div>

                <div className="project-content">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.05), duration: 0.6 }}
                    viewport={{ once: false }}
                  >
                    {project.title}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (index * 0.05), duration: 0.6 }}
                    viewport={{ once: false }}
                  >
                    {project.description}
                  </motion.p>

                  <motion.div 
                    className="project-meta"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.05), duration: 0.6 }}
                    viewport={{ once: false }}
                  >
                    <span className="project-impact">{project.impact}</span>
                    <span className="project-location">📍 {project.location}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            className="no-projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p>No projects found in this category.</p>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;

