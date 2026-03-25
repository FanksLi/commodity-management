'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Popconfirm,
  message,
  Modal,
  Form,
  Select,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const url = editingUser
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/users`;
      const method = editingUser ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '操作失败');
      }

      message.success(editingUser ? '更新成功' : '创建成功');
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles?.map((role) => (
            <Tag key={role} color={role === 'admin' ? 'red' : 'blue'}>
              {role === 'admin' ? '管理员' : role === 'manager' ? '经理' : '用户'}
            </Tag>
          ))}
        </>
      ),
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
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          {record._id !== currentUser?.id && (
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record._id)}>
              <Button type="link" size="small" danger>
                <DeleteOutlined />
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
            placeholder="用户名/姓名"
            value={searchParams.keyword}
            onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
            style={{ width: 150 }}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button icon={<PlusOutlined />} onClick={handleCreate}>
            新增用户
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
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
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="roles" label="角色">
            <Select
              mode="multiple"
              placeholder="请选择角色"
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'manager', label: '经理' },
                { value: 'user', label: '用户' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}