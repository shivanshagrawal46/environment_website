import { useState } from 'react';
import { Layout, Menu, theme, Button, Dropdown, Modal, Form, Input, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  ProjectOutlined,
  TeamOutlined,
  BarChartOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TagsOutlined,
  FolderOutlined,
  StarOutlined,
  LockOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminLayout.css';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm] = Form.useForm();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/blogs',
      icon: <FileTextOutlined />,
      label: 'Blogs',
    },
    {
      key: '/admin/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
    },
    {
      key: '/admin/team',
      icon: <TeamOutlined />,
      label: 'Team',
    },
    {
      key: '/admin/stats',
      icon: <BarChartOutlined />,
      label: 'Statistics',
    },
    {
      key: '/admin/reviews',
      icon: <StarOutlined />,
      label: 'Reviews',
    },
    {
      key: '/admin/contacts',
      icon: <MessageOutlined />,
      label: 'Contacts',
    },
    {
      key: '/admin/about',
      icon: <InfoCircleOutlined />,
      label: 'About Page',
    },
    {
      key: '/admin/media',
      icon: <PictureOutlined />,
      label: 'Media Gallery',
    },
    {
      key: '/admin/categories',
      icon: <FolderOutlined />,
      label: 'Project Categories',
    },
    {
      key: '/admin/tags',
      icon: <TagsOutlined />,
      label: 'Blog Tags',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const openPasswordModal = () => {
    passwordForm.resetFields();
    setPasswordModalOpen(true);
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      const { currentPassword, newPassword, confirmPassword } = values;
      if (newPassword !== confirmPassword) {
        message.error('New password and confirmation do not match');
        return;
      }
      const { authAPI } = await import('../utils/api');
      await authAPI.changePassword({ currentPassword, newPassword });
      message.success('Password updated successfully');
      setPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (err) {
      if (err?.errorFields) {
        return;
      }
      message.error(err?.response?.data?.message || 'Failed to update password');
    }
  };

  const userMenuItems = [
    {
      key: 'changePassword',
      icon: <LockOutlined />,
      label: 'Change Password',
      onClick: openPasswordModal,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div className="admin-logo">
          <img src="/images/logo_pcb.png" alt="PCB Foundation" />
          {!collapsed && <span>PCB Foundation</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button icon={<UserOutlined />}>
              {user?.username || 'Admin'}
            </Button>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>

        <Modal
          title="Change Password"
          open={passwordModalOpen}
          onCancel={() => setPasswordModalOpen(false)}
          onOk={handlePasswordChange}
          okText="Update Password"
        >
          <Form
            form={passwordForm}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 6, message: 'Password should be at least 6 characters' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

