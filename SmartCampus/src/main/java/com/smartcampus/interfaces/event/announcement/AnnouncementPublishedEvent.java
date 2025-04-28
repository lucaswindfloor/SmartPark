package com.smartcampus.interfaces.event.announcement;

// You might use Spring's ApplicationEvent or a custom event class
import org.springframework.context.ApplicationEvent;

/**
 * 通知公告发布事件
 */
public class AnnouncementPublishedEvent extends ApplicationEvent {
    private Long announcementId;

    public AnnouncementPublishedEvent(Object source, Long announcementId) {
        super(source);
        this.announcementId = announcementId;
    }

    public Long getAnnouncementId() {
        return announcementId;
    }
} 