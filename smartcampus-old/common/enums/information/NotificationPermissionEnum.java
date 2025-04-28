package com.smartcampus.common.enums.information;

/**
 * 通知公告权限枚举
 */
public enum NotificationPermissionEnum {
    /**
     * 起草权限
     */
    DRAFT("draft", "起草权限"),
    
    /**
     * 审核权限
     */
    AUDIT("audit", "审核权限"),
    
    /**
     * 发布权限
     */
    PUBLISH("publish", "发布权限"),
    
    /**
     * 管理权限
     */
    MANAGE("manage", "管理权限"),
    
    /**
     * 归档权限
     */
    ARCHIVE("archive", "归档权限");
    
    private final String code;
    private final String desc;
    
    NotificationPermissionEnum(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDesc() {
        return desc;
    }
} 