package com.smartcampus.domain.information.task;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.domain.information.repository.AnnouncementRepository;
import com.smartcampus.domain.information.service.NotificationService;
import com.smartcampus.domain.information.service.NotificationStateMachine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知公告定时任务
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationScheduledTasks {

    private final AnnouncementRepository notificationRepository;
    private final NotificationStateMachine stateMachine;
    private final NotificationService notificationService;
    
    @Value("${notification.recycle-bin.expire-days:30}")
    private int recycleBinExpireDays;
    
    @Value("${notification.archive.auto-archive-days:3}")
    private int autoArchiveDays;
    
    /**
     * 处理过期通知（每小时执行一次）
     * 将已过期的通知状态更新为已过期
     */
    @Scheduled(cron = "0 0 * * * ?")
    @Transactional
    public void handleExpiredNotifications() {
        log.info("执行定时任务：处理过期通知");
        
        // 查询已发布且过期时间已到的通知
        List<Notification> expiredNotifications = notificationRepository.findByStatusAndExpireTimeBefore(
                NotificationStatusEnum.PUBLISHED, LocalDateTime.now());
        
        log.info("发现 {} 条已过期通知", expiredNotifications.size());
        
        for (Notification notification : expiredNotifications) {
            try {
                // 使用状态机更新状态
                if (stateMachine.expire(notification)) {
                    notificationRepository.save(notification);
                    log.info("通知 {} 已标记为过期", notification.getId());
                } else {
                    log.warn("通知 {} 无法标记为过期", notification.getId());
                }
            } catch (Exception e) {
                log.error("处理过期通知 {} 时发生错误", notification.getId(), e);
            }
        }
    }
    
    /**
     * 处理定时发布（每5分钟执行一次）
     * 将到达发布时间的通知发布
     */
    @Scheduled(cron = "0 */5 * * * ?")
    @Transactional
    public void handleScheduledPublications() {
        log.info("执行定时任务：处理定时发布");
        
        // 查询待发布且定时发布时间已到的通知
        List<Notification> scheduledNotifications = notificationRepository.findByStatusAndScheduledPublishTimeLessThanEqual(
                NotificationStatusEnum.PENDING_PUBLISH, LocalDateTime.now());
        
        log.info("发现 {} 条需要定时发布的通知", scheduledNotifications.size());
        
        for (Notification notification : scheduledNotifications) {
            try {
                // 使用状态机发布通知
                if (stateMachine.publish(notification)) {
                    notification.setPublishTime(LocalDateTime.now());
                    
                    // 如果没有设置过期时间，则根据有效期设置
                    if (notification.getExpireTime() == null && notification.getValidityPeriod() != null) {
                        notification.setExpireTime(LocalDateTime.now().plusDays(notification.getValidityPeriod()));
                    }
                    
                    notificationRepository.save(notification);
                    
                    // 发送通知
                    notificationService.sendNotification(notification);
                    
                    log.info("通知 {} 已定时发布", notification.getId());
                } else {
                    log.warn("通知 {} 无法定时发布", notification.getId());
                }
            } catch (Exception e) {
                log.error("处理定时发布通知 {} 时发生错误", notification.getId(), e);
            }
        }
    }
    
    /**
     * 自动归档（每天凌晨1点执行）
     * 将已过期或已取消发布3天（默认）的通知归档
     */
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void autoArchive() {
        log.info("执行定时任务：自动归档");
        
        LocalDateTime archiveThreshold = LocalDateTime.now().minusDays(autoArchiveDays);
        
        // 查询已过期超过指定天数的通知
        List<Notification> expiredNotifications = notificationRepository.findByStatusAndUpdateTimeBefore(
                NotificationStatusEnum.EXPIRED, archiveThreshold);
        
        // 查询已取消发布超过指定天数的通知
        List<Notification> canceledNotifications = notificationRepository.findByStatusAndUpdateTimeBefore(
                NotificationStatusEnum.CANCELED, archiveThreshold);
        
        log.info("发现 {} 条过期通知和 {} 条已取消发布通知需要自动归档", 
                expiredNotifications.size(), canceledNotifications.size());
        
        // 处理过期通知
        for (Notification notification : expiredNotifications) {
            try {
                if (stateMachine.archive(notification)) {
                    notificationRepository.save(notification);
                    log.info("过期通知 {} 已自动归档", notification.getId());
                } else {
                    log.warn("过期通知 {} 无法自动归档", notification.getId());
                }
            } catch (Exception e) {
                log.error("自动归档过期通知 {} 时发生错误", notification.getId(), e);
            }
        }
        
        // 处理已取消发布通知
        for (Notification notification : canceledNotifications) {
            try {
                if (stateMachine.archive(notification)) {
                    notificationRepository.save(notification);
                    log.info("已取消发布通知 {} 已自动归档", notification.getId());
                } else {
                    log.warn("已取消发布通知 {} 无法自动归档", notification.getId());
                }
            } catch (Exception e) {
                log.error("自动归档已取消发布通知 {} 时发生错误", notification.getId(), e);
            }
        }
    }
    
    /**
     * 回收站清理（每天凌晨2点执行）
     * 将在回收站超过30天（默认）的通知永久删除
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanRecycleBin() {
        log.info("执行定时任务：回收站清理");
        
        LocalDateTime deleteThreshold = LocalDateTime.now().minusDays(recycleBinExpireDays);
        
        // 查询在回收站中超过指定天数的通知
        List<Notification> deletedNotifications = notificationRepository.findByStatusAndUpdateTimeBefore(
                NotificationStatusEnum.DELETED, deleteThreshold);
        
        log.info("发现 {} 条回收站通知需要永久删除", deletedNotifications.size());
        
        for (Notification notification : deletedNotifications) {
            try {
                notificationRepository.delete(notification);
                log.info("回收站通知 {} 已永久删除", notification.getId());
            } catch (Exception e) {
                log.error("永久删除回收站通知 {} 时发生错误", notification.getId(), e);
            }
        }
    }
    
    /**
     * 审核超时提醒（每天上午9点执行）
     * 提醒24小时未处理的审核
     */
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional(readOnly = true)
    public void auditTimeoutReminder() {
        log.info("执行定时任务：审核超时提醒");
        
        LocalDateTime auditTimeoutThreshold = LocalDateTime.now().minusHours(24);
        
        // 查询提交超过24小时仍未审核的通知
        List<Notification> pendingAuditNotifications = notificationRepository.findByStatusAndUpdateTimeBefore(
                NotificationStatusEnum.PENDING_AUDIT, auditTimeoutThreshold);
        
        log.info("发现 {} 条审核超时通知", pendingAuditNotifications.size());
        
        if (!pendingAuditNotifications.isEmpty()) {
            // 发送审核超时提醒
            notificationService.sendAuditTimeoutReminder(pendingAuditNotifications);
        }
    }
    
    /**
     * 确认截止提醒（每天上午10点执行）
     * 提醒即将到期未确认的用户
     */
    @Scheduled(cron = "0 0 10 * * ?")
    @Transactional(readOnly = true)
    public void confirmationDeadlineReminder() {
        log.info("执行定时任务：确认截止提醒");
        
        // 查询需要确认且截止时间在24小时内的通知
        LocalDateTime deadlineThreshold = LocalDateTime.now().plusHours(24);
        
        // 查询需要用户确认，且确认截止时间在24小时内的通知
        List<Notification> notifications = notificationRepository.findAll((root, query, cb) -> {
            return cb.and(
                cb.equal(root.get("status"), NotificationStatusEnum.PUBLISHED),
                cb.equal(root.get("requireConfirmation"), true),
                cb.lessThanOrEqualTo(root.get("confirmationDeadline"), deadlineThreshold),
                cb.greaterThan(root.get("confirmationDeadline"), LocalDateTime.now())
            );
        });
        
        log.info("发现 {} 条确认即将截止的通知", notifications.size());
        
        if (!notifications.isEmpty()) {
            // 发送确认截止提醒
            notificationService.sendConfirmationDeadlineReminder(notifications);
        }
    }
} 