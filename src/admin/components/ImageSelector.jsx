import { useState, useEffect } from 'react';
import { Modal, Input, Image, Button, message, Spin, Empty, Pagination, Tabs } from 'antd';
import { PictureOutlined, LinkOutlined } from '@ant-design/icons';
import { mediaAPI } from '../utils/api';

const ImageSelector = ({ open, onClose, onSelect, multiple = false }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(multiple ? [] : null);
  const [urlInput, setUrlInput] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
 
  const API_URL = 'https://www.pcbfoundation.com';
  // Base URL for serving static uploads (without /api suffix)
  const BASE_URL = API_URL.replace('/api', '');

  useEffect(() => {
    if (open) {
      fetchMedia();
    }
  }, [open, pagination.current]);

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

  const handleSelect = (item) => {
    if (multiple) {
      const isSelected = selected.some((s) => s._id === item._id);
      if (isSelected) {
        setSelected(selected.filter((s) => s._id !== item._id));
      } else {
        setSelected([...selected, item]);
      }
    } else {
      setSelected(item);
    }
  };

  const handleConfirm = () => {
    if (multiple) {
      onSelect(selected.map((s) => `${BASE_URL}${s.url}`));
    } else if (selected) {
      onSelect(`${BASE_URL}${selected.url}`);
    }
    handleClose();
  };

  const handleURLSelect = () => {
    if (!urlInput.trim()) {
      message.warning('Please enter a URL');
      return;
    }
    if (multiple) {
      onSelect([urlInput.trim()]);
    } else {
      onSelect(urlInput.trim());
    }
    handleClose();
  };

  const handleClose = () => {
    setSelected(multiple ? [] : null);
    setUrlInput('');
    onClose();
  };

  const isSelected = (item) => {
    if (multiple) {
      return selected.some((s) => s._id === item._id);
    }
    return selected?._id === item._id;
  };

  const tabItems = [
    {
      key: 'gallery',
      label: 'Media Gallery',
      icon: <PictureOutlined />,
      children: loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : media.length === 0 ? (
        <Empty description="No media uploaded yet" />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}>
            {media.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelect(item)}
                style={{
                  cursor: 'pointer',
                  border: isSelected(item) ? '3px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                }}
              >
                <Image
                  src={`${BASE_URL}${item.url}`}
                  alt={item.alt}
                  preview={false}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(page) => setPagination({ ...pagination, current: page })}
            showSizeChanger={false}
            size="small"
          />
        </>
      ),
    },
    {
      key: 'url',
      label: 'External URL',
      icon: <LinkOutlined />,
      children: (
        <div>
          <Input
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onPressEnter={handleURLSelect}
          />
          <Button
            type="primary"
            onClick={handleURLSelect}
            style={{ marginTop: '16px' }}
          >
            Use This URL
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={`Select Image${multiple ? 's' : ''}`}
      open={open}
      onCancel={handleClose}
      onOk={handleConfirm}
      okText="Select"
      width={800}
      okButtonProps={{
        disabled: multiple ? selected.length === 0 : !selected,
      }}
    >
      <Tabs items={tabItems} />
    </Modal>
  );
};

export default ImageSelector;

