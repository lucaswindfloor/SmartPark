import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Tag, 
  Statistic, 
  Divider, 
  Steps, 
  Radio, 
  Form, 
  Input, 
  Space,
  Modal,
  message,
  Alert,
  Upload,
  Result
} from 'antd';
import { 
  DollarOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  BankOutlined,
  CreditCardOutlined, 
  WechatOutlined, 
  AlipayOutlined,
  UploadOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Step } = Steps;

interface BillItem {
  key: string;
  billNo: string;
  period: string;
  type: string;
  totalAmount: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'partial';
}

const columns: ColumnsType<BillItem> = [
  {
    title: '账单编号',
    dataIndex: 'billNo',
    key: 'billNo',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '计费周期',
    dataIndex: 'period',
    key: 'period',
  },
  {
    title: '费用类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '金额（元）',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    align: 'right',
    render: (text) => Number(text).toFixed(2),
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status }) => {
      let color = 
        status === 'paid' ? 'green' : 
        status === 'unpaid' ? 'blue' : 
        status === 'partial' ? 'orange' : 'red';
      
      let text = 
        status === 'paid' ? '已支付' : 
        status === 'unpaid' ? '待支付' : 
        status === 'partial' ? '部分支付' : '已逾期';
      
      return (
        <Tag color={color}>
          {text}
        </Tag>
      );
    },
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>明细</a>
        {record.status !== 'paid' && <a>支付</a>}
        {record.status === 'paid' && <a>开票</a>}
      </Space>
    ),
  },
];

const billData: BillItem[] = [
  {
    key: '1',
    billNo: 'BL2023050001',
    period: '2023-05-01 - 2023-05-31',
    type: '租金',
    totalAmount: 15000,
    status: 'unpaid',
  },
  {
    key: '2',
    billNo: 'BL2023050002',
    period: '2023-05-01 - 2023-05-31',
    type: '物业费',
    totalAmount: 3000,
    status: 'unpaid',
  },
  {
    key: '3',
    billNo: 'BL2023050003',
    period: '2023-05-01 - 2023-05-31',
    type: '水电费',
    totalAmount: 1200.50,
    status: 'unpaid',
  },
  {
    key: '4',
    billNo: 'BL2023040001',
    period: '2023-04-01 - 2023-04-30',
    type: '租金',
    totalAmount: 15000,
    status: 'paid',
  },
  {
    key: '5',
    billNo: 'BL2023040002',
    period: '2023-04-01 - 2023-04-30',
    type: '物业费',
    totalAmount: 3000,
    status: 'paid',
  },
  {
    key: '6',
    billNo: 'BL2023030001',
    period: '2023-03-01 - 2023-03-31',
    type: '租金',
    totalAmount: 15000,
    status: 'paid',
  },
];

// 账单明细数据
interface BillDetailItem {
  key: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

const billDetailColumns: ColumnsType<BillDetailItem> = [
  {
    title: '费项名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    align: 'center',
  },
  {
    title: '单价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    align: 'right',
    render: (text) => `¥${Number(text).toFixed(2)}`,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
    render: (text) => `¥${Number(text).toFixed(2)}`,
  },
];

/**
 * 企业账单组件
 * 用于展示企业账单列表和支付功能
 */
const EnterpriseBill: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [paymentInvoiceModalVisible, setPaymentInvoiceModalVisible] = useState(false);
  const [selectedBills, setSelectedBills] = useState<BillItem[]>([]);
  const [form] = Form.useForm();

  // 模拟账单明细数据
  const billDetailData: BillDetailItem[] = [
    {
      key: '1',
      name: '办公室租金',
      unit: '㎡·月',
      unitPrice: 80,
      quantity: 187.5,
      amount: 15000,
    },
  ];

  const handlePayBill = () => {
    // 选择要支付的账单
    setSelectedBills(billData.filter(item => item.status === 'unpaid'));
    setPaymentVisible(true);
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePaymentSubmit = () => {
    setLoading(true);
    // 模拟支付处理
    setTimeout(() => {
      setLoading(false);
      nextStep();
    }, 2000);
  };

  const handlePaymentDone = () => {
    setPaymentVisible(false);
    setCurrentStep(0);
    message.success('支付成功！');
    // 询问是否需要开具发票
    setPaymentInvoiceModalVisible(true);
  };

  const totalUnpaidAmount = billData
    .filter(item => item.status === 'unpaid')
    .reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="enterprise-bill">
      {/* 账单概览 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月账单总额"
              value={19200.50}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待支付金额"
              value={totalUnpaidAmount}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#cf1322' }}
            />
            <Button 
              type="primary" 
              style={{ marginTop: 16 }} 
              onClick={handlePayBill}
              disabled={totalUnpaidAmount <= 0}
            >
              立即支付
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="企业预付款余额"
              value={5000}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本年累计缴费"
              value={96000}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      {/* 账单列表 */}
      <Card 
        title="账单列表" 
        extra={
          <Space>
            <Button icon={<FileTextOutlined />}>导出账单</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={billData}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* 账单明细弹窗 */}
      <Modal
        title="账单明细"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
          <Button key="download" type="primary">下载账单</Button>,
        ]}
        width={800}
      >
        <div className="bill-header" style={{ marginBottom: 24 }}>
          <Row>
            <Col span={8}>账单编号：BL2023050001</Col>
            <Col span={8}>计费周期：2023-05-01 - 2023-05-31</Col>
            <Col span={8}>生成日期：2023-04-25</Col>
          </Row>
          <Row style={{ marginTop: 8 }}>
            <Col span={8}>企业名称：湖南创新科技有限公司</Col>
            <Col span={16}>房间信息：A1栋-501室</Col>
          </Row>
        </div>

        <Table
          columns={billDetailColumns}
          dataSource={billDetailData}
          pagination={false}
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ amount }) => {
              totalAmount += amount;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="right">
                    <strong>合计：</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong>¥{totalAmount.toFixed(2)}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Modal>

      {/* 支付弹窗 */}
      <Modal
        title="账单支付"
        open={paymentVisible}
        onCancel={() => {
          if (currentStep === 2) {
            handlePaymentDone();
          } else {
            setPaymentVisible(false);
            setCurrentStep(0);
          }
        }}
        footer={null}
        width={800}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="确认账单" icon={<FileTextOutlined />} />
          <Step title="选择支付方式" icon={<BankOutlined />} />
          <Step title="完成支付" icon={<CheckCircleOutlined />} />
        </Steps>

        <Divider />

        {/* 步骤1：确认账单 */}
        {currentStep === 0 && (
          <>
            <Table
              columns={columns.filter(col => col.key !== 'action')}
              dataSource={selectedBills}
              pagination={false}
              rowSelection={{
                type: 'checkbox',
                defaultSelectedRowKeys: selectedBills.map(bill => bill.key),
              }}
              summary={(pageData) => {
                let total = 0;
                pageData.forEach(({ totalAmount }) => {
                  total += totalAmount;
                });
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3} align="right">
                        <strong>合计：</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <strong>{total.toFixed(2)}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Button onClick={() => setPaymentVisible(false)} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
            </div>
          </>
        )}

        {/* 步骤2：选择支付方式 */}
        {currentStep === 1 && (
          <>
            <Form form={form} layout="vertical">
              <Form.Item label="支付方式" name="paymentMethod" initialValue={paymentMethod}>
                <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                  <Radio.Button value="balance">预付款支付</Radio.Button>
                  <Radio.Button value="online">在线支付</Radio.Button>
                  <Radio.Button value="bank">银行转账</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {paymentMethod === 'online' && (
                <div className="payment-methods" style={{ marginTop: 16 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card style={{ textAlign: 'center', cursor: 'pointer', border: '1px solid #1890ff' }}>
                        <WechatOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                        <p style={{ marginTop: 8 }}>微信支付</p>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card style={{ textAlign: 'center', cursor: 'pointer' }}>
                        <AlipayOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                        <p style={{ marginTop: 8 }}>支付宝支付</p>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card style={{ textAlign: 'center', cursor: 'pointer' }}>
                        <CreditCardOutlined style={{ fontSize: 32, color: '#f5222d' }} />
                        <p style={{ marginTop: 8 }}>银联支付</p>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bank-info" style={{ marginTop: 16 }}>
                  <Alert
                    message="银行转账信息"
                    description={
                      <>
                        <p>开户行：中国建设银行长沙湘江新区支行</p>
                        <p>户名：湘江科创基地管理有限公司</p>
                        <p>账号：4309 1234 5678 9012 345</p>
                        <p>转账时请备注企业名称和账单编号</p>
                      </>
                    }
                    type="info"
                    showIcon
                  />
                  <Form.Item label="转账凭证" name="receiptImage" style={{ marginTop: 16 }}>
                    <Upload>
                      <Button icon={<UploadOutlined />}>上传转账凭证</Button>
                    </Upload>
                  </Form.Item>
                </div>
              )}

              {paymentMethod === 'balance' && (
                <div className="balance-info" style={{ marginTop: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="当前预付款余额"
                        value={5000}
                        precision={2}
                        prefix={<DollarOutlined />}
                        suffix="元"
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="需支付金额"
                        value={19200.50}
                        precision={2}
                        prefix={<DollarOutlined />}
                        suffix="元"
                      />
                    </Col>
                  </Row>
                  <Alert
                    message="余额不足提示"
                    description="当前预付款余额不足以支付所选账单，请充值或选择其他支付方式。"
                    type="warning"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </div>
              )}

              <Divider />

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button onClick={prevStep} style={{ marginRight: 8 }}>
                  上一步
                </Button>
                <Button 
                  type="primary" 
                  onClick={handlePaymentSubmit}
                  loading={loading}
                  disabled={paymentMethod === 'balance' && 5000 < 19200.50}
                >
                  确认支付
                </Button>
              </div>
            </Form>
          </>
        )}

        {/* 步骤3：完成支付 */}
        {currentStep === 2 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Result
              status="success"
              title="支付成功！"
              subTitle={`您已成功支付 ¥19,200.50 元，交易单号：PY${Date.now()}`}
              extra={[
                <Button type="primary" key="done" onClick={handlePaymentDone}>
                  完成
                </Button>,
              ]}
            />
          </div>
        )}
      </Modal>

      {/* 是否开发票弹窗 */}
      <Modal
        title="开具发票"
        open={paymentInvoiceModalVisible}
        onCancel={() => setPaymentInvoiceModalVisible(false)}
        footer={[
          <Button key="later" onClick={() => setPaymentInvoiceModalVisible(false)}>
            稍后再说
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => {
              setPaymentInvoiceModalVisible(false);
              message.success('已跳转到开票申请页面');
              // 在实际应用中，这里应该跳转到开票申请页面
            }}
          >
            立即开票
          </Button>,
        ]}
      >
        <p>支付已成功完成，是否需要为此笔支付开具发票？</p>
      </Modal>
    </div>
  );
};

export default EnterpriseBill; 