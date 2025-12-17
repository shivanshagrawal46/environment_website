import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { blogsData } from '../data/blogsData';
import '../styles/BlogDetail.css';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(blogsData);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'https://www.pcbfoundation.com/api';
  const BASE_URL = API_URL.replace('/api', '');

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

      return {
        ...item,
        displayImage,
        displayAvatar,
        displayDate: item.date || formatDate(item.publishedAt || item.createdAt),
        displayReadTime: item.readTime || '4 min read',
        displayExcerpt:
          item.excerpt ||
          (typeof item.content === 'string'
            ? stripHtml(item.content).slice(0, 180)
            : ''),
      };
    });
  }, [blogs, BASE_URL]);

  const blog = useMemo(
    () => normalizedBlogs.find((b) => b.slug === slug),
    [slug, normalizedBlogs]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs?status=published`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (list.length) setBlogs(list);
      } catch (err) {
        console.error('Blog fetch failed, using static data:', err.message);
        setBlogs(blogsData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [API_URL]);

  if (!blog && isLoading) {
    return (
      <div className="blog-detail-page">
        <Navigation />
        <div className="blog-not-found">
          <h1>Loading blog...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <Navigation />
        <div className="blog-not-found">
          <h1>Blog not found</h1>
          <button className="primary-btn" onClick={() => navigate('/blogs')}>Back to Blogs</button>
        </div>
        <Footer />
      </div>
    );
  }

  const renderContent = (item, index) => {
    switch (item.type) {
      case 'paragraph':
        return <p key={index} className="blog-paragraph">{item.text}</p>;
      case 'heading':
        return <h2 key={index} className="blog-section-heading">{item.text}</h2>;
      case 'list':
        return (
          <ul key={index} className="blog-list">
            {item.items.map((li, i) => (
              <li key={i}>{li}</li>
            ))}
          </ul>
        );
      case 'image':
        return (
          <div key={index} className="blog-image-container">
            <img src={item.src} alt={item.alt} className="blog-content-image" />
            {item.caption && <p className="image-caption">{item.caption}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const renderHtmlContent = (html) => {
    if (!html) return null;
    return (
      <div
        className="blog-html-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div className="blog-detail-page">
      <Navigation />

      <div className="blog-detail-wrapper">
        <article className="blog-article">
          {/* Author row */}
          <div className="blog-author-row">
            <img src={blog.displayAvatar || blog.authorAvatar} alt={blog.author} className="author-avatar" />
            <div className="author-info">
              <span className="author-name">{blog.author}</span>
              <div className="post-meta">
                <span>{blog.displayDate}</span>
                <span className="meta-separator">•</span>
                <span>{blog.displayReadTime}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="blog-article-title">{blog.title}</h1>

          {/* Rating */}
          <div className="blog-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-text">No ratings yet</span>
          </div>

          {/* Content */}
          <div className="blog-article-content">
            {Array.isArray(blog.content)
              ? blog.content.map((item, index) => renderContent(item, index))
              : renderHtmlContent(blog.content)}
          </div>

          {/* Featured Image (if available) - after content */}
          {blog.displayImage && (
            <div className="blog-featured-image-container">
              <img 
                src={blog.displayImage} 
                alt={blog.title} 
                className="blog-featured-image" 
              />
            </div>
          )}

          {/* Extra content */}
          {blog.extra && (
            <div className="blog-article-content">
              {renderHtmlContent(blog.extra)}
            </div>
          )}
        </article>
      </div>

      {/* Related posts */}
      <section className="related-posts-section">
        <div className="related-header">
          <h3>Recent Posts</h3>
          <button className="see-all-btn" onClick={() => navigate('/blogs')}>See All</button>
        </div>
        <div className="related-posts-grid">
          {normalizedBlogs.filter((b) => b.slug !== blog.slug).slice(0, 3).map((item) => (
            <motion.div 
              key={item.slug}
              className="related-post-card"
              onClick={() => navigate(`/blogs/${item.slug}`)}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <img src={item.displayImage || item.image} alt={item.title} className="related-post-img" />
              <div className="related-post-body">
                <h4>{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
