import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Switch, InputNumber, Image, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined, DeleteOutlined as DelIcon } from '@ant-design/icons';
import { teamAPI } from '../utils/api';
import ImageSelector from '../components/ImageSelector';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [imageSelectorVisible, setImageSelectorVisible] = useState(false);
  const [imageField, setImageField] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await teamAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      message.error('Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await teamAPI.update(editing._id, values);
        message.success('Updated successfully');
      } else {
        await teamAPI.create(values);
        message.success('Created successfully');
      }
      setModalVisible(false);
      fetchMembers();
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (url) => url ? <Image src={url} width={60} height={60} style={{ objectFit: 'cover', borderRadius: '50%' }} /> : <div style={{ width: 60, height: 60, background: '#f0f0f0', borderRadius: '50%' }} />,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Order', dataIndex: 'order', key: 'order', width: 80 },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => { setEditing(record); form.setFieldsValue(record); setModalVisible(true); }} />
          <Popconfirm title="Delete?" onConfirm={() => teamAPI.delete(record._id).then(fetchMembers)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Team Members</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalVisible(true); }} size="large">Add Member</Button>
      </div>

      <Table columns={columns} dataSource={members} loading={loading} rowKey="_id" />

      <Modal title={editing ? 'Edit Member' : 'Add Member'} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleSubmit} okText="Save" width={720}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug (URL-friendly)">
            <Input placeholder="auto-generated-if-empty" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Short Bio">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="detailedBio" label="Detailed Bio">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="photo" label="Profile Photo">
            <Input
              suffix={
                <Button type="link" icon={<PictureOutlined />} onClick={() => { setImageField('photo'); setImageSelectorVisible(true); }}>
                  Select
                </Button>
              }
            />
          </Form.Item>

          <Form.Item name="coverImage" label="Cover Image">
            <Input
              suffix={
                <Button type="link" icon={<PictureOutlined />} onClick={() => { setImageField('coverImage'); setImageSelectorVisible(true); }}>
                  Select
                </Button>
              }
            />
          </Form.Item>

          <Form.Item name="expertise" label="Areas of Expertise">
            <Select mode="tags" placeholder="Add expertise (press enter to add)" />
          </Form.Item>

          <Form.List name="achievements">
            {(fields, { add, remove }) => (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontWeight: 600 }}>Key Achievements</label>
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
                    Add Achievement
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8, width: '100%' }} align="baseline">
                    <Form.Item {...restField} name={name} style={{ flex: 1 }}>
                      <Input placeholder="Achievement" />
                    </Form.Item>
                    <Button type="text" danger icon={<DelIcon />} onClick={() => remove(name)} />
                  </Space>
                ))}
              </div>
            )}
          </Form.List>

          <Form.Item name="education" label="Education">
            <Input />
          </Form.Item>

          <Form.Item name="yearsOfExperience" label="Years of Experience">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item name="order" label="Display Order" initialValue={0}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name={['socials', 'linkedin']} label="LinkedIn URL">
            <Input />
          </Form.Item>
          <Form.Item name={['socials', 'twitter']} label="Twitter URL">
            <Input />
          </Form.Item>
          <Form.Item name={['socials', 'instagram']} label="Instagram URL">
            <Input />
          </Form.Item>
          <Form.Item name="active" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <ImageSelector
        open={imageSelectorVisible}
        onClose={() => setImageSelectorVisible(false)}
        onSelect={(url) => {
          if (imageField) {
            form.setFieldsValue({ [imageField]: url });
          }
          setImageSelectorVisible(false);
        }}
      />
    </div>
  );
};

export default Team;

