

以下是需要拆分为独立代码文件的关键代码实现：

### 1. 控制器层代码

**通知控制器 (NotificationController.java)**
```java
package com.smartcampus.notification.controller;

import com.smartcampus.notification.dto.NotificationDTO;
import com.smartcampus.notification.dto.NotificationCreateRequest;
import com.smartcampus.notification.dto.NotificationUpdateRequest;
import com.smartcampus.notification.dto.NotificationReviewRequest;
import com.smartcampus.notification.dto.NotificationPublishRequest;
import com.smartcampus.notification.dto.NotificationStatisticsDTO;
import com.smartcampus.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "通知公告管理", description = "通知公告的CRUD操作和状态管理")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
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
    
    @GetMapping("/{id}")
    @Operation(summary = "获取通知详情", description = "根据ID获取通知的详细信息")
    public ResponseEntity<NotificationDTO> getNotification(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id) {
        
        NotificationDTO notification = notificationService.getNotification(id);
        return ResponseEntity.ok(notification);
    }
    
    @PostMapping
    @Operation(summary = "创建通知", description = "创建新的通知公告，初始状态为草稿")
    public ResponseEntity<NotificationDTO> createNotification(
            @Parameter(description = "通知创建请求", required = true)
            @Valid @RequestBody NotificationCreateRequest request) {
        
        NotificationDTO created = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
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
    
    @PostMapping("/{id}/submit")
    @Operation(summary = "提交通知审核", description = "将草稿状态的通知提交审核")
    public ResponseEntity<NotificationDTO> submitForReview(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id) {
        
        NotificationDTO submitted = notificationService.submitForReview(id);
        return ResponseEntity.ok(submitted);
    }
    
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
    
    @GetMapping("/{id}/statistics")
    @Operation(summary = "获取通知阅读统计", description = "获取通知的阅读和确认统计数据")
    public ResponseEntity<NotificationStatisticsDTO> getNotificationStatistics(
            @Parameter(description = "通知ID", required = true)
            @PathVariable Long id) {
        
        NotificationStatisticsDTO statistics = notificationService.getNotificationStatistics(id);
        return ResponseEntity.ok(statistics);
    }
}
```

### 2. 服务层代码

**通知服务接口 (NotificationService.java)**
```java
package com.smartcampus.notification.service;

import com.smartcampus.notification.dto.NotificationDTO;
import com.smartcampus.notification.dto.NotificationCreateRequest;
import com.smartcampus.notification.dto.NotificationUpdateRequest;
import com.smartcampus.notification.dto.NotificationReviewRequest;
import com.smartcampus.notification.dto.NotificationPublishRequest;
import com.smartcampus.notification.dto.NotificationStatisticsDTO;
import com.smartcampus.notification.enums.NotificationStatus;
import com.smartcampus.notification.enums.NotificationImportance;
import com.smartcampus.notification.enums.NotificationType;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;

public interface NotificationService {

    /**
     * 分页查询通知列表
     */
    Page<NotificationDTO> getNotifications(
            String title, 
            NotificationType type, 
            NotificationStatus status, 
            NotificationImportance importance, 
            LocalDateTime startTime, 
            LocalDateTime endTime, 
            int page, 
            int size);
    
    /**
     * 获取通知详情
     */
    NotificationDTO getNotification(Long id);
    
    /**
     * 创建通知
     */
    NotificationDTO createNotification(NotificationCreateRequest request);
    
    /**
     * 更新通知
     */
    NotificationDTO updateNotification(Long id, NotificationUpdateRequest request);
    
    /**
     * 提交通知审核
     */
    NotificationDTO submitForReview(Long id);
    
    /**
     * 审核通知
     */
    NotificationDTO reviewNotification(Long id, NotificationReviewRequest request);
    
    /**
     * 发布通知
     */
    NotificationDTO publishNotification(Long id, NotificationPublishRequest request);
    
    /**
     * 设置通知置顶状态
     */
    NotificationDTO setNotificationTopStatus(Long id, boolean isTop);
    
    /**
     * 撤回通知
     */
    NotificationDTO recallNotification(Long id, String reason);
    
    /**
     * 获取通知阅读统计
     */
    NotificationStatisticsDTO getNotificationStatistics(Long id);
    
    /**
     * 归档过期通知
     */
    void archiveExpiredNotifications();
}
```

**通知服务实现 (NotificationServiceImpl.java)**
```java
package com.smartcampus.notification.service.impl;

import com.smartcampus.notification.converter.NotificationConverter;
import com.smartcampus.notification.domain.Notification;
import com.smartcampus.notification.dto.NotificationDTO;
import com.smartcampus.notification.dto.NotificationCreateRequest;
import com.smartcampus.notification.dto.NotificationUpdateRequest;
import com.smartcampus.notification.dto.NotificationReviewRequest;
import com.smartcampus.notification.dto.NotificationPublishRequest;
import com.smartcampus.notification.dto.NotificationStatisticsDTO;
import com.smartcampus.notification.dto.NotificationPushMessage;
import com.smartcampus.notification.dto.CompanyReadStatistics;
import com.smartcampus.notification.enums.NotificationStatus;
import com.smartcampus.notification.enums.NotificationImportance;
import com.smartcampus.notification.enums.NotificationType;
import com.smartcampus.notification.event.NotificationCreatedEvent;
import com.smartcampus.notification.event.NotificationUpdatedEvent;
import com.smartcampus.notification.event.NotificationReviewedEvent;
import com.smartcampus.notification.event.NotificationPushCompletedEvent;
import com.smartcampus.notification.event.NotificationRecalledEvent;
import com.smartcampus.notification.event.NotificationsArchivedEvent;
import com.smartcampus.notification.exception.ResourceNotFoundException;
import com.smartcampus.notification.exception.BusinessException;
import com.smartcampus.notification.exception.AccessDeniedException;
import com.smartcampus.notification.repository.NotificationRepository;
import com.smartcampus.notification.repository.NotificationReadRepository;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.notification.service.AudienceService;
import com.smartcampus.notification.service.SecurityService;
import com.smartcampus.notification.service.MessageService;
import com.smartcampus.notification.service.PushService;
import com.smartcampus.notification.service.SmsService;
import com.smartcampus.notification.service.SchedulerService;
import com.smartcampus.notification.util.SecurityUtils;
import com.smartcampus.notification.util.HtmlUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private NotificationReadRepository notificationReadRepository;
    
    @Autowired
    private AudienceService audienceService;
    
    @Autowired
    private SecurityService securityService;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private PushService pushService;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private SchedulerService schedulerService;
    
    @Autowired
    private CacheManager cacheManager;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Override
    public Page<NotificationDTO> getNotifications(
            String title, 
            NotificationType type, 
            NotificationStatus status, 
            NotificationImportance importance, 
            LocalDateTime startTime, 
            LocalDateTime endTime, 
            int page, 
            int size) {
        
        // 创建查询规范
        Specification<Notification> spec = createSpecification(title, type, status, importance, startTime, endTime);
        
        // 创建分页对象，按照置顶状态和发布时间倒序排序
        Pageable pageable = PageRequest.of(page, size, Sort.by(
            Sort.Order.desc("isTop"),
            Sort.Order.desc("publishTime")
        ));
        
        // 执行查询
        Page<Notification> notificationsPage = notificationRepository.findAll(spec, pageable);
        
        // 转换为DTO
        return notificationsPage.map(NotificationConverter::toDTO);
    }
    
    @Override
    public NotificationDTO getNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        return NotificationConverter.toDTO(notification);
    }
    
    @Override
    @Transactional
    public NotificationDTO createNotification(NotificationCreateRequest request) {
        // 创建通知对象
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setType(request.getType());
        notification.setImportance(request.getImportance());
        notification.setTargetAudience(request.getTargetAudience());
        notification.setStatus(NotificationStatus.DRAFT);
        notification.setIsTop(false);
        notification.setRequireConfirmation(request.isRequireConfirmation());
        notification.setConfirmationDeadline(request.getConfirmationDeadline());
        notification.setAttachments(request.getAttachments());
        notification.setExpirationDate(request.getExpirationDate());
        notification.setCreatedBy(SecurityUtils.getCurrentUserId());
        notification.setCreatedTime(LocalDateTime.now());
        
        // 保存通知
        Notification savedNotification = notificationRepository.save(notification);
        
        // 发布通知创建事件
        eventPublisher.publishEvent(new NotificationCreatedEvent(savedNotification));
        
        return NotificationConverter.toDTO(savedNotification);
    }
    
    @Override
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


```java
    @Override
    @Transactional
    public NotificationDTO submitForReview(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证状态
        if (notification.getStatus() != NotificationStatus.DRAFT) {
            throw new BusinessException("只有草稿状态的通知可以提交审核");
        }
        
        // 验证权限
        if (!securityService.canManageNotification(notification)) {
            throw new AccessDeniedException("没有权限提交该通知");
        }
        
        // 更新状态
        notification.setStatus(NotificationStatus.PENDING_REVIEW);
        notification.setSubmitTime(LocalDateTime.now());
        notification.setUpdateTime(LocalDateTime.now());
        notification.setUpdateBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        return NotificationConverter.toDTO(saved);
    }
    
    @Override
    @Transactional
    public NotificationDTO reviewNotification(Long id, NotificationReviewRequest request) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证状态
        if (notification.getStatus() != NotificationStatus.PENDING_REVIEW) {
            throw new BusinessException("只有待审核状态的通知可以进行审核");
        }
        
        // 验证权限
        if (!securityService.canReviewNotification()) {
            throw new AccessDeniedException("没有权限审核通知");
        }
        
        // 更新状态
        if (request.isApproved()) {
            notification.setStatus(NotificationStatus.APPROVED);
        } else {
            notification.setStatus(NotificationStatus.REJECTED);
            notification.setRejectReason(request.getReason());
        }
        
        notification.setReviewTime(LocalDateTime.now());
        notification.setReviewBy(SecurityUtils.getCurrentUserId());
        notification.setUpdateTime(LocalDateTime.now());
        notification.setUpdateBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        // 发布通知审核事件
        eventPublisher.publishEvent(new NotificationReviewedEvent(saved, request.isApproved()));
        
        return NotificationConverter.toDTO(saved);
    }
    
    @Override
    @Transactional
    public NotificationDTO publishNotification(Long id, NotificationPublishRequest request) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证状态
        if (notification.getStatus() != NotificationStatus.APPROVED) {
            throw new BusinessException("只有审核通过的通知可以发布");
        }
        
        // 验证权限
        if (!securityService.canPublishNotification()) {
            throw new AccessDeniedException("没有权限发布通知");
        }
        
        LocalDateTime publishTime = request.getPublishTime();
        if (publishTime == null || publishTime.isBefore(LocalDateTime.now())) {
            // 立即发布
            publishTime = LocalDateTime.now();
            notification.setStatus(NotificationStatus.PUBLISHED);
            notification.setPublishTime(publishTime);
            notification.setPublishBy(SecurityUtils.getCurrentUserId());
            
            // 推送通知
            pushNotification(notification);
        } else {
            // 定时发布
            notification.setStatus(NotificationStatus.SCHEDULED);
            notification.setScheduledPublishTime(publishTime);
            
            // 创建定时任务
            schedulerService.scheduleNotificationPublishing(id, publishTime);
        }
        
        notification.setUpdateTime(LocalDateTime.now());
        notification.setUpdateBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        return NotificationConverter.toDTO(saved);
    }
    
    @Override
    @Transactional
    public NotificationDTO setNotificationTopStatus(Long id, boolean isTop) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证权限
        if (!securityService.canManageNotification(notification)) {
            throw new AccessDeniedException("没有权限设置通知置顶状态");
        }
        
        notification.setIsTop(isTop);
        notification.setUpdateTime(LocalDateTime.now());
        notification.setUpdateBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        return NotificationConverter.toDTO(saved);
    }
    
    @Override
    @Transactional
    public NotificationDTO recallNotification(Long id, String reason) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 验证状态
        if (notification.getStatus() != NotificationStatus.PUBLISHED) {
            throw new BusinessException("只有已发布的通知可以撤回");
        }
        
        // 验证权限
        if (!securityService.canManageNotification(notification)) {
            throw new AccessDeniedException("没有权限撤回通知");
        }
        
        notification.setStatus(NotificationStatus.RECALLED);
        notification.setRecallReason(reason);
        notification.setRecallTime(LocalDateTime.now());
        notification.setRecallBy(SecurityUtils.getCurrentUserId());
        notification.setUpdateTime(LocalDateTime.now());
        notification.setUpdateBy(SecurityUtils.getCurrentUserId());
        
        Notification saved = notificationRepository.save(notification);
        
        // 发布通知撤回事件
        eventPublisher.publishEvent(new NotificationRecalledEvent(saved));
        
        return NotificationConverter.toDTO(saved);
    }
    
    @Override
    public NotificationStatisticsDTO getNotificationStatistics(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        
        // 获取阅读和确认统计
        int totalTarget = audienceService.getAudienceCount(notification.getTargetAudience());
        int readCount = notificationReadRepository.countByNotificationIdAndIsRead(id, true);
        int confirmCount = notification.isRequireConfirmation() ? 
            notificationReadRepository.countByNotificationIdAndIsConfirmed(id, true) : 0;
        
        // 获取按公司分组的阅读统计
        List<CompanyReadStatistics> companyStatistics = notificationReadRepository.getCompanyReadStatistics(id);
        
        NotificationStatisticsDTO statistics = new NotificationStatisticsDTO();
        statistics.setNotificationId(id);
        statistics.setTotalTargetCount(totalTarget);
        statistics.setReadCount(readCount);
        statistics.setReadRate(totalTarget > 0 ? (double) readCount / totalTarget : 0);
        statistics.setConfirmCount(confirmCount);
        statistics.setConfirmRate(totalTarget > 0 ? (double) confirmCount / totalTarget : 0);
        statistics.setCompanyStatistics(companyStatistics);
        
        return statistics;
    }
    
    @Override
    @Scheduled(cron = "0 0 1 * * ?")  // 每天凌晨1点执行
    @Transactional
    public void archiveExpiredNotifications() {
        LocalDateTime now = LocalDateTime.now();
        
        // 查找已过期的通知
        List<Notification> expiredNotifications = notificationRepository.findByStatusAndExpirationDateBefore(
            NotificationStatus.PUBLISHED, now);
            
        if (!expiredNotifications.isEmpty()) {
            // 更新状态为已归档
            expiredNotifications.forEach(notification -> {
                notification.setStatus(NotificationStatus.ARCHIVED);
                notification.setArchiveTime(now);
            });
            
            notificationRepository.saveAll(expiredNotifications);
            
            // 发布归档事件
            eventPublisher.publishEvent(new NotificationsArchivedEvent(expiredNotifications));
            
            log.info("Archived {} expired notifications", expiredNotifications.size());
        }
    }
    
    /**
     * 推送通知到目标受众
     */
    private void pushNotification(Notification notification) {
        // 获取目标用户
        List<Long> targetUserIds = audienceService.resolveTargetUsers(notification.getTargetAudience());
        
        // 准备推送消息
        NotificationPushMessage pushMessage = new NotificationPushMessage();
        pushMessage.setNotificationId(notification.getId());
        pushMessage.setTitle(notification.getTitle());
        pushMessage.setContent(HtmlUtils.htmlToText(notification.getContent()));
        pushMessage.setType(notification.getType());
        pushMessage.setImportance(notification.getImportance());
        pushMessage.setRequireConfirmation(notification.isRequireConfirmation());
        pushMessage.setConfirmationDeadline(notification.getConfirmationDeadline());
        
        // 推送到消息中心
        messageService.sendNotification(targetUserIds, pushMessage);
        
        // 重要通知发送短信提醒
        if (notification.getImportance() == NotificationImportance.HIGH) {
            smsService.sendNotificationAlert(targetUserIds, notification.getTitle());
        }
        
        // 应用内推送
        pushService.pushNotification(targetUserIds, pushMessage);
        
        // 发布推送完成事件
        eventPublisher.publishEvent(new NotificationPushCompletedEvent(notification, targetUserIds.size()));
    }
    
    /**
     * 创建查询规范
     */
    private Specification<Notification> createSpecification(
            String title, 
            NotificationType type, 
            NotificationStatus status, 
            NotificationImportance importance, 
            LocalDateTime startTime, 
            LocalDateTime endTime) {
        
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();
            
            if (StringUtils.isNotBlank(title)) {
                predicate = cb.and(predicate, cb.like(root.get("title"), "%" + title + "%"));
            }
            
            if (type != null) {
                predicate = cb.and(predicate, cb.equal(root.get("type"), type));
            }
            
            if (status != null) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), status));
            }
            
            if (importance != null) {
                predicate = cb.and(predicate, cb.equal(root.get("importance"), importance));
            }
            
            if (startTime != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("publishTime"), startTime));
            }
            
            if (endTime != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("publishTime"), endTime));
            }
            
            return predicate;
        };
    }
}
```

### 3. 实体类

**通知实体 (Notification.java)**
```java
package com.smartcampus.notification.domain;

import com.smartcampus.notification.enums.NotificationStatus;
import com.smartcampus.notification.enums.NotificationImportance;
import com.smartcampus.notification.enums.NotificationType;
import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "notification")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationImportance importance;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;
    
    @Column(nullable = false)
    private Boolean isTop;
    
    @Type(type = "json")
    @Column(columnDefinition = "json")
    private Object targetAudience;
    
    @Column(nullable = false)
    private Boolean requireConfirmation;
    
    @Column
    private LocalDateTime confirmationDeadline;
    
    @Type(type = "json")
    @Column(columnDefinition = "json")
    private List<Attachment> attachments;
    
    @Column
    private LocalDateTime expirationDate;
    
    @Column
    private LocalDateTime scheduledPublishTime;
    
    @Column
    private LocalDateTime publishTime;
    
    @Column
    private Long publishBy;
    
    @Column
    private LocalDateTime submitTime;
    
    @Column
    private LocalDateTime reviewTime;
    
    @Column
    private Long reviewBy;
    
    @Column(length = 500)
    private String rejectReason;
    
    @Column
    private LocalDateTime recallTime;
    
    @Column
    private Long recallBy;
    
    @Column(length = 500)
    private String recallReason;
    
    @Column
    private LocalDateTime archiveTime;
    
    @Column(nullable = false)
    private Long createdBy;
    
    @Column(nullable = false)
    private LocalDateTime createdTime;
    
    @Column
    private Long updateBy;
    
    @Column
    private LocalDateTime updateTime;
}
```

**附件实体 (Attachment.java)**
```java
package com.smartcampus.notification.domain;

import lombok.Data;

@Data
public class Attachment {
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
}
```

**通知阅读记录实体 (NotificationRead.java)**
```java
package com.smartcampus.notification.domain;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_read", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"notification_id", "user_id"}))
@Data
public class NotificationRead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "notification_id", nullable = false)
    private Long notificationId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Boolean isRead;
    
    @Column
    private LocalDateTime readTime;
    
    @Column(nullable = false)
    private Boolean isConfirmed;
    
    @Column
    private LocalDateTime confirmTime;
    
    @Column(name = "company_id")
    private Long companyId;
}
```

### 4. DTO类

**通知DTO (NotificationDTO.java)**
```java
package com.smartcampus.notification.dto;

import com.smartcampus.notification.domain.Attachment;
import com.smartcampus.notification.enums.NotificationStatus;
import com.smartcampus.notification.enums.NotificationImportance;
import com.smartcampus.notification.enums.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class NotificationDTO {
    private Long id;
    private String title;
    private String content;
    private NotificationType type;
    private NotificationImportance importance;
    private NotificationStatus status;
    private Boolean isTop;
    private Object targetAudience;
    private Boolean requireConfirmation;
    private LocalDateTime confirmationDeadline;
    private List<Attachment> attachments;
    private LocalDateTime expirationDate;
    private LocalDateTime scheduledPublishTime;
    private LocalDateTime publishTime;
    private String publisherName;
    private LocalDateTime submitTime;
    private LocalDateTime reviewTime;
    private String reviewerName;
    private String rejectReason;
    private LocalDateTime recallTime;
    private String recallerName;
    private String recallReason;
    private LocalDateTime archiveTime;
    private String creatorName;
    private LocalDateTime createdTime;
    private Boolean isRead;
    private Boolean isConfirmed;
}
```

**通知创建请求 (NotificationCreateRequest.java)**
```java
package com.smartcampus.notification.dto;

import com.smartcampus.notification.domain.Attachment;
import com.smartcampus.notification.enums.NotificationImportance;
import com.smartcampus.notification.enums.NotificationType;
import lombok.Data;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class NotificationCreateRequest {
    @NotBlank(message = "标题不能为空")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    @NotNull(message = "通知类型不能为空")
    private NotificationType type;
    
    @NotNull(message = "重要性不能为空")
    private NotificationImportance importance;
    
    @NotNull(message = "目标受众不能为空")
    private Object targetAudience;
    
    @NotNull(message = "是否需要确认不能为空")
    private boolean requireConfirmation;
    
    @Future(message = "确认截止时间必须是未来时间")
    private LocalDateTime confirmationDeadline;
    
    private List<Attachment> attachments;
    
    @Future(message = "过期时间必须是未来时间")
    private LocalDateTime expirationDate;
}
```

**通知更新请求 (NotificationUpdateRequest.java)**
```java
package com.smartcampus.notification.dto;

import com.smartcampus.notification.domain.Attachment;
import com.smartcampus.notification.enums.NotificationImportance;
import com.smartcampus.notification.enums.NotificationType;
import lombok.Data;

import javax.validation.constraints.Future;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class NotificationUpdateRequest {
    private String title;
    private String content;
    private NotificationType type;
    private NotificationImportance importance;
    private Object targetAudience;
    private List<Attachment> attachments;
    
    @Future(message = "过期时间必须是未来时间")
    private LocalDateTime expirationDate;
}
```

**通知审核请求 (NotificationReviewRequest.java)**
```java
package com.smartcampus.notification.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class NotificationReviewRequest {
    @NotNull(message = "审核结果不能为空")
    private boolean approved;
    
    @Size(max = 500, message = "拒绝原因不能超过500个字符")
    private String reason;
}
```

**通知发布请求 (NotificationPublishRequest.java)**
```java
package com.smartcampus.notification.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationPublishRequest {
    private LocalDateTime publishTime;
}
```

**通知统计DTO (NotificationStatisticsDTO.java)**
```java
package com.smartcampus.notification.dto;

import lombok.Data;

import java.util.List;

@Data
public class NotificationStatisticsDTO {
    private Long notificationId;
    private int totalTargetCount;
    private int readCount;
    private double readRate;
    private int confirmCount;
    private double confirmRate;
    private List<CompanyReadStatistics> companyStatistics;
}
```

### 5. 安全与数据访问控制

**安全服务 (SecurityService.java)**
```java
package com.smartcampus.notification.service;

import com.smartcampus.notification.domain.Notification;

public interface SecurityService {

    /**
     * 检查当前用户是否可以管理指定通知
     */
    boolean canManageNotification(Notification notification);
    
    /**
     * 检查当前用户是否可以审核通知
     */
    boolean canReviewNotification();
    
    /**
     * 检查当前用户是否可以发布通知
     */
    boolean canPublishNotification();
    
    /**
     * 检查当前用户是否可以访问通知
     */
    boolean canAccessNotification(Long notificationId);
    
    /**
     * 获取当前用户可访问的通知类型
     */
    List<NotificationType> getAccessibleNotificationTypes();
}
```

**安全服务实现 (SecurityServiceImpl.java)**
```java
package com.smartcampus.notification.service.impl;

import com.smartcampus.core.security.SecurityConstants;
import com.smartcampus.notification.domain.Notification;
import com.smartcampus.notification.enums.NotificationType;
import com.smartcampus.notification.repository.NotificationRepository;
import com.smartcampus.notification.service.AudienceService;
import com.smartcampus.notification.service.SecurityService;
import com.smartcampus.notification.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecurityServiceImpl implements SecurityService {

    @Autowired
    private AudienceService audienceService;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Override
    public boolean canManageNotification(Notification notification) {
        // 系统管理员和通知管理员可以管理所有通知
        if (SecurityUtils.hasAnyRole(SecurityConstants.ROLE_ADMIN, SecurityConstants.ROLE_NOTIFICATION_ADMIN)) {
            return true;
        }
        
        // 通知创建者可以管理自己创建的通知
        return notification.getCreatedBy().equals(SecurityUtils.getCurrentUserId());
    }
    
    @Override
    public boolean canReviewNotification() {
        // 系统管理员和通知审核员可以审核通知
        return SecurityUtils.hasAnyRole(
            SecurityConstants.ROLE_ADMIN, 
            SecurityConstants.ROLE_NOTIFICATION_REVIEWER
        );
    }
    
    @Override
    public boolean canPublishNotification() {
        // 系统管理员和通知发布员可以发布通知
        return SecurityUtils.hasAnyRole(
            SecurityConstants.ROLE_ADMIN, 
            SecurityConstants.ROLE_NOTIFICATION_PUBLISHER
        );
    }
    
    @Override
    public boolean canAccessNotification(Long notificationId) {
        // 管理员可以访问所有通知
        if (SecurityUtils.hasAnyRole(SecurityConstants.ROLE_ADMIN)) {
            return true;
        }
        
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification == null) {
            return false;
        }
        
        // 创建者可以访问自己创建的通知
        if (notification.getCreatedBy().equals(SecurityUtils.getCurrentUserId())) {
            return true;
        }
        
        // 目标受众可以访问发布给他们的通知
        return audienceService.isUserInAudience(SecurityUtils.getCurrentUserId(), notification.getTargetAudience());
    }
    
    @Override
    public List<NotificationType> getAccessibleNotificationTypes() {
        // 根据不同角色返回可访问的通知类型
        if (SecurityUtils.hasAnyRole(SecurityConstants.ROLE_ADMIN)) {
            return Arrays.asList(NotificationType.values());
        }
        
        return SecurityUtils.getCurrentUserAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(this::mapRoleToNotificationType)
            .filter(type -> type != null)
            .collect(Collectors.toList());
    }
    
    /**
     * 根据角色映射可访问的通知类型
     */
    private NotificationType mapRoleToNotificationType(String role) {
        switch (role) {
            case SecurityConstants.ROLE_NOTIFICATION_ADMIN:
                return null; // 可以访问所有类型，在Controller层特殊处理
            case SecurityConstants.ROLE_PROPERTY_ADMIN:
                return NotificationType.PROPERTY;
            case SecurityConstants.ROLE_EVENT_ADMIN:
                return NotificationType.EVENT;
            case SecurityConstants.ROLE_EMERGENCY_ADMIN:
                return NotificationType.EMERGENCY;
            case SecurityConstants.ROLE_POLICY_ADMIN:
                return NotificationType.POLICY;
            default:
                return null;
        }
    }
}
```

### 6. 安全防护实现

**XSS防护过滤器 (XssFilter.java)**
```java
package com.smartcampus.notification.security;

import com.smartcampus.notification.security.wrapper.XssRequestWrapper;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class XssFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        XssRequestWrapper wrappedRequest = new XssRequestWrapper((HttpServletRequest) request);
        chain.doFilter(wrappedRequest, response);
    }
}
```

**XSS防护包装器 (XssRequestWrapper.java)**
```java
package com.smartcampus.notification.security.wrapper;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.util.Arrays;
import java.util.List;

public class XssRequestWrapper extends HttpServletRequestWrapper {

    private static final List<String> CONTENT_TYPES = Arrays.asList("application/json", "application/xml");
    
    public XssRequestWrapper(HttpServletRequest request) {
        super(request);
    }
    
    @Override
    public String getParameter(String name) {
        String value = super.getParameter(name);
        return stripXss(value);
    }
    
    @Override
    public String[] getParameterValues(String name) {
        String[] values = super.getParameterValues(name);
        
        if (values == null) {
            return null;
        }
        
        String[] encodedValues = new String[values.length];
        for (int i = 0; i < values.length; i++) {
            encodedValues[i] = stripXss(values[i]);
        }
        
        return encodedValues;
    }
    
    @Override
    public String getHeader(String name) {
        String value = super.getHeader(name);
        return stripXss(value);
    }
    
    private String stripXss(String value) {
        if (StringUtils.isBlank(value)) {
            return value;
        }
        
        // 使用JSoup清理有潜在XSS风险的HTML
        String contentType = getContentType();
        if (contentType != null && CONTENT_TYPES.stream().anyMatch(contentType::contains)) {
            // 对API请求体不做处理，由后续的消毒处理
            return value;
        }
        
        return Jsoup.clean(value, Safelist.basic());
    }
    
    private String getContentType() {
        return super.getHeader("Content-Type");
    }
}
```

**输入验证工具 (ValidationUtils.java)**
```java
package com.smartcampus.notification.util;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

import java.util.regex.Pattern;

public class ValidationUtils {

    // SQL注入风险字符模式
    private static final Pattern SQL_INJECTION_PATTERN = 
        Pattern.compile("['\"\\\\;%_&|=]");
    
    // 文件路径风险模式
    private static final Pattern FILE_PATH_PATTERN = 
        Pattern.compile("[\\\\/:*?\"<>|]");

    /**
     * 清理HTML内容，允许基本的格式化标签
     */
    public static String sanitizeHtml(String html) {
        if (StringUtils.isBlank(html)) {
            return html;
        }
        return Jsoup.clean(html, Safelist.basicWithImages()
            .addTags("div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "table", "tr", "td", "th")
            .addAttributes("div", "style", "class")
            .addAttributes("span", "style", "class")
            .addAttributes("p", "style", "class")
            .addAttributes("table", "style", "class", "border")
            .addAttributes("tr", "style", "class")
            .addAttributes("td", "style", "class", "colspan", "rowspan")
            .addAttributes("th", "style", "class", "colspan", "rowspan")
            .addAttributes("a", "href", "target", "rel")
            .addProtocols("a", "href", "http", "https")
        );
    }
    
    /**
     * 验证是否存在SQL注入风险
     */
    public static boolean hasSqlInjectionRisk(String input) {
        if (StringUtils.isBlank(input)) {
            return false;
        }
        return SQL_INJECTION_PATTERN.matcher(input).find();
    }
    
    /**
     * 清理SQL注入风险字符
     */
    public static String escapeSqlRisk(String input) {
        if (StringUtils.isBlank(input)) {
            return input;
        }
        return SQL_INJECTION_PATTERN.matcher(input).replaceAll("");
    }
    
    /**
     * 验证并清理文件名
     */
    public static String sanitizeFileName(String fileName) {
        if (StringUtils.isBlank(fileName)) {
            return fileName;
        }
        return FILE_PATH_PATTERN.matcher(fileName).replaceAll("_");
    }
}
```

### 7. 配置管理

**通知模块配置 (NotificationConfig.java)**
```java
package com.smartcampus.notification.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
@EnableAsync
@EnableScheduling
public class NotificationConfig {

    @Value("${notification.cache.ttl.default:30}")
    private int defaultCacheTtl;
    
    @Value("${notification.cache.ttl.notification:60}")
    private int notificationCacheTtl;
    
    @Value("${notification.cache.ttl.statistics:5}")
    private int statisticsCacheTtl;
    
    @Value("${notification.cache.local.enabled:true}")
    private boolean localCacheEnabled;
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        if (localCacheEnabled) {
            return createLocalCacheManager();
        } else {
            return createRedisCacheManager(connectionFactory, objectMapper);
        }
    }
    
    private CacheManager createLocalCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(defaultCacheTtl, TimeUnit.MINUTES)
            .maximumSize(1000));
            
        return cacheManager;
    }
    
    private CacheManager createRedisCacheManager(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);
        
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(defaultCacheTtl))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
            
        RedisCacheConfiguration notificationConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(notificationCacheTtl))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
            
        RedisCacheConfiguration statisticsConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(statisticsCacheTtl))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
            
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withCacheConfiguration("notification", notificationConfig)
            .withCacheConfiguration("notification_statistics", statisticsConfig)
            .build();
    }
}
```

### 8. 监控与日志

**通知监控端点 (NotificationMonitorEndpoint.java)**
```java
package com.smartcampus.notification.actuator;

import com.smartcampus.notification.dto.NotificationMetricsDTO;
import com.smartcampus.notification.repository.NotificationRepository;
import com.smartcampus.notification.repository.NotificationReadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@Endpoint(id = "notifications")
public class NotificationMonitorEndpoint {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private NotificationReadRepository notificationReadRepository;
    
    @ReadOperation
    public NotificationMetricsDTO getMetrics() {
        NotificationMetricsDTO metrics = new NotificationMetricsDTO();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime weekStart = now.minusDays(now.getDayOfWeek().getValue() - 1).toLocalDate().atStartOfDay();
        LocalDateTime monthStart = now.withDayOfMonth(1).toLocalDate().atStartOfDay();
        
        // 通知数量统计
        metrics.setTotalNotifications(notificationRepository.count());
        metrics.setPublishedNotifications(notificationRepository.countByStatus(NotificationStatus.PUBLISHED));
        metrics.setTodayPublishedNotifications(notificationRepository.countByStatusAndPublishTimeAfter(
            NotificationStatus.PUBLISHED, dayStart));
        metrics.setWeekPublishedNotifications(notificationRepository.countByStatusAndPublishTimeAfter(
            NotificationStatus.PUBLISHED, weekStart));
        metrics.setMonthPublishedNotifications(notificationRepository.countByStatusAndPublishTimeAfter(
            NotificationStatus.PUBLISHED, monthStart));
        
        // 阅读统计
        metrics.setTotalReadCount(notificationReadRepository.countByIsRead(true));
        metrics.setTodayReadCount(notificationReadRepository.countByIsReadAndReadTimeAfter(
            true, dayStart));
        metrics.setWeekReadCount(notificationReadRepository.countByIsReadAndReadTimeAfter(
            true, weekStart));
        metrics.setMonthReadCount(notificationReadRepository.countByIsReadAndReadTimeAfter(
            true, monthStart));
        
        // 确认统计
        metrics.setTotalConfirmCount(notificationReadRepository.countByIsConfirmed(true));
        metrics.setTodayConfirmCount(notificationReadRepository.countByIsConfirmedAndConfirmTimeAfter(
            true, dayStart));
        metrics.setWeekConfirmCount(notificationReadRepository.countByIsConfirmedAndConfirmTimeAfter(
            true, weekStart));
        metrics.setMonthConfirmCount(notificationReadRepository.countByIsConfirmedAndConfirmTimeAfter(
            true, monthStart));
        
        return metrics;
    }
    
    @ReadOperation(produces = "application/json")
    public Map<String, Object> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        
        // 系统状态检查
        boolean isHealthy = checkSystemHealth();
        status.put("status", isHealthy ? "UP" : "DOWN");
        
        // 性能指标
        Map<String, Object> performance = new HashMap<>();
        performance.put("averageResponseTime", getAverageResponseTime());
        performance.put("errorRate", getErrorRate());
        status.put("performance", performance);
        
        // 缓存状态
        Map<String, Object> cache = new HashMap<>();
        cache.put("hitRatio", getCacheHitRatio());
        cache.put("size", getCacheSize());
        status.put("cache", cache);
        
        return status;
    }
    
    // 健康状态检查方法（示例实现）
    private boolean checkSystemHealth() {
        try {
            long count = notificationRepository.count();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    // 示例性能指标方法（实际实现需要接入监控系统）
    private double getAverageResponseTime() {
        return 150.0; // 示例值，毫秒
    }
    
    private double getErrorRate() {
        return 0.01; // 示例值，1%错误率
    }
    
    private double getCacheHitRatio() {
        return 0.85; // 示例值，85%缓存命中率
    }
    
    private long getCacheSize() {
        return 1000; // 示例值，缓存条目数
    }
}
```

### 9. Prometheus监控指标配置

**NotificationMetricsConfig.java**
```java
package com.smartcampus.notification.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NotificationMetricsConfig {

    @Autowired
    private MeterRegistry meterRegistry;
    
    @Bean
    public Counter notificationCreatedCounter() {
        return Counter.builder("notification.created")
            .description("Number of notifications created")
            .register(meterRegistry);
    }
    
    @Bean
    public Counter notificationPublishedCounter() {
        return Counter.builder("notification.published")
            .description("Number of notifications published")
            .register(meterRegistry);
    }
    
    @Bean
    public Counter notificationReadCounter() {
        return Counter.builder("notification.read")
            .description("Number of notification reads")
            .register(meterRegistry);
    }
    
    @Bean
    public Counter notificationConfirmedCounter() {
        return Counter.builder("notification.confirmed")
            .description("Number of notification confirmations")
            .register(meterRegistry);
    }
    
    @Bean
    public Timer notificationPushTimer() {
        return Timer.builder("notification.push.time")
            .description("Time spent processing notification pushes")
            .register(meterRegistry);
    }
    
    @Bean
    public Timer notificationQueryTimer() {
        return Timer.builder("notification.query.time")
            .description("Time spent querying notifications")
            .register(meterRegistry);
    }
}
```

### 10. 应用配置文件

**application.yml**
```yaml
spring:
  application:
    name: smart-campus-service
  
  # 数据库配置
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:smartcampus}?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: ${DB_USER:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  # JPA配置
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect
  
  # Redis配置
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    database: 0
    timeout: 10000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: -1ms

# 通知模块配置  
notification:
  # 缓存配置
  cache:
    ttl:
      default: 30        # 默认缓存过期时间（分钟）
      notification: 60   # 通知详情缓存过期时间（分钟）
      statistics: 5      # 统计数据缓存过期时间（分钟）
    local:
      enabled: true      # 是否启用本地缓存
  
  # 推送配置
  push:
    concurrent-limit: 20 # 并发推送限制
    batch-size: 100      # 批处理大小
    retry:
      max-attempts: 3    # 最大重试次数
      initial-delay: 1000 # 初始延迟（毫秒）
      multiplier: 2      # 退避乘数
  
  # 审核配置
  review:
    auto-approve-types:  # 自动审批的通知类型（仅开发环境）
      - GENERAL
    required-for-types:  # 需要审核的通知类型
      - EMERGENCY
      - POLICY
      - IMPORTANT
  
  # 文件上传配置
  file:
    allowed-extensions:  # 允许的文件扩展名
      - .pdf
      - .doc
      - .docx
      - .xls
      - .xlsx
      - .ppt
      - .pptx
      - .jpg
      - .jpeg
      - .png
    max-size: 10485760  # 最大文件大小（字节），默认10MB

# 监控配置
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,notifications
  endpoint:
    health:
      show-details: when_authorized
    notifications:
      enabled: true

# 日志配置
logging:
  level:
    com.smartcampus.notification: INFO
    org.springframework.web: INFO
    org.hibernate: INFO
  file:
    name: logs/notification-service.log
  logback:
    rollingpolicy:
      max-file-size: 10MB
      max-history: 30
```

### 11. CI/CD Pipeline 配置

**Jenkinsfile**
```groovy
pipeline {
    agent {
        docker {
            image 'maven:3.8.5-openjdk-17-slim'
            args '-v $HOME/.m2:/root/.m2'
        }
    }
    
    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'
        SONAR_AUTH_TOKEN = credentials('sonarqube-token')
        DOCKER_REGISTRY = 'registry.smartcampus.com'
        IMAGE_NAME = 'smart-campus-service'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                    jacoco(
                        execPattern: '**/target/jacoco.exec',
                        classPattern: '**/target/classes',
                        sourcePattern: '**/src/main/java'
                    )
                }
            }
        }
        
        stage('Static Code Analysis') {
            steps {
                sh "mvn sonar:sonar -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=${SONAR_AUTH_TOKEN}"
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'mvn verify -Pintegration-test -DskipUnitTests'
            }
            post {
                always {
                    junit '**/target/failsafe-reports/*.xml'
                }
            }
        }
        
        stage('Build Docker Image') {
            when {
                branch 'master'
            }
            steps {
                sh "docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
            }
        }
        
        stage('Push Docker Image') {
            when {
                branch 'master'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} ${DOCKER_REGISTRY}"
                    sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
                }
            }
        }
        
        stage('Deploy to Test') {
            when {
                branch 'master'
            }
            steps {
                withKubeConfig([credentialsId: 'k8s-credentials']) {
                    sh "envsubst < kubernetes/test/deployment.yaml | kubectl apply -f -"
                }
            }
        }
    }
    
    post {
        success {
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                         <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
        failure {
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                         <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}
```

### 12. Kubernetes配置

**kubernetes/test/deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smart-campus-service
  namespace: smartcampus-test
spec:
  replicas: 2
  selector:
    matchLabels:
      app: smart-campus-service
  template:
    metadata:
      labels:
        app: smart-campus-service
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/path: "/actuator/prometheus"
        prometheus.io/port: "8080"
    spec:
      containers:
      - name: smart-campus-service
        image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "test"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: smartcampus-config
              key: db.host
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: smartcampus-config
              key: db.port
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: smartcampus-config
              key: db.name
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: smartcampus-secrets
              key: db.user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: smartcampus-secrets
              key: db.password
        - name: REDIS_HOST
          valueFrom:
            configMapKeyRef:
              name: smartcampus-config
              key: redis.host
        - name: REDIS_PORT
          valueFrom:
            configMapKeyRef:
              name: smartcampus-config
              key: redis.port
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
          requests:
            cpu: "500m"
            memory: "512Mi"
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
        volumeMounts:
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: logs
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: smart-campus-service
  namespace: smartcampus-test
spec:
  selector:
    app: smart-campus-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

### 13. 数据库表结构定义

**schema.sql**
```sql
-- 通知公告表
CREATE TABLE notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    importance VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    is_top BOOLEAN NOT NULL DEFAULT FALSE,
    target_audience JSON,
    require_confirmation BOOLEAN NOT NULL DEFAULT FALSE,
    confirmation_deadline DATETIME,
    attachments JSON,
    expiration_date DATETIME,
    scheduled_publish_time DATETIME,
    publish_time DATETIME,
    publish_by BIGINT,
    submit_time DATETIME,
    review_time DATETIME,
    review_by BIGINT,
    reject_reason VARCHAR(500),
    recall_time DATETIME,
    recall_by BIGINT,
    recall_reason VARCHAR(500),
    archive_time DATETIME,
    created_by BIGINT NOT NULL,
    created_time DATETIME NOT NULL,
    update_by BIGINT,
    update_time DATETIME,
    INDEX idx_notification_status (status),
    INDEX idx_notification_type (type),
    INDEX idx_notification_publish_time (publish_time),
    INDEX idx_notification_created_by (created_by),
    INDEX idx_notification_is_top (is_top)
);

-- 通知阅读记录表
CREATE TABLE notification_read (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    notification_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_time DATETIME,
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    confirm_time DATETIME,
    company_id BIGINT,
    UNIQUE KEY uk_notification_user (notification_id, user_id),
    INDEX idx_notification_read_notification_id (notification_id),
    INDEX idx_notification_read_user_id (user_id),
    INDEX idx_notification_read_company_id (company_id),
    CONSTRAINT fk_notification_read_notification FOREIGN KEY (notification_id) REFERENCES notification (id) ON DELETE CASCADE
);

-- 政策文件表
CREATE TABLE policy_document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    document_number VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    summary TEXT,
    content TEXT,
    file_url VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    issued_by VARCHAR(100),
    issued_date DATE,
    effective_date DATE,
    expiry_date DATE,
    status VARCHAR(50) NOT NULL,
    target_audience JSON,
    keywords VARCHAR(255),
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    publish_time DATETIME,
    publish_by BIGINT,
    created_by BIGINT NOT NULL,
    created_time DATETIME NOT NULL,
    update_by BIGINT,
    update_time DATETIME,
    INDEX idx_policy_document_status (status),
    INDEX idx_policy_document_category (category),
    INDEX idx_policy_document_issued_date (issued_date),
    INDEX idx_policy_document_effective_date (effective_date)
);

-- 活动表
CREATE TABLE activity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    cover_image VARCHAR(255),
    venue VARCHAR(200),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    registration_start DATETIME,
    registration_end DATETIME,
    max_participants INT,
    current_participants INT DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    target_audience JSON,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    attachments JSON,
    created_by BIGINT NOT NULL,
    created_time DATETIME NOT NULL,
    update_by BIGINT,
    update_time DATETIME,
    INDEX idx_activity_status (status),
    INDEX idx_activity_type (type),
    INDEX idx_activity_start_time (start_time),
    INDEX idx_activity_registration_end (registration_end)
);

-- 活动报名表
CREATE TABLE activity_registration (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    company_id BIGINT,
    company_name VARCHAR(100),
    registration_time DATETIME NOT NULL,
    check_in_time DATETIME,
    status VARCHAR(50) NOT NULL,
    cancel_time DATETIME,
    cancel_reason VARCHAR(200),
    created_time DATETIME NOT NULL,
    update_time DATETIME,
    UNIQUE KEY uk_activity_user (activity_id, user_id),
    INDEX idx_activity_registration_activity_id (activity_id),
    INDEX idx_activity_registration_user_id (user_id),
    INDEX idx_activity_registration_company_id (company_id),
    CONSTRAINT fk_activity_registration_activity FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE
);

-- 问卷调查表
CREATE TABLE survey (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    questions JSON NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    target_audience JSON,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT NOT NULL,
    created_time DATETIME NOT NULL,
    update_by BIGINT,
    update_time DATETIME,
    INDEX idx_survey_status (status),
    INDEX idx_survey_type (type),
    INDEX idx_survey_start_time (start_time),
    INDEX idx_survey_end_time (end_time)
);

-- 问卷回答表
CREATE TABLE survey_response (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    survey_id BIGINT NOT NULL,
    user_id BIGINT,
    company_id BIGINT,
    answers JSON NOT NULL,
    submission_time DATETIME NOT NULL,
    ip_address VARCHAR(50),
    device_info VARCHAR(200),
    INDEX idx_survey_response_survey_id (survey_id),
    INDEX idx_survey_response_user_id (user_id),
    INDEX idx_survey_response_company_id (company_id),
    CONSTRAINT fk_survey_response_survey FOREIGN KEY (survey_id) REFERENCES survey (id) ON DELETE CASCADE
);
```

以上代码文件构成了完整的信息公开子模块实现，包括控制器、服务、实体类、DTO、安全与数据访问控制、配置管理、监控与日志、CI/CD流水线以及数据库结构定义等方面。这些代码可以根据系统实际需求进行扩展和定制，以满足智慧园区系统的信息发布和管理需求。


