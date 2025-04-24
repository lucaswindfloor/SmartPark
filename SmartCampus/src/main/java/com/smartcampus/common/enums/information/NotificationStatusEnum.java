package com.smartcampus.common.enums.information;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知状态枚举
 */
@Getter
@AllArgsConstructor
public enum NotificationStatusEnum {
    
    /**
     * 待发送
     */
    PENDING(1, "待发送"),
    
    /**
     * 已发送
     */
    SENT(2, "已发送"),
    
    /**
     * 已读
     */
    READ(3, "已读"),
    
    /**
     * 发送失败
     */
    FAILED(4, "发送失败"),
    
    /**
     * 已取消
     */
    CANCELLED(5, "已取消");
    
    private final Integer code;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static NotificationStatusEnum getByCode(Integer code) {
        for (NotificationStatusEnum status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
} 