package com.smartcampus.common.enums.servicemanagement.informationdisclosure.announcement;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知公开范围枚举
 */
@Getter
@AllArgsConstructor
public enum AnnouncementScopeEnum {
    
    /**
     * 全部可见
     */
    ALL(1, "all", "全部可见"),
    
    /**
     * 企业可见
     */
    ENTERPRISE(2, "enterprise", "企业可见"),
    
    /**
     * 角色可见
     */
    ROLE(3, "role", "角色可见");
    
    private final Integer code;
    private final String key;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static AnnouncementScopeEnum getByCode(Integer code) {
        for (AnnouncementScopeEnum scope : values()) {
            if (scope.getCode().equals(code)) {
                return scope;
            }
        }
        return null;
    }
    
    /**
     * 根据key获取枚举
     */
    public static AnnouncementScopeEnum getByKey(String key) {
        for (AnnouncementScopeEnum scope : values()) {
            if (scope.getKey().equals(key)) {
                return scope;
            }
        }
        return null;
    }
} 