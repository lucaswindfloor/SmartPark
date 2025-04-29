# 智慧园区后端项目架构
> 最后更新: 2023-10-20

## 项目架构

本项目采用基于Spring Boot的多平台后端架构，主要特点：

### 多平台架构
- 综合管理平台：`platform/comprehensive`
- 公共服务平台：`platform/public`
- 系统管理员平台：`platform/admin`

### 核心技术栈
- Spring Boot 2.7.x
- Spring Security + JWT
- MyBatis Plus
- MySQL/PostgreSQL
- Redis
- Flowable/Camunda工作流引擎
- RocketMQ消息队列
- Elasticsearch搜索引擎
- 基于DDD的分层架构

### 目录结构
```
SmartCampus/src/main/java/com/smartcampus/
├── SmartCampusApplication.java # 应用入口
│
├── config/ # 全局配置 (第一层级)
│   ├── SecurityConfig.java # 安全配置 ⏳
│   ├── WebConfig.java # Web配置 ⏳
│   ├── MyBatisConfig.java # MyBatis配置 ⏳
│   ├── WorkflowConfig.java # 工作流配置 ⏳
│   ├── ElasticsearchConfig.java # 搜索引擎配置 ⏳
│   └── MessageQueueConfig.java # 消息队列配置 ⏳
│
├── core/ # 核心模块 (第一层级)
│   ├── security/ # 安全框架 ⏳
│   ├── utils/ # 工具类 ⏳
│   ├── exception/ # 异常处理 ⏳
│   ├── tenant/ # 多租户支持 ⏳
│   ├── search/ # 搜索框架 ⏳
│   │   ├── SearchService.java # 搜索服务接口
│   │   └── SearchQuery.java # 搜索查询对象
│   ├── workflow/ # 工作流引擎 (核心依赖) ⏳
│   ├── form/ # 动态表单引擎 (核心依赖) ⏳
│   └── event/ # 事件框架 (核心依赖) ⏳
│       ├── EventPublisher.java # 事件发布器
│       ├── MessageQueuePublisher.java # 消息队列发布器
│       └── EventListener.java # 事件监听器
│
├── interfaces/ # 接口定义层 (第一层级)
│   ├── api/ # 对外暴露的API接口定义 ⏳
│   └── event/ # 领域事件定义 ⏳
│       ├── announcement/ # 通知公告事件
│       │   ├── AnnouncementCreatedEvent.java # 通知创建事件 ⏳
│       │   ├── AnnouncementAuditedEvent.java # 通知审核事件 ⏳
│       │   ├── AnnouncementPublishedEvent.java # 通知发布事件 ⏳
│       │   ├── AnnouncementExpiredEvent.java # 通知过期事件 ⏳
│       │   ├── AnnouncementArchivedEvent.java # 通知归档事件 ⏳
│       │   └── AnnouncementConfirmedEvent.java # 通知确认事件 ⏳
│       ├── policy/ # 政策文件事件 ⏳
│       └── activity/ # 园区活动事件 ⏳
│
├── platform/ # 平台层 (应用层入口) (第一层级)
│   ├── comprehensive/ # 综合管理平台
│   │   ├── dashboard/ # 工作门户模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   ├── recruitmentmanagement/ # 招商管理模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   ├── operationmanagement/ # 运营管理模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   ├── financemanagement/ # 财务管理模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   ├── servicemanagement/ # 服务管理模块
│   │   │   ├── controller/ # 控制器层
│   │   │   │   ├── serviceitems/ # 服务事项控制器 ⏳
│   │   │   │   │   ├── ServiceItemController.java
│   │   │   │   │   ├── ServiceProcessController.java
│   │   │   │   │   └── ServiceEvaluationController.java
│   │   │   │   ├── servicesettings/ # 服务设置控制器 ⏳
│   │   │   │   │   └── ServiceSettingsController.java
│   │   │   │   ├── basicconfig/ # 基础配置控制器 ⏳
│   │   │   │   │   ├── DictionaryController.java
│   │   │   │   │   └── ParameterController.java
│   │   │   │   ├── evaluationmanagement/ # 评价管理控制器 ⏳
│   │   │   │   │   └── EvaluationController.java
│   │   │   │   ├── serviceguidelines/ # 服务指南控制器 ⏳
│   │   │   │   │   └── ServiceGuidelineController.java
│   │   │   │   └── informationdisclosure/ # 信息公开控制器
│   │   │   │       ├── announcement/ # 通知公告控制器 ✅
│   │   │   │       └── policy/ # 政策文件控制器 ⏳
│   │   │   ├── application/ # 应用服务层
│   │   │   │   ├── serviceitems/ # 服务事项服务 ⏳
│   │   │   │   │   ├── ServiceItemApplicationService.java
│   │   │   │   │   ├── ServiceProcessApplicationService.java
│   │   │   │   │   └── ServiceEvaluationApplicationService.java
│   │   │   │   ├── servicesettings/ # 服务设置服务 ⏳
│   │   │   │   │   └── ServiceSettingsApplicationService.java
│   │   │   │   ├── basicconfig/ # 基础配置服务 ⏳
│   │   │   │   │   ├── DictionaryApplicationService.java
│   │   │   │   │   └── ParameterApplicationService.java
│   │   │   │   ├── evaluationmanagement/ # 评价管理服务 ⏳
│   │   │   │   │   └── EvaluationApplicationService.java
│   │   │   │   ├── serviceguidelines/ # 服务指南服务 ⏳
│   │   │   │   │   └── ServiceGuidelineApplicationService.java
│   │   │   │   └── informationdisclosure/ # 信息公开服务
│   │   │   │       ├── announcement/ # 通知公告服务 ✅
│   │   │   │       └── policy/ # 政策文件服务 ⏳
│   │   │   └── dto/ # 数据传输对象
│   │   │       ├── serviceitems/ # 服务事项DTO ⏳
│   │   │       ├── servicesettings/ # 服务设置DTO ⏳
│   │   │       ├── basicconfig/ # 基础配置DTO ⏳
│   │   │       ├── evaluationmanagement/ # 评价管理DTO ⏳
│   │   │       ├── serviceguidelines/ # 服务指南DTO ⏳
│   │   │       └── informationdisclosure/ # 信息公开DTO
│   │   │           ├── announcement/ # 通知公告DTO ✅
│   │   │           │   ├── AnnouncementDTO.java
│   │   │           │   └── request/
│   │   │           │       └── AnnouncementRequest.java
│   │   │           └── policy/ # 政策文件DTO ⏳
│   │   │
│   │   ├── meetingmanagement/ # 会议管理模块
│   │   │   ├── controller/ # 控制器 ✅
│   │   │   │   ├── MeetingRoomController.java
│   │   │   │   └── MeetingBookingController.java
│   │   │   ├── application/ # 应用服务 ✅
│   │   │   └── dto/ # 数据传输对象 ✅
│   │   │
│   │   ├── assetmanagement/ # 资产管理模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   ├── energymanagement/ # 能源管理模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   └── statistics/ # 综合统计模块
│   │       ├── controller/ # 控制器 ⏳
│   │       ├── application/ # 应用服务 ⏳
│   │       └── dto/ # 数据传输对象 ⏳
│   │
│   ├── public/ # 公共服务平台
│   │   ├── informationdisclosure/ # 信息公开模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   │   ├── announcement/ # 通知公告控制器
│   │   │   │   │   ├── AnnouncementViewController.java
│   │   │   │   │   ├── AnnouncementSubscriptionController.java
│   │   │   │   │   └── MobileAnnouncementController.java
│   │   │   │   ├── policy/ # 政策文件控制器
│   │   │   │   └── activity/ # 园区活动控制器
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   │   ├── announcement/ # 通知公告服务
│   │   │   │   │   ├── AnnouncementViewApplicationService.java
│   │   │   │   │   ├── SubscriptionApplicationService.java
│   │   │   │   │   └── MobileAnnouncementApplicationService.java
│   │   │   │   ├── policy/ # 政策文件服务
│   │   │   │   └── activity/ # 园区活动服务
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   ├── servicehall/ # 服务大厅模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   ├── usercenter/ # 用户中心模块
│   │   │   ├── controller/ # 控制器 ⏳
│   │   │   │   ├── MessageController.java
│   │   │   │   ├── SystemMessageController.java
│   │   │   │   ├── UserMessageController.java
│   │   │   │   └── ProfileController.java
│   │   │   ├── application/ # 应用服务 ⏳
│   │   │   │   ├── MessageApplicationService.java
│   │   │   │   ├── SystemMessageApplicationService.java
│   │   │   │   ├── UserMessageApplicationService.java
│   │   │   │   └── ProfileApplicationService.java
│   │   │   └── dto/ # 数据传输对象 ⏳
│   │   │
│   │   └── enterprisemanagement/ # 企业管理模块
│   │       ├── controller/ # 控制器 ⏳
│   │       ├── application/ # 应用服务 ⏳
│   │       └── dto/ # 数据传输对象 ⏳
│   │
│   └── admin/ # 系统管理员平台
│       ├── configurationmanagement/ # 系统配置管理模块
│       │   ├── controller/ # 控制器 ⏳
│       │   ├── application/ # 应用服务 ⏳
│       │   └── dto/ # 数据传输对象 ⏳
│       │
│       ├── authorizationmanagement/ # 权限与角色管理模块
│       │   ├── controller/ # 控制器 ⏳
│       │   ├── application/ # 应用服务 ⏳
│       │   └── dto/ # 数据传输对象 ⏳
│       │
│       ├── workflowmanagement/ # 流程引擎管理模块
│       │   ├── controller/ # 控制器 ⏳
│       │   ├── application/ # 应用服务 ⏳
│       │   └── dto/ # 数据传输对象 ⏳
│       │
│       ├── monitoringmanagement/ # 系统监控中心模块
│       │   ├── controller/ # 控制器 ⏳
│       │   ├── application/ # 应用服务 ⏳
│       │   └── dto/ # 数据传输对象 ⏳
│       │
│       └── integrationmanagement/ # 系统集成管理模块
│           ├── controller/ # 控制器 ⏳
│           ├── application/ # 应用服务 ⏳
│           └── dto/ # 数据传输对象 ⏳
│
├── domain/ # 领域层 (第一层级)
│   ├── user/ # 用户领域
│   │   ├── entity/ # 实体 ⏳
│   │   ├── repository/ # 仓储接口 ⏳
│   │   └── domainservice/ # 领域服务 ⏳
│   │
│   ├── servicemanagement/ # 服务管理领域
│   │   ├── serviceitems/ # 服务事项子领域
│   │   │   ├── entity/ # 实体 ⏳
│   │   │   │   ├── ServiceItem.java
│   │   │   │   ├── ServiceProcess.java
│   │   │   │   ├── ServiceForm.java
│   │   │   │   └── ServiceEvaluation.java
│   │   │   ├── repository/ # 仓储接口 ⏳
│   │   │   │   ├── ServiceItemRepository.java
│   │   │   │   ├── ServiceProcessRepository.java
│   │   │   │   ├── ServiceFormRepository.java
│   │   │   │   └── ServiceEvaluationRepository.java
│   │   │   └── domainservice/ # 领域服务 ⏳
│   │   │       ├── ServiceItemDomainService.java
│   │   │       ├── ServiceProcessDomainService.java
│   │   │       └── ServiceEvaluationDomainService.java
│   │   │
│   │   ├── servicesettings/ # 服务设置子领域
│   │   │   ├── entity/ # 实体 ⏳
│   │   │   │   └── ServiceSettings.java
│   │   │   ├── repository/ # 仓储接口 ⏳
│   │   │   │   └── ServiceSettingsRepository.java
│   │   │   └── domainservice/ # 领域服务 ⏳
│   │   │       └── ServiceSettingsDomainService.java
│   │   │
│   │   ├── basicconfig/ # 基础配置子领域
│   │   │   ├── entity/ # 实体 ⏳
│   │   │   │   ├── Dictionary.java
│   │   │   │   └── Parameter.java
│   │   │   ├── repository/ # 仓储接口 ⏳
│   │   │   │   ├── DictionaryRepository.java
│   │   │   │   └── ParameterRepository.java
│   │   │   └── domainservice/ # 领域服务 ⏳
│   │   │       ├── DictionaryDomainService.java
│   │   │       └── ParameterDomainService.java
│   │   │
│   │   ├── evaluationmanagement/ # 评价管理子领域
│   │   │   ├── entity/ # 实体 ⏳
│   │   │   │   └── Evaluation.java
│   │   │   ├── repository/ # 仓储接口 ⏳
│   │   │   │   └── EvaluationRepository.java
│   │   │   └── domainservice/ # 领域服务 ⏳
│   │   │       └── EvaluationDomainService.java
│   │   │
│   │   ├── serviceguidelines/ # 服务指南子领域
│   │   │   ├── entity/ # 实体 ⏳
│   │   │   │   └── ServiceGuide.java
│   │   │   ├── repository/ # 仓储接口 ⏳
│   │   │   │   └── ServiceGuideRepository.java
│   │   │   └── domainservice/ # 领域服务 ⏳
│   │   │       └── ServiceGuideDomainService.java
│   │   │
│   │   └── informationdisclosure/ # 信息公开子领域
│   │       ├── entity/ # 领域实体
│   │       │   ├── announcement/ # 通知公告实体
│   │       │   │   ├── Announcement.java # ✅
│   │       │   │   ├── AnnouncementAudit.java # ⏳
│   │       │   │   ├── AnnouncementRead.java # ⏳
│   │       │   │   ├── AnnouncementConfirmation.java # ⏳
│   │       │   │   ├── AnnouncementRecycleBin.java # ⏳
│   │       │   │   └── AnnouncementPermission.java # ⏳
│   │       │   ├── policy/ # 政策文件实体
│   │       │   │   └── Policy.java # ⏳
│   │       │   └── activity/ # 园区活动实体
│   │       │       └── Activity.java # ⏳
│   │       ├── repository/ # 仓储接口
│   │       │   ├── announcement/ # 通知公告仓储
│   │       │   │   ├── AnnouncementRepository.java # ✅
│   │       │   │   ├── AnnouncementAuditRepository.java # ⏳
│   │       │   │   ├── AnnouncementReadRepository.java # ⏳
│   │       │   │   ├── AnnouncementConfirmationRepository.java # ⏳
│   │       │   │   ├── AnnouncementRecycleBinRepository.java # ⏳
│   │       │   │   └── AnnouncementPermissionRepository.java # ⏳
│   │       │   ├── policy/ # 政策文件仓储
│   │       │   │   └── PolicyRepository.java # ⏳
│   │       │   └── activity/ # 园区活动仓储
│   │       │       └── ActivityRepository.java # ⏳
│   │       └── domainservice/ # 领域服务
│   │           ├── announcement/ # 通知公告领域服务
│   │           │   ├── AnnouncementDomainService.java # ✅
│   │           │   ├── AnnouncementStateMachine.java # ⏳
│   │           │   ├── AnnouncementStatsDomainService.java # ⏳
│   │           │   ├── AnnouncementSearchDomainService.java # ⏳
│   │           │   ├── AnnouncementPermissionDomainService.java # ⏳
│   │           │   ├── AnnouncementConfirmationDomainService.java # ⏳
│   │           │   └── AnnouncementRecycleBinDomainService.java # ⏳
│   │           ├── policy/ # 政策文件领域服务
│   │           └── activity/ # 园区活动领域服务
│   │
│   ├── meetingmanagement/ # 会议管理领域
│   │   ├── entity/ # 实体 ✅
│   │   │   ├── MeetingRoom.java
│   │   │   ├── MeetingBooking.java
│   │   │   ├── MeetingOpenTime.java
│   │   │   └── MeetingChargeRule.java
│   │   ├── repository/ # 仓储接口 ✅
│   │   │   ├── MeetingRoomRepository.java
│   │   │   ├── MeetingBookingRepository.java
│   │   │   ├── MeetingOpenTimeRepository.java
│   │   │   └── MeetingChargeRuleRepository.java
│   │   └── domainservice/ # 领域服务 ✅
│   │       ├── MeetingRoomDomainService.java
│   │       ├── MeetingBookingDomainService.java
│   │       └── MeetingAvailabilityDomainService.java
│   │
│   ├── messagemanagement/ # 通知/消息领域
│   │   ├── entity/ # 实体 ✅
│   │   │   ├── Message.java
│   │   │   ├── SystemMessage.java
│   │   │   └── UserMessage.java
│   │   ├── repository/ # 仓储接口 ✅
│   │   │   ├── MessageRepository.java
│   │   │   ├── SystemMessageRepository.java
│   │   │   └── UserMessageRepository.java
│   │   └── domainservice/ # 领域服务 ✅
│   │       ├── MessageDomainService.java
│   │       ├── SystemMessageDomainService.java
│   │       └── UserMessageDomainService.java
│   │
│   ├── resourcemanagement/ # 资源管理领域
│   │   ├── entity/ # 实体 ⏳
│   │   │   ├── Resource.java
│   │   │   ├── AirConditioner.java
│   │   │   ├── AccessControl.java
│   │   │   └── ParkingLot.java
│   │   ├── booking/ # 资源预订子领域
│   │   │   ├── entity/ # 预订实体 ⏳
│   │   │   │   ├── ResourceBooking.java
│   │   │   │   ├── MeetingBooking.java
│   │   │   │   └── AcExtensionBooking.java
│   │   │   ├── repository/ # 预订仓储 ⏳
│   │   │   │   ├── BookingRepository.java
│   │   │   │   └── MeetingBookingRepository.java
│   │   │   └── domainservice/ # 预订服务 ⏳
│   │   │       ├── BookingDomainService.java
│   │   │       └── BookingConflictDomainService.java
│   │   ├── repository/ # 资源仓储 ⏳
│   │   │   ├── ResourceRepository.java
│   │   │   ├── AirConditionerRepository.java
│   │   │   ├── AccessControlRepository.java
│   │   │   └── ParkingLotRepository.java
│   │   └── domainservice/ # 资源服务 ⏳
│   │       ├── ResourceDomainService.java
│   │       └── ResourceAvailabilityDomainService.java
│   │
│   ├── subscriptionmanagement/ # 订阅管理领域
│   │   ├── entity/ # 实体 ⏳
│   │   │   ├── announcement/ # 通知公告订阅实体
│   │   │   │   └── AnnouncementSubscription.java
│   │   │   └── message/ # 消息订阅实体
│   │   │       ├── SystemMessageSubscription.java
│   │   │       └── UserMessageSubscription.java
│   │   ├── repository/ # 仓储接口 ⏳
│   │   │   ├── announcement/ # 通知订阅仓储
│   │   │   │   └── AnnouncementSubscriptionRepository.java
│   │   │   └── message/ # 消息订阅仓储
│   │   │       ├── SystemMessageSubscriptionRepository.java
│   │   │       └── UserMessageSubscriptionRepository.java
│   │   └── domainservice/ # 领域服务 ⏳
│   │       ├── announcement/ # 通知订阅服务
│   │       │   └── AnnouncementSubscriptionDomainService.java
│   │       └── message/ # 消息订阅服务
│   │           ├── SystemMessageSubscriptionDomainService.java
│   │           └── UserMessageSubscriptionDomainService.java
│   │
│   └── common/ # 公共领域对象
│       └── entity/ # 公共实体
│           ├── BaseEntity.java # ✅
│           └── Attachment.java # ⏳
│
├── infrastructure/ # 基础设施层 (第一层级)
│   ├── persistence/ # 持久化实现
│   │   ├── mysql/ # MySQL 实现
│   │   │   ├── mapper/ # MyBatis映射接口 (按领域组织)
│   │   │   │   ├── servicemanagement/ # 服务管理映射
│   │   │   │   │   ├── serviceitems/ # ⏳
│   │   │   │   │   ├── servicesettings/ # ⏳
│   │   │   │   │   ├── basicconfig/ # ⏳
│   │   │   │   │   ├── evaluationmanagement/ # ⏳
│   │   │   │   │   ├── serviceguidelines/ # ⏳
│   │   │   │   │   └── informationdisclosure/ # ✅
│   │   │   │   │       ├── announcement/
│   │   │   │   │       │   ├── AnnouncementMapper.java
│   │   │   │   │       │   ├── AnnouncementAuditMapper.java
│   │   │   │   │       │   └── AnnouncementReadMapper.java
│   │   │   │   │       └── policy/
│   │   │   │   │           └── PolicyMapper.java
│   │   │   │   ├── meetingmanagement/ # ✅
│   │   │   │   │   ├── MeetingRoomMapper.java
│   │   │   │   │   └── MeetingBookingMapper.java
│   │   │   │   ├── notificationmanagement/ # ✅
│   │   │   │   │   ├── MessageMapper.java
│   │   │   │   │   ├── SystemMessageMapper.java
│   │   │   │   │   └── UserMessageMapper.java
│   │   │   │   ├── resourcemanagement/ # ⏳
│   │   │   │   └── subscriptionmanagement/ # ⏳
│   │   │   └── repository/ # 仓储实现 (按领域组织)
│   │   │       ├── servicemanagement/ # 服务管理仓储实现
│   │   │       │   ├── serviceitems/ # ⏳
│   │   │       │   ├── servicesettings/ # ⏳
│   │   │       │   ├── basicconfig/ # ⏳
│   │   │       │   ├── evaluationmanagement/ # ⏳
│   │   │       │   ├── serviceguidelines/ # ⏳
│   │   │       │   └── informationdisclosure/ # ✅
│   │   │       │       ├── announcement/
│   │   │       │       │   ├── AnnouncementRepositoryImpl.java
│   │   │       │       │   ├── AnnouncementAuditRepositoryImpl.java
│   │   │       │       │   └── AnnouncementReadRepositoryImpl.java
│   │   │       │       └── policy/
│   │   │       │           └── PolicyRepositoryImpl.java
│   │   │       ├── meetingmanagement/ # ✅
│   │   │       ├── notificationmanagement/ # ✅
│   │   │       ├── resourcemanagement/ # ⏳
│   │   │       └── subscriptionmanagement/ # ⏳
│   │   └── redis/ # Redis 实现
│   │       ├── cache/ # Redis缓存实现
│   │       └── lock/ # Redis分布式锁实现
│   │
│   ├── file/ # 文件存储
│   │   ├── service/ # 服务定义 ⏳
│   │   │   ├── FileService.java
│   │   │   └── AttachmentService.java
│   │   └── impl/ # 服务实现 ⏳
│   │       ├── FileServiceImpl.java
│   │       └── AttachmentServiceImpl.java
│   │
│   ├── message/ # 消息队列
│   │   ├── producer/ # 消息生产者 ⏳
│   │   │   └── RocketMQProducer.java
│   │   └── consumer/ # 消息消费者 ⏳
│   │       └── RocketMQConsumer.java
│   │
│   ├── search/ # 搜索实现
│   │   ├── repository/ # 搜索仓储 ⏳
│   │   │   └── ElasticsearchRepository.java
│   │   └── service/ # 搜索服务 ⏳
│   │       └── ElasticsearchService.java
│   │
│   ├── cache/ # 缓存服务
│   │   ├── service/ # 服务定义 ⏳
│   │   └── impl/ # 服务实现 ⏳
│   │
│   ├── lock/ # 分布式锁服务
│   │   ├── service/ # 服务定义 ⏳
│   │   │   └── DistributedLockService.java
│   │   └── impl/ # 服务实现 ⏳
│   │       └── RedisLockServiceImpl.java
│   │
│   ├── workflow/ # 工作流引擎实现
│   │   ├── service/ # 服务定义 ⏳
│   │   │   ├── WorkflowService.java
│   │   │   ├── WorkflowFormService.java
│   │   │   └── WorkflowTaskAssignService.java
│   │   ├── definition/ # 工作流定义 ⏳
│   │   │   ├── ProcessDefinitionService.java
│   │   │   └── FormDefinitionService.java
│   │   ├── rule/ # 业务规则 ⏳
│   │   │   ├── ServicePriorityRule.java
│   │   │   ├── ServiceAssignmentRule.java
│   │   │   └── RuleEngineService.java
│   │   ├── execution/ # 工作流执行 ⏳
│   │   │   ├── ProcessExecutionService.java
│   │   │   └── TaskService.java
│   │   ├── monitor/ # 工作流监控 ⏳
│   │   │   └── ProcessMonitorService.java
│   │   └── impl/ # 服务实现 ⏳
│   │       └── WorkflowServiceImpl.java
│   │
│   ├── security/ # 安全实现
│   │   ├── service/ # 服务定义 ⏳
│   │   └── impl/ # 服务实现 ⏳
│   │
│   ├── content/ # 内容处理
│   │   ├── service/ # 服务定义 ⏳
│   │   │   ├── ContentSecurityService.java
│   │   │   └── SensitiveWordFilter.java
│   │   └── impl/ # 服务实现 ⏳
│   │       ├── ContentSecurityServiceImpl.java
│   │       └── SensitiveWordFilterImpl.java
│   │
│   ├── mobile/ # 移动端支持
│   │   ├── service/ # 服务定义 ⏳
│   │   │   ├── message/ # 消息推送服务
│   │   │   │   └── PushSystemMessageService.java
│   │   │   └── common/
│   │   │       └── MobileAdaptationService.java
│   │   └── impl/ # 服务实现 ⏳
│   │
│   ├── event/ # 事件机制实现
│   │   ├── publisher/ # 事件发布 ⏳
│   │   │   └── EventPublisherImpl.java
│   │   └── listener/ # 事件监听 ⏳
│   │       └── AnnouncementEventListener.java
│   │
│   ├── metrics/ # 业务监控与度量
│   │   ├── service/ # 度量服务 ⏳
│   │   │   └── MetricsService.java
│   │   └── collector/ # 度量收集器 ⏳
│   │       └── AnnouncementMetricsCollector.java
│   │
│   └── integration/ # 外部系统集成
│       ├── payment/ # 支付集成 ⏳
│       │   └── PaymentGatewayService.java
│       ├── sms/ # 短信集成 ⏳
│       │   └── SmsService.java
│       └── weather/ # 天气服务集成 ⏳
│           └── WeatherService.java
│
└── common/ # 通用模块 (第一层级)
    ├── enums/ # 枚举定义 (按领域/模块组织) ✅
    │   ├── servicemanagement/
    │   │   ├── ServiceItemStatusEnum.java
    │   │   ├── ServicePriorityEnum.java
    │   │   ├── ServiceTypeEnum.java
    │   │   └── informationdisclosure/
    │   │       ├── announcement/
    │   │       │   ├── AnnouncementStatusEnum.java
    │   │       │   ├── AuditStatusEnum.java
    │   │       │   └── AnnouncementTypeEnum.java
    │   │       └── policy/
    │   ├── meetingmanagement/
    │   ├── messagemanagement/
    │   └── resourcemanagement/
    │       ├── ResourceTypeEnum.java
    │       ├── BookingStatusEnum.java
    │       └── ResourceAvailabilityEnum.java
    ├── constant/ # 常量定义 ✅
    │   ├── SystemConstants.java
    │   └── SecurityConstants.java
    ├── response/ # 统一响应 ✅
    │   ├── Result.java
    │   └── PageResult.java
    └── utils/ # 通用工具类 ✅
        ├── DateUtils.java
        ├── StringUtils.java
        ├── FileUtils.java
        └── JsonUtils.java

SmartCampus/src/main/resources/
├── application.yml                       # 应用配置 ✅
├── application-dev.yml                   # 开发环境配置 ⏳
├── application-prod.yml                  # 生产环境配置 ⏳
├── mappers/                              # MyBatis XML映射
│   ├── servicemanagement/                # 服务管理XML映射
│   │   ├── serviceitems/                 # 服务事项XML映射 ⏳
│   │   │   ├── ServiceItemMapper.xml
│   │   │   ├── ServiceProcessMapper.xml
│   │   │   └── ServiceEvaluationMapper.xml
│   │   ├── servicesettings/              # 服务设置XML映射 ⏳
│   │   │   └── ServiceSettingsMapper.xml
│   │   ├── basicconfig/                  # 基础配置XML映射 ⏳
│   │   │   ├── DictionaryMapper.xml
│   │   │   └── ParameterMapper.xml
│   │   ├── evaluationmanagement/         # 评价管理XML映射 ⏳
│   │   │   └── EvaluationMapper.xml
│   │   ├── serviceguidelines/            # 服务指南XML映射 ⏳
│   │   │   └── ServiceGuidelineMapper.xml
│   │   └── informationdisclosure/        # 信息公开XML映射
│   │       ├── announcement/             # 通知公告XML映射 ✅
│   │       │   ├── AnnouncementMapper.xml
│   │       │   ├── AnnouncementAuditMapper.xml
│   │       │   ├── AnnouncementReadMapper.xml
│   │       │   ├── AnnouncementConfirmationMapper.xml
│   │       │   ├── AnnouncementRecycleBinMapper.xml
│   │       │   └── AnnouncementPermissionMapper.xml
│   │       ├── policy/                   # 政策文件XML映射 ⏳
│   │       │   └── PolicyMapper.xml
│   │       └── activity/                 # 园区活动XML映射 ⏳
│   │           └── ActivityMapper.xml
│   ├── meetingmanagement/                # 会议管理XML映射 ✅
│   │   ├── MeetingRoomMapper.xml
│   │   ├── MeetingBookingMapper.xml
│   │   ├── MeetingOpenTimeMapper.xml
│   │   └── MeetingChargeRuleMapper.xml
│   ├── notificationmanagement/           # 通知管理XML映射 ✅
│   │   ├── MessageMapper.xml
│   │   ├── SystemMessageMapper.xml
│   │   └── UserMessageMapper.xml
│   ├── resourcemanagement/               # 资源管理XML映射 ⏳
│   │   ├── ResourceMapper.xml
│   │   └── booking/
│   │       ├── ResourceBookingMapper.xml
│   │       └── MeetingBookingMapper.xml
│   └── subscriptionmanagement/           # 订阅管理XML映射 ⏳
│       ├── announcement/
│       │   └── AnnouncementSubscriptionMapper.xml
│       └── message/
│           ├── SystemMessageSubscriptionMapper.xml
│           └── UserMessageSubscriptionMapper.xml
├── db/                                   # 数据库脚本
│   ├── schema.sql                        # 表结构定义 ⏳
│   └── data.sql                          # 初始数据 ⏳
├── workflow/                             # 工作流定义
│   ├── processes/                        # 流程定义 ⏳
│   └── forms/                            # 表单定义 ⏳
└── static/                               # 静态资源目录 ⏳
    ├── images/                           # 图片资源
    ├── templates/                        # 模板文件
    └── documents/                        # 文档文件

```

**标记说明:**
- ✅ 已实现
- 🚧 开发中
- ⏳ 计划中/未开始

## 架构说明

### 1. 核心模块 (core)
负责提供全局共享的基础功能，包括安全框架、工具类、异常处理和多租户支持等。新增搜索框架和事件机制，支持跨服务的统一搜索和发布/订阅模式。

### 2. 平台层 (platform)
按照三大平台划分，负责处理HTTP请求、参数验证和调用对应的服务：
- 综合管理平台：面向园区管理人员，包含服务管理、资产管理等核心功能
- 公共服务平台：面向园区用户和企业，增强了移动端适配
- 系统管理员平台：面向系统管理员，负责系统配置和权限管理

### 3. 领域层 (domain)
采用DDD设计思想，包含业务实体、领域服务和仓储接口，是系统的核心业务逻辑所在：
- 服务管理领域：处理服务事项、流程和评价
- 信息公开领域：处理通知公告、政策文件和活动
- 资源管理领域：处理会议室、空调等物理资源及其预订

### 4. 基础设施层 (infrastructure)
提供技术实现细节，包括数据库访问、外部系统集成和技术服务：
- 持久化实现：负责数据库访问和仓储实现
- 资源预订：实现预订冲突检测和资源锁定
- 工作流引擎：支持服务流程配置和执行
- 内容处理：提供内容安全和敏感词过滤
- 搜索和消息：提供高效检索和异步通知能力
- 移动支持：适配移动端和推送功能
- 外部集成：集成支付、短信等第三方服务

### 5. 通用模块 (common)
提供跨领域的公共组件，如DTO对象、响应格式、枚举和工具类，确保系统的一致性和可重用性。

## 信息公开模块说明

### 1. 通知公告流程
通知公告遵循"草稿-审核-发布-归档"的完整生命周期：
- 草稿创建与编辑：由内容编辑人员创建并编辑通知内容
- 内容安全检查：自动进行敏感词过滤和内容合规性检查
- 审核流程：提交后进入审核环节，支持多级审核配置
- 发布管理：审核通过后可按计划发布，支持定时发布
- 阅读跟踪：记录用户阅读状态，支持强制阅读确认
- 统计分析：分析通知阅读率、覆盖范围和有效性

### 2. 关键特性
- 状态转换机制：基于状态机实现严格的状态流转控制
- 事件驱动：通过领域事件实现松耦合的业务流程
- 内容安全：集成敏感词过滤和内容安全检查
- 附件管理：支持多种类型附件的上传、存储和访问控制
- 订阅机制：允许用户按类型订阅感兴趣的通知
- 效果分析：提供通知触达率、阅读率等统计分析
- 全文搜索：基于Elasticsearch的高效全文搜索
- 移动推送：支持移动设备的通知推送

## 服务管理模块说明

### 1. 服务事项流程
服务事项遵循"申请-受理-处理-评价"的完整生命周期：
- 服务申请：用户提交服务申请，系统验证合法性
- 服务受理：服务管理人员审核申请并分派处理
- 服务处理：处理人员执行服务并记录处理过程
- 结果通知：处理完成后通知申请人查看结果
- 服务评价：申请人对服务进行评价和反馈
- 数据分析：系统分析服务质量和处理效率

### 2. 关键特性
- 灵活流程：可动态配置不同服务类型的处理流程
- 自定义表单：支持各类服务的表单自定义
- 智能分派：根据服务类型、负载和技能自动分派
- 服务优先级：基于紧急程度、等待时间和企业级别计算优先级
- 超时预警：设置处理时限并自动预警即将超时的事项
- 评价分析：多维度评价和数据分析，持续改进服务质量
- 工作台集成：与工作门户集成，提供统一的服务入口

## 资源管理模块说明

### 1. 资源预订流程
资源预订遵循"查询-预订-确认-使用-评价"的流程：
- 资源查询：用户查询可用资源和时段
- 资源预订：提交预订请求，系统检查冲突
- 支付确认：收费资源需完成支付确认
- 使用提醒：到期前系统自动发送提醒
- 使用记录：记录资源实际使用情况
- 使用评价：用户可对资源和服务进行评价

### 2. 关键特性
- 资源可视化：直观展示资源使用状态和可用时段
- 冲突检测：预订时自动检测并防止冲突
- 资源锁定：预订过程中暂时锁定资源，防止并发问题
- 差异化定价：支持不同资源、时段和用户的差异化定价
- 批量操作：支持批量预订和管理资源
- 使用监控：实时监控资源使用状态，提供使用率分析

## 开发规范

### 命名规范
- 包名：小写，如 `com.smartcampus.platform.comprehensive`
- 类名：大驼峰，如 `NotificationController`
- 方法名：小驼峰，如 `findById`
- 变量名：小驼峰，如 `pageSize`
- 常量名：大写下划线，如 `MAX_PAGE_SIZE`

### 分层规范
- 控制器层：处理HTTP请求，参数校验，返回结果
- 服务层：处理业务逻辑，调用领域服务
- 领域层：核心业务逻辑和规则
- 数据访问层：数据持久化操作

### 异常处理规范
- 使用统一的异常处理机制
- 业务异常应继承自BusinessException
- 控制器层应捕获所有异常并转换为统一响应格式

### 事件处理规范
- 领域事件应表达业务含义，如NotificationPublishedEvent
- 事件处理应具有幂等性，支持重试机制
- 重要事件应持久化，确保可靠性

### 集成规范
- 外部系统集成应使用适配器模式，隔离外部依赖
- 接口应定义清晰的契约和超时策略
- 支持熔断降级机制，增强系统韧性

### 接口响应规范
- 所有接口返回统一的Result<T>格式
- 分页查询返回PageResult<T>格式
- 规范化状态码和错误消息

## 快速开始

### 初始化数据库
```sql
-- 执行schema.sql创建表结构
-- 执行data.sql初始化基础数据
```

### 启动应用
```bash
mvn spring-boot:run
```

### API文档
启动后访问: http://localhost:8080/swagger-ui.html

## 操作手册与FAQ

### 1. 开发环境搭建
- JDK 11+
- Maven 3.6+
- MySQL 8.0+ / PostgreSQL 13.0+
- Redis 6.0+
- IDE推荐：IntelliJ IDEA或Eclipse

### 2. 常见问题解答

**Q: 如何创建新的服务模块?**
A: 在domain层创建对应实体和仓储接口，在infrastructure层实现仓储，在platform层添加控制器和服务。

**Q: 如何配置新的服务工作流?**
A: 在workflow/definition目录下创建流程定义XML，通过ProcessDefinitionService注册。

**Q: 如何处理多租户数据隔离?**
A: 系统使用core/tenant提供的TenantContext和过滤器自动添加租户条件。

**Q: 如何扩展搜索功能?**
A: 在领域实体上添加@Searchable注解，实现SearchableEntity接口，系统会自动索引。

**Q: 如何处理大数据量的性能问题?**
A: 使用分页加载，读写分离，数据分区策略和缓存优化。
