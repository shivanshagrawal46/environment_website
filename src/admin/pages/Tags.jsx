import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Tag as AntTag, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import { tagsAPI } from '../utils/api';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await tagsAPI.getAll();
      setTags(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error.response?.data || error.message);
      message.error('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await tagsAPI.update(editing._id, values);
        message.success('Tag updated successfully');
      } else {
        await tagsAPI.create(values);
        message.success('Tag created successfully');
      }
      setModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error('Failed to save tag');
    }
  };

  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text, record) => (
        <AntTag icon={<TagOutlined />} color={record.color}>{text}</AntTag>
      ),
    },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: 'Usage Count', 
      dataIndex: 'usageCount', 
      key: 'usageCount', 
      width: 120,
      sorter: (a, b) => a.usageCount - b.usageCount,
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
            onClick={() => { 
              setEditing(record); 
              form.setFieldsValue(record); 
              setModalVisible(true); 
            }} 
          />
          <Popconfirm 
            title="Delete this tag?" 
            description="This will not delete it from existing blogs"
            onConfirm={() => tagsAPI.delete(record._id).then(fetchTags)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Tags</h1>
          <p style={{ color: '#6b6b6b', margin: 0 }}>Manage blog tags</p>
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
          Add Tag
        </Button>
      </div>

      <Table columns={columns} dataSource={tags} loading={loading} rowKey="_id" />

      <Modal 
        title={editing ? 'Edit Tag' : 'Add Tag'} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onOk={handleSubmit} 
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tag Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Environment" />
          </Form.Item>
          <Form.Item name="slug" label="Slug (auto-generated if empty)">
            <Input placeholder="environment" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="What this tag represents" />
          </Form.Item>
          <Form.Item name="color" label="Tag Color" initialValue="#8b9d83">
            <Input type="color" style={{ width: 100 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tags;

