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
  Popconfirm,
  message,
  Modal,
  Form,
  Row,
  Col,
  Switch,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { supplierApi } from '@/services/supplier';
import { Supplier } from '@/types';

const levelMap: Record<string, { color: string; text: string }> = {
  A: { color: 'gold', text: 'A级' },
  B: { color: 'blue', text: 'B级' },
  C: { color: 'green', text: 'C级' },
  D: { color: 'default', text: 'D级' },
};

export default function SuppliersPage() {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await supplierApi.getAll({
        ...searchParams,
        page,
        limit: pageSize,
      });
      setSuppliers(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('获取供应商列表失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, pageSize]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSearch = () => {
    setPage(1);
    fetchSuppliers();
  };

  const handleCreate = () => {
    setEditingSupplier(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Supplier) => {
    setEditingSupplier(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await supplierApi.delete(id);
      message.success('删除成功');
      fetchSuppliers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingSupplier) {
        await supplierApi.update(editingSupplier._id, values);
        message.success('更新成功');
      } else {
        await supplierApi.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchSuppliers();
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  const columns = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => code || '-',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const config = levelMap[level] || levelMap.C;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? '启用' : '禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Supplier) => (
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

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="供应商名称"
            value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            style={{ width: 150 }}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="等级"
            value={searchParams.level}
            onChange={(value) => setSearchParams({ ...searchParams, level: value })}
            style={{ width: 100 }}
            allowClear
            options={[
              { value: 'A', label: 'A级' },
              { value: 'B', label: 'B级' },
              { value: 'C', label: 'C级' },
              { value: 'D', label: 'D级' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button icon={<PlusOutlined />} onClick={handleCreate}>
            新增供应商
          </Button>
        </Space>
      </Card>

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={suppliers}
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
        title={editingSupplier ? '编辑供应商' : '新增供应商'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnClose
        styles={{ body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="供应商名称"
                rules={[{ required: true, message: '请输入供应商名称' }]}
              >
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="供应商编码">
                <Input placeholder="请输入编码" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contact" label="联系人">
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱">
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="level" label="供应商等级">
                <Select
                  placeholder="请选择等级"
                  options={[
                    { value: 'A', label: 'A级' },
                    { value: 'B', label: 'B级' },
                    { value: 'C', label: 'C级' },
                    { value: 'D', label: 'D级' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isActive" label="是否启用" valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="address" label="地址">
                <Input placeholder="请输入地址" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={3} placeholder="请输入备注" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}