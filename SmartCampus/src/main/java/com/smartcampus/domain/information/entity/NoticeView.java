package com.smartcampus.domain.information.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 通知查看记录实体类
 */
@Entity
@Table(name = "t_notice_views", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"notice_id", "user_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeView {

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
     * 查看用户ID
     */
    @NotNull(message = "用户ID不能为空")
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * 查看时间
     */
    @Column(name = "viewed_at", nullable = false)
    private LocalDateTime viewedAt;
    
    @PrePersist
    public void prePersist() {
        this.viewedAt = LocalDateTime.now();
    }
} 