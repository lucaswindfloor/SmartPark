
# 智慧园区综合管理平台 - 信息公开子模块系统设计文档

## 1. 模块概述

### 1.1 模块边界

#### 功能范围
信息公开子模块负责园区各类信息的发布、管理与交互，涵盖以下功能点：
- 通知公告管理：发布和管理园区通知公告
- 政策文件管理：发布和管理园区政策文件
- 园区活动管理：发布、组织和管理园区活动及报名
- 调查问卷管理：创建、发布问卷及结果统计分析
- 需求发布管理：审核和发布企业需求信息

#### 技术边界
- 前端：Vue 3 + Composition API + Arco Design
- 后端：Spring Boot 2.7 + MyBatis-Plus
- 数据存储：MySQL + Redis缓存
- 文件存储：MinIO分布式文件系统
- 搜索引擎：Elasticsearch实现全文检索
- 定时任务：Spring Task处理信息自动归档

#### 与其他模块的关系
- 用户模块：获取用户信息、权限控制
- 企业模块：获取企业信息，确定信息接收范围
- 消息模块：发送通知提醒和消息推送
- 文件模块：处理文档和附件上传存储
- 工作流模块：审核流程的定义和执行

### 1.2 技术架构

#### 模块内部架构
信息公开模块采用分层架构：
1. **控制层(Controller)**：处理HTTP请求，参数校验，权限控制
2. **服务层(Service)**：实现业务逻辑，事务控制
3. **数据访问层(Repository)**：负责数据持久化操作
4. **领域模型层(Domain)**：业务实体和值对象
5. **基础设施层(Infrastructure)**：提供缓存、搜索、存储等基础服务

#### 组件划分
1. **公告管理组件(NotificationManager)**：处理通知公告的CRUD和状态管理
2. **政策文件组件(PolicyDocumentManager)**：处理政策文件的管理和版本控制
3. **活动管理组件(ActivityManager)**：处理活动发布、报名和统计
4. **问卷管理组件(SurveyManager)**：处理问卷设计、发布和结果分析
5. **需求发布组件(DemandManager)**：处理需求审核和发布
6. **信息审核组件(ContentApprover)**：跨类型的信息审核流程处理
7. **受众管理组件(AudienceManager)**：管理信息发布的受众范围
8. **统计分析组件(StatisticsAnalyzer)**：提供信息阅读和交互数据分析

#### 关键技术选择
- **内容富文本编辑**：TinyMCE编辑器
- **附件上传处理**：基于MinIO的分布式文件存储
- **全文检索**：Elasticsearch实现跨信息类型的内容搜索
- **缓存策略**：Redis缓存热点通知和文件
- **实时通知**：WebSocket实现新信息推送
- **文档转换**：POI处理Office文档在线预览
- **问卷引擎**：自研轻量问卷表单引擎

### 1.3 用例与功能映射

#### 需求到功能的映射
| 需求类别 | 核心用例 | 实现组件 | 优先级 |
|---------|---------|---------|-------|
| 通知公告管理 | 创建、审核、发布、查询通知 | NotificationManager | P0 |
| 政策文件管理 | 上传、分类、检索、版本控制 | PolicyDocumentManager | P0 |
| 活动管理 | 活动创建、报名、签到、统计 | ActivityManager | P1 |
| 问卷管理 | 问卷设计、数据收集、结果分析 | SurveyManager | P2 |
| 需求发布 | 需求审核、匹配、推送 | DemandManager | P2 |
| 信息审核流程 | 内容审核、流程控制 | ContentApprover | P0 |
| 信息发布范围 | 受众定义、权限管理 | AudienceManager | P1 |
| 信息阅读统计 | 阅读量统计、反馈收集 | StatisticsAnalyzer | P2 |

#### 业务场景覆盖分析
关键业务场景：
1. **通知发布流程**：创建草稿→提交审核→审核通过→发布通知→用户接收
2. **政策查阅流程**：上传政策→分类索引→用户检索→查看下载→阅读反馈
3. **活动管理流程**：创建活动→发布报名→用户报名→签到参与→数据统计
4. **问卷调查流程**：设计问卷→发布问卷→用户填写→数据收集→结果分析
5. **需求对接流程**：提交需求→审核发布→匹配推荐→响应对接→跟踪反馈

#### 非功能需求实现映射
| 非功能需求 | 实现策略 | 关键组件 |
|-----------|---------|---------|
| 性能要求 | 多级缓存、索引优化、分页查询 | RedisCacheManager, ElasticsearchService |
| 可用性 | 主从复制、读写分离、熔断降级 | MySQLReplicaConfig, CircuitBreakerService |
| 安全性 | 权限控制、内容审核、操作审计 | SecurityFilter, AuditLogger |
| 可扩展性 | 模块化设计、事件驱动、插件机制 | EventPublisher, PluginManager |
| 可维护性 | 统一异常处理、全面日志记录 | GlobalExceptionHandler, LogAspect |

## 2. 核心功能实现设计

### 2.1 业务流程实现

#### 流程设计图
**通知公告发布流程**：
```
[草稿创建] → [内容编辑] → [附件上传] → [受众设置] → [提交审核] → 
[审核处理] → [审核通过/驳回] → [定时发布] → [消息推送] → [阅读统计]
```

**政策文件管理流程**：
```
[文件上传] → [元数据编辑] → [分类标签] → [审核流程] → 
[版本管理] → [发布可见] → [检索下载] → [使用反馈]
```

**活动管理流程**：
```
[活动创建] → [详情编辑] → [资源预定] → [审核发布] → 
[开放报名] → [名额管理] → [提醒通知] → [签到管理] → [活动总结]
```

**问卷调查流程**：
```
[问卷设计] → [题目配置] → [逻辑设置] → [审核发布] → 
[数据收集] → [数据验证] → [统计分析] → [结果展示]
```

#### 状态转换实现
**通知公告状态机**：
```
初始状态: [草稿]
转换规则:
  [草稿] --提交审核--> [待审核]
  [待审核] --审核通过--> [待发布]
  [待审核] --审核拒绝--> [已驳回]
  [已驳回] --编辑修改--> [草稿]
  [待发布] --定时发布--> [已发布]
  [待发布] --立即发布--> [已发布]
  [已发布] --置顶操作--> [已置顶]
  [已发布] --到期归档--> [已归档]
  [已置顶] --取消置顶--> [已发布]
  [已发布] --手动撤回--> [已撤回]
```

**活动状态机**：
```
初始状态: [草稿]
转换规则:
  [草稿] --提交审核--> [待审核]
  [待审核] --审核通过--> [待开始]
  [待审核] --审核拒绝--> [已驳回]
  [已驳回] --编辑修改--> [草稿]
  [待开始] --开放报名--> [报名中]
  [报名中] --报名结束--> [报名截止]
  [报名中] --名额已满--> [报名截止]
  [报名截止] --活动开始--> [进行中]
  [进行中] --活动结束--> [已结束]
  [已结束] --总结上传--> [已完成]
  [任意状态] --取消活动--> [已取消]
```

#### 业务规则引擎设计
使用Drools规则引擎实现复杂业务规则：

1. **通知优先级规则**：
```
规则："紧急通知发送"
条件：通知.紧急级别 == "紧急" AND 通知.状态 == "已发布"
动作：
  1. 发送系统内实时提醒
  2. 推送APP消息
  3. 可选发送短信提醒
```

2. **内容审核规则**：
```
规则："敏感内容检测"
条件：内容.文本包含(敏感词列表) OR 内容.图片未通过AI审核
动作：
  1. 标记为"需人工审核"
  2. 记录敏感内容位置
  3. 通知管理员审核
```

3. **活动报名规则**：
```
规则："企业优先报名"
条件：活动.类型 == "企业扶持" AND 用户.企业等级 >= "A级"
动作：
  1. 优先分配报名名额
  2. 提前24小时开放报名
  3. 允许超额10%的报名人数
```

### 2.2 数据处理流程

#### 数据验证策略
实现多级数据验证机制：

1. **前端验证**：
   - 表单字段实时验证（必填、格式、长度等）
   - 使用Vuelidate进行表单验证
   - 图片预览和大小检查
   - 富文本内容格式检查

2. **API层验证**：
   - 使用Spring Validation注解进行参数校验
   - 自定义验证注解处理特殊业务规则
   - 请求头和认证信息验证
   - 接口访问频率控制

3. **业务层验证**：
   - 业务规则完整性检查
   - 对象间关系和一致性验证
   - 数据状态和流转合法性验证
   - 敏感词过滤和内容审核

4. **数据库约束**：
   - 字段非空、唯一性约束
   - 外键关系约束
   - 状态枚举值约束
   - 日期范围合法性约束

#### 业务处理逻辑
以通知发布为例的业务处理流程：

```java
@Service
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private AttachmentService attachmentService;
    
    @Autowired
    private AudienceService audienceService;
    
    @Autowired
    private ContentAuditService auditService;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    @Transactional
    public NotificationDTO createNotification(NotificationCreateRequest request) {
        // 1. 数据验证
        validateNotificationData(request);
        
        // 2. 构建通知对象
        Notification notification = buildNotificationFromRequest(request);
        notification.setStatus(NotificationStatus.DRAFT);
        notification.setCreateTime(LocalDateTime.now());
        
        // 3. 保存通知基本信息
        notification = notificationRepository.save(notification);
        
        // 4. 处理附件
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            List<Attachment> attachments = attachmentService.saveAttachments(
                request.getAttachments(), 
                notification.getId(),
                AttachmentType.NOTIFICATION
            );
            notification.setAttachments(attachments);
        }
        
        // 5. 设置受众范围
        audienceService.setNotificationAudience(
            notification.getId(), 
            request.getAudienceType(),
            request.getAudienceIds()
        );
        
        // 6. 记录操作日志
        eventPublisher.publishEvent(new NotificationCreatedEvent(notification));
        
        // 7. 返回结果
        return convertToDTO(notification);
    }
    
    @Transactional
    public NotificationDTO submitForApproval(Long notificationId) {
        // 1. 获取通知
        Notification notification = getNotificationById(notificationId);
        
        // 2. 验证状态
        if (notification.getStatus() != NotificationStatus.DRAFT 
                && notification.getStatus() != NotificationStatus.REJECTED) {
            throw new InvalidOperationException("只有草稿或已驳回状态的通知可以提交审核");
        }
        
        // 3. 内容审核预检
        ContentAuditResult auditResult = auditService.preAudit(notification.getContent());
        if (auditResult.isSensitiveContentDetected()) {
            // 记录敏感内容
            notification.setSensitiveContent(auditResult.getSensitiveDetails());
        }
        
        // 4. 更新状态
        notification.setStatus(NotificationStatus.PENDING_APPROVAL);
        notification.setSubmitTime(LocalDateTime.now());
        notification = notificationRepository.save(notification);
        
        // 5. 创建审核任务
        auditService.createAuditTask(notification.getId(), AuditType.NOTIFICATION);
        
        // 6. 发送审核通知
        messageService.sendMessage(
            MessageType.SYSTEM,
            getRoleUsers("NOTIFICATION_APPROVER"),
            "新的通知待审核",
            String.format("通知「%s」已提交审核，请及时处理", notification.getTitle())
        );
        
        // 7. 记录操作日志
        eventPublisher.publishEvent(new NotificationSubmittedEvent(notification));
        
        // 8. 返回结果
        return convertToDTO(notification);
    }
    
    // 其他方法省略...
}
```

#### 数据转换实现
数据转换层设计：

1. **DTO转换类**：
```java
@Component
public class NotificationConverter {
    
    @Autowired
    private AttachmentConverter attachmentConverter;
    
    @Autowired
    private UserService userService;
    
    public NotificationDTO toDTO(Notification entity) {
        if (entity == null) {
            return null;
        }
        
        NotificationDTO dto = new NotificationDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setSummary(entity.getSummary());
        dto.setType(entity.getType());
        dto.setStatus(entity.getStatus());
        dto.setImportanceLevel(entity.getImportanceLevel());
        dto.setIsTop(entity.getIsTop());
        dto.setTopExpireTime(entity.getTopExpireTime());
        dto.setPublishTime(entity.getPublishTime());
        dto.setEffectiveStartTime(entity.getEffectiveStartTime());
        dto.setEffectiveEndTime(entity.getEffectiveEndTime());
        dto.setViewCount(entity.getViewCount());
        
        // 转换发布人信息
        UserDTO publisher = userService.getUserById(entity.getPublisherId());
        dto.setPublisher(publisher);
        
        // 转换附件列表
        if (entity.getAttachments() != null) {
            dto.setAttachments(entity.getAttachments().stream()
                .map(attachmentConverter::toDTO)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public Notification toEntity(NotificationCreateRequest request) {
        if (request == null) {
            return null;
        }
        
        Notification entity = new Notification();
        entity.setTitle(request.getTitle());
        entity.setContent(request.getContent());
        entity.setSummary(request.getSummary());
        entity.setType(request.getType());
        entity.setImportanceLevel(request.getImportanceLevel());
        entity.setIsTop(request.getIsTop());
        entity.setTopExpireTime(request.getTopExpireTime());
        entity.setEffectiveStartTime(request.getEffectiveStartTime());
        entity.setEffectiveEndTime(request.getEffectiveEndTime());
        entity.setPublisherId(request.getPublisherId());
        entity.setPublisherName(request.getPublisherName());
        
        return entity;
    }
}
```

2. **数据过滤转换**：
```java
@Component
public class NotificationFilter {
    
    public NotificationListDTO filterForListView(Notification notification) {
        NotificationListDTO dto = new NotificationListDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setSummary(notification.getSummary());
        dto.setType(notification.getType());
        dto.setStatus(notification.getStatus());
        dto.setIsTop(notification.getIsTop());
        dto.setPublishTime(notification.getPublishTime());
        dto.setPublisherName(notification.getPublisherName());
        dto.setViewCount(notification.getViewCount());
        
        // 只返回附件数量，不返回附件详情
        dto.setAttachmentCount(notification.getAttachments() != null ? 
                              notification.getAttachments().size() : 0);
        
        return dto;
    }
    
    public NotificationDetailDTO filterForDetailView(Notification notification, 
                                                    boolean isAdmin) {
        NotificationDetailDTO dto = new NotificationDetailDTO();
        // 基本字段拷贝
        BeanUtils.copyProperties(notification, dto);
        
        // 管理员可以看到所有字段
        if (isAdmin) {
            dto.setSensitiveContent(notification.getSensitiveContent());
            dto.setRejectionReason(notification.getRejectionReason());
            dto.setCreatorId(notification.getCreatorId());
            dto.setCreateTime(notification.getCreateTime());
            dto.setUpdateTime(notification.getUpdateTime());
        }
        
        return dto;
    }
}
```

### 2.3 异常处理

#### 业务异常分类
异常体系设计：

```java
// 基础异常
public class InfoPublishBaseException extends RuntimeException {
    private String errorCode;
    private Object[] args;
    
    // 构造函数、getter和setter省略
}

// 资源不存在异常
public class InfoResourceNotFoundException extends InfoPublishBaseException {
    public InfoResourceNotFoundException(String resourceType, Long resourceId) {
        super(String.format("%s with id %d not found", resourceType, resourceId));
        setErrorCode("error.resource.notFound");
        setArgs(new Object[]{resourceType, resourceId});
    }
}

// 状态操作异常
public class InvalidStatusOperationException extends InfoPublishBaseException {
    public InvalidStatusOperationException(String resourceType, String currentStatus, 
                                         String operation) {
        super(String.format("Cannot perform %s on %s with status %s", 
                          operation, resourceType, currentStatus));
        setErrorCode("error.status.invalidOperation");
        setArgs(new Object[]{operation, resourceType, currentStatus});
    }
}

// 内容审核异常
public class ContentAuditException extends InfoPublishBaseException {
    private ContentAuditResult auditResult;
    
    public ContentAuditException(String message, ContentAuditResult auditResult) {
        super(message);
        this.auditResult = auditResult;
        setErrorCode("error.content.audit");
        setArgs(new Object[]{auditResult.getSensitiveCount()});
    }
    
    public ContentAuditResult getAuditResult() {
        return auditResult;
    }
}

// 权限不足异常
public class PermissionDeniedException extends InfoPublishBaseException {
    public PermissionDeniedException(String userId, String requiredPermission) {
        super(String.format("User %s does not have required permission: %s", 
                          userId, requiredPermission));
        setErrorCode("error.permission.denied");
        setArgs(new Object[]{userId, requiredPermission});
    }
}
```

#### 异常捕获与处理
全局异常处理机制：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @Autowired
    private MessageSource messageSource;
    
    @ExceptionHandler(InfoPublishBaseException.class)
    public ResponseEntity<ApiErrorResponse> handleInfoPublishException(
            InfoPublishBaseException ex, Locale locale) {
        log.error("Information publishing exception: {}", ex.getMessage(), ex);
        
        String errorMessage = messageSource.getMessage(
            ex.getErrorCode(), ex.getArgs(), ex.getMessage(), locale);
        
        ApiErrorResponse error = new ApiErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            errorMessage,
            ex.getErrorCode(),
            LocalDateTime.now()
        );
        
        if (ex instanceof InfoResourceNotFoundException) {
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } else if (ex instanceof PermissionDeniedException) {
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } else if (ex instanceof ContentAuditException) {
            ContentAuditResult auditResult = ((ContentAuditException) ex).getAuditResult();
            error.setAdditionalData(auditResult);
            return new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_ENTITY);
        } else {
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, Locale locale) {
        log.error("Validation exception: {}", ex.getMessage());
        
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        Map<String, String> validationErrors = fieldErrors.stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                error -> messageSource.getMessage(error, locale)
            ));
        
        ApiErrorResponse error = new ApiErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            "error.validation",
            LocalDateTime.now()
        );
        error.setValidationErrors(validationErrors);
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception ex, Locale locale) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        
        ApiErrorResponse error = new ApiErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            "error.unexpected",
            LocalDateTime.now()
        );
        
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

#### 错误恢复机制
错误恢复和补偿机制：

1. **幂等性设计**：
```java
@Service
public class NotificationPublishService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Transactional
    public void publishNotification(Long notificationId, String requestId) {
        // 使用Redis实现幂等控制
        String idempotencyKey = "notification:publish:" + requestId;
        Boolean isFirstExecution = redisTemplate.opsForValue()
            .setIfAbsent(idempotencyKey, notificationId.toString(), Duration.ofHours(24));
        
        // 如果不是第一次执行，直接返回
        if (Boolean.FALSE.equals(isFirstExecution)) {
            log.info("Duplicate publish request with id: {}, skipped", requestId);
            return;
        }
        
        try {
            Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new InfoResourceNotFoundException("Notification", notificationId));
            
            // 检查状态
            if (notification.getStatus() != NotificationStatus.APPROVED) {
                throw new InvalidStatusOperationException("Notification", 
                    notification.getStatus().name(), "publish");
            }
            
            // 发布逻辑
            notification.setStatus(NotificationStatus.PUBLISHED);
            notification.setPublishTime(LocalDateTime.now());
            notificationRepository.save(notification);
            
            // 发送消息通知
            sendNotifications(notification);
            
        } catch (Exception e) {
            // 出现异常，删除幂等键，允许重试
            redisTemplate.delete(idempotencyKey);
            throw e;
        }
    }
    
    // 其他方法省略...
}
```

2. **失败重试机制**：
```java
@Component
public class PublishRetryManager {
    
    private static final Logger log = LoggerFactory.getLogger(PublishRetryManager.class);
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private NotificationPublishService publishService;
    
    @Scheduled(fixedDelay = 300000) // 5分钟检查一次
    public void retryFailedPublish() {
        log.info("Checking for failed publish tasks...");
        
        // 查找状态为PUBLISH_FAILED的通知
        List<Notification> failedNotifications = notificationRepository
            .findByStatusAndRetryCountLessThan(
                NotificationStatus.PUBLISH_FAILED, 
                3 // 最多重试3次
            );
        
        for (Notification notification : failedNotifications) {
            try {
                log.info("Retrying publish for notification id: {}, retry count: {}", 
                       notification.getId(), notification.getRetryCount());
                
                // 更新重试次数
                notification.setRetryCount(notification.getRetryCount() + 1);
                notificationRepository.save(notification);
                
                // 重新发布
                publishService.publishNotification(
                    notification.getId(), 
                    "retry-" + UUID.randomUUID().toString()
                );
                
                log.info("Retry successful for notification id: {}", notification.getId());
                
            } catch (Exception e) {
                log.error("Retry failed for notification id: {}", notification.getId(), e);
                
                // 如果已经达到最大重试次数，标记为需要人工处理
                if (notification.getRetryCount() >= 3) {
                    notification.setStatus(NotificationStatus.PUBLISH_ERROR);
                    notification.setErrorMessage("Maximum retry count reached: " + e.getMessage());
                    notificationRepository.save(notification);
                    
                    // 发送告警通知给管理员
                    sendAlertToAdmin(notification, e);
                }
            }
        }
    }
    
    private void sendAlertToAdmin(Notification notification, Exception e) {
        // 告警通知实现省略
    }
}
```

#### 异常监控与分析
异常监控实现：

```java
@Component
@Aspect
public class ExceptionMonitorAspect {
    
    private static final Logger log = LoggerFactory.getLogger(ExceptionMonitorAspect.class);
    
    @Autowired
    private MetricsService metricsService;
    
    @Autowired
    private AlertService alertService;
    
    @AfterThrowing(pointcut = "execution(* com.smartpark.service.infopublish..*.*(..))", 
                   throwing = "ex")
    public void logException(JoinPoint jp, Exception ex) {
        // 获取方法信息
        String methodName = jp.getSignature().toShortString();
        String exceptionType = ex.getClass().getSimpleName();
        
        // 记录异常指标
        metricsService.incrementCounter(
            "info_publish_exceptions",
            Map.of(
                "method", methodName,
                "exceptionType", exceptionType
            )
        );
        
        // 记录详细日志
        log.error("Exception in info publishing module: {} - {}", 
                methodName, ex.getMessage(), ex);
        
        // 分析关键异常并告警
        if (isKeyException(ex)) {
            alertService.sendAlert(
                AlertLevel.ERROR,
                "InfoPublish Exception",
                String.format("Critical exception in method %s: %s", 
                            methodName, ex.getMessage()),
                Map.of("stackTrace", ExceptionUtils.getStackTrace(ex))
            );
        }
    }
    
    private boolean isKeyException(Exception ex) {
        // 判断是否为关键异常
        return ex instanceof ContentAuditException ||
               ex instanceof SystemIntegrationException ||
               (ex instanceof InfoPublishBaseException && 
                ((InfoPublishBaseException) ex).isCritical());
    }
}
```

### 2.4 流程优化点

#### 业务瓶颈识别
已识别的性能瓶颈点：

1. **大量通知同时发布**：高峰期（如上午9点）大量通知同时发布导致系统负载高
2. **富文本内容处理**：富文本内容包含大量图片时的处理和存储效率低
3. **附件上传与处理**：大文件上传和文件格式转换处理耗时长
4. **复杂受众筛选**：针对特定条件的受众筛选查询复杂度高
5. **高频内容搜索**：全文检索在数据量大时响应慢

#### 流程优化策略
针对性优化措施：

1. **通知发布优化**：
   - 实现发布队列，控制并发发布数量
   - 按优先级调度发布任务
   - 大范围通知采用批处理方式异步发送

```java
@Component
public class NotificationPublishQueue {
    
    private static final Logger log = LoggerFactory.getLogger(NotificationPublishQueue.class);
    
    // 使用优先级队列，按通知紧急程度排序
    private final PriorityBlockingQueue<PublishTask> publishQueue = 
        new PriorityBlockingQueue<>(100, Comparator.comparing(PublishTask::getPriority).reversed());
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private ThreadPoolTaskExecutor publishExecutor;
    
    @PostConstruct
    public void init() {
        // 启动消费线程
        for (int i = 0; i < 3; i++) {
            publishExecutor.execute(this::processPublishQueue);
        }
    }
    
    public void addPublishTask(Long notificationId, int priority) {
        publishQueue.offer(new PublishTask(notificationId, priority));
        log.info("Added notification to publish queue: {}, priority: {}", 
               notificationId, priority);
    }
    
    private void processPublishQueue() {
        while (true) {
            try {
                PublishTask task = publishQueue.take();
                log.info("Processing publish task: {}", task.getNotificationId());
                
                notificationService.publishNotification(
                    task.getNotificationId(),
                    "queue-" + UUID.randomUUID().toString()
                );
                
                // 控制发布速率，避免系统过载
                Thread.sleep(200);
                
            } catch (InterruptedException e) {
                log.error("Publish queue processing interrupted", e);
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                log.error("Error processing publish task", e);
                // 错误处理，记录失败任务
            }
        }
    }
    
    @Data
    @AllArgsConstructor
    static class PublishTask {
        private Long notificationId;
        private int priority; // 优先级：1-5，5最高
    }
}
```

2. **内容处理优化**：
   - 图片压缩和延迟加载
   - 富文本内容缓存
   - 图片使用OSS对象存储，避免数据库存储

3. **文件处理优化**：
   - 分片上传大文件
   - 按需转换文件格式
   - 文件预览缓存

```java
@Service
public class FileOptimizationService {
    
    @Autowired
    private MinioClient minioClient;
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public String optimizeAndStoreImage(MultipartFile imageFile) throws Exception {
        // 图片压缩
        byte[] optimizedImageData = compressImage(imageFile.getBytes(),
                                               ImageFormat.JPEG,
                                               0.8f);  // 80%质量
        
        // 生成唯一文件名
        String fileName = "images/" + UUID.randomUUID() + ".jpg";
        
        // 上传到MinIO
        try (ByteArrayInputStream bis = new ByteArrayInputStream(optimizedImageData)) {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket("smartpark-public")
                    .object(fileName)
                    .contentType("image/jpeg")
                    .stream(bis, optimizedImageData.length, -1)
                    .build()
            );
        }
        
        // 返回文件访问URL
        return "/api/public/files/" + fileName;
    }

```java
    private byte[] compressImage(byte[] imageData, ImageFormat format, float quality) {
        // 图片压缩实现
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageData));
            
            // 判断是否需要调整尺寸
            int maxWidth = 1920;
            int maxHeight = 1080;
            if (originalImage.getWidth() > maxWidth || originalImage.getHeight() > maxHeight) {
                originalImage = resizeImage(originalImage, maxWidth, maxHeight);
            }
            
            // 压缩图片
            ImageWriteParam iwp = getImageWriteParam(format, quality);
            ImageWriter writer = ImageIO.getImageWritersByFormatName(format.name().toLowerCase()).next();
            
            writer.setOutput(ImageIO.createImageOutputStream(outputStream));
            writer.write(null, new IIOImage(originalImage, null, null), iwp);
            writer.dispose();
            
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to compress image", e);
        }
    }
}
```

4. **受众筛选优化**：
   - 创建受众索引表和缓存
   - 离线计算常用受众组
   - 分区分批获取受众列表

```java
@Component
public class AudienceOptimizer {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private EnterpriseRepository enterpriseRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Scheduled(cron = "0 0 1 * * ?") // 每天凌晨1点更新
    public void updateAudienceCache() {
        log.info("Starting audience cache update");
        
        // 更新企业用户映射
        Map<Long, List<Long>> enterpriseUsers = new HashMap<>();
        userRepository.findAllWithEnterpriseId().forEach(user -> {
            if (user.getEnterpriseId() != null) {
                enterpriseUsers.computeIfAbsent(user.getEnterpriseId(), k -> new ArrayList<>())
                    .add(user.getId());
            }
        });
        
        // 更新部门用户映射
        Map<Long, List<Long>> departmentUsers = new HashMap<>();
        userRepository.findAllWithDepartmentId().forEach(user -> {
            if (user.getDepartmentId() != null) {
                departmentUsers.computeIfAbsent(user.getDepartmentId(), k -> new ArrayList<>())
                    .add(user.getId());
            }
        });
        
        // 缓存企业用户映射
        redisTemplate.opsForHash().putAll("audience:enterprise_users", enterpriseUsers);
        
        // 缓存部门用户映射
        redisTemplate.opsForHash().putAll("audience:department_users", departmentUsers);
        
        // 缓存常用受众组
        cacheCommonAudienceGroups();
        
        log.info("Audience cache update completed");
    }
    
    @SuppressWarnings("unchecked")
    public List<Long> getAudienceUserIds(AudienceType type, List<Long> targetIds) {
        String cacheKey = "audience:" + type.name().toLowerCase() + ":" 
                        + String.join("_", targetIds.stream().map(String::valueOf).toList());
        
        // 尝试从缓存获取
        List<Long> cachedUserIds = (List<Long>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedUserIds != null) {
            return cachedUserIds;
        }
        
        // 缓存未命中，根据类型查询
        List<Long> userIds = switch (type) {
            case ALL -> userRepository.findAllUserIds();
            case ENTERPRISE -> {
                List<Long> result = new ArrayList<>();
                for (Long enterpriseId : targetIds) {
                    List<Long> users = (List<Long>) redisTemplate.opsForHash()
                        .get("audience:enterprise_users", enterpriseId);
                    if (users != null) {
                        result.addAll(users);
                    }
                }
                yield result;
            }
            case DEPARTMENT -> {
                List<Long> result = new ArrayList<>();
                for (Long departmentId : targetIds) {
                    List<Long> users = (List<Long>) redisTemplate.opsForHash()
                        .get("audience:department_users", departmentId);
                    if (users != null) {
                        result.addAll(users);
                    }
                }
                yield result;
            }
            case USER -> targetIds;
            default -> Collections.emptyList();
        };
        
        // 缓存查询结果(10分钟)
        redisTemplate.opsForValue().set(cacheKey, userIds, Duration.ofMinutes(10));
        
        return userIds;
    }
}
```

#### 自动化提升点
流程自动化优化：

1. **智能内容审核**：
   - 基于AI实现自动敏感内容检测
   - 自动文本摘要生成
   - 辅助标签推荐系统

```java
@Service
public class AutoContentAuditService {
    
    @Autowired
    private SensitiveWordFilter sensitiveWordFilter;
    
    @Autowired
    private TextSummaryService summaryService;
    
    @Autowired
    private ImageSafetyService imageSafetyService;
    
    public ContentAuditResult auditContent(String content, List<MultipartFile> images) {
        ContentAuditResult result = new ContentAuditResult();
        
        // 敏感词过滤
        Set<String> detectedWords = sensitiveWordFilter.detectSensitiveWords(content);
        result.setSensitiveWords(detectedWords);
        
        // 提取文本摘要
        if (StringUtils.isNotBlank(content) && content.length() > 200) {
            String summary = summaryService.generateSummary(content, 150);
            result.setSuggestedSummary(summary);
        }
        
        // 图片安全检查
        if (images != null && !images.isEmpty()) {
            Map<String, ImageSafetyResult> imageResults = new HashMap<>();
            
            for (MultipartFile image : images) {
                try {
                    ImageSafetyResult safetyResult = imageSafetyService.checkImage(image.getBytes());
                    if (!safetyResult.isSafe()) {
                        imageResults.put(image.getOriginalFilename(), safetyResult);
                    }
                } catch (IOException e) {
                    log.error("Failed to check image safety: {}", image.getOriginalFilename(), e);
                }
            }
            
            result.setUnsafeImages(imageResults);
        }
        
        // 设置综合审核结果
        result.setSafe(detectedWords.isEmpty() && (result.getUnsafeImages() == null || 
                                                result.getUnsafeImages().isEmpty()));
        
        return result;
    }
    
    public List<String> suggestTags(String content, String title) {
        // 基于内容和标题智能推荐标签
        Set<String> tags = new HashSet<>();
        
        // 基于关键词提取推荐标签
        tags.addAll(keywordExtractor.extractKeywords(title, 3));
        tags.addAll(keywordExtractor.extractKeywords(content, 5));
        
        // 基于分类模型推荐
        tags.addAll(contentClassifier.classify(content));
        
        return new ArrayList<>(tags);
    }
}
```

2. **发布调度自动化**：
   - 智能发布时间推荐
   - 受众覆盖率分析
   - 通知效果预测

```java
@Service
public class PublishScheduleOptimizer {
    
    @Autowired
    private PublishAnalyticsRepository analyticsRepository;
    
    public PublishScheduleRecommendation recommendPublishTime(
            NotificationType type, AudienceType audienceType) {
        
        PublishScheduleRecommendation recommendation = new PublishScheduleRecommendation();
        
        // 分析历史数据，查找最佳发布时间
        List<PublishAnalytics> analytics = analyticsRepository
            .findTopPerformingByTypeAndAudience(type, audienceType);
        
        // 提取工作日模式
        Map<DayOfWeek, List<LocalTime>> bestTimesByDay = analytics.stream()
            .filter(a -> a.getViewRate() > 0.4) // 40%以上查看率
            .collect(Collectors.groupingBy(
                a -> a.getPublishTime().getDayOfWeek(),
                Collectors.mapping(a -> a.getPublishTime().toLocalTime(), Collectors.toList())
            ));
        
        // 计算每天的最佳时间段
        Map<DayOfWeek, List<TimeRange>> bestTimeRanges = new HashMap<>();
        for (Map.Entry<DayOfWeek, List<LocalTime>> entry : bestTimesByDay.entrySet()) {
            bestTimeRanges.put(entry.getKey(), identifyTimeRanges(entry.getValue()));
        }
        
        recommendation.setBestTimeRanges(bestTimeRanges);
        
        // 确定当前最佳发布时间
        LocalDateTime now = LocalDateTime.now();
        DayOfWeek today = now.getDayOfWeek();
        
        if (bestTimeRanges.containsKey(today)) {
            List<TimeRange> todayRanges = bestTimeRanges.get(today);
            
            // 找到当天剩余的最近时间段
            Optional<TimeRange> nextRange = todayRanges.stream()
                .filter(r -> r.getStart().isAfter(now.toLocalTime()))
                .min(Comparator.comparing(TimeRange::getStart));
            
            if (nextRange.isPresent()) {
                LocalDateTime recommendedTime = LocalDateTime.of(
                    now.toLocalDate(), 
                    nextRange.get().getStart().plusMinutes(15) // 选择时间段开始后15分钟
                );
                recommendation.setRecommendedTime(recommendedTime);
            } else {
                // 如果当天没有合适时间段，推荐第二天的第一个时间段
                recommendation.setRecommendedTime(findNextDayFirstSlot(now, bestTimeRanges));
            }
        } else {
            // 如果当天没有数据，寻找下一个有数据的工作日
            recommendation.setRecommendedTime(findNextDayFirstSlot(now, bestTimeRanges));
        }
        
        return recommendation;
    }
    
    private List<TimeRange> identifyTimeRanges(List<LocalTime> times) {
        // 聚类分析，识别时间段
        // 实现省略...
        return timeRanges;
    }
    
    private LocalDateTime findNextDayFirstSlot(LocalDateTime now, 
                                             Map<DayOfWeek, List<TimeRange>> bestTimeRanges) {
        // 寻找下一个可用的日期和时间段
        // 实现省略...
        return nextSlotDateTime;
    }
}
```

3. **内容个性化推荐**：
   - 基于用户历史行为的信息推荐
   - 相似内容自动关联
   - 热点信息智能置顶

## 3. 数据持久化设计

### 3.1 数据模型

#### 实体关系图
信息公开模块核心实体关系：

```
Notification(通知公告) --1:N--> NotificationAttachment(通知附件)
Notification --1:N--> NotificationAudience(通知受众)
Notification --1:N--> NotificationReadRecord(阅读记录)
Notification --1:1--> NotificationAuditRecord(审核记录)

PolicyDocument(政策文件) --1:N--> PolicyDocumentVersion(文件版本)
PolicyDocument --1:N--> PolicyDocumentTag(政策标签)
PolicyDocument --1:N--> DocumentReadRecord(文档阅读记录)

Activity(园区活动) --1:N--> ActivityRegistration(活动报名)
Activity --1:N--> ActivityAttachment(活动附件)
Activity --1:1--> ActivitySummary(活动总结)

Survey(调查问卷) --1:N--> SurveyQuestion(问卷问题)
SurveyQuestion --1:N--> SurveyQuestionOption(问题选项)
Survey --1:N--> SurveyResponse(问卷回答)
SurveyResponse --1:N--> SurveyAnswerRecord(答题记录)

Demand(企业需求) --1:N--> DemandResponse(需求响应)
Demand --1:N--> DemandAttachment(需求附件)
```

#### 数据库表设计
核心表结构设计：

1. **通知公告表(notification)**
```sql
CREATE TABLE `notification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `title` varchar(200) NOT NULL COMMENT '通知标题',
  `content` text NOT NULL COMMENT '通知内容',
  `summary` varchar(500) DEFAULT NULL COMMENT '通知摘要',
  `type_id` bigint(20) NOT NULL COMMENT '通知类型ID',
  `importance_level` tinyint(4) NOT NULL DEFAULT '3' COMMENT '重要程度:1-特急,2-紧急,3-普通',
  `publisher_id` bigint(20) NOT NULL COMMENT '发布人ID',
  `publisher_name` varchar(50) NOT NULL COMMENT '发布人姓名',
  `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `updater_id` bigint(20) NOT NULL COMMENT '更新人ID',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态:0-草稿,1-待审核,2-已驳回,3-待发布,4-已发布,5-已撤回,6-已归档',
  `is_top` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否置顶',
  `top_expire_time` datetime DEFAULT NULL COMMENT '置顶到期时间',
  `effective_start_time` datetime DEFAULT NULL COMMENT '生效开始时间',
  `effective_end_time` datetime DEFAULT NULL COMMENT '生效结束时间',
  `audience_type` tinyint(4) DEFAULT NULL COMMENT '受众类型:1-全部,2-部门,3-企业,4-用户,5-角色',
  `submit_time` datetime DEFAULT NULL COMMENT '提交审核时间',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `auditor_id` bigint(20) DEFAULT NULL COMMENT '审核人ID',
  `auditor_name` varchar(50) DEFAULT NULL COMMENT '审核人姓名',
  `rejection_reason` varchar(500) DEFAULT NULL COMMENT '驳回原因',
  `view_count` int(11) NOT NULL DEFAULT '0' COMMENT '查看次数',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `sensitive_content` text DEFAULT NULL COMMENT '敏感内容',
  `retry_count` int(11) DEFAULT '0' COMMENT '重试次数',
  `error_message` varchar(500) DEFAULT NULL COMMENT '错误信息',
  PRIMARY KEY (`id`),
  KEY `idx_type_status` (`type_id`, `status`),
  KEY `idx_publisher` (`publisher_id`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_publish_time` (`publish_time`),
  KEY `idx_status_top` (`status`, `is_top`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知公告表';
```

2. **通知附件表(notification_attachment)**
```sql
CREATE TABLE `notification_attachment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '附件ID',
  `notification_id` bigint(20) NOT NULL COMMENT '通知ID',
  `file_name` varchar(200) NOT NULL COMMENT '文件名',
  `file_path` varchar(500) NOT NULL COMMENT '文件路径',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小(字节)',
  `file_type` varchar(50) NOT NULL COMMENT '文件类型',
  `upload_time` datetime NOT NULL COMMENT '上传时间',
  `uploader_id` bigint(20) NOT NULL COMMENT '上传人ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_notification_id` (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知附件表';
```

3. **通知受众表(notification_audience)**
```sql
CREATE TABLE `notification_audience` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `notification_id` bigint(20) NOT NULL COMMENT '通知ID',
  `audience_type` tinyint(4) NOT NULL COMMENT '受众类型:1-全部,2-部门,3-企业,4-用户,5-角色',
  `target_id` bigint(20) DEFAULT NULL COMMENT '目标ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_notification_id` (`notification_id`),
  KEY `idx_target` (`audience_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知受众表';
```

4. **通知阅读记录表(notification_read_record)**
```sql
CREATE TABLE `notification_read_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `notification_id` bigint(20) NOT NULL COMMENT '通知ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `read_time` datetime NOT NULL COMMENT '阅读时间',
  `device_type` tinyint(4) DEFAULT NULL COMMENT '设备类型:1-Web,2-Android,3-iOS',
  `ip_address` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notification_user` (`notification_id`, `user_id`),
  KEY `idx_user_read_time` (`user_id`, `read_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知阅读记录表';
```

5. **通知类型表(notification_type)**
```sql
CREATE TABLE `notification_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '类型ID',
  `type_name` varchar(50) NOT NULL COMMENT '类型名称',
  `type_code` varchar(50) NOT NULL COMMENT '类型编码',
  `icon` varchar(200) DEFAULT NULL COMMENT '图标',
  `color` varchar(20) DEFAULT NULL COMMENT '颜色',
  `requires_audit` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否需要审核',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `updater_id` bigint(20) NOT NULL COMMENT '更新人ID',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_type_code` (`type_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知类型表';
```

6. **政策文件表(policy_document)**
```sql
CREATE TABLE `policy_document` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `document_title` varchar(200) NOT NULL COMMENT '文件标题',
  `document_number` varchar(100) DEFAULT NULL COMMENT '文件编号',
  `issuing_authority` varchar(100) DEFAULT NULL COMMENT '发文机构',
  `issue_date` date DEFAULT NULL COMMENT '发文日期',
  `document_level` tinyint(4) DEFAULT NULL COMMENT '文件级别:1-国家级,2-省级,3-市级,4-区级,5-园区级',
  `document_type_id` bigint(20) NOT NULL COMMENT '文件类型ID',
  `summary` text DEFAULT NULL COMMENT '文件摘要',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态:0-草稿,1-待审核,2-已驳回,3-已发布,4-已过期',
  `publisher_id` bigint(20) NOT NULL COMMENT '发布人ID',
  `publisher_name` varchar(50) NOT NULL COMMENT '发布人姓名',
  `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
  `view_count` int(11) NOT NULL DEFAULT '0' COMMENT '查看次数',
  `download_count` int(11) NOT NULL DEFAULT '0' COMMENT '下载次数',
  `current_version_id` bigint(20) DEFAULT NULL COMMENT '当前版本ID',
  `effective_start_date` date DEFAULT NULL COMMENT '生效开始日期',
  `effective_end_date` date DEFAULT NULL COMMENT '生效结束日期',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `updater_id` bigint(20) NOT NULL COMMENT '更新人ID',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_document_type` (`document_type_id`),
  KEY `idx_status` (`status`),
  KEY `idx_publisher` (`publisher_id`),
  KEY `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策文件表';
```

7. **文件版本表(policy_document_version)**
```sql
CREATE TABLE `policy_document_version` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `document_id` bigint(20) NOT NULL COMMENT '文件ID',
  `version_number` varchar(20) NOT NULL COMMENT '版本号',
  `file_id` varchar(100) NOT NULL COMMENT '文件存储ID',
  `file_name` varchar(200) NOT NULL COMMENT '文件名',
  `file_path` varchar(500) NOT NULL COMMENT '文件路径',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小(字节)',
  `file_type` varchar(50) NOT NULL COMMENT '文件类型',
  `content_md5` varchar(32) DEFAULT NULL COMMENT '内容MD5',
  `version_desc` varchar(500) DEFAULT NULL COMMENT '版本说明',
  `uploader_id` bigint(20) NOT NULL COMMENT '上传人ID',
  `upload_time` datetime NOT NULL COMMENT '上传时间',
  `is_current` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否当前版本',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_document_id` (`document_id`),
  KEY `idx_is_current` (`document_id`, `is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件版本表';
```

8. **活动管理表(activity)**
```sql
CREATE TABLE `activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `activity_title` varchar(200) NOT NULL COMMENT '活动标题',
  `activity_type_id` bigint(20) NOT NULL COMMENT '活动类型ID',
  `content` text NOT NULL COMMENT '活动内容',
  `summary` varchar(500) DEFAULT NULL COMMENT '活动摘要',
  `location` varchar(200) DEFAULT NULL COMMENT '活动地点',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `registration_start_time` datetime DEFAULT NULL COMMENT '报名开始时间',
  `registration_end_time` datetime DEFAULT NULL COMMENT '报名截止时间',
  `max_participants` int(11) DEFAULT NULL COMMENT '最大参与人数',
  `current_participants` int(11) NOT NULL DEFAULT '0' COMMENT '当前参与人数',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态:0-草稿,1-待审核,2-已驳回,3-待开始,4-报名中,5-报名截止,6-进行中,7-已结束,8-已完成,9-已取消',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `creator_name` varchar(50) NOT NULL COMMENT '创建人姓名',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `updater_id` bigint(20) NOT NULL COMMENT '更新人ID',
  `contact_person` varchar(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `is_need_approval` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要审批',
  `is_free` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否免费',
  `fee_amount` decimal(10,2) DEFAULT NULL COMMENT '费用金额',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_activity_type` (`activity_type_id`),
  KEY `idx_status` (`status`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_end_time` (`end_time`),
  KEY `idx_registration_time` (`registration_start_time`, `registration_end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动管理表';
```

9. **活动报名表(activity_registration)**
```sql
CREATE TABLE `activity_registration` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `activity_id` bigint(20) NOT NULL COMMENT '活动ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `user_name` varchar(50) NOT NULL COMMENT '用户姓名',
  `enterprise_id` bigint(20) DEFAULT NULL COMMENT '企业ID',
  `enterprise_name` varchar(100) DEFAULT NULL COMMENT '企业名称',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(100) DEFAULT NULL COMMENT '电子邮箱',
  `position` varchar(50) DEFAULT NULL COMMENT '职位',
  `register_time` datetime NOT NULL COMMENT '报名时间',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态:0-待审核,1-已通过,2-已拒绝,3-已取消,4-已签到',
  `approval_time` datetime DEFAULT NULL COMMENT '审批时间',
  `approver_id` bigint(20) DEFAULT NULL COMMENT '审批人ID',
  `rejection_reason` varchar(500) DEFAULT NULL COMMENT '拒绝原因',
  `sign_in_time` datetime DEFAULT NULL COMMENT '签到时间',
  `additional_info` text DEFAULT NULL COMMENT '附加信息(JSON)',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_activity_user` (`activity_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_activity_status` (`activity_id`, `status`),
  KEY `idx_register_time` (`register_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动报名表';
```

10. **调查问卷表(survey)**
```sql
CREATE TABLE `survey` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '问卷ID',
  `title` varchar(200) NOT NULL COMMENT '问卷标题',
  `description` text DEFAULT NULL COMMENT '问卷说明',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `creator_name` varchar(50) NOT NULL COMMENT '创建人姓名',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `max_responses` int(11) DEFAULT NULL COMMENT '最大回答数',
  `current_responses` int(11) NOT NULL DEFAULT '0' COMMENT '当前回答数',
  `is_anonymous` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否匿名',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态:0-草稿,1-待审核,2-已驳回,3-进行中,4-已暂停,5-已结束',
  `audience_type` tinyint(4) DEFAULT NULL COMMENT '受众类型:1-全部,2-部门,3-企业,4-用户,5-角色',
  `submit_count` int(11) NOT NULL DEFAULT '0' COMMENT '提交次数',
  `view_count` int(11) NOT NULL DEFAULT '0' COMMENT '查看次数',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_creator` (`creator_id`),
  KEY `idx_status` (`status`),
  KEY `idx_time` (`start_time`, `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='调查问卷表';
```

11. **问卷问题表(survey_question)**
```sql
CREATE TABLE `survey_question` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '问题ID',
  `survey_id` bigint(20) NOT NULL COMMENT '问卷ID',
  `question_title` varchar(500) NOT NULL COMMENT '问题标题',
  `question_type` tinyint(4) NOT NULL COMMENT '问题类型:1-单选,2-多选,3-填空,4-评分,5-日期,6-时间,7-文件,8-图片',
  `is_required` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否必答',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `description` varchar(500) DEFAULT NULL COMMENT '问题说明',
  `min_value` int(11) DEFAULT NULL COMMENT '最小值(评分题)',
  `max_value` int(11) DEFAULT NULL COMMENT '最大值(评分题)',
  `min_select` int(11) DEFAULT NULL COMMENT '最少选择(多选题)',
  `max_select` int(11) DEFAULT NULL COMMENT '最多选择(多选题)',
  `validation_regex` varchar(200) DEFAULT NULL COMMENT '验证正则表达式',
  `validation_message` varchar(200) DEFAULT NULL COMMENT '验证提示信息',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_survey_id` (`survey_id`),
  KEY `idx_sort_order` (`survey_id`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='问卷问题表';
```

#### 字段定义与约束
核心约束说明：

1. **状态字段约束**
   - 所有状态字段(status)使用tinyint类型，有明确的枚举定义
   - 通过应用层状态机控制状态变更的有效性，保证状态流转正确
   - 通过数据库触发器记录状态变更历史

2. **日期时间约束**
   - 开始时间必须早于结束时间
   - 生效起始时间必须早于生效结束时间
   - 报名开始时间必须早于报名结束时间

```sql
-- 添加日期时间检查约束
ALTER TABLE `activity`
ADD CONSTRAINT `chk_activity_time` CHECK (`start_time` < `end_time`),
ADD CONSTRAINT `chk_registration_time` CHECK (`registration_start_time` < `registration_end_time`);

ALTER TABLE `notification`
ADD CONSTRAINT `chk_effective_time` CHECK (`effective_start_time` < `effective_end_time`);

ALTER TABLE `survey`
ADD CONSTRAINT `chk_survey_time` CHECK (`start_time` < `end_time`);
```

3. **唯一性约束**
   - 通知类型编码全局唯一
   - 用户对同一活动只能报名一次
   - 用户对同一通知只记录一条阅读记录

```sql
-- 添加唯一约束
ALTER TABLE `notification_type`
ADD CONSTRAINT `uk_type_code` UNIQUE (`type_code`);

ALTER TABLE `activity_registration`
ADD CONSTRAINT `uk_activity_user` UNIQUE (`activity_id`, `user_id`);

ALTER TABLE `notification_read_record`
ADD CONSTRAINT `uk_notification_user` UNIQUE (`notification_id`, `user_id`);
```

4. **引用完整性约束**
   - 使用外键确保数据引用完整性
   - 针对生产环境可能禁用外键，使用应用层保证完整性

```sql
-- 添加外键约束(示例)
ALTER TABLE `notification_attachment`
ADD CONSTRAINT `fk_notification_attachment` FOREIGN KEY (`notification_id`) 
REFERENCES `notification` (`id`) ON DELETE CASCADE;

ALTER TABLE `notification_audience`
ADD CONSTRAINT `fk_notification_audience` FOREIGN KEY (`notification_id`) 
REFERENCES `notification` (`id`) ON DELETE CASCADE;

ALTER TABLE `activity_registration`
ADD CONSTRAINT `fk_activity_registration` FOREIGN KEY (`activity_id`) 
REFERENCES `activity` (`id`) ON DELETE CASCADE;
```

### 3.2 数据访问

#### 数据访问模式
数据访问层设计：

1. **Repository接口设计**：
```java
// 通知公告数据访问接口
public interface NotificationRepository {
    // 基础CRUD方法
    Notification save(Notification notification);
    Optional<Notification> findById(Long id);
    Page<Notification> findAllByStatus(NotificationStatus status, Pageable pageable);
    List<Notification> findByTypeAndStatus(Long typeId, NotificationStatus status);
    
    // 高级查询方法
    Page<Notification> findByPublisherAndStatusIn(Long publisherId, List<NotificationStatus> statuses, Pageable pageable);
    Page<Notification> findEffectiveNotifications(LocalDateTime now, Pageable pageable);
    List<Notification> findExpiredTopNotifications(LocalDateTime now);
    List<Notification> findByStatusAndRetryCountLessThan(NotificationStatus status, int maxRetries);
    
    // 统计方法
    long countByTypeAndCreateTimeBetween(Long typeId, LocalDateTime startTime, LocalDateTime endTime);
    long countByStatusAndEffectiveDateBetween(NotificationStatus status, LocalDate start, LocalDate end);
    
    // 更新方法
    int updateStatus(Long id, NotificationStatus status);
    int incrementViewCount(Long id);
    int updateTopStatus(Long id, boolean isTop, LocalDateTime topExpireTime);
    
    // 批量操作
    List<Notification> findByIdIn(List<Long> ids);
    int deleteByIdIn(List<Long> ids);
    int batchUpdateStatus(List<Long> ids, NotificationStatus status);
}

// 活动管理数据访问接口
public interface ActivityRepository {
    // 基础CRUD方法
    Activity save(Activity activity);
    Optional<Activity> findById(Long id);
    Page<Activity> findAll(Pageable pageable);
    
    // 高级查询方法
    Page<Activity> findByStatusInAndStartTimeGreaterThan(List<ActivityStatus> statuses, LocalDateTime time, Pageable pageable);
    List<Activity> findByStatusAndStartTimeBetween(ActivityStatus status, LocalDateTime startRange, LocalDateTime endRange);
    List<Activity> findUpcomingActivities(LocalDateTime now, int limit);
    
    // 更新方法
    int updateStatus(Long id, ActivityStatus status);
    int incrementParticipantCount(Long id);
    int decrementParticipantCount(Long id);
    
    // 统计方法
    Map<ActivityStatus, Long> countByStatusGroupByStatus();
    long countByTypeAndTimeRange(Long typeId, LocalDateTime start, LocalDateTime end);
}
```

2. **MyBatis映射实现**：
```java
// 通知公告MyBatis映射
@Mapper
public interface NotificationMapper {
    @Insert("INSERT INTO notification (title, content, summary, type_id, importance_level, " +
            "publisher_id, publisher_name, status, is_top, top_expire_time, " +
            "effective_start_time, effective_end_time, audience_type, create_time, " +
            "update_time, creator_id, updater_id) " +
            "VALUES (#{title}, #{content}, #{summary}, #{typeId}, #{importanceLevel}, " +
            "#{publisherId}, #{publisherName}, #{status}, #{isTop}, #{topExpireTime}, " +
            "#{effectiveStartTime}, #{effectiveEndTime}, #{audienceType}, #{createTime}, " +
            "#{updateTime}, #{creatorId}, #{updaterId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Notification notification);
    
    @Select("SELECT * FROM notification WHERE id = #{id} AND is_deleted = 0")
    @Results(id = "notificationMap", value = {
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "title"),
        @Result(property = "content", column = "content"),
        @Result(property = "summary", column = "summary"),
        @Result(property = "typeId", column = "type_id"),
        @Result(property = "importanceLevel", column = "importance_level"),
        @Result(property = "publisherId", column = "publisher_id"),
        @Result(property = "publisherName", column = "publisher_name"),
        @Result(property = "publishTime", column = "publish_time"),
        @Result(property = "status", column = "status"),
        @Result(property = "isTop", column = "is_top"),
        @Result(property = "topExpireTime", column = "top_expire_time"),
        @Result(property = "effectiveStartTime", column = "effective_start_time"),
        @Result(property = "effectiveEndTime", column = "effective_end_time"),
        @Result(property = "audienceType", column = "audience_type"),
        @Result(property = "viewCount", column = "view_count"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "creatorId", column = "creator_id"),
        @Result(property = "updaterId", column = "updater_id"),
        @Result(property = "attachments", column = "id", 
                javaType = List.class, 
                many = @Many(select = "com.smartpark.mapper.NotificationAttachmentMapper.findByNotificationId"))
    })
    Notification findById(Long id);
    
    @Update("UPDATE notification SET view_count = view_count + 1 WHERE id = #{id}")
    int incrementViewCount(Long id);
    
    @Update("UPDATE notification SET status = #{status}, update_time = NOW() WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") int status);
    
    @Select({"<script>",
        "SELECT * FROM notification",
        "WHERE is_deleted = 0",
        "<if test='status != null'>",
        "  AND status = #{status}",
        "</if>",
        "<if test='typeId != null'>",
        "  AND type_id = #{typeId}",
        "</if>",
        "<if test='publisherId != null'>",
        "  AND publisher_id = #{publisherId}",
        "</if>",
        "<if test='keyword != null and keyword != \"\"'>",
        "  AND (title LIKE CONCAT('%', #{keyword}, '%') OR summary LIKE CONCAT('%', #{keyword}, '%'))",
        "</if>",
        "ORDER BY is_top DESC, create_time DESC",
        "LIMIT #{offset}, #{limit}",
        "</script>"})
    List<Notification> findByConditions(NotificationQuery query);
}
```

3. **Repository实现类**：
```java
@Repository
public class NotificationRepositoryImpl implements NotificationRepository {
    
    @Autowired
    private NotificationMapper notificationMapper;
    
    @Autowired
    private NotificationAudienceMapper audienceMapper;
    
    @Autowired
    private NotificationAttachmentMapper attachmentMapper;
    
    @Override
    public Notification save(Notification notification) {
        if (notification.getId() == null) {
            // 新增
            notification.setCreateTime(LocalDateTime.now());
            notification.setUpdateTime(LocalDateTime.now());
            notificationMapper.insert(notification);
            
            // 保存受众
            if (notification.getAudiences() != null && !notification.getAudiences().isEmpty()) {
                for (NotificationAudience audience : notification.getAudiences()) {
                    audience.setNotificationId(notification.getId());
                    audienceMapper.insert(audience);
                }
            }
            
            // 保存附件
            if (notification.getAttachments() != null && !notification.getAttachments().isEmpty()) {
                for (NotificationAttachment attachment : notification.getAttachments()) {
                    attachment.setNotificationId(notification.getId());
                    attachmentMapper.insert(attachment);
                }
            }
        } else {
            // 更新
            notification.setUpdateTime(LocalDateTime.now());
            notificationMapper.update(notification);
            
            // 更新受众(先删除后添加)
            audienceMapper.deleteByNotificationId(notification.getId());
            if (notification.getAudiences() != null && !notification.getAudiences().isEmpty()) {
                for (NotificationAudience audience : notification.getAudiences()) {
                    audience.setNotificationId(notification.getId());
                    audienceMapper.insert(audience);
                }
            }
            
            // 附件更新逻辑
            if (notification.getAttachments() != null) {
                List<NotificationAttachment> existingAttachments = 
                    attachmentMapper.findByNotificationId(notification.getId());
                
                // 找出需要删除的附件
                List<Long> existingIds = existingAttachments.stream()
                    .map(NotificationAttachment::getId)
                    .collect(Collectors.toList());
                
                List<Long> newIds = notification.getAttachments().stream()
                    .map(NotificationAttachment::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
                
                List<Long> toDeleteIds = existingIds.stream()
                    .filter(id -> !newIds.contains(id))
                    .collect(Collectors.toList());
                
                // 删除不再需要的附件
                if (!toDeleteIds.isEmpty()) {
                    attachmentMapper.deleteByIdIn(toDeleteIds);
                }
                
                // 保存新附件
                for (NotificationAttachment attachment : notification.getAttachments()) {
                    if (attachment.getId() == null) {
                        attachment.setNotificationId(notification.getId());
                        attachmentMapper.insert(attachment);
                    }
                }
            }
        }
        
        return notification;
    }
    
    @Override
    public Optional<Notification> findById(Long id) {
        Notification notification = notificationMapper.findById(id);
        return Optional.ofNullable(notification);
    }
    
    @Override
    public Page<Notification> findAllByStatus(NotificationStatus status, Pageable pageable) {
        // 获取总数
        long total = notificationMapper.countByStatus(status.getValue());
        
        // 获取分页数据
        List<Notification> content = notificationMapper.findByStatus(
            status.getValue(), 
            pageable.getOffset(), 
            pageable.getPageSize()
        );
        
        return new PageImpl<>(content, pageable, total);
    }
    
    // 其他方法实现省略...
}
```

#### 查询优化设计
为提高查询性能的设计：

1. **索引设计**：
```sql
-- 通知表索引
CREATE INDEX idx_type_status ON notification(type_id, status); -- 按类型和状态查询
CREATE INDEX idx_publisher ON notification(publisher_id); -- 按发布者查询
CREATE INDEX idx_create_time ON notification(create_time); -- 按创建时间查询
CREATE INDEX idx_publish_time ON notification(publish_time); -- 按发布时间查询
CREATE INDEX idx_status_top ON notification(status, is_top); -- 状态和置顶查询

-- 活动表索引
CREATE INDEX idx_activity_type ON activity(activity_type_id); -- 按活动类型查询
CREATE INDEX idx_status ON activity(status); -- 按状态查询
CREATE INDEX idx_start_time ON activity(start_time); -- 按开始时间查询
CREATE INDEX idx_end_time ON activity(end_time); -- 按结束时间查询
CREATE INDEX idx_registration_time ON activity(registration_start_time, registration_end_time); -- 报名时间查询

-- 活动报名表索引
CREATE INDEX idx_user_id ON activity_registration(user_id); -- 按用户查询
CREATE INDEX idx_activity_status ON activity_registration(activity_id, status); -- 活动状态查询
CREATE INDEX idx_register_time ON activity_registration(register_time); -- 报名时间查询
```

2. **查询优化策略**：
```java
@Repository
public class NotificationQueryOptimizer {
    
    @Autowired
    private NotificationMapper notificationMapper;
    
    @Autowired
    private NotificationESRepository esRepository;
    
    /**
     * 智能选择最优查询路径
     */
    public Page<NotificationDTO> findByConditions(NotificationQuery query, Pageable pageable) {
        // 根据查询条件决定使用数据库查询还是全文检索
        if (StringUtils.isNotBlank(query.getKeyword()) && query.getKeyword().length() > 3) {
            // 关键词查询使用Elasticsearch
            return findByFullTextSearch(query, pageable);
        } else if (query.getStatus() != null && query.getTypeId() != null) {
            // 明确的状态和类型过滤使用数据库索引
            return findByDatabase(query, pageable);
        } else if (query.getPublisherId() != null) {
            // 发布者查询使用数据库索引
            return findByPublisher(query, pageable);
        } else {
            // 其他情况视情况选择
            return findByDatabase(query, pageable);
        }
    }
    
    /**
     * 使用ElasticSearch全文检索
     */
    private Page<NotificationDTO> findByFullTextSearch(NotificationQuery query, Pageable pageable) {
        // 构建ES查询条件
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        
        // 关键词搜索
        if (StringUtils.isNotBlank(query.getKeyword())) {
            boolQuery.must(QueryBuilders.multiMatchQuery(query.getKeyword(),
                "title^3", "summary^2", "content"));
        }
        
        // 状态过滤
        if (query.getStatus() != null) {
            boolQuery.filter(QueryBuilders.termQuery("status", query.getStatus().getValue()));
        }
        
        // 类型过滤
        if (query.getTypeId() != null) {
            boolQuery.filter(QueryBuilders.termQuery("typeId", query.getTypeId()));
        }
        
        // 发布时间范围
        if (query.getStartTime() != null && query.getEndTime() != null) {
            boolQuery.filter(QueryBuilders.rangeQuery("publishTime")
                .gte(query.getStartTime())
                .lte(query.getEndTime()));
        }
        
        // 排序
        Sort sort = Sort.by(Sort.Direction.DESC, "isTop")
                .and(Sort.by(Sort.Direction.DESC, "publishTime"));
        
        // 执行查询
        Page<NotificationDocument> esResult = esRepository.search(
            boolQuery, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
        
        // 转换结果
        List<NotificationDTO> content = esResult.getContent().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return new PageImpl<>(content, pageable, esResult.getTotalElements());
    }
    
    /**
     * 使用数据库索引查询
     */
    private Page<NotificationDTO> findByDatabase(NotificationQuery query, Pageable pageable) {
        // 计算总数
        long total = notificationMapper.countByConditions(query);
        
        // 查询分页数据
        query.setOffset(pageable.getOffset());
        query.setLimit(pageable.getPageSize());
        List<Notification> notifications = notificationMapper.findByConditions(query);
        
        // 转换为DTO
        List<NotificationDTO> content = notifications.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return new PageImpl<>(content, pageable, total);
    }
    
    // 其他方法省略...
}
```

3. **分页查询优化**：
实现基于游标的分页查询，避免深分页问题：

```java
@Repository
public class ActivityBookmarkPagination {
    
    @Autowired
    private ActivityMapper activityMapper;
    
    /**
     * 基于书签的分页查询，解决深分页问题
     */
    public BookmarkPage<ActivityDTO> findByBookmark(ActivityQuery query, String bookmark, int pageSize) {
        // 解析书签
        BookmarkCursor cursor = parseBookmark(bookmark);
        
        // 查询比上次结果更新的数据
        List<Activity> activities;
        if (cursor == null) {
            // 首次查询
            activities = activityMapper.findFirstPage(query, pageSize);
        } else {
            // 基于游标查询下一页
            activities = activityMapper.findNextPage(
                query, 
                cursor.getLastId(), 
                cursor.getLastStartTime(),
                pageSize
            );
        }
        
        // 转换为DTO
        List<ActivityDTO> content = activities.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        // 生成下一页书签
        String nextBookmark = null;
        if (content.size() == pageSize) {
            Activity lastActivity = activities.get(activities.size() - 1);
            nextBookmark = generateBookmark(lastActivity.getId(), lastActivity.getStartTime());
        }
        
        return new BookmarkPage<>(content, nextBookmark, content.size() == pageSize);
    }
    
    /**
     * 生成书签
     */
    private String generateBookmark(Long lastId, LocalDateTime lastStartTime) {
        BookmarkCursor cursor = new BookmarkCursor(lastId, lastStartTime);
        return Base64.getEncoder().encodeToString(
            JsonUtils.toJson(cursor).getBytes(StandardCharsets.UTF_8));
    }
    
    /**
     * 解析书签
     */
    private BookmarkCursor parseBookmark(String bookmark) {
        if (StringUtils.isBlank(bookmark)) {
            return null;
        }
        
        try {
            String json = new String(
                Base64.getDecoder().decode(bookmark), StandardCharsets.UTF_8);
            return JsonUtils.fromJson(json, BookmarkCursor.class);
        } catch (Exception e) {
            log.error("Failed to parse bookmark", e);
            return null;
        }
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    static class BookmarkCursor {
        private Long lastId;
        private LocalDateTime lastStartTime;
    }
}
```

#### 事务管理策略
事务控制设计：

1. **声明式事务控制**：
```java
@Service
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private NotificationAudienceRepository audienceRepository;
    
    @Autowired
    private UserNotificationService userNotificationService;
    
    @Autowired
    private NotificationAuditService auditService;
    
    /**
     * 创建通知 - 需要事务保证通知和受众一致性
     */
    @Transactional
    public NotificationDTO createNotification(NotificationCreateRequest request) {
        // 构建通知对象
        Notification notification = convertFromRequest(request);
        
        // 保存通知
        notification = notificationRepository.save(notification);
        
        // 设置受众
        setNotificationAudience(notification.getId(), request.getAudienceType(), request.getAudienceIds());
        
        return convertToDTO(notification);
    }
    
    /**
     * 发布通知 - 需要事务保证发布状态和消息推送一致性
     */
    @Transactional
    public void publishNotification(Long id) {
        // 获取通知
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证状态
        if (notification.getStatus() != NotificationStatus.APPROVED) {
            throw new InvalidStatusException("Only approved notifications can be published");
        }
        
        // 更新状态
        notification.setStatus(NotificationStatus.PUBLISHED);
        notification.setPublishTime(LocalDateTime.now());
        notificationRepository.save(notification);
        
        // 获取受众列表
        List<Long> recipientIds = audienceRepository.findRecipientIdsByNotificationId(id);
        
        // 发送通知消息
        userNotificationService.sendNotificationToUsers(notification, recipientIds);
        
        // 记录操作日志
        auditService.recordPublishAudit(notification);
    }
    
    /**
     * 批量删除通知 - 使用事务确保批量操作的原子性
     */
    @Transactional
    public void batchDeleteNotifications(List<Long> ids) {
        // 批量删除通知及关联数据
        notificationRepository.deleteByIdIn(ids);
        audienceRepository.deleteByNotificationIdIn(ids);
        
        // 记录批量操作日志
        auditService.recordBatchDeleteAudit(ids);
    }
    
    /**
     * 只读事务 - 查询操作
     */
    @Transactional(readOnly = true)
    public Page<NotificationDTO> searchNotifications(NotificationQuery query, Pageable pageable) {
        return notificationRepository.findByConditions(query, pageable)
            .map(this::convertToDTO);
    }
}
```

2. **事务传播行为**：
```java
@Service
public class ActivityRegistrationService {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private ActivityRegistrationRepository registrationRepository;
    
    @Autowired
    private PaymentService paymentService;
    
    /**
     * 活动报名 - 如果是收费活动需要创建支付订单
     * 使用REQUIRES_NEW确保支付部分有独立事务
     */
    @Transactional
    public ActivityRegistrationDTO registerActivity(ActivityRegistrationRequest request) {
        // 查询活动
        Activity activity = activityRepository.findById(request.getActivityId())
            .orElseThrow(() -> new ResourceNotFoundException("Activity", request.getActivityId()));
        
        // 验证活动状态
        if (activity.getStatus() != ActivityStatus.REGISTRATION_OPEN) {
            throw new InvalidStatusException("Activity is not open for registration");
        }
        
        // 检查是否已报名
        if (registrationRepository.existsByActivityIdAndUserId(
                request.getActivityId(), request.getUserId())) {
            throw new DuplicateRegistrationException("User already registered for this activity");
        }
        
        // 检查名额
        if (activity.getCurrentParticipants() >= activity.getMaxParticipants()) {
            throw new ActivityFullException("Activity is already full");
        }
        
        // 创建报名记录
        ActivityRegistration registration = new ActivityRegistration();
        registration.setActivityId(request.getActivityId());
        registration.setUserId(request.getUserId());
        registration.setUserName(request.getUserName());
        registration.setEnterpriseId(request.getEnterpriseId());
        registration.setEnterpriseName(request.getEnterpriseName());
        registration.setPhone(request.getPhone());
        registration.setEmail(request.getEmail());
        registration.setPosition(request.getPosition());
        registration.setRegisterTime(LocalDateTime.now());
        registration.setStatus(ActivityRegistrationStatus.REGISTERED);
        registration.setAdditionalInfo(request.getAdditionalInfo());
        registration.setCreateTime(LocalDateTime.now());
        registration.setUpdateTime(LocalDateTime.now());
        
        registration = registrationRepository.save(registration);
        
        // 更新活动参与人数
        activityRepository.incrementParticipantCount(request.getActivityId());
        
        // 如果是收费活动，创建支付订单
        if (!activity.getIsFree() && activity.getFeeAmount() != null && activity.getFeeAmount().compareTo(BigDecimal.ZERO) > 0) {
            createPaymentOrder(activity, registration);
        }
        
        return convertToDTO(registration);
    }
    
    /**
     * 创建支付订单 - 使用新事务确保支付部分独立提交
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createPaymentOrder(Activity activity, ActivityRegistration registration) {
        try {
            PaymentOrderRequest paymentRequest = new PaymentOrderRequest();
            paymentRequest.setOrderType(OrderType.ACTIVITY_FEE);
            paymentRequest.setOrderAmount(activity.getFeeAmount());
            paymentRequest.setOrderTitle("活动费用-" + activity.getActivityTitle());
            paymentRequest.setUserId(registration.getUserId());
            paymentRequest.setRelatedId(registration.getId());
            
            PaymentOrderDTO paymentOrder = paymentService.createPaymentOrder(paymentRequest);
            
            // 更新报名记录关联的支付订单
            registration.setPaymentOrderId(paymentOrder.getId());
            registration.setPaymentStatus(PaymentStatus.PENDING);
            registrationRepository.updatePaymentInfo(
                registration.getId(), 
                paymentOrder.getId(), 
                PaymentStatus.PENDING
            );
            
        } catch (Exception e) {
            // 记录错误但不影响报名记录的创建
            log.error("Failed to create payment order for activity registration", e);
            
            // 标记报名记录为待支付
            registrationRepository.updatePaymentStatus(
                registration.getId(), 
                PaymentStatus.PAYMENT_REQUIRED
            );
        }
    }
}
```

3. **事务隔离级别**：
```java
@Service
public class SurveyResponseService {
    
    @Autowired
    private SurveyRepository surveyRepository;
    
    @Autowired
    private SurveyResponseRepository responseRepository;
    
    /**
     * 提交问卷回答 - 使用READ_COMMITTED隔离级别
     * 确保不会读取到其他事务未提交的数据，同时允许并发提交
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SurveyResponseDTO submitSurveyResponse(SurveyResponseRequest request) {
        // 查询问卷
        Survey survey = surveyRepository.findById(request.getSurveyId())
            .orElseThrow(() -> new ResourceNotFoundException("Survey", request.getSurveyId()));
        
        // 检查问卷状态
        if (survey.getStatus() != SurveyStatus.ACTIVE) {
            throw new InvalidStatusException("Survey is not active");
        }
        
        // 检查问卷是否已达最大回答数
        if (survey.getMaxResponses() != null && 
            survey.getCurrentResponses() >= survey.getMaxResponses()) {
            throw new SurveyFullException("Survey has reached maximum responses");
        }
        
        // 创建回答记录
        SurveyResponse response = new SurveyResponse();
        response.setSurveyId(request.getSurveyId());
        response.setRespondentId(request.getRespondentId());
        response.setRespondentName(request.getRespondentName());
        response.setSubmitTime(LocalDateTime.now());
        response.setIpAddress(request.getIpAddress());
        response.setDeviceInfo(request.getDeviceInfo());
        
        responseRepository.save(response);
        
        // 保存答案详情
        List<SurveyAnswerRecord> answerRecords = new ArrayList<>();
        for (AnswerRequest answer : request.getAnswers()) {
            SurveyAnswerRecord record = new SurveyAnswerRecord();
            record.setResponseId(response.getId());
            record.setQuestionId(answer.getQuestionId());
            record.setAnswerContent(answer.getAnswerContent());
            record.setOptionIds(answer.getOptionIds());
            
            answerRecords.add(record);
        }
        
        responseRepository.saveAnswerRecords(answerRecords);
        
        // 更新问卷回答数
        surveyRepository.incrementResponseCount(request.getSurveyId());
        
        return convertToDTO(response, answerRecords);
    }
    
    /**
     * 统计问卷结果 - 使用READ_COMMITTED确保读取到最新提交的数据
     */
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public SurveyStatisticsDTO getSurveyStatistics(Long surveyId) {
        // 查询问卷
        Survey survey = surveyRepository.findById(surveyId)
            .orElseThrow(() -> new ResourceNotFoundException("Survey", surveyId));
        
        // 获取问题列表
        List<SurveyQuestion> questions = surveyRepository.findQuestionsBySurveyId(surveyId);
        
        // 统计每个问题的答案
        List<QuestionStatistics> questionStats = new ArrayList<>();
        for (SurveyQuestion question : questions) {
            QuestionStatistics stats = new QuestionStatistics();
            stats.setQuestionId(question.getId());
            stats.setQuestionTitle(question.getQuestionTitle());
            stats.setQuestionType(question.getQuestionType());
            
            // 根据问题类型统计答案
            if (question.getQuestionType() == QuestionType.SINGLE_CHOICE || 
                question.getQuestionType() == QuestionType.MULTIPLE_CHOICE) {
                // 选择题统计选项分布
                Map<Long, Integer> optionCounts = 
                    responseRepository.countOptionSelections(question.getId());
                stats.setOptionStatistics(optionCounts);
            } else if (question.getQuestionType() == QuestionType.RATING) {
                // 评分题统计平均分和分布
                Double avgRating = responseRepository.calculateAverageRating(question.getId());
                Map<Integer, Integer> ratingDistribution = 
                    responseRepository.countRatingDistribution(question.getId());
                stats.setAverageRating(avgRating);
                stats.setRatingDistribution(ratingDistribution);
            } else if (question.getQuestionType() == QuestionType.TEXT) {
                // 文本题获取答案列表
                List<String> textAnswers = 
                    responseRepository.findTextAnswers(question.getId());
                stats.setTextAnswers(textAnswers);
            }
            
            questionStats.add(stats);
        }
        
        // 构建统计结果
        SurveyStatisticsDTO statistics = new SurveyStatisticsDTO();
        statistics.setSurveyId(surveyId);
        statistics.setSurveyTitle(survey.getTitle());
        statistics.setTotalResponses(survey.getCurrentResponses());
        statistics.setQuestionStatistics(questionStats);
        
        return statistics;
    }
}
```

### 3.3 缓存策略

#### 缓存位置与粒度
多级缓存设计：

1. **缓存配置**：
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        // Redis缓存配置
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))  // 默认缓存时间30分钟
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()))
            .disableCachingNullValues();
        
        // 针对不同对象类型配置不同的缓存策略
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // 通知列表缓存5分钟
        cacheConfigurations.put("notificationList", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // 通知详情缓存30分钟
        cacheConfigurations.put("notification", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // 活动列表缓存10分钟
        cacheConfigurations.put("activityList", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        // 活动详情缓存30分钟
        cacheConfigurations.put("activity", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // 字典数据缓存1小时
        cacheConfigurations.put("dict", defaultConfig.entryTtl(Duration.ofHours(1)));
        
        // 问卷统计结果缓存15分钟
        cacheConfigurations.put("surveyStats", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        return RedisCacheManager.builder(redisConnectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigurations)
            .build();
    }
    
    @Bean
    public CacheManager localCacheManager() {
        // Caffeine本地缓存配置
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(1000));
        
        return cacheManager;
    }
}
```

2. **缓存应用**：
```java
@Service
public class NotificationQueryService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private NotificationConverter converter;
    
    /**
     * 获取通知详情 - 使用Redis缓存
     */
    @Cacheable(value = "notification", key = "#id", unless = "#result == null")
    public NotificationDTO getNotificationById(Long id) {
        return notificationRepository.findById(id)
            .map(converter::toDTO)
            .orElse(null);
    }
    
    /**
     * 获取首页通知列表 - 使用Redis缓存
     */
    @Cacheable(value = "notificationList", key = "'home:' + #limit", unless = "#result.isEmpty()")
    public List<NotificationDTO> getHomePageNotifications(int limit) {
        return notificationRepository.findTopNotifications(limit).stream()
            .map(converter::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * 获取通知类型列表 - 使用本地缓存
     */
    @Cacheable(value = "dict", key = "'notificationTypes'", cacheManager = "localCacheManager")
    public List<DictDTO> getNotificationTypes() {
        return notificationRepository.findAllTypes().stream()
            .map(converter::toDictDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * 获取用户最新未读通知 - 不缓存
     */
    public List<NotificationDTO> getUserUnreadNotifications(Long userId) {
        return notificationRepository.findUnreadByUserId(userId).stream()
            .map(converter::toDTO)
            .collect(Collectors.toList());
    }
}

@Service
public class ActivityQueryService {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private ActivityConverter converter;
    
    /**
     * 获取活动详情 - 使用Redis缓存
     */
    @Cacheable(value = "activity", key = "#id", unless = "#result == null")
    public ActivityDTO getActivityById(Long id) {
        return activityRepository.findById(id)
            .map(converter::toDTO)
            .orElse(null);
    }
    
    /**
     * 获取正在进行的活动 - 使用Redis缓存
     */
    @Cacheable(value = "activityList", key = "'ongoing'", unless = "#result.isEmpty()")
    public List<ActivityDTO> getOngoingActivities() {
        return activityRepository.findOngoingActivities().stream()
            .map(converter::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * 获取即将开始的活动 - 使用Redis缓存
     */
    @Cacheable(value = "activityList", key = "'upcoming:' + #limit", unless = "#result.isEmpty()")
    public List<ActivityDTO> getUpcomingActivities(int limit) {
        return activityRepository.findUpcomingActivities(limit).stream()
            .map(converter::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * 获取用户报名的活动 - 不缓存
     */
    public List<ActivityDTO> getUserRegisteredActivities(Long userId) {
        return activityRepository.findRegisteredByUserId(userId).stream()
            .map(converter::toDTO)
            .collect(Collectors.toList());
    }
}
```

#### 缓存更新策略
缓存一致性管理：

1. **缓存清除策略**：
```java
@Service
public class NotificationManagementService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private CacheManager cacheManager;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    /**
     * 更新通知 - 清除相关缓存
     */
    @CacheEvict(value = "notification", key = "#id")
    @Transactional
    public NotificationDTO updateNotification(Long id, NotificationUpdateRequest request) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 更新字段
        if (StringUtils.isNotBlank(request.getTitle())) {
            notification.setTitle(request.getTitle());
        }
        
        if (StringUtils.isNotBlank(request.getContent())) {
            notification.setContent(request.getContent());
        }
        
        if (request.getType() != null) {
            notification.setType(request.getType());
        }
        
        if (request.getImportance() != null) {
            notification.setImportance(request.getImportance());
        }
        
        if (request.getExpirationDate() != null) {
            notification.setExpirationDate(request.getExpirationDate());
        }
        
        if (request.getTargetAudience() != null) {
            notification.setTargetAudience(request.getTargetAudience());
        }
        
        if (request.getAttachments() != null) {
            notification.setAttachments(request.getAttachments());
        }
        
        notification.setUpdateTime(LocalDateTime.now());
        notification.setUpdateBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        // 发布通知更新事件
        eventPublisher.publishEvent(new NotificationUpdatedEvent(saved));
        
        return NotificationConverter.toDTO(saved);
    }
    
    /**
     * 审核通知
     */
    @Transactional
    public NotificationDTO reviewNotification(Long id, NotificationReviewRequest request) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证当前状态
        if (notification.getStatus() != NotificationStatus.PENDING_REVIEW) {
            throw new BusinessException("通知不在待审核状态，无法进行审核操作");
        }
        
        // 验证审核权限
        if (!securityService.hasReviewPermission(notification.getImportance())) {
            throw new AccessDeniedException("没有审核此重要级别通知的权限");
        }
        
        // 更新审核状态
        if (request.isApproved()) {
            notification.setStatus(NotificationStatus.PENDING_PUBLISH);
            notification.setReviewComment(request.getComment());
        } else {
            notification.setStatus(NotificationStatus.REJECTED);
            notification.setReviewComment(request.getComment());
        }
        
        notification.setReviewTime(LocalDateTime.now());
        notification.setReviewBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        // 发布审核事件
        NotificationReviewedEvent event = new NotificationReviewedEvent(
            saved.getId(), 
            saved.getStatus(),
            saved.getCreatedBy(),
            request.isApproved()
        );
        eventPublisher.publishEvent(event);
        
        return NotificationConverter.toDTO(saved);
    }
    
    /**
     * 发布通知
     */
    @Transactional
    public NotificationDTO publishNotification(Long id, NotificationPublishRequest request) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证当前状态
        if (notification.getStatus() != NotificationStatus.PENDING_PUBLISH) {
            throw new BusinessException("通知不在待发布状态，无法进行发布操作");
        }
        
        // 设置发布参数
        if (request.getPublishTime() != null && request.getPublishTime().isAfter(LocalDateTime.now())) {
            // 定时发布
            notification.setStatus(NotificationStatus.SCHEDULED);
            notification.setScheduledPublishTime(request.getPublishTime());
            schedulerService.scheduleNotificationPublish(notification.getId(), request.getPublishTime());
        } else {
            // 立即发布
            notification.setStatus(NotificationStatus.PUBLISHED);
            notification.setPublishTime(LocalDateTime.now());
        }
        
        notification.setIsTop(request.isTop());
        notification.setPublishBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        // 如果是立即发布，则推送通知
        if (saved.getStatus() == NotificationStatus.PUBLISHED) {
            pushNotificationToUsers(saved);
        }
        
        return NotificationConverter.toDTO(saved);
    }
    
    /**
     * 向目标用户推送通知
     */
    private void pushNotificationToUsers(Notification notification) {
        // 根据目标受众获取用户列表
        List<Long> targetUserIds = audienceService.resolveTargetUsers(notification.getTargetAudience());
        
        // 创建推送消息
        NotificationPushMessage pushMessage = NotificationPushMessage.builder()
            .notificationId(notification.getId())
            .title(notification.getTitle())
            .summary(StringUtils.abbreviate(HtmlUtils.htmlToText(notification.getContent()), 100))
            .type(notification.getType())
            .importance(notification.getImportance())
            .time(LocalDateTime.now())
            .build();
        
        // 基于重要性决定推送渠道
        switch (notification.getImportance()) {
            case HIGH:
                // 站内信 + APP推送
                messageService.sendSystemMessage(targetUserIds, pushMessage);
                pushService.sendAppPushMessage(targetUserIds, pushMessage);
                break;
            case URGENT:
                // 站内信 + APP推送 + 短信
                messageService.sendSystemMessage(targetUserIds, pushMessage);
                pushService.sendAppPushMessage(targetUserIds, pushMessage);
                smsService.sendBatchNotification(targetUserIds, pushMessage);
                break;
            case NORMAL:
            default:
                // 仅发送站内信
                messageService.sendSystemMessage(targetUserIds, pushMessage);
                break;
        }
        
        // 发布推送完成事件
        eventPublisher.publishEvent(new NotificationPushCompletedEvent(
            notification.getId(), 
            targetUserIds.size()
        ));
    }
    
    /**
     * 设置通知置顶状态
     */
    @CacheEvict(value = "notification", key = "#id")
    @Transactional
    public NotificationDTO setNotificationTopStatus(Long id, boolean isTop) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 仅已发布的通知可以设置置顶
        if (notification.getStatus() != NotificationStatus.PUBLISHED) {
            throw new BusinessException("仅已发布的通知可以设置置顶状态");
        }
        
        // 如果置顶，先查看当前置顶数量是否超限
        if (isTop && !notification.getIsTop()) {
            long currentTopCount = notificationRepository.countByIsTopAndStatus(true, NotificationStatus.PUBLISHED);
            if (currentTopCount >= appProperties.getMaxTopNotifications()) {
                throw new BusinessException("置顶通知数量已达上限，请取消其他置顶通知后再试");
            }
        }
        
        notification.setIsTop(isTop);
        notification.setUpdateTime(LocalDateTime.now());
        notification.setUpdateBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        // 清除通知列表缓存
        cacheManager.getCache("notificationList").clear();
        
        return NotificationConverter.toDTO(saved);
    }
    
    /**
     * 撤回通知
     */
    @CacheEvict(value = "notification", key = "#id")
    @Transactional
    public NotificationDTO recallNotification(Long id, String reason) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证状态，只有已发布和已置顶的通知可以撤回
        if (notification.getStatus() != NotificationStatus.PUBLISHED && 
            notification.getStatus() != NotificationStatus.TOPPED) {
            throw new BusinessException("当前通知状态不允许撤回操作");
        }
        
        // 验证撤回权限
        if (!securityService.canRecallNotification(notification)) {
            throw new AccessDeniedException("没有撤回此通知的权限");
        }
        
        // 更新状态为已撤回
        notification.setStatus(NotificationStatus.RECALLED);
        notification.setIsTop(false);
        notification.setRecallTime(LocalDateTime.now());
        notification.setRecallBy(SecurityUtils.getCurrentUserId());
        notification.setRecallReason(reason);
        
        Notification saved = notificationRepository.save(notification);
        
        // 发送撤回消息给已接收通知的用户
        List<Long> notifiedUsers = notificationReadRepository.findUserIdsByNotificationId(id);
        if (!notifiedUsers.isEmpty()) {
            messageService.sendRecallNotification(notifiedUsers, notification.getTitle());
        }
        
        // 清除相关缓存
        cacheManager.getCache("notificationList").clear();
        
        // 发布撤回事件
        eventPublisher.publishEvent(new NotificationRecalledEvent(saved.getId(), reason));
        
        return NotificationConverter.toDTO(saved);
    }
    
    /**
     * 归档通知
     */
    @Scheduled(cron = "${app.notification.archive-cron:0 0 1 * * ?}")
    @Transactional
    public void archiveExpiredNotifications() {
        log.info("开始归档过期通知...");
        
        LocalDateTime now = LocalDateTime.now();
        List<Notification> expiredNotifications = notificationRepository
            .findByStatusAndExpirationDateBefore(NotificationStatus.PUBLISHED, now);
        
        int count = 0;
        for (Notification notification : expiredNotifications) {
            notification.setStatus(NotificationStatus.ARCHIVED);
            notification.setArchiveTime(now);
            notificationRepository.save(notification);
            
            // 清除通知缓存
            cacheManager.getCache("notification").evict(notification.getId());
            count++;
        }
        
        if (count > 0) {
            log.info("归档过期通知完成，共归档{}条通知", count);
            // 清除通知列表缓存
            cacheManager.getCache("notificationList").clear();
            
            // 发布归档事件
            eventPublisher.publishEvent(new NotificationsArchivedEvent(count));
        } else {
            log.info("没有需要归档的过期通知");
        }
    }
    
    /**
     * 获取通知阅读统计
     */
    public NotificationStatisticsDTO getNotificationStatistics(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 获取目标受众总人数
        int totalAudience = audienceService.countTargetUsers(notification.getTargetAudience());
        
        // 获取已读人数
        int readCount = notificationReadRepository.countByNotificationId(id);
        
        // 获取确认人数（如果需要确认）
        int confirmedCount = 0;
        if (notification.isRequireConfirmation()) {
            confirmedCount = notificationReadRepository.countByNotificationIdAndConfirmed(id, true);
        }
        
        // 按企业统计阅读情况
        List<CompanyReadStatistics> companyReadStats = notificationReadRepository.getCompanyReadStatistics(id);
        
        // 构建统计结果
        NotificationStatisticsDTO statistics = new NotificationStatisticsDTO();
        statistics.setNotificationId(id);
        statistics.setTitle(notification.getTitle());
        statistics.setPublishTime(notification.getPublishTime());
        statistics.setTotalAudience(totalAudience);
        statistics.setReadCount(readCount);
        statistics.setReadRate(totalAudience > 0 ? (double) readCount / totalAudience : 0);
        statistics.setConfirmedCount(confirmedCount);
        statistics.setConfirmRate(totalAudience > 0 ? (double) confirmedCount / totalAudience : 0);
        statistics.setCompanyStatistics(companyReadStats);
        
        return statistics;
    }
}

/**
 * 通知控制器
 */
@RestController
@RequestMapping("/api/notifications")
@Tag(name = "通知公告管理", description = "通知公告的CRUD操作和状态管理")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    /**
     * 分页查询通知列表
     */
    @GetMapping
    @Operation(summary = "分页查询通知列表", description = "可根据多种条件筛选通知")
    public Page<NotificationDTO> getNotifications(
            @Parameter(description = "通知标题，支持模糊查询") 
            @RequestParam(required = false) String title,
            
            @Parameter(description = "通知类型") 
            @RequestParam(required = false) NotificationType type,
            
            @Parameter(description = "通知状态") 
            @RequestParam(required = false) NotificationStatus status,
            
            @Parameter(description = "通知重要性") 
            @RequestParam(required = false) NotificationImportance importance,
            
            @Parameter(description = "起始发布时间") 
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            
            @Parameter(description = "结束发布时间") 
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            
            @Parameter(description = "页码，从0开始") 
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "每页记录数") 
            @RequestParam(defaultValue = "10") int size) {
        
        return notificationService.getNotifications(
            title, type, status, importance, startTime, endTime, page, size);
    }
    
    /**
     * 获取通知详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取通知详情", description = "根据ID获取通知的详细信息")
    public ResponseEntity<NotificationDTO> getNotification(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id) {
        
        NotificationDTO notification = notificationService.getNotification(id);
        return ResponseEntity.ok(notification);
    }
    
    /**
     * 创建通知
     */
    @PostMapping
    @Operation(summary = "创建通知", description = "创建新的通知公告，初始状态为草稿")
    public ResponseEntity<NotificationDTO> createNotification(
            @Parameter(description = "通知创建请求", required = true)
            @Valid @RequestBody NotificationCreateRequest request) {
        
        NotificationDTO created = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * 更新通知
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新通知", description = "更新通知的内容和属性")
    public ResponseEntity<NotificationDTO> updateNotification(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id,
            
            @Parameter(description = "通知更新请求", required = true)
            @Valid @RequestBody NotificationUpdateRequest request) {
        
        NotificationDTO updated = notificationService.updateNotification(id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * 提交通知审核
     */
    @PostMapping("/{id}/submit")
    @Operation(summary = "提交通知审核", description = "将草稿状态的通知提交审核")
    public ResponseEntity<NotificationDTO> submitForReview(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id) {
        
        NotificationDTO submitted = notificationService.submitForReview(id);
        return ResponseEntity.ok(submitted);
    }
    
    /**
     * 审核通知
     */
    @PostMapping("/{id}/review")
    @Operation(summary = "审核通知", description = "通过或拒绝通知审核")
    public ResponseEntity<NotificationDTO> reviewNotification(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id,
            
            @Parameter(description = "审核请求", required = true)
            @Valid @RequestBody NotificationReviewRequest request) {
        
        NotificationDTO reviewed = notificationService.reviewNotification(id, request);
        return ResponseEntity.ok(reviewed);
    }
    
    /**
     * 发布通知
     */
    @PostMapping("/{id}/publish")
    @Operation(summary = "发布通知", description = "发布审核通过的通知，支持立即发布和定时发布")
    public ResponseEntity<NotificationDTO> publishNotification(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id,
            
            @Parameter(description = "发布请求", required = true)
            @Valid @RequestBody NotificationPublishRequest request) {
        
        NotificationDTO published = notificationService.publishNotification(id, request);
        return ResponseEntity.ok(published);
    }
    
    /**
     * 设置通知置顶状态
     */
    @PostMapping("/{id}/top")
    @Operation(summary = "设置通知置顶状态", description = "设置或取消通知的置顶状态")
    public ResponseEntity<NotificationDTO> setTopStatus(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id,
            
            @Parameter(description = "是否置顶", required = true)
            @RequestParam boolean isTop) {
        
        NotificationDTO updated = notificationService.setNotificationTopStatus(id, isTop);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * 撤回通知
     */
    @PostMapping("/{id}/recall")
    @Operation(summary = "撤回通知", description = "撤回已发布的通知")
    public ResponseEntity<NotificationDTO> recallNotification(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id,
            
            @Parameter(description = "撤回原因", required = true)
            @RequestParam String reason) {
        
        NotificationDTO recalled = notificationService.recallNotification(id, reason);
        return ResponseEntity.ok(recalled);
    }
    
    /**
     * 获取通知阅读统计
     */
    @GetMapping("/{id}/statistics")
    @Operation(summary = "获取通知阅读统计", description = "获取通知的阅读和确认统计数据")
    public ResponseEntity<NotificationStatisticsDTO> getNotificationStatistics(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id) {
        
        NotificationStatisticsDTO statistics = notificationService.getNotificationStatistics(id);
        return ResponseEntity.ok(statistics);
    }
}

/**
 * 通知领域模型
 */
@Entity
@Table(name = "sm_notification")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationImportance importance;
    
    @Type(type = "json")
    @Column(columnDefinition = "json")
    private TargetAudience targetAudience;
    
    @Column(name = "is_top", nullable = false)
    private Boolean isTop;
    
    @Column(name = "require_confirmation", nullable = false)
    private boolean requireConfirmation;
    
    @Column(name = "confirmation_deadline")
    private LocalDateTime confirmationDeadline;
    
    @Type(type = "json")
    @Column(columnDefinition = "json")
    private List<NotificationAttachment> attachments;
    
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
    
    @Column(name = "publish_time")
    private LocalDateTime publishTime;
    
    @Column(name = "scheduled_publish_time")
    private LocalDateTime scheduledPublishTime;
    
    @Column(name = "review_time")
    private LocalDateTime reviewTime;
    
    @Column(name = "review_by")
    private Long reviewBy;
    
    @Column(name = "review_comment")
    private String reviewComment;
    
    @Column(name = "publish_by")
    private Long publishBy;
    
    @Column(name = "recall_time")
    private LocalDateTime recallTime;
    
    @Column(name = "recall_by")
    private Long recallBy;
    
    @Column(name = "recall_reason")
    private String recallReason;
    
    @Column(name = "archive_time")
    private LocalDateTime archiveTime;
    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;
    
    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;
    
    @Column(name = "update_by")
    private Long updateBy;
    
    @Column(name = "update_time")
    private LocalDateTime updateTime;
}

/**
 * 通知类型枚举
 */
public enum NotificationType {
    GENERAL("普通通知"),
    POLICY("政策通知"),
    ACTIVITY("活动通知"),
    SAFETY("安全通知"),
    MAINTENANCE("维护通知");
    
    private final String description;
    
    NotificationType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}

/**
 * 通知状态枚举
 */
public enum NotificationStatus {
    DRAFT("草稿"),
    PENDING_REVIEW("待审核"),
    REJECTED("已驳回"),
    PENDING_PUBLISH("待发布"),
    SCHEDULED("定时发布"),
    PUBLISHED("已发布"),
    TOPPED("已置顶"),
    RECALLED("已撤回"),
    ARCHIVED("已归档");
    
    private final String description;
    
    NotificationStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}

/**
 * 通知重要性枚举
 */
public enum NotificationImportance {
    NORMAL("普通"),
    HIGH("重要"),
    URGENT("紧急");
    
    private final String description;
    
    NotificationImportance(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}

/**
 * 通知目标受众
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TargetAudience implements Serializable {
    
    // 受众类型：ALL(所有人), COMPANIES(指定企业), ROLES(指定角色)
    private TargetType targetType;
    
    // 当targetType=COMPANIES时，存储目标企业ID列表
    private List<Long> companyIds;
    
    // 当targetType=ROLES时，存储目标角色ID列表
    private List<Long> roleIds;
    
    public enum TargetType {
        ALL, COMPANIES, ROLES
    }
}

/**
 * 通知附件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationAttachment implements Serializable {
    
    private String name;
    private String fileId;
    private String fileType;
    private Long fileSize;
    private String url;
}

/**
 * 通知DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO implements Serializable {
    
    private Long id;
    private String title;
    private String content;
    private NotificationType type;
    private NotificationStatus status;
    private NotificationImportance importance;
    private TargetAudience targetAudience;
    private Boolean isTop;
    private boolean requireConfirmation;
    private LocalDateTime confirmationDeadline;
    private List<NotificationAttachment> attachments;
    private LocalDateTime expirationDate;
    private LocalDateTime publishTime;
    private LocalDateTime scheduledPublishTime;
    private LocalDateTime reviewTime;
    private UserMinimalDTO reviewer;
    private String reviewComment;
    private UserMinimalDTO publisher;
    private LocalDateTime recallTime;
    private UserMinimalDTO recaller;
    private String recallReason;
    private LocalDateTime archiveTime;
    private UserMinimalDTO creator;
    private LocalDateTime createdTime;
    private UserMinimalDTO updater;
    private LocalDateTime updateTime;
    
    // 额外字段
    private Long readCount;
    private Long totalAudience;
    private Double readRate;
    private Boolean isRead;
    private Boolean isConfirmed;
}

## 4. 数据持久化设计

### 4.1 数据模型

#### 实体关系图

信息公开子模块包含以下核心实体及关系：

1. **通知公告(Notification)**：核心实体，记录所有类型的通知公告
2. **通知阅读记录(NotificationRead)**：记录用户对通知的阅读和确认情况
3. **政策文件(PolicyDocument)**：存储政策文档及其版本信息
4. **活动信息(Activity)**：存储活动相关信息
5. **活动报名(ActivityRegistration)**：记录用户活动报名情况
6. **问卷调查(Survey)**：存储问卷信息
7. **问卷问题(SurveyQuestion)**：存储问卷中的问题
8. **问卷回答(SurveyResponse)**：存储用户的问卷回答
9. **企业需求(CompanyDemand)**：存储企业发布的需求信息

实体间的主要关系：
- 一个通知可以有多个阅读记录(1:N)
- 一个政策文件可以有多个版本(1:N)
- 一个活动可以有多个报名记录(1:N)
- 一个问卷可以有多个问题和多个回答(1:N)
- 一个企业可以发布多个需求(1:N)

#### 数据库表设计

**1. 通知公告表(sm_notification)**

| 字段名 | 类型 | 约束 | 说明 |
|-------|-----|------|-----|
| id | BIGINT | PK | 通知ID |
| title | VARCHAR(100) | NOT NULL | 通知标题 |
| content | TEXT | NOT NULL | 通知内容，富文本格式 |
| type | VARCHAR(20) | NOT NULL | 通知类型 |
| status | VARCHAR(20) | NOT NULL | 通知状态 |
| importance | VARCHAR(20) | NOT NULL | 重要性级别 |
| target_audience | JSON | NOT NULL | 目标受众配置 |
| is_top | BOOLEAN | NOT NULL | 是否置顶 |
| require_confirmation | BOOLEAN | NOT NULL | 是否需要确认 |
| confirmation_deadline | DATETIME | | 确认截止时间 |
| attachments | JSON | | 附件列表 |
| expiration_date | DATETIME | | 过期时间 |
| publish_time | DATETIME | | 发布时间 |
| scheduled_publish_time | DATETIME | | 计划发布时间 |
| review_time | DATETIME | | 审核时间 |
| review_by | BIGINT | | 审核人ID |
| review_comment | VARCHAR(500) | | 审核意见 |
| publish_by | BIGINT | | 发布人ID |
| recall_time | DATETIME | | 撤回时间 |
| recall_by | BIGINT | | 撤回人ID |
| recall_reason | VARCHAR(500) | | 撤回原因 |
| archive_time | DATETIME | | 归档时间 |
| created_by | BIGINT | NOT NULL | 创建人ID |
| created_time | DATETIME | NOT NULL | 创建时间 |
| update_by | BIGINT | | 更新人ID |
| update_time | DATETIME | | 更新时间 |

**2. 通知阅读记录表(sm_notification_read)**

| 字段名 | 类型 | 约束 | 说明 |
|-------|-----|------|-----|
| id | BIGINT | PK | 记录ID |
| notification_id | BIGINT | NOT NULL, FK | 通知ID |
| user_id | BIGINT | NOT NULL | 用户ID |
| company_id | BIGINT | | 企业ID |
| read_time | DATETIME | NOT NULL | 阅读时间 |
| is_confirmed | BOOLEAN | NOT NULL | 是否已确认 |
| confirm_time | DATETIME | | 确认时间 |
| device_info | VARCHAR(100) | | 设备信息 |
| ip_address | VARCHAR(50) | | IP地址 |

**3. 政策文件表(sm_policy_document)**

| 字段名 | 类型 | 约束 | 说明 |
|-------|-----|------|-----|
| id | BIGINT | PK | 政策文件ID |
| title | VARCHAR(100) | NOT NULL | 标题 |
| document_no | VARCHAR(50) | | 文号 |
| category_id | BIGINT | NOT NULL | 分类ID |
| summary | VARCHAR(500) | | 摘要 |
| content | TEXT | | 内容 |
| file_id | VARCHAR(50) | | 文件ID |
| file_name | VARCHAR(100) | | 文件名 |
| file_size | BIGINT | | 文件大小 |
| file_type | VARCHAR(20) | | 文件类型 |
| version | VARCHAR(20) | NOT NULL | 版本号 |
| is_latest | BOOLEAN | NOT NULL | 是否最新版本 |
| status | VARCHAR(20) | NOT NULL | 状态 |
| publish_time | DATETIME | | 发布时间 |
| effective_date | DATETIME | | 生效日期 |
| expiration_date | DATETIME | | 失效日期 |
| keywords | VARCHAR(200) | | 关键词 |
| view_count | INT | NOT NULL | 查看次数 |
| download_count | INT | NOT NULL | 下载次数 |
| review_by | BIGINT | | 审核人ID |
| review_time | DATETIME | | 审核时间 |
| created_by | BIGINT | NOT NULL | 创建人ID |
| created_time | DATETIME | NOT NULL | 创建时间 |
| update_by | BIGINT | | 更新人ID |
| update_time | DATETIME | | 更新时间 |

**4. 活动信息表(sm_activity)**

| 字段名 | 类型 | 约束 | 说明 |
|-------|-----|------|-----|
| id | BIGINT | PK | 活动ID |
| title | VARCHAR(100) | NOT NULL | 活动标题 |
| description | TEXT | NOT NULL | 活动描述 |
| type | VARCHAR(20) | NOT NULL | 活动类型 |
| status | VARCHAR(20) | NOT NULL | 活动状态 |
| location | VARCHAR(200) | | 活动地点 |
| start_time | DATETIME | NOT NULL | 开始时间 |
| end_time | DATETIME | NOT NULL | 结束时间 |
| registration_start | DATETIME | | 报名开始时间 |
| registration_end | DATETIME | | 报名截止时间 |
| capacity | INT | | 活动容量 |
| registered_count | INT | NOT NULL | 已报名人数 |
| organizer | VARCHAR(100) | | 主办方 |
| contact_person | VARCHAR(50) | | 联系人 |
| contact_phone | VARCHAR(20) | | 联系电话 |
| images | JSON | | 活动图片 |
| attachments | JSON | | 附件 |
| target_audience | JSON | | 目标受众 |
| registration_fields | JSON | | 报名字段 |
| is_featured | BOOLEAN | NOT NULL | 是否推荐 |
| review_by | BIGINT | | 审核人ID |
| review_time | DATETIME | | 审核时间 |
| review_comment | VARCHAR(500) | | 审核意见 |
| created_by | BIGINT | NOT NULL | 创建人ID |
| created_time | DATETIME | NOT NULL | 创建时间 |
| update_by | BIGINT | | 更新人ID |
| update_time | DATETIME | | 更新时间 |

**5. 活动报名表(sm_activity_registration)**

| 字段名 | 类型 | 约束 | 说明 |
|-------|-----|------|-----|
| id | BIGINT | PK | 报名ID |
| activity_id | BIGINT | NOT NULL, FK | 活动ID |
| user_id | BIGINT | NOT NULL | 用户ID |
| company_id | BIGINT | | 企业ID |
| registration_data | JSON | | 报名表单数据 |
| status | VARCHAR(20) | NOT NULL | 报名状态 |
| registration_time | DATETIME | NOT NULL | 报名时间 |
| check_in_time | DATETIME | | 签到时间 |
| check_in_location | VARCHAR(100) | | 签到地点 |
| remark | VARCHAR(200) | | 备注 |
| created_time | DATETIME | NOT NULL | 创建时间 |
| update_time | DATETIME | | 更新时间 |

## 5. 安全考量

### 5.1 访问控制

#### 权限检查点
信息公开模块实现了细粒度的权限控制，主要权限检查点包括：

1. **通知公告管理权限**：
   - `notification:create` - 创建通知
   - `notification:update` - 更新通知
   - `notification:delete` - 删除通知
   - `notification:review` - 审核通知
   - `notification:publish` - 发布通知
   - `notification:recall` - 撤回通知
   - `notification:view_statistics` - 查看统计数据

2. **政策文件管理权限**：
   - `policy:create` - 创建政策文件
   - `policy:update` - 更新政策文件
   - `policy:delete` - 删除政策文件
   - `policy:review` - 审核政策文件
   - `policy:publish` - 发布政策文件

3. **活动管理权限**：
   - `activity:create` - 创建活动
   - `activity:update` - 更新活动
   - `activity:delete` - 删除活动
   - `activity:review` - 审核活动
   - `activity:manage_registration` - 管理报名

4. **问卷管理权限**：
   - `survey:create` - 创建问卷
   - `survey:update` - 更新问卷
   - `survey:delete` - 删除问卷
   - `survey:view_result` - 查看问卷结果
   - `survey:analyze` - 分析问卷数据

5. **需求管理权限**：
   - `demand:create` - 创建需求
   - `demand:update` - 更新需求
   - `demand:review` - 审核需求
   - `demand:publish` - 发布需求
   - `demand:match` - 需求匹配

#### 数据访问控制
实现基于Spring Security的数据访问控制：

1. **数据层过滤**：
   ```java
   @PostFilter("hasRole('ADMIN') or filterObject.targetAudience.canAccess(authentication)")
   public List<NotificationDTO> getNotifications() {
       // 实现通知查询，返回未过滤的列表
       return notificationRepository.findAll().stream()
           .map(NotificationConverter::toDTO)
           .collect(Collectors.toList());
   }
   ```

2. **方法级权限控制**：
   ```java
   @PreAuthorize("hasPermission(#id, 'Notification', 'notification:update')")
   public NotificationDTO updateNotification(Long id, NotificationUpdateRequest request) {
       // 实现通知更新
   }
   ```

3. **自定义权限评估器**：
   ```java
   @Component
   public class NotificationPermissionEvaluator implements PermissionEvaluator {
       @Override
       public boolean hasPermission(Authentication auth, Object targetId, Object targetType, Object permission) {
           // 针对通知公告的权限检查实现
           if (targetType.equals("Notification")) {
               // 检查用户角色和权限
               return evaluateNotificationPermission(auth, (Long) targetId, (String) permission);
           }
           return false;
       }
       
       private boolean evaluateNotificationPermission(Authentication auth, Long notificationId, String permission) {
           // 实现权限检查
       }
   }
   ```

#### 操作审计记录
使用AOP实现敏感操作审计：

```java
@Aspect
@Component
public class NotificationAuditAspect {

    @Autowired
    private AuditLogService auditLogService;
    
    @AfterReturning(
        pointcut = "execution(* com.smartcampus.notification.service.*.*(..)) && @annotation(auditable)",
        returning = "result")
    public void auditNotificationOperation(JoinPoint joinPoint, NotificationAuditable auditable, Object result) {
        // 记录操作审计日志
        AuditLogDTO auditLog = new AuditLogDTO();
        auditLog.setOperationType(auditable.operation());
        auditLog.setObjectType("Notification");
        auditLog.setObjectId(extractId(result));
        auditLog.setOperationBy(SecurityUtils.getCurrentUserId());
        auditLog.setOperationTime(LocalDateTime.now());
        auditLog.setDetails(buildAuditDetails(joinPoint, result));
        
        auditLogService.recordAuditLog(auditLog);
    }
    
    private String buildAuditDetails(JoinPoint joinPoint, Object result) {
        // 构建详细的审计信息
    }
}
```

### 5.2 数据保护

#### 敏感数据处理
信息公开模块处理多种类型的敏感数据：

1. **敏感内容加密存储**：
   ```java
   @Component
   public class SensitiveDataEncryptor {
   
       @Value("${app.encryption.key}")
       private String encryptionKey;
       
       public String encrypt(String sensitiveData) {
           try {
               // 使用AES加密敏感数据
               Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
               cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(), getIvParameterSpec());
               byte[] encrypted = cipher.doFinal(sensitiveData.getBytes(StandardCharsets.UTF_8));
               return Base64.getEncoder().encodeToString(encrypted);
           } catch (Exception e) {
               throw new SystemException("加密敏感数据失败", e);
           }
       }
       
       public String decrypt(String encryptedData) {
           try {
               // 使用AES解密敏感数据
               Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
               cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), getIvParameterSpec());
               byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
               return new String(decrypted, StandardCharsets.UTF_8);
           } catch (Exception e) {
               throw new SystemException("解密敏感数据失败", e);
           }
       }
       
       private SecretKey getSecretKey() {
           // 生成密钥
       }
       
       private IvParameterSpec getIvParameterSpec() {
           // 生成初始向量
       }
   }
   ```

2. **数据脱敏**：
   ```java
   @Component
   public class DataMasker {
   
       /**
        * 手机号脱敏
        */
       public String maskPhoneNumber(String phoneNumber) {
           if (StringUtils.isBlank(phoneNumber)) {
               return phoneNumber;
           }
           return phoneNumber.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
       }
       
       /**
        * 邮箱脱敏
        */
       public String maskEmail(String email) {
           if (StringUtils.isBlank(email)) {
               return email;
           }
           return email.replaceAll("(^[^@]{3})[^@]*(@.*$)", "$1***$2");
       }
       
       /**
        * 企业信息脱敏
        */
       public CompanyDTO maskSensitiveInfo(CompanyDTO company) {
           if (company == null) {
               return null;
           }
           
           // 根据当前用户权限决定是否脱敏
           if (!SecurityUtils.hasPermission("company:view_sensitive")) {
               company.setContactPhone(maskPhoneNumber(company.getContactPhone()));
               company.setContactEmail(maskEmail(company.getContactEmail()));
               // 其他敏感字段脱敏
           }
           
           return company;
       }
   }
   ```

#### 输入验证策略
防止XSS和注入攻击：

1. **富文本内容安全过滤**：
   ```java
   @Component
   public class HtmlSanitizer {
   
       private final PolicyFactory policy;
       
       public HtmlSanitizer() {
           // 使用OWASP AntiSamy策略
           policy = new HtmlPolicyBuilder()
               .allowElements("a", "b", "blockquote", "br", "caption", "cite", "code", "col",
                      "colgroup", "dd", "div", "dl", "dt", "em", "h1", "h2", "h3", "h4", "h5", "h6",
                      "i", "img", "li", "ol", "p", "pre", "q", "small", "span", "strike", "strong",
                      "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul")
               .allowUrlProtocols("http", "https")
               .allowAttributes("href").onElements("a")
               .allowAttributes("src").onElements("img")
               .allowAttributes("class").globally()
               .allowAttributes("title").globally()
               .allowAttributes("alt").onElements("img")
               .toFactory();
       }
       
       /**
        * 过滤HTML内容，防止XSS攻击
        */
       public String sanitize(String html) {
           if (StringUtils.isBlank(html)) {
               return html;
           }
           return policy.sanitize(html);
       }
   }
   ```

2. **输入验证注解**：
   ```java
   @Documented
   @Constraint(validatedBy = SafeHtmlValidator.class)
   @Target({ElementType.FIELD, ElementType.PARAMETER})
   @Retention(RetentionPolicy.RUNTIME)
   public @interface SafeHtml {
       String message() default "可能包含不安全的HTML内容";
       Class<?>[] groups() default {};
       Class<? extends Payload>[] payload() default {};
   }
   
   public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {
   
       @Autowired
       private HtmlSanitizer sanitizer;
       
       @Override
       public boolean isValid(String value, ConstraintValidatorContext context) {
           if (StringUtils.isBlank(value)) {
               return true;
           }
           
           // 检查原内容和过滤后内容是否一致
           String sanitized = sanitizer.sanitize(value);
           return sanitized.equals(value);
       }
   }
   ```

### 5.3 安全编码实践

#### 特定模块安全编码指南

1. **通知公告安全守则**：
   - 所有通知内容必须经过HTML安全过滤
   - 附件上传需验证文件类型和大小
   - 通知推送前必须验证目标用户权限
   - 敏感通知内容加密存储

2. **政策文件安全守则**：
   - 文件上传必须验证MIME类型
   - 敏感政策文件需加密存储
   - 文件下载必须检查权限
   - 版本控制需防止未授权修改

3. **活动管理安全守则**：
   - 活动报名表单需防止注入
   - 活动图片上传需验证格式与大小
   - 签到验证需防止欺骗
   - 活动名额管理需防并发问题

#### 安全代码审计点

信息公开模块需重点关注的安全审计项：

1. **输入验证**：确保所有外部输入经过验证
2. **访问控制**：确保所有敏感操作都有权限检查
3. **敏感数据处理**：确保敏感数据加密或脱敏
4. **异常处理**：确保异常信息不泄露敏感信息
5. **SQL注入防护**：确保所有数据库操作使用参数化查询
6. **日志记录**：确保关键操作有完整日志记录

## 6. 接口设计

### 6.1 对外接口

#### 通知公告管理API

| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|-----|------|---------|
| `/api/notifications` | GET | 获取通知列表 | 用户 |
| `/api/notifications/{id}` | GET | 获取通知详情 | 用户 |
| `/api/notifications` | POST | 创建通知 | notification:create |
| `/api/notifications/{id}` | PUT | 更新通知 | notification:update |
| `/api/notifications/{id}/submit` | POST | 提交审核 | notification:update |
| `/api/notifications/{id}/review` | POST | 审核通知 | notification:review |
| `/api/notifications/{id}/publish` | POST | 发布通知 | notification:publish |
| `/api/notifications/{id}/top` | POST | 设置置顶 | notification:update |
| `/api/notifications/{id}/recall` | POST | 撤回通知 | notification:recall |
| `/api/notifications/{id}/read` | POST | 标记已读 | 用户 |
| `/api/notifications/{id}/confirm` | POST | 确认通知 | 用户 |
| `/api/notifications/{id}/statistics` | GET | 阅读统计 | notification:view_statistics |

#### 政策文件管理API

| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|-----|------|---------|
| `/api/policies` | GET | 获取政策列表 | 用户 |
| `/api/policies/{id}` | GET | 获取政策详情 | 用户 |
| `/api/policies` | POST | 创建政策 | policy:create |
| `/api/policies/{id}` | PUT | 更新政策 | policy:update |
| `/api/policies/{id}/submit` | POST | 提交审核 | policy:update |
| `/api/policies/{id}/review` | POST | 审核政策 | policy:review |
| `/api/policies/{id}/publish` | POST | 发布政策 | policy:publish |
| `/api/policies/{id}/versions` | GET | 获取版本历史 | 用户 |
| `/api/policies/{id}/download` | GET | 下载政策文件 | 用户 |
| `/api/policies/{id}/statistics` | GET | 查看统计 | policy:view_statistics |

#### 活动管理API

| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|-----|------|---------|
| `/api/activities` | GET | 获取活动列表 | 用户 |
| `/api/activities/{id}` | GET | 获取活动详情 | 用户 |
| `/api/activities` | POST | 创建活动 | activity:create |
| `/api/activities/{id}` | PUT | 更新活动 | activity:update |
| `/api/activities/{id}/submit` | POST | 提交审核 | activity:update |
| `/api/activities/{id}/review` | POST | 审核活动 | activity:review |
| `/api/activities/{id}/publish` | POST | 发布活动 | activity:publish |
| `/api/activities/{id}/cancel` | POST | 取消活动 | activity:update |
| `/api/activities/{id}/register` | POST | 活动报名 | 用户 |
| `/api/activities/{id}/checkin` | POST | 活动签到 | 用户 |
| `/api/activities/{id}/registrations` | GET | 报名列表 | activity:manage_registration |
| `/api/activities/{id}/statistics` | GET | 活动统计 | activity:view_statistics |

### 6.2 模块内部接口

#### 信息审核组件接口

```java
/**
 * 内容审核服务
 */
public interface ContentApprovalService {

    /**
     * 提交内容审核
     * @param contentType 内容类型
     * @param contentId 内容ID
     * @param submitterId 提交人ID
     * @return 审核流程实例ID
     */
    String submitForApproval(String contentType, Long contentId, Long submitterId);
    
    /**
     * 审核内容
     * @param approvalId 审核ID
     * @param approved 是否通过
     * @param comment 审核意见
     * @param approverId 审核人ID
     * @return 审核结果
     */
    ApprovalResult approve(String approvalId, boolean approved, String comment, Long approverId);
    
    /**
     * 查询审核状态
     * @param contentType 内容类型
     * @param contentId 内容ID
     * @return 审核状态
     */
    ApprovalStatus getApprovalStatus(String contentType, Long contentId);
    
    /**
     * 获取审核历史
     * @param contentType 内容类型
     * @param contentId 内容ID
     * @return 审核历史记录列表
     */
    List<ApprovalHistoryDTO> getApprovalHistory(String contentType, Long contentId);
}
```

#### 受众管理组件接口

```java
/**
 * 受众管理服务
 */
public interface AudienceService {

    /**
     * 解析目标用户
     * @param targetAudience 目标受众配置
     * @return 用户ID列表
     */
    List<Long> resolveTargetUsers(TargetAudience targetAudience);
    
    /**
     * 获取受众总人数
     * @param targetAudience 目标受众配置
     * @return 总人数
     */
    int countTargetUsers(TargetAudience targetAudience);
    
    /**
     * 检查用户是否在受众范围内
     * @param userId 用户ID
     * @param targetAudience 目标受众配置
     * @return 是否在受众范围内
     */
    boolean isUserInAudience(Long userId, TargetAudience targetAudience);
    
    /**
     * 按企业分组获取受众
     * @param targetAudience 目标受众配置
     * @return 按企业分组的用户
     */
    Map<Long, List<Long>> groupAudienceByCompany(TargetAudience targetAudience);
}
```

### 6.3 事件设计

信息公开模块采用事件驱动架构实现组件间的松耦合通信：

```java
// 通知创建事件
public class NotificationCreatedEvent extends ApplicationEvent {
    private final Long notificationId;
    private final String title;
    private final NotificationImportance importance;
    
    public NotificationCreatedEvent(Notification notification) {
        super(notification);
        this.notificationId = notification.getId();
        this.title = notification.getTitle();
        this.importance = notification.getImportance();
    }
    
    // Getters...
}

// 通知状态变更事件
public class NotificationStatusChangedEvent extends ApplicationEvent {
    private final Long notificationId;
    private final NotificationStatus oldStatus;
    private final NotificationStatus newStatus;
    private final Long operatorId;
    
    public NotificationStatusChangedEvent(Long notificationId, NotificationStatus oldStatus, 
            NotificationStatus newStatus, Long operatorId) {
        super(notificationId);
        this.notificationId = notificationId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.operatorId = operatorId;
    }
    
    // Getters...
}

// 事件监听器示例
@Component
public class NotificationEventListener {

    @Autowired
    private MessageService messageService;
    
    @Autowired
    private StatisticsService statisticsService;
    
    @EventListener
    public void handleNotificationStatusChanged(NotificationStatusChangedEvent event) {
        // 处理状态变更事件
        if (event.getNewStatus() == NotificationStatus.PUBLISHED) {
            // 通知已发布，更新统计数据
            statisticsService.recordPublishedNotification(event.getNotificationId());
        } else if (event.getNewStatus() == NotificationStatus.RECALLED) {
            // 通知已撤回，发送系统消息
            messageService.sendOperationMessage("通知[" + event.getNotificationId() + "]已被撤回");
        }
    }
}
```

## 7. 测试策略

### 7.1 单元测试

#### 测试覆盖目标
- 服务层核心业务逻辑覆盖率 > 80%
- 工具类和通用组件覆盖率 > 90%
- 重点测试业务规则和状态转换逻辑

#### 测试框架选择
- JUnit 5：基础测试框架
- Mockito：模拟依赖
- AssertJ：流式断言
- JaCoCo：代码覆盖率分析

#### 单元测试示例

```java
@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;
    
    @Mock
    private AudienceService audienceService;
    
    @Mock
    private SecurityService securityService;
    
    @Mock
    private ApplicationEventPublisher eventPublisher;
    
    @InjectMocks
    private NotificationService notificationService;
    
    @Test
    void testCreateNotification() {
        // 准备测试数据
        NotificationCreateRequest request = buildCreateRequest();
        Notification expectedNotification = buildExpectedNotification();
        
        // 模拟依赖行为
        when(notificationRepository.save(any(Notification.class))).thenReturn(expectedNotification);
        
        // 执行测试
        NotificationDTO result = notificationService.createNotification(request);
        
        // 验证结果
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo(request.getTitle());
        assertThat(result.getStatus()).isEqualTo(NotificationStatus.DRAFT);
        
        // 验证依赖交互
        verify(notificationRepository).save(any(Notification.class));
        verify(eventPublisher).publishEvent(any(NotificationCreatedEvent.class));
    }
    
    @Test
    void testReviewNotification_whenApproved() {
        // 准备测试数据
        Long notificationId = 1L;
        NotificationReviewRequest request = new NotificationReviewRequest(true, "内容合规");
        Notification notification = buildPendingReviewNotification();
        
        // 模拟依赖行为
        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));
        when(securityService.hasReviewPermission(any())).thenReturn(true);
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArgument(0));
        
        // 执行测试
        NotificationDTO result = notificationService.reviewNotification(notificationId, request);
        
        // 验证结果
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(NotificationStatus.PENDING_PUBLISH);
        assertThat(result.getReviewComment()).isEqualTo(request.getComment());
        
        // 验证依赖交互
        verify(notificationRepository).findById(notificationId);
        verify(securityService).hasReviewPermission(any());
        verify(notificationRepository).save(any(Notification.class));
        verify(eventPublisher).publishEvent(any(NotificationReviewedEvent.class));
    }
    
    // 更多测试用例...
}
```

### 7.2 集成测试

#### 测试边界定义
- 与数据库的集成测试
- 与缓存系统的集成测试
- 与消息系统的集成测试
- 与文件存储的集成测试
- API层端到端测试

#### 集成测试示例

```java
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class NotificationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private TestDataSetup testDataSetup;
    
    @BeforeEach
    void setup() {
        testDataSetup.clearAllData();
        testDataSetup.setupTestUsers();
        testDataSetup.setupTestCompanies();
    }
    
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testCreateAndPublishNotification() throws Exception {
        // 第1步：创建通知
        NotificationCreateRequest createRequest = buildCreateRequest();
        String createRequestJson = objectMapper.writeValueAsString(createRequest);
        
        MvcResult createResult = mockMvc.perform(post("/api/notifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createRequestJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.status").value("DRAFT"))
            .andReturn();
        
        String createResponseJson = createResult.getResponse().getContentAsString();
        NotificationDTO createdNotification = objectMapper.readValue(createResponseJson, NotificationDTO.class);
        
        // 第2步：提交审核
        mockMvc.perform(post("/api/notifications/{id}/submit", createdNotification.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PENDING_REVIEW"));
        
        // 第3步：审核通过
        NotificationReviewRequest reviewRequest = new NotificationReviewRequest(true, "内容合规");
        String reviewRequestJson = objectMapper.writeValueAsString(reviewRequest);
        
        mockMvc.perform(post("/api/notifications/{id}/review", createdNotification.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(reviewRequestJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PENDING_PUBLISH"));
        
        // 第4步：发布通知
        NotificationPublishRequest publishRequest = new NotificationPublishRequest(null, false);
        String publishRequestJson = objectMapper.writeValueAsString(publishRequest);
        
        mockMvc.perform(post("/api/notifications/{id}/publish", createdNotification.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(publishRequestJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PUBLISHED"));
        
        // 验证数据库状态
        Optional<Notification> storedNotification = notificationRepository.findById(createdNotification.getId());
        assertThat(storedNotification).isPresent();
        assertThat(storedNotification.get().getStatus()).isEqualTo(NotificationStatus.PUBLISHED);
        assertThat(storedNotification.get().getPublishTime()).isNotNull();
    }
    
    // 更多测试用例...
}
```

### 7.3 性能测试

#### 性能测试指标
- 通知列表加载时间 < 200ms（含50条记录）
- 通知详情加载时间 < 100ms
- 推送1000条通知的平均时间 < 5秒
- 并发100用户查询通知的响应时间 < 500ms
- 系统支持每日发布通知上限 > 500条

#### 性能测试场景

**场景1：通知列表加载性能**
```
测试步骤：
1. 准备环境：预先创建1000条通知记录
2. 执行测试：模拟50个并发用户，每个用户查询10次通知列表（带分页和筛选）
3. 收集指标：平均响应时间、95%响应时间、TPS

预期结果：
- 平均响应时间 < 200ms
- 95%响应时间 < 400ms
- TPS > 200
```

**场景2：通知推送性能**
```
测试步骤：
1. 准备环境：创建10个测试企业，每个企业100个用户
2. 执行测试：发布10条不同重要级别的通知，每条通知推送给全部用户
3. 收集指标：推送完成时间、推送吞吐量、系统资源占用

预期结果：
- 单条通知推送1000用户完成时间 < 3秒
- 推送吞吐量 > 500条/秒
- CPU使用率峰值 < 70%
```

## 8. 性能优化

### 8.1 缓存策略

#### 多级缓存架构

信息公开模块采用三级缓存架构：

1. **前端缓存**：
   - 通知列表本地存储，定期更新
   - 已读通知状态客户端缓存
   - 静态资源CDN缓存

2. **应用层缓存**：
   - 热门通知本地缓存(Caffeine)
   - 通知列表Redis分布式缓存
   - 通知详情Redis分布式缓存

3. **数据库缓存**：
   - 查询缓存
   - 索引优化
   - 读写分离

#### 缓存键设计

```java
// 通知详情缓存键设计
public String getNotificationCacheKey(Long notificationId, Long userId) {
    return String.format("notification:%d:user:%d", notificationId, userId);
}

// 通知列表缓存键设计
public String getNotificationListCacheKey(String type, String status, int page, int size) {
    return String.format("notification:list:type:%s:status:%s:page:%d:size:%d", 
        type == null ? "all" : type, 
        status == null ? "all" : status, 
        page, size);
}
```

### 8.2 数据库优化

#### 索引设计

```sql
-- 通知表索引
CREATE INDEX idx_notification_status ON sm_notification(status);
CREATE INDEX idx_notification_publish_time ON sm_notification(publish_time);
CREATE INDEX idx_notification_created_by ON sm_notification(created_by);
CREATE INDEX idx_notification_type_status ON sm_notification(type, status);

-- 通知阅读记录表索引
CREATE INDEX idx_notification_read_notification_id ON sm_notification_read(notification_id);
CREATE INDEX idx_notification_read_user_id ON sm_notification_read(user_id);
CREATE INDEX idx_notification_read_notification_user ON sm_notification_read(notification_id, user_id);
CREATE INDEX idx_notification_read_company_id ON sm_notification_read(company_id);

-- 政策文件表索引
CREATE INDEX idx_policy_document_category ON sm_policy_document(category_id);
CREATE INDEX idx_policy_document_status ON sm_policy_document(status);
CREATE INDEX idx_policy_document_publish_time ON sm_policy_document(publish_time);
```

#### 分页查询优化

```java
/**
 * 优化的通知列表查询
 */
public Page<NotificationDTO> getNotifications(String title, NotificationType type, 
        NotificationStatus status, NotificationImportance importance, 
        LocalDateTime startTime, LocalDateTime endTime, int page, int size) {
    
    // 构建缓存键
    String cacheKey = buildCacheKey(title, type, status, importance, startTime, endTime, page, size);
    
    // 尝试从缓存获取
    Page<NotificationDTO> cachedResult = cacheManager.getCache("notificationList")
        .get(cacheKey, Page.class);
    
    if (cachedResult != null) {
        return cachedResult;
    }
    
    // 构建查询规范
    Specification<Notification> spec = buildSpecification(title, type, status, importance, startTime, endTime);
    
    // 创建分页请求，优化排序
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "isTop", "publishTime"));
    
    // 执行查询
    Page<Notification> notificationsPage = notificationRepository.findAll(spec, pageable);
    
    // 转换结果
    Page<NotificationDTO> result = notificationsPage.map(notification -> {
        NotificationDTO dto = NotificationConverter.toDTO(notification);
        
        // 获取阅读统计数据（可以考虑批量获取）
        if (notification.getStatus() == NotificationStatus.PUBLISHED) {
            dto.setReadCount(notificationReadRepository.countByNotificationId(notification.getId()));
            dto.setTotalAudience(audienceService.countTargetUsers(notification.getTargetAudience()));
            if (dto.getTotalAudience() > 0) {
                dto.setReadRate((double) dto.getReadCount() / dto.getTotalAudience());
            }
        }
        
        return dto;
    });
    
    // 存入缓存
    cacheManager.getCache("notificationList").put(cacheKey, result);
    
    return result;
}
```

### 8.3 大数据量处理

#### 异步处理与批量操作

```java
/**
 * 批量推送通知
 */
@Async("notificationTaskExecutor")
public Future<PushResult> batchPushNotifications(Long notificationId, List<Long> userIds) {
    PushResult result = new PushResult();
    result.setNotificationId(notificationId);
    result.setTotalCount(userIds.size());
    
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
    
    // 创建推送消息
    NotificationPushMessage pushMessage = buildPushMessage(notification);
    
    // 分批处理
    int batchSize = 200;
    int successCount = 0;
    int failCount = 0;
    
    for (int i = 0; i < userIds.size(); i += batchSize) {
        int endIndex = Math.min(i + batchSize, userIds.size());
        List<Long> batchUserIds = userIds.subList(i, endIndex);
        
        try {
            // 批量发送站内信
            messageService.sendSystemMessage(batchUserIds, pushMessage);
            
            // 批量创建读取记录，设置为未读
            List<NotificationRead> reads = batchUserIds.stream()
                .map(userId -> {
                    NotificationRead read = new NotificationRead();
                    read.setNotificationId(notificationId);
                    read.setUserId(userId);
                    // 获取用户所属企业ID
                    Long companyId = userService.getUserCompanyId(userId);
                    read.setCompanyId(companyId);
                    read.setReadFlag(false);
                    read.setCreatedTime(LocalDateTime.now());
                    return read;
                })
                .collect(Collectors.toList());
            
            notificationReadRepository.saveAll(reads);
            
            successCount += batchUserIds.size();
        } catch (Exception e) {
            log.error("批量推送通知失败，通知ID：{}，批次：{}-{}", notificationId, i, endIndex, e);
            failCount += batchUserIds.size();
        }
    }
    
    // 设置结果
    result.setSuccessCount(successCount);
    result.setFailCount(failCount);
    result.setCompletedTime(LocalDateTime.now());
    
    return CompletableFuture.completedFuture(result);
}
```

## 9. 部署与运维

### 9.1 部署拓扑

#### 组件部署方案

信息公开模块部署在智慧园区综合管理平台中，由以下部分组成：

1. **Web应用部署**：
   - 2个实例，部署在Kubernetes集群中
   - 资源配置：每个实例2CPU核心，4GB内存
   - 支持自动伸缩，根据CPU使用率调整实例数量

2. **数据库部署**：
   - MySQL主从架构，1主2从
   - 主库处理写操作，从库处理读操作
   - 每个实例4CPU核心，16GB内存

3. **缓存部署**：
   - Redis集群，3主3从
   - 每个实例2CPU核心，8GB内存
   - 启用持久化

4. **文件存储部署**：
   - MinIO分布式对象存储
   - 4节点集群，每节点4TB存储
   - 支持对象数据冗余和自动恢复

#### 部署拓扑图

```
+-------------------+       +-------------------+
|   Load Balancer   |       |    API Gateway    |
+--------+----------+       +---------+---------+
         |                            |
         v                            v
+--------+----------------------------+---------
|   Web Application   |       |    Notification    |
|    (2 instances)    |       |      Service       |
+--------+----------------------------+---------+
         |                            |
         v                            v
+--------+----------------------------+---------+
|        Database Cluster (MySQL)               |
|        (1 Primary, 2 Replicas)                |
+--------+----------------------------+---------+
         |                            |
         v                            v
+--------+------------+   +-----------+---------+
|    Redis Cluster    |   |  MinIO Storage      |
|   (3 Masters, 3 Slaves) |  (4 Nodes)          |
+----------------------+   +---------------------+
```

### 9.2 配置管理

#### 环境配置策略

信息公开模块采用分环境配置管理：

1. **Spring Profiles**：
   ```yaml
   # application.yml
   spring:
     profiles:
       active: ${ACTIVE_PROFILE:dev}
   ```

   ```yaml
   # application-dev.yml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/smartcampus_dev
       username: dev_user
       password: ${DEV_DB_PASSWORD}
     redis:
       host: localhost
       port: 6379
   
   app:
     notification:
       max-top-notifications: 5
       archive-cron: "0 0 1 * * ?"
   ```

   ```yaml
   # application-prod.yml
   spring:
     datasource:
       url: jdbc:mysql://mysql-primary:3306/smartcampus
       username: app_user
       password: ${PROD_DB_PASSWORD}
     redis:
       cluster:
         nodes: redis-node1:6379,redis-node2:6379,redis-node3:6379
   
   app:
     notification:
       max-top-notifications: 3
       archive-cron: "0 0 2 * * ?"
   ```

2. **Nacos配置中心**：
   ```java
   @Configuration
   @NacosPropertySource(dataId = "notification-service", autoRefreshed = true)
   public class NotificationConfig {
   
       @NacosValue(value = "${max.top.notifications:3}", autoRefreshed = true)
       private int maxTopNotifications;
       
       @NacosValue(value = "${notification.expiration.days:30}", autoRefreshed = true)
       private int notificationExpirationDays;
       
       // Getters for config values
   }
   ```

#### 敏感配置保护

1. **环境变量传递**：
   ```yaml
   spring:
     datasource:
       password: ${DB_PASSWORD}
     mail:
       password: ${MAIL_PASSWORD}
   ```

2. **Vault集成**：
   ```java
   @Configuration
   @PropertySource(value = "vault:secret/notification-service")
   public class VaultConfig {
       
       @Value("${sms.api.key}")
       private String smsApiKey;
       
       @Value("${push.service.key}")
       private String pushServiceKey;
       
       // Beans to provide secure credentials
   }
   ```

### 9.3 监控与日志

#### 监控设计

1. **健康检查端点**：
   ```java
   @Component
   public class NotificationHealthIndicator implements HealthIndicator {
       
       @Autowired
       private NotificationRepository notificationRepository;
       
       @Autowired
       private RedisConnectionFactory redisConnectionFactory;
       
       @Override
       public Health health() {
           Health.Builder builder = new Health.Builder();
           
           try {
               // 检查数据库连接
               long count = notificationRepository.count();
               builder.withDetail("notification.count", count);
               
               // 检查Redis连接
               RedisConnection redisConnection = redisConnectionFactory.getConnection();
               String pong = new String(redisConnection.ping());
               if ("PONG".equals(pong)) {
                   builder.withDetail("redis.status", "up");
               } else {
                   return builder.down().withDetail("redis.status", "down").build();
               }
               
               return builder.up().build();
           } catch (Exception e) {
               return builder.down(e).build();
           }
       }
   }
   ```

2. **Prometheus指标**：
   ```java
   @Configuration
   public class MetricsConfig {
       
       @Bean
       public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
           return registry -> registry.config().commonTags("application", "notification-service");
       }
   }
   
   @Component
   public class NotificationMetrics {
       
       private final Counter notificationCreatedCounter;
       private final Counter notificationPublishedCounter;
       private final Timer notificationPushTimer;
       
       public NotificationMetrics(MeterRegistry registry) {
           this.notificationCreatedCounter = Counter.builder("notification.created")
               .description("Number of notifications created")
               .register(registry);
               
           this.notificationPublishedCounter = Counter.builder("notification.published")
               .description("Number of notifications published")
               .register(registry);
               
           this.notificationPushTimer = Timer.builder("notification.push.duration")
               .description("Time taken to push notifications")
               .register(registry);
       }
       
       public void recordNotificationCreated() {
           notificationCreatedCounter.increment();
       }
       
       public void recordNotificationPublished() {
           notificationPublishedCounter.increment();
       }
       
       public Timer.Sample startPushTimer() {
           return Timer.start();
       }
       
       public void recordPushDuration(Timer.Sample sample) {
           sample.stop(notificationPushTimer);
       }
   }
   ```

#### 日志管理

1. **分布式追踪**：
   ```java
   @Aspect
   @Component
   public class NotificationServiceTracing {
       
       private static final Logger log = LoggerFactory.getLogger(NotificationServiceTracing.class);
       
       @Around("execution(* com.smartcampus.notification.service.*.*(..))")
       public Object traceMethod(ProceedingJoinPoint joinPoint) throws Throwable {
           String methodName = joinPoint.getSignature().toShortString();
           String traceId = MDC.get("traceId");
           if (traceId == null) {
               traceId = UUID.randomUUID().toString();
               MDC.put("traceId", traceId);
           }
           
           log.info("Enter: {} with traceId: {}", methodName, traceId);
           long startTime = System.currentTimeMillis();
           
           try {
               Object result = joinPoint.proceed();
               long endTime = System.currentTimeMillis();
               log.info("Exit: {} took {}ms", methodName, endTime - startTime);
               return result;
           } catch (Exception e) {
               log.error("Error in {}: {}", methodName, e.getMessage(), e);
               throw e;
           } finally {
               MDC.remove("traceId");
           }
       }
   }
   ```

2. **ELK集成**：
   ```xml
   <!-- logback-spring.xml -->
   <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
       <destination>logstash:5000</destination>
       <encoder class="net.logstash.logback.encoder.LogstashEncoder">
           <includeMdc>true</includeMdc>
           <customFields>{"app":"notification-service","env":"${ENV}"}</customFields>
       </encoder>
   </appender>
   
   <root level="INFO">
       <appender-ref ref="CONSOLE" />
       <appender-ref ref="FILE" />
       <appender-ref ref="LOGSTASH" />
   </root>
   ```

### 9.4 运维自动化

#### 部署自动化

1. **Kubernetes Deployment YAML**：
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: notification-service
     namespace: smartcampus
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: notification-service
     template:
       metadata:
         labels:
           app: notification-service
       spec:
         containers:
         - name: notification-service
           image: registry.smartcampus.com/notification-service:${VERSION}
           ports:
           - containerPort: 8080
           livenessProbe:
             httpGet:
               path: /actuator/health/liveness
               port: 8080
             initialDelaySeconds: 60
             periodSeconds: 15
           readinessProbe:
             httpGet:
               path: /actuator/health/readiness
               port: 8080
             initialDelaySeconds: 30
             periodSeconds: 10
           env:
           - name: SPRING_PROFILES_ACTIVE
             value: prod
           - name: DB_PASSWORD
             valueFrom:
               secretKeyRef:
                 name: db-credentials
                 key: password
           resources:
             limits:
               memory: "1Gi"
               cpu: "500m"
             requests:
               memory: "512Mi"
               cpu: "250m"
         imagePullSecrets:
         - name: registry-credentials
   ```

2. **CI/CD Pipeline**：
   ```yaml
   # .gitlab-ci.yml
   stages:
     - build
     - test
     - package
     - deploy
   
   variables:
     MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"
   
   cache:
     paths:
       - .m2/repository
   
   build:
     stage: build
     script:
       - mvn clean compile
   
   test:
     stage: test
     script:
       - mvn test
   
   package:
     stage: package
     script:
       - mvn package -DskipTests
       - docker build -t registry.smartcampus.com/notification-service:$CI_COMMIT_SHORT_SHA .
       - docker push registry.smartcampus.com/notification-service:$CI_COMMIT_SHORT_SHA
   
   deploy-dev:
     stage: deploy
     environment: development
     script:
       - kubectl set image deployment/notification-service notification-service=registry.smartcampus.com/notification-service:$CI_COMMIT_SHORT_SHA -n smartcampus-dev
     only:
       - develop
   
   deploy-prod:
     stage: deploy
     environment: production
     script:
       - kubectl set image deployment/notification-service notification-service=registry.smartcampus.com/notification-service:$CI_COMMIT_SHORT_SHA -n smartcampus
     only:
       - master
     when: manual
   ```

## 10. 未来扩展点

### 10.1 功能扩展点

#### 内容个性化推荐

```java
/**
 * 通知推荐服务接口
 */
public interface NotificationRecommendationService {
    
    /**
     * 基于用户画像和行为推荐通知
     * @param userId 用户ID
     * @param count 推荐数量
     * @return 推荐的通知列表
     */
    List<NotificationDTO> recommendForUser(Long userId, int count);
    
    /**
     * 基于相似度推荐相关通知
     * @param notificationId 当前通知ID
     * @param count 推荐数量
     * @return 相关通知列表
     */
    List<NotificationDTO> findSimilarNotifications(Long notificationId, int count);
    
    /**
     * 学习用户兴趣偏好
     * @param userId 用户ID
     * @param notificationId 通知ID
     * @param interactionType 交互类型（阅读、点赞、收藏等）
     */
    void learnUserPreference(Long userId, Long notificationId, String interactionType);
}
```

#### 多渠道集成

扩展现有通知发送渠道，包括：

1. **企业微信集成**：
   ```java
   @Service
   public class WeChatWorkNotificationSender implements NotificationSender {
       
       @Override
       public void send(List<Long> userIds, NotificationPushMessage message) {
           // 实现企业微信消息推送
       }
   }
   ```

2. **钉钉集成**：
   ```java
   @Service
   public class DingTalkNotificationSender implements NotificationSender {
       
       @Override
       public void send(List<Long> userIds, NotificationPushMessage message) {
           // 实现钉钉消息推送
       }
   }
   ```

3. **自定义渠道策略**：
   ```java
   @Service
   public class CustomChannelSelector {
       
       /**
        * 基于用户设置和通知重要性选择推送渠道
        */
       public List<String> selectChannels(Long userId, NotificationImportance importance) {
           // 实现渠道选择逻辑
       }
   }
   ```

### 10.2 技术扩展点

#### 内容智能分析

1. **文本分析服务**：
   ```java
   public interface TextAnalysisService {
       
       /**
        * 提取通知关键词
        */
       List<String> extractKeywords(String content, int count);
       
       /**
        * 自动生成通知摘要
        */
       String generateSummary(String content, int maxLength);
       
       /**
        * 检测敏感内容
        */
       ContentSafetyResult detectSensitiveContent(String content);
       
       /**
        * 对通知内容进行分类
        */
       List<ContentCategory> categorizeContent(String content);
   }
   ```

2. **集成AI服务**：
   ```java
   @Configuration
   public class AIServiceConfig {
       
       @Bean
       public TextAnalysisService textAnalysisService() {
           // 根据环境配置选择不同实现
           if (isDevEnvironment()) {
               return new LocalTextAnalysisService();
           } else {
               return new AICloudTextAnalysisService(apiKey, endpoint);
           }
       }
   }
   ```

#### 性能扩展

1. **分库分表方案**：
   ```java
   @Configuration
   public class ShardingConfig {
       
       @Bean
       public DataSource shardingDataSource() {
           // 配置读写分离和分片规则
           Map<String, DataSource> dataSourceMap = createDataSourceMap();
           
           // 配置通知表分片规则
           TableRuleConfiguration notificationTableRule = new TableRuleConfiguration("sm_notification");
           notificationTableRule.setDatabaseShardingStrategyConfig(
               new StandardShardingStrategyConfiguration("id", "notificationDatabaseShardingAlgorithm"));
           notificationTableRule.setTableShardingStrategyConfig(
               new StandardShardingStrategyConfiguration("created_time", "notificationTableShardingAlgorithm"));
           
           // 配置其他表分片规则...
           
           ShardingRuleConfiguration shardingRuleConfig = new ShardingRuleConfiguration();
           shardingRuleConfig.getTableRuleConfigs().add(notificationTableRule);
           
           return ShardingDataSourceFactory.createDataSource(dataSourceMap, shardingRuleConfig, new Properties());
       }
   }
   ```

2. **查询性能优化**：
   ```java
   public interface NotificationRepositoryCustom {
       
       /**
        * 高性能通知列表查询（动态索引选择）
        */
       Page<Notification> findNotificationsByDynamicCondition(NotificationQueryCondition condition, Pageable pageable);
       
       /**
        * 全文检索通知
        */
       Page<Notification> searchNotifications(String keyword, Pageable pageable);
   }
   ```

### 10.3 规模扩展点

#### 多租户支持

```java
/**
 * 多租户上下文
 */
public class TenantContext {
    
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    
    public static void setTenant(String tenantId) {
        CURRENT_TENANT.set(tenantId);
    }
    
    public static String getTenant() {
        return CURRENT_TENANT.get();
    }
    
    public static void clear() {
        CURRENT_TENANT.remove();
    }
}

/**
 * 租户数据过滤器
 */
@Component
public class TenantFilterInterceptor extends HandlerInterceptorAdapter {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String tenantId = extractTenantId(request);
        TenantContext.setTenant(tenantId);
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) {
        TenantContext.clear();
    }
    
    private String extractTenantId(HttpServletRequest request) {
        // 从请求头、域名或其他位置提取租户ID
    }
}
```

#### 国际化支持

```java
@Configuration
public class InternationalizationConfig {
    
    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver resolver = new SessionLocaleResolver();
        resolver.setDefaultLocale(Locale.SIMPLIFIED_CHINESE);
        return resolver;
    }
    
    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }
    
    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:i18n/messages");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(3600);
        return messageSource;
    }
}
```

### 10.4 集成扩展点

#### 工作流集成

```java
/**
 * 通知审核工作流
 */
public interface NotificationApprovalWorkflow {
    
    /**
     * 启动审核流程
     * @param notificationId 通知ID
     * @return 流程实例ID
     */
    String startApprovalProcess(Long notificationId);
    
    /**
     * 完成审核任务
     * @param taskId 任务ID
     * @param approved 是否批准
     * @param comment 审核意见
     */
    void completeApprovalTask(String taskId, boolean approved, String comment);
    
    /**
     * 获取待处理任务
     * @param userId 用户ID
     * @return 任务列表
     */
    List<ApprovalTask> getPendingTasks(Long userId);
    
    /**
     * 查询流程状态
     * @param processInstanceId 流程实例ID
     * @return 流程状态
     */
    ApprovalProcessStatus getProcessStatus(String processInstanceId);
}
```

#### 移动端适配

```java
/**
 * 移动端通知适配器
 */
@Component
public class MobileNotificationAdapter {
    
    /**
     * 转换通知为移动端友好格式
     */
    public MobileNotificationDTO adaptForMobile(NotificationDTO notification) {
        MobileNotificationDTO mobileDTO = new MobileNotificationDTO();
        mobileDTO.setId(notification.getId());
        mobileDTO.setTitle(notification.getTitle());
        
        // 处理内容
        String plainContent = HtmlUtils.htmlToText(notification.getContent());
        mobileDTO.setSummary(StringUtils.abbreviate(plainContent, 100));
        
        // 提取内容中的图片
        List<String> imageUrls = extractImagesFromHtml(notification.getContent());
        mobileDTO.setImageUrls(imageUrls);
        
        // 设置移动端特定属性
        mobileDTO.setBadgeCount(1); // 移动端红点数
        mobileDTO.setNotificationSound(determineSound(notification.getImportance()));
        mobileDTO.setDeepLinkUrl(buildDeepLink(notification));
        
        return mobileDTO;
    }
    
    /**
     * 构建离线通知包
     */
    public List<MobileNotificationDTO> buildOfflinePackage(Long userId, LocalDateTime lastSyncTime) {
        // 获取用户未同步的通知并转换为移动端格式
    }
}
```

## 11. 总结

### 11.1 核心设计决策

1. **模块化设计**：
   - 将信息公开功能分解为通知公告、政策文件、活动管理等组件
   - 采用分层架构提高代码清晰度和可维护性
   - 使用组件化思想实现业务功能可插拔

2. **缓存策略**：
   - 多级缓存结构提升性能和用户体验
   - 针对不同数据类型采用不同缓存策略
   - 缓存一致性机制确保数据准确性

3. **安全考量**：
   - 细粒度权限控制保障敏感操作安全
   - 数据脱敏和加密保护敏感信息
   - 输入验证防止XSS和注入攻击

### 11.2 风险与缓解策略

| 风险 | 影响 | 缓解策略 |
|-----|-----|---------|
| 数据量增长导致性能下降 | 中等 | 分页查询、索引优化、冷热数据分离 |
| 高并发场景下系统稳定性 | 高 | 限流、熔断、异步处理、水平扩展 |
| 敏感信息泄露 | 高 | 数据加密、脱敏处理、权限控制、安全审计 |
| 第三方服务依赖不稳定 | 中等 | 熔断降级、超时控制、备用服务、异步重试 |
| 业务需求快速变化 | 中等 | 模块化设计、插件机制、配置中心、灰度发布 |

### 11.3 演进路径

1. **近期目标（3个月）**：
   - 完成核心通知公告功能
   - 实现基础政策文件管理
   - 建立稳定的审核流程

2. **中期目标（6-12个月）**：
   - 完善活动管理和问卷调查功能
   - 增强统计分析和可视化能力
   - 优化移动端体验和推送机制

3. **长期目标（1年以上）**：
   - 引入智能推荐和内容分析
   - 实现多租户支持
   - 扩展集成能力与开放API

信息公开子模块设计充分考虑了业务需求、技术实现、性能优化和未来扩展，为智慧园区系统提供全面、高效的信息发布与沟通渠道，支持园区管理透明化和信息高效流通。
```




