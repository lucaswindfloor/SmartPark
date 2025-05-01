package com.smartcampus.domain.servicemanagement.informationdisclosure.enums;

import lombok.Getter;

@Getter
public enum AnnouncementScopeEnum {
    ALL("全园区"),
    ENTERPRISE("特定企业"),
    ROLE("特定角色");
    // Add DEPARTMENT, USER etc. if needed based on t_announcement_permission

    private final String description;

    AnnouncementScopeEnum(String description) {
        this.description = description;
    }
} 