package com.smartcampus.platform.comprehensive.servicemanagement.application.informationdisclosure.announcement;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smartcampus.common.response.PageResult;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementRepository;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.AnnouncementDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementQueryDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Application Service for managing Announcements.
 */
@Service
public class AnnouncementApplicationService {

    private static final Logger log = LoggerFactory.getLogger(AnnouncementApplicationService.class);

    @Autowired
    private AnnouncementRepository announcementRepository;

    /**
     * Retrieves a paginated list of announcements based on query criteria.
     *
     * @param query The query DTO containing pagination, filtering, and sorting info.
     * @return A PageResult containing AnnouncementDTOs.
     */
    @Transactional(readOnly = true) // Mark as read-only transaction if only reading
    public PageResult<AnnouncementDTO> listAnnouncements(AnnouncementQueryDTO query) {
        log.info("Entering listAnnouncements service method with query: {}", query);
        // 1. Create MyBatis Plus Page object
        Page<Announcement> page = new Page<>(query.getPageNo(), query.getPageSize());
        log.debug("Created Page object: page={}, size={}", page.getCurrent(), page.getSize());

        // 2. Call repository to fetch data (Mapper handles the SQL query)
        Page<AnnouncementDTO> resultPage;
        try {
            resultPage = announcementRepository.findPage(page, query);
            log.info("Repository findPage returned {} total records. Current page has {} records.",
                     resultPage.getTotal(), resultPage.getRecords().size());
            log.debug("Result Page Details: Current={}, Size={}, Total={}, Pages={}",
                      resultPage.getCurrent(), resultPage.getSize(), resultPage.getTotal(), resultPage.getPages());
        } catch (Exception e) {
            log.error("Error calling announcementRepository.findPage: {}", e.getMessage(), e);
            // Depending on error handling strategy, you might return an empty result or rethrow
            throw e; // Rethrow to be handled by controller or global handler
        }

        // 3. Map MyBatis Plus Page to custom PageResult
        PageResult<AnnouncementDTO> finalResult = PageResult.create(
                resultPage.getCurrent(),
                resultPage.getSize(),
                resultPage.getTotal(),
                resultPage.getRecords()
        );
        log.info("Exiting listAnnouncements service method.");
        return finalResult;
    }

    // Add other application service methods here (create, update, delete, getDetail, etc.)
    // Example:
    // public AnnouncementDTO getAnnouncementById(Long id) { ... }
    // public Long createAnnouncement(CreateAnnouncementRequest request) { ... }
    // public void updateAnnouncement(Long id, UpdateAnnouncementRequest request) { ... }
    // public void deleteAnnouncement(Long id) { ... }

} 