package com.smartcampus.common.enums.information;

/**
 * 公告状态枚举
 */
public enum AnnouncementStatusEnum {
    /**
     * 草稿
     */
    DRAFT("draft", "草稿"),
    
    /**
     * 待审核
     */
    PENDING_AUDIT("pending_audit", "待审核"),
    
    /**
     * 待发布
     */
    PENDING_PUBLISH("pending_publish", "待发布"),
    
    /**
     * 已发布
     */
    PUBLISHED("published", "已发布"),
    
    /**
     * 已过期
     */
    EXPIRED("expired", "已过期"),
    
    /**
     * 已取消发布
     */
    CANCELED("canceled", "已取消发布"),
    
    /**
     * 已归档
     */
    ARCHIVED("archived", "已归档"),
    
    /**
     * 已删除（回收站）
     */
    DELETED("deleted", "已删除");
    
    private final String code;
    private final String desc;
    
    AnnouncementStatusEnum(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDesc() {
        return desc;
    }
    
    /**
     * 根据code获取状态枚举
     */
    public static AnnouncementStatusEnum getByCode(String code) {
        for (AnnouncementStatusEnum status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
} 