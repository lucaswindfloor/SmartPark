package com.smartcampus.domain.information.repository;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知公告仓库自定义接口
 */
public interface AnnouncementRepositoryCustom {

    /**
     * 根据范围和状态查询通知，分页
     */
    Page<Notification> findByScopeAndStatus(String scope, Integer status, Pageable pageable);
    
    /**
     * 根据范围和类型查询通知，分页
     */
    Page<Notification> findByScopeAndType(String scope, Integer type, Pageable pageable);
    
    /**
     * 根据范围和重要性查询通知，分页
     */
    Page<Notification> findByScopeAndImportance(String scope, Integer importance, Pageable pageable);
    
    /**
     * 查找特定范围内非指定状态的通知
     */
    List<Notification> findByScopeAndStatusNot(String scope, Integer status);
    
    /**
     * 统计特定范围内非指定状态的通知数量
     */
    long countByScopeAndStatusNot(String scope, Integer status);
    
    /**
     * 更新通知状态
     */
    int updateStatus(Long id, Integer status);
    
    /**
     * 查找指定状态的通知
     */
    List<Notification> findByStatus(Integer status);
    
    /**
     * 根据状态查询通知
     */
    List<Notification> findByStatus(NotificationStatusEnum status);
    
    /**
     * 根据状态和是否置顶查询通知
     */
    Page<Notification> findByStatusAndIsPinned(NotificationStatusEnum status, Boolean isPinned, Pageable pageable);
    
    /**
     * 根据创建人ID和状态查询通知
     */
    Page<Notification> findByCreatorIdAndStatus(String creatorId, NotificationStatusEnum status, Pageable pageable);
    
    /**
     * 查询公开范围为全部的通知
     */
    Page<Notification> findByScopeAndStatus(String scope, NotificationStatusEnum status, Pageable pageable);
    
    /**
     * 查询已过期的通知
     */
    List<Notification> findByStatusAndExpireTimeBefore(NotificationStatusEnum status, LocalDateTime expireTime);
    
    /**
     * 查询待定时发布的通知
     */
    List<Notification> findByStatusAndScheduledPublishTimeLessThanEqual(NotificationStatusEnum status, LocalDateTime now);
    
    /**
     * 更新通知状态
     */
    int updateStatus(Long id, NotificationStatusEnum status, LocalDateTime updateTime);
    
    /**
     * 获取已归档超过指定时间的通知
     */
    List<Notification> findByStatusAndArchiveTimeBefore(NotificationStatusEnum status, LocalDateTime archiveTime);
    
    /**
     * 获取回收站中超时的通知
     */
    List<Notification> findByStatusAndUpdateTimeBefore(NotificationStatusEnum status, LocalDateTime deleteTime);
    
    /**
     * 按类型和状态查询通知
     */
    Page<Notification> findByTypeAndStatus(String type, NotificationStatusEnum status, Pageable pageable);
} 