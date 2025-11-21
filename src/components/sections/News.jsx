import { motion } from 'framer-motion';
import '../../styles/News.css';

const newsItems = [
  {
    title: "TERRA Launches Largest Reforestation Project",
    excerpt: "New initiative aims to plant 1 million trees across Southeast Asia",
    date: "Nov 15, 2025",
    category: "Project Launch",
    image: "/images/download2.png"
  },
  {
    title: "Partnership with Global Tech Leaders",
    excerpt: "50 Fortune 500 companies join our carbon neutrality program",
    date: "Nov 10, 2025",
    category: "Partnership",
    image: "/images/download3.png"
  },
  {
    title: "Biodiversity Report 2025 Released",
    excerpt: "Annual report shows 40% increase in protected species",
    date: "Nov 5, 2025",
    category: "Research",
    image: "/images/download4.png"
  }
];

const News = () => {
  return (
    <section className="news" id="news">
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
        <h2 className="section-title">News & Insights</h2>
        <p className="news-subtitle">
          Stay updated with our latest projects, research, and environmental impact
        </p>
      </motion.div>

      <div className="news-grid">
        {newsItems.map((item, index) => (
          <motion.article
            key={index}
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
          >
            <div className="news-image">
              <img src={item.image} alt={item.title} />
              <span className="news-category">{item.category}</span>
            </div>
            <div className="news-content">
              <span className="news-date">{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <motion.a 
                href="#" 
                className="read-more"
                whileHover={{ x: 5 }}
              >
                Read More →
              </motion.a>
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
        >
          View All News
        </motion.button>
      </motion.div>
    </section>
  );
};

export default News;

