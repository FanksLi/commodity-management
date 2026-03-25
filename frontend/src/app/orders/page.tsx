'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  DatePicker,
  Popconfirm,
  message,
  Modal,
  Descriptions,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { orderApi } from '@/services/order';
import { Order } from '@/types';
import dayjs from 'dayjs';

const typeMap: Record<string, { color: string; text: string }> = {
  purchase: { color: 'blue', text: '采购订单' },
  sale: { color: 'green', text: '销售订单' },
  return: { color: 'orange', text: '退货订单' },
};

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'default', text: '待确认' },
  confirmed: { color: 'blue', text: '已确认' },
  paid: { color: 'cyan', text: '已付款' },
  shipped: { color: 'purple', text: '已发货' },
  completed: { color: 'green', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' },
};

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAll({
        ...searchParams,
        page,
        limit: pageSize,
      });
      setOrders(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleViewDetail = async (id: string) => {
    try {
      const order = await orderApi.getById(id);
      setCurrentOrder(order);
      setDetailVisible(true);
    } catch (error) {
      message.error('获取订单详情失败');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateStatus(id, status);
      message.success('状态更新成功');
      fetchOrders();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config = typeMap[type] || typeMap.sale;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier: any) => supplier?.name || '-',
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount?.toFixed(2) || '0.00'}`,
    },
    {
      title: '已付金额',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount: number) => `¥${amount?.toFixed(2) || '0.00'}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusMap[status] || statusMap.pending;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record._id)}>
            <EyeOutlined />
          </Button>
          {record.status === 'pending' && (
            <Popconfirm title="确认订单?" onConfirm={() => handleUpdateStatus(record._id, 'confirmed')}>
              <Button type="link" size="small">
                <CheckCircleOutlined />
              </Button>
            </Popconfirm>
          )}
          {['pending', 'confirmed'].includes(record.status) && (
            <Popconfirm title="取消订单?" onConfirm={() => handleUpdateStatus(record._id, 'cancelled')}>
              <Button type="link" size="small" danger>
                <CloseCircleOutlined />
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="订单号"
            value={searchParams.orderNo}
            onChange={(e) => setSearchParams({ ...searchParams, orderNo: e.target.value })}
            style={{ width: 150 }}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="订单类型"
            value={searchParams.type}
            onChange={(value) => setSearchParams({ ...searchParams, type: value })}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: 'purchase', label: '采购订单' },
              { value: 'sale', label: '销售订单' },
              { value: 'return', label: '退货订单' },
            ]}
          />
          <Select
            placeholder="状态"
            value={searchParams.status}
            onChange={(value) => setSearchParams({ ...searchParams, status: value })}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: 'pending', label: '待确认' },
              { value: 'confirmed', label: '已确认' },
              { value: 'paid', label: '已付款' },
              { value: 'shipped', label: '已发货' },
              { value: 'completed', label: '已完成' },
              { value: 'cancelled', label: '已取消' },
            ]}
          />
          <DatePicker.RangePicker
            onChange={(dates) =>
              setSearchParams({
                ...searchParams,
                startDate: dates?.[0]?.format('YYYY-MM-DD'),
                endDate: dates?.[1]?.format('YYYY-MM-DD'),
              })
            }
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </Space>
      </Card>

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
            }}
          />
        </Spin>
      </Card>

      <Modal
        title="订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {currentOrder && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="订单号">{currentOrder.orderNo}</Descriptions.Item>
            <Descriptions.Item label="订单类型">
              <Tag color={typeMap[currentOrder.type]?.color}>{typeMap[currentOrder.type]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[currentOrder.status]?.color}>{statusMap[currentOrder.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="供应商">
              {(currentOrder.supplier as any)?.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">
              ¥{currentOrder.totalAmount?.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="已付金额">
              ¥{currentOrder.paidAmount?.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(currentOrder.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="创建人">
              {(currentOrder.createdBy as any)?.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="收货人">
              {currentOrder.shippingInfo?.receiver || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {currentOrder.shippingInfo?.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="收货地址" span={2}>
              {currentOrder.shippingInfo?.address || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {currentOrder.remark || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}