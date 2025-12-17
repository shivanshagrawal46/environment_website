import { useEffect, useState } from 'react';
import { Card, Table, Button, Form, Input, Space, Popconfirm, message } from 'antd';
import { reviewsAPI } from '../utils/api';

const Reviews = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewsAPI.getAll();
      setData(res.data);
    } catch (err) {
      message.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await reviewsAPI.update(editing._id, values);
        message.success('Review updated');
      } else {
        if (data.length >= 3) {
          message.error('Only 3 reviews allowed.');
          return;
        }
        await reviewsAPI.create(values);
        message.success('Review created');
      }
      form.resetFields();
      setEditing(null);
      fetchReviews();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save review';
      message.error(msg);
    }
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id) => {
    try {
      await reviewsAPI.delete(id);
      message.success('Review deleted');
      fetchReviews();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to delete review';
      message.error(msg);
    }
  };

  const columns = [
    { title: 'Reviewer', dataIndex: 'reviewerName', key: 'reviewerName' },
    { title: 'Company', dataIndex: 'reviewerCompany', key: 'reviewerCompany' },
    { title: 'Tag', dataIndex: 'tagName', key: 'tagName' },
    { title: 'Review', dataIndex: 'review', key: 'review' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Reviews (max 3)</h1>
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical">
          <Form.Item name="review" label="Review" rules={[{ required: true, message: 'Enter review text' }]}>
            <Input.TextArea rows={3} placeholder="Write the review" />
          </Form.Item>
          <Form.Item name="reviewerName" label="Reviewer Name" rules={[{ required: true, message: 'Enter reviewer name' }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="reviewerCompany" label="Reviewer Company">
            <Input placeholder="Company" />
          </Form.Item>
          <Form.Item name="tagName" label="Tag Name">
            <Input placeholder="Tag (e.g., CEO, Partner)" />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={handleSubmit}>
              {editing ? 'Update' : 'Create'}
            </Button>
            <Button onClick={() => { form.resetFields(); setEditing(null); }}>
              Reset
            </Button>
          </Space>
        </Form>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Reviews;

