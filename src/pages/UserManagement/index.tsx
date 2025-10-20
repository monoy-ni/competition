import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, Switch, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userList, setUserList] = useState<User[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@gov.cn',
      role: 'admin',
      department: '信息宣传部',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15 10:30',
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@gov.cn',
      role: 'editor',
      department: '政策研究室',
      status: 'active',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-14 15:20',
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@gov.cn',
      role: 'auditor',
      department: '办公室',
      status: 'inactive',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-12 09:15',
    },
  ];

  const mockRoles: Role[] = [
    {
      id: '1',
      name: '系统管理员',
      permissions: ['user.manage', 'content.all', 'system.config'],
      description: '拥有系统所有权限',
    },
    {
      id: '2',
      name: '内容编辑',
      permissions: ['content.create', 'content.edit', 'content.view'],
      description: '负责内容创作和编辑',
    },
    {
      id: '3',
      name: '内容审核员',
      permissions: ['content.audit', 'content.view'],
      description: '负责内容审核工作',
    },
  ];

  const roleOptions = [
    { value: 'admin', label: '系统管理员' },
    { value: 'editor', label: '内容编辑' },
    { value: 'auditor', label: '内容审核员' },
    { value: 'publisher', label: '发布专员' },
  ];

  const departmentOptions = [
    { value: '信息宣传部', label: '信息宣传部' },
    { value: '政策研究室', label: '政策研究室' },
    { value: '办公室', label: '办公室' },
    { value: '人事部', label: '人事部' },
  ];

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setUserList(mockUsers);
      setLoading(false);
    }, 500);
  };

  const fetchRoles = () => {
    setLoading(true);
    setTimeout(() => {
      setRoleList(mockRoles);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = mockUsers.filter(user => 
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.department.toLowerCase().includes(value.toLowerCase())
    );
    setUserList(filtered);
  };

  const handleUserModalOk = async () => {
    try {
      const values = await userForm.validateFields();
      if (editingUser) {
        // 编辑用户
        const updatedUsers = userList.map(user =>
          user.id === editingUser.id ? { ...user, ...values } : user
        );
        setUserList(updatedUsers);
        message.success('用户更新成功');
      } else {
        // 新增用户
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: '从未登录',
        };
        setUserList([...userList, newUser]);
        message.success('用户创建成功');
      }
      setUserModalVisible(false);
      userForm.resetFields();
      setEditingUser(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleRoleModalOk = async () => {
    try {
      const values = await roleForm.validateFields();
      if (editingRole) {
        // 编辑角色
        const updatedRoles = roleList.map(role =>
          role.id === editingRole.id ? { ...role, ...values } : role
        );
        setRoleList(updatedRoles);
        message.success('角色更新成功');
      } else {
        // 新增角色
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
        };
        setRoleList([...roleList, newRole]);
        message.success('角色创建成功');
      }
      setRoleModalVisible(false);
      roleForm.resetFields();
      setEditingRole(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleDeleteUser = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可恢复。',
      onOk: () => {
        const updatedUsers = userList.filter(user => user.id !== id);
        setUserList(updatedUsers);
        message.success('用户删除成功');
      },
    });
  };

  const handleDeleteRole = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该角色吗？',
      onOk: () => {
        const updatedRoles = roleList.filter(role => role.id !== id);
        setRoleList(updatedRoles);
        message.success('角色删除成功');
      },
    });
  };

  const handleStatusChange = (id: string, status: boolean) => {
    const updatedUsers = userList.map(user =>
      user.id === id ? { ...user, status: status ? 'active' : 'inactive' } : user
    );
    setUserList(updatedUsers);
    message.success('状态更新成功');
  };

  const userColumns: ColumnsType<User> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          admin: { text: '系统管理员', color: 'red' },
          editor: { text: '内容编辑', color: 'blue' },
          auditor: { text: '内容审核员', color: 'green' },
          publisher: { text: '发布专员', color: 'orange' },
        };
        const roleInfo = roleMap[role] || { text: role, color: 'default' };
        return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '活跃' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              userForm.setFieldsValue(record);
              setUserModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            删除
          </Button>
          <Switch
            checked={record.status === 'active'}
            onChange={(checked) => handleStatusChange(record.id, checked)}
          />
        </Space>
      ),
    },
  ];

  const roleColumns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space size="small" wrap>
          {permissions.map((permission: string) => (
            <Tag key={permission} color="blue">
              {permission}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRole(record);
              roleForm.setFieldsValue(record);
              setRoleModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-lg border border-slate-100">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-md">
          <UserOutlined className="text-2xl text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-1">管理系统用户和权限</p>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            总用户：{userList.length}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            活跃用户：{userList.filter(user => user.status === 'active').length}
          </div>
        </div>
      </div>

      <Card
        tabList={[
          { key: 'users', tab: '用户管理' },
          { key: 'roles', tab: '角色管理' },
        ]}
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Search
                placeholder="搜索用户姓名、邮箱或部门"
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingUser(null);
                  userForm.resetFields();
                  setUserModalVisible(true);
                }}
              >
                新增用户
              </Button>
            </div>

            <Table
              columns={userColumns}
              dataSource={userList}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingRole(null);
                  roleForm.resetFields();
                  setRoleModalVisible(true);
                }}
              >
                新增角色
              </Button>
            </div>

            <Table
              columns={roleColumns}
              dataSource={roleList}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </div>
        )}
      </Card>

      {/* 用户编辑模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={userModalVisible}
        onOk={handleUserModalOk}
        onCancel={() => {
          setUserModalVisible(false);
          userForm.resetFields();
          setEditingUser(null);
        }}
        width={600}
      >
        <Form
          form={userForm}
          layout="vertical"
          initialValues={{
            status: 'active',
          }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入用户姓名' }]}
          >
            <Input placeholder="请输入用户姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select placeholder="请选择用户角色">
              {roleOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <Select placeholder="请选择所属部门">
              {departmentOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色编辑模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={roleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={() => {
          setRoleModalVisible(false);
          roleForm.resetFields();
          setEditingRole(null);
        }}
        width={600}
      >
        <Form
          form={roleForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择权限"
              options={[
                { label: '用户管理', value: 'user.manage' },
                { label: '内容创建', value: 'content.create' },
                { label: '内容编辑', value: 'content.edit' },
                { label: '内容审核', value: 'content.audit' },
                { label: '内容查看', value: 'content.view' },
                { label: '系统配置', value: 'system.config' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入角色描述"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;