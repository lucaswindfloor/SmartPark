package com.smartcampus.common.enums.information;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通知状态枚举
 * 完整生命周期：草稿 → 待审核 → 待发布 → 已发布 → 已过期/已取消发布 → 档案
 */
@Getter
@AllArgsConstructor
public enum NoticeStatusEnum {
    
    /**
     * 草稿
     */
    DRAFT(1, "草稿"),
    
    /**
     * 待审核
     */
    PENDING_REVIEW(2, "待审核"),
    
    /**
     * 待发布
     */
    PENDING_PUBLISH(3, "待发布"),
    
    /**
     * 已发布
     */
    PUBLISHED(4, "已发布"),
    
    /**
     * 已过期
     */
    EXPIRED(5, "已过期"),
    
    /**
     * 已取消发布
     */
    CANCELLED(6, "已取消发布"),
    
    /**
     * 档案
     */
    ARCHIVED(7, "档案");
    
    private final Integer code;
    private final String description;
    
    /**
     * 根据code获取枚举
     */
    public static NoticeStatusEnum getByCode(Integer code) {
        for (NoticeStatusEnum status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
} 