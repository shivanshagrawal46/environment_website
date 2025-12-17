import { useEffect, useMemo, useState } from 'react';
import { Card, InputNumber, message, Spin, Row, Col } from 'antd';
import { statsAPI } from '../utils/api';

const FIXED_LABELS = [
  "Trees Planted",
  "Corporate Partners",
  "Hectares Restored",
  "Client Retention",
  "Countries",
  "Tons CO2 Offset",
  "Species Protected",
  "Lives Impacted",
];

const Stats = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({});

  const sortedLabels = useMemo(() => FIXED_LABELS, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await statsAPI.getAll();
      const map = {};
      res.data.forEach((item) => {
        map[item.label] = item.value;
      });
      setValues(map);
    } catch (err) {
      message.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleChange = async (label, val) => {
    const value = Number(val) || 0;
    setValues((prev) => ({ ...prev, [label]: value }));
    try {
      await statsAPI.createOrUpdate({ label, value });
      message.success('Updated');
    } catch (err) {
      message.error('Failed to update');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <h1>Statistics</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>Only numbers are editable. Labels are fixed.</p>
      <Row gutter={[16, 16]}>
        {sortedLabels.map((label) => (
          <Col xs={24} sm={12} lg={8} key={label}>
            <Card title={label}>
              <InputNumber
                style={{ width: '100%' }}
                value={values[label] ?? 0}
                min={0}
                onChange={(val) => handleChange(label, val)}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Stats;

