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
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { blogsAPI, tagsAPI } from '../utils/api';
import RichTextEditor from '../components/RichTextEditor';
import ImageSelector from '../components/ImageSelector';
import dayjs from 'dayjs';

const { Option } = Select;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();
  const [imageSelectorVisible, setImageSelectorVisible] = useState(false);
  const [imageField, setImageField] = useState('');
  const [multiImageSelector, setMultiImageSelector] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getAll();
      setTags(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error.response?.data || error.message);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogsAPI.getAll('all');
      setBlogs(response.data);
    } catch (error) {
      message.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBlog(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBlog(record);
    form.setFieldsValue({
      ...record,
      tags: record.tags || [],
      images: record.images || [],
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await blogsAPI.delete(id);
      message.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      message.error('Failed to delete blog');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingBlog) {
        await blogsAPI.update(editingBlog._id, values);
        message.success('Blog updated successfully');
      } else {
        await blogsAPI.create(values);
        message.success('Blog created successfully');
      }
      setModalVisible(false);
      fetchBlogs();
    } catch (error) {
      message.error('Failed to save blog');
    }
  };

  const openImageSelector = (field, multi = false) => {
    setImageField(field);
    setMultiImageSelector(multi);
    setImageSelectorVisible(true);
  };

  const handleImageSelect = (url) => {
    if (multiImageSelector) {
      form.setFieldsValue({ [imageField]: url });
    } else {
      form.setFieldsValue({ [imageField]: url });
    }
    setImageSelectorVisible(false);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'mainImage',
      key: 'mainImage',
      width: 80,
      render: (url) =>
        url ? (
          <Image src={url} width={60} height={60} style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 60, height: 60, background: '#f0f0f0' }} />
        ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Published',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date) => (date ? dayjs(date).format('MMM D, YYYY') : '-'),
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
            title="Delete this blog?"
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
        <h1>Blog Posts</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          New Blog Post
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
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
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (URL-friendly)">
            <Input placeholder="auto-generated-if-empty" />
          </Form.Item>

          <Form.Item name="excerpt" label="Excerpt">
            <Input.TextArea rows={2} placeholder="Short description" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <RichTextEditor
              value={form.getFieldValue('content')}
              onChange={(value) => form.setFieldsValue({ content: value })}
            />
          </Form.Item>

          <Form.Item name="extra" label="Extra Content (Optional)">
            <RichTextEditor
              value={form.getFieldValue('extra')}
              onChange={(value) => form.setFieldsValue({ extra: value })}
              placeholder="Add any additional content, notes, or supplementary information..."
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

          <Card title="Author Info" size="small" style={{ marginBottom: 16 }}>
            <Form.Item name="author" label="Author Name">
              <Input placeholder="Author name" />
            </Form.Item>

            <Form.Item name="authorImage" label="Author Image">
              <Input
                placeholder="Author image URL"
                suffix={
                  <Button
                    type="link"
                    icon={<PictureOutlined />}
                    onClick={() => openImageSelector('authorImage')}
                  >
                    Select
                  </Button>
                }
              />
            </Form.Item>

            <Form.Item name="authorAvatar" label="Author Avatar">
              <Input
                placeholder="Author avatar URL"
                suffix={
                  <Button
                    type="link"
                    icon={<PictureOutlined />}
                    onClick={() => openImageSelector('authorAvatar')}
                  >
                    Select
                  </Button>
                }
              />
            </Form.Item>

            <Form.Item name="readTime" label="Read Time">
              <Input placeholder="e.g., 5 min read" />
            </Form.Item>
          </Card>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags or create new">
              {tags.map((tag) => (
                <Option key={tag._id} value={tag.name}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="draft">
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="published">Published</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ImageSelector
        open={imageSelectorVisible}
        onClose={() => setImageSelectorVisible(false)}
        onSelect={handleImageSelect}
        multiple={multiImageSelector}
      />
    </div>
  );
};

export default Blogs;

