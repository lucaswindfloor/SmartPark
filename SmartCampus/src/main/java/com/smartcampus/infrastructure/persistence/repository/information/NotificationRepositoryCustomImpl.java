package com.smartcampus.infrastructure.persistence.repository.information;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.domain.information.repository.AnnouncementRepositoryCustom;
import com.smartcampus.infrastructure.persistence.mapper.information.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 通知仓储自定义实现类
 */
@Repository
@RequiredArgsConstructor
public class NotificationRepositoryCustomImpl implements AnnouncementRepositoryCustom {

    private final NotificationMapper notificationMapper;

    @Override
    public Page<Notification> findByScopeAndStatus(String scope, Integer status, Pageable pageable) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        List<Notification> notifications = notificationMapper.selectByScope(scope)
                .stream()
                .filter(n -> isNotificationRead(n) == isRead)
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public Page<Notification> findByScopeAndType(String scope, Integer type, Pageable pageable) {
        // 同上，简化处理
        List<Notification> notifications = notificationMapper.selectByScope(scope)
                .stream()
                .filter(n -> String.valueOf(type).equals(n.getType()))
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public Page<Notification> findByScopeAndImportance(String scope, Integer importance, Pageable pageable) {
        // 过滤重要性
        List<Notification> notifications = notificationMapper.selectByScope(scope)
                .stream()
                .filter(n -> String.valueOf(importance).equals(n.getImportance()))
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public List<Notification> findByScopeAndStatusNot(String scope, Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.selectByScope(scope)
                .stream()
                .filter(n -> isNotificationRead(n) != isRead)
                .collect(Collectors.toList());
    }

    @Override
    public long countByScopeAndStatusNot(String scope, Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.selectByScope(scope)
                .stream()
                .filter(n -> isNotificationRead(n) != isRead)
                .count();
    }

    @Override
    public int updateStatus(Long id, Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.updateReadStatus(id, isRead);
    }

    @Override
    public List<Notification> findByStatus(Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.selectByRecipient(null)
                .stream()
                .filter(n -> isNotificationRead(n) == isRead)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Notification> findByStatus(NotificationStatusEnum status) {
        return notificationMapper.selectAll().stream()
                .filter(n -> n.getStatus() == status)
                .collect(Collectors.toList());
    }

    @Override
    public Page<Notification> findByStatusAndIsPinned(NotificationStatusEnum status, Boolean isPinned, Pageable pageable) {
        List<Notification> notifications = notificationMapper.selectAll().stream()
                .filter(n -> n.getStatus() == status && isPinned.equals(n.getIsPinned()))
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public Page<Notification> findByCreatorIdAndStatus(String creatorId, NotificationStatusEnum status, Pageable pageable) {
        List<Notification> notifications = notificationMapper.selectAll().stream()
                .filter(n -> creatorId.equals(n.getCreatorId()) && n.getStatus() == status)
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public Page<Notification> findByScopeAndStatus(String scope, NotificationStatusEnum status, Pageable pageable) {
        List<Notification> notifications = notificationMapper.selectAll().stream()
                .filter(n -> scope.equals(n.getScope()) && n.getStatus() == status)
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public List<Notification> findByStatusAndExpireTimeBefore(NotificationStatusEnum status, LocalDateTime expireTime) {
        return notificationMapper.selectAll().stream()
                .filter(n -> n.getStatus() == status && n.getExpireTime() != null && n.getExpireTime().isBefore(expireTime))
                .collect(Collectors.toList());
    }

    @Override
    public List<Notification> findByStatusAndScheduledPublishTimeLessThanEqual(NotificationStatusEnum status, LocalDateTime now) {
        return notificationMapper.selectAll().stream()
                .filter(n -> n.getStatus() == status && n.getScheduledPublishTime() != null && 
                       !n.getScheduledPublishTime().isAfter(now))
                .collect(Collectors.toList());
    }

    @Override
    public int updateStatus(Long id, NotificationStatusEnum status, LocalDateTime updateTime) {
        Notification notification = notificationMapper.selectById(id);
        if (notification != null) {
            notification.setStatus(status);
            notification.setUpdateTime(updateTime);
            return notificationMapper.update(notification);
        }
        return 0;
    }

    @Override
    public List<Notification> findByStatusAndArchiveTimeBefore(NotificationStatusEnum status, LocalDateTime archiveTime) {
        return notificationMapper.selectAll().stream()
                .filter(n -> n.getStatus() == status && n.getArchiveTime() != null && 
                       n.getArchiveTime().isBefore(archiveTime))
                .collect(Collectors.toList());
    }

    @Override
    public List<Notification> findByStatusAndUpdateTimeBefore(NotificationStatusEnum status, LocalDateTime deleteTime) {
        return notificationMapper.selectAll().stream()
                .filter(n -> n.getStatus() == status && n.getUpdateTime() != null && 
                       n.getUpdateTime().isBefore(deleteTime))
                .collect(Collectors.toList());
    }

    @Override
    public Page<Notification> findByTypeAndStatus(String type, NotificationStatusEnum status, Pageable pageable) {
        List<Notification> notifications = notificationMapper.selectAll().stream()
                .filter(n -> type.equals(n.getType()) && n.getStatus() == status)
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }
    
    /**
     * 判断通知是否已读
     * 注意：这是临时实现，实际业务中应该根据具体需求调整
     */
    private boolean isNotificationRead(Notification notification) {
        // 临时实现：根据viewCount判断是否已读
        return notification.getViewCount() != null && notification.getViewCount() > 0;
        
        // 或者通过状态判断（取决于具体业务逻辑）:
        // return notification.getStatus() == NotificationStatusEnum.READ;
    }
} 