package com.smartcampus.domain.information.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 公告权限实体
 */
@Entity
@Table(name = "t_announcement_permission")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 公告ID
     */
    @Column(nullable = false)
    private Long announcementId;
    
    /**
     * 权限类型：1-部门 2-角色 3-用户
     */
    @Column(nullable = false)
    private Integer permissionType;
    
    /**
     * 关联ID：部门ID、角色ID或用户ID
     */
    @Column(nullable = false)
    private Long targetId;
    
    /**
     * 创建时间
     */
    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createTime = LocalDateTime.now();
    
    /**
     * 更新时间
     */
    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime updateTime = LocalDateTime.now();
} 