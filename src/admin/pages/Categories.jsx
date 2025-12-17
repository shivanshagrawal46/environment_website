import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select, InputNumber, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { categoriesAPI } from '../utils/api';

const { Option } = Select;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Only fetch project categories
      const response = await categoriesAPI.getAll({ type: 'project' });
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Category fetch error:', error.response?.data || error.message);
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Ensure type is always set to 'project' for project categories
      const data = { ...values, type: 'project' };
      
      if (editing) {
        await categoriesAPI.update(editing._id, data);
        message.success('Category updated successfully');
      } else {
        await categoriesAPI.create(data);
        message.success('Category created successfully');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Save category error:', error.response?.data || error.message);
      message.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text, record) => (
        <Space>
          <Tag color={record.color}>{text}</Tag>
        </Space>
      ),
    },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Order', dataIndex: 'order', key: 'order', width: 80 },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => { 
              setEditing(record); 
              form.setFieldsValue(record); 
              setModalVisible(true); 
            }} 
          />
          <Popconfirm 
            title="Delete this category?" 
            onConfirm={() => categoriesAPI.delete(record._id).then(fetchCategories)}
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
        <div>
          <h1>Project Categories</h1>
          <p style={{ color: '#6b6b6b', margin: 0 }}>Manage categories for projects</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => { 
            setEditing(null); 
            form.resetFields(); 
            setModalVisible(true); 
          }} 
          size="large"
        >
          Add Category
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} loading={loading} rowKey="_id" />

      <Modal 
        title={editing ? 'Edit Category' : 'Add Category'} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onOk={handleSubmit} 
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Conservation" />
          </Form.Item>
          <Form.Item name="slug" label="Slug (auto-generated if empty)">
            <Input placeholder="conservation" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Short description" />
          </Form.Item>
          <Form.Item name="color" label="Tag Color" initialValue="#4a6741">
            <Input type="color" style={{ width: 100 }} />
          </Form.Item>
          <Form.Item name="order" label="Display Order" initialValue={0}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;

