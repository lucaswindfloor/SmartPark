import React from 'react';
import { Steps, Card, Typography, Divider } from 'antd';
import {
  FormOutlined,
  AuditOutlined,
  DollarOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface ContractProcessProps {
  currentStep?: number;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'default';
}

/**
 * 合同签约流程组件
 * 展示从合同拟定到企业入驻的整个流程
 */
const ContractProcess: React.FC<ContractProcessProps> = ({
  currentStep = 0,
  direction = 'horizontal',
  size = 'default',
}) => {
  const steps = [
    {
      title: '拟定合同',
      description: '招商人员创建合同',
      icon: <FormOutlined />,
      content: (
        <>
          <Paragraph>
            <Text strong>招商人员进行如下操作：</Text>
          </Paragraph>
          <Paragraph>
            1. 选择客户和房源
          </Paragraph>
          <Paragraph>
            2. 填写合同基本信息
          </Paragraph>
          <Paragraph>
            3. 设置合同费用项（租金、物业费等）
          </Paragraph>
          <Paragraph>
            4. 设置账单生成规则
          </Paragraph>
          <Paragraph>
            5. 提交合同审批
          </Paragraph>
        </>
      ),
    },
    {
      title: '合同审批',
      description: '部门负责人审批',
      icon: <AuditOutlined />,
      content: (
        <>
          <Paragraph>
            <Text strong>合同审批流程：</Text>
          </Paragraph>
          <Paragraph>
            1. 部门负责人审核合同信息
          </Paragraph>
          <Paragraph>
            2. 核实客户和房源信息
          </Paragraph>
          <Paragraph>
            3. 确认合同费用与市场定价匹配
          </Paragraph>
          <Paragraph>
            4. 审批通过/驳回
          </Paragraph>
        </>
      ),
    },
    {
      title: '缴纳首付款',
      description: '企业支付首期款',
      icon: <DollarOutlined />,
      content: (
        <>
          <Paragraph>
            <Text strong>首付款支付流程：</Text>
          </Paragraph>
          <Paragraph>
            1. 系统自动生成首期账单
          </Paragraph>
          <Paragraph>
            2. 通知企业进行支付
          </Paragraph>
          <Paragraph>
            3. 企业通过系统在线支付或线下缴费
          </Paragraph>
          <Paragraph>
            4. 财务确认收款
          </Paragraph>
        </>
      ),
    },
    {
      title: '开通账号',
      description: '生成企业账号',
      icon: <UserSwitchOutlined />,
      content: (
        <>
          <Paragraph>
            <Text strong>企业账号开通流程：</Text>
          </Paragraph>
          <Paragraph>
            1. 系统自动生成企业账号
          </Paragraph>
          <Paragraph>
            2. 发送账号和初始密码至企业联系人
          </Paragraph>
          <Paragraph>
            3. 企业登录系统，完善企业信息
          </Paragraph>
          <Paragraph>
            4. 企业可添加员工账号
          </Paragraph>
        </>
      ),
    },
    {
      title: '企业入驻',
      description: '完成入驻手续',
      icon: <CheckCircleOutlined />,
      content: (
        <>
          <Paragraph>
            <Text strong>企业入驻流程：</Text>
          </Paragraph>
          <Paragraph>
            1. 企业在系统中提交入驻申请
          </Paragraph>
          <Paragraph>
            2. 运营人员审核入驻申请
          </Paragraph>
          <Paragraph>
            3. 设置员工门禁权限
          </Paragraph>
          <Paragraph>
            4. 办理物资交接手续
          </Paragraph>
          <Paragraph>
            5. 完成入驻确认
          </Paragraph>
        </>
      ),
    },
  ];

  return (
    <Card title="合同签约流程">
      <Steps
        current={currentStep}
        direction={direction}
        size={size}
        items={steps.map((step) => ({
          title: step.title,
          description: step.description,
          icon: step.icon,
        }))}
      />
      <Divider />
      <div className="steps-content" style={{ padding: '20px 0' }}>
        <Title level={4}>{steps[currentStep].title}</Title>
        {steps[currentStep].content}
      </div>
    </Card>
  );
};

export default ContractProcess; 