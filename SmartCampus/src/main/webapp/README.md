# 智慧园区前端项目
> 最后更新: 2023-10-15

## 项目架构

本项目采用基于Vue3的多平台前端架构，主要特点：

### 多入口微前端架构
- 平台选择器：`app-selector`
- 综合管理平台：`platforms/comprehensive`
- 公共服务平台：`platforms/public-service`
- 系统管理员平台：`platforms/system-admin`

### 核心技术栈
- Vue3 + Composition API
- Vue Router 4
- Pinia 状态管理
- Element Plus UI库
- Vite 构建工具

### 目录结构
```
SmartCampus/
├── public/                                 # 静态资源
│   ├── favicon.ico                         # ⏳
│   ├── assets/                             # 公共静态资源 ⏳
│   └── index.html                          # ⏳
│
├── src/
│   ├── core/                               # 核心模块 (跨平台共享)
│   │   ├── utils/                          # 通用工具
│   │   │   ├── request.js                  # API请求封装 ⏳
│   │   │   ├── auth.js                     # 认证工具 ⏳
│   │   │   ├── storage.js                  # 本地存储工具 ⏳
│   │   │   ├── formatter.js                # 数据格式化工具 ⏳
│   │   │   ├── validator.js                # 数据验证工具 ⏳
│   │   │   └── events.js                   # 事件总线(平台间通信) ⏳
│   │   │
│   │   ├── components/                     # 通用组件
│   │   │   ├── ui/                         # UI通用组件 ⏳
│   │   │   └── business/                   # 业务通用组件 ⏳
│   │   │
│   │   ├── directives/                     # 全局指令 ⏳
│   │   ├── constants/                      # 常量定义 ⏳
│   │   ├── hooks/                          # 自定义钩子 ⏳
│   │   └── plugins/                        # 插件配置 ⏳
│   │
│   ├── platforms/                          # 平台层
│   │   ├── comprehensive/                  # 综合管理平台
│   │   │   ├── router/                     # 路由配置
│   │   │   │   ├── index.js                # ✅
│   │   │   │   └── modules/                # 按模块划分路由
│   │   │   │       ├── dashboard.js        # 工作门户路由 ✅
│   │   │   │       ├── investment.js       # 招商管理路由 ✅
│   │   │   │       ├── operation.js        # 运营管理路由 ⏳
│   │   │   │       ├── finance.js          # 财务管理路由 ⏳
│   │   │   │       ├── service.js          # 服务管理路由 ✅
│   │   │   │       ├── asset.js            # 资产管理路由 ⏳
│   │   │   │       ├── energy.js           # 能源管理路由 ⏳
│   │   │   │       └── statistics.js       # 综合统计路由 ⏳
│   │   │   │
│   │   │   ├── views/                      # 页面组件
│   │   │   │   ├── dashboard/              # 工作门户
│   │   │   │   │   ├── index.vue           # 主页面 ⏳
│   │   │   │   │   └── components/         # 仪表盘组件 ⏳
│   │   │   │   │
│   │   │   │   ├── investment/             # 招商管理模块
│   │   │   │   │   ├── index.vue           # 投资管理入口 ✅
│   │   │   │   │   ├── customer/           # 客户管理 ✅
│   │   │   │   │   ├── contract/           # 合同签约 ✅
│   │   │   │   │   └── intention/          # 意向管理 ✅
│   │   │   │   │
│   │   │   │   ├── operation/              # 运营管理模块
│   │   │   │   │   ├── enterprise/         # 企业管理 ⏳
│   │   │   │   │   ├── contract/           # 合同管理 ⏳
│   │   │   │   │   └── space/              # 空间管理 ⏳
│   │   │   │   │
│   │   │   │   ├── finance/                # 财务管理模块
│   │   │   │   │   ├── billing/            # 账单管理 ⏳
│   │   │   │   │   ├── payment/            # 收款管理 ⏳
│   │   │   │   │   └── invoice/            # 开票管理 ⏳
│   │   │   │   │
│   │   │   │   ├── service/                # 服务管理模块
│   │   │   │   │   ├── information/        # 信息发布管理
│   │   │   │   │   │   ├── notification/   # 通知公告 ⏳
│   │   │   │   │   │   ├── policy/         # 政策文件 ⏳
│   │   │   │   │   │   ├── activity/       # 园区活动 ⏳
│   │   │   │   │   │   ├── survey/         # 问卷调查 ⏳
│   │   │   │   │   │   └── demand/         # 需求发布 ⏳
│   │   │   │   │   ├── workorder/          # 工单管理 ⏳
│   │   │   │   │   └── evaluation/         # 服务评价 ⏳
│   │   │   │   │
│   │   │   │   ├── asset/                  # 资产管理模块
│   │   │   │   │   ├── register/           # 资产登记 ⏳
│   │   │   │   │   ├── inspection/         # 资产巡检 ⏳
│   │   │   │   │   └── maintenance/        # 资产维护 ⏳
│   │   │   │   │
│   │   │   │   ├── energy/                 # 能源管理模块
│   │   │   │   │   ├── monitoring/         # 能耗监测 ⏳
│   │   │   │   │   └── analysis/           # 能耗分析 ⏳
│   │   │   │   │
│   │   │   │   └── statistics/             # 综合统计模块 ⏳
│   │   │   │
│   │   │   ├── components/                 # 平台特定组件 ⏳
│   │   │   ├── api/                        # API接口 ⏳
│   │   │   ├── store/                      # Pinia状态 ⏳
│   │   │   └── App.vue                     # 综合管理平台主应用 ⏳
│   │   │
│   │   ├── public-service/                 # 公共服务平台
│   │   │   ├── router/                     # 路由配置 ⏳
│   │   │   ├── views/                      # 页面组件
│   │   │   │   ├── home/                   # 首页 ⏳
│   │   │   │   ├── information/            # 信息公开
│   │   │   │   │   ├── notification/       # 通知公告 ⏳
│   │   │   │   │   ├── policy/             # 政策文件 ⏳
│   │   │   │   │   ├── activity/           # 园区活动 ⏳
│   │   │   │   │   ├── survey/             # 问卷调查 ⏳
│   │   │   │   │   └── demand/             # 需求浏览 ⏳
│   │   │   │   │
│   │   │   │   ├── service-hall/           # 服务大厅
│   │   │   │   │   ├── property/           # 物业服务
│   │   │   │   │   │   ├── repair/         # 维修申报 ⏳
│   │   │   │   │   │   ├── complaint/      # 投诉建议 ⏳
│   │   │   │   │   │   └── admission/      # 入退园申请 ⏳
│   │   │   │   │   │
│   │   │   │   │   ├── supporting/         # 配套服务
│   │   │   │   │   │   ├── meeting-room/   # 会议室预订 ⏳
│   │   │   │   │   │   ├── visitor/        # 访客管理 ⏳
│   │   │   │   │   │   ├── parking/        # 停车服务 ⏳
│   │   │   │   │   │   └── payment/        # 费用缴纳 ⏳
│   │   │   │   │   │
│   │   │   │   │   ├── growth/             # 成长服务
│   │   │   │   │   │   ├── registration/   # 企业注册申请 ⏳
│   │   │   │   │   │   └── financing/      # 融资服务申请 ⏳
│   │   │   │   │   │
│   │   │   │   │   └── value-added/        # 增值服务
│   │   │   │   │       ├── laboratory/     # 实验室申请 ⏳
│   │   │   │   │       └── computing/      # 算力服务申请 ⏳
│   │   │   │   │
│   │   │   │   ├── user-center/            # 用户中心
│   │   │   │   │   ├── profile/            # 个人信息 ⏳
│   │   │   │   │   ├── messages/           # 我的消息 ⏳
│   │   │   │   │   ├── applications/       # 我的申请 ⏳
│   │   │   │   │   ├── reservations/       # 我的预订 ⏳
│   │   │   │   │   ├── activities/         # 我的活动 ⏳
│   │   │   │   │   └── settings/           # 个人设置 ⏳
│   │   │   │   │
│   │   │   │   └── enterprise-manage/      # 企业管理(管理员)
│   │   │   │       ├── employee/           # 员工管理 ⏳
│   │   │   │       ├── permissions/        # 权限管理 ⏳
│   │   │   │       ├── bills/              # 账单管理 ⏳
│   │   │   │       └── info/               # 企业信息 ⏳
│   │   │   │
│   │   │   ├── components/                 # 平台特定组件 ⏳
│   │   │   ├── api/                        # API接口 ⏳
│   │   │   ├── store/                      # Pinia状态 ⏳
│   │   │   └── App.vue                     # 公共平台主应用 ⏳
│   │   │
│   │   └── system-admin/                   # 系统管理员平台
│   │       ├── router/                     # 路由配置 ⏳
│   │       ├── views/                      # 页面组件
│   │       │   ├── dashboard/              # 系统概览 ⏳
│   │       │   ├── configuration/          # 系统配置管理
│   │       │   │   ├── global-params/      # 全局参数设置 ⏳
│   │       │   │   ├── dictionary/         # 数据字典管理 ⏳
│   │       │   │   ├── change-mgmt/        # 参数变更管理 ⏳
│   │       │   │   └── announcement/       # 系统公告管理 ⏳
│   │       │   │
│   │       │   ├── authorization/          # 权限与角色管理
│   │       │   │   ├── user/               # 用户管理 ⏳
│   │       │   │   ├── role/               # 角色管理 ⏳
│   │       │   │   ├── permission/         # 权限配置 ⏳
│   │       │   │   └── audit/              # 权限审计 ⏳
│   │       │   │
│   │       │   ├── workflow/               # 流程引擎管理
│   │       │   │   ├── process-design/     # 流程设计 ⏳
│   │       │   │   ├── form-design/        # 表单设计 ⏳
│   │       │   │   ├── rule-engine/        # 规则引擎 ⏳
│   │       │   │   └── process-monitor/    # 流程监控 ⏳
│   │       │   │
│   │       │   ├── monitoring/             # 系统监控中心
│   │       │   │   ├── performance/        # 性能监控 ⏳
│   │       │   │   ├── log/                # 日志管理 ⏳
│   │       │   │   ├── alert/              # 告警管理 ⏳
│   │       │   │   └── security/           # 安全审计 ⏳
│   │       │   │
│   │       │   └── integration/            # 系统集成管理
│   │       │       ├── interface/          # 接口管理 ⏳
│   │       │       ├── data-exchange/      # 数据交换配置 ⏳
│   │       │       └── external-system/    # 外部系统管理 ⏳
│   │       │
│   │       ├── components/                 # 平台特定组件 ⏳
│   │       ├── api/                        # API接口 ⏳
│   │       ├── store/                      # Pinia状态 ⏳
│   │       └── App.vue                     # 系统管理员平台主应用 ⏳
│   │
│   ├── services/                           # 服务层
│   │   ├── auth/                           # 认证服务 ⏳
│   │   ├── information/                    # 信息服务 ⏳
│   │   ├── system/                         # 系统服务 ⏳
│   │   ├── workflow/                       # 工作流服务 ⏳
│   │   ├── notification/                   # 通知服务(事件通知机制) ⏳
│   │   └── common/                         # 通用服务 ⏳
│   │
│   ├── assets/                             # 静态资源 ⏳
│   ├── locales/                            # 国际化语言包 ⏳
│   ├── app-selector/                       # 平台选择器 ⏳
│   ├── main-comprehensive.js               # 综合管理平台入口 ⏳
│   ├── main-public-service.js              # 公共服务平台入口 ⏳
│   ├── main-system-admin.js                # 系统管理员平台入口 ⏳
│   └── main.js                             # 统一入口（平台选择器） ⏳
│
├── vite.config.js                          # Vite配置 ⏳
└── package.json                            # 依赖配置 ⏳
```

**标记说明:**
- ✅ 已实现
- 🚧 开发中
- ⏳ 计划中/未开始

## 平台架构说明

### 1. 平台选择器
负责用户在不同平台之间的选择和切换。

### 2. 综合管理平台
面向园区管理人员的综合管理系统，包括：
- 工作门户
- 招商管理
- 运营管理
- 财务管理
- 服务管理
- 资产管理
- 能源管理
- 综合统计

### 3. 公共服务平台
面向园区企业和用户的公共服务平台，包括：
- 信息公开
- 服务大厅
- 用户中心

### 4. 系统管理员平台
面向系统管理员的管理平台，包括：
- 系统配置
- 权限管理
- 流程引擎
- 系统监控

## 开发规范

### 命名规范
- 文件夹：kebab-case（小写中横线）
- Vue组件：PascalCase（大驼峰）
- JS/TS文件：camelCase（小驼峰）
- CSS类名：kebab-case（小写中横线）

### 目录结构规范
- 每个平台维护独立的路由、组件和状态
- 跨平台共享的逻辑和组件放在core目录
- 服务层维护独立的业务逻辑

### 路由规范
- 每个平台有独立的路由体系
- 路由模块化，按功能模块拆分

### 状态管理规范
- 使用Pinia进行状态管理
- 按照功能模块拆分状态
- 跨平台共享状态放在全局

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建项目
```bash
npm run build
``` 