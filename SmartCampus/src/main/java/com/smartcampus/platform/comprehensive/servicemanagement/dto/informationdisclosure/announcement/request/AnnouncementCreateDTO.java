package com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request;

import com.smartcampus.domain.servicemanagement.informationdisclosure.enums.AnnouncementImportanceEnum;
import com.smartcampus.domain.servicemanagement.informationdisclosure.enums.AnnouncementScopeEnum;
import com.smartcampus.domain.servicemanagement.informationdisclosure.enums.AnnouncementTypeEnum;
import lombok.Data;
// Import validation annotations if needed
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List; // For scope details and attachments

@Data
public class AnnouncementCreateDTO {
    @NotBlank
    private String title;
    @NotBlank
    private String content; // Rich text
    @NotNull
    private AnnouncementTypeEnum type;
    @NotNull
    private AnnouncementImportanceEnum importance;
    @NotNull
    private AnnouncementScopeEnum scope;
    private List<Long> scopeDetails; // List of enterprise/role IDs if scope is not ALL
    private Boolean requireConfirmation;
    private LocalDateTime confirmationDeadline;
    private List<AttachmentDTO> attachments; // Define AttachmentDTO if needed
    private LocalDateTime scheduledPublishAt;
    private Integer validityPeriod; // Optional, defaults in DB

    // Placeholder for AttachmentDTO structure (define properly elsewhere)
    @Data
    public static class AttachmentDTO {
        private String fileName;
        private String url;
    }
} 