import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Card, Tabs, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { TabPane } = Tabs;

const PublicLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        navigate('/portal/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = () => {
    message.success('验证码已发送，请注意查收');
  };

  const handleVisitorAccess = () => {
    // 访客无需登录，直接进入公众模式
    navigate('/portal/home');
    message.info('正在以访客模式浏览');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
    }}>
      <Card 
        title="湘江科创基地智慧园区" 
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        headStyle={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="账号密码登录" key="1">
            <Form
              name="account_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入您的用户名!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名/手机号" />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入您的密码!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>
              
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>

                <a style={{ float: 'right' }}>
                  忘记密码
                </a>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="手机验证码登录" key="2">
            <Form
              name="sms_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="mobile"
                rules={[
                  { required: true, message: '请输入您的手机号!' },
                  { pattern: /^1\d{10}$/, message: '请输入正确的手机号格式!' }
                ]}
              >
                <Input prefix={<MobileOutlined />} placeholder="手机号" />
              </Form.Item>
              
              <Form.Item
                name="smsCode"
                rules={[{ required: true, message: '请输入短信验证码!' }]}
              >
                <Input 
                  placeholder="短信验证码"
                  suffix={
                    <Button type="link" size="small" onClick={handleSendCode}>
                      发送验证码
                    </Button>
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
        
        <Divider>或</Divider>
        
        <Button 
          icon={<GlobalOutlined />} 
          block 
          onClick={handleVisitorAccess}
          style={{ marginBottom: 16 }}
        >
          访客浏览
        </Button>
        
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p>还没有账号？ <a onClick={() => message.info('请联系园区管理员')}>企业员工申请</a></p>
        </div>
      </Card>
    </div>
  );
};

export default PublicLogin; 