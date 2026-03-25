'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Card,
  Tag,
  Popconfirm,
  message,
  Modal,
  Form,
  InputNumber,
  TreeSelect,
  Image,
  Badge,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { productApi } from '@/services/product';
import { categoryApi } from '@/services/category';
import { Product, Category } from '@/types';
import dayjs from 'dayjs';

const statusMap: Record<string, { color: string; text: string }> = {
  active: { color: 'green', text: '上架' },
  inactive: { color: 'red', text: '下架' },
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'orange', text: '待审核' },
};

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const tree = await categoryApi.getTree();
      setCategories(tree);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productApi.getAll({
        ...searchParams,
        page,
        limit: pageSize,
      });
      setProducts(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, pageSize]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    try {
      await productApi.delete(id);
      message.success('删除成功');
      fetchProducts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      category: typeof record.category === 'string' ? record.category : record.category?._id,
    });
    setModalVisible(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        await productApi.update(editingProduct._id, values);
        message.success('更新成功');
      } else {
        await productApi.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  const columns = [
    {
      title: '商品图片',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images: string[]) =>
        images?.length > 0 ? (
          <Image src={images[0]} alt="商品图片" width={50} height={50} style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 50, height: 50, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            无图
          </div>
        ),
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: any) => category?.name || '-',
    },
    {
      title: '销售价',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: 100,
      render: (price: number) => `¥${price?.toFixed(2) || '0.00'}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (stock: number, record: Product) => (
        <Badge
          count={stock}
          style={{
            backgroundColor: stock <= record.lowStockThreshold ? '#ff4d4f' : '#52c41a',
          }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const config = statusMap[status] || statusMap.draft;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" size="small" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderCategoryTree = (data: Category[]): any[] =>
    data.map((item) => ({
      title: item.name,
      value: item._id,
      children: item.children ? renderCategoryTree(item.children) : undefined,
    }));

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="商品名称/SKU"
            value={searchParams.keyword}
            onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
            style={{ width: 200 }}
            onPressEnter={handleSearch}
          />
          <TreeSelect
            placeholder="选择分类"
            value={searchParams.category}
            onChange={(value) => setSearchParams({ ...searchParams, category: value })}
            style={{ width: 200 }}
            treeData={renderCategoryTree(categories)}
            allowClear
          />
          <Select
            placeholder="状态"
            value={searchParams.status}
            onChange={(value) => setSearchParams({ ...searchParams, status: value })}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: 'active', label: '上架' },
              { value: 'inactive', label: '下架' },
              { value: 'draft', label: '草稿' },
              { value: 'pending', label: '待审核' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button icon={<PlusOutlined />} onClick={handleCreate}>
            新增商品
          </Button>
        </Space>
      </Card>

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={products}
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
        title={editingProduct ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
        styles={{ body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU编码"
                rules={[{ required: true, message: '请输入SKU编码' }]}
              >
                <Input placeholder="请输入SKU编码" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="商品分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <TreeSelect
                  placeholder="请选择分类"
                  treeData={renderCategoryTree(categories)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Select
                  placeholder="请选择状态"
                  options={[
                    { value: 'draft', label: '草稿' },
                    { value: 'pending', label: '待审核' },
                    { value: 'active', label: '上架' },
                    { value: 'inactive', label: '下架' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="brand" label="品牌">
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="model" label="型号">
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="costPrice" label="成本价">
                <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sellingPrice" label="销售价">
                <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="marketPrice" label="市场价">
                <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="stock" label="库存">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lowStockThreshold" label="低库存阈值">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="10" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="商品描述">
                <Input.TextArea rows={3} placeholder="请输入商品描述" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}