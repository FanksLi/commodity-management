import { Card, Spin } from 'antd';

export default function Loading() {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    </Card>
  );
}