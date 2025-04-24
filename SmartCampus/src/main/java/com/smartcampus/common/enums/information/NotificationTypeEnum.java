package com.smartcampus.common.enums.information;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知类型枚举
 */
@Getter
@AllArgsConstructor
public enum NotificationTypeEnum {
    
    /**
     * 邮件通知
     */
    EMAIL(1, "邮件通知"),
    
    /**
     * 短信通知
     */
    SMS(2, "短信通知"),
    
    /**
     * 应用内通知
     */
    IN_APP(3, "应用内通知"),
    
    /**
     * 推送通知
     */
    PUSH(4, "推送通知"),
    
    /**
     * 系统通知
     */
    SYSTEM(5, "系统通知");
    
    private final Integer code;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static NotificationTypeEnum getByCode(Integer code) {
        for (NotificationTypeEnum type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return null;
    }
} 