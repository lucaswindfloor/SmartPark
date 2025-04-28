package com.smartcampus.common.enums.servicemanagement.informationdisclosure.announcement;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知重要性枚举
 */
@Getter
@AllArgsConstructor
public enum AnnouncementImportanceEnum {
    
    /**
     * 普通
     */
    NORMAL(1, "normal", "普通"),
    
    /**
     * 重要
     */
    IMPORTANT(2, "important", "重要"),
    
    /**
     * 紧急
     */
    EMERGENCY(3, "emergency", "紧急");
    
    private final Integer code;
    private final String key;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static AnnouncementImportanceEnum getByCode(Integer code) {
        for (AnnouncementImportanceEnum importance : values()) {
            if (importance.getCode().equals(code)) {
                return importance;
            }
        }
        return null;
    }

    /**
     * 根据key获取枚举
     */
    public static AnnouncementImportanceEnum getByKey(String key) {
        for (AnnouncementImportanceEnum importance : values()) {
            if (importance.getKey().equals(key)) {
                return importance;
            }
        }
        return null;
    }
} 