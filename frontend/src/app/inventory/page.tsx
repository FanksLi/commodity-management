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
  message,
  Spin,
} from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { inventoryApi } from '@/services/inventory';
import { Inventory } from '@/types';
import dayjs from 'dayjs';

const typeMap: Record<string, { color: string; text: string }> = {
  in: { color: 'green', text: '入库' },
  out: { color: 'red', text: '出库' },
  adjust: { color: 'orange', text: '调整' },
  transfer: { color: 'blue', text: '调拨' },
};

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await inventoryApi.getAll({
        ...searchParams,
        page,
        limit: pageSize,
      });
      setInventory(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('获取库存记录失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, pageSize]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSearch = () => {
    setPage(1);
    fetchInventory();
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'product',
      key: 'product',
      render: (product: any) => product?.name || '-',
    },
    {
      title: 'SKU',
      dataIndex: 'product',
      key: 'sku',
      render: (product: any) => product?.sku || '-',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config = typeMap[type] || typeMap.adjust;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: Inventory) => (
        <span style={{ color: record.type === 'in' ? '#52c41a' : '#ff4d4f' }}>
          {record.type === 'in' ? '+' : '-'}{quantity}
        </span>
      ),
    },
    {
      title: '变更前库存',
      dataIndex: 'beforeStock',
      key: 'beforeStock',
    },
    {
      title: '变更后库存',
      dataIndex: 'afterStock',
      key: 'afterStock',
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (batchNo: string) => batchNo || '-',
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier: any) => supplier?.name || '-',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      render: (operator: any) => operator?.name || '-',
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (remark: string) => remark || '-',
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="批次号"
            value={searchParams.batchNo}
            onChange={(e) => setSearchParams({ ...searchParams, batchNo: e.target.value })}
            style={{ width: 150 }}
          />
          <Select
            placeholder="操作类型"
            value={searchParams.type}
            onChange={(value) => setSearchParams({ ...searchParams, type: value })}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: 'in', label: '入库' },
              { value: 'out', label: '出库' },
              { value: 'adjust', label: '调整' },
              { value: 'transfer', label: '调拨' },
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
            dataSource={inventory}
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
    </div>
  );
}