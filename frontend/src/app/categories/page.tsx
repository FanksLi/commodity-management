'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Popconfirm,
  message,
  Tree,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { categoryApi } from '@/services/category';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const tree = await categoryApi.getTree();
      setCategories(tree);
    } catch (error) {
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue({
      ...record,
      parent: record.parent || undefined,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      message.success('删除成功');
      fetchCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await categoryApi.update(editingCategory._id, values);
        message.success('更新成功');
      } else {
        await categoryApi.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  const renderTreeData = (data: Category[]): any[] =>
    data.map((item) => ({
      key: item._id,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 20 }}>
          <span>
            {item.isActive ? (
              <FolderOpenOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            ) : (
              <FolderOutlined style={{ marginRight: 8, color: '#999' }} />
            )}
            {item.name}
          </span>
          <Space>
            <Button type="link" size="small" onClick={() => handleEdit(item)}>
              <EditOutlined />
            </Button>
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(item._id)}>
              <Button type="link" size="small" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
      children: item.children ? renderTreeData(item.children) : undefined,
    }));

  return (
    <div>
      <Card
        title="分类管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增分类
          </Button>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
        ) : (
          <Tree
            showLine
            defaultExpandAll
            treeData={renderTreeData(categories)}
          />
        )}
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
        styles={{ body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="分类名称"
                rules={[{ required: true, message: '请输入分类名称' }]}
              >
                <Input placeholder="请输入分类名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sort" label="排序">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
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
              <Form.Item name="description" label="分类描述">
                <Input.TextArea rows={3} placeholder="请输入分类描述" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}