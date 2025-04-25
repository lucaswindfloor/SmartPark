package com.smartcampus.domain.information.service.impl;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.common.exception.BusinessException;
import com.smartcampus.common.response.ResultCode;
import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.domain.information.service.NotificationStateMachine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * 通知公告状态机实现
 * 实现状态转换和状态验证
 */
@Service
@Slf4j
public class NotificationStateMachineImpl implements NotificationStateMachine {

    // 状态转换映射，定义了哪些状态可以转换到哪些状态
    private static final Map<NotificationStatusEnum, Set<NotificationStatusEnum>> STATE_TRANSITIONS = new HashMap<>();

    static {
        // 初始化状态转换规则
        // 草稿状态可以转换到：待审核、已删除
        Set<NotificationStatusEnum> draftTransitions = new HashSet<>();
        draftTransitions.add(NotificationStatusEnum.PENDING_AUDIT);
        draftTransitions.add(NotificationStatusEnum.DELETED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.DRAFT, draftTransitions);

        // 待审核状态可以转换到：待发布、草稿(驳回)、已删除
        Set<NotificationStatusEnum> pendingAuditTransitions = new HashSet<>();
        pendingAuditTransitions.add(NotificationStatusEnum.PENDING_PUBLISH);
        pendingAuditTransitions.add(NotificationStatusEnum.DRAFT);
        pendingAuditTransitions.add(NotificationStatusEnum.DELETED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.PENDING_AUDIT, pendingAuditTransitions);

        // 待发布状态可以转换到：已发布、草稿(撤回)、已删除
        Set<NotificationStatusEnum> pendingPublishTransitions = new HashSet<>();
        pendingPublishTransitions.add(NotificationStatusEnum.PUBLISHED);
        pendingPublishTransitions.add(NotificationStatusEnum.DRAFT);
        pendingPublishTransitions.add(NotificationStatusEnum.DELETED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.PENDING_PUBLISH, pendingPublishTransitions);

        // 已发布状态可以转换到：已过期、已取消发布、已删除
        Set<NotificationStatusEnum> publishedTransitions = new HashSet<>();
        publishedTransitions.add(NotificationStatusEnum.EXPIRED);
        publishedTransitions.add(NotificationStatusEnum.CANCELED);
        publishedTransitions.add(NotificationStatusEnum.DELETED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.PUBLISHED, publishedTransitions);

        // 已过期状态可以转换到：已归档、已删除
        Set<NotificationStatusEnum> expiredTransitions = new HashSet<>();
        expiredTransitions.add(NotificationStatusEnum.ARCHIVED);
        expiredTransitions.add(NotificationStatusEnum.DELETED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.EXPIRED, expiredTransitions);

        // 已取消发布状态可以转换到：已归档、已删除
        Set<NotificationStatusEnum> canceledTransitions = new HashSet<>();
        canceledTransitions.add(NotificationStatusEnum.ARCHIVED);
        canceledTransitions.add(NotificationStatusEnum.DELETED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.CANCELED, canceledTransitions);

        // 已归档状态可以转换到：已发布(解档)、已删除
        Set<NotificationStatusEnum> archivedTransitions = new HashSet<>();
        archivedTransitions.add(NotificationStatusEnum.PUBLISHED);
        archivedTransitions.add(NotificationStatusEnum.DELETED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.ARCHIVED, archivedTransitions);

        // 已删除状态可以转换到：原始状态(恢复)
        Set<NotificationStatusEnum> deletedTransitions = new HashSet<>();
        deletedTransitions.add(NotificationStatusEnum.DRAFT);
        deletedTransitions.add(NotificationStatusEnum.PENDING_AUDIT);
        deletedTransitions.add(NotificationStatusEnum.PENDING_PUBLISH);
        deletedTransitions.add(NotificationStatusEnum.PUBLISHED);
        deletedTransitions.add(NotificationStatusEnum.EXPIRED);
        deletedTransitions.add(NotificationStatusEnum.CANCELED);
        deletedTransitions.add(NotificationStatusEnum.ARCHIVED);
        STATE_TRANSITIONS.put(NotificationStatusEnum.DELETED, deletedTransitions);
    }

    @Override
    public NotificationStatusEnum getCurrentStatus(Notification notification) {
        if (notification == null) {
            throw new BusinessException(ResultCode.PARAM_ERROR, "通知公告不存在");
        }
        return notification.getStatus();
    }

    @Override
    public boolean transitionToSent(Notification notification) {
        return transition(notification, NotificationStatusEnum.PUBLISHED);
    }

    @Override
    public boolean transitionToRead(Notification notification) {
        // 这个是针对接收者的状态，不是公告本身状态
        return true;
    }

    @Override
    public boolean transitionToCancelled(Notification notification) {
        return transition(notification, NotificationStatusEnum.CANCELED);
    }

    @Override
    public boolean transitionToFailed(Notification notification) {
        // 系统内部状态，通常不会设置到公告上
        log.warn("公告发布失败: {}", notification.getId());
        return false;
    }

    @Override
    public boolean isValidTransition(NotificationStatusEnum fromStatus, NotificationStatusEnum toStatus) {
        if (fromStatus == null || toStatus == null) {
            return false;
        }
        
        Set<NotificationStatusEnum> validTransitions = STATE_TRANSITIONS.get(fromStatus);
        return validTransitions != null && validTransitions.contains(toStatus);
    }
    
    @Override
    public boolean transition(Notification notification, NotificationStatusEnum toStatus) {
        if (notification == null || toStatus == null) {
            return false;
        }
        
        NotificationStatusEnum fromStatus = notification.getStatus();
        
        if (!isValidTransition(fromStatus, toStatus)) {
            log.warn("无效的状态转换: 从 {} 到 {}", fromStatus, toStatus);
            return false;
        }
        
        notification.setStatus(toStatus);
        notification.setUpdateTime(LocalDateTime.now());
        
        // 根据状态设置特定字段
        switch (toStatus) {
            case PUBLISHED:
                if (notification.getPublishTime() == null) {
                    notification.setPublishTime(LocalDateTime.now());
                }
                break;
            case EXPIRED:
                notification.setExpireTime(LocalDateTime.now());
                break;
            case ARCHIVED:
                notification.setArchiveTime(LocalDateTime.now());
                break;
            default:
                // 其他状态不需要特殊处理
                break;
        }
        
        log.info("通知公告状态从 {} 转换为 {}: {}", fromStatus, toStatus, notification.getId());
        return true;
    }
    
    // 以下为扩展方法，实现设计文档中要求的所有状态转换
    
    @Override
    public boolean submitForAudit(Notification notification) {
        return transition(notification, NotificationStatusEnum.PENDING_AUDIT);
    }
    
    @Override
    public boolean approveAudit(Notification notification) {
        return transition(notification, NotificationStatusEnum.PENDING_PUBLISH);
    }
    
    @Override
    public boolean rejectAudit(Notification notification) {
        return transition(notification, NotificationStatusEnum.DRAFT);
    }
    
    @Override
    public boolean publish(Notification notification) {
        return transition(notification, NotificationStatusEnum.PUBLISHED);
    }
    
    @Override
    public boolean withdraw(Notification notification) {
        return transition(notification, NotificationStatusEnum.DRAFT);
    }
    
    @Override
    public boolean expire(Notification notification) {
        return transition(notification, NotificationStatusEnum.EXPIRED);
    }
    
    @Override
    public boolean archive(Notification notification) {
        return transition(notification, NotificationStatusEnum.ARCHIVED);
    }
    
    @Override
    public boolean unarchive(Notification notification) {
        return transition(notification, NotificationStatusEnum.PUBLISHED);
    }
    
    @Override
    public boolean cancel(Notification notification) {
        return transition(notification, NotificationStatusEnum.CANCELED);
    }
    
    @Override
    public boolean moveToRecycleBin(Notification notification) {
        return transition(notification, NotificationStatusEnum.DELETED);
    }
    
    @Override
    public boolean restore(Notification notification, NotificationStatusEnum originalStatus) {
        if (notification.getStatus() != NotificationStatusEnum.DELETED) {
            log.warn("只有已删除的通知才能恢复: {}", notification.getId());
            return false;
        }
        
        if (!STATE_TRANSITIONS.get(NotificationStatusEnum.DELETED).contains(originalStatus)) {
            log.warn("无效的恢复状态: {}", originalStatus);
            return false;
        }
        
        notification.setStatus(originalStatus);
        notification.setUpdateTime(LocalDateTime.now());
        
        log.info("通知公告已从回收站恢复为状态 {}: {}", originalStatus, notification.getId());
        return true;
    }
} 