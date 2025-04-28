package com.smartcampus.domain.information.service;

import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.interfaces.api.controller.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * 通知公告服务接口
 */
public interface NotificationService {

    /**
     * 获取通知公告列表
     */
    Page<NotificationDTO> getNotifications(NotificationQueryDTO queryDTO, Pageable pageable, String username);

    /**
     * 获取通知公告详情
     */
    NotificationDetailDTO getNotificationDetail(Long id, String username);

    /**
     * 创建通知公告
     */
    NotificationDTO createNotification(NotificationDTO notificationDTO);

    /**
     * 更新通知公告
     */
    NotificationDTO updateNotification(NotificationDTO notificationDTO, String username);

    /**
     * 删除通知公告（移入回收站）
     */
    boolean deleteNotification(Long id, String username);

    /**
     * 提交审核
     */
    NotificationDTO submitForAudit(Long id, String username);

    /**
     * 审核通知
     */
    NotificationDTO auditNotification(Long id, AuditRequest auditRequest, String username);

    /**
     * 发布通知
     */
    NotificationDTO publishNotification(Long id, PublishRequest publishRequest, String username);

    /**
     * 取消发布
     */
    NotificationDTO cancelPublication(Long id, String reason, String username);

    /**
     * 置顶通知
     */
    NotificationDTO pinNotification(Long id, String username);

    /**
     * 取消置顶
     */
    NotificationDTO unpinNotification(Long id, String username);

    /**
     * 延长有效期
     */
    NotificationDTO extendValidity(Long id, Integer days, String username);

    /**
     * 归档通知
     */
    NotificationDTO archiveNotification(Long id, ArchiveRequest archiveRequest, String username);

    /**
     * 解除归档
     */
    NotificationDTO unarchiveNotification(Long id, String username);

    /**
     * 记录查看
     */
    boolean recordView(Long id, String username);

    /**
     * 确认接收
     */
    boolean confirmNotification(Long id, String username);

    /**
     * 获取统计信息
     */
    NotificationStatisticsDTO getStatistics(Long id);

    /**
     * 获取确认列表
     */
    Map<String, Object> getConfirmations(Long id, Pageable pageable);

    /**
     * 发送提醒
     */
    boolean sendReminders(Long id, List<String> userIds, String username);

    /**
     * 从回收站恢复
     */
    NotificationDTO restoreFromRecycleBin(Long id, String username);

    /**
     * 永久删除
     */
    boolean permanentDelete(Long id, String username);

    /**
     * 清空回收站
     */
    boolean emptyRecycleBin(String username);

    /**
     * 获取可用范围选项
     */
    List<Map<String, Object>> getAvailableScopes();

    /**
     * 获取可用类型选项
     */
    List<Map<String, Object>> getAvailableTypes();
    
    /**
     * 发送通知
     */
    void sendNotification(Notification notification);
    
    /**
     * 发送审核超时提醒
     */
    void sendAuditTimeoutReminder(List<Notification> notifications);
    
    /**
     * 发送确认截止提醒
     */
    void sendConfirmationDeadlineReminder(List<Notification> notifications);
} 