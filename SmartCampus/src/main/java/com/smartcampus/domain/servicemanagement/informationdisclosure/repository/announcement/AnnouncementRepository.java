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

    /**
     * Find announcement by ID.
     *
     * @param id The announcement ID.
     * @return The announcement entity or null if not found.
     */
    Announcement findById(Long id);

    /**
     * Save a new or update an existing announcement.
     *
     * @param announcement The announcement entity to save.
     */
    void save(Announcement announcement);

    /**
     * Update an existing announcement by ID.
     *
     * @param announcement The announcement entity with updated fields.
     */
    void updateById(Announcement announcement);

    /**
     * Delete announcement by ID (logical delete).
     *
     * @param id The announcement ID to delete.
     */
    void deleteById(Long id);
    
    /**
     * Recover a logically deleted announcement by ID.
     *
     * @param id The announcement ID to recover.
     */
    void recoverById(Long id);

    // Add other necessary repository methods based on requirements:
    // AnnouncementDTO findDetailById(Long id); // May need specific DTO
    // void deleteLogically(Long id);
}
