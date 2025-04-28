package com.smartcampus.platform.comprehensive.servicemanagement.informationdisclosure.dto.announcement.request;

import lombok.Data;

/**
 * 通知公告请求对象 (e.g., for creation or update)
 */
@Data
public class AnnouncementRequest {

    private String title;
    private String content;
    // Add other fields required for requests

}
