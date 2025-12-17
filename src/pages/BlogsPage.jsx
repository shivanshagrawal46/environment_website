import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { blogsData } from '../data/blogsData';
import '../styles/BlogsPage.css';

const BlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(blogsData);
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
    return (blogs || []).map((item) => {
      const displayImage = resolveMedia(item.mainImage || item.coverImage || item.image);
      const displayAvatar = resolveMedia(item.authorAvatar || item.authorImage);
      const fallbackExcerpt =
        typeof item.content === 'string'
          ? stripHtml(item.content).slice(0, 180)
          : '';
      const excerpt = item.excerpt || fallbackExcerpt;

      return {
        ...item,
        displayImage,
        displayAvatar,
        displayDate: item.date || formatDate(item.publishedAt || item.createdAt),
        displayReadTime: item.readTime || '4 min read',
        displayExcerpt: excerpt,
      };
    });
  }, [blogs, BASE_URL]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs?status=published`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (list.length) {
          setBlogs(list);
        }
      } catch (err) {
        console.error('Blogs fetch failed, using static data:', err.message);
        setBlogs(blogsData);
      }
    };
    fetchBlogs();
  }, [API_URL]);

  return (
    <div className="blogs-page">
      <Navigation />

      <section className="blogs-listing-section">
        <div className="blogs-container">
          <h1 className="blogs-page-title">Latest Blog Posts</h1>

          <div className="blogs-list">
            {normalizedBlogs.map((item, index) => (
              <motion.article
                key={item.slug || item._id || index}
                className="blog-list-item"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/blogs/${item.slug}`)}
              >
                <div className="blog-item-image">
                  <img src={item.displayImage || item.image} alt={item.title} />
                </div>
                <div className="blog-item-content">
                  <h2 className="blog-item-title">{item.title}</h2>
                  <p className="blog-item-excerpt">{item.displayExcerpt}</p>
                  <div className="blog-item-meta">
                    <img src={item.displayAvatar || item.authorAvatar} alt={item.author} className="blog-item-avatar" />
                    <span className="blog-item-author">{item.author}</span>
                    <span className="blog-meta-separator">•</span>
                    <span className="blog-item-date">{item.displayDate}</span>
                    <span className="blog-meta-separator">•</span>
                    <span className="blog-item-readtime">{item.displayReadTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogsPage;
