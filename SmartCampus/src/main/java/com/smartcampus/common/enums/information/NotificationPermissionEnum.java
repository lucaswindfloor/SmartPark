package com.smartcampus.common.enums.information;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知权限枚举
 */
@Getter
@AllArgsConstructor
public enum NotificationPermissionEnum {
    
    /**
     * 公开 - 所有人可见
     */
    PUBLIC(1, "公开"),
    
    /**
     * 部门内 - 仅部门内可见
     */
    DEPARTMENT(2, "部门内"),
    
    /**
     * 角色内 - 仅指定角色可见
     */
    ROLE(3, "角色内"),
    
    /**
     * 个人 - 仅指定个人可见
     */
    PERSONAL(4, "个人");
    
    private final Integer code;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static NotificationPermissionEnum getByCode(Integer code) {
        for (NotificationPermissionEnum permission : values()) {
            if (permission.getCode().equals(code)) {
                return permission;
            }
        }
        return null;
    }
} 