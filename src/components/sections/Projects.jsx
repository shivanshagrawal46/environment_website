import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../../data/projectsData';
import '../../styles/Projects.css';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState(projectsData);
  const navigate = useNavigate();
  const API_URL = 'https://www.pcbfoundation.com/api';
  const BASE_URL = useMemo(() => API_URL.replace('/api', ''), []);

  // Fetch projects from API but keep layout/data as-is if it fails
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

  // Limit to first 6 for homepage display
  const visibleProjects = (projects || []).slice(0, 6);

  // Derive categories dynamically from fetched projects with fallback to previous static list
  const categories = useMemo(() => {
    const dynamic = Array.from(
      new Set(
        (projects || [])
          .map((p) => p.category)
          .filter(Boolean)
      )
    );
    const fallback = ['Ocean', 'Urban', 'Wildlife', 'Water', 'Agriculture', 'Biodiversity'];
    return ['all', ...(dynamic.length ? dynamic : fallback)];
  }, [projects]);

  const filteredProjects = filter === 'all' 
    ? visibleProjects 
    : visibleProjects.filter(project => project.category === filter);

  const resolveImage = (p) => {
    const url = p.mainImage || p.image;
    if (!url) return '';
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
  };

  return (
    <section className="projects" id="projects">
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
          initial={{ backgroundPosition: '100% 50%' }}
          whileInView={{ backgroundPosition: '0% 50%' }}
          transition={{ duration: 3.5, ease: [0.6, 0.05, 0.01, 0.9], delay: 0.3 }}
          viewport={{ once: false }}
          style={{
            backgroundImage: 'linear-gradient(90deg, #2d2d2d 0%, #2d2d2d 50%, #bbb 50%, #bbb 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent'
          }}
        >
          Projects making a difference
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
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotateX: 0,
                transition: {
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }
              }}
              viewport={{ once: false, margin: "-80px" }}
              whileHover={{ 
                y: -20, 
                scale: 1.03,
                rotateX: 5,
                transition: { duration: 0.4 }
              }}
              onClick={() => navigate('/projects')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/projects');
                }
              }}
            >
              <motion.div 
                className="project-image-wrapper"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ 
                  duration: 1.2, 
                  delay: index * 0.12 + 0.2,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
                viewport={{ once: false }}
              >
                  <motion.img 
                  src={resolveImage(project)} 
                  alt={project.title}
                  initial={{ scale: 1.3 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    duration: 1.4, 
                    delay: index * 0.12 + 0.2,
                    ease: [0.6, 0.05, 0.01, 0.9]
                  }}
                  viewport={{ once: false }}
                />
                <motion.div 
                  className="project-overlay"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.12 + 0.5 }}
                  viewport={{ once: false }}
                >
                  <motion.span 
                    className="project-category"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: index * 0.12 + 0.6
                    }}
                    viewport={{ once: false }}
                  >
                    {project.category}
                  </motion.span>
                </motion.div>
              </motion.div>
              <motion.div 
                className="project-content"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.12 + 0.4,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
                viewport={{ once: false }}
              >
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12 + 0.5 }}
                  viewport={{ once: false }}
                >
                  {project.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.12 + 0.6 }}
                  viewport={{ once: false }}
                >
                  {project.description}
                </motion.p>
                <motion.div 
                  className="project-meta"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12 + 0.7 }}
                  viewport={{ once: false }}
                >
                  <motion.span 
                    className="project-impact"
                    whileHover={{ scale: 1.1, x: 5 }}
                  >
                    {project.impact}
                  </motion.span>
                  <motion.span 
                    className="project-location"
                    whileHover={{ scale: 1.05 }}
                  >
                    📍 {project.location}
                  </motion.span>
                </motion.div>
              </motion.div>
              
              {/* Shimmer effect on hover */}
              <motion.div
                className="project-shimmer"
                initial={{ x: '-100%', opacity: 0 }}
                whileHover={{ 
                  x: '200%', 
                  opacity: [0, 0.5, 0],
                  transition: { 
                    duration: 1.5,
                    ease: "linear"
                  }
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Projects;

