import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './admin/context/AuthContext';
import SplashScreen from './components/common/SplashScreen';
import MainWebsite from './MainWebsite';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CarbonCalculatorPage from './pages/CarbonCalculatorPage';
import TeamDetailPage from './pages/TeamDetailPage';
import TeamPage from './pages/TeamPage';
import AboutDetailPage from './pages/AboutDetailPage';
import AdminLogin from './admin/pages/Login';
import AdminLayout from './admin/components/AdminLayout';
import CarbonCalculator from './pages/CarbonCalculator';
import AdminReviews from './admin/pages/Reviews';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminDashboard from './admin/pages/Dashboard';
import AdminBlogs from './admin/pages/Blogs';
import AdminProjects from './admin/pages/Projects';
import AdminTeam from './admin/pages/Team';
import AdminStats from './admin/pages/Stats';
import AdminContacts from './admin/pages/Contacts';
import AdminAbout from './admin/pages/About';
import MediaGallery from './admin/pages/MediaGallery';
import AdminCategories from './admin/pages/Categories';
import AdminTags from './admin/pages/Tags';
import ProtectedRoute from './admin/components/ProtectedRoute';
import './App.css';
import './admin/styles/AdminGlobal.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          // Match your website's color palette
          colorPrimary: '#4a6741',        // Your accent-green
          colorSuccess: '#8b9d83',        // Your accent-sage
          colorInfo: '#4a6741',
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f8f7f4',       // Your primary-light
          colorText: '#2d2d2d',           // Your text-primary
          colorTextSecondary: '#6b6b6b',  // Your text-secondary
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
        },
        components: {
          Button: {
            borderRadius: 50,              // Rounded like your CTA buttons
            fontWeight: 500,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Table: {
            borderRadius: 8,
            headerBg: '#f8f7f4',
          },
          Card: {
            borderRadiusLG: 12,
          },
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Website */}
            <Route path="/" element={<MainWebsite />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/carbon-calculator" element={<CarbonCalculatorPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/team/:slug" element={<TeamDetailPage />} />
            <Route path="/about-us" element={<AboutDetailPage />} />
            <Route path="/carbon-calculator" element={<CarbonCalculator />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="media" element={<MediaGallery />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="tags" element={<AdminTags />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
