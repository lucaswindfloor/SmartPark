package com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement;

import com.baomidou.mybatisplus.annotation.TableName;
import com.smartcampus.domain.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 通知公告实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_announcement") // Example table name
public class Announcement extends BaseEntity {

    private Long id;
    private String title;
    private String content;
    private String type; // Consider using Enum
    private String status; // Consider using Enum
    private String importance;
    private Boolean requireConfirmation;
    private LocalDateTime confirmationDeadline;
    private String attachments;
    private LocalDateTime publishTime;
    private LocalDateTime scheduledPublishAt;
    private LocalDateTime expiryTime;
    private Integer validityPeriod;
    private LocalDateTime archivedAt;
    private Boolean isTop;
    private Integer sortOrder;
    private Integer viewCount;

    // Add other relevant fields and potentially methods for domain logic

}
