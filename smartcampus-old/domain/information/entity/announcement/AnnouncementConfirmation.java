package com.smartcampus.domain.information.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 公告确认记录实体类
 */
@Entity
@Table(name = "t_announcement_confirmations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"announcement_id", "user_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementConfirmation {

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
     * 确认用户ID
     */
    @NotNull(message = "用户ID不能为空")
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * 确认时间
     */
    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;
    
    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    
    /**
     * 是否已确认
     */
    @Transient
    public boolean isConfirmed() {
        return confirmedAt != null;
    }
    
    /**
     * 确认
     */
    public void confirm() {
        this.confirmedAt = LocalDateTime.now();
    }
} 