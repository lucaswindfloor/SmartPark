package com.smartcampus.domain.servicemanagement.informationdisclosure.enums;

import lombok.Getter;

@Getter
public enum AnnouncementImportanceEnum {
    NORMAL("普通"),
    IMPORTANT("重要"),
    EMERGENCY("紧急");

    private final String description;

    AnnouncementImportanceEnum(String description) {
        this.description = description;
    }
} 