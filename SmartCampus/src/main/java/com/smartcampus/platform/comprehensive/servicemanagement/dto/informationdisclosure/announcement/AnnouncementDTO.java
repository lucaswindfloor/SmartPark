package com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List; // Assuming attachments might be a list

/**
 * DTO representing an announcement for list view or detail view.
 * Fields match expectations of the frontend List.vue and schema.sql.
 */
@Data
public class AnnouncementDTO {

    private Long id;
    private String title;
    private String content; // Include content for potential detail view reuse
    private String type; // Type code (e.g., 'notice', 'policy')
    private String status; // Status code (e.g., 'draft', 'published')
    private String importance; // Importance level code
    private Boolean requireConfirmation;
    private LocalDateTime confirmationDeadline;
    private List<AttachmentDTO> attachments; // Assuming an AttachmentDTO exists or will be created

    private LocalDateTime publishTime; // Actual publish time
    private LocalDateTime scheduledPublishAt; // Scheduled publish time
    private LocalDateTime expiryTime; // Expiry time
    private Integer validityPeriod; // Validity period in days
    private LocalDateTime archivedAt; // Archive time

    private Boolean isTop; // is_top in schema
    private Integer sortOrder;

    private Integer readCount; // Mapped from view_count in schema

    // Fields from BaseEntity or mapped from joins
    private LocalDateTime createTime;
    private String createBy; // Username of the creator
    private String publisher; // Mapped from user table based on create_by/creator_id - frontend expects this
    private LocalDateTime updateTime;
    private String updateBy;

    // Additional fields that might be useful for the frontend logic
    // private Boolean isRead; // This would typically be user-specific, calculated elsewhere
    // private Boolean isImportant; // Can be derived from importance code if needed
}

// Placeholder for Attachment DTO if needed for the list/detail view
// @Data
// class AttachmentDTO {
//     private String fileName;
//     private String url;
// } 