package com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.smartcampus.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * Announcement Domain Entity
 * Maps directly to the t_announcement table.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_announcement")
public class Announcement extends BaseEntity {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("title")
    private String title;

    @TableField("content")
    private String content;

    @TableField("type")
    private String type; // Consider mapping to an Enum later

    @TableField("status")
    private String status; // Consider mapping to an Enum later

    @TableField("importance")
    private String importance; // Consider mapping to an Enum later

    @TableField("require_confirmation")
    private Boolean requireConfirmation;

    @TableField("confirmation_deadline")
    private LocalDateTime confirmationDeadline;

    // JSON fields require TypeHandler in MyBatis Plus config or handle as String
    @TableField("attachments")
    private String attachments; // Storing JSON as String for simplicity initially

    @TableField("publish_time")
    private LocalDateTime publishTime;

    @TableField("scheduled_publish_at")
    private LocalDateTime scheduledPublishAt;

    @TableField("expiry_time")
    private LocalDateTime expiryTime;

    @TableField("validity_period")
    private Integer validityPeriod;

    @TableField("archived_at")
    private LocalDateTime archivedAt;

    @TableField("is_top")
    private Boolean isTop;

    @TableField("sort_order")
    private Integer sortOrder;

    @TableField("view_count")
    private Integer viewCount;

}
