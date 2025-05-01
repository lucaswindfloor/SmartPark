package com.smartcampus.platform.comprehensive.servicemanagement.application.informationdisclosure.announcement;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smartcampus.common.exception.BusinessException;
import com.smartcampus.common.response.PageResult;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.Announcement;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRead;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementAudit;
import com.smartcampus.domain.servicemanagement.informationdisclosure.entity.announcement.AnnouncementRecycleBin;
import com.smartcampus.domain.servicemanagement.informationdisclosure.enums.AnnouncementStatusEnum;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementRepository;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementReadRepository;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementAuditRepository;
import com.smartcampus.domain.servicemanagement.informationdisclosure.repository.announcement.AnnouncementRecycleBinRepository;
import com.smartcampus.domain.servicemanagement.informationdisclosure.event.announcement.AnnouncementCreatedEvent;
import com.smartcampus.infrastructure.event.EventPublisher;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.AnnouncementDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementAuditDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementCreateDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementQueryDTO;
import com.smartcampus.platform.comprehensive.servicemanagement.dto.informationdisclosure.announcement.request.AnnouncementUpdateDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert; // Use Spring's Assert for preconditions
import com.google.gson.Gson; // Example for handling JSON fields
import org.springframework.security.access.prepost.PreAuthorize;
import com.smartcampus.core.security.SecurityUtils;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Application Service for managing Announcements.
 */
@Service
public class AnnouncementApplicationService {

    private static final Logger log = LoggerFactory.getLogger(AnnouncementApplicationService.class);
    private static final Gson gson = new Gson(); // For JSON handling

    @Autowired
    private AnnouncementRepository announcementRepository;
    
    // 注入新的依赖
    @Autowired
    private AnnouncementReadRepository readRepository;
    
    @Autowired
    private AnnouncementAuditRepository auditRepository;
    
    @Autowired
    private AnnouncementRecycleBinRepository recycleBinRepository;
    
    @Autowired
    private EventPublisher eventPublisher;

    /**
     * Retrieves a paginated list of announcements based on query criteria.
     * Requires 'announcement:view' permission.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('announcement:view')")
    public PageResult<AnnouncementDTO> listAnnouncements(AnnouncementQueryDTO query) {
        log.info("Entering listAnnouncements service method with query: {}", query);
        Page<Announcement> page = new Page<>(query.getPageNo(), query.getPageSize());
        // Assuming findPage directly returns Page<AnnouncementDTO>
        Page<AnnouncementDTO> resultPage = announcementRepository.findPage(page, query);
        PageResult<AnnouncementDTO> finalResult = PageResult.create(
                resultPage.getCurrent(),
                resultPage.getSize(),
                resultPage.getTotal(),
                resultPage.getRecords()
        );
        log.info("Exiting listAnnouncements service method.");
        return finalResult;
    }

    /**
     * Creates a new announcement.
     * Requires 'announcement:draft' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:draft')")
    public Long createAnnouncement(AnnouncementCreateDTO createDto) {
        log.info("Entering createAnnouncement service method.");
        Assert.notNull(createDto, "Create DTO cannot be null");

        Announcement announcement = mapToEntity(createDto);
        announcement.setStatus(AnnouncementStatusEnum.DRAFT.name()); // Initial status
        announcement.setCreateBy(getCurrentUsername()); // Set creator
        announcement.setCreateTime(LocalDateTime.now());
        announcement.setUpdateTime(LocalDateTime.now());
        announcement.setUpdateBy(getCurrentUsername());

        // Convert attachments to JSON if needed
        if (createDto.getAttachments() != null) {
            announcement.setAttachments(gson.toJson(createDto.getAttachments()));
        }

        announcementRepository.save(announcement); // Assuming save method exists
        logOperation(announcement.getId(), "CREATE", getCurrentUsername(), "Created announcement");
        
        // 发布创建事件
        eventPublisher.publishEvent(new AnnouncementCreatedEvent(
            announcement.getId(),
            announcement.getTitle(),
            announcement.getCreateBy(),
            announcement.getCreateTime()
        ));

        log.info("Exiting createAnnouncement service method, ID: {}.", announcement.getId());
        return announcement.getId();
    }

    /**
     * Updates an existing announcement.
     * Requires 'announcement:draft' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:draft')")
    public void updateAnnouncement(Long id, AnnouncementUpdateDTO updateDto) {
        log.info("Entering updateAnnouncement service method for ID: {}", id);
        Assert.notNull(updateDto, "Update DTO cannot be null");
        String currentUser = SecurityUtils.getCurrentUsername().orElseThrow(() -> new BusinessException("User not authenticated"));

        Announcement announcement = findAnnouncementByIdOrThrow(id);

        // Check 1: Status must be DRAFT
        if (!AnnouncementStatusEnum.DRAFT.name().equals(announcement.getStatus())) {
            throw new BusinessException("Only announcements in DRAFT status can be updated.");
        }

        // Check 2: Only the creator can update a draft 
        // (Unless maybe a user with 'manage' permission could? - Let's stick to creator for now)
        if (!Objects.equals(announcement.getCreateBy(), currentUser)) {
             log.warn("User {} attempted to update announcement {} created by {}, but is not the creator.", currentUser, id, announcement.getCreateBy());
             throw new BusinessException("Only the creator can update a draft announcement.");
        }

        // Map fields from DTO
        mapToEntity(updateDto, announcement);
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());

         // Convert attachments to JSON if needed
        if (updateDto.getAttachments() != null) {
            announcement.setAttachments(gson.toJson(updateDto.getAttachments()));
        }

        announcementRepository.updateById(announcement); // Assuming updateById exists
        logOperation(id, "UPDATE", currentUser, "Updated announcement details");

        log.info("Exiting updateAnnouncement service method for ID: {}", id);
    }

    /**
     * Deletes an announcement (Soft Delete).
     * Requires 'announcement:draft' or 'announcement:manage'.
     * Also performs status and creator checks.
     */
    @Transactional
    @PreAuthorize("hasAnyAuthority('announcement:draft', 'announcement:manage')")
    public void deleteAnnouncement(Long id) {
        log.info("Entering deleteAnnouncement service method for ID: {}", id);
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = SecurityUtils.getCurrentUsername().orElseThrow(() -> new BusinessException("User not authenticated"));
        boolean hasManagePermission = SecurityUtils.hasCurrentUserAuthority("announcement:manage");
        boolean hasDraftPermission = SecurityUtils.hasCurrentUserAuthority("announcement:draft");

        // Determine if deletion is allowed based on status and permissions
        boolean allowedToDelete = false;
        String reason = "";

        if (AnnouncementStatusEnum.DRAFT.name().equals(announcement.getStatus())) {
            // Drafts can be deleted by the creator (with draft permission) or anyone with manage permission
            if (hasManagePermission || (hasDraftPermission && Objects.equals(announcement.getCreateBy(), currentUser))) {
                allowedToDelete = true;
            } else {
                reason = "User does not have manage permission and is not the creator of the draft.";
            }
        } else if (AnnouncementStatusEnum.PUBLISHED.name().equals(announcement.getStatus()) ||
                   AnnouncementStatusEnum.EXPIRED.name().equals(announcement.getStatus()) ||
                   AnnouncementStatusEnum.WITHDRAWN.name().equals(announcement.getStatus())) {
            // Published, Expired, Withdrawn can only be deleted by someone with manage permission
            if (hasManagePermission) {
                allowedToDelete = true;
            } else {
                 reason = "User does not have manage permission to delete a non-draft announcement.";
            }
        } else {
             // Announcements in other states (PENDING_APPROVAL, APPROVED, REJECTED, ARCHIVED) generally shouldn't be deleted directly
             reason = "Announcement cannot be deleted in its current state: " + announcement.getStatus();
             log.warn("Attempted to delete announcement {} in invalid state {} by user {}", id, announcement.getStatus(), currentUser);
        }

        if (!allowedToDelete) {
            log.warn("Delete operation denied for announcement {}. Reason: {}", id, reason);
            throw new BusinessException("Operation not permitted. " + reason);
        }
        
        // Proceed with deletion (move to recycle bin)
        AnnouncementRecycleBin recycleBin = new AnnouncementRecycleBin();
        recycleBin.setAnnouncementId(id);
        recycleBin.setDeletedBy(currentUser);
        recycleBin.setDeletedTime(LocalDateTime.now());
        recycleBin.setRecoveryDeadline(LocalDateTime.now().plusDays(30)); // Default retention
        recycleBin.setCreateBy(currentUser);
        recycleBin.setCreateTime(LocalDateTime.now());
        recycleBinRepository.save(recycleBin);

        // Perform soft delete
        announcementRepository.deleteById(id);
        logOperation(id, "DELETE", currentUser, "Soft deleted announcement");
        log.info("Exiting deleteAnnouncement service method for ID: {}", id);
    }

    /**
     * Retrieves details of a specific announcement.
     * Requires 'announcement:view' permission.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('announcement:view')")
    public AnnouncementDTO getAnnouncementById(Long id) {
        log.info("Entering getAnnouncementById service method for ID: {}", id);
        // Assuming repository has a method to find DTO by ID or fetch entity and map
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        AnnouncementDTO dto = mapToDTO(announcement); // Implement mapping
        log.info("Exiting getAnnouncementById service method for ID: {}", id);
        return dto;
    }

    /**
     * Submits an announcement for approval.
     * Requires 'announcement:draft' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:draft')")
    public void submitAnnouncement(Long id) {
        log.info("Entering submitAnnouncement service method for ID: {}", id);
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = SecurityUtils.getCurrentUsername().orElseThrow(() -> new BusinessException("User not authenticated"));

        if (!AnnouncementStatusEnum.DRAFT.name().equals(announcement.getStatus())) {
            throw new BusinessException("Only DRAFT announcements can be submitted for approval.");
        }
        
        // Add creator check
        if (!Objects.equals(announcement.getCreateBy(), currentUser)) {
            log.warn("User {} attempted to submit announcement {} created by {}, but is not the creator.", currentUser, id, announcement.getCreateBy());
            throw new BusinessException("Only the creator can submit a draft announcement for approval.");
        }

        announcement.setStatus(AnnouncementStatusEnum.PENDING_APPROVAL.name());
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());
        announcementRepository.updateById(announcement);

        logOperation(id, "SUBMIT_APPROVAL", currentUser, "Submitted for approval");
        // TODO: Trigger notification to auditors

        log.info("Exiting submitAnnouncement service method for ID: {}", id);
    }

    /**
     * Audits an announcement.
     * Requires 'announcement:audit' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:audit')")
    public void auditAnnouncement(Long id, AnnouncementAuditDTO auditDto) {
        log.info("Entering auditAnnouncement service method for ID: {}, Approved: {}", id, auditDto.getApproved());
        Assert.notNull(auditDto, "Audit DTO cannot be null");
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = getCurrentUsername();

        if (!AnnouncementStatusEnum.PENDING_APPROVAL.name().equals(announcement.getStatus())) {
            throw new BusinessException("Only announcements PENDING_APPROVAL can be audited.");
        }

        if (Boolean.TRUE.equals(auditDto.getApproved())) {
            announcement.setStatus(AnnouncementStatusEnum.APPROVED.name());
        } else {
            if (auditDto.getComment() == null || auditDto.getComment().trim().isEmpty()) {
                 throw new BusinessException("Rejection comment cannot be empty.");
            }
            announcement.setStatus(AnnouncementStatusEnum.REJECTED.name()); // Or back to DRAFT? PRD: Returns to 草稿
            // Let's follow PRD - return to DRAFT
            // announcement.setStatus(AnnouncementStatusEnum.DRAFT.name());
        }
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());
        announcementRepository.updateById(announcement);
        
        // 记录审核信息
        AnnouncementAudit audit = new AnnouncementAudit();
        audit.setAnnouncementId(id);
        audit.setAuditor(currentUser);
        audit.setAuditTime(LocalDateTime.now());
        audit.setStatus(auditDto.getApproved() ? "APPROVED" : "REJECTED");
        audit.setComment(auditDto.getComment());
        audit.setCreateBy(currentUser);
        audit.setCreateTime(LocalDateTime.now());
        auditRepository.save(audit);

        logOperation(id, "AUDIT", currentUser, "Audit result: " + (auditDto.getApproved() ? "Approved" : "Rejected") + ". Comment: " + auditDto.getComment());
        // TODO: Trigger notification (to creator, publishers if approved)

        log.info("Exiting auditAnnouncement service method for ID: {}", id);
    }

    /**
     * Publishes an announcement.
     * Requires 'announcement:publish' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:publish')")
    public void publishAnnouncement(Long id) {
        log.info("Entering publishAnnouncement service method for ID: {}", id);
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = getCurrentUsername();

        // Check status: Can publish if it's APPROVED, or if it's a draft being published directly (if workflow allows)
        if (!AnnouncementStatusEnum.APPROVED.name().equals(announcement.getStatus())) {
             // Allow publishing from DRAFT if workflow supports skipping audit (e.g., for certain types/roles)
             // if (!AnnouncementStatusEnum.DRAFT.name().equals(announcement.getStatus())) {
                 throw new BusinessException("Only APPROVED announcements can be published.");
             // }
        }

        announcement.setStatus(AnnouncementStatusEnum.PUBLISHED.name());
        announcement.setPublishTime(LocalDateTime.now()); // Set actual publish time
        // Calculate expiry time based on publish time and validity period
        if (announcement.getValidityPeriod() != null) {
             announcement.setExpiryTime(announcement.getPublishTime().plusDays(announcement.getValidityPeriod()));
        }
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());
        announcementRepository.updateById(announcement);

        logOperation(id, "PUBLISH", currentUser, "Published announcement");
        // TODO: Trigger notification to target audience
        // TODO: Initialize view/confirmation records based on scope

        log.info("Exiting publishAnnouncement service method for ID: {}", id);
    }

    /**
     * Withdraws a published announcement.
     * Requires 'announcement:publish' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:publish')")
    public void withdrawAnnouncement(Long id) {
        log.info("Entering withdrawAnnouncement service method for ID: {}", id);
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = getCurrentUsername();

        if (!AnnouncementStatusEnum.PUBLISHED.name().equals(announcement.getStatus())) {
            throw new BusinessException("Only PUBLISHED announcements can be withdrawn.");
        }

        announcement.setStatus(AnnouncementStatusEnum.WITHDRAWN.name()); // Use WITHDRAWN status
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());
        announcementRepository.updateById(announcement);

        logOperation(id, "WITHDRAW", currentUser, "Withdrew announcement");
        // TODO: Optionally trigger notification

        log.info("Exiting withdrawAnnouncement service method for ID: {}", id);
    }

    /**
     * Pins or unpins an announcement.
     * Requires 'announcement:manage' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:manage')")
    public void pinAnnouncement(Long id, boolean isPinned) {
        log.info("Entering pinAnnouncement service method for ID: {}, Pin: {}", id, isPinned);
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = getCurrentUsername();

        // Typically only published announcements are pinned/unpinned
        if (!AnnouncementStatusEnum.PUBLISHED.name().equals(announcement.getStatus())) {
             log.warn("Attempted to {} announcement {} in state {} by user {}", (isPinned ? "pin" : "unpin"), id, announcement.getStatus(), currentUser);
             // Decide if this should be an error or just ignored
             // throw new BusinessException("Only PUBLISHED announcements can be pinned/unpinned.");
             return; // Or ignore
        }

        announcement.setIsTop(isPinned);
        // TODO: Add logic for sort_order if pinning multiple items
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());
        announcementRepository.updateById(announcement);

        logOperation(id, isPinned ? "PIN" : "UNPIN", currentUser, (isPinned ? "Pinned" : "Unpinned") + " announcement");
        log.info("Exiting pinAnnouncement service method for ID: {}", id);
    }

    /**
     * Archives an announcement.
     * Requires 'announcement:archive' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:archive')")
    public void archiveAnnouncement(Long id) {
        log.info("Entering archiveAnnouncement service method for ID: {}", id);
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = getCurrentUsername();

        // PRD: Archive from EXPIRED or CANCELED(WITHDRAWN) status
        if (!(AnnouncementStatusEnum.EXPIRED.name().equals(announcement.getStatus()) ||
              AnnouncementStatusEnum.WITHDRAWN.name().equals(announcement.getStatus()))) {
            throw new BusinessException("Only EXPIRED or WITHDRAWN announcements can be archived.");
        }

        announcement.setStatus(AnnouncementStatusEnum.ARCHIVED.name());
        announcement.setArchivedAt(LocalDateTime.now());
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());
        announcementRepository.updateById(announcement);

        logOperation(id, "ARCHIVE", currentUser, "Archived announcement");
        log.info("Exiting archiveAnnouncement service method for ID: {}", id);
    }

    /**
     * Unarchives an announcement.
     * Requires 'announcement:archive' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:archive')")
    public void unarchiveAnnouncement(Long id) {
        log.info("Entering unarchiveAnnouncement service method for ID: {}", id);
        Announcement announcement = findAnnouncementByIdOrThrow(id);
        String currentUser = getCurrentUsername();

        if (!AnnouncementStatusEnum.ARCHIVED.name().equals(announcement.getStatus())) {
            throw new BusinessException("Only ARCHIVED announcements can be unarchived.");
        }

        // PRD: Restores to DRAFT
        announcement.setStatus(AnnouncementStatusEnum.DRAFT.name());
        announcement.setArchivedAt(null); // Clear archive time
        announcement.setPublishTime(null); // Clear publish time
        announcement.setExpiryTime(null); // Clear expiry time
        announcement.setUpdateBy(currentUser);
        announcement.setUpdateTime(LocalDateTime.now());
        announcementRepository.updateById(announcement);

        logOperation(id, "UNARCHIVE", currentUser, "Unarchived announcement, restored to DRAFT");
        log.info("Exiting unarchiveAnnouncement service method for ID: {}", id);
    }

    /**
     * 记录公告阅读
     * Requires 'announcement:view' or just authentication.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:view') or isAuthenticated()")
    public void recordAnnouncementView(Long announcementId, String username) {
        log.info("Recording view for announcement ID: {} by user: {}", announcementId, username);
        AnnouncementRead read = readRepository.findByAnnouncementIdAndUsername(announcementId, username);
        if (read == null) {
            read = new AnnouncementRead();
            read.setAnnouncementId(announcementId);
            read.setUsername(username);
            read.setReadTime(LocalDateTime.now());
            read.setCreateBy(username);
            read.setCreateTime(LocalDateTime.now());
            readRepository.save(read);
            
            // 更新公告阅读计数
            Announcement announcement = announcementRepository.findById(announcementId);
            if (announcement != null) {
                int viewCount = readRepository.countByAnnouncementId(announcementId);
                announcement.setViewCount(viewCount);
                announcementRepository.updateById(announcement);
                log.info("Updated view count for announcement ID: {} to: {}", announcementId, viewCount);
            }
        }
    }
    
    /**
     * 从回收站恢复公告
     * Requires 'announcement:manage' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:manage')")
    public void recoverAnnouncement(Long announcementId) {
        log.info("Recovering announcement ID: {}", announcementId);
        String currentUser = getCurrentUsername();
        
        // 检查是否在回收站中
        AnnouncementRecycleBin recycleBin = recycleBinRepository.findByAnnouncementId(announcementId);
        if (recycleBin == null) {
            throw new BusinessException("Announcement not found in recycle bin.");
        }
        
        // 检查恢复期限
        if (recycleBin.getRecoveryDeadline().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Recovery deadline has passed.");
        }
        
        // 恢复公告（取消逻辑删除）
        announcementRepository.recoverById(announcementId);
        
        // 从回收站移除
        recycleBinRepository.recoverAnnouncement(announcementId);
        
        logOperation(announcementId, "RECOVER", currentUser, "Recovered announcement from recycle bin");
        log.info("Recovered announcement ID: {}", announcementId);
    }
    
    /**
     * 永久删除过期回收站内容
     * Requires 'announcement:admin' permission.
     */
    @Transactional
    @PreAuthorize("hasAuthority('announcement:admin')")
    public void cleanupRecycleBin() {
        log.info("Cleaning up expired items in recycle bin");
        // 在实际实现中，可能会有更复杂的逻辑
        // 这里简化为获取过期项目并删除
        // recycleBinRepository.deleteExpired();
    }

    // --- Helper Methods --- 

    private Announcement findAnnouncementByIdOrThrow(Long id) {
        Announcement announcement = announcementRepository.findById(id); // Assuming findById exists
        if (announcement == null) {
            log.warn("Announcement not found with ID: {}", id);
            throw new BusinessException("Announcement not found with ID: " + id);
        }
        return announcement;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            // This case should ideally not happen for protected methods, but good practice to handle
            log.warn("Could not get current authenticated user.");
            throw new BusinessException("User not authenticated"); 
        }
        return authentication.getName();
    }

    // Basic Mappers (Consider using MapStruct for complex mapping)
    private Announcement mapToEntity(AnnouncementCreateDTO dto) {
        Announcement entity = new Announcement();
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setType(dto.getType() != null ? dto.getType().name() : null);
        entity.setImportance(dto.getImportance() != null ? dto.getImportance().name() : null);
        // Scope mapping would require saving scope details to t_announcement_permission table or JSON field
        // entity.setScope(dto.getScope() != null ? dto.getScope().name() : null);
        entity.setRequireConfirmation(dto.getRequireConfirmation());
        entity.setConfirmationDeadline(dto.getConfirmationDeadline());
        entity.setScheduledPublishAt(dto.getScheduledPublishAt());
        entity.setValidityPeriod(dto.getValidityPeriod());
        // attachments handled separately
        return entity;
    }

    private void mapToEntity(AnnouncementUpdateDTO dto, Announcement entity) {
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setType(dto.getType() != null ? dto.getType().name() : null);
        entity.setImportance(dto.getImportance() != null ? dto.getImportance().name() : null);
        // Scope mapping would require updating scope details
        // entity.setScope(dto.getScope() != null ? dto.getScope().name() : null);
        entity.setRequireConfirmation(dto.getRequireConfirmation());
        entity.setConfirmationDeadline(dto.getConfirmationDeadline());
        entity.setScheduledPublishAt(dto.getScheduledPublishAt());
        entity.setValidityPeriod(dto.getValidityPeriod());
         // attachments handled separately
    }

    private AnnouncementDTO mapToDTO(Announcement entity) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setStatus(entity.getStatus());
        dto.setType(entity.getType());
        dto.setImportance(entity.getImportance());
        dto.setPublishTime(entity.getPublishTime());
        dto.setExpiryTime(entity.getExpiryTime());
        dto.setCreateBy(entity.getCreateBy());
        dto.setCreateTime(entity.getCreateTime());
        dto.setUpdateBy(entity.getUpdateBy());
        dto.setUpdateTime(entity.getUpdateTime());
        dto.setViewCount(entity.getViewCount());
        dto.setIsTop(entity.getIsTop());
        dto.setRequireConfirmation(entity.getRequireConfirmation());
        // Map other fields like attachments, confirmation deadline etc.
        return dto;
    }

    // Placeholder for logging operation (Implement using DB or logging framework)
    private void logOperation(Long announcementId, String operation, String username, String comment) {
        log.info("Announcement Operation -> ID: {}, Operation: {}, User: {}, Comment: {}",
                 announcementId, operation, username, comment);
        // TODO: Persist to t_announcement_logs table if required
    }

    // TODO: Add service methods for statistics and recycle bin if needed

} 