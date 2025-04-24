package com.smartcampus.domain.information.entity;

import com.smartcampus.common.enums.information.NoticeStatusEnum;
import com.smartcampus.common.enums.information.NotificationImportanceEnum;
import com.smartcampus.common.enums.information.NotificationTypeEnum;
import com.smartcampus.common.enums.information.NoticeScopeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * 通知公告实体
 */
@Entity
@Table(name = "t_notices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题不能超过100个字符")
    @Column(name = "title", nullable = false, length = 100)
    private String title;
    
    @NotBlank(message = "内容不能为空")
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @NotNull(message = "状态不能为空")
    @Column(name = "status", nullable = false)
    private Integer status;
    
    @Transient
    private NoticeStatusEnum statusEnum;
    
    @NotNull(message = "创建者ID不能为空")
    @Column(name = "creator_id", nullable = false)
    private Long creatorId;
    
    @NotNull(message = "公开范围不能为空")
    @Column(name = "scope", nullable = false)
    private Integer scope;
    
    @Transient
    private NoticeScopeEnum scopeEnum;
    
    @Column(name = "scope_details", columnDefinition = "JSON")
    private String scopeDetails;
    
    @NotNull(message = "通知类型不能为空")
    @Column(name = "type", nullable = false)
    private Integer type;
    
    @Transient
    private NotificationTypeEnum typeEnum;
    
    @NotNull(message = "重要性不能为空")
    @Column(name = "importance", nullable = false)
    private Integer importance;
    
    @Transient
    private NotificationImportanceEnum importanceEnum;
    
    @Column(name = "require_confirmation", nullable = false)
    private Boolean requireConfirmation;
    
    @Column(name = "confirmation_deadline")
    private LocalDateTime confirmationDeadline;
    
    @Builder.Default
    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @Column(name = "scheduled_publish_at")
    private LocalDateTime scheduledPublishAt;
    
    @Column(name = "expired_at")
    private LocalDateTime expiredAt;
    
    @Column(name = "is_pinned", nullable = false)
    private Boolean isPinned;
    
    @Column(name = "validity_period")
    private Integer validityPeriod;
    
    @Column(name = "archived_at")
    private LocalDateTime archivedAt;
    
    @Column(name = "attachments", columnDefinition = "JSON")
    private String attachments;
    
    @Column(name = "extra_data", columnDefinition = "JSON")
    private String extraData;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.viewCount = 0;
        this.isPinned = false;
        
        // 设置默认值
        if (this.status == null) {
            this.status = NoticeStatusEnum.DRAFT.getCode();
        }
        if (this.requireConfirmation == null) {
            this.requireConfirmation = false;
        }
        if (this.validityPeriod == null) {
            this.validityPeriod = 7; // 默认7天有效期
        }
        
        // 从枚举转换为整数
        if (this.statusEnum != null) {
            this.status = this.statusEnum.getCode();
        }
        if (this.scopeEnum != null) {
            this.scope = this.scopeEnum.getCode();
        }
        if (this.typeEnum != null) {
            this.type = this.typeEnum.getCode();
        }
        if (this.importanceEnum != null) {
            this.importance = this.importanceEnum.getCode();
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        
        // 从枚举转换为整数
        if (this.statusEnum != null) {
            this.status = this.statusEnum.getCode();
        }
        if (this.scopeEnum != null) {
            this.scope = this.scopeEnum.getCode();
        }
        if (this.typeEnum != null) {
            this.type = this.typeEnum.getCode();
        }
        if (this.importanceEnum != null) {
            this.importance = this.importanceEnum.getCode();
        }
    }
    
    @PostLoad
    public void postLoad() {
        // 从整数转换为枚举
        this.statusEnum = NoticeStatusEnum.getByCode(this.status);
        this.scopeEnum = NoticeScopeEnum.getByCode(this.scope);
        this.typeEnum = NotificationTypeEnum.getByCode(this.type);
        this.importanceEnum = NotificationImportanceEnum.getByCode(this.importance);
    }
} 