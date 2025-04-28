package com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement;

import com.baomidou.mybatisplus.annotation.TableName;
import com.smartcampus.domain.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 通知公告权限/范围定义 (e.g., visible to which department/role)
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_announcement_permission") // Example table name
public class AnnouncementPermission extends BaseEntity {

    private Long id;
    private Long announcementId;
    private String targetType; // e.g., ROLE, DEPARTMENT, USER
    private Long targetId; // ID of the role, department, or user

}
