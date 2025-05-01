package com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.smartcampus.common.entity.BaseEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("t_announcement_recycle_bin")
public class AnnouncementRecycleBin extends BaseEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("announcement_id")
    private Long announcementId;
    
    @TableField("deleted_by")
    private String deletedBy;
    
    @TableField("deleted_time")
    private LocalDateTime deletedTime;
    
    @TableField("recovery_deadline")
    private LocalDateTime recoveryDeadline;
} 