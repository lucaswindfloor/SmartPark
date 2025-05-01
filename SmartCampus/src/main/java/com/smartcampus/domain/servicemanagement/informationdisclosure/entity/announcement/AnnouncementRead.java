package com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.smartcampus.common.entity.BaseEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("t_announcement_views")
public class AnnouncementRead extends BaseEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("announcement_id")
    private Long announcementId;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("username")
    private String username;
    
    @TableField("read_time")
    private LocalDateTime readTime;
} 