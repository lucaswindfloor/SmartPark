package com.smartcampus.common.enums.servicemanagement.informationdisclosure.announcement;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知权限枚举
 * 五权分立模型：起草、审核、发布、管理、归档
 */
@Getter
@AllArgsConstructor
public enum AnnouncementPermissionEnum {
    
    /**
     * 起草权限：创建和编辑草稿
     */
    DRAFT(1, "draft", "起草权限"),
    
    /**
     * 审核权限：审核草稿（通过、驳回、建议修改）
     */
    AUDIT(2, "audit", "审核权限"),
    
    /**
     * 发布权限：发布或撤回待发布公告
     */
    PUBLISH(3, "publish", "发布权限"),
    
    /**
     * 管理权限：管理已发布公告（置顶、延期、取消发布、删除、统计）
     */
    MANAGE(4, "manage", "管理权限"),
    
    /**
     * 归档权限：归档、解档、查询归档公告
     */
    ARCHIVE(5, "archive", "归档权限");
    
    private final Integer code;
    private final String key;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static AnnouncementPermissionEnum getByCode(Integer code) {
        for (AnnouncementPermissionEnum permission : values()) {
            if (permission.getCode().equals(code)) {
                return permission;
            }
        }
        return null;
    }
    
    /**
     * 根据key获取枚举
     */
    public static AnnouncementPermissionEnum getByKey(String key) {
        for (AnnouncementPermissionEnum permission : values()) {
            if (permission.getKey().equals(key)) {
                return permission;
            }
        }
        return null;
    }
} 