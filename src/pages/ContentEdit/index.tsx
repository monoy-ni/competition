import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Row, Col, Progress } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  ExportOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { mockService } from '@/services/supabase';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const ContentEdit: React.FC = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData = [
    {
      id: '1',
      title: '关于优化营商环境的若干措施解读',
      type: '政策解读',
      status: 'draft',
      author: '张编辑',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      content: '为深入贯彻落实党中央、国务院关于优化营商环境的决策部署...',
      wordCount: 1250,
      qualityScore: 85,
    },
    {
      id: '2',
      title: '春节假期安全注意事项通知',
      type: '通知公告',
      status: 'pending',
      author: '李编辑',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14',
      content: '春节将至，为确保大家度过一个平安祥和的节日...',
      wordCount: 680,
      qualityScore: 78,
    },
    {
      id: '3',
      title: '冬季健康养生知识科普',
      type: '民生科普',
      status: 'approved',
      author: '王编辑',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13',
      content: '冬季是养生的重要时节，合理的养生方法可以帮助我们...',
      wordCount: 920,
      qualityScore: 92,
    },
  ];

  useEffect(() => {
    loadContentList();
  }, []);

  const loadContentList = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setContentList(mockData);
    } catch (error) {
      message.error('加载内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已通过';
      case 'pending': return '待审核';
      case 'rejected': return '已驳回';
      default: return '草稿';
    }
  };

  const handleEdit = (record: any) => {
    setEditingContent(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条内容吗？',
      onOk: async () => {
        try {
          message.success('删除成功');
          loadContentList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSave = async (values: any) => {
    try {
      message.success('保存成功');
      setModalVisible(false);
      form.resetFields();
      setEditingContent(null);
      loadContentList();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const filteredData = contentList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-sm text-gray-500 mt-1">
            {record.type} · {record.wordCount}字
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: '15%',
    },
    {
      title: '质量评分',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      width: '15%',
      render: (score: number) => (
        <div className="flex items-center space-x-2">
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
          <span className="text-sm font-medium">{score}</span>
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
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
      <div className="flex items-center space-x-4 bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-100">
        <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center shadow-md">
          <EditOutlined className="text-2xl text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">内容编辑</h1>
          <p className="text-gray-600 mt-1">编辑和管理已生成的内容</p>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            草稿：{contentList.filter(item => item.status === 'draft').length}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            已发布：{contentList.filter(item => item.status === 'published').length}
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card className="shadow-sm">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="搜索内容标题"
              allowClear
              onSearch={setSearchText}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">全部状态</Option>
              <Option value="draft">草稿</Option>
              <Option value="pending">待审核</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已驳回</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select placeholder="选择类型" style={{ width: '100%' }}>
              <Option value="all">全部类型</Option>
              <Option value="policy">政策解读</Option>
              <Option value="notice">通知公告</Option>
              <Option value="news">新闻发布</Option>
              <Option value="education">民生科普</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 内容列表 */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 编辑模态框 */}
      <Modal
        title="编辑内容"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingContent(null);
        }}
        width={800}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={editingContent || {}}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="请输入内容标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Select placeholder="请选择内容类型">
                  <Option value="政策解读">政策解读</Option>
                  <Option value="通知公告">通知公告</Option>
                  <Option value="新闻发布">新闻发布</Option>
                  <Option value="民生科普">民生科普</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea
              rows={12}
              placeholder="请输入内容正文"
              showCount
              maxLength={5000}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存
              </Button>
              <Button>预览</Button>
              <Button type="primary" ghost>
                提交审核
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentEdit;