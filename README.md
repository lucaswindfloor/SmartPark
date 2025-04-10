# 湘江科创基地智慧园区系统

## 项目介绍

湘江科创基地智慧园区系统是一个集成化的园区管理平台，由两个子系统组成：

1. **智慧园区综合管理平台**：面向园区管理方使用，包括工作门户、招商管理、运营管理、财务管理、服务管理、资产管理、综合统计等功能模块
2. **公共服务平台**：面向园区企业及员工、公众使用，主要提供公共服务相关功能

## 快速启动

### 安装依赖

```bash
# 安装项目依赖
npm install
```

### 启动项目

```bash
# 方法1：使用npm命令
npm run dev

# 方法2：使用Node脚本（解决平台差异问题）
node start.js
```

浏览器将自动打开 http://localhost:3000 访问项目。

### 构建项目

```bash
npm run build
```

## 系统功能

### 智慧园区综合管理平台主要功能

- **工作门户**：系统总览、待办事项、通知公告等
- **招商管理**：客户管理、渠道管理、合同签约、企业入驻等
- **运营管理**：能源表管理、企业管理、合同管理、租控图等
- **财务管理**：押金管理、账单管理、收款管理、开票管理等
- **系统管理**：用户管理、角色管理、菜单管理、日志管理等
- **综合统计**：招商统计、合同统计、财务统计、资产统计等

### 公共服务平台主要功能

- **首页**：园区活动、服务导航、信息公开等
- **信息公开**：通知公告、政策文件、园区活动、需求发布、调查问卷
- **服务大厅**：
  - 物业服务：事件上报、维修申报、退租申请、退园申请
  - 配套服务：访客门禁申请、会议室预订、临停缴费、停车月卡、空调加时等
  - 成长服务：企业注册申请、融资服务申请
  - 增值服务：实验室申请、普惠算力申请
- **用户中心**：我的消息、我的预订、我的活动、我的申请、个人设置等

## 技术架构

- 前端：React + TypeScript + Ant Design + Vite
- 接口：RESTful API
- 响应式设计，支持多终端访问

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0
- 浏览器：Chrome, Firefox, Edge 等现代浏览器

## 项目结构

```
src/
├── assets/       # 静态资源文件
├── components/   # 公共组件
│   ├── finance/  # 财务相关组件
│   ├── process/  # 流程相关组件
│   └── property/ # 物业相关组件
├── hooks/        # 自定义钩子
├── layouts/      # 布局组件
├── pages/        # 页面组件
│   ├── admin/    # 管理平台页面
│   └── public/   # 公共服务平台页面
├── services/     # API服务
├── styles/       # 全局样式
└── utils/        # 工具函数
```

## 业务流程

系统核心业务流程涵盖企业从意向入驻到最终退出的整个生命周期：

1. **招商阶段**
   - 意向客户通过公共服务平台提交意向
   - 招商人员跟进意向客户

2. **合同签订阶段**
   - 招商人员草拟合同并配置费用
   - 合同审核通过后，为企业生成账号
   - 企业支付押金/首期款

3. **履约阶段**
   - 企业正式入驻并使用各项服务
   - 财务定期生成账单，企业缴费
   - 合同变更或续签处理

4. **退租阶段**
   - 企业申请退租/退园
   - 办理退园手续，完成结算
   - 企业正式离开，账号失效

## 用户角色

系统涉及多种用户角色，包括：
- 园区管理方：招商、运营、财务等
- 企业用户：企业管理员、普通员工
- 公众用户：潜在客户、园区访客

## 常见问题

### 类型错误
如果遇到TypeScript类型相关的错误，请确保：
1. 已安装所有依赖项 `npm install`
2. 使用正确的Node.js版本（推荐v16+）

### 启动失败
如果项目无法正常启动：
1. 删除node_modules文件夹和package-lock.json
2. 重新执行`npm install`
3. 使用`node start.js`启动项目 