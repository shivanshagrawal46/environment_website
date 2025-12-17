import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Select, Modal } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { contactsAPI } from '../utils/api';
import dayjs from 'dayjs';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsAPI.getAll();
      setContacts(response.data);
    } catch (error) {
      message.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await contactsAPI.update(id, { status });
      message.success('Status updated');
      fetchContacts();
    } catch (error) {
      message.error('Failed to update');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select value={status} style={{ width: 130 }} onChange={(val) => handleStatusChange(record._id, val)}>
          <Select.Option value="new"><Tag color="blue">New</Tag></Select.Option>
          <Select.Option value="in_progress"><Tag color="orange">In Progress</Tag></Select.Option>
          <Select.Option value="resolved"><Tag color="green">Resolved</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => setViewModal(record)} />
          <Popconfirm title="Delete?" onConfirm={() => contactsAPI.delete(record._id).then(fetchContacts)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Contact Messages</h1>
      <Table columns={columns} dataSource={contacts} loading={loading} rowKey="_id" pagination={{ pageSize: 20 }} />

      <Modal title="Contact Message" open={!!viewModal} onCancel={() => setViewModal(null)} footer={null} width={600}>
        {viewModal && (
          <div>
            <p><strong>Name:</strong> {viewModal.name}</p>
            <p><strong>Email:</strong> {viewModal.email}</p>
            <p><strong>Phone:</strong> {viewModal.phone || 'N/A'}</p>
            <p><strong>Subject:</strong> {viewModal.subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>{viewModal.message}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Contacts;

