import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Space, Row, Col, message, Tabs } from 'antd';
import { 
  FileTextOutlined, 
  SendOutlined, 
  SettingOutlined,
  BulbOutlined,
  BookOutlined,
  GlobalOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { mockService } from '@/services/supabase';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const ContentGenerate: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  // 内容类型选项
  const contentTypes = [
    { value: 'policy', label: '政策解读' },
    { value: 'notice', label: '通知公告' },
    { value: 'news', label: '新闻发布' },
    { value: 'education', label: '民生科普' },
    { value: 'activity', label: '活动宣传' },
  ];

  // 风格选项
  const styleOptions = [
    { value: 'formal', label: '正式严谨' },
    { value: 'friendly', label: '亲切友好' },
    { value: 'professional', label: '专业权威' },
    { value: 'simple', label: '通俗易懂' },
  ];

  // 长度选项
  const lengthOptions = [
    { value: 'short', label: '简短 (100-300字)' },
    { value: 'medium', label: '适中 (300-800字)' },
    { value: 'long', label: '详细 (800-1500字)' },
  ];

  // 生成内容
  const handleGenerate = async (values: any) => {
    setLoading(true);
    try {
      // 模拟AI生成内容
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `【${values.title}】

${values.keywords ? `关键词：${values.keywords}\n` : ''}

${values.contentType === 'policy' ? 
  `为深入贯彻落实党中央、国务院关于优化营商环境的决策部署，持续打造市场化、法治化、国际化营商环境，现就进一步优化营商环境提出如下措施：

一、优化政务服务
深化“放管服”改革，推进政务服务标准化、规范化、便利化。全面推行“一网通办”，实现更多事项“网上办”“掌上办”。

二、加强法治保障
健全营商环境法规体系，完善产权保护制度，依法平等保护各类市场主体产权和合法权益。

三、提升服务效能
建立健全企业服务机制，及时回应企业关切，解决企业发展中的困难和问题。` :
  values.contentType === 'notice' ?
  `根据国务院办公厅关于2024年春节放假安排的通知精神，结合我单位实际情况，现将2024年春节放假安排通知如下：

放假时间：2024年2月10日（星期六）至2月17日（星期六），共8天。2月18日（星期日）正常上班。

请各部门提前做好相关工作安排，确保节日期间各项工作正常运转。值班人员要严格遵守值班纪律，做好值班记录和交接工作。` :
  values.contentType === 'education' ?
  `冬季是用电高峰期，也是电气火灾事故多发期。为确保广大群众生命财产安全，现就冬季安全用电有关事项提醒如下：

一、合理使用电器设备
不要同时使用多个大功率电器，避免线路过载。使用电暖器、空调等设备时，要远离易燃物品。

二、定期检查线路设施
定期检查家中电线、插座、开关等电气设施，发现老化、破损要及时更换。

三、养成良好用电习惯
离家或睡觉前要关闭不必要的电器设备，拔掉充电器等小型电器插头。` :
  `这里是根据您的要求生成的${contentTypes.find(t => t.value === values.contentType)?.label}内容。`
}

${values.style === 'friendly' ? '\n\n温馨提示：以上内容仅供参考，具体政策以官方发布为准。如有疑问，请咨询相关部门。' : ''}`;

      setGeneratedContent(mockContent);
      
      // Success animation
      message.success({
        content: '内容生成成功！',
        duration: 3,
        style: {
          marginTop: '20vh',
        },
      });
    } catch (error) {
      message.error('内容生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存内容
  const handleSave = () => {
    message.success('内容已保存到草稿箱');
    form.resetFields();
    setGeneratedContent('');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-md">
          <RobotOutlined className="text-2xl text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI内容生成</h1>
          <p className="text-gray-600 mt-1">利用AI技术快速生成政务新媒体内容</p>
        </div>
      </div>

      <Row gutter={24}>
        {/* 左侧配置面板 */}
        <Col span={12}>
          <Card title="内容配置" className="shadow-sm">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="基础配置" key="basic" icon={<FileTextOutlined />}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleGenerate}
                  initialValues={{
                    contentType: 'policy',
                    style: 'formal',
                    length: 'medium',
                  }}
                >
                  <Form.Item
                    label="内容标题"
                    name="title"
                    rules={[{ required: true, message: '请输入内容标题' }]}
                  >
                    <Input placeholder="请输入内容标题" />
                  </Form.Item>

                  <Form.Item
                    label="内容类型"
                    name="contentType"
                    rules={[{ required: true, message: '请选择内容类型' }]}
                  >
                    <Select placeholder="请选择内容类型">
                      {contentTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          <Space>
                            {type.value === 'policy' && <BookOutlined />}
                            {type.value === 'notice' && <FileTextOutlined />}
                            {type.value === 'news' && <GlobalOutlined />}
                            {type.value === 'education' && <BulbOutlined />}
                            {type.value === 'activity' && <SettingOutlined />}
                            {type.label}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="写作风格"
                    name="style"
                    rules={[{ required: true, message: '请选择写作风格' }]}
                  >
                    <Select placeholder="请选择写作风格">
                      {styleOptions.map(style => (
                        <Option key={style.value} value={style.value}>
                          {style.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="内容长度"
                    name="length"
                    rules={[{ required: true, message: '请选择内容长度' }]}
                  >
                    <Select placeholder="请选择内容长度">
                      {lengthOptions.map(length => (
                        <Option key={length.value} value={length.value}>
                          {length.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="关键词"
                    name="keywords"
                  >
                    <Input.TextArea 
                      rows={3}
                      placeholder="请输入关键词，多个关键词用逗号分隔"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SendOutlined />}
                        size="large"
                      >
                        生成内容
                      </Button>
                      <Button size="large">重置</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="高级配置" key="advanced" icon={<SettingOutlined />}>
                <Form layout="vertical">
                  <Form.Item label="目标受众">
                    <Select placeholder="选择目标受众">
                      <Option value="public">普通公众</Option>
                      <Option value="enterprise">企业用户</Option>
                      <Option value="government">政府部门</Option>
                      <Option value="expert">专业人士</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="语气语调">
                    <Select placeholder="选择语气语调">
                      <Option value="neutral">中性客观</Option>
                      <Option value="positive">积极向上</Option>
                      <Option value="serious">严肃认真</Option>
                      <Option value="warm">温暖亲切</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="引用政策">
                    <Input.TextArea 
                      rows={3}
                      placeholder="引用相关政策文件或法规"
                    />
                  </Form.Item>

                  <Form.Item label="特殊要求">
                    <Input.TextArea 
                      rows={3}
                      placeholder="其他特殊要求或注意事项"
                    />
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* 右侧生成结果 */}
        <Col span={12}>
          <Card 
            title="生成结果" 
            className="shadow-sm"
            extra={
              generatedContent && (
                <Space>
                  <Button type="primary" onClick={handleSave}>
                    保存内容
                  </Button>
                  <Button>重新生成</Button>
                </Space>
              )
            }
          >
            {generatedContent ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
                
                {/* 生成统计 */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {generatedContent.length}
                    </div>
                    <div className="text-sm text-blue-800">字符数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.ceil(generatedContent.length / 2)}
                    </div>
                    <div className="text-sm text-green-800">预计字数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.ceil(generatedContent.split('\n').length)}
                    </div>
                    <div className="text-sm text-orange-800">段落数</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FileTextOutlined className="text-4xl mb-4" />
                  <p>请在左侧配置内容参数，点击"生成内容"按钮</p>
                  <p className="text-sm mt-2">AI将为您生成高质量的政务内容</p>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContentGenerate;