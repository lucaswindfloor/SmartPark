package com.smartcampus.common.enums.servicemanagement.informationdisclosure.announcement;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 通知公告状态枚举
 */
@Getter
@RequiredArgsConstructor
public enum AnnouncementStatusEnum {
    /**
     * 草稿
     */
    DRAFT("DRAFT", "草稿"),
    
    /**
     * 待审核
     */
    PENDING_APPROVAL("PENDING_APPROVAL", "待审核"),
    
    /**
     * 已发布
     */
    PUBLISHED("PUBLISHED", "已发布"),
    
    /**
     * 已驳回
     */
    REJECTED("REJECTED", "已驳回"),
    
    /**
     * 已归档
     */
    ARCHIVED("ARCHIVED", "已归档"),
    
    /**
     * 已撤回
     */
    WITHDRAWN("WITHDRAWN", "已撤回");
    
    private final String code;
    private final String description;
    
    /**
     * 根据code获取状态枚举
     */
    public static AnnouncementStatusEnum fromCode(String code) {
        for (AnnouncementStatusEnum status : AnnouncementStatusEnum.values()) {
            if (status.getCode().equalsIgnoreCase(code)) {
                return status;
            }
        }
        return null;
    }
} 