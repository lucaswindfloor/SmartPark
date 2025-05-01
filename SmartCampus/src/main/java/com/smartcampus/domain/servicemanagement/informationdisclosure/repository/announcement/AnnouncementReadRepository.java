package com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement;

import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRead;

import java.util.List;

public interface AnnouncementReadRepository {
    void save(AnnouncementRead read);
    List<AnnouncementRead> findByAnnouncementId(Long announcementId);
    AnnouncementRead findByAnnouncementIdAndUsername(Long announcementId, String username);
    int countByAnnouncementId(Long announcementId);
} 