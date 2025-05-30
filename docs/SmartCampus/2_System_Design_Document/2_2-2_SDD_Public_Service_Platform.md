
# 湘江科创基地智慧园区系统 - 公共服务平台技术设计文档

## 1. 平台概述

### 1.1 平台定位与职责

湘江科创基地智慧园区系统的公共服务平台是面向园区企业及员工、公众的服务窗口，承担以下核心职责：

- **企业服务支撑**：为园区企业提供账单缴费、空调加时、会议室预订等日常服务
- **员工便捷办事**：支持园区员工进行报修、事件上报、门禁申请等操作
- **信息透明公开**：发布园区通知公告、政策文件、园区活动等信息
- **企业成长助力**：提供企业注册申请、融资服务申请等成长服务

平台功能边界包括：信息公开、服务大厅（物业服务、配套服务、成长服务、增值服务）、用户中心等功能模块。

### 1.2 技术架构

公共服务平台采用前后端分离的B/S架构，整体架构如下：

![系统架构图](https://mermaid.ink/img/pako:eNqNk81u2zAMx19F0KnF9gY5DRs6GE3arU2HocehB9piYiGy5ElK0hTZu0-2kzTNgqE-RPT_R_JHUccoNAo0wxMVNf44M6rBF3FEBU36Wp43StLTXDcP-5R08Vjrub5caHNMv1T5Vmj6kvzoItw0R-_q7IbYcSt_qAzBu0IAOnAdWpm9XgCuPRiVWwc1BVl9jLra7azRS-_9vQZsYw-BFG-trG3wt5Cn5tmvXZl3IF1uVVKKyPBYKVwaciiqSXG7NED2Cm6ALt3YkOJDZgM2TPXKgCnmUO0Eu24MTLjaxgJfjrdIUVMNfvjvkOrQbh_ltcvljZK0I7c_GtsbtaB9geF9p-9OeHB67kqyyIOE_FcgDHJR5aIkVE0hmXDwN0cS_nY-pjQf6_9DxJ2XzlDcE5pZ_fxvTFcYzt_DmGB4joZBZSV8hXx2g3eopPlG7gFdG7jD4PEe3yeQglvD7ROsVUioUKv1mM6is-pxTqLFftDsDU8MvjzHrR9VKgj_AjtLCTY?type=png)

主要采用的技术架构模式包括：
- 响应式Web设计
- 轻量级微服务架构
- 基于API Gateway的接口统一管理
- 分布式系统集成
- 移动优先的用户体验设计

### 1.3 设计决策与依据

1. **前端框架选择**
   - 决策：采用Vue.js 3.x + Element Plus + 移动端适配
   - 依据：提供统一的用户体验，支持PC和移动端自适应，降低维护成本

2. **API网关统一入口**
   - 决策：所有前端请求通过API网关统一接入
   - 依据：提供统一的接口管理、鉴权、限流，降低多端接入复杂度

3. **轻量级后端设计**
   - 决策：公共服务平台作为展示层，核心业务逻辑复用综合管理平台服务
   - 依据：避免业务逻辑重复实现，保持数据一致性

4. **小程序与Web协同**
   - 决策：小程序与Web平台功能协同，API共享
   - 依据：提供全场景覆盖的用户体验，园区企业和员工可通过多渠道访问服务
### 1.4 用户场景与体验框架

#### 1.4.1 用户角色定义

公共服务平台面向以下核心用户角色设计体验：

| 用户角色 | 角色描述 | 主要需求 | 使用场景特点 |
|---------|---------|--------|------------|
| 企业管理员 | 负责管理企业账号与权限，处理企业级事务 | 账单管理、员工管理、合同信息查看 | 需全局视图，权限管理需求强 |
| 企业员工 | 企业内普通员工，使用日常办公服务 | 日常报修、会议室预订、访客登记 | 操作频繁，流程简单化 |
| 财务人员 | 负责企业账单、发票等财务事项 | 账单缴费、开票申请、预付款管理 | 数据准确性要求高，需导出功能 |
| 临时访客 | 临时到访园区的外部人员 | 访客登记、临时停车缴费 | 无需注册，流程简化，一次性使用 |
| 潜在客户 | 有意向入驻园区的企业代表 | 园区信息查看、意向登记 | 信息浏览为主，低门槛交互 |

#### 1.4.2 关键用户旅程

以下是平台核心用户旅程示例：

**企业入驻后首次使用旅程**：
1. 接收企业账号激活通知（短信/邮件）
2. 首次登录与密码设置
3. 完善企业信息与员工信息
4. 了解平台功能与服务
5. 配置开票信息与预付款充值
6. 查看首期账单与缴费

**日常报修服务旅程**：
1. 发现设施故障
2. 扫描设备二维码或进入报修界面
3. 填写故障信息与图片上传
4. 提交报修申请
5. 实时跟踪处理进度
6. 接收处理完成通知
7. 进行服务评价

**账单缴费旅程**：
1. 接收账单生成通知
2. 查看账单明细
3. 选择支付方式(预付款/在线支付)
4. 完成支付流程
5. 接收支付成功通知
6. 发起开票申请(可选)
7. 接收电子发票

#### 1.4.3 体验目标与度量

公共服务平台设定以下用户体验目标及度量指标：

| 体验目标 | 具体描述 | 评估指标 |
|---------|---------|---------|
| 直观易用 | 用户无需培训即可完成核心任务 | 任务完成率>95%，首次使用成功率>90% |
| 高效便捷 | 减少操作步骤，提高任务完成速度 | 核心流程步骤≤5步，任务完成时间较线下减少50% |
| 反馈明确 | 操作结果及时反馈，状态变化清晰可见 | 关键操作反馈时间<1秒，状态变更通知到达率>99% |
| 全场景覆盖 | 支持PC/移动/小程序多终端一致体验 | 跨终端功能一致性>95%，核心流程全终端可用 |
| 弱网适应性 | 在网络不稳定环境下保持可用性 | 弱网环境下核心功能可用率>90% |

平台将通过用户反馈收集、使用数据分析、定期用户测试等方式持续评估和优化用户体验。

## 2. 核心技术框架

### 2.1 前端架构

#### 2.1.1 前端技术栈

- **核心框架**: Vue.js 3.x (Composition API)
- **状态管理**: Pinia
- **路由管理**: Vue Router 4.x
- **UI组件库**: Element Plus (PC)、Vant (移动端)
- **构建工具**: Vite
- **HTTP客户端**: Axios
- **数据可视化**: ECharts 5.x
- **移动适配**: Viewport、媒体查询、rem布局
- **CSS框架**: TailwindCSS + CSS变量

#### 2.1.2 前端架构设计

采用基于功能的模块化设计：

```
src/
├── assets/                # 静态资源
├── components/            # 公共组件
│   ├── common/            # 通用基础组件
│   └── business/          # 业务组件
├── composables/           # 组合式API
├── modules/               # 核心功能模块
│   ├── home/              # 首页功能
│   ├── info/              # 信息公开
│   ├── service/           # 服务大厅
│   └── account/           # 用户中心
├── layouts/               # 布局组件
├── router/                # 路由配置
├── services/              # API服务封装
├── stores/                # 状态管理
├── styles/                # 全局样式
├── utils/                 # 工具函数
└── App.vue                # 根组件
```

#### 2.1.3 适配策略

采用移动优先的自适应设计策略：
- 基础布局：移动端优先设计
- 断点设计：xs(<768px)、sm(≥768px)、md(≥992px)、lg(≥1200px)、xl(≥1600px)
- 组件响应：组件层面实现自适应布局
- 内容折叠：大屏展开，小屏折叠菜单

#### 2.1.4 小程序架构

与微信小程序深度集成：
- 基于uni-app实现小程序跨端开发
- 页面结构与Web端保持一致，代码共享率>70%
- 微信原生能力封装：扫码、支付、位置
- 小程序独有场景优化：扫码报修、快速支付

### 2.2 后端架构

#### 2.2.1 后端技术栈

- **核心框架**: Spring Boot 2.7.x, Spring Cloud 2021.x
- **API网关**: Spring Cloud Gateway
- **安全框架**: Spring Security + JWT
- **接口文档**: SpringDoc (OpenAPI 3.0)
- **缓存服务**: Redis
- **消息推送**: WebSocket + 消息队列
- **支付集成**: 微信支付、银联支付SDK

#### 2.2.2 后端分层架构

轻量级分层架构：
- **控制层**：处理请求/响应转换，权限验证，参数校验
- **服务层**：编排业务逻辑，调用系统内部服务
- **集成层**：封装对综合管理平台微服务的调用
- **基础设施层**：提供缓存、消息、文件等基础服务

#### 2.2.3 前后端交互模式

采用RESTful API + WebSocket双模式交互：
- RESTful API：常规数据交互
- WebSocket：消息推送、实时通知
- 服务器发送事件(SSE)：单向数据更新推送

### 2.3 数据访问层

#### 2.3.1 数据聚合策略

公共服务平台作为展示层，采用数据聚合策略：
- 面向用户的数据视图：根据用户角色聚合多个业务数据
- 聚合缓存：热点数据本地缓存，提升响应速度
- 按需加载：大数据量场景实施懒加载策略
- 预加载优化：用户高频场景数据预加载

#### 2.3.2 服务调用优化

调用综合管理平台微服务的优化策略：
- 业务分组调用：一次请求聚合多个业务数据
- 结果缓存：高频查询结果缓存
- 熔断降级：核心服务故障时降级展示
- 异步加载：非核心数据异步加载

#### 2.3.3 状态维护策略

前端状态与后端数据同步策略：
- 乐观更新：操作即更新本地状态，异步同步服务端
- 冲突检测：基于版本号的数据冲突检测
- 定时刷新：关键数据定时同步刷新
- 会话状态：前端维护轻量会话状态，减少请求

### 2.4 前端性能优化

#### 2.4.1 首屏加载优化

- 路由懒加载：按模块分割代码，按需加载
- 静态资源CDN：图片、字体等资源CDN加速
- 骨架屏：首屏核心区域骨架屏加载效果
- 关键CSS内联：首屏关键样式内联，避免阻塞

#### 2.4.2 移动端性能优化

- 图片优化：根据设备分辨率加载不同尺寸图片
- 触摸优化：消除移动端300ms点击延迟
- 动画性能：使用CSS硬件加速，避免重绘重排
- 减少重绘：合理使用will-change属性

#### 2.4.3 用户体验优化

- 预加载提示：操作反馈不超过300ms
- 下拉刷新：移动端列表下拉刷新
- 加载过渡：美观的加载状态过渡
- 表单即时校验：表单字段即时反馈

## 3. 服务组件设计

### 3.1 服务模块划分

| 模块名称 | 职责描述 | 关键功能 |
|---------|---------|---------|
| 用户认证服务 | 负责用户认证与授权 | 登录认证、企业员工关联、权限验证 |
| 信息公开服务 | 负责园区信息展示 | 通知公告、政策文件、园区活动、调查问卷 |
| 物业服务模块 | 提供物业相关服务 | 事件上报、维修申报、退租申请、退园申请 |
| 配套服务模块 | 提供园区配套服务 | 会议室预订、停车月卡、空调加时、账单缴费 |
| 成长服务模块 | 提供企业成长服务 | 企业注册申请、融资服务申请 |
| 支付服务模块 | 处理各类支付业务 | 微信支付、银联支付、预付款支付 |
| 用户中心服务 | 管理用户信息与事项 | 消息通知、服务申请管理、预订管理 |
| 文件服务模块 | 处理文件上传下载 | 图片上传、文件预览、多媒体处理 |

### 3.2 公共组件

#### 3.2.1 UI组件库

| 组件名称 | 功能描述 | 应用场景 |
|---------|---------|---------|
| 园区卡片组件 | 统一样式的信息卡片 | 通知公告、政策文件、服务展示 |
| 服务申请表单 | 统一的服务申请表单框架 | 各类服务申请表单 |
| 流程跟踪组件 | 展示申请流程与状态 | 查看申请进度与结果 |
| 文件上传组件 | 处理文件上传与预览 | 图片上传、文件提交 |
| 消息通知组件 | 统一的消息提醒样式 | 系统通知、申请状态变更 |
| 扫码组件 | 支持多场景扫码功能 | 扫码缴费、扫码报修 |
| 支付组件 | 统一支付流程与界面 | 账单支付、服务费用支付 |

#### 3.2.2 业务组件封装

- 权限验证组件：基于角色实现细粒度权限控制
- 业务表单组件：各类服务申请表单的统一封装
- 文件处理组件：图片压缩、格式验证、预览
- 消息中心组件：统一的消息通知与处理

### 3.3 第三方集成

#### 3.3.1 支付系统集成

支持多渠道支付集成：
- 微信支付：JSAPI支付、小程序支付、H5支付
- 银联支付：B2B企业网银、B2C个人网银
- 预付款支付：企业预付款自动扣减
- 支付结果处理：异步通知、订单状态查询

#### 3.3.2 微信生态集成

微信生态深度集成：
- 微信小程序：扫码功能、分享功能
- 微信认证：企业员工微信授权登录
- 微信通知：服务申请状态变更推送
- 微信卡包：电子凭证存储

#### 3.3.3 集成点管理

| 外部系统 | 集成方式 | 数据流向 | 故障处理策略 |
|---------|---------|---------|------------|
| 微信支付 | 微信支付API | 双向 | 本地订单状态兜底 |
| 银联支付 | 银联支付API | 双向 | 掉单处理机制 |
| 微信小程序 | 微信开放API | 双向 | 降级到H5页面 |
| 短信网关 | HTTP API | 单向发送 | 站内消息备份 |
| 对象存储 | OSS API | 双向 | 本地临时存储 |

### 3.4 消息推送架构

#### 3.4.1 消息分类与处理

- **系统通知**：系统级别的通知，如账单生成、合同到期
- **申请状态**：用户申请的状态变更通知
- **审批提醒**：需要用户确认或处理的信息
- **营销活动**：园区活动、优惠信息等营销类消息

#### 3.4.2 推送通道设计

多渠道统一推送架构：
- WebSocket：Web端在线实时推送
- 微信订阅消息：小程序消息推送
- 短信通知：重要信息短信提醒
- APP推送：移动应用推送通知
- 站内信：系统内消息留存

## 4. 数据模型详细设计

### 4.1 核心业务对象

#### 4.1.1 用户与认证模型

```
用户(User)
- userId: 用户ID
- username: 用户名
- password: 密码(加密存储)
- userType: 用户类型(企业管理员/企业员工/游客)
- phone: 手机号
- email: 邮箱
- status: 状态

企业员工(StaffMember)
- staffId: 员工ID
- userId: 用户ID
- enterpriseId: 企业ID
- name: 姓名
- position: 职位
- joinTime: 加入时间
- status: 状态(在职/离职)
- faceId: 人脸识别ID
```

#### 4.1.2 服务申请模型

```
服务申请(ServiceApplication)
- applicationId: 申请ID
- serviceType: 服务类型
- applicantId: 申请人ID
- enterpriseId: 企业ID
- content: 申请内容(JSON)
- status: 状态
- createTime: 创建时间
- updateTime: 更新时间
- attachments: 附件列表

空调加时申请(AirConditionerBooking) extends 服务申请
- roomId: 房间ID
- airConditionerId: 空调ID
- startTime: 开始时间
- duration: 时长(小时)
- fee: 费用
- paymentStatus: 支付状态

会议室预订(MeetingRoomBooking) extends 服务申请
- roomId: 会议室ID
- startTime: 开始时间
- endTime: 结束时间
- purpose: 用途
- attendees: 参会人数
- fee: 费用
- accessCode: 门禁临时密码
```

#### 4.1.3 支付与账单模型

```
支付记录(PaymentRecord)
- paymentId: 支付ID
- orderId: 订单ID
- enterpriseId: 企业ID
- payerId: 支付人ID
- amount: 金额
- paymentType: 支付类型(微信/银联/预付款)
- status: 状态
- transactionId: 第三方支付流水号
- createTime: 创建时间
- completeTime: 完成时间

企业账单(EnterpriseBill)
- billId: 账单ID
- enterpriseId: 企业ID
- billType: 账单类型
- billMonth: 账单月份
- amount: 金额
- status: 状态(未支付/已支付/部分支付)
- dueDate: 到期日
- paymentRecords: 支付记录列表
```

### 4.2 缓存设计

#### 4.2.1 缓存分层策略

公共服务平台采用多级缓存策略：
- 浏览器缓存：静态资源、非敏感数据
- 应用缓存：用户会话、权限数据
- Redis缓存：共享会话、业务数据缓存
- CDN缓存：静态资源全球分发

#### 4.2.2 缓存内容规划

主要缓存对象与策略：

| 缓存对象 | 缓存位置 | 过期策略 | 更新机制 |
|---------|---------|---------|---------|
| 用户基本信息 | Redis | 30分钟 | 登录刷新 |
| 权限数据 | Redis | 30分钟 | 登录刷新 |
| 园区通知公告 | Redis | 10分钟 | 定时刷新 |
| 服务列表 | Redis | 1小时 | 服务变更触发 |
| 用户申请列表 | Redis | 5分钟 | 申请状态变更 |
| 房间基础信息 | Redis | 12小时 | 定时刷新 |
| 支付结果 | Redis | 30分钟 | 支付完成触发 |

#### 4.2.3 缓存一致性保障

采用多策略保障缓存一致性：
- 超时过期：适合变更频率低的数据
- 主动失效：数据变更时主动清除缓存
- 版本号控制：关键数据版本号管理
- 按需加载：核心场景实时查询

### 4.3 文件存储方案

#### 4.3.1 存储分类策略

按业务类型分类存储：
- 用户上传图片：报修图片、事件上报图片
- 系统文档：通知公告附件、政策文件
- 临时文件：临时上传未关联业务的文件
- 模板文件：表单模板、导出模板

#### 4.3.2 文件处理流程

文件上传与处理流程：
1. 前端文件预处理：格式验证、图片压缩
2. 分片上传：大文件自动分片上传
3. 病毒检测：服务端文件安全扫描
4. 存储分发：按业务类型存储至对应目录
5. 文件关联：与业务数据建立关联关系

### 4.4 过渡期数据策略

#### 4.4.1 双写一致性模式

在系统升级、服务迁移或功能重构过程中，采用双写一致性策略确保数据平滑过渡：

| 策略模式 | 适用场景 | 实施方法 | 风险控制 |
|---------|---------|---------|---------|
| 同步双写 | 高一致性要求场景，关键业务数据 | 在同一事务中写入新旧系统 | 性能影响监控，事务超时控制 |
| 消息驱动双写 | 大批量数据迁移，允许短暂不一致 | 通过消息队列异步双写 | 消息幂等处理，对账与修复机制 |
| 增量同步 | 历史数据迁移，新增数据双写 | CDC技术捕获变更，定向同步 | 数据漂移检测，差异自动修复 |
| 过渡期读策略 | 新旧系统共存阶段 | 读新回退到旧，或读旧回退到新 | 性能监控，超时降级方案 |

#### 4.4.2 合同变更双写机制

针对需求中提到的"合同变更"场景，实现特定的数据处理策略：

1. **数据暂存机制**：合同变更时，旧合同数据不立即删除，而是标记状态为"已变更"
2. **过渡期计费逻辑**：在变更生效日之前使用旧合同数据计费，之后使用新合同数据
3. **双账单显示期**：在变更月，同时展示变更前后两部分账单，并明确标识
4. **历史查询支持**：永久保留合同变更历史，支持按时间点查询历史合同状态

#### 4.4.3 数据一致性验证

实施严格的数据一致性验证机制，确保过渡期数据准确性：

1. **实时校验**：核心业务数据的双写操作包含实时校验逻辑
2. **定期对账**：每日定时任务对比新旧系统数据差异并生成报告
3. **自动修复**：对于可自动处理的数据不一致，系统自动执行修复
4. **人工干预**：对于复杂数据不一致情况，生成工单并提醒管理员处理

#### 4.4.4 过渡期用户体验

确保系统过渡期间用户体验平滑：

1. **无感知升级**：对用户隐藏技术实现细节，保持操作流程一致
2. **功能预告**：新功能上线前，提前告知用户即将到来的变化
3. **过渡期说明**：在账单等关键数据展示页面，提供明确的数据来源与计算规则说明
4. **问题快速响应**：过渡期设置专项支持团队，快速响应用户对数据准确性的疑问

## 5. 安全实现详细设计

### 5.1 认证与授权实现

#### 5.1.1 多渠道认证流程

支持多种认证方式：
- 账号密码认证：企业管理员、员工常规登录
- 手机验证码登录：短信验证码快捷登录
- 微信授权登录：小程序、H5微信授权
- 人脸识别认证：特定场景下的生物识别认证

#### 5.1.2 权限控制实现

基于RBAC的权限控制：
- 用户类型权限：企业管理员、企业员工、访客
- 功能权限：模块级、功能级权限控制
- 数据权限：企业级数据隔离
- 操作权限：增删改查细粒度控制

#### 5.1.3 跨终端会话管理

统一的会话管理：
- 基于JWT的无状态认证
- 令牌刷新：自动无感刷新
- 单点登录：PC、移动端、小程序统一认证
- 会话安全：设备指纹、异常登录检测

### 5.2 接口安全保障

#### 5.2.1 API安全策略

全方位API安全防护：
- 请求加密：敏感接口HTTPS + 参数加密
- 防重放攻击：时间戳 + nonce + 签名机制
- 接口限流：基于用户、IP的请求限流
- 参数验证：严格的参数校验和过滤

#### 5.2.2 支付安全保障

支付流程安全设计：
- 订单防篡改：订单信息签名验证
- 支付流水验证：金额、商户、订单三重校验
- 异步通知验签：支付结果回调签名验证
- 订单状态监控：未完成订单定时检查

#### 5.2.3 敏感数据保护

敏感信息保护措施：
- 手机号脱敏：前3后4显示，中间隐藏
- 证件号脱敏：前6后4显示，中间隐藏
- 银行卡脱敏：仅显示后4位
- 地址信息脱敏：详细地址模糊处理

### 5.3 前端安全实现

#### 5.3.1 Web前端安全

Web安全防护措施：
- XSS防护：输入过滤、输出编码
- CSRF防护：Token验证机制
- 点击劫持防护：X-Frame-Options头
- 敏感信息处理：本地存储加密、自动清理

#### 5.3.2 小程序安全

小程序特有安全措施：
- 数据存储加密：敏感数据本地加密存储
- 小程序签名验证：防篡改校验
- 用户授权管理：按功能申请最小权限
- 防刷机制：异常操作频率限制

## 6. 接口详细设计

### 6.1 API规范

#### 6.1.1 接口命名规范

RESTful API设计规范：
- 资源路径：/api/{version}/{module}/{resource}
- HTTP方法：GET(查询)、POST(创建)、PUT(更新)、DELETE(删除)
- 版本控制：通过URL路径区分接口版本(v1/v2)
- 查询参数：分页参数统一为page、size、sort

#### 6.1.2 统一响应格式

标准API响应结构：

```json
{
  "code": 200,                // 业务状态码
  "message": "success",       // 提示信息
  "data": {                   // 实际返回数据
    // 业务数据
  },
  "timestamp": 1629789092671  // 响应时间戳
}
```

### 6.2 核心业务接口

#### 6.2.1 用户认证接口

| 接口路径 | 方法 | 功能描述 | 权限要求 |
|---------|------|---------|---------|
| /api/v1/auth/login | POST | 用户登录 | 匿名访问 |
| /api/v1/auth/logout | POST | 用户登出 | 已登录 |
| /api/v1/auth/refresh-token | POST | 刷新令牌 | 已登录 |
| /api/v1/auth/sms-code | POST | 获取短信验证码 | 匿名访问 |
| /api/v1/auth/join-enterprise | POST | 员工加入企业 | 已登录 |

#### 6.2.2 服务申请接口

| 接口路径 | 方法 | 功能描述 | 权限要求 |
|---------|------|---------|---------|
| /api/v1/service/applications | GET | 获取服务申请列表 | 已登录 |
| /api/v1/service/applications/{id} | GET | 获取申请详情 | 已登录 |
| /api/v1/service/applications | POST | 创建服务申请 | 已登录 |
| /api/v1/service/applications/{id}/cancel | PUT | 取消服务申请 | 申请人 |
| /api/v1/service/repair | POST | 创建维修申报 | 企业用户 |
| /api/v1/service/event | POST | 创建事件上报 | 企业用户 |
| /api/v1/service/meeting-room | GET | 获取可用会议室 | 企业用户 |
| /api/v1/service/meeting-room/book | POST | 预订会议室 | 企业用户 |
| /api/v1/service/air-conditioner | GET | 获取空调列表 | 企业用户 |
| /api/v1/service/air-conditioner/book | POST | 申请空调加时 | 企业用户 |

#### 6.2.3 支付相关接口

| 接口路径 | 方法 | 功能描述 | 权限要求 |
|---------|------|---------|---------|
| /api/v1/payment/bills | GET | 获取企业账单 | 企业用户 |
| /api/v1/payment/bills/{id} | GET | 获取账单详情 | 企业用户 |
| /api/v1/payment/bills/{id}/pay | POST | 支付账单 | 企业用户 |
| /api/v1/payment/wechat/order | POST | 创建微信支付订单 | 已登录 |
| /api/v1/payment/union/order | POST | 创建银联支付订单 | 已登录 |
| /api/v1/payment/prepaid/pay | POST | 预付款支付 | 企业用户 |
| /api/v1/payment/orders/{id}/status | GET | 查询支付状态 | 已登录 |

### 6.3 信息发布接口

| 接口路径 | 方法 | 功能描述 | 权限要求 |
|---------|------|---------|---------|
| /api/v1/info/notices | GET | 获取通知公告列表 | 匿名访问 |
| /api/v1/info/notices/{id} | GET | 获取通知公告详情 | 匿名访问 |
| /api/v1/info/policies | GET | 获取政策文件列表 | 匿名访问 |
| /api/v1/info/policies/{id} | GET | 获取政策文件详情 | 匿名访问 |
| /api/v1/info/activities | GET | 获取园区活动列表 | 匿名访问 |
| /api/v1/info/activities/{id} | GET | 获取活动详情 | 匿名访问 |
| /api/v1/info/activities/{id}/register | POST | 活动报名 | 已登录 |
| /api/v1/info/questionnaires | GET | 获取问卷列表 | 匿名访问 |
| /api/v1/info/questionnaires/{id} | GET | 获取问卷详情 | 匿名访问 |
| /api/v1/info/questionnaires/{id}/submit | POST | 提交问卷调查 | 已登录 |

## 7. 移动端设计

### 7.1 小程序架构

#### 7.1.1 技术选型

小程序采用技术栈：
- 基础框架：uni-app (支持多端部署)
- UI组件：uView UI
- 状态管理：Vuex
- 请求封装：uni.request + 拦截器
- 缓存管理：uni.storage封装

#### 7.1.2 页面结构设计

小程序页面结构：
- 首页（园区动态、服务入口）
- 服务（服务分类与列表）
- 我的（个人中心、申请管理）
- 子页面（各类服务申请表单）

### 7.2 离线能力

#### 7.2.1 本地数据存储

小程序本地存储策略：
- 用户基本信息：登录后本地存储
- 最近服务：常用服务本地缓存
- 表单数据：表单填写数据自动保存
- 图片缓存：已上传图片本地缓存

#### 7.2.2 弱网络应对

弱网络环境优化：
- 请求重试：网络异常自动重试
- 断点续传：大文件上传断点续传
- 本地队列：关键操作本地队列，联网后同步
- 状态同步：网络恢复后状态自动同步

### 7.3 扫码场景设计

#### 7.3.1 扫码维修

扫码维修流程：
1. 扫描资产二维码
2. 自动识别设备信息
3. 填写故障描述
4. 上传故障图片
5. 提交维修申请

#### 7.3.2 扫码支付

扫码支付流程：
1. 扫描缴费二维码
2. 识别支付信息（账单ID、金额）
3. 确认支付信息
4. 选择支付方式
5. 完成支付

#### 7.3.3 扫码门禁

扫码门禁流程：
1. 扫描门禁二维码
2. 验证用户身份与权限
3. 记录进出记录
4. 门禁自动开启

## 8. 关键技术实现

### 8.1 支付流程实现

#### 8.1.1 统一支付流程

标准化的支付处理流程：
1. 创建支付订单：生成唯一订单号
2. 调用支付网关：根据支付方式调用对应接口
3. 获取支付参数：返回支付所需参数（如微信支付参数）
4. 用户完成支付：在前端完成实际支付过程
5. 接收支付通知：处理异步支付结果通知
6. 更新订单状态：完成订单和业务状态更新
7. 发送支付结果：向用户推送支付结果通知

#### 8.1.2 多渠道支付集成

支持多种支付方式：
- 微信支付：小程序支付、H5支付、JSAPI支付
- 银联支付：企业网银支付、个人网银支付
- 预付款支付：企业账户余额自动扣除
- 组合支付：支持多种支付方式组合使用

#### 8.1.3 支付安全保障

支付安全设计：
- 参数签名验证：支付参数MD5/HMAC签名
- 金额二次校验：订单金额与支付金额一致性验证
- 订单号唯一性：基于时间戳+随机数+业务标识生成
- 支付结果验证：通过订单查询二次确认支付状态

### 8.2 消息推送实现

#### 8.2.1 消息分发系统

消息分发架构：
1. 消息生产者：业务系统产生消息事件
2. 消息分发中心：基于RabbitMQ实现消息路由与分发
3. 消息订阅者：不同终端设备的推送接收组件
4. 消息持久化：消息内容和发送状态持久化存储

#### 8.2.2 多渠道推送集成

应用多渠道消息推送策略：
- 微信小程序：订阅消息推送
- 站内信息：Web应用内消息通知
- SMS短信：重要事项短信通知
- 电子邮件：详细内容推送
- 手机应用：移动端推送通知

#### 8.2.3 可靠性保障

消息推送可靠性设计：
- 消息重试机制：失败消息自动重试
- 推送状态跟踪：记录消息发送状态
- 渠道优先级：设置消息渠道优先级顺序
- 降级策略：高优先级渠道失败时自动降级

### 8.3 扫码服务实现

#### 8.3.1 统一二维码服务

二维码服务设计：
- 二维码生成：基于业务类型生成特定格式二维码
- 动态二维码：时效性二维码，支持过期机制
- 安全验证：二维码信息签名与验证
- 扫码分析：扫码行为追踪与统计

#### 8.3.2 业务场景适配

针对不同业务场景的二维码适配：
- 资产二维码：绑定资产ID，用于扫码报修
- 支付二维码：绑定支付订单，用于移动支付
- 门禁二维码：绑定访客权限，用于临时通行
- 活动二维码：绑定活动信息，用于签到验证

## 9. 关键业务场景实现

### 9.1 账单缴费流程

#### 9.1.1 账单展示与支付

账单缴费流程设计：
1. 账单加载：分页加载企业待缴账单
2. 账单详情：展示账单详细费项明细
3. 支付方式选择：预付款/微信支付/银联支付
4. 支付处理：调用对应支付接口
5. 支付结果处理：处理支付成功/失败状态
6. 支付完成通知：推送支付结果通知
7. 开票申请入口：支付成功后提供开票申请入口

#### 9.1.2 预付费管理

企业预付款管理流程：
1. 预付款充值：企业在线充值预付款
2. 预付款使用：账单优先使用预付款支付
3. 余额查询：实时查询预付款余额
4. 使用明细：查看预付款充值与消费记录
5. 退款处理：特殊情况下的预付款退款流程

### 9.2 服务申请流程

#### 9.2.1 统一服务申请流程

标准化服务申请处理流程：
1. 服务选择：用户选择需申请的服务类型
2. 表单填写：根据服务类型展示动态表单
3. 信息校验：表单数据实时校验
4. 提交申请：保存申请并提交工作流
5. 进度查询：申请进度实时查询
6. 状态通知：申请状态变更推送通知
7. 申请完成：服务完成结果反馈

#### 9.2.2 维修与事件报告流程

维修报修专用流程：
1. 问题描述：填写故障/事件描述
2. 位置选择：选择故障/事件发生位置
3. 图片上传：上传现场照片
4. 紧急程度：设置优先级/紧急程度
5. 提交跟踪：提交后实时跟踪处理进度
6. 处理反馈：接收处理过程和结果反馈
7. 评价服务：服务完成后进行评价

### 9.3 会议室预订流程

#### 9.3.1 会议室查询与预订

会议室预订流程：
1. 时段查询：根据日期和时间筛选可用会议室
2. 会议室选择：根据容量、设备等条件选择会议室
3. 预订信息填写：填写会议主题、参会人数等信息
4. 费用计算：自动根据企业类型和时长计算费用
5. 在线支付：使用预付款或线上支付方式
6. 预订确认：预订成功确认并发送通知
7. 临时密码生成：生成会议室门禁临时密码

#### 9.3.2 预订管理功能

会议室预订管理：
1. 我的预订：查看所有预订记录
2. 即将开始：提醒即将开始的会议
3. 取消预订：允许提前取消预订(自动计算退款)
4. 改期功能：允许修改预订时间和会议室
5. 延时申请：会议期间申请延长使用时间
6. 使用反馈：会议结束后提供使用反馈

## 10. 对接与集成

### 10.1 与综合管理平台集成

#### 10.1.1 数据同步机制

业务数据同步策略：
- 基础数据同步：通过API网关访问基础数据服务
- 实时数据同步：通过消息队列实现状态变更通知
- 定时同步任务：定期全量同步非关键数据
- 数据一致性检查：定期校验数据一致性

#### 10.1.2 权限与用户同步

用户与权限同步机制：
- 统一认证：共享认证中心，令牌互通
- 用户映射：企业用户与管理平台用户映射关系
- 角色同步：企业管理员角色权限实时同步
- 变更通知：用户权限变更自动推送通知

### 10.2 小程序集成

#### 10.2.1 功能协同设计

Web平台与小程序协同机制：
- 功能对应：小程序功能对应Web平台模块
- 数据共享：通过API网关实现数据共享
- 状态同步：操作状态实时同步
- 推送通知：状态变更多端同步通知

#### 10.2.2 小程序特有功能

小程序特有能力的利用：
- 扫码能力：资产扫码报修、二维码支付
- 地理位置：基于位置的园区服务推荐
- 微信支付：原生微信支付体验
- 微信通知：重要事项微信推送

### 10.3 第三方系统对接

#### 10.3.1 支付系统对接

支付系统集成设计：
- 接口适配：统一的支付接口适配器
- 订单管理：支付订单的创建与管理
- 支付回调：异步支付结果通知处理
- 对账机制：支付系统对账与数据核对

#### 10.3.2 门禁系统对接

门禁系统集成设计：
- 人员同步：企业员工信息自动同步
- 权限管理：根据企业租赁状态自动管理权限
- 临时通行：访客临时通行权限管理
- 开门记录：门禁开门记录查询与统计

### 10.4 部署架构总览

#### 10.4.1 物理部署拓扑

公共服务平台采用多环境、多区域的部署架构：

![部署架构图](https://mermaid.ink/img/pako:eNqFksFuwjAMhl_F8mlI0HVsQnBAQuJFkLixq-UmLo3aJlWcCqF23x07g3JAnOL8_v7Yji8oTUVYYAZ71U5XUZVIqEqHakvVwXH9XdyE7t0M79bgVrA2TVPUXxMYRHiDdmjQTVlRtXLmK01SrSElRW4Wm3LnCB-Ue4-2Oa90ZU5xjzk-oxc5xww1UeE1RgcUO1jR6pIruwxoXU1I1q3u0bVLIFYmCUZHH7QqEfTgEfwHTEzrJgCLieDWMXvw0ub-edhE9FRp-gRrSUJFy0hT9q-NUK3JBQgZlQMc3_xsAGTa-LzBXB-1EzBsUY5yjhE8m67rm9uEZJmAs3pSAqJoIZP9OSKpHnI70kGQP7iXvCsxzdaZ_FHOhh_0D9CzXVM?type=png)

**环境配置**：
- **生产环境**：高可用多集群架构，双活数据中心
- **测试环境**：功能完整，性能配置低于生产环境
- **开发环境**：功能完整，但简化部署规模
- **灾备环境**：冷备份模式，定期数据同步

**资源需求**：

| 资源类型 | 生产环境 | 测试环境 | 开发环境 |
|---------|---------|---------|---------|
| 应用服务器 | 8核32GB×4 | 8核16GB×2 | 4核8GB×1 |
| 数据库服务器 | 16核64GB×2 | 8核32GB×1 | 4核16GB×1 |
| 缓存服务器 | 8核16GB×3 | 4核8GB×1 | 共享应用服务器 |
| 文件存储 | 2TB SSD + 10TB存档 | 1TB SSD | 500GB SSD |
| 负载均衡器 | 双机热备 | 单机 | 无 |

#### 10.4.2 容灾与高可用设计

系统采用多层次高可用策略：

1. **应用层高可用**：
   - 无状态服务多实例部署
   - 健康检查与自动恢复
   - 蓝绿部署与灰度发布支持

2. **数据层高可用**：
   - 数据库主从架构，自动故障转移
   - 读写分离，减轻主库压力
   - 定期数据备份与恢复演练

3. **网络层高可用**：
   - 多运营商网络接入
   - 负载均衡器双机热备
   - 链路状态监控与自动切换

4. **容灾策略**：
   - 两地三中心部署（主中心+同城灾备+异地灾备）
   - RPO（恢复点目标）：核心数据15分钟，非核心数据4小时
   - RTO（恢复时间目标）：主要功能2小时，全部功能8小时

#### 10.4.3 扩展性设计

系统设计支持水平和垂直扩展：

1. **应用层扩展**：
   - 无状态设计支持水平扩展
   - 服务注册发现自动纳管新节点
   - 自动扩缩容策略基于负载指标

2. **数据层扩展**：
   - 分库分表设计，支持数据水平扩展
   - 读库自动扩展策略
   - 冷热数据分离存储

3. **存储层扩展**：
   - 文件存储采用可扩展的对象存储服务
   - 缓存集群支持节点动态添加

4. **容量规划**：
   - 系统设计支持未来3年内5倍用户增长
   - 季度审视容量使用情况，提前规划扩容
   - 预留30%容量作为突发流量缓冲

## 11. 服务水平目标（SLA）

### 11.1 系统可用性目标

公共服务平台设定以下可用性目标：

| 服务类型 | 可用性目标 | 最长允许单次中断 | 维护窗口 |
|---------|-----------|----------------|---------|
| 核心业务服务 | 99.9% (每月最大不可用43分钟) | 15分钟 | 每月第二个周日凌晨2:00-4:00 |
| 非核心业务服务 | 99.5% (每月最大不可用3.6小时) | 30分钟 | 每月第二个周日凌晨1:00-5:00 |
| 报表与统计服务 | 99.0% (每月最大不可用7.2小时) | 2小时 | 每月第二个周日凌晨0:00-6:00 |

核心业务服务定义：用户认证、账单支付、门禁服务、会议室预订等直接影响用户日常使用的功能。

### 11.2 性能指标目标

系统各功能模块的性能目标：

| 业务场景 | 响应时间目标(90%请求) | 响应时间目标(99%请求) | 并发能力 |
|---------|---------------------|---------------------|---------|
| 页面加载 | ≤2秒 | ≤3秒 | 500用户/秒 |
| 数据查询 | ≤1秒 | ≤2秒 | 300查询/秒 |
| 表单提交 | ≤3秒 | ≤5秒 | 100提交/秒 |
| 文件上传 | ≤5秒(1MB文件) | ≤8秒(1MB文件) | 50上传/秒 |
| 支付处理 | ≤3秒 | ≤5秒 | 100支付/秒 |

特殊场景性能目标：
- 月末账单集中支付期：系统支持峰值并发提升200%，响应时间增加不超过50%
- 工作日早9点和午1点会议室预订高峰：支持并发预订量提升300%

### 11.3 服务响应指标

用户服务请求的响应目标：

| 服务请求类型 | 首次响应时间 | 解决时间 | 服务时间 |
|------------|------------|---------|---------|
| 系统故障 | 15分钟内 | 4小时内 | 7×24小时 |
| 功能故障 | 30分钟内 | 8小时内 | 5×8小时(工作日) |
| 使用咨询 | 2小时内 | 24小时内 | 5×8小时(工作日) |
| 功能建议 | 24小时内 | - | 5×8小时(工作日) |

### 11.4 监控与报告

服务水平监控与报告机制：

1. **实时监控**：
   - 系统健康状态实时监控仪表盘
   - 关键业务流程的端到端成功率监控
   - 重要接口响应时间与错误率监控

2. **定期报告**：
   - 每日系统运行状态简报（自动生成）
   - 每周性能与可用性总结报告
   - 每月SLA达成情况分析报告

3. **告警机制**：
   - 多级别告警策略：通知、警告、严重、紧急
   - 多渠道告警通知：系统内告警、短信、邮件、电话
   - 告警升级机制：未及时处理的告警自动升级

4. **持续改进**：
   - 定期对SLA达成情况进行评审
   - 基于用户反馈和系统监控数据持续优化服务水平目标
   - 每季度更新优化计划并执行   

## 12. 性能优化策略

### 12.1 高并发场景优化

针对系统高并发场景，实施以下优化策略：

#### 12.1.1 月底账单集中支付

账单月末支付高峰应对策略：
- **请求削峰**：账单生成后梯度推送通知，避免集中访问
- **资源弹性**：账单支付服务自动扩容机制，基于请求量动态调整节点数
- **队列缓冲**：支付请求异步处理，通过队列削峰填谷
- **分布式锁**：避免同一账单重复支付，保护后端系统
- **热点缓存**：企业账单数据和支付状态热点缓存，减轻数据库压力
- **限流保护**：基于企业ID的请求限流，确保公平访问

#### 12.1.2 会议室集中预订

工作日早晨会议室预订高峰应对策略：
- **预加载优化**：提前预加载常用时段会议室数据
- **分时段请求**：前端错峰请求会议室数据
- **实时库存**：会议室状态实时同步，避免超卖
- **快速锁定**：临时锁定机制，预留5分钟完成支付
- **轻量级验证**：前端先验证可用性，减少无效请求

#### 12.1.3 批量消息推送

系统批量消息推送策略：
- **分批次发送**：大批量消息按批次梯度发送
- **推送优先级**：根据消息重要性设置发送优先级
- **异步处理**：消息生成与发送解耦，通过队列异步处理
- **状态跟踪**：记录每条消息的发送状态，支持失败重试
- **负载监控**：实时监控推送系统负载，超过阈值自动降级

### 12.2 关键API优化

针对系统核心API实施专项优化：

#### 12.2.1 查询类API优化

高频查询API优化策略：
- **多级缓存**：热点数据多级缓存（应用缓存+分布式缓存）
- **结果缓存**：对查询结果进行缓存，相同条件直接返回缓存
- **延迟加载**：非关键数据延迟加载，提升首屏响应速度
- **字段筛选**：按需返回字段，减少数据传输量
- **索引优化**：基于查询模式优化数据库索引

#### 12.2.2 事务类API优化

涉及数据修改的API优化策略：
- **乐观锁控制**：使用版本号实现乐观并发控制
- **写入缓冲**：高频写入请求合并处理
- **异步确认**：非关键修改异步处理，快速响应用户
- **批量操作**：支持批量提交，减少网络往返
- **预校验**：前端和API网关层进行数据预校验，减少无效请求

### 12.3 移动端专项优化

针对移动端用户体验的专项优化策略：

#### 12.3.1 网络优化

移动端网络传输优化：
- **API裁剪**：移动端API返回更精简的数据结构
- **增量同步**：只传输变化的数据，减少流量消耗
- **请求合并**：多个关联请求合并为一个请求
- **图片优化**：根据设备类型和网络条件动态调整图片质量
- **请求优先级**：实现请求优先级队列，保证关键请求优先处理

#### 12.3.2 离线能力增强

增强移动端离线工作能力：
- **核心数据预缓存**：用户常用数据智能预缓存
- **渐进式表单**：支持分步保存表单，断网不丢失
- **后台同步**：网络恢复后自动同步本地变更
- **冲突解决**：智能处理离线期间产生的数据冲突
- **离线功能降级**：网络不可用时，提供有限但核心的功能

### 12.4 定期性能评估

建立系统性能定期评估机制：

1. **性能基准测试**：
   - 每月进行一次完整的基准测试
   - 记录关键指标并与历史数据对比
   - 发现性能退化及时分析原因

2. **负载测试**：
   - 每季度进行一次全面负载测试
   - 模拟峰值负载条件，验证系统稳定性
   - 确定系统瓶颈并制定优化计划

3. **用户体验监测**：
   - 收集真实用户体验数据(RUM)
   - 分析用户操作路径和响应时间
   - 基于用户行为模式持续优化

## 13. 总结与演进

### 13.1 平台价值总结

公共服务平台作为企业与园区管理方的交互界面，提供以下价值：
- 便捷办事：企业一站式完成各类园区服务申请
- 账单管理：透明的账单查询与支付体验
- 即时响应：快速响应企业的维修、事件等需求
- 信息获取：及时获取园区通知、政策与活动信息

### 13.2 技术演进方向

平台未来的技术演进路线：
- 智能推荐：基于企业画像的个性化服务推荐
- 全渠道集成：拓展更多服务渠道(H5、APP等)
- 数据分析：企业行为分析与服务优化
- 自助服务：更多企业自助服务能力
- 生态开放：向第三方服务商开放平台能力

### 13.3 潜在风险与应对

潜在风险与应对策略：
- 用户体验不佳：持续用户反馈收集与优化迭代
- 数据一致性问题：强化数据同步机制与监控
- 访问高峰压力：高峰期流量预测与弹性扩容
- 支付安全风险：定期安全审计与防护升级

本设计文档将随平台发展持续更新，确保技术实现与业务需求的一致性。
