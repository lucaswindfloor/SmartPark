package com.smartcampus.domain.servicemanagement.informationdisclosure.enums;

import lombok.Getter;

@Getter
public enum AnnouncementStatusEnum {
    DRAFT("草稿"),
    PENDING_APPROVAL("待审核"),
    // PENDING_PUBLISH("待发布"), // SDD uses this, PRD implies direct from Audit to Publish/Reject
    APPROVED("已批准"), // Intermediate state after audit before publish
    REJECTED("已驳回"), // State after audit rejection
    PUBLISHED("已发布"),
    EXPIRED("已过期"),
    WITHDRAWN("已撤回"), // Renamed from CANCELED in SDD for clarity
    ARCHIVED("档案");

    private final String description;

    AnnouncementStatusEnum(String description) {
        this.description = description;
    }

    // Optional: Method to find enum by string value if needed
} 