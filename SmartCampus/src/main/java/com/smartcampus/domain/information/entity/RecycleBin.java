package com.smartcampus.domain.information.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 回收站实体类
 */
@Entity
@Table(name = "t_recycle_bin")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecycleBin {

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
     * 删除人ID
     */
    @NotNull(message = "删除人ID不能为空")
    @Column(name = "deleted_by", nullable = false)
    private Long deletedBy;
    
    /**
     * 删除时间
     */
    @Column(name = "deleted_at", nullable = false)
    private LocalDateTime deletedAt;
    
    /**
     * 回收站过期时间（30天）
     */
    @Column(name = "expire_at", nullable = false)
    private LocalDateTime expireAt;
    
    @PrePersist
    public void prePersist() {
        this.deletedAt = LocalDateTime.now();
        // 默认30天后过期
        this.expireAt = this.deletedAt.plusDays(30);
    }
    
    /**
     * 是否已过期
     */
    @Transient
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expireAt);
    }
} 