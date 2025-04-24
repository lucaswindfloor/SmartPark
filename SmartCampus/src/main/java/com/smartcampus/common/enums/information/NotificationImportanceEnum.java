package com.smartcampus.common.enums.information;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知重要性枚举
 */
@Getter
@AllArgsConstructor
public enum NotificationImportanceEnum {
    
    /**
     * 低重要性
     */
    LOW(1, "低"),
    
    /**
     * 中等重要性
     */
    MEDIUM(2, "中"),
    
    /**
     * 高重要性
     */
    HIGH(3, "高"),
    
    /**
     * 紧急
     */
    URGENT(4, "紧急");
    
    private final Integer code;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static NotificationImportanceEnum getByCode(Integer code) {
        for (NotificationImportanceEnum importance : values()) {
            if (importance.getCode().equals(code)) {
                return importance;
            }
        }
        return null;
    }
} 