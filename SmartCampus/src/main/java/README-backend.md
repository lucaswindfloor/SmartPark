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
├── config/                                # 全局配置
│   ├── SecurityConfig.java                # 安全配置 ⏳
│   ├── WebConfig.java                     # Web配置 ⏳
│   ├── MyBatisConfig.java                 # MyBatis配置 ⏳
│   ├── WorkflowConfig.java                # 工作流配置 ⏳
│   ├── ElasticsearchConfig.java           # 搜索引擎配置 ⏳
│   └── MessageQueueConfig.java            # 消息队列配置 ⏳
│
├── core/                                  # 核心模块
│   ├── security/                          # 安全框架 ⏳
│   ├── utils/                             # 工具类 ⏳
│   ├── exception/                         # 异常处理 ⏳
│   ├── tenant/                            # 多租户支持 ⏳
│   ├── search/                            # 搜索框架 ⏳
│   │   ├── SearchService.java             # 搜索服务接口
│   │   └── SearchQuery.java               # 搜索查询对象
│   └── event/                             # 事件框架 ⏳
│       ├── EventPublisher.java            # 事件发布器
│       ├── MessageQueuePublisher.java     # 消息队列发布器
│       └── EventListener.java             # 事件监听器
│
├── platform/                              # 平台层
│   ├── comprehensive/                     # 综合管理平台
│   │   ├── dashboard/                     # 工作门户模块
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   ├── recruitment/                   # 招商管理模块
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   ├── operation/                     # 运营管理模块
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   ├── finance/                       # 财务管理模块
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   ├── service/                       # 服务管理模块
│   │   │   ├── controller/                # 控制器层
│   │   │   │   ├── item/                  # 服务事项控制器
│   │   │   │   │   ├── ServiceItemController.java    # 服务事项 ⏳
│   │   │   │   │   ├── ServiceProcessController.java # 服务流程 ⏳
│   │   │   │   │   └── ServiceEvaluationController.java # 服务评价 ⏳
│   │   │   │   ├── information/               # 信息公开
│   │   │   │   │   ├── announcement/          # 通知公告
│   │   │   │   │   │   ├── AnnouncementController.java  # 通知公告基本操作 ✅
│   │   │   │   │   │   ├── AnnouncementAuditController.java  # 通知审核 ⏳
│   │   │   │   │   │   ├── AnnouncementStatsController.java  # 通知统计 ⏳
│   │   │   │   │   │   ├── AnnouncementSearchController.java  # 通知搜索 ⏳
│   │   │   │   │   │   ├── AnnouncementRecycleBinController.java  # 回收站管理 ⏳
│   │   │   │   │   │   ├── AnnouncementPermissionController.java  # 通知权限管理 ⏳
│   │   │   │   │   │   └── AnnouncementConfirmationController.java  # 通知确认管理 ⏳
│   │   │   │   │   ├── policy/                # 政策文件
│   │   │   │   │   │   └── PolicyController.java  # 政策文件 ⏳
│   │   │   │   │   ├── activity/              # 园区活动
│   │   │   │   │   │   └── ActivityController.java  # 园区活动 ⏳
│   │   │   │   │   └── survey/                # 调查问卷
│   │   │   │   │       └── SurveyController.java  # 调查问卷 ⏳
│   │   │   │   ├── meeting/                   # 会议管理 ⏳
│   │   │   │   │   ├── MeetingRoomController.java    # 会议室管理
│   │   │   │   │   └── MeetingBookingController.java # 会议预订管理
│   │   │   │   ├── ac/                        # 空调管理 ⏳
│   │   │   │   │   ├── AirConditionerController.java  # 空调管理
│   │   │   │   │   └── AcExtensionController.java     # 空调加时
│   │   │   │   ├── access/                    # 门禁管理 ⏳
│   │   │   │   │   ├── AccessControlController.java   # 门禁控制
│   │   │   │   │   └── AccessRecordController.java    # 通行记录
│   │   │   │   ├── parking/                   # 停车管理 ⏳
│   │   │   │   │   ├── ParkingLotController.java      # 停车场管理
│   │   │   │   │   ├── ParkingCardController.java     # 月卡管理
│   │   │   │   │   └── ParkingRecordController.java   # 停车记录
│   │   │   │   └── serviceprocessing/         # 服务办理 ⏳
│   │   │   │       ├── EventReportController.java     # 事件上报
│   │   │   │       ├── MaintenanceController.java     # 维修申报
│   │   │   │       ├── InvoiceController.java         # 开票申请
│   │   │   │       └── TenantChangeController.java    # 退租/退园申请
│   │   │   │
│   │   │   └── service/                 # 服务层
│   │   │       ├── item/                # 服务事项服务
│   │   │       │   ├── ServiceItemService.java          # ⏳
│   │   │       │   ├── ServiceProcessService.java       # ⏳
│   │   │       │   └── ServiceEvaluationService.java    # ⏳
│   │   │       ├── information/         # 信息公开模块服务
│   │   │       │   ├── announcement/    # 通知公告服务
│   │   │       │   │   ├── AnnouncementService.java  # ✅
│   │   │       │   │   ├── AnnouncementAuditService.java  # ⏳
│   │   │       │   │   ├── AnnouncementStatsService.java  # ⏳
│   │   │       │   │   ├── AnnouncementSearchService.java  # ⏳
│   │   │       │   │   ├── AnnouncementRecycleBinService.java  # 回收站服务 ⏳
│   │   │       │   │   ├── AnnouncementPermissionService.java  # 权限管理服务 ⏳
│   │   │       │   │   └── AnnouncementConfirmationService.java  # 确认管理服务 ⏳
│   │   │       │   ├── policy/          # 政策文件服务
│   │   │       │   │   └── PolicyService.java  # ⏳
│   │   │       │   └── activity/        # 园区活动服务
│   │   │       │       └── ActivityService.java  # ⏳
│   │   │       ├── meeting/              # 会议管理服务
│   │   │       │   ├── MeetingRoomService.java    # ⏳
│   │   │       │   └── MeetingBookingService.java # ⏳
│   │   │       ├── ac/                   # 空调管理服务
│   │   │       │   ├── AirConditionerService.java  # ⏳
│   │   │       │   └── AcExtensionService.java     # ⏳
│   │   │       ├── access/               # 门禁管理服务
│   │   │       │   ├── AccessControlService.java   # ⏳
│   │   │       │   └── AccessRecordService.java    # ⏳
│   │   │       ├── parking/              # 停车管理服务
│   │   │       │   ├── ParkingLotService.java      # ⏳
│   │   │       │   ├── ParkingCardService.java     # ⏳
│   │   │       │   └── ParkingRecordService.java   # ⏳
│   │   │       └── serviceprocessing/    # 服务办理服务
│   │   │           ├── EventReportService.java     # ⏳
│   │   │           ├── MaintenanceService.java     # ⏳
│   │   │           ├── InvoiceService.java         # ⏳
│   │   │           └── TenantChangeService.java    # ⏳
│   │   │
│   │   ├── asset/                        # 资产管理模块
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   ├── energy/                       # 能源管理模块
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   └── statistics/                   # 综合统计模块
│   │       ├── controller/                # 控制器 ⏳
│   │       └── service/                   # 服务层 ⏳
│   │
│   ├── public/                           # 公共服务平台
│   │   ├── information/                  # 信息公开
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   │   ├── announcement/           # 通知公告控制器
│   │   │   │   │   ├── AnnouncementViewController.java  # 通知查看 ⏳
│   │   │   │   │   ├── AnnouncementSubscriptionController.java  # 通知订阅 ⏳
│   │   │   │   │   └── MobileAnnouncementController.java  # 移动端通知控制器 ⏳
│   │   │   │   ├── policy/                 # 政策文件控制器
│   │   │   │   └── activity/               # 园区活动控制器
│   │   │   └── service/                   # 服务层 ⏳
│   │   │       ├── announcement/           # 通知公告服务
│   │   │       │   ├── AnnouncementViewService.java  # 通知查看服务 ⏳
│   │   │       │   ├── SubscriptionService.java  # 订阅服务 ⏳
│   │   │       │   └── MobileAnnouncementService.java  # 移动端通知服务 ⏳
│   │   │       ├── policy/                 # 政策文件服务
│   │   │       └── activity/               # 园区活动服务
│   │   │
│   │   ├── servicehall/                  # 服务大厅
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   ├── usercenter/                   # 用户中心
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   │   ├── MessageController.java # 消息控制器 ⏳
│   │   │   │   ├── SystemMessageController.java # 系统消息控制器 ⏳
│   │   │   │   ├── UserMessageController.java # 用户消息控制器 ⏳
│   │   │   │   └── ProfileController.java # 个人资料控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │       ├── MessageService.java    # 消息服务 ⏳
│   │   │       ├── SystemMessageService.java # 系统消息服务 ⏳
│   │   │       ├── UserMessageService.java # 用户消息服务 ⏳
│   │   │       └── ProfileService.java    # 个人资料服务 ⏳
│   │   │
│   │   ├── enterprisemanage/             # 企业管理
│   │   │   ├── controller/                # 控制器 ⏳
│   │   │   └── service/                   # 服务层 ⏳
│   │   │
│   │   └── admin/                            # 系统管理员平台
│   │       ├── configuration/                # 系统配置管理
│   │       │   ├── controller/                # 控制器 ⏳
│   │       │   └── service/                   # 服务层 ⏳
│   │       │
│   │       ├── authorization/                # 权限与角色管理
│   │       │   ├── controller/                # 控制器 ⏳
│   │       │   └── service/                   # 服务层 ⏳
│   │       │
│   │       ├── workflow/                     # 流程引擎管理
│   │       │   ├── controller/                # 控制器 ⏳
│   │       │   └── service/                   # 服务层 ⏳
│   │       │
│   │       ├── monitoring/                   # 系统监控中心
│   │       │   ├── controller/                # 控制器 ⏳
│   │       │   └── service/                   # 服务层 ⏳
│   │       │
│   │       └── integration/                  # 系统集成管理
│   │           ├── controller/                # 控制器 ⏳
│   │           └── service/                   # 服务层 ⏳
│   │
│   ├── domain/                               # 领域层
│   │   ├── user/                             # 用户领域
│   │   │   ├── entity/                       # 实体 ⏳
│   │   │   ├── repository/                   # 仓储接口 ⏳
│   │   │   └── service/                      # 领域服务 ⏳
│   │   │
│   │   ├── service/                          # 服务管理领域
│   │   │   ├── entity/                       # 实体
│   │   │   │   ├── ServiceItem.java          # 服务事项实体 ⏳
│   │   │   │   ├── ServiceProcess.java       # 服务流程实体 ⏳
│   │   │   │   ├── ServiceForm.java          # 服务表单实体 ⏳
│   │   │   │   └── ServiceEvaluation.java    # 服务评价实体 ⏳
│   │   │   ├── repository/                   # 仓储接口 ⏳
│   │   │   │   ├── ServiceItemRepository.java        # ⏳
│   │   │   │   ├── ServiceProcessRepository.java     # ⏳
│   │   │   │   └── ServiceEvaluationRepository.java  # ⏳
│   │   │   └── service/                      # 领域服务
│   │   │       ├── ServiceItemDomainService.java     # ⏳
│   │   │       ├── ServiceProcessDomainService.java  # ⏳
│   │   │       └── ServiceEvaluationDomainService.java # ⏳
│   │   │
│   │   ├── information/                      # 信息公开领域
│   │   │   ├── entity/                       # 领域实体
│   │   │   │   ├── announcement/             # 通知公告实体
│   │   │   │   │   ├── Announcement.java         # 通知公告 ✅
│   │   │   │   │   ├── AnnouncementAudit.java    # 通知审核记录 ⏳
│   │   │   │   │   ├── AnnouncementRead.java     # 通知阅读记录 ⏳
│   │   │   │   │   ├── AnnouncementConfirmation.java  # 通知确认记录 ⏳
│   │   │   │   │   ├── AnnouncementRecycleBin.java    # 回收站记录 ⏳
│   │   │   │   │   └── AnnouncementPermission.java    # 通知权限记录 ⏳
│   │   │   │   ├── common/                   # 公共实体
│   │   │   │   │   └── Attachment.java       # 附件 ⏳
│   │   │   │   ├── policy/                   # 政策文件实体
│   │   │   │   │   └── Policy.java           # 政策文件 ⏳
│   │   │   │   ├── activity/                 # 园区活动实体
│   │   │   │   │   └── Activity.java         # 园区活动 ⏳
│   │   │   │   └── survey/                   # 调查问卷实体
│   │   │   │       └── Survey.java           # 调查问卷 ⏳
│   │   │   ├── repository/                   # 仓储接口
│   │   │   │   ├── announcement/             # 通知公告仓储
│   │   │   │   │   ├── AnnouncementRepository.java  # ✅
│   │   │   │   │   ├── AnnouncementAuditRepository.java  # ⏳
│   │   │   │   │   ├── AnnouncementReadRepository.java  # ⏳
│   │   │   │   │   ├── AnnouncementConfirmationRepository.java  # 确认记录仓储 ⏳
│   │   │   │   │   ├── AnnouncementRecycleBinRepository.java    # 回收站仓储 ⏳
│   │   │   │   │   └── AnnouncementPermissionRepository.java    # 权限仓储 ⏳
│   │   │   │   ├── policy/                   # 政策文件仓储
│   │   │   │   │   └── PolicyRepository.java  # ⏳
│   │   │   │   └── activity/                 # 园区活动仓储
│   │   │   │       └── ActivityRepository.java  # ⏳
│   │   │   ├── service/                      # 领域服务
│   │   │   │   ├── announcement/             # 通知公告领域服务
│   │   │   │   │   ├── AnnouncementDomainService.java  # ✅
│   │   │   │   │   ├── AnnouncementStateMachine.java  # 状态机服务 ⏳
│   │   │   │   │   ├── AnnouncementStatsService.java  # 统计分析服务 ⏳
│   │   │   │   │   ├── AnnouncementSearchDomainService.java  # 通知搜索领域服务 ⏳
│   │   │   │   │   ├── AnnouncementPermissionService.java  # 权限管理领域服务 ⏳
│   │   │   │   │   ├── AnnouncementConfirmationService.java  # 确认管理领域服务 ⏳
│   │   │   │   │   └── AnnouncementRecycleBinService.java    # 回收站领域服务 ⏳
│   │   │   │   ├── policy/                   # 政策文件领域服务
│   │   │   │   └── activity/                 # 园区活动领域服务
│   │   │   └── event/                        # 领域事件
│   │   │       ├── announcement/             # 通知公告事件
│   │   │       │   ├── AnnouncementCreatedEvent.java  # 通知创建事件 ⏳
│   │   │       │   ├── AnnouncementAuditedEvent.java  # 通知审核事件 ⏳
│   │   │       │   ├── AnnouncementPublishedEvent.java  # 通知发布事件 ⏳
│   │   │       │   ├── AnnouncementExpiredEvent.java     # 通知过期事件 ⏳
│   │   │       │   ├── AnnouncementArchivedEvent.java    # 通知归档事件 ⏳
│   │   │       │   └── AnnouncementConfirmedEvent.java   # 通知确认事件 ⏳
│   │   │       ├── policy/                   # 政策文件事件
│   │   │       └── activity/                 # 园区活动事件
│   │   │
│   │   ├── resource/                         # 资源管理领域
│   │   │   ├── entity/                       # 实体
│   │   │   │   ├── MeetingRoom.java          # 会议室实体 ⏳
│   │   │   │   ├── AirConditioner.java       # 空调实体 ⏳
│   │   │   │   ├── AccessControl.java        # 门禁实体 ⏳
│   │   │   │   └── ParkingLot.java           # 停车场实体 ⏳
│   │   │   ├── booking/                      # 资源预订
│   │   │   │   ├── entity/                   # 预订实体
│   │   │   │   │   ├── ResourceBooking.java  # 资源预订基类 ⏳
│   │   │   │   │   ├── MeetingBooking.java   # 会议室预订 ⏳
│   │   │   │   │   └── AcExtensionBooking.java # 空调加时预订 ⏳
│   │   │   │   ├── repository/               # 预订仓储
│   │   │   │   │   ├── BookingRepository.java    # ⏳
│   │   │   │   │   └── MeetingBookingRepository.java # ⏳
│   │   │   │   └── service/                  # 预订服务
│   │   │   │       ├── BookingDomainService.java    # ⏳
│   │   │   │       └── BookingConflictService.java  # ⏳
│   │   │   ├── repository/                   # 资源仓储
│   │   │   │   ├── ResourceRepository.java       # ⏳
│   │   │   │   ├── MeetingRoomRepository.java    # ⏳
│   │   │   │   └── AirConditionerRepository.java # ⏳
│   │   │   └── service/                      # 资源服务
│   │   │       ├── ResourceDomainService.java        # ⏳
│   │   │       └── ResourceAvailabilityService.java  # ⏳
│   │   │
│   │   ├── subscription/                     # 订阅领域
│   │   │   ├── entity/                       # 订阅实体
│   │   │   │   ├── announcement/             # 通知公告订阅实体
│   │   │   │   │   └── AnnouncementSubscription.java  # 通知订阅 ⏳
│   │   │   │   ├── message/                  # 消息订阅实体
│   │   │   │   │   ├── SystemMessageSubscription.java  # 系统消息订阅 ⏳
│   │   │   │   │   └── UserMessageSubscription.java  # 用户消息订阅 ⏳
│   │   │   │   └── common/                   # 公共订阅实体
│   │   │   ├── repository/                   # 订阅仓储
│   │   │   │   ├── announcement/             # 通知订阅仓储
│   │   │   │   │   └── AnnouncementSubscriptionRepository.java  # ⏳
│   │   │   │   ├── message/                  # 消息订阅仓储
│   │   │   │   │   ├── SystemMessageSubscriptionRepository.java  # ⏳
│   │   │   │   │   └── UserMessageSubscriptionRepository.java  # ⏳
│   │   │   │   └── common/                   # 公共订阅仓储
│   │   │   │       └── SubscriptionRepository.java  # ⏳
│   │   │   └── service/                      # 订阅服务
│   │   │       ├── announcement/             # 通知订阅服务
│   │   │       │   └── AnnouncementSubscriptionService.java  # ⏳
│   │   │       ├── message/                  # 消息订阅服务
│   │   │       │   ├── SystemMessageSubscriptionService.java  # ⏳
│   │   │       │   └── UserMessageSubscriptionService.java  # ⏳
│   │   │       └── common/                   # 公共订阅服务
│   │   │           └── SubscriptionDomainService.java  # ⏳
│   │   │
│   │   ├── message/                          # 消息领域
│   │   │   ├── entity/                       # 消息实体
│   │   │   │   ├── Message.java              # 消息基类 ⏳
│   │   │   │   ├── SystemMessage.java        # 系统消息 ⏳
│   │   │   │   └── UserMessage.java          # 用户消息 ⏳
│   │   │   ├── repository/                   # 消息仓储
│   │   │   │   ├── MessageRepository.java    # 消息仓储接口 ⏳
│   │   │   │   ├── SystemMessageRepository.java # 系统消息仓储 ⏳
│   │   │   │   └── UserMessageRepository.java   # 用户消息仓储 ⏳
│   │   │   ├── service/                      # 消息服务
│   │   │   │   ├── MessageDomainService.java # 消息领域服务 ⏳
│   │   │   │   ├── SystemMessageService.java # 系统消息服务 ⏳
│   │   │   │   └── UserMessageService.java   # 用户消息服务 ⏳
│   │   │   └── event/                        # 消息事件
│   │   │       ├── MessageCreatedEvent.java  # 消息创建事件 ⏳
│   │   │       ├── MessageReadEvent.java     # 消息已读事件 ⏳
│   │   │       └── MessageDeletedEvent.java  # 消息删除事件 ⏳
│   │   │
│   │   └── common/                           # 公共领域对象
│   │       └── entity/                       # 公共实体
│   │           └── BaseEntity.java           # 基础实体 ✅
│   │
│   ├── infrastructure/                       # 基础设施层
│   │   ├── persistence/                      # 持久化实现
│   │   │   ├── mapper/                       # MyBatis映射接口
│   │   │   │   ├── service/                  # 服务管理映射
│   │   │   │   │   ├── ServiceItemMapper.java      # ⏳
│   │   │   │   │   └── ServiceEvaluationMapper.java # ⏳
│   │   │   │   ├── resource/                 # 资源管理映射
│   │   │   │   │   ├── MeetingRoomMapper.java        # ⏳
│   │   │   │   │   └── ResourceBookingMapper.java    # ⏳
│   │   │   │   └── information/              # 信息管理映射
│   │   │   │   │   ├── announcement/         # 通知公告映射
│   │   │   │   │   │   ├── AnnouncementMapper.java  # ✅
│   │   │   │   │   │   ├── AnnouncementAuditMapper.java  # ⏳
│   │   │   │   │   │   ├── AnnouncementReadMapper.java  # ⏳
│   │   │   │   │   │   ├── AnnouncementConfirmationMapper.java  # 确认记录映射 ⏳
│   │   │   │   │   │   ├── AnnouncementRecycleBinMapper.java    # 回收站映射 ⏳
│   │   │   │   │   │   └── AnnouncementPermissionMapper.java    # 权限映射 ⏳
│   │   │   │   │   ├── common/               # 公共映射
│   │   │   │   │   │   └── AttachmentMapper.java  # ⏳
│   │   │   │   │   ├── policy/               # 政策文件映射
│   │   │   │   │   │   └── PolicyMapper.java  # ⏳
│   │   │   │   │   └── activity/             # 园区活动映射
│   │   │   │   │       └── ActivityMapper.java  # ⏳
│   │   │   │   └── information/              # 信息管理仓储实现
│   │   │   │       └── information/              # 信息管理仓储实现
│   │   │   │           ├── announcement/         # 通知公告仓储实现
│   │   │   │           │   ├── AnnouncementRepositoryImpl.java  # ✅
│   │   │   │           │   ├── AnnouncementAuditRepositoryImpl.java  # ⏳
│   │   │   │           │   ├── AnnouncementReadRepositoryImpl.java  # ⏳
│   │   │   │           │   ├── AnnouncementConfirmationRepositoryImpl.java  # 确认记录仓储实现 ⏳
│   │   │   │           │   ├── AnnouncementRecycleBinRepositoryImpl.java    # 回收站仓储实现 ⏳
│   │   │   │           │   └── AnnouncementPermissionRepositoryImpl.java    # 权限仓储实现 ⏳
│   │   │   │           ├── policy/               # 政策文件仓储实现
│   │   │   │           │   └── PolicyRepositoryImpl.java  # ⏳
│   │   │   │           └── activity/             # 园区活动仓储实现
│   │   │   └── partition/                    # 数据分区策略 ⏳
│   │   │       ├── PartitionStrategy.java    # 分区策略接口
│   │   │       └── TimeBasedPartitionStrategy.java  # 基于时间的分区策略
│   │   │
│   │   ├── booking/                          # 资源预订基础设施
│   │   │   ├── service/                      # 预订服务
│   │   │   │   ├── BookingConflictDetector.java # 预订冲突检测 ⏳
│   │   │   │   └── ResourceLockService.java     # 资源锁定服务 ⏳
│   │   │   └── impl/                         # 服务实现
│   │   │       └── RedisResourceLockServiceImpl.java  # ⏳
│   │   │
│   │   ├── file/                             # 文件存储
│   │   │   ├── service/                      # 服务定义
│   │   │   │   ├── FileService.java          # 文件服务 ⏳
│   │   │   │   └── AttachmentService.java    # 附件服务 ⏳
│   │   │   └── impl/                         # 服务实现
│   │   │       ├── FileServiceImpl.java      # ⏳
│   │   │       └── AttachmentServiceImpl.java  # ⏳
│   │   │
│   │   ├── content/                          # 内容处理
│   │   │   ├── service/                      # 服务定义
│   │   │   │   ├── ContentSecurityService.java  # 内容安全服务 ⏳
│   │   │   │   └── SensitiveWordFilter.java  # 敏感词过滤 ⏳
│   │   │   └── impl/                         # 服务实现
│   │   │       ├── ContentSecurityServiceImpl.java  # ⏳
│   │   │       └── SensitiveWordFilterImpl.java  # ⏳
│   │   │
│   │   ├── workflow/                         # 工作流引擎
│   │   │   ├── service/                      # 服务定义
│   │   │   │   ├── WorkflowService.java      # 工作流服务 ⏳
│   │   │   │   ├── WorkflowFormService.java         # 工作流表单服务 ⏳
│   │   │   │   └── WorkflowTaskAssignService.java   # 任务分配服务 ⏳
│   │   │   ├── definition/                   # 工作流定义
│   │   │   │   ├── ProcessDefinitionService.java  # 流程定义服务 ⏳
│   │   │   │   └── FormDefinitionService.java     # 表单定义服务 ⏳
│   │   │   ├── rule/                         # 业务规则
│   │   │   │   ├── ServicePriorityRule.java       # 服务优先级规则 ⏳
│   │   │   │   ├── ServiceAssignmentRule.java     # 服务分配规则 ⏳
│   │   │   │   └── RuleEngineService.java         # 规则引擎服务 ⏳
│   │   │   ├── execution/                    # 工作流执行
│   │   │   │   ├── ProcessExecutionService.java   # 流程执行服务 ⏳
│   │   │   │   └── TaskService.java               # 任务服务 ⏳
│   │   │   ├── monitor/                      # 工作流监控
│   │   │   │   └── ProcessMonitorService.java     # 流程监控服务 ⏳
│   │   │   └── impl/                         # 服务实现
│   │   │       └── WorkflowServiceImpl.java  # ⏳
│   │   │
│   │   ├── evaluation/                       # 评价服务
│   │   │   ├── service/                      # 服务定义
│   │   │   │   ├── EvaluationCalculator.java  # 评价计算服务 ⏳
│   │   │   │   └── EvaluationAnalyzer.java    # 评价分析服务 ⏳
│   │   │   └── impl/                         # 服务实现
│   │   │       └── EvaluationCalculatorImpl.java  # ⏳
│   │   │
│   │   ├── search/                           # 搜索实现
│   │   │   ├── repository/                   # 搜索仓储
│   │   │   │   └── ElasticsearchRepository.java  # ⏳
│   │   │   └── service/                      # 搜索服务
│   │   │       └── ElasticsearchService.java  # ⏳
│   │   │
│   │   ├── message/                          # 消息队列
│   │   │   ├── producer/                     # 消息生产者
│   │   │   │   └── RocketMQProducer.java  # ⏳
│   │   │   └── consumer/                     # 消息消费者
│   │   │       └── RocketMQConsumer.java  # ⏳
│   │   │
│   │   ├── mobile/                           # 移动端支持
│   │   │   ├── service/                      # 服务定义
│   │   │   │   ├── message/                  # 消息推送服务
│   │   │   │   │   └── PushSystemMessageService.java  # 推送系统消息服务 ⏳
│   │   │   │   └── common/                   # 公共服务
│   │   │   │       └── MobileAdaptationService.java  # 移动适配服务 ⏳
│   │   │   └── impl/                         # 服务实现
│   │   │       ├── message/                  # 消息推送服务实现
│   │   │       │   └── PushSystemMessageServiceImpl.java  # ⏳
│   │   │       └── common/                   # 公共服务实现
│   │   │
│   │   ├── integration/                      # 外部系统集成
│   │   │   ├── payment/                      # 支付集成
│   │   │   │   └── PaymentGatewayService.java  # ⏳
│   │   │   ├── sms/                          # 短信集成
│   │   │   │   └── SmsService.java  # ⏳
│   │   │   └── weather/                      # 天气服务集成
│   │   │       └── WeatherService.java  # ⏳
│   │   │
│   │   ├── cache/                            # 缓存服务
│   │   │   ├── service/                      # 服务定义 ⏳
│   │   │   └── impl/                         # 服务实现 ⏳
│   │   │
│   │   ├── lock/                             # 分布式锁服务
│   │   │   ├── DistributedLockService.java   # 分布式锁服务 ⏳
│   │   │   └── RedisLockServiceImpl.java     # Redis实现 ⏳
│   │   │
│   │   ├── metrics/                          # 业务监控与度量
│   │   │   ├── MetricsService.java           # 度量服务 ⏳
│   │   │   └── AnnouncementMetricsCollector.java  # 通知度量收集器 ⏳
│   │   │
│   │   ├── event/                            # 事件机制
│   │   │   ├── publisher/                    # 事件发布
│   │   │   │   └── EventPublisherImpl.java    # ⏳
│   │   │   └── listener/                     # 事件监听
│   │   │       └── AnnouncementEventListener.java  # ⏳
│   │   │
│   │   └── security/                         # 安全实现
│   │       ├── service/                      # 服务定义 ⏳
│   │       └── impl/                         # 服务实现 ⏳
│   │
│   └── common/                               # 通用模块
│       ├── dto/                              # 数据传输对象
│       │   ├── service/                      # 服务管理DTO
│       │   │   ├── ServiceItemDTO.java  # ⏳
│       │   │   ├── ServiceProcessDTO.java  # ⏳
│       │   │   ├── ServiceEvaluationDTO.java  # ⏳
│       │   │   └── request/
│       │   │       ├── ServiceItemRequest.java  # ⏳
│       │   │       └── ServiceEvaluationRequest.java  # ⏳
│       │   ├── resource/                     # 资源管理DTO
│       │   │   ├── MeetingRoomDTO.java  # ⏳
│       │   │   ├── BookingDTO.java  # ⏳
│       │   │   ├── AirConditionerDTO.java  # ⏳
│       │   │   └── request/
│       │   │       ├── BookingRequest.java  # ⏳
│       │   │       └── AcExtensionRequest.java  # ⏳
│       │   └── information/                  # 信息公开DTO
│       │       ├── announcement/             # 通知公告DTO
│       │       │   ├── AnnouncementDTO.java  # ✅
│       │       │   ├── AnnouncementAuditDTO.java  # ⏳
│       │       │   ├── AnnouncementStatsDTO.java  # ⏳
│       │       │   └── request/
│       │       │       ├── AnnouncementRequest.java  # ✅
│       │       │       └── AnnouncementAuditRequest.java  # ⏳
│       │       ├── common/                   # 公共DTO
│       │       │   └── AttachmentDTO.java  # ⏳
│       │       ├── policy/                   # 政策文件DTO
│       │       │   ├── PolicyDTO.java  # ⏳
│       │       │   └── request/
│       │       │       └── PolicyRequest.java  # ⏳
│       │       └── activity/                 # 园区活动DTO
│       ├── response/                         # 统一响应
│   │   ├── Result.java  # ✅
│   │   └── PageResult.java  # ✅
│   │
│   ├── enums/                            # 枚举定义
│   │   ├── service/                      # 服务管理枚举
│   │   │   ├── ServiceItemStatusEnum.java  # ⏳
│   │   │   ├── ServicePriorityEnum.java  # ⏳
│   │   │   ├── ServiceTypeEnum.java  # ⏳
│   │   │   └── EvaluationDimensionEnum.java  # ⏳
│   │   ├── resource/                     # 资源管理枚举
│   │   │   ├── ResourceTypeEnum.java  # ⏳
│   │   │   ├── BookingStatusEnum.java  # ⏳
│   │   │   └── ResourceAvailabilityEnum.java  # ⏳
│   │   └── information/                  # 信息管理枚举
│   │       ├── announcement/             # 通知公告枚举
│   │       │   ├── AnnouncementStatusEnum.java  # ✅
│   │       │   ├── AuditStatusEnum.java  # ⏳
│   │       │   └── AnnouncementTypeEnum.java  # ⏳
│   │       ├── common/                   # 公共枚举
│   │       │   └── AttachmentTypeEnum.java  # ⏳
│   │       ├── policy/                   # 政策文件枚举
│   │       └── activity/                 # 园区活动枚举
│   ├── constant/                         # 常量定义
│   │   ├── SystemConstants.java  # ⏳
│   │   └── SecurityConstants.java  # ⏳
│   └── utils/                            # 工具类
│       ├── DateUtils.java  # ✅
│       └── StringUtils.java  # ✅

SmartCampus/src/main/resources/
├── application.yml                       # 应用配置 ✅
├── application-dev.yml                   # 开发环境配置 ⏳
├── application-prod.yml                  # 生产环境配置 ⏳
├── mapper/                               # MyBatis XML映射
│   ├── service/                          # 服务管理XML映射
│   │   ├── ServiceItemMapper.xml  # ⏳
│   │   └── ServiceEvaluationMapper.xml  # ⏳
│   ├── resource/                         # 资源管理XML映射
│   │   ├── MeetingRoomMapper.xml  # ⏳
│   │   └── ResourceBookingMapper.xml  # ⏳
│   └── information/                      # 信息管理XML映射
│       ├── announcement/
│       │   ├── AnnouncementMapper.xml  # ✅
│       │   ├── AnnouncementAuditMapper.xml  # ⏳
│       │   ├── AnnouncementReadMapper.xml  # ⏳
│       │   ├── AnnouncementConfirmationMapper.xml  # 确认记录映射XML ⏳
│       │   ├── AnnouncementRecycleBinMapper.xml    # 回收站映射XML ⏳
│       │   └── AnnouncementPermissionMapper.xml    # 权限映射XML ⏳
│       ├── common/
│       │   └── AttachmentMapper.xml  # ⏳
│       ├── policy/
│       │   └── PolicyMapper.xml  # ⏳
│       └── activity/
│           └── ActivityMapper.xml  # ⏳
├── db/                                   # 数据库脚本
│   ├── schema.sql                        # 表结构定义 ⏳
│   └── data.sql                          # 初始数据 ⏳
└── static/                               # 静态资源目录 ⏳
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
