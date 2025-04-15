
# 智慧园区系统模块化单体架构详细设计

基于系统设计文档分析，以下是完整的智慧园区系统模块化单体架构设计：

## 1. 整体架构图

```
SmartCampus/
├── core/                         # 核心基础模块
│   ├── common/                   # 通用组件
│   ├── security/                 # 安全框架
│   ├── config/                   # 全局配置
│   └── exception/                # 全局异常
├── domain/                       # 领域模块(按DDD设计)
│   ├── user/                     # 用户与权限领域
│   ├── tenant/                   # 租户管理领域
│   ├── asset/                    # 资产管理领域
│   ├── billing/                  # 账单与支付领域
│   ├── contract/                 # 合同管理领域
│   ├── service/                  # 服务管理领域
│   ├── notification/             # 通知管理领域
│   ├── operation/                # 运营管理领域
│   ├── monitoring/               # 监控与运维领域
│   ├── workflow/                 # 工作流引擎领域
│   └── integration/              # 外部集成领域
├── application/                  # 应用服务层
│   ├── service/                  # 应用服务实现
│   ├── facade/                   # 外观模式API
│   ├── assembler/                # DTO转换器
│   └── event/                    # 事件处理器
├── platform/                     # 平台特定实现
│   ├── admin/                    # 管理员平台
│   ├── public/                   # 公共服务平台
│   └── property/                 # 物业管理平台
├── interfaces/                   # 接口层
│   ├── api/                      # API接口
│   ├── gateway/                  # API网关
│   ├── job/                      # 定时任务
│   └── message/                  # 消息消费者
└── infrastructure/               # 技术基础设施
    ├── persistence/              # 持久化实现
    ├── cache/                    # 缓存实现
    ├── messaging/                # 消息实现
    ├── config/                   # 配置中心
    ├── audit/                    # 审计日志
    ├── trace/                    # 分布式追踪
    ├── search/                   # 搜索实现
    └── file/                     # 文件存储实现
```

## 2. 核心业务模块详细设计

### 2.1 用户与权限模块 (domain.user)

**职责**: 管理用户认证、授权和权限控制

```
domain.user/
├── api/                          # 模块对外接口
│   ├── UserService.java          # 用户服务接口
│   ├── RoleService.java          # 角色服务接口
│   ├── PermissionService.java    # 权限服务接口
│   └── dto/                      # 数据传输对象
├── entity/                       # 领域实体
│   ├── User.java                 # 用户实体
│   ├── Role.java                 # 角色实体
│   └── Permission.java           # 权限实体
├── repository/                   # 仓储接口
│   ├── UserRepository.java       # 用户仓储接口
│   └── RoleRepository.java       # 角色仓储接口
├── service/                      # 领域服务实现
│   ├── UserServiceImpl.java      # 用户服务实现
│   ├── RoleServiceImpl.java      # 角色服务实现
│   └── PermissionServiceImpl.java # 权限服务实现
└── event/                        # 领域事件
    ├── UserCreatedEvent.java     # 用户创建事件
    └── UserRoleChangedEvent.java # 用户角色变更事件
```

### 2.2 租户管理模块 (domain.tenant)

**职责**: 管理租户生命周期、租户配置和多租户数据隔离

```
domain.tenant/
├── api/                          # 模块对外接口
│   ├── TenantService.java        # 租户服务接口
│   ├── TenantConfigService.java  # 租户配置服务接口
│   └── dto/                      # 数据传输对象
├── entity/                       # 领域实体
│   ├── Tenant.java               # 租户实体
│   ├── TenantConfig.java         # 租户配置实体
│   └── TenantResource.java       # 租户资源实体
├── repository/                   # 仓储接口
│   └── TenantRepository.java     # 租户仓储接口
├── service/                      # 领域服务实现
│   ├── TenantServiceImpl.java    # 租户服务实现
│   ├── TenantConfigServiceImpl.java # 租户配置服务实现
│   ├── TenantSchemaManager.java  # 租户数据库Schema管理
│   └── TenantLifecycleManager.java # 租户生命周期管理
└── event/                        # 领域事件
    ├── TenantCreatedEvent.java   # 租户创建事件
    └── TenantStatusChangedEvent.java # 租户状态变更事件
```

### 2.3 资产管理模块 (domain.asset)

**职责**: 管理园区资产、设备和空间资源

```
domain.asset/
├── api/                          # 模块对外接口
│   ├── BuildingService.java      # 建筑服务接口
│   ├── RoomService.java          # 房间服务接口
│   ├── DeviceService.java        # 设备服务接口
│   └── dto/                      # 数据传输对象
├── entity/                       # 领域实体
│   ├── Building.java             # 建筑实体
│   ├── Floor.java                # 楼层实体
│   ├── Room.java                 # 房间实体
│   └── Device.java               # 设备实体
├── repository/                   # 仓储接口
│   ├── BuildingRepository.java   # 建筑仓储接口
│   └── RoomRepository.java       # 房间仓储接口 
├── service/                      # 领域服务实现
│   ├── BuildingServiceImpl.java  # 建筑服务实现
│   ├── RoomServiceImpl.java      # 房间服务实现
│   └── AssetMonitorService.java  # 资产监控服务
└── event/                        # 领域事件
    ├── RoomAllocationEvent.java  # 房间分配事件
    └── DeviceStatusChangedEvent.java # 设备状态变更事件
```

### 2.4 账单与支付模块 (domain.billing)

**职责**: 管理账单生成、支付处理和财务核算

```
domain.billing/
├── api/                          # 模块对外接口
│   ├── BillingService.java       # 账单服务接口
│   ├── PaymentService.java       # 支付服务接口
│   ├── InvoiceService.java       # 发票服务接口
│   └── dto/                      # 数据传输对象
├── entity/                       # 领域实体
│   ├── Bill.java                 # 账单实体
│   ├── BillItem.java             # 账单项实体
│   ├── Payment.java              # 支付实体
│   └── Invoice.java              # 发票实体
├── repository/                   # 仓储接口
│   ├── BillRepository.java       # 账单仓储接口
│   └── PaymentRepository.java    # 支付仓储接口
├── service/                      # 领域服务实现
│   ├── BillingServiceImpl.java   # 账单服务实现
│   ├── PaymentServiceImpl.java   # 支付服务实现
│   └── BillingCalculator.java    # 账单计算器
└── event/                        # 领域事件
    ├── BillGeneratedEvent.java   # 账单生成事件
    └── PaymentCompletedEvent.java # 支付完成事件
```

### 2.5 监控与运维模块 (domain.monitoring)

**职责**: 提供系统监控、性能分析和告警管理

```
domain.monitoring/
├── api/                          # 模块对外接口
│   ├── MetricsService.java       # 指标服务接口
│   ├── AlertService.java         # 告警服务接口
│   ├── DashboardService.java     # 仪表盘服务接口
│   └── dto/                      # 数据传输对象
├── entity/                       # 领域实体
│   ├── Metric.java               # 指标实体
│   ├── Alert.java                # 告警实体
│   └── Dashboard.java            # 仪表盘实体
├── repository/                   # 仓储接口
│   ├── MetricRepository.java     # 指标仓储接口
│   └── AlertRepository.java      # 告警仓储接口
├── service/                      # 领域服务实现
│   ├── MetricsServiceImpl.java   # 指标服务实现
│   ├── AlertServiceImpl.java     # 告警服务实现
│   ├── MonitoringScheduler.java  # 监控调度器
│   └── AlertNotifier.java        # 告警通知器
└── integration/                  # 监控集成
    ├── PrometheusAdapter.java    # Prometheus适配器
    ├── GrafanaService.java       # Grafana服务
    └── MetricsCollector.java     # 指标收集器
```

### 2.6 工作流引擎模块 (domain.workflow)

**职责**: 提供动态表单设计和工作流引擎

```
domain.workflow/
├── api/                          # 模块对外接口
│   ├── WorkflowService.java      # 工作流服务接口
│   ├── FormService.java          # 表单服务接口
│   ├── RuleService.java          # 规则服务接口
│   └── dto/                      # 数据传输对象
├── entity/                       # 领域实体
│   ├── WorkflowDefinition.java   # 工作流定义实体
│   ├── WorkflowInstance.java     # 工作流实例实体
│   ├── FormDefinition.java       # 表单定义实体
│   └── FormSubmission.java       # 表单提交实体
├── repository/                   # 仓储接口
│   ├── WorkflowRepository.java   # 工作流仓储接口
│   └── FormRepository.java       # 表单仓储接口
├── service/                      # 领域服务实现
│   ├── WorkflowServiceImpl.java  # 工作流服务实现
│   ├── FormServiceImpl.java      # 表单服务实现
│   ├── WorkflowEngine.java       # 工作流引擎
│   └── FormRenderer.java         # 表单渲染器
└── engine/                       # 引擎实现
    ├── activiti/                 # Activiti适配器
    ├── rules/                    # 规则引擎
    └── expression/               # 表达式解析器
```

### 2.7 外部集成模块 (domain.integration)

**职责**: 管理与外部系统的集成

```
domain.integration/
├── payment/                      # 支付网关集成
│   ├── api/                      # 支付API
│   ├── wechat/                   # 微信支付集成
│   ├── alipay/                   # 支付宝集成
│   └── union/                    # 银联支付集成
├── access/                       # 门禁系统集成
│   ├── api/                      # 门禁API
│   ├── adapter/                  # 适配器
│   └── sync/                     # 数据同步
├── energy/                       # 能耗监控集成
│   ├── api/                      # 能耗API
│   ├── collector/                # 数据采集
│   └── analysis/                 # 能耗分析
├── notification/                 # 通知推送集成
│   ├── api/                      # 通知API
│   ├── sms/                      # 短信服务
│   ├── email/                    # 邮件服务
│   └── push/                     # 推送服务
└── external/                     # 其他外部系统集成
    ├── api/                      # 外部系统API
    └── adapter/                  # 适配器
```

## 3. 应用层设计

应用层位于领域层之上，负责应用流程编排和模块间协调：

```
application/
├── service/                      # 应用服务实现
│   ├── WorkflowAppService.java   # 工作流应用服务
│   ├── DashboardAppService.java  # 仪表盘应用服务
│   ├── ReportAppService.java     # 报表应用服务
│   ├── TenantAppService.java     # 租户应用服务
│   └── IntegrationAppService.java # 集成应用服务
├── facade/                       # 外观模式服务
│   ├── ContractFacade.java       # 合同管理门面
│   ├── BillingFacade.java        # 账单管理门面
│   ├── AssetFacade.java          # 资产管理门面
│   └── MonitoringFacade.java     # 监控门面
├── assembler/                    # DTO转换器
│   ├── BillingAssembler.java     # 账单DTO转换
│   ├── ContractAssembler.java    # 合同DTO转换
│   ├── TenantAssembler.java      # 租户DTO转换
│   └── UserAssembler.java        # 用户DTO转换
└── event/                        # 事件处理器
    ├── UserEventHandler.java     # 用户事件处理器
    ├── BillingEventHandler.java  # 账单事件处理器
    ├── TenantEventHandler.java   # 租户事件处理器
    └── AssetEventHandler.java    # 资产事件处理器
```

## 4. 平台层设计

平台层实现各平台特定功能和API：

```
platform/
├── admin/                        # 管理员平台
│   ├── controller/               # 控制器
│   │   ├── TenantController.java # 租户管理控制器
│   │   ├── UserController.java   # 用户管理控制器
│   │   ├── MonitorController.java # 监控控制器
│   │   └── ConfigController.java # 配置控制器
│   ├── tenant/                   # 租户管理
│   │   └── lifecycle/            # 生命周期管理
│   ├── data/                     # 数据管理
│   │   ├── backup/               # 备份管理
│   │   └── migration/            # 数据迁移
│   ├── operation/                # 运维管理
│   │   ├── alert/                # 告警管理
│   │   └── job/                  # 任务管理
│   ├── config/                   # 平台配置
│   └── view/                     # 视图模型
├── public/                       # 公共服务平台
│   ├── controller/               # 控制器
│   │   ├── ServiceController.java # 服务控制器
│   │   ├── BillingController.java # 账单控制器
│   │   ├── RepairController.java # 报修控制器
│   │   └── InfoController.java   # 信息控制器
│   ├── mobile/                   # 移动端适配层
│   │   ├── adapter/              # 移动适配器
│   │   └── response/             # 移动响应模型
│   ├── miniprogram/              # 小程序集成
│   │   ├── auth/                 # 小程序认证
│   │   └── api/                  # 小程序API
│   ├── scan/                     # 扫码服务实现
│   │   ├── QrCodeService.java    # 二维码服务
│   │   └── ScanProcessor.java    # 扫码处理器
│   ├── config/                   # 平台配置
│   └── view/                     # 视图模型
└── property/                     # 物业管理平台
    ├── controller/               # 控制器
    │   ├── AssetController.java  # 资产控制器
    │   ├── ContractController.java # 合同控制器
    │   ├── OperationController.java # 运营控制器
    │   └── ServiceDeskController.java # 服务台控制器
    ├── dashboard/                # 数据大屏
    │   ├── DataProvider.java     # 数据提供者
    │   └── ChartRenderer.java    # 图表渲染器
    ├── report/                   # 报表生成
    │   ├── ReportGenerator.java  # 报表生成器
    │   └── ExportService.java    # 导出服务
    ├── statistics/               # 统计分析
    │   ├── StatService.java      # 统计服务
    │   └── AnalysisEngine.java   # 分析引擎
    ├── config/                   # 平台配置
    └── view/                     # 视图模型
```

## 5. 接口层设计

接口层负责与外部系统和客户端交互：

```
interfaces/
├── api/                          # API接口
│   ├── controller/               # 控制器基类
│   ├── advice/                   # 全局异常处理
│   ├── response/                 # 响应封装
│   └── validation/               # 请求验证
├── gateway/                      # API网关
│   ├── filter/                   # 网关过滤器
│   │   ├── AuthFilter.java       # 认证过滤器
│   │   ├── LoggingFilter.java    # 日志过滤器
│   │   └── RateLimitFilter.java  # 限流过滤器
│   ├── route/                    # 路由配置
│   │   ├── RouteConfig.java      # 路由配置
│   │   └── DynamicRouteService.java # 动态路由服务
│   ├── limit/                    # 限流配置
│   │   ├── RateLimitConfig.java  # 限流配置
│   │   └── IpRateLimiter.java    # IP限流器
│   └── fallback/                 # 降级处理
│       ├── DefaultFallback.java  # 默认降级
│       └── ServiceFallback.java  # 服务降级
├── job/                          # 定时任务
│   ├── config/                   # 任务配置
│   ├── handler/                  # 任务处理器
│   └── scheduler/                # 任务调度器
└── message/                      # 消息消费者
    ├── consumer/                 # 消息消费者
    ├── handler/                  # 消息处理器
    └── config/                   # 消息配置
```

## 6. 基础设施层设计

技术实现和适配层：

```
infrastructure/
├── persistence/                  # 持久化实现
│   ├── repository/               # 仓储实现
│   │   ├── UserRepositoryImpl.java # 用户仓储实现
│   │   └── TenantRepositoryImpl.java # 租户仓储实现
│   ├── mybatis/                  # MyBatis配置
│   │   ├── config/               # MyBatis配置
│   │   ├── mapper/               # XML映射文件
│   │   └── interceptor/          # SQL拦截器
│   └── converter/                # 实体转换器
├── cache/                        # 缓存实现
│   ├── redis/                    # Redis配置
│   │   ├── RedisConfig.java      # Redis配置
│   │   └── RedissonConfig.java   # Redisson配置
│   ├── local/                    # 本地缓存
│   │   └── CaffeineConfig.java   # Caffeine配置
│   └── manager/                  # 缓存管理
│       ├── CacheManager.java     # 缓存管理器
│       └── CacheKeyGenerator.java # 缓存键生成器
├── messaging/                    # 消息实现
│   ├── rabbitmq/                 # RabbitMQ配置
│   │   ├── RabbitConfig.java     # RabbitMQ配置
│   │   └── RabbitAdmin.java      # RabbitMQ管理
│   ├── event/                    # 事件发布
│   │   ├── EventPublisher.java   # 事件发布器
│   │   └── DomainEventPublisher.java # 领域事件发布器
│   └── handler/                  # 消息处理
│       └── MessageHandler.java   # 消息处理器
├── config/                       # 配置中心
│   ├── nacos/                    # Nacos配置
│   │   ├── NacosConfigManager.java # Nacos配置管理
│   │   └── NacosProperties.java  # Nacos属性
│   ├── dynamic/                  # 动态配置
│   │   ├── DynamicConfigProvider.java # 动态配置提供者
│   │   └── ConfigRefreshListener.java # 配置刷新监听器
│   └── env/                      # 环境配置
│       ├── EnvConfig.java        # 环境配置
│       └── ProfileSelector.java  # 环境选择器
├── audit/                        # 审计日志
│   ├── aspect/                   # 审计切面
│   │   ├── AuditLogAspect.java   # 审计日志切面
│   │   └── DataChangesAspect.java # 数据变更切面
│   ├── provider/                 # 审计提供者
│   │   ├── AuditProvider.java    # 审计提供者
│   │   └── SecurityAuditProvider.java # 安全审计提供者
│   └── storage/                  # 审计存储
│       ├── AuditLogRepository.java # 审计日志仓储
│       └── AuditEventPublisher.java # 审计事件发布者
├── trace/                        # 分布式追踪
│   ├── sleuth/                   # Spring Cloud Sleuth
│   │   └── SleuthConfig.java     # Sleuth配置
│   ├── zipkin/                   # Zipkin集成
│   │   └── ZipkinConfig.java     # Zipkin配置
│   └── context/                  # 上下文
│       ├── TraceContext.java     # 追踪上下文
│       └── TraceContextHolder.java # 上下文持有者
├── security/                     # 安全实现
│   ├── jwt/                      # JWT实现
│   │   ├── JwtTokenProvider.java # JWT令牌提供者
│   │   └── JwtProperties.java    # JWT属性
│   ├── oauth/                    # OAuth2实现
│   │   └── OAuth2Config.java     # OAuth2配置
│   └── config/                   # 安全配置
│       ├── SecurityConfig.java   # 安全配置
│       └── WebSecurityConfig.java # Web安全配置
├── file/                         # 文件存储
│   ├── local/                    # 本地存储
│   │   └── LocalFileService.java # 本地文件服务
│   ├── minio/                    # MinIO存储
│   │   ├── MinioConfig.java      # MinIO配置
│   │   └── MinioService.java     # MinIO服务
│   └── service/                  # 文件服务
│       └── FileStorageService.java # 文件存储服务
└── search/                       # 搜索实现
    ├── elasticsearch/            # Elasticsearch实现
    │   ├── ESConfig.java         # ES配置
    │   └── ESTemplate.java       # ES模板
    └── service/                  # 搜索服务
        └── SearchService.java    # 搜索服务
```

## 7. 模块间通信机制

### 7.1 同步通信

```java
// 通过明确定义的API接口进行模块间调用
@Service
public class ContractServiceImpl implements ContractService {
    private final TenantService tenantService;    // 租户模块服务
    private final AssetService assetService;      // 资产模块服务
    
    @Autowired
    public ContractServiceImpl(TenantService tenantService, AssetService assetService) {
        this.tenantService = tenantService;
        this.assetService = assetService;
    }
    
    @Override
    public ContractDTO createContract(ContractCreateRequest request) {
        // 验证租户
        TenantDTO tenant = tenantService.getTenantById(request.getTenantId());
        if (tenant == null) {
            throw new BusinessException("租户不存在");
        }
        
        // 验证资产可用性
        RoomDTO room = assetService.getRoomById(request.getRoomId());
        if (room == null || !room.isAvailable()) {
            throw new BusinessException("房间不可用");
        }
        
        // 创建合同逻辑...
    }
}
```

### 7.2 异步通信

```java
// 通过事件机制实现模块间松耦合通信
@Service
public class ContractServiceImpl implements ContractService {
    private final DomainEventPublisher eventPublisher;
    
    @Autowired
    public ContractServiceImpl(DomainEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
    
    @Override
    public ContractDTO createContract(ContractCreateRequest request) {
        // 创建合同逻辑...
        
        // 发布合同创建事件
        ContractCreatedEvent event = new ContractCreatedEvent(
            contract.getId(), 
            contract.getTenantId(),
            contract.getRoomId(),
            contract.getStartDate(),
            contract.getEndDate()
        );
        eventPublisher.publish(event);
        
        return contractAssembler.toDTO(contract);
    }
}

// 账单模块监听合同创建事件
@Component
public class ContractEventListener {
    private final BillingService billingService;
    
    @Autowired
    public ContractEventListener(BillingService billingService) {
        this.billingService = billingService;
    }
    
    @EventListener
    public void handleContractCreated(ContractCreatedEvent event) {
        // 根据合同生成初始账单
        billingService.generateInitialBill(
            event.getContractId(),
            event.getTenantId(),
            event.getStartDate()
        );
    }
}
```

## 8. 数据库设计

### 8.1 Schema隔离策略

基于系统设计文档的明确要求，采用Schema隔离实现多租户：

```
smartcampus_db/
├── tenant_schemas/               # 多租户Schema
│   ├── tenant_1/                 # 租户1的Schema
│   │   ├── t_contract            # 合同表
│   │   ├── t_bill                # 账单表
│   │   ├── t_room                # 房间表
│   │   └── ...                   # 其他业务表
│   ├── tenant_2/                 # 租户2的Schema
│   └── ...                       # 其他租户Schema
├── shared_schema/                # 共享Schema
│   ├── t_tenant                  # 租户信息表
│   ├── t_user                    # 用户表
│   ├── t_role                    # 角色表
│   └── t_permission              # 权限表
└── system_schema/                # 系统Schema
    ├── t_audit_log               # 审计日志表
    ├── t_system_config           # 系统配置表
    └── t_metrics                 # 监控指标表
```

### 8.2 Schema隔离实现

```java
// 租户上下文处理
@Component
public class TenantContextHolder {
    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();
    
    public static void setTenantId(String tenantId) {
        CONTEXT.set(tenantId);
    }
    
    public static String getTenantId() {
        return CONTEXT.get();
    }
    
    public static void clear() {
        CONTEXT.remove();
    }
}

// Schema多租户实现
@Component
public class SchemaTenantConnectionProvider implements MultiTenantConnectionProvider {
    private final DataSource dataSource;
    
    @Autowired
    public SchemaTenantConnectionProvider(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    @Override
    public Connection getAnyConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        final Connection connection = getAnyConnection();
        connection.createStatement().execute("USE " + tenantIdentifier);
        return connection;
    }
    
    @Override
    public void releaseConnection(Connection connection, String tenantIdentifier) throws SQLException {
        // 重置连接到默认Schema
        connection.createStatement().execute("USE shared_schema");
        connection.close();
    }
    
    // 其他方法实现...
}

// MyBatis拦截器自动添加租户条件
@Intercepts({@Signature(
    type = StatementHandler.class,
    method = "prepare",
    args = {Connection.class, Integer.class}
)})
public class TenantSchemaInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler handler = (StatementHandler) invocation.getTarget();
        MetaObject metaObject = SystemMetaObject.forObject(handler);
        
        // 获取当前执行的SQL
        String sql = metaObject.getValue("delegate.boundSql.sql").toString();
        
        // 获取当前租户ID
        String tenantId = TenantContextHolder.getTenantId();
        if (StringUtils.isNotBlank(tenantId) && needTenantIsolation(sql)) {
            // 修改SQL添加Schema前缀
            String schema = "tenant_" + tenantId;
            sql = addSchemaPrefix(sql, schema);
            metaObject.setValue("delegate.boundSql.sql", sql);
        }
        
        return invocation.proceed();
    }
    
    // 其他辅助方法...
}
```

### 8.3 租户数据初始化

```java
@Service
public class TenantSchemaInitializer {
    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    
    @Autowired
    public TenantSchemaInitializer(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
    }
    
    @Transactional
    public void initTenantSchema(String tenantId) {
        // 创建租户Schema
        String schema = "tenant_" + tenantId;
        jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + schema);
        
        // 执行初始化脚本
        Resource resource = resourceLoader.getResource("classpath:db/schema/tenant-init.sql");
        try {
            String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            // 替换脚本中的Schema占位符
            sql = sql.replace("${schema}", schema);
            jdbcTemplate.execute(sql);
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize tenant schema", e);
        }
    }
}
```

## 9. 缓存架构设计

### 9.1 多级缓存策略

```
infrastructure/cache/
├── strategy/                     # 缓存策略
│   ├── CachingPolicy.java        # 缓存策略接口
│   ├── TwoLevelCachePolicy.java  # 两级缓存策略
│   ├── TenantAwareCachePolicy.java # 租户感知缓存策略
│   └── HotDataCachePolicy.java   # 热点数据缓存策略
├── eviction/                     # 缓存淘汰
│   ├── EvictionStrategy.java     # 淘汰策略接口
│   ├── LRUEvictionStrategy.java  # LRU淘汰策略
│   └── TTLEvictionStrategy.java  # 基于TTL淘汰策略
└── sync/                         # 缓存同步
    ├── CacheSynchronizer.java    # 缓存同步器
    └── MessageDrivenCacheSync.java # 消息驱动缓存同步
```

不同业务模块的缓存策略矩阵：

| 业务模块 | 缓存对象 | 缓存级别 | 过期策略 | 刷新机制 |
|---------|---------|---------|---------|---------|
| 用户权限 | 用户信息 | 两级缓存 | 30分钟 + 动态刷新 | 用户更新触发失效 |
| 用户权限 | 权限信息 | 两级缓存 | 30分钟 | 权限变更触发失效 |
| 租户管理 | 租户基本信息 | 分布式缓存 | 60分钟 | 租户信息变更触发 |
| 资产管理 | 建筑和楼层信息 | 两级缓存 | 24小时 | 资产信息变更触发 |
| 资产管理 | 房间可用状态 | 分布式缓存 | 5分钟 | 预订状态变更触发 |
| 账单管理 | 最新账单 | 分布式缓存 | 10分钟 | 账单生成/支付后触发 |
| 工作流引擎 | 流程定义 | 两级缓存 | 12小时 | 流程定义变更触发 |
| 工作流引擎 | 表单定义 | 两级缓存 | 12小时 | 表单定义变更触发 |
| 监控运维 | 系统指标 | 本地缓存 | 1分钟 | 定时刷新 |
| 监控运维 | 告警规则 | 两级缓存 | 10分钟 | 规则变更触发 |

### 9.2 缓存实现

```java
@Component
public class TwoLevelCacheManager implements CacheManager {
    private final CaffeineCacheManager localCacheManager;
    private final RedisCacheManager distributedCacheManager;
    
    @Autowired
    public TwoLevelCacheManager(CaffeineCacheManager localCacheManager, 
                               RedisCacheManager distributedCacheManager) {
        this.localCacheManager = localCacheManager;
        this.distributedCacheManager = distributedCacheManager;
    }
    
    public <T> T get(String key, Class<T> type) {
        // 先查本地缓存
        T value = localCacheManager.get(key, type);
        if (value != null) {
            return value;
        }
        
        // 本地缓存未命中，查询分布式缓存
        value = distributedCacheManager.get(key, type);
        if (value != null) {
            // 回填本地缓存
            localCacheManager.put(key, value);
        }
        
        return value;
    }
    
    public <T> void put(String key, T value) {
        // 同时更新本地缓存和分布式缓存
        localCacheManager.put(key, value);
        distributedCacheManager.put(key, value);
    }
    
    public void evict(String key) {
        // 同时从本地缓存和分布式缓存删除
        localCacheManager.evict(key);
        distributedCacheManager.evict(key);
    }
    
    public void clearAll() {
        localCacheManager.clearAll();
        distributedCacheManager.clearAll();
    }
}
```

### 9.3 缓存一致性保障

```java
@Component
public class CacheConsistencyManager {
    private final TwoLevelCacheManager cacheManager;
    private final MessageProducer messageProducer;
    
    @Autowired
    public CacheConsistencyManager(TwoLevelCacheManager cacheManager, 
                                  MessageProducer messageProducer) {
        this.cacheManager = cacheManager;
        this.messageProducer = messageProducer;
    }
    
    // 写操作更新策略
    public <T> void writeThrough(String key, T value) {
        // 1. 更新数据库
        // ...数据库操作
        
        // 2. 更新缓存
        cacheManager.put(key, value);
        
        // 3. 发送缓存更新消息给其他节点
        CacheUpdateMessage message = new CacheUpdateMessage(key, "UPDATE");
        messageProducer.send("cache.update", message);
    }
    
    // 双删策略
    public void deleteWithDoubleCheck(String key) {
        // 1. 第一次删除缓存
        cacheManager.evict(key);
        
        // 2. 更新数据库
        // ...数据库操作
        
        // 3. 休眠一段时间，等待可能的并发读操作完成
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 4. 第二次删除缓存
        cacheManager.evict(key);
        
        // 5. 发送缓存删除消息给其他节点
        CacheUpdateMessage message = new CacheUpdateMessage(key, "DELETE");
        messageProducer.send("cache.update", message);
    }
}
```

### 9.4 热点数据预加载

```java
@Service
public class HotDataPreloadService {
    private final TwoLevelCacheManager cacheManager;
    private final HotDataAnalyzer hotDataAnalyzer;
    
    @Autowired
    public HotDataPreloadService(TwoLevelCacheManager cacheManager, 
                               HotDataAnalyzer hotDataAnalyzer) {
        this.cacheManager = cacheManager;
        this.hotDataAnalyzer = hotDataAnalyzer;
    }
    
    // 系统启动时预加载热点数据
    @PostConstruct
    public void preloadOnStartup() {
        List<HotDataItem> hotDataItems = hotDataAnalyzer.getTopHotData(100);
        preloadData(hotDataItems);
    }
    
    // 定时任务重新加载热点数据
    @Scheduled(fixedRate = 1800000) // 30分钟执行一次
    public void scheduledPreload() {
        List<HotDataItem> hotDataItems = hotDataAnalyzer.getTopHotData(100);
        preloadData(hotDataItems);
    }
    
    private void preloadData(List<HotDataItem> hotDataItems) {
        for (HotDataItem item : hotDataItems) {
            try {
                Object data = loadDataFromSource(item);
                if (data != null) {
                    cacheManager.put(item.getCacheKey(), data);
                }
            } catch (Exception e) {
                // 处理异常，记录日志
            }
        }
    }
    
    private Object loadDataFromSource(HotDataItem item) {
        // 根据热点数据项从数据源加载数据
        switch (item.getDataType()) {
            case "user":
                return loadUserData(item.getEntityId());
            case "tenant":
                return loadTenantData(item.getEntityId());
            case "asset":
                return loadAssetData(item.getEntityId());
            default:
                return null;
        }
    }
    
    // 加载各类数据的具体实现
    private Object loadUserData(String userId) {
        // 实现从数据库加载用户数据
        return null;
    }
    
    private Object loadTenantData(String tenantId) {
        // 实现从数据库加载租户数据
        return null;
    }
    
    private Object loadAssetData(String assetId) {
        // 实现从数据库加载资产数据
        return null;
    }
}
```

## 10. 前端架构设计

### 10.1 技术栈选择

- **核心框架**: Vue.js 3.x (Composition API)
- **状态管理**: Pinia
- **路由管理**: Vue Router 4.x
- **UI组件库**: Arco Design
- **构建工具**: Vite
- **HTTP客户端**: Axios
- **国际化**: Vue I18n
- **数据可视化**: ECharts 5.x
- **WebSocket客户端**: Socket.IO Client

### 10.2 项目结构

```
frontend/
├── public/                       # 静态资源
├── src/
│   ├── api/                      # API请求
│   │   ├── modules/              # 按模块分类的API
│   │   ├── config.js             # API配置
│   │   └── request.js            # 请求封装
│   ├── assets/                   # 资源文件
│   │   ├── images/               # 图片
│   │   ├── styles/               # 样式
│   │   └── icons/                # SVG图标
│   ├── components/               # 通用组件
│   │   ├── common/               # 公共组件
│   │   ├── form/                 # 表单组件
│   │   ├── chart/                # 图表组件
│   │   └── layout/               # 布局组件
│   ├── directives/               # 自定义指令
│   ├── hooks/                    # 自定义Hooks
│   │   ├── useAuth.js            # 认证相关
│   │   ├── useTable.js           # 表格相关
│   │   ├── useForm.js            # 表单相关
│   │   └── useCache.js           # 缓存相关
│   ├── layouts/                  # 页面布局
│   │   ├── AdminLayout.vue       # 管理平台布局
│   │   ├── PublicLayout.vue      # 公共平台布局
│   │   └── AuthLayout.vue        # 认证页面布局
│   ├── modules/                  # 业务模块
│   │   ├── admin/                # 管理员平台
│   │   ├── public/               # 公共服务平台
│   │   └── property/             # 物业平台
│   ├── router/                   # 路由配置
│   │   ├── routes.js             # 路由定义
│   │   ├── guards.js             # 路由守卫
│   │   └── index.js              # 路由入口
│   ├── stores/                   # 状态管理
│   │   ├── modules/              # 模块化状态
│   │   └── index.js              # 状态入口
│   ├── utils/                    # 工具函数
│   │   ├── auth.js               # 认证工具
│   │   ├── date.js               # 日期工具
│   │   ├── formatter.js          # 格式化工具
│   │   └── validator.js          # 验证工具
│   ├── views/                    # 页面视图
│   │   ├── admin/                # 管理视图
│   │   ├── public/               # 公共视图
│   │   ├── property/             # 物业视图
│   │   └── common/               # 公共视图
│   ├── App.vue                   # 根组件
│   └── main.js                   # 入口文件
├── .env                          # 环境变量
├── .env.development              # 开发环境变量
├── .env.production               # 生产环境变量
├── package.json                  # 依赖配置
├── vite.config.js                # Vite配置
└── index.html                    # HTML模板
```

### 10.3 组件设计模式

遵循原子设计方法论，将UI组件分为：

1. **原子组件**：基础UI元素，如按钮、输入框、标签等
2. **分子组件**：由多个原子组合形成的组件，如表单项、卡片等
3. **有机体组件**：具有完整功能的UI部分，如用户列表、权限树等
4. **模板**：页面级组件的布局结构
5. **页面**：最终的用户界面

### 10.4 状态管理策略

```javascript
// 用户状态管理示例 (stores/modules/user.js)
import { defineStore } from 'pinia';
import { login, logout, getUserInfo } from '@/api/modules/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    tenantId: null,
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    hasPermission: (state) => (permission) => state.permissions.includes(permission),
    hasRole: (state) => (role) => state.roles.includes(role),
  },
  
  actions: {
    async login(credentials) {
      try {
        const { data } = await login(credentials);
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        await this.fetchUserInfo();
        return true;
      } catch (error) {
        return false;
      }
    },
    
    async fetchUserInfo() {
      try {
        const { data } = await getUserInfo();
        this.id = data.id;
        this.name = data.name;
        this.avatar = data.avatar;
        this.roles = data.roles;
        this.permissions = data.permissions;
        this.tenantId = data.tenantId;
        return data;
      } catch (error) {
        return null;
      }
    },
    
    async logout() {
      try {
        await logout();
      } finally {
        this.resetState();
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },
    
    resetState() {
      this.id = null;
      this.name = '';
      this.avatar = '';
      this.roles = [];
      this.permissions = [];
      this.tenantId = null;
      this.token = '';
      this.refreshToken = '';
    }
  }
});
```

### 10.5 响应式设计策略

遵循移动优先的响应式设计原则：

1. **基于断点的布局调整**：根据设备尺寸调整布局结构
2. **流式网格系统**：使用12/24列网格系统适应不同屏幕
3. **响应式组件设计**：组件内部结构随屏幕尺寸自适应
4. **媒体查询优化**：针对不同设备类型优化交互体验

## 11. 部署和DevOps流程

### 11.1 环境规划

| 环境 | 用途 | 配置策略 | 访问限制 |
|-----|-----|---------|---------|
| 开发环境 | 开发人员日常开发 | 最小配置，模拟数据 | 仅内网开发人员 |
| 测试环境 | 功能测试、集成测试 | 接近生产配置，测试数据 | 测试团队、开发团队 |
| 预生产环境 | 性能测试、验收测试 | 与生产环境一致 | 测试团队、核心开发人员 |
| 生产环境 | 线上运行 | 高可用配置 | 严格控制，运维团队 |

### 11.2 Kubernetes部署架构

```yaml
# Deployment示例 (deployment.yaml)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smartcampus-app
  namespace: smartcampus
spec:
  replicas: 3
  selector:
    matchLabels:
      app: smartcampus-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    metadata:
      labels:
        app: smartcampus-app
    spec:
      containers:
        - name: smartcampus-app
          image: ${REGISTRY}/smartcampus-app:${VERSION}
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1024Mi
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: ${ENVIRONMENT}
            - name: NACOS_HOST
              valueFrom:
                configMapKeyRef:
                  name: smartcampus-config
                  key: nacos.host
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 20
            periodSeconds: 10
          volumeMounts:
            - name: log-volume
              mountPath: /app/logs
      volumes:
        - name: log-volume
          persistentVolumeClaim:
            claimName: smartcampus-logs-pvc
```

### 11.3 CI/CD流水线

```yaml
# GitLab CI配置 (.gitlab-ci.yml)
stages:
  - build
  - test
  - quality
  - package
  - deploy

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"

# 构建阶段
build:
  stage: build
  image: maven:3.8-openjdk-11
  script:
    - mvn clean compile -DskipTests=true $MAVEN_OPTS
  cache:
    paths:
      - .m2/repository
  artifacts:
    paths:
      - target/

# 单元测试阶段
unit-test:
  stage: test
  image: maven:3.8-openjdk-11
  script:
    - mvn test $MAVEN_OPTS
  artifacts:
    reports:
      junit: target/surefire-reports/TEST-*.xml

# 代码质量分析
code-quality:
  stage: quality
  image: sonarsource/sonar-scanner-cli
  script:
    - sonar-scanner -Dsonar.projectKey=smartcampus -Dsonar.sources=src/main
  allow_failure: true

# 打包阶段
package:
  stage: package
  image: maven:3.8-openjdk-11
  script:
    - mvn package -DskipTests=true $MAVEN_OPTS
    - docker build -t ${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHA} .
    - docker push ${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHA}
  only:
    - main
    - develop

# 部署开发环境
deploy-dev:
  stage: deploy
  image: bitnami/kubectl
  script:
    - sed -i "s#\${REGISTRY}#${CI_REGISTRY_IMAGE}#g" kubernetes/dev/*.yaml
    - sed -i "s#\${VERSION}#${CI_COMMIT_SHA}#g" kubernetes/dev/*.yaml
    - sed -i "s#\${ENVIRONMENT}#dev#g" kubernetes/dev/*.yaml
    - kubectl apply -f kubernetes/dev/
  environment:
    name: development
    url: https://dev.smartcampus.example.com
  only:
    - develop

# 部署生产环境
deploy-prod:
  stage: deploy
  image: bitnami/kubectl
  script:
    - sed -i "s#\${REGISTRY}#${CI_REGISTRY_IMAGE}#g" kubernetes/prod/*.yaml
    - sed -i "s#\${VERSION}#${CI_COMMIT_SHA}#g" kubernetes/prod/*.yaml
    - sed -i "s#\${ENVIRONMENT}#prod#g" kubernetes/prod/*.yaml
    - kubectl apply -f kubernetes/prod/
  environment:
    name: production
    url: https://smartcampus.example.com
  when: manual
  only:
    - main
```

### 11.4 配置管理

```java
@EnableConfigurationProperties
@Configuration
public class NacosConfigConfiguration {
    @Bean
    public NacosConfigManager nacosConfigManager(
            @Value("${spring.cloud.nacos.config.server-addr}") String serverAddr,
            @Value("${spring.cloud.nacos.config.namespace}") String namespace) {
        NacosConfigProperties properties = new NacosConfigProperties();
        properties.setServerAddr(serverAddr);
        properties.setNamespace(namespace);
        return new NacosConfigManager(properties);
    }
    
    @Bean
    public ConfigService configService(NacosConfigManager nacosConfigManager) {
        return nacosConfigManager.getConfigService();
    }
}

// 动态配置使用示例
@RestController
@RequestMapping("/api/config")
public class DynamicConfigController {
    @Autowired
    private NacosConfigManager configManager;
    
    @NacosValue(value = "${smartcampus.feature.new-dashboard:false}", autoRefreshed = true)
    private boolean newDashboardEnabled;
    
    @GetMapping("/features")
    public Map<String, Object> getFeatureFlags() {
        Map<String, Object> features = new HashMap<>();
        features.put("newDashboard", newDashboardEnabled);
        // 其他特性开关...
        return features;
    }
    
    @PutMapping("/features/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public void updateFeature(@PathVariable String key, @RequestBody Map<String, Boolean> payload) throws NacosException {
        Boolean value = payload.get("value");
        if (value != null) {
            configManager.getConfigService().publishConfig(
                "smartcampus-config.properties", 
                "DEFAULT_GROUP",
                "smartcampus.feature." + key + "=" + value
            );
        }
    }
}
```

## 12. 异常处理和错误码体系

### 12.1 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException ex) {
        log.warn("业务异常: {}", ex.getMessage());
        return Result.error(ex.getCode(), ex.getMessage());
    }
    
    @ExceptionHandler(ValidationException.class)
    public Result<?> handleValidationException(ValidationException ex) {
        log.warn("参数验证异常: {}", ex.getMessage());
        return Result.error(ErrorCode.PARAM_ERROR, ex.getMessage());
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public Result<?> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("访问拒绝异常: {}", ex.getMessage());
        return Result.error(ErrorCode.ACCESS_DENIED, "没有足够权限执行此操作");
    }
    
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception ex) {
        log.error("未预期的异常", ex);
        return Result.error(ErrorCode.SYSTEM_ERROR, "系统异常，请联系管理员");
    }
}
```

### 12.2 标准错误码定义

```java
public class ErrorCode {
    // 成功
    public static final int SUCCESS = 200;
    
    // 客户端错误 (400-499)
    public static final int BAD_REQUEST = 400;           // 请求参数错误
    public static final int UNAUTHORIZED = 401;          // 未认证
    public static final int ACCESS_DENIED = 403;         // 无权限
    public static final int NOT_FOUND = 404;             // 资源不存在
    public static final int METHOD_NOT_ALLOWED = 405;    // 请求方法不允许
    public static final int PARAM_ERROR = 460;           // 参数验证失败
    public static final int USER_ERROR = 461;            // 用户相关错误
    public static final int TOKEN_EXPIRED = 462;         // 令牌过期
    public static final int TOKEN_INVALID = 463;         // 令牌无效
    
    // 服务端错误 (500-599)
    public static final int SYSTEM_ERROR = 500;          // 系统内部错误
    public static final int SERVICE_UNAVAILABLE = 503;   // 服务不可用
    public static final int GATEWAY_ERROR = 504;         // 网关错误
    
    // 业务错误 (600-699)
    public static final int BUSINESS_ERROR = 600;        // 通用业务错误
    public static final int DATA_NOT_FOUND = 601;        // 数据不存在
    public static final int DATA_CONFLICT = 602;         // 数据冲突
    public static final int OPERATION_FAILED = 603;      // 操作失败
    
    // 集成错误 (700-799)
    public static final int INTEGRATION_ERROR = 700;     // 集成服务通用错误
    public static final int API_GATEWAY_ERROR = 701;     // API网关错误
    public static final int EXTERNAL_SERVICE_ERROR = 702; // 外部服务错误
    public static final int PAYMENT_ERROR = 710;         // 支付服务错误
}
```

### 12.3 统一响应结构

```java
@Data
public class Result<T> {
    private int code;         // 状态码
    private String message;   // 提示信息
    private T data;           // 响应数据
    private long timestamp;   // 时间戳
    
    public Result() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.setCode(ErrorCode.SUCCESS);
        result.setMessage("操作成功");
        return result;
    }
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(ErrorCode.SUCCESS);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }
    
    public static <T> Result<T> error(int code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }
    
    public static <T> Result<T> error(String message) {
        return error(ErrorCode.BUSINESS_ERROR, message);
    }
}
```

### 12.4 异常处理的AOP实现

```java
@Aspect
@Component
public class ExceptionLoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(ExceptionLoggingAspect.class);
    
    @Pointcut("execution(* com.smartcampus.*.api.controller.*.*(..))")
    public void apiPointcut() {}
    
    @Pointcut("execution(* com.smartcampus.*.service.*.*(..))")
    public void servicePointcut() {}
    
    @AfterThrowing(pointcut = "apiPointcut() || servicePointcut()", throwing = "ex")
    public void logException(JoinPoint jp, Exception ex) {
        // 获取方法签名和参数
        String className = jp.getTarget().getClass().getName();
        String methodName = jp.getSignature().getName();
        Object[] args = jp.getArgs();
        
        // 敏感信息脱敏
        Object[] maskedArgs = maskSensitiveInfo(args);
        
        // 记录异常日志
        if (ex instanceof BusinessException) {
            BusinessException bex = (BusinessException) ex;
            log.warn("业务异常 - 类: {}, 方法: {}, 参数: {}, 错误码: {}, 消息: {}", 
                     className, methodName, Arrays.toString(maskedArgs), 
                     bex.getCode(), bex.getMessage());
        } else {
            log.error("系统异常 - 类: {}, 方法: {}, 参数: {}, 异常类型: {}, 消息: {}", 
                     className, methodName, Arrays.toString(maskedArgs), 
                     ex.getClass().getName(), ex.getMessage(), ex);
        }
    }
    
    /**
     * 对敏感信息进行脱敏处理
     */
    private Object[] maskSensitiveInfo(Object[] args) {
        if (args == null) {
            return new Object[0];
        }
        
        Object[] maskedArgs = new Object[args.length];
        for (int i = 0; i < args.length; i++) {
            Object arg = args[i];
            if (arg == null) {
                maskedArgs[i] = null;
            } else if (arg instanceof String && isSensitive((String) arg)) {
                maskedArgs[i] = maskString((String) arg);
            } else {
                maskedArgs[i] = arg;
            }
        }
        return maskedArgs;
    }
    
    /**
     * 判断是否是敏感信息
     */
    private boolean isSensitive(String str) {
        // 手机号、身份证、密码等敏感信息判断
        return str.contains("password") || 
               str.matches("\\d{11}") ||  // 手机号
               str.matches("\\d{17}[0-9X]"); // 身份证
    }
    
    /**
     * 对字符串进行脱敏处理
     */
    private String maskString(String str) {
        if (str.length() <= 3) {
            return "***";
        }
        int len = str.length();
        return str.substring(0, 1) + "****" + str.substring(len - 2);
    }
}
```

## 13. 从模块化单体架构到微服务的演进路径

### 13.1 演进阶段

智慧园区系统的演进将遵循渐进式策略，主要分为以下三个阶段：

#### 阶段一：维持模块化单体架构
- **时间范围**：项目启动后1-1.5年
- **特点**：
  - 保持模块化单体架构，但进一步强化模块间的隔离
  - 实施内部模块API严格化管理
  - 引入异步消息机制减少模块间耦合
  - 建立可观测性基础设施

#### 阶段二：共享数据库微服务
- **时间范围**：1.5-2.5年
- **特点**：
  - 将核心业务模块拆分为独立部署的微服务
  - 仍然共享同一个物理数据库，但使用不同Schema
  - 引入API网关进行服务路由
  - 实施统一认证和服务注册发现
  - 建立CI/CD管道支持独立服务部署

#### 阶段三：完全独立的微服务
- **时间范围**：2.5年以后
- **特点**：
  - 服务完全独立，每个微服务拥有自己的数据库
  - 实施领域驱动的服务边界划分
  - 采用分布式事务处理跨服务业务流程
  - 完全容器化和云原生架构
  - 实施成熟的DevOps流程和SRE实践

### 13.2 演进过程中的关键考量

#### 13.2.1 API稳定性保障

在服务拆分过程中，保持API稳定性是关键：

- **API版本控制**：所有公共API都实施严格的版本控制
- **兼容性测试**：引入自动化API兼容性测试
- **契约优先设计**：采用OpenAPI规范定义服务契约
- **变更影响分析**：建立API依赖关系图，评估变更影响范围

#### 13.2.2 数据一致性策略

随着从共享数据库到分库架构的转变，数据一致性策略需要相应调整：

- **阶段一**：主要依赖数据库事务
- **阶段二**：引入本地事务表和可靠事件模式
- **阶段三**：实施Saga模式和最终一致性策略

#### 13.2.3 性能监控与优化

服务拆分会引入新的性能挑战，需要全方位监控：

- **服务调用链追踪**：采用分布式追踪技术监控调用关系
- **性能基准测试**：针对关键流程建立性能基准和SLA
- **性能测试自动化**：定期执行自动化性能测试
- **资源使用率监控**：监控各服务的资源使用率和瓶颈

#### 13.2.4 团队结构调整

架构演进需要相应的团队结构调整：

- **阶段一**：按功能模块划分团队，强调模块接口规范化
- **阶段二**：形成跨功能特性团队，负责特定服务端到端交付
- **阶段三**：完全自治的服务团队，拥有服务的全生命周期责任

### 13.3 分阶段实施计划

#### 13.3.1 前期准备工作

在正式开始架构演进前，需要完成以下准备工作：

1. **服务依赖关系梳理**：明确模块间的调用关系和数据依赖
2. **API清单整理**：建立完整的内部API清单
3. **数据访问模式分析**：识别跨模块数据访问模式
4. **性能基准建立**：对核心业务流程进行性能测试，建立基准
5. **监控体系搭建**：部署完整的可观测性平台

#### 13.3.2 第一批服务拆分计划

在阶段二开始时，优先拆分以下服务:

1. **用户认证服务**：相对独立，外部系统依赖少
2. **租户管理服务**：核心基础服务，变动频率低
3. **文件存储服务**：技术性服务，业务逻辑简单
4. **通知服务**：自包含能力，集成外部系统

#### 13.3.3 数据拆分策略

在向完全独立微服务演进过程中，数据拆分策略如下：

1. **识别聚合根**：基于DDD原则识别主要聚合根
2. **确定数据所有权**：明确哪个服务是特定数据的所有者
3. **定义读取模式**：区分CQRS中的命令和查询模式
4. **数据复制策略**：设计数据同步和一致性机制

### 13.4 风险管理

在架构演进过程中，需重点关注以下风险：

1. **服务粒度过细**：导致"分布式单体"，增加系统复杂性
   - **缓解措施**：遵循领域驱动设计原则，合理划分服务边界

2. **分布式事务复杂性**：跨服务事务增加出错可能性
   - **缓解措施**：尽量避免跨服务事务，采用基于补偿的Saga模式

3. **运维复杂度增加**：服务数量增多导致部署和监控挑战
   - **缓解措施**：投资自动化运维工具，采用容器编排平台

4. **性能下降**：网络调用增加可能导致整体性能下降
   - **缓解措施**：合理使用缓存，实施API网关聚合，监控服务间调用

5. **版本依赖冲突**：服务间依赖版本不一致导致兼容性问题
   - **缓解措施**：严格的API版本控制，兼容性测试自动化





