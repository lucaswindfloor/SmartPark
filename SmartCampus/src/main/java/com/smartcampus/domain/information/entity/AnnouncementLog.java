package com.smartcampus.domain.information.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 公告操作日志实体类
 */
@Entity
@Table(name = "t_announcement_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 公告ID
     */
    @NotNull(message = "公告ID不能为空")
    @Column(name = "announcement_id", nullable = false)
    private Long announcementId;
    
    /**
     * 操作类型（如提交审核、发布）
     */
    @NotBlank(message = "操作类型不能为空")
    @Column(name = "operation", nullable = false, length = 50)
    private String operation;
    
    /**
     * 操作人ID
     */
    @NotNull(message = "操作人ID不能为空")
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * 备注（如驳回原因）
     */
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
    
    /**
     * 操作时间
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
} 