package com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request;

import lombok.Data;
// Consider adding validation annotations if using spring-boot-starter-validation
// import javax.validation.constraints.Min;
// import javax.validation.constraints.Positive;

/**
 * DTO for announcement list query parameters received from the frontend.
 */
@Data
public class AnnouncementQueryDTO {

    // Pagination
    // @Min(value = 1, message = "Page number must be at least 1")
    private Integer pageNo = 1; // Default to page 1

    // @Positive(message = "Page size must be positive")
    private Integer pageSize = 10; // Default page size

    // Filtering
    private String title; // Title keyword search
    private String status; // Filter by status code
    private String type; // Filter by type code
    private String importance; // Filter by importance
    private String startDate; // Start date for date range filter (format: YYYY-MM-DD)
    private String endDate; // End date for date range filter (format: YYYY-MM-DD)

    // View Type (from frontend tabs like 'draft', 'published', etc.)
    private String viewType; // Specific view filter (e.g., 'draft', 'published')

    // Sorting (Example: pass field name and direction)
    private String sortField; // Field to sort by (e.g., 'publishTime', 'readCount')
    private String sortOrder; // 'asc' or 'desc'
    
    // Recycle Bin flag - for retrieving items from the recycle bin
    private Boolean recycleBin = false;

    // Add other potential query params as needed
    // private Long creatorId;
    // private Boolean requireConfirmation;
} 