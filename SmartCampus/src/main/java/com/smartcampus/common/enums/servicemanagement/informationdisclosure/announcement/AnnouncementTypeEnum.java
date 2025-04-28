package com.smartcampus.common.enums.servicemanagement.informationdisclosure.announcement;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知类型枚举
 */
@Getter
@AllArgsConstructor
public enum AnnouncementTypeEnum {
    
    /**
     * 普通通知
     */
    NORMAL(1, "normal", "普通通知"),
    
    /**
     * 政策文件
     */
    POLICY(2, "policy", "政策文件"),
    
    /**
     * 园区活动
     */
    EVENT(3, "event", "园区活动"),
    
    /**
     * 紧急通知
     */
    EMERGENCY(4, "emergency", "紧急通知");
    
    private final Integer code;
    private final String key;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static AnnouncementTypeEnum getByCode(Integer code) {
        for (AnnouncementTypeEnum type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return null;
    }

    /**
     * 根据key获取枚举
     */
    public static AnnouncementTypeEnum getByKey(String key) {
        for (AnnouncementTypeEnum type : values()) {
            if (type.getKey().equals(key)) {
                return type;
            }
        }
        return null;
    }
} 