import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Spin } from 'antd';
import {
  FileTextOutlined,
  ProjectOutlined,
  TeamOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { blogsAPI, projectsAPI, teamAPI, contactsAPI } from '../utils/api';
import '../../styles/AdminDashboardBanner.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    team: 0,
    contacts: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [blogs, projects, team, contacts] = await Promise.all([
        blogsAPI.getAll('all'),
        projectsAPI.getAll(),
        teamAPI.getAll(),
        contactsAPI.getAll(),
      ]);

      setStats({
        blogs: blogs.data.length,
        projects: projects.data.length,
        team: team.data.length,
        contacts: contacts.data.length,
      });

      setRecentBlogs(blogs.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div className="dashboard-banner">
        <div className="banner-track">
          <span className="banner-text">Welcome Kartikey Sir &amp; Himanshu Sir • We’re delighted to have you here • Let’s build a greener future together •</span>
          <span className="banner-text">Welcome Kartikey Sir &amp; Himanshu Sir • We’re delighted to have you here • Let’s build a greener future together •</span>
        </div>
      </div>
      <h1 style={{ marginTop: 16 }}>Dashboard</h1>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Blog Posts"
              value={stats.blogs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Projects"
              value={stats.projects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Team Members"
              value={stats.team}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Contact Messages"
              value={stats.contacts}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Blog Posts" style={{ marginTop: 24 }}>
        <List
          dataSource={recentBlogs}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={`By ${item.author} • ${item.status}`}
              />
              <Tag color={item.status === 'published' ? 'green' : 'orange'}>
                {item.status}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;

