package com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request;

import com.smartcampus.domain.servicemanagement.informationdisclosure.enums.AnnouncementImportanceEnum;
import com.smartcampus.domain.servicemanagement.informationdisclosure.enums.AnnouncementScopeEnum;
import com.smartcampus.domain.servicemanagement.informationdisclosure.enums.AnnouncementTypeEnum;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AnnouncementUpdateDTO {
    // Assume ID is passed via PathVariable
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    private AnnouncementTypeEnum type;
    private AnnouncementImportanceEnum importance;
    private AnnouncementScopeEnum scope;
    private List<Long> scopeDetails;
    private Boolean requireConfirmation;
    private LocalDateTime confirmationDeadline;
    private List<AnnouncementCreateDTO.AttachmentDTO> attachments; // Reuse inner DTO
    private LocalDateTime scheduledPublishAt;
    private Integer validityPeriod;
} 