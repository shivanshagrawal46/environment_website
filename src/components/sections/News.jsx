import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogsData } from '../../data/blogsData';
import '../../styles/News.css';

const News = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(blogsData.slice(0, 3));
  const API_URL = import.meta.env.VITE_API_URL || 'https://www.pcbfoundation.com/api';
  const BASE_URL = useMemo(() => API_URL.replace('/api', ''), [API_URL]);

  const stripHtml = (html = '') => {
    if (typeof html !== 'string') return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const resolveMedia = (url = '') => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    return `${BASE_URL}${url}`;
  };

  const normalizedBlogs = useMemo(() => {
    return (blogs || []).slice(0, 3).map((item) => {
      const displayImage = resolveMedia(item.mainImage || item.coverImage || item.image);
      const fallbackExcerpt =
        typeof item.content === 'string'
          ? stripHtml(item.content).slice(0, 140)
          : '';
      const displayCategory = (item.tags && item.tags[0]) || item.category || 'Blog';
      return {
        ...item,
        displayImage,
        displayDate: item.date || formatDate(item.publishedAt || item.createdAt),
        displayExcerpt: item.excerpt || fallbackExcerpt,
        category: displayCategory,
      };
    });
  }, [blogs, BASE_URL]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs?status=published`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (list.length) setBlogs(list);
      } catch (err) {
        console.error('Home blogs fetch failed, using static data:', err.message);
        setBlogs(blogsData.slice(0, 3));
      }
    };
    fetchBlogs();
  }, [API_URL]);

  return (
    <section className="news" id="blogs">
      <motion.div
        className="news-header"
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
          Latest Updates
        </motion.span>
        <h2 className="section-title">Blogs</h2>
        <p className="news-subtitle">
          Stories, research, and insights from our environmental journey
        </p>
      </motion.div>

      <div className="news-grid">
        {normalizedBlogs.map((item, index) => (
          <motion.article
            key={item.slug || item._id || index}
            className="news-card"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: [0.6, 0.05, 0.01, 0.9]
            }}
            viewport={{ once: false, margin: "-80px" }}
            whileHover={{ y: -15, scale: 1.02 }}
            onClick={() => navigate('/blogs')}
          >
            <div className="news-image">
              <img src={item.displayImage || item.image} alt={item.title} />
              <span className="news-category">{item.category}</span>
            </div>
            <div className="news-content">
              <span className="news-date">{item.displayDate}</span>
              <h3>{item.title}</h3>
              <p>{item.displayExcerpt}</p>
              <motion.button 
                className="read-more"
                whileHover={{ x: 5 }}
                onClick={() => navigate('/blogs')}
              >
                Read More →
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="news-cta"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
        viewport={{ once: false, margin: "-100px" }}
      >
          <motion.button 
            className="cta-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/blogs')}
          >
            View All Blogs
          </motion.button>
      </motion.div>
    </section>
  );
};

export default News;

