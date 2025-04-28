package com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement;

import com.baomidou.mybatisplus.annotation.TableName;
import com.smartcampus.domain.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 通知公告确认记录 (e.g., user read confirmation)
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_announcement_confirmation") // Example table name
public class AnnouncementConfirmation extends BaseEntity {

    private Long id;
    private Long announcementId;
    private Long userId;
    private LocalDateTime confirmationTime;

}
