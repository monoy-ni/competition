import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Button, Space, DatePicker, Select, message } from 'antd';
import { 
  EyeOutlined, 
  ShareAltOutlined,
  LikeOutlined,
  MessageOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { mockService } from '@/services/supabase';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DataAnalysis: React.FC = () => {
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(false);

  // 概览统计数据
  const overviewStats = [
    {
      title: '总阅读量',
      value: 156789,
      trend: '+12.5%',
      icon: <EyeOutlined className="text-2xl text-blue-500" />,
      color: 'text-blue-600',
    },
    {
      title: '总分享量',
      value: 23456,
      trend: '+8.3%',
      icon: <ShareAltOutlined className="text-2xl text-green-500" />,
      color: 'text-green-600',
    },
    {
      title: '点赞数',
      value: 89234,
      trend: '+15.2%',
      icon: <LikeOutlined className="text-2xl text-red-500" />,
      color: 'text-red-600',
    },
    {
      title: '评论数',
      value: 12345,
      trend: '+5.7%',
      icon: <MessageOutlined className="text-2xl text-purple-500" />,
      color: 'text-purple-600',
    },
  ];

  // 内容类型分析数据
  const contentTypeData = [
    { type: '政策解读', value: 35, count: 156 },
    { type: '通知公告', value: 28, count: 124 },
    { type: '民生科普', value: 22, count: 98 },
    { type: '新闻发布', value: 15, count: 67 },
  ];

  // 阅读量趋势数据
  const trendData = [
    { date: '2024-01-01', value: 12000, type: '阅读量' },
    { date: '2024-01-02', value: 15000, type: '阅读量' },
    { date: '2024-01-03', value: 18000, type: '阅读量' },
    { date: '2024-01-04', value: 22000, type: '阅读量' },
    { date: '2024-01-05', value: 19000, type: '阅读量' },
    { date: '2024-01-06', value: 25000, type: '阅读量' },
    { date: '2024-01-07', value: 28000, type: '阅读量' },
    { date: '2024-01-08', value: 24000, type: '阅读量' },
    { date: '2024-01-09', value: 30000, type: '阅读量' },
    { date: '2024-01-10', value: 32000, type: '阅读量' },
    { date: '2024-01-11', value: 28000, type: '阅读量' },
    { date: '2024-01-12', value: 35000, type: '阅读量' },
    { date: '2024-01-13', value: 38000, type: '阅读量' },
    { date: '2024-01-14', value: 42000, type: '阅读量' },
  ];

  // 热门内容数据
  const hotContentData = [
    {
      key: '1',
      title: '关于优化营商环境的若干措施解读',
      type: '政策解读',
      views: 45678,
      shares: 2345,
      likes: 5678,
      comments: 1234,
      trend: '+15%',
    },
    {
      key: '2',
      title: '春节期间食品安全消费提示',
      type: '民生科普',
      views: 34567,
      shares: 1876,
      likes: 4321,
      comments: 987,
      trend: '+8%',
    },
    {
      key: '3',
      title: '春节假期安排通知',
      type: '通知公告',
      views: 28934,
      shares: 1234,
      likes: 3456,
      comments: 567,
      trend: '+5%',
    },
    {
      key: '4',
      title: '冬季健康养生指南',
      type: '民生科普',
      views: 23456,
      shares: 987,
      likes: 2890,
      comments: 432,
      trend: '+12%',
    },
    {
      key: '5',
      title: '数字政府建设进展报告',
      type: '新闻发布',
      views: 19876,
      shares: 765,
      likes: 2134,
      comments: 321,
      trend: '+3%',
    },
  ];

  // 用户行为分析数据
  const userBehaviorData = [
    { hour: '00:00', users: 120 },
    { hour: '02:00', users: 80 },
    { hour: '04:00', users: 60 },
    { hour: '06:00', users: 150 },
    { hour: '08:00', users: 450 },
    { hour: '10:00', users: 680 },
    { hour: '12:00', users: 520 },
    { hour: '14:00', users: 750 },
    { hour: '16:00', users: 820 },
    { hour: '18:00', users: 650 },
    { hour: '20:00', users: 580 },
    { hour: '22:00', users: 320 },
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      '政策解读': 'blue',
      '通知公告': 'green',
      '民生科普': 'orange',
      '新闻发布': 'purple',
    };
    return colors[type] || 'default';
  };

  const lineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    point: {
      size: 3,
      shape: 'circle',
    },
    lineStyle: {
      lineWidth: 3,
    },
    color: ['#1890ff'],
  };

  const barConfig = {
    data: userBehaviorData,
    xField: 'hour',
    yField: 'users',
    color: '#52c41a',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  const pieConfig = {
    data: contentTypeData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };

  const hotContentColumns = [
    {
      title: '排名',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (key: string) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {key}
          </span>
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="mt-1">
            <Tag color={getTypeColor(record.type)}>{record.type}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => (
        <div className="text-right">
          <div className="font-medium">{views.toLocaleString()}</div>
          <div className="text-green-600 text-sm">{hotContentData.find(item => item.views === views)?.trend}</div>
        </div>
      ),
    },
    {
      title: '分享',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => (
        <div className="text-center text-gray-600">{shares.toLocaleString()}</div>
      ),
    },
    {
      title: '点赞',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes: number) => (
        <div className="text-center text-gray-600">{likes.toLocaleString()}</div>
      ),
    },
    {
      title: '评论',
      dataIndex: 'comments',
      key: 'comments',
      render: (comments: number) => (
        <div className="text-center text-gray-600">{comments.toLocaleString()}</div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-gray-600 mt-1">分析内容传播效果和用户行为数据</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onChange={setDateRange} style={{ width: 120 }}>
            <Option value="day">今日</Option>
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="year">本年</Option>
          </Select>
          <RangePicker />
        </div>
      </div>

      {/* 概览统计 */}
      <Row gutter={16}>
        {overviewStats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card className="shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-green-600 text-sm mt-1">{stat.trend}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表分析 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card 
            title="阅读量趋势" 
            className="shadow-sm"
            extra={<BarChartOutlined />}
          >
            <div className="space-y-4">
              {trendData.slice(-7).map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-gray-600">{item.date.slice(5)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>阅读量</span>
                      <span className="font-medium">{item.value.toLocaleString()}</span>
                    </div>
                    <Progress 
                      percent={Math.min(100, (item.value / 50000) * 100)} 
                      strokeColor="#1890ff"
                      showInfo={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title="内容类型分布" 
            className="shadow-sm"
            extra={<PieChartOutlined />}
          >
            <div className="space-y-3">
              {contentTypeData.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.type}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <Progress 
                      percent={item.value} 
                      strokeColor={
                        index === 0 ? '#1890ff' :
                        index === 1 ? '#52c41a' :
                        index === 2 ? '#fa8c16' : '#722ed1'
                      }
                      showInfo={false}
                      size="small"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="用户活跃时段" 
            className="shadow-sm"
            extra={<LineChartOutlined />}
          >
            <div className="space-y-3">
              {userBehaviorData.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-600">{item.hour}</div>
                  <div className="flex-1">
                    <Progress 
                      percent={Math.min(100, (item.users / 1000) * 100)} 
                      strokeColor="#52c41a"
                      showInfo={false}
                      size="small"
                    />
                  </div>
                  <div className="w-12 text-sm text-right font-medium">{item.users}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="热门内容排行" 
            className="shadow-sm"
            extra={<RiseOutlined />}
          >
            <Table
              columns={hotContentColumns}
              dataSource={hotContentData}
              pagination={false}
              size="small"
              showHeader={false}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细数据表格 */}
      <Card 
        title="详细数据分析" 
        className="shadow-sm"
        extra={
          <Space>
            <Button icon={<BarChartOutlined />}>导出数据</Button>
            <Button type="primary" icon={<LineChartOutlined />}>生成报告</Button>
          </Space>
        }
      >
        <Table
          columns={hotContentColumns}
          dataSource={hotContentData}
          pagination={{
            total: hotContentData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default DataAnalysis;