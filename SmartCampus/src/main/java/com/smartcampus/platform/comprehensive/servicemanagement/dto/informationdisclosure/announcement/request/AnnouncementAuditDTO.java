package com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request;

import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class AnnouncementAuditDTO {
    @NotNull
    private Boolean approved; // true for approve, false for reject
    private String comment; // Optional comments, required if rejecting
} 