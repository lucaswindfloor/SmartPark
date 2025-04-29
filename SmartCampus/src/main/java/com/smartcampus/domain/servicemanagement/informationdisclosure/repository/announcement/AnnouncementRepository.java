package com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.AnnouncementDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementQueryDTO;

/**
 * Repository interface for Announcement domain.
 */
public interface AnnouncementRepository {

    /**
     * Find announcements by query criteria with pagination.
     *
     * @param page The pagination object (from MyBatis Plus).
     * @param query The query DTO containing filtering and sorting parameters.
     * @return A page containing AnnouncementDTOs including joined data (e.g., publisher name).
     */
    Page<AnnouncementDTO> findPage(Page<Announcement> page, AnnouncementQueryDTO query);

    // Add other necessary repository methods based on requirements:
    // Announcement findById(Long id);
    // AnnouncementDTO findDetailById(Long id); // May need specific DTO
    // void save(Announcement announcement);
    // void update(Announcement announcement);
    // void deleteLogically(Long id);
}
