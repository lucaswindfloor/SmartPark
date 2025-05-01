package com.smartcampus.infrastructure.event.servicemanagement.informationdisclosure.announcement;

import com.smartcampus.domain.servicemanagement.informationdisclosure.event.announcement.AnnouncementCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class AnnouncementEventListener {
    private static final Logger log = LoggerFactory.getLogger(AnnouncementEventListener.class);
    
    @EventListener
    public void handleAnnouncementCreatedEvent(AnnouncementCreatedEvent event) {
        log.info("Announcement created: {}, by: {}", event.getTitle(), event.getCreatedBy());
        // 处理事件逻辑，比如通知相关人员
    }
    
    // 监听其他事件的方法
} 