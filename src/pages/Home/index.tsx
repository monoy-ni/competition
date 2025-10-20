import React, { useEffect } from 'react';
import { Card, Statistic, Row, Col, Button, Space } from 'antd';
import { 
  FileTextOutlined, 
  SafetyOutlined, 
  CheckCircleOutlined,
  PlusOutlined,
  EditOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { mockService } from '@/services/supabase';
import { useContentStore, useAnalysisStore } from '@/stores';

const { Meta } = Card;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { contents, fetchContents, loading } = useContentStore();
  const { contentStats, fetchContentStats } = useAnalysisStore();

  useEffect(() => {
    fetchContents(1, 5);
    fetchContentStats();
  }, [fetchContents, fetchContentStats]);

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  // 统计数据
  const stats = contentStats ? [
    {
      title: '内容总数',
      value: contentStats.total,
      icon: <FileTextOutlined className="text-2xl text-primary" />,
      trend: '+12%',
    },
    {
      title: '待审核内容',
      value: contentStats.pending,
      icon: <SafetyOutlined className="text-2xl text-warning" />,
      trend: '+3',
    },
    {
      title: '已发布内容',
      value: contentStats.published,
      icon: <CheckCircleOutlined className="text-2xl text-success" />,
      trend: '+8%',
    },
    {
      title: '本月新增',
      value: Object.values(contentStats.byType).reduce((a, b) => a + b, 0),
      icon: <PlusOutlined className="text-2xl text-secondary" />,
      trend: '+15%',
    },
  ] : [
    {
      title: '内容总数',
      value: 0,
      icon: <FileTextOutlined className="text-2xl text-primary" />,
      trend: '+12%',
    },
    {
      title: '待审核内容',
      value: 0,
      icon: <SafetyOutlined className="text-2xl text-warning" />,
      trend: '+3',
    },
    {
      title: '已发布内容',
      value: 0,
      icon: <CheckCircleOutlined className="text-2xl text-success" />,
      trend: '+8%',
    },
    {
      title: '本月新增',
      value: 0,
      icon: <PlusOutlined className="text-2xl text-secondary" />,
      trend: '+15%',
    },
  ];

  // 最近项目
  const recentProjects = contents.slice(0, 3).map(content => ({
    id: content.id,
    title: content.title,
    type: content.type,
    status: content.status,
    updatedAt: new Date(content.createdAt).toLocaleDateString('zh-CN'),
    progress: content.status === 'published' ? 100 : content.status === 'pending' ? 75 : 30,
  }));

  // 快捷操作
  const quickActions = [
    {
      title: 'AI内容生成',
      description: '智能生成政务内容',
      icon: <PlusOutlined className="text-3xl text-primary" />,
      action: () => console.log('AI内容生成'),
    },
    {
      title: '内容编辑',
      description: '编辑和优化内容',
      icon: <EditOutlined className="text-3xl text-success" />,
      action: () => console.log('内容编辑'),
    },
    {
      title: '数据分析',
      description: '查看内容分析数据',
      icon: <BarChartOutlined className="text-3xl text-warning" />,
      action: () => console.log('数据分析'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'pending': return 'text-warning';
      case 'rejected': return 'text-error';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已通过';
      case 'pending': return '审核中';
      case 'rejected': return '已驳回';
      default: return '草稿';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center space-x-4">
          <img 
            src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Government%20building%20with%20Chinese%20architecture%2C%20official%20style%2C%20professional%2C%20clean%20background&image_size=landscape_16_9" 
            alt="政府大楼"
            className="w-16 h-12 object-cover rounded shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">系统概览</h1>
            <p className="text-gray-600 mt-1">欢迎使用政务新媒体AI内容工厂</p>
          </div>
        </div>
        <div className="text-right bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">今日日期</p>
          <p className="text-lg font-semibold text-blue-600">{new Date().toLocaleDateString('zh-CN')}</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1">{stat.trend}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷操作 */}
      <Row gutter={16}>
        {quickActions.map((action, index) => (
          <Col span={8} key={index}>
            <Card 
              hoverable
              onClick={action.action}
              className="cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                {action.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近项目 */}
      <Card title="最近项目" className="shadow-sm">
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.type}</span>
                  <span className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </span>
                  <span>更新于 {project.updatedAt}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{project.progress}% 完成</p>
                </div>
                <Button type="link" icon={<EditOutlined />}>继续编辑</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 系统公告 */}
      <Card title="系统公告" className="shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h5 className="font-medium text-blue-900">系统更新通知</h5>
              <p className="text-blue-800 text-sm mt-1">系统将于今晚22:00-24:00进行例行维护，期间可能影响正常使用。</p>
              <p className="text-blue-600 text-xs mt-2">2024-01-15 10:30</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h5 className="font-medium text-green-900">新功能上线</h5>
              <p className="text-green-800 text-sm mt-1">AI图像生成功能已正式上线，欢迎使用！</p>
              <p className="text-green-600 text-xs mt-2">2024-01-14 15:20</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};