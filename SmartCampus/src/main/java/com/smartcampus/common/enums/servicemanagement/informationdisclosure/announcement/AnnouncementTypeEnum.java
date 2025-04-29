package com.smartcampus.common.enums.servicemanagement.informationdisclosure.announcement;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 通知公告类型枚举
 */
@Getter
@RequiredArgsConstructor
public enum AnnouncementTypeEnum {
    SYSTEM_NOTICE("SYSTEM_NOTICE", "系统通知"),
    POLICY_UPDATE("POLICY_UPDATE", "政策更新"),
    CAMPUS_ACTIVITY("CAMPUS_ACTIVITY", "园区活动"),
    EMERGENCY_ALERT("EMERGENCY_ALERT", "紧急告警"),
    OTHER("OTHER", "其他");

    private final String code;
    private final String description;

    // Optional: Add method to get enum from code
    public static AnnouncementTypeEnum fromCode(String code) {
        for (AnnouncementTypeEnum type : AnnouncementTypeEnum.values()) {
            if (type.getCode().equalsIgnoreCase(code)) {
                return type;
            }
        }
        return null; // Or throw exception
    }
} 