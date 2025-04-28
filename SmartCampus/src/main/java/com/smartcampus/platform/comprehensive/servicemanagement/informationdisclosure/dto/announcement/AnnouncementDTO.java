package com.smartcampus.platform.comprehensive.servicemanagement.informationdisclosure.dto.announcement;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 通知公告数据传输对象
 */
@Data
public class AnnouncementDTO {

    private Long id;
    private String title;
    private String content;
    private String status;
    private String type;
    private LocalDateTime publishTime;
    // Add other relevant fields to be displayed

}
