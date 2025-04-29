package com.smartcampus.platform.comprehensive.servicemanagement.controller.informationdisclosure.announcement;

import com.smartcampus.common.response.PageResult;
import com.smartcampus.common.response.Result;
import com.smartcampus.platform.comprehensive.servicemanagement.application.informationdisclosure.announcement.AnnouncementApplicationService;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.AnnouncementDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementQueryDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing Announcements.
 */
@RestController
@RequestMapping("/announcements") // Corrected: Path relative to context path /api
public class AnnouncementController {

    private static final Logger log = LoggerFactory.getLogger(AnnouncementController.class);

    @Autowired
    private AnnouncementApplicationService announcementApplicationService;

    /**
     * GET /api/announcements : Get a paginated list of announcements.
     *
     * @param query Query parameters (pageNo, pageSize, filters, sorting).
     *              Spring automatically maps query parameters to the DTO fields.
     * @return Result containing a PageResult of AnnouncementDTOs.
     */
    @GetMapping // Maps to GET /announcements (which becomes /api/announcements with context path)
    public Result<PageResult<AnnouncementDTO>> listAnnouncements(AnnouncementQueryDTO query) {
        log.info("Entering listAnnouncements controller method with query: {}", query);
        try {
            PageResult<AnnouncementDTO> pageResult = announcementApplicationService.listAnnouncements(query);
            log.info("Exiting listAnnouncements controller method successfully. Found {} records on page {}.",
                     pageResult.getItems().size(), pageResult.getPage());
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("Error in listAnnouncements controller method: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Add other controller methods here for CRUD operations (POST, PUT, DELETE, GET by ID)
    // Example:
    // @GetMapping("/{id}")
    // public Result<AnnouncementDTO> getAnnouncementById(@PathVariable Long id) { ... }
    //
    // @PostMapping
    // public Result<Long> createAnnouncement(@RequestBody CreateAnnouncementRequest request) { ... }
    //
    // @PutMapping("/{id}")
    // public Result<Void> updateAnnouncement(@PathVariable Long id, @RequestBody UpdateAnnouncementRequest request) { ... }
    //
    // @DeleteMapping("/{id}")
    // public Result<Void> deleteAnnouncement(@PathVariable Long id) { ... }

} 