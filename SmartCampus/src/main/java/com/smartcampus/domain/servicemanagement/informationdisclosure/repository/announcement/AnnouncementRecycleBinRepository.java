package com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement;

import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRecycleBin;

public interface AnnouncementRecycleBinRepository {
    void save(AnnouncementRecycleBin recycleBin);
    AnnouncementRecycleBin findByAnnouncementId(Long announcementId);
    void recoverAnnouncement(Long announcementId);
    void deleteByAnnouncementId(Long announcementId);
} 