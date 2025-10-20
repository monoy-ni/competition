import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Button, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  EditOutlined,
  SafetyOutlined,
  BarChartOutlined,
  FolderOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { config } from '@/config';
import { useAuthStore } from '@/stores';

const { Header, Sider, Content } = AntLayout;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '系统概览',
  },
  {
    key: '/content-generate',
    icon: <FileTextOutlined />,
    label: '内容生成',
  },
  {
    key: '/content-edit',
    icon: <EditOutlined />,
    label: '内容编辑',
  },
  {
    key: '/content-audit',
    icon: <SafetyOutlined />,
    label: '内容审核',
  },
  {
    key: '/data-analysis',
    icon: <BarChartOutlined />,
    label: '数据分析',
  },
  {
    key: '/asset-management',
    icon: <FolderOutlined />,
    label: '资产管理',
  },
  {
    key: '/user-management',
    icon: <UserOutlined />,
    label: '用户管理',
  },
];

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      try {
        await logout();
        message.success('退出登录成功');
        navigate('/login');
      } catch (error) {
        message.error('退出登录失败');
      }
    } else if (key === 'profile') {
      message.info('个人中心功能开发中');
    }
  };

  const handleNavigation = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="shadow-lg bg-gradient-to-b from-blue-600 to-blue-800">
        <div className="flex items-center justify-center h-16 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center space-x-2">
            <div className={`${collapsed ? 'w-8 h-8' : 'w-10 h-10'} bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center`}>
              <SafetyOutlined className={`${collapsed ? 'text-lg' : 'text-xl'} text-white`} />
            </div>
            {!collapsed && (
              <h1 className="text-white font-bold text-lg truncate">
                AI内容工厂
              </h1>
            )}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleNavigation}
          className="bg-transparent border-none"
          style={{ background: 'transparent' }}
        />
      </Sider>
      
      <AntLayout>
        <Header className="flex items-center justify-between px-6 bg-white shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          
          <div className="flex items-center space-x-4">
            <Badge count={5} size="small">
              <BellOutlined className="text-xl text-gray-600 cursor-pointer" />
            </Badge>
            
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              placement="bottomRight"
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar icon={<UserOutlined />} className="bg-primary" />
                <span className="text-gray-700">{user?.name || '管理员'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};