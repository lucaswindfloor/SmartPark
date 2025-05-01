package com.smartcampus.domain.servicemanagement.informationdisclosure.enums;

import lombok.Getter;

@Getter
public enum AnnouncementTypeEnum {
    NORMAL("普通通知"),
    POLICY("政策文件"),
    EVENT("活动信息"),
    EMERGENCY("紧急通知");
    // Add others if needed

    private final String description;

    AnnouncementTypeEnum(String description) {
        this.description = description;
    }
} 