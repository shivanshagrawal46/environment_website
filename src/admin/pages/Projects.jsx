import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Image,
  DatePicker,
  Switch,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { projectsAPI, categoriesAPI } from '../utils/api';
import RichTextEditor from '../components/RichTextEditor';
import ImageSelector from '../components/ImageSelector';
import dayjs from 'dayjs';

const { Option } = Select;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();
  const [imageSelectorVisible, setImageSelectorVisible] = useState(false);
  const [imageField, setImageField] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ type: 'project' });
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error.response?.data || error.message);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      message.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProject(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
      partners: record.partners || [],
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await projectsAPI.delete(id);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      message.error('Failed to delete project');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };

      if (editingProject) {
        await projectsAPI.update(editingProject._id, data);
        message.success('Project updated successfully');
      } else {
        await projectsAPI.create(data);
        message.success('Project created successfully');
      }
      setModalVisible(false);
      fetchProjects();
    } catch (error) {
      message.error('Failed to save project');
    }
  };

  const openImageSelector = (field) => {
    setImageField(field);
    setImageSelectorVisible(true);
  };

  const handleImageSelect = (url) => {
    form.setFieldsValue({ [imageField]: url });
    setImageSelectorVisible(false);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'mainImage',
      key: 'mainImage',
      width: 80,
      render: (url, record) => {
        const imageUrl = url || record.image;
        return imageUrl ? (
          <Image src={imageUrl} width={60} height={60} style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 60, height: 60, background: '#f0f0f0' }} />
        );
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          planning: 'orange',
          active: 'green',
          completed: 'blue',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured) => (
        <Tag color={featured ? 'gold' : 'default'}>
          {featured ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this project?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Projects</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          New Project
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProject ? 'Edit Project' : 'Create Project'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={900}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Enter project title" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (URL-friendly)">
            <Input placeholder="auto-generated-if-empty" />
          </Form.Item>

          <Form.Item name="description" label="Short Description">
            <Input.TextArea rows={2} placeholder="Brief project description" />
          </Form.Item>

          <Form.Item name="content" label="Full Content (Detailed Project Information)">
            <RichTextEditor
              value={form.getFieldValue('content')}
              onChange={(value) => form.setFieldsValue({ content: value })}
            />
          </Form.Item>

          <Form.Item name="projectGoals" label="Project Goals">
            <RichTextEditor
              value={form.getFieldValue('projectGoals')}
              onChange={(value) => form.setFieldsValue({ projectGoals: value })}
              placeholder="Describe project goals and objectives..."
            />
          </Form.Item>

          <Form.Item name="communityImpact" label="Community Impact">
            <RichTextEditor
              value={form.getFieldValue('communityImpact')}
              onChange={(value) => form.setFieldsValue({ communityImpact: value })}
              placeholder="Describe how this project impacts communities..."
            />
          </Form.Item>

          <Form.Item name="results" label="Measurable Results">
            <RichTextEditor
              value={form.getFieldValue('results')}
              onChange={(value) => form.setFieldsValue({ results: value })}
              placeholder="Describe measurable results and achievements..."
            />
          </Form.Item>

          <Card title="Images" size="small" style={{ marginBottom: 16 }}>
            <Form.Item name="mainImage" label="Main Featured Image">
              <Input
                placeholder="Image URL"
                suffix={
                  <Button
                    type="link"
                    icon={<PictureOutlined />}
                    onClick={() => openImageSelector('mainImage')}
                  >
                    Select
                  </Button>
                }
              />
            </Form.Item>

            <Form.Item name="images" label="Additional Images (comma-separated URLs)">
              <Input.TextArea
                rows={2}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </Form.Item>
          </Card>

          <Form.Item name="category" label="Category">
            <Select placeholder="Select category" allowClear>
              {categories.map((cat) => (
                <Option key={cat._id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="Project location" />
          </Form.Item>

          <Form.Item name="impact" label="Impact">
            <Input.TextArea rows={2} placeholder="Project impact details" />
          </Form.Item>

          <Form.Item name="duration" label="Duration">
            <Input placeholder="e.g., 2023 - Ongoing or 2022 - 2024" />
          </Form.Item>

          <Form.Item name="partners" label="Partners (comma-separated)">
            <Select mode="tags" placeholder="Add partners (type and press enter)">
            </Select>
          </Form.Item>

          <Form.Item name="link" label="Project Link">
            <Input placeholder="https://..." />
          </Form.Item>

          <Space style={{ width: '100%' }}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker style={{ width: 200 }} />
            </Form.Item>

            <Form.Item name="endDate" label="End Date">
              <DatePicker style={{ width: 200 }} />
            </Form.Item>
          </Space>

          <Form.Item name="status" label="Status" initialValue="active">
            <Select>
              <Option value="planning">Planning</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="featured" label="Featured" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <ImageSelector
        open={imageSelectorVisible}
        onClose={() => setImageSelectorVisible(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
};

export default Projects;

