'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Spin } from 'antd';
import {
  ShopOutlined,
  InboxOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { productApi } from '@/services/product';
import { orderApi } from '@/services/order';
import { supplierApi } from '@/services/supplier';
import { inventoryApi } from '@/services/inventory';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState<any>({});
  const [orderStats, setOrderStats] = useState<any>({});
  const [supplierStats, setSupplierStats] = useState<any>({});
  const [inventoryStats, setInventoryStats] = useState<any>({});
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const [product, order, supplier, inventory, products] = await Promise.all([
        productApi.getStatistics(),
        orderApi.getStatistics(),
        supplierApi.getStatistics(),
        inventoryApi.getStatistics(),
        productApi.getAll({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);
      setProductStats(product);
      setOrderStats(order);
      setSupplierStats(supplier);
      setInventoryStats(inventory);
      setRecentProducts(products.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const productColumns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: any) => (
        <Tag color={stock <= record.lowStockThreshold ? 'red' : 'green'}>{stock}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: 'green',
          inactive: 'red',
          draft: 'default',
          pending: 'orange',
        };
        const textMap: Record<string, string> = {
          active: '上架',
          inactive: '下架',
          draft: '草稿',
          pending: '待审核',
        };
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="商品总数"
              value={productStats.total || 0}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              已上架: {productStats.activeCount || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={orderStats.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              今日: {orderStats.todayOrders || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="供应商数量"
              value={supplierStats.total || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              活跃: {supplierStats.activeCount || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日入库"
              value={inventoryStats.todayIn || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              出库: {inventoryStats.todayOut || 0} <FallOutlined style={{ color: '#ff4d4f' }} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="最近商品" extra={<a href="/products">查看更多</a>}>
            <Table
              columns={productColumns}
              dataSource={recentProducts}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="低库存预警">
            {productStats.lowStockCount > 0 ? (
              <div style={{ padding: 20, textAlign: 'center' }}>
                <ShopOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
                <div style={{ marginTop: 16, fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                  {productStats.lowStockCount}
                </div>
                <div style={{ color: '#999' }}>个商品库存不足</div>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#52c41a' }}>
                <InboxOutlined style={{ fontSize: 48 }} />
                <div style={{ marginTop: 16 }}>库存充足</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}