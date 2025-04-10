import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Button, Space, 
  Descriptions, QRCode, Tabs, 
  Modal, Radio, Input, message, Alert,
  Empty
} from 'antd';
import { 
  QrcodeOutlined, 
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  CopyOutlined
} from '@ant-design/icons';
import styles from './EnterpriseQRCode.module.less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const EnterpriseQRCode: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('');
  const [enterpriseInfo, setEnterpriseInfo] = useState<any>(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // 模拟加载企业数据
  useEffect(() => {
    // 实际应用中应调用API
    setTimeout(() => {
      setQrValue('https://smartpark.example.com/parking/visitor?eid=123456789');
      setEnterpriseInfo({
        id: '123456789',
        name: 'ABC科技有限公司',
        balance: 5000.00,
        address: 'A区3号楼5层',
        totalVisitors: 128,
        monthVisitors: 23
      });
      setLoading(false);
    }, 1500);
  }, []);
  
  // 下载二维码
  const handleDownload = () => {
    const canvas = document.getElementById('enterprise-qrcode')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.download = `${enterpriseInfo.name}访客停车码.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  // 打印二维码
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const canvas = document.getElementById('enterprise-qrcode')?.querySelector<HTMLCanvasElement>('canvas');
      if (canvas) {
        const url = canvas.toDataURL();
        printWindow.document.write(`
          <html>
            <head>
              <title>${enterpriseInfo.name}访客停车码</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .container { max-width: 400px; margin: 0 auto; }
                .title { font-size: 18px; margin-bottom: 10px; }
                .subtitle { font-size: 14px; color: #666; margin-bottom: 20px; }
                .qrcode { width: 300px; height: 300px; margin: 0 auto 20px; }
                .info { font-size: 12px; color: #888; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="title">${enterpriseInfo.name} - 访客停车码</div>
                <div class="subtitle">扫码即可关联企业账单，快速通行</div>
                <img src="${url}" class="qrcode" />
                <div class="info">企业地址: ${enterpriseInfo.address}</div>
              </div>
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };
  
  // 复制链接
  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue).then(() => {
      message.success('链接已复制到剪贴板');
    });
  };
  
  return (
    <div className={styles.container}>
      <Card className={styles.mainCard} loading={loading}>
        <Title level={4} className={styles.title}>
          <QrcodeOutlined /> 企业访客停车二维码
        </Title>
        
        <Paragraph className={styles.description}>
          企业专属访客停车二维码，来访者扫码后停车费将自动计入企业账单，方便快捷。
        </Paragraph>
        
        <Alert
          message="使用提示"
          description="访客扫描此二维码后，系统将记录车辆信息并关联到贵企业账单。访客离场时无需支付，费用将在月底统一结算。"
          type="info"
          showIcon
          closable
          className={styles.alert}
        />
        
        <div className={styles.content}>
          <div className={styles.qrcodeContainer}>
            <div className={styles.qrcodeWrapper} id="enterprise-qrcode">
              <QRCode
                value={qrValue}
                size={200}
                bordered={false}
                errorLevel="H"
                icon="/logo.png"
              />
            </div>
            <div className={styles.qrcodeActions}>
              <Space>
                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                  下载
                </Button>
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                  打印
                </Button>
                <Button icon={<ShareAltOutlined />} onClick={() => setShareVisible(true)}>
                  分享
                </Button>
                <Button icon={<InfoCircleOutlined />} onClick={() => setShowGuide(true)}>
                  使用指南
                </Button>
              </Space>
            </div>
          </div>
          
          <div className={styles.infoContainer}>
            {enterpriseInfo && (
              <Descriptions column={1} bordered>
                <Descriptions.Item label="企业名称">
                  {enterpriseInfo.name}
                </Descriptions.Item>
                <Descriptions.Item label="企业地址">
                  {enterpriseInfo.address}
                </Descriptions.Item>
                <Descriptions.Item label="账户余额">
                  <Text strong style={{ color: '#52c41a' }}>¥{enterpriseInfo.balance.toFixed(2)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="本月访客">
                  {enterpriseInfo.monthVisitors}人次
                </Descriptions.Item>
                <Descriptions.Item label="累计访客">
                  {enterpriseInfo.totalVisitors}人次
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        </div>
        
        <Tabs defaultActiveKey="records" className={styles.tabs}>
          <TabPane tab="访客记录" key="records">
            <div className={styles.recordsContainer}>
              <Button type="primary" href="/user/my-account/parking-bills">
                查看停车账单明细
              </Button>
            </div>
          </TabPane>
          <TabPane tab="使用统计" key="stats">
            <div className={styles.statsContainer}>
              <Empty description="暂无统计数据" />
            </div>
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 分享弹窗 */}
      <Modal
        title="分享访客停车码"
        open={shareVisible}
        onCancel={() => setShareVisible(false)}
        footer={null}
      >
        <div className={styles.shareModal}>
          <div className={styles.shareQrcode}>
            <QRCode
              value={qrValue}
              size={180}
              bordered={false}
            />
          </div>
          
          <div className={styles.shareLink}>
            <div className={styles.linkTitle}>链接地址</div>
            <div className={styles.linkContent}>
              <Input
                value={qrValue}
                readOnly
                addonAfter={
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />} 
                    onClick={handleCopyLink}
                  />
                }
              />
            </div>
          </div>
          
          <div className={styles.shareOptions}>
            <div className={styles.shareTitle}>分享方式</div>
            <div className={styles.sharePlatforms}>
              <Space>
                <Button icon={<i className="icon-wechat" />}>微信</Button>
                <Button icon={<i className="icon-dingtalk" />}>钉钉</Button>
                <Button icon={<i className="icon-email" />}>邮件</Button>
              </Space>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* 使用指南弹窗 */}
      <Modal
        title="访客停车码使用指南"
        open={showGuide}
        onCancel={() => setShowGuide(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowGuide(false)}>
            我知道了
          </Button>,
        ]}
      >
        <div className={styles.guideModal}>
          <Title level={5}>如何使用企业访客停车码</Title>
          <Paragraph>
            企业访客停车码是为贵企业的访客提供便捷停车服务的工具。使用方法如下：
          </Paragraph>
          <ol className={styles.guideSteps}>
            <li>将此二维码分享给您的访客</li>
            <li>访客到达停车场后，使用手机扫描此二维码</li>
            <li>扫码后，系统会自动记录车牌信息并关联到贵企业账单</li>
            <li>访客离场时无需支付，停车费用将计入企业月底账单</li>
          </ol>
          <Alert 
            message="注意事项" 
            description="请确保贵企业账户余额充足，以确保访客顺利通行。如有任何问题，请联系园区管理处。"
            type="warning" 
            showIcon 
          />
        </div>
      </Modal>
    </div>
  );
};

export default EnterpriseQRCode;
