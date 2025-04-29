package com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object for representing attachment details.
 * Used within AnnouncementDTO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDTO {

    /**
     * The display name of the file.
     */
    private String fileName;

    /**
     * The URL to access/download the file.
     */
    private String url;

    // Add other relevant fields if needed, e.g.:
    // private String fileType;
    // private Long fileSize;
} 