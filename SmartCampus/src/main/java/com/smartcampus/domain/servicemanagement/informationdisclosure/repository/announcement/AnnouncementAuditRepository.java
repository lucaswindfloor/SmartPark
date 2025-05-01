package com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement;

import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementAudit;

import java.util.List;

public interface AnnouncementAuditRepository {
    void save(AnnouncementAudit audit);
    List<AnnouncementAudit> findByAnnouncementId(Long announcementId);
} 