package com.smartcampus.domain.servicemanagement.informationdisclosure.event.announcement;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AnnouncementCreatedEvent {
    private final Long announcementId;
    private final String title;
    private final String createdBy;
    private final LocalDateTime createdTime;
    
    public AnnouncementCreatedEvent(Long announcementId, String title, String createdBy, LocalDateTime createdTime) {
        this.announcementId = announcementId;
        this.title = title;
        this.createdBy = createdBy;
        this.createdTime = createdTime;
    }
} 