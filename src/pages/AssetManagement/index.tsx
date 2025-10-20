import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Upload, Row, Col, Statistic, Progress } from 'antd';
import { 
  FolderOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  VideoCameraOutlined,
  AudioOutlined
} from '@ant-design/icons';
import { mockService } from '@/services/supabase';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const AssetManagement: React.FC = () => {
  const [assetList, setAssetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [uploadForm] = Form.useForm();
  const [assetForm] = Form.useForm();

  // 模拟资产数据
  const mockAssetData = [
    {
      id: '1',
      name: '政府大楼外观图.jpg',
      type: 'image',
      size: '2.5MB',
      category: '建筑照片',
      tags: ['政府', '建筑', '外观'],
      uploadTime: '2024-01-15 10:30',
      uploader: '张管理员',
      status: 'approved',
      downloadCount: 45,
      url: 'https://via.placeholder.com/400x300',
    },
    {
      id: '2',
      name: '政策解读模板.docx',
      type: 'document',
      size: '156KB',
      category: '文档模板',
      tags: ['政策', '模板', '解读'],
      uploadTime: '2024-01-14 15:20',
      uploader: '李编辑',
      status: 'approved',
      downloadCount: 23,
      url: '#',
    },
    {
      id: '3',
      name: '政务宣传视频.mp4',
      type: 'video',
      size: '15.8MB',
      category: '宣传视频',
      tags: ['宣传', '政务', '视频'],
      uploadTime: '2024-01-13 09:15',
      uploader: '王编辑',
      status: 'pending',
      downloadCount: 12,
      url: '#',
    },
    {
      id: '4',
      name: '会议录音.mp3',
      type: 'audio',
      size: '8.2MB',
      category: '音频文件',
      tags: ['会议', '录音', '音频'],
      uploadTime: '2024-01-12 14:45',
      uploader: '赵管理员',
      status: 'approved',
      downloadCount: 8,
      url: '#',
    },
    {
      id: '5',
      name: '政府工作报告.pdf',
      type: 'pdf',
      size: '3.2MB',
      category: '报告文件',
      tags: ['政府', '报告', '工作'],
      uploadTime: '2024-01-11 11:30',
      uploader: '陈编辑',
      status: 'approved',
      downloadCount: 67,
      url: '#',
    },
  ];

  useEffect(() => {
    loadAssetList();
  }, []);

  const loadAssetList = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssetList(mockAssetData);
    } catch (error) {
      message.error('加载资产列表失败');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImageOutlined className="text-blue-500" />;
      case 'document': return <FileTextOutlined className="text-green-500" />;
      case 'pdf': return <FilePdfOutlined className="text-red-500" />;
      case 'video': return <VideoCameraOutlined className="text-purple-500" />;
      case 'audio': return <AudioOutlined className="text-orange-500" />;
      default: return <FolderOutlined />;
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
      default: return '未知';
    }
  };

  const handleView = (record: any) => {
    setSelectedAsset(record);
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个资产吗？',
      onOk: async () => {
        try {
          message.success('删除成功');
          loadAssetList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleUpload = async (values: any) => {
    try {
      message.success('上传成功');
      setUploadModalVisible(false);
      uploadForm.resetFields();
      loadAssetList();
    } catch (error) {
      message.error('上传失败');
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功。`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败。`);
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // 统计信息
  const stats = {
    total: assetList.length,
    images: assetList.filter(item => item.type === 'image').length,
    documents: assetList.filter(item => ['document', 'pdf'].includes(item.type)).length,
    media: assetList.filter(item => ['video', 'audio'].includes(item.type)).length,
    totalSize: '32.1MB',
    avgDownload: Math.round(assetList.reduce((sum, item) => sum + item.downloadCount, 0) / assetList.length),
  };

  const filteredData = assetList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string, record: any) => (
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getFileIcon(record.type)}</div>
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.size}</div>
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '12%',
      render: (type: string) => (
        <Tag color="blue">{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: '15%',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Tag key={index} size="small">{tag}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      width: '10%',
      render: (count: number) => (
        <span className="text-gray-600">{count}</span>
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
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => message.success('开始下载')}
          >
            下载
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
      <div className="flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center shadow-md">
          <FileImageOutlined className="text-2xl text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">资产管理</h1>
          <p className="text-gray-600 mt-1">管理图片、视频等媒体资源</p>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            总资源：{assetList.length}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            已使用：{assetList.filter(item => item.downloadCount > 0).length}
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      <Row gutter={16}>
        <Col span={4}>
          <Card className="shadow-sm">
            <Statistic
              title="总资产数"
              value={stats.total}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="shadow-sm">
            <Statistic
              title="图片数量"
              value={stats.images}
              prefix={<FileImageOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="shadow-sm">
            <Statistic
              title="文档数量"
              value={stats.documents}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="shadow-sm">
            <Statistic
              title="媒体文件"
              value={stats.media}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="shadow-sm">
            <Statistic
              title="总大小"
              value={stats.totalSize}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="shadow-sm">
            <Statistic
              title="平均下载"
              value={stats.avgDownload}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card className="shadow-sm">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="搜索文件名称"
              allowClear
              onSearch={setSearchText}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择文件类型"
              style={{ width: '100%' }}
              value={typeFilter}
              onChange={setTypeFilter}
            >
              <Option value="all">全部类型</Option>
              <Option value="image">图片</Option>
              <Option value="document">文档</Option>
              <Option value="pdf">PDF</Option>
              <Option value="video">视频</Option>
              <Option value="audio">音频</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select placeholder="选择分类" style={{ width: '100%' }}>
              <Option value="all">全部分类</Option>
              <Option value="建筑照片">建筑照片</Option>
              <Option value="文档模板">文档模板</Option>
              <Option value="宣传视频">宣传视频</Option>
              <Option value="音频文件">音频文件</Option>
              <Option value="报告文件">报告文件</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 资产列表 */}
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

      {/* 上传模态框 */}
      <Modal
        title="上传资产"
        visible={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          uploadForm.resetFields();
        }}
        width={600}
        footer={null}
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUpload}
        >
          <Form.Item
            label="选择文件"
            name="files"
            rules={[{ required: true, message: '请选择要上传的文件' }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined className="text-4xl text-blue-500" />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。支持图片、文档、音视频等多种格式。
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Option value="建筑照片">建筑照片</Option>
              <Option value="文档模板">文档模板</Option>
              <Option value="宣传视频">宣传视频</Option>
              <Option value="音频文件">音频文件</Option>
              <Option value="报告文件">报告文件</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="标签"
            name="tags"
          >
            <Input placeholder="请输入标签，多个标签用逗号分隔" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <TextArea
              rows={3}
              placeholder="请输入文件描述"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit">
                开始上传
              </Button>
              <Button onClick={() => setUploadModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看模态框 */}
      <Modal
        title="查看资产"
        visible={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedAsset(null);
        }}
        width={800}
        footer={null}
      >
        {selectedAsset && (
          <div className="space-y-4">
            <div className="text-center">
              {selectedAsset.type === 'image' ? (
                <img 
                  src={selectedAsset.url} 
                  alt={selectedAsset.name}
                  className="max-w-full max-h-96 mx-auto rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getFileIcon(selectedAsset.type)}</div>
                    <p className="text-lg font-medium">{selectedAsset.name}</p>
                    <p className="text-gray-600">{selectedAsset.size}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">文件名：</span>{selectedAsset.name}</div>
                  <div><span className="text-gray-600">类型：</span>{selectedAsset.type.toUpperCase()}</div>
                  <div><span className="text-gray-600">大小：</span>{selectedAsset.size}</div>
                  <div><span className="text-gray-600">分类：</span>{selectedAsset.category}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">使用统计</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">下载次数：</span>{selectedAsset.downloadCount}</div>
                  <div><span className="text-gray-600">上传者：</span>{selectedAsset.uploader}</div>
                  <div><span className="text-gray-600">上传时间：</span>{selectedAsset.uploadTime}</div>
                  <div><span className="text-gray-600">状态：</span>
                    <Tag color={getStatusColor(selectedAsset.status)}>
                      {getStatusText(selectedAsset.status)}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">标签</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="primary" icon={<DownloadOutlined />}>
                下载文件
              </Button>
              <Button onClick={() => setViewModalVisible(false)}>
                关闭
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssetManagement;