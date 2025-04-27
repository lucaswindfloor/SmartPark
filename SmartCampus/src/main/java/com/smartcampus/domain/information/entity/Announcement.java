package com.smartcampus.domain.information.entity;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 通知公告实体类
 */
@Data
@Entity
@Table(name = "announcements")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Announcement {

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 标题
     */
    @Column(nullable = false, length = 100)
    private String title;

    /**
     * 内容
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * 状态
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatusEnum status;

    /**
     * 创建人ID
     */
    @Column(nullable = false)
    private String creatorId;

    /**
     * 公开范围 (all, enterprise, role)
     */
    @Column(nullable = false)
    private String scope;

    /**
     * 范围详情 (企业ID, 角色ID列表)
     */
    @Column(columnDefinition = "JSON")
    private String scopeDetails;

    /**
     * 类型 (normal, policy, event, emergency)
     */
    @Column(nullable = false)
    private String type;

    /**
     * 重要性 (normal, important, emergency)
     */
    @Column(nullable = false)
    private String importance;

    /**
     * 是否需要确认
     */
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean requireConfirmation;

    /**
     * 确认截止时间
     */
    private LocalDateTime confirmationDeadline;

    /**
     * 查看次数
     */
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer viewCount;

    /**
     * 创建时间
     */
    @Column(nullable = false)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @Column(nullable = false)
    private LocalDateTime updateTime;

    /**
     * 发布时间
     */
    private LocalDateTime publishTime;

    /**
     * 定时发布时间
     */
    private LocalDateTime scheduledPublishTime;

    /**
     * 过期时间
     */
    private LocalDateTime expireTime;

    /**
     * 是否置顶
     */
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isPinned;

    /**
     * 有效期(天)
     */
    @Column(columnDefinition = "INT DEFAULT 7")
    private Integer validityPeriod;

    /**
     * 归档时间
     */
    private LocalDateTime archiveTime;

    /**
     * 附件信息
     */
    @Column(columnDefinition = "JSON")
    private String attachments;
    
    /**
     * 扩展数据
     */
    @Column(columnDefinition = "JSON")
    private String extraData;
    
    /**
     * 预处理方法
     */
    @PrePersist
    public void prePersist() {
        if (createTime == null) {
            createTime = LocalDateTime.now();
        }
        if (updateTime == null) {
            updateTime = LocalDateTime.now();
        }
        if (status == null) {
            status = NotificationStatusEnum.DRAFT;
        }
        if (viewCount == null) {
            viewCount = 0;
        }
        if (isPinned == null) {
            isPinned = false;
        }
        if (requireConfirmation == null) {
            requireConfirmation = false;
        }
        if (validityPeriod == null) {
            validityPeriod = 7; // 默认7天有效期
        }
    }
    
    /**
     * 更新预处理
     */
    @PreUpdate
    public void preUpdate() {
        updateTime = LocalDateTime.now();
    }
} 