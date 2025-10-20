import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      await login(values.username, values.password);
      message.success('登录成功！');
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">政务新媒体AI内容工厂</h1>
          <p className="text-gray-600">智能化政务内容创作平台</p>
        </div>
        
        <Card className="shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">用户登录</h2>
            <p className="text-gray-500 text-sm mt-1">请输入您的账号信息</p>
          </div>
          
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名!' },
                { type: 'email', message: '请输入有效的邮箱地址!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="请输入邮箱地址"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                className="w-full bg-primary hover:bg-blue-700 border-none rounded-lg h-12 text-base font-medium"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              演示账号: demo@gov.cn / 密码: 123456
            </p>
          </div>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            © 2024 政务新媒体AI内容工厂 - 助力智慧政务建设
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;