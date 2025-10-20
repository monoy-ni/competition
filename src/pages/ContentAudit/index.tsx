import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Row, Col, Divider, Timeline } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  EyeOutlined,
  SearchOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { mockService } from '@/services/supabase';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const ContentAudit: React.FC = () => {
  const [auditList, setAuditList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [auditContent, setAuditContent] = useState(null);
  const [auditForm] = Form.useForm();

  // 模拟审核数据
  const mockAuditData = [
    {
      id: '1',
      title: '关于推进数字政府建设的实施意见',
      type: '政策解读',
      author: '张编辑',
      submitTime: '2024-01-15 14:30',
      status: 'pending',
      content: '为深入贯彻落实党中央、国务院关于数字政府建设的决策部署，加快推进政府数字化转型，提升政府治理能力和服务水平，现就推进数字政府建设提出如下实施意见...',
      wordCount: 1580,
      submitter: {
        name: '张编辑',
        department: '政策研究室',
        phone: '138****1234',
      },
      auditHistory: [
        {
          time: '2024-01-15 14:30',
          user: '张编辑',
          action: '提交审核',
          comment: '请领导审核',
        },
      ],
    },
    {
      id: '2',
      title: '春节期间食品安全消费提示',
      type: '民生科普',
      author: '李编辑',
      submitTime: '2024-01-15 10:15',
      status: 'pending',
      content: '春节将至，食品消费进入高峰期。为保障广大消费者饮食安全，特发布春节期间食品安全消费提示...',
      wordCount: 980,
      submitter: {
        name: '李编辑',
        department: '食品药品监管科',
        phone: '139****5678',
      },
      auditHistory: [
        {
          time: '2024-01-15 10:15',
          user: '李编辑',
          action: '提交审核',
          comment: '请审核',
        },
      ],
    },
    {
      id: '3',
      title: '关于调整部分政务服务事项的通知',
      type: '通知公告',
      author: '王编辑',
      submitTime: '2024-01-14 16:45',
      status: 'approved',
      content: '为进一步优化营商环境，提升政务服务效能，经研究决定，对部分政务服务事项进行调整...',
      wordCount: 750,
      submitter: {
        name: '王编辑',
        department: '政务服务中心',
        phone: '137****9012',
      },
      auditHistory: [
        {
          time: '2024-01-14 16:45',
          user: '王编辑',
          action: '提交审核',
          comment: '请审核',
        },
        {
          time: '2024-01-14 17:20',
          user: '审核员A',
          action: '审核通过',
          comment: '内容符合要求，同意发布',
        },
      ],
    },
  ];

  useEffect(() => {
    loadAuditList();
  }, []);

  const loadAuditList = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setAuditList(mockAuditData);
    } catch (error) {
      message.error('加载审核列表失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已通过';
      case 'rejected': return '已驳回';
      case 'pending': return '待审核';
      default: return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      default: return <SafetyOutlined />;
    }
  };

  const handleAudit = (record: any, action: string) => {
    setAuditContent(record);
    auditForm.setFieldsValue({ action });
    setModalVisible(true);
  };

  const handleAuditSubmit = async (values: any) => {
    try {
      message.success(`审核${values.action === 'approve' ? '通过' : '驳回'}成功`);
      setModalVisible(false);
      auditForm.resetFields();
      setAuditContent(null);
      loadAuditList();
    } catch (error) {
      message.error('审核操作失败');
    }
  };

  const filteredData = auditList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '35%',
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-sm text-gray-500 mt-1">
            {record.type} · {record.wordCount}字 · {record.author}
          </div>
        </div>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: '20%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => (
        <Tag 
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
          className="flex items-center space-x-1"
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: '15%',
      render: (submitter: any) => (
        <div>
          <div className="font-medium">{submitter.name}</div>
          <div className="text-sm text-gray-500">{submitter.department}</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleAudit(record, 'view')}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                size="small"
                style={{ color: '#52c41a' }}
                onClick={() => handleAudit(record, 'approve')}
              >
                通过
              </Button>
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                size="small"
                danger
                onClick={() => handleAudit(record, 'reject')}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-100">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center shadow-md">
          <SafetyOutlined className="text-2xl text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">内容审核</h1>
          <p className="text-gray-600 mt-1">审核待发布内容，确保合规性和质量</p>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            待审核：{auditList.filter(item => item.status === 'pending').length}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            已通过：{auditList.filter(item => item.status === 'approved').length}
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
              placeholder="选择审核状态"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待审核</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已驳回</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select placeholder="选择内容类型" style={{ width: '100%' }}>
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

      {/* 审核列表 */}
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

      {/* 审核模态框 */}
      <Modal
        title="内容审核"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          auditForm.resetFields();
          setAuditContent(null);
        }}
        width={800}
        footer={null}
      >
        {auditContent && (
          <div className="space-y-6">
            {/* 内容信息 */}
            <Card size="small" title="内容详情">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{auditContent.title}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span><FileTextOutlined /> {auditContent.type}</span>
                    <span>{auditContent.wordCount}字</span>
                    <span><UserOutlined /> {auditContent.author}</span>
                    <span>{auditContent.submitTime}</span>
                  </div>
                </div>
                
                <Divider />
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">{auditContent.content}</p>
                </div>
              </div>
            </Card>

            {/* 审核历史 */}
            <Card size="small" title="审核历史">
              <Timeline>
                {auditContent.auditHistory.map((item, index) => (
                  <Timeline.Item
                    key={index}
                    color={item.action.includes('通过') ? 'green' : item.action.includes('驳回') ? 'red' : 'blue'}
                  >
                    <div className="text-sm">
                      <div className="font-medium">{item.action}</div>
                      <div className="text-gray-600">{item.user} · {item.time}</div>
                      {item.comment && <div className="text-gray-800 mt-1">{item.comment}</div>}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* 审核表单 */}
            {auditContent.status === 'pending' && (
              <Card size="small" title="审核意见">
                <Form
                  form={auditForm}
                  layout="vertical"
                  onFinish={handleAuditSubmit}
                >
                  <Form.Item
                    name="action"
                    label="审核结果"
                    rules={[{ required: true, message: '请选择审核结果' }]}
                  >
                    <Select placeholder="请选择审核结果">
                      <Option value="approve">
                        <CheckCircleOutlined className="text-green-500" /> 审核通过
                      </Option>
                      <Option value="reject">
                        <CloseCircleOutlined className="text-red-500" /> 审核驳回
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="comment"
                    label="审核意见"
                    rules={[{ required: true, message: '请输入审核意见' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="请输入审核意见"
                    />
                  </Form.Item>

                  <Form.Item className="mb-0">
                    <Space>
                      <Button type="primary" htmlType="submit">
                        提交审核结果
                      </Button>
                      <Button onClick={() => setModalVisible(false)}>
                        取消
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentAudit;