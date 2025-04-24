package com.smartcampus.domain.information.entity;

import com.smartcampus.common.enums.information.NotificationImportanceEnum;
import com.smartcampus.common.enums.information.NotificationPermissionEnum;
import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.common.enums.information.NotificationTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * 通知推送记录实体类
 */
@Entity
@Table(name = "t_notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 公告ID
     */
    @NotNull(message = "公告ID不能为空")
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    /**
     * 接收人ID
     */
    @NotNull(message = "接收人ID不能为空")
    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;
    
    /**
     * 通知类型（inbox、app、sms）
     */
    @NotBlank(message = "通知类型不能为空")
    @Column(name = "type", nullable = false, length = 20)
    private String type;
    
    /**
     * 通知内容
     */
    @NotBlank(message = "通知内容不能为空")
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
    
    /**
     * 发送时间
     */
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    /**
     * 是否已读
     */
    @Column(name = "is_read", nullable = false)
    private Boolean isRead;
    
    /**
     * 阅读时间
     */
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.isRead == null) {
            this.isRead = false;
        }
    }
    
    /**
     * 标记为已发送
     */
    public void markAsSent() {
        this.sentAt = LocalDateTime.now();
    }
    
    /**
     * 标记为已读
     */
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
} 