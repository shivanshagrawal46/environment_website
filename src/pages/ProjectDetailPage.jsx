import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { projectsData } from '../data/projectsData';
import '../styles/ProjectDetail.css';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const API_URL = 'https://www.pcbfoundation.com/api';
  const BASE_URL = API_URL.replace('/api', '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/projects/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch project');
        const data = await res.json();
        const payload = data?.data || data;
        if (!payload) throw new Error('Empty project data');
        console.log('Fetched project:', payload);
        console.log('Project mainImage:', payload.mainImage);
        console.log('Project image:', payload.image);
        console.log('BASE_URL:', BASE_URL);
        setProject(payload);
      } catch (err) {
        console.error('Project fetch failed, using static data:', err.message);
        // Fallback to static data
        const staticProject = projectsData.find((p) => p.slug === slug);
        console.log('Using static project:', staticProject);
        setProject(staticProject || null);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/projects`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        const payload = Array.isArray(data) ? data : (data?.data || []);
        setAllProjects(payload);
      } catch (err) {
        console.error('All projects fetch failed, using static data');
        setAllProjects(projectsData);
      }
    };

    fetchProject();
    fetchAllProjects();
  }, [API_URL, slug]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <Navigation />
        <div className="project-not-found">
          <h1>Loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <Navigation />
        <div className="project-not-found">
          <h1>Project not found</h1>
          <button className="primary-btn" onClick={() => navigate('/projects')}>Back to Projects</button>
        </div>
        <Footer />
      </div>
    );
  }

  const resolveImage = (p) => {
    const url = p?.mainImage || p?.image;
    if (!url) {
      console.log('No image URL found for project:', p);
      return '';
    }
    const resolved = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    console.log('Resolved image URL:', resolved);
    return resolved;
  };

  const renderContentBlocks = (content) => {
    if (!content) return null;
    // If content is array of blocks
    if (Array.isArray(content)) {
      return content.map((item, index) => {
        switch (item.type) {
          case 'paragraph':
            return <p key={index} className="project-paragraph">{item.text}</p>;
          case 'heading':
            return <h2 key={index} className="project-section-heading">{item.text}</h2>;
          case 'list':
            return (
              <ul key={index} className="project-list">
                {item.items.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            );
          case 'image':
            return (
              <div key={index} className="project-image-container">
                <img src={item.src?.startsWith('http') ? item.src : `${BASE_URL}${item.src}`} alt={item.alt} className="project-content-image" />
                {item.caption && <p className="image-caption">{item.caption}</p>}
              </div>
            );
          default:
            return null;
        }
      });
    }
    // If content is HTML string from API, fix relative image URLs
    if (typeof content === 'string') {
      const processedHTML = content.replace(
        /src="(\/[^"]+)"/g,
        `src="${BASE_URL}$1"`
      );
      return <div className="project-html" dangerouslySetInnerHTML={{ __html: processedHTML }} />;
    }
    return null;
  };

  return (
    <div className="project-detail-page">
      <Navigation />

      <div className="project-detail-wrapper">
        <article className="project-article">
          {/* Category and Status */}
          <div className="project-meta-badges">
            <span className="project-category-badge">{project.category}</span>
            <span className={`project-status-badge ${project.status.toLowerCase()}`}>
              {project.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="project-article-title">{project.title}</h1>

          {/* Meta Info */}
          <div className="project-meta-info">
            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="meta-value">{project.location}</span>
            </div>
            <span className="meta-separator">•</span>
            <div className="meta-item">
              <span className="meta-label">Duration:</span>
              <span className="meta-value">{project.duration}</span>
            </div>
            <span className="meta-separator">•</span>
            <div className="meta-item">
              <span className="meta-label">Impact:</span>
              <span className="meta-value">{project.impact}</span>
            </div>
          </div>

          {/* Partners */}
          {project.partners && project.partners.length > 0 && (
            <div className="project-partners">
              <span className="partners-label">Partners:</span>
              <div className="partners-list">
                {project.partners.map((partner, idx) => (
                  <span key={idx} className="partner-tag">{partner}</span>
                ))}
              </div>
            </div>
          )}

          <div className="project-divider"></div>

          {/* Content */}
          <div className="project-article-content">
            {renderContentBlocks(project.content)}
          </div>

          {/* Hero/Main Image */}
          {resolveImage(project) && (
            <div className="project-hero-image">
              <img 
                src={resolveImage(project)} 
                alt={project.title}
                onError={(e) => {
                  console.error('Hero image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Project Goals */}
          {project.projectGoals && (
            <div className="project-article-content">
              <h2 className="project-section-heading">Project Goals</h2>
              {renderContentBlocks(project.projectGoals)}
            </div>
          )}

          {/* Community Impact */}
          {project.communityImpact && (
            <div className="project-article-content">
              <h2 className="project-section-heading">Community Impact</h2>
              {renderContentBlocks(project.communityImpact)}
            </div>
          )}

          {/* Measurable Results */}
          {project.results && (
            <div className="project-article-content">
              <h2 className="project-section-heading">Measurable Results</h2>
              {renderContentBlocks(project.results)}
            </div>
          )}

          {/* Back Button */}
          <div className="project-actions">
            <button className="secondary-btn" onClick={() => navigate('/projects')}>
              ← Back to Projects
            </button>
            <button className="primary-btn" onClick={() => navigate('/contact')}>
              Support This Project
            </button>
          </div>
        </article>
      </div>

      {/* Related Projects */}
      <section className="related-projects-section">
        <div className="related-header">
          <h3>More Projects</h3>
          <button className="see-all-btn" onClick={() => navigate('/projects')}>See All</button>
        </div>
        <div className="related-projects-grid">
          {allProjects.filter((p) => p.slug !== project.slug).slice(0, 3).map((item) => {
            const itemImage = item.mainImage || item.image;
            const itemImageUrl = itemImage?.startsWith('http') ? itemImage : `${BASE_URL}${itemImage}`;
            
            return (
              <motion.div 
                key={item.slug || item._id}
                className="related-project-card"
                onClick={() => navigate(`/projects/${item.slug}`)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <img src={itemImageUrl} alt={item.title} className="related-project-img" />
                <div className="related-project-body">
                  <span className="related-category">{item.category}</span>
                  <h4>{item.title}</h4>
                  <p className="related-impact">{item.impact}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;

