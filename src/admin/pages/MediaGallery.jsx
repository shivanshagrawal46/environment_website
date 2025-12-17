import { useState, useEffect } from 'react';
import {
  Upload,
  Button,
  Card,
  Image,
  Modal,
  Input,
  message,
  Spin,
  Empty,
  Popconfirm,
  Space,
  Pagination,
  Tag,
} from 'antd';
import {
  UploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { mediaAPI } from '../utils/api';
import '../styles/MediaGallery.css';

const { TextArea } = Input;

const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
 
  const API_URL = 'https://www.pcbfoundation.com';
  // Base URL for serving static uploads (without /api suffix)
  const BASE_URL = API_URL.replace('/api', '');

  useEffect(() => {
    fetchMedia();
  }, [pagination.current]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await mediaAPI.getAll({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setMedia(response.data.media);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
      });
    } catch (error) {
      message.error('Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await mediaAPI.upload(formData);
      message.success('Image uploaded successfully!');
      onSuccess(response.data);
      fetchMedia();
    } catch (error) {
      message.error(error.response?.data?.message || 'Upload failed');
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const copyURL = (url) => {
    const fullURL = `${BASE_URL}${url}`;
    navigator.clipboard.writeText(fullURL);
    message.success('URL copied to clipboard!');
  };

  const handleDelete = async (id) => {
    try {
      await mediaAPI.delete(id);
      message.success('Media deleted successfully');
      fetchMedia();
    } catch (error) {
      message.error('Failed to delete media');
    }
  };

  const handleEdit = (item) => {
    setSelectedMedia(item);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await mediaAPI.update(selectedMedia._id, {
        alt: selectedMedia.alt,
        caption: selectedMedia.caption,
      });
      message.success('Media updated successfully');
      setEditModalVisible(false);
      fetchMedia();
    } catch (error) {
      message.error('Failed to update media');
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    return true;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="media-gallery">
      <div className="media-gallery-header">
        <h1>Media Gallery</h1>
        <Upload
          customRequest={handleUpload}
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept="image/*"
          multiple
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={uploading}
            size="large"
          >
            Upload Images
          </Button>
        </Upload>
      </div>

      <div className="media-info">
        <p>
          <strong>Note:</strong> Images are automatically optimized to under 300KB
          and converted to WebP format for best performance.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : media.length === 0 ? (
        <Empty description="No media uploaded yet" />
      ) : (
        <>
          <div className="media-grid">
            {media.map((item) => (
              <Card
                key={item._id}
                hoverable
                cover={
                  <div className="media-image-wrapper">
                    <Image
                      src={`${BASE_URL}${item.url}`}
                      alt={item.alt || item.originalName}
                      preview={{
                        mask: <EyeOutlined />,
                      }}
                    />
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyURL(item.url)}
                    title="Copy URL"
                  >
                    Copy
                  </Button>,
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(item)}
                    title="Edit Details"
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Delete this media?"
                    description="This action cannot be undone"
                    onConfirm={() => handleDelete(item._id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      title="Delete"
                    >
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={
                    <div className="media-title">{item.originalName}</div>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div>
                        <Tag color="blue">{item.width} × {item.height}</Tag>
                        <Tag color="green">{formatFileSize(item.size)}</Tag>
                      </div>
                      {item.alt && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Alt: {item.alt}
                        </div>
                      )}
                    </Space>
                  }
                />
              </Card>
            ))}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page) => setPagination({ ...pagination, current: page })}
              showSizeChanger={false}
              showTotal={(total) => `Total ${total} images`}
            />
          </div>
        </>
      )}

      <Modal
        title="Edit Media Details"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
        okText="Save"
      >
        {selectedMedia && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Image
                src={`${BASE_URL}${selectedMedia.url}`}
                alt={selectedMedia.alt}
                style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Alt Text:
              </label>
              <Input
                value={selectedMedia.alt}
                onChange={(e) =>
                  setSelectedMedia({ ...selectedMedia, alt: e.target.value })
                }
                placeholder="Descriptive alt text for accessibility"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Caption:
              </label>
              <TextArea
                value={selectedMedia.caption}
                onChange={(e) =>
                  setSelectedMedia({ ...selectedMedia, caption: e.target.value })
                }
                placeholder="Optional caption"
                rows={3}
              />
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default MediaGallery;

