import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { aboutAPI } from '../utils/api';
import RichTextEditor from '../components/RichTextEditor';

const About = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const response = await aboutAPI.get();
      if (response.data) {
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch about content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const values = await form.validateFields();
      await aboutAPI.update(values);
      message.success('About page updated successfully');
    } catch (error) {
      message.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>About Page</h1>
        <Button type="primary" onClick={handleSubmit} loading={saving} size="large">Save Changes</Button>
      </div>

      <Form form={form} layout="vertical">
        <Card title="Hero Section" style={{ marginBottom: 16 }}>
          <Form.Item name="heroTitle" label="Hero Title">
            <Input placeholder="About Us" />
          </Form.Item>
          <Form.Item name="heroSubtitle" label="Hero Subtitle">
            <Input placeholder="Subtitle text" />
          </Form.Item>
          <Form.Item name="heroImage" label="Hero Image URL">
            <Input placeholder="https://example.com/hero.jpg" />
          </Form.Item>
        </Card>

        <Card title="Content" style={{ marginBottom: 16 }}>
          <Form.Item name="body" label="Main Content">
            <RichTextEditor
              value={form.getFieldValue('body')}
              onChange={(value) => form.setFieldsValue({ body: value })}
            />
          </Form.Item>

          <Form.Item name="mission" label="Mission">
            <Input.TextArea rows={3} placeholder="Our mission..." />
          </Form.Item>

          <Form.Item name="vision" label="Vision">
            <Input.TextArea rows={3} placeholder="Our vision..." />
          </Form.Item>

          <Form.Item name="story" label="Our Story / Journey">
            <RichTextEditor
              value={form.getFieldValue('story')}
              onChange={(value) => form.setFieldsValue({ story: value })}
            />
          </Form.Item>
        </Card>

        <Card title="Highlights">
          <Form.List name="highlights">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'title']} rules={[{ required: true }]}>
                      <Input placeholder="Highlight Title" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'description']} rules={[{ required: true }]}>
                      <Input placeholder="Description" style={{ width: 350 }} />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Highlight
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="Values" style={{ marginBottom: 16 }}>
          <Form.List name="values">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={name} style={{ width: 400 }}>
                      <Input placeholder="Value (e.g., Community-centered approaches)" />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Value
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="Key Milestones" style={{ marginBottom: 16 }}>
          <Form.List name="milestones">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8, flexWrap: 'wrap' }} align="baseline">
                    <Form.Item {...restField} name={[name, 'year']} style={{ width: 100 }}>
                      <Input placeholder="Year" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'title']} style={{ width: 200 }}>
                      <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'description']} style={{ width: 320 }}>
                      <Input placeholder="Description" />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Milestone
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="Impact Stats" style={{ marginBottom: 16 }}>
          <Form.List name="impactStats">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8, flexWrap: 'wrap' }} align="baseline">
                    <Form.Item {...restField} name={[name, 'value']} style={{ width: 120 }}>
                      <Input placeholder="Value (e.g., 2.5M)" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'label']} style={{ width: 200 }}>
                      <Input placeholder="Label (e.g., Hectares Protected)" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'description']} style={{ width: 320 }}>
                      <Input placeholder="Description" />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Stat
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
      </Form>
    </div>
  );
};

export default About;

