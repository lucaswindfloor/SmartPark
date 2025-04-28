package com.smartcampus.domain.notification.repository;

import com.smartcampus.domain.notification.entity.SystemNotification;
import com.smartcampus.domain.notification.entity.NotificationStatus;
import com.smartcampus.domain.notification.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for SystemNotification entity
 */
@Repository
public interface NotificationRepository extends JpaRepository<SystemNotification, Long> {
    
    /**
     * Find notifications by recipient
     */
    Page<SystemNotification> findByRecipientOrderByCreateTimeDesc(String recipient, Pageable pageable);
    
    /**
     * Find notifications by recipient and status
     */
    Page<SystemNotification> findByRecipientAndStatusOrderByCreateTimeDesc(String recipient, NotificationStatus status, Pageable pageable);
    
    /**
     * Find notifications by recipient and type
     */
    Page<SystemNotification> findByRecipientAndTypeOrderByCreateTimeDesc(String recipient, NotificationType type, Pageable pageable);
    
    /**
     * Find unread notifications by recipient
     */
    List<SystemNotification> findByRecipientAndStatusNotOrderByCreateTimeDesc(String recipient, NotificationStatus status);
    
    /**
     * Count unread notifications by recipient
     */
    long countByRecipientAndStatusNot(String recipient, NotificationStatus status);
    
    /**
     * Update notification status to READ
     */
    @Modifying
    @Query("UPDATE SystemNotification n SET n.status = :status, n.readTime = :readTime WHERE n.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") NotificationStatus status, @Param("readTime") LocalDateTime readTime);
    
    /**
     * Find pending notifications to be sent
     */
    List<SystemNotification> findByStatusOrderByCreateTimeAsc(NotificationStatus status);
} 