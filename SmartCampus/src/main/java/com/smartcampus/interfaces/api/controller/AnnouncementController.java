package com.smartcampus.interfaces.api.controller;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.common.response.ApiResponse;
import com.smartcampus.domain.information.service.NotificationPermissionService;
import com.smartcampus.domain.information.service.NotificationService;
import com.smartcampus.interfaces.api.controller.dto.ArchiveRequest;
import com.smartcampus.interfaces.api.controller.dto.AuditRequest;
import com.smartcampus.interfaces.api.controller.dto.NotificationDetailDTO;
import com.smartcampus.interfaces.api.controller.dto.NotificationDTO;
import com.smartcampus.interfaces.api.controller.dto.NotificationQueryDTO;
import com.smartcampus.interfaces.api.controller.dto.NotificationStatisticsDTO;
import com.smartcampus.interfaces.api.controller.dto.PublishRequest;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 通知公告控制器
 */
@RestController
@RequestMapping("/api/announcements")
@Api(tags = "通知公告管理")
@RequiredArgsConstructor
@Slf4j
public class AnnouncementController {

    private final NotificationService notificationService;
    private final NotificationPermissionService permissionService;

    @ApiOperation("获取通知公告列表")
    @GetMapping
    public ApiResponse<Page<NotificationDTO>> getNotifications(
            @ModelAttribute NotificationQueryDTO queryDTO,
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("获取通知公告列表: {}", queryDTO);
        Page<NotificationDTO> page = notificationService.getNotifications(queryDTO, pageable, userDetails.getUsername());
        return ApiResponse.success(page);
    }

    @ApiOperation("获取通知公告详情")
    @GetMapping("/{id}")
    public ApiResponse<NotificationDetailDTO> getNotificationDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("获取通知公告详情: {}", id);
        NotificationDetailDTO detail = notificationService.getNotificationDetail(id, userDetails.getUsername());
        return ApiResponse.success(detail);
    }

    @ApiOperation("创建通知公告")
    @PostMapping
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).DRAFT)")
    public ApiResponse<NotificationDTO> createNotification(
            @Valid @RequestBody NotificationDTO notificationDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("创建通知公告: {}", notificationDTO);
        notificationDTO.setCreatorId(userDetails.getUsername());
        NotificationDTO result = notificationService.createNotification(notificationDTO);
        return ApiResponse.success(result);
    }

    @ApiOperation("更新通知公告")
    @PutMapping("/{id}")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).DRAFT)")
    public ApiResponse<NotificationDTO> updateNotification(
            @PathVariable Long id,
            @Valid @RequestBody NotificationDTO notificationDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("更新通知公告: {}", notificationDTO);
        notificationDTO.setId(id);
        NotificationDTO result = notificationService.updateNotification(notificationDTO, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("删除通知公告(移入回收站)")
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("删除通知公告: {}", id);
        boolean success = notificationService.deleteNotification(id, userDetails.getUsername());
        return ApiResponse.success(success);
    }

    @ApiOperation("提交审核")
    @PostMapping("/{id}/submit-audit")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).DRAFT)")
    public ApiResponse<NotificationDTO> submitForAudit(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("提交通知公告审核: {}", id);
        NotificationDTO result = notificationService.submitForAudit(id, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("审核通知")
    @PostMapping("/{id}/audit")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).AUDIT)")
    public ApiResponse<NotificationDTO> auditNotification(
            @PathVariable Long id,
            @Valid @RequestBody AuditRequest auditRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("审核通知公告: {}, 结果: {}", id, auditRequest);
        NotificationDTO result = notificationService.auditNotification(id, auditRequest, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("发布通知")
    @PostMapping("/{id}/publish")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).PUBLISH)")
    public ApiResponse<NotificationDTO> publishNotification(
            @PathVariable Long id,
            @Valid @RequestBody PublishRequest publishRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("发布通知公告: {}, 请求: {}", id, publishRequest);
        NotificationDTO result = notificationService.publishNotification(id, publishRequest, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("取消发布")
    @PostMapping("/{id}/cancel")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).MANAGE)")
    public ApiResponse<NotificationDTO> cancelPublication(
            @PathVariable Long id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("取消通知公告发布: {}, 原因: {}", id, reason);
        NotificationDTO result = notificationService.cancelPublication(id, reason, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("置顶通知")
    @PostMapping("/{id}/pin")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).MANAGE)")
    public ApiResponse<NotificationDTO> pinNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("置顶通知公告: {}", id);
        NotificationDTO result = notificationService.pinNotification(id, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("取消置顶")
    @PostMapping("/{id}/unpin")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).MANAGE)")
    public ApiResponse<NotificationDTO> unpinNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("取消置顶通知公告: {}", id);
        NotificationDTO result = notificationService.unpinNotification(id, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("延长有效期")
    @PostMapping("/{id}/extend")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).MANAGE)")
    public ApiResponse<NotificationDTO> extendValidity(
            @PathVariable Long id,
            @ApiParam("延长天数") @RequestParam Integer days,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("延长通知公告有效期: {}, 天数: {}", id, days);
        NotificationDTO result = notificationService.extendValidity(id, days, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("归档通知")
    @PostMapping("/{id}/archive")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).ARCHIVE)")
    public ApiResponse<NotificationDTO> archiveNotification(
            @PathVariable Long id,
            @RequestBody(required = false) ArchiveRequest archiveRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("归档通知公告: {}", id);
        NotificationDTO result = notificationService.archiveNotification(id, archiveRequest, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("解除归档")
    @PostMapping("/{id}/unarchive")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).ARCHIVE)")
    public ApiResponse<NotificationDTO> unarchiveNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("解除归档通知公告: {}", id);
        NotificationDTO result = notificationService.unarchiveNotification(id, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("记录查看")
    @PostMapping("/{id}/view")
    public ApiResponse<Boolean> recordView(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("用户查看通知公告: {}", id);
        boolean success = notificationService.recordView(id, userDetails.getUsername());
        return ApiResponse.success(success);
    }

    @ApiOperation("确认接收")
    @PostMapping("/{id}/confirm")
    public ApiResponse<Boolean> confirmNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("用户确认接收通知公告: {}", id);
        boolean success = notificationService.confirmNotification(id, userDetails.getUsername());
        return ApiResponse.success(success);
    }

    @ApiOperation("获取阅读统计")
    @GetMapping("/{id}/statistics")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).MANAGE)")
    public ApiResponse<NotificationStatisticsDTO> getStatistics(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("获取通知公告统计: {}", id);
        NotificationStatisticsDTO statistics = notificationService.getStatistics(id);
        return ApiResponse.success(statistics);
    }

    @ApiOperation("获取确认列表")
    @GetMapping("/{id}/confirmations")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).MANAGE)")
    public ApiResponse<Map<String, Object>> getConfirmations(
            @PathVariable Long id,
            Pageable pageable) {
        
        log.info("获取通知公告确认列表: {}", id);
        Map<String, Object> result = notificationService.getConfirmations(id, pageable);
        return ApiResponse.success(result);
    }

    @ApiOperation("发送确认提醒")
    @PostMapping("/{id}/remind")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).MANAGE)")
    public ApiResponse<Boolean> sendReminders(
            @PathVariable Long id,
            @RequestBody List<String> userIds,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("发送通知公告确认提醒: {}, 用户: {}", id, userIds);
        boolean success = notificationService.sendReminders(id, userIds, userDetails.getUsername());
        return ApiResponse.success(success);
    }

    @ApiOperation("从回收站恢复")
    @PostMapping("/{id}/restore")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).ARCHIVE)")
    public ApiResponse<NotificationDTO> restoreFromRecycleBin(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("从回收站恢复通知公告: {}", id);
        NotificationDTO result = notificationService.restoreFromRecycleBin(id, userDetails.getUsername());
        return ApiResponse.success(result);
    }

    @ApiOperation("彻底删除")
    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).ARCHIVE)")
    public ApiResponse<Boolean> permanentDelete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("永久删除通知公告: {}", id);
        boolean success = notificationService.permanentDelete(id, userDetails.getUsername());
        return ApiResponse.success(success);
    }

    @ApiOperation("清空回收站")
    @DeleteMapping("/recycle-bin/empty")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).ARCHIVE)")
    public ApiResponse<Boolean> emptyRecycleBin(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("清空回收站");
        boolean success = notificationService.emptyRecycleBin(userDetails.getUsername());
        return ApiResponse.success(success);
    }

    @ApiOperation("获取回收站列表")
    @GetMapping("/recycle-bin")
    @PreAuthorize("@notificationPermissionServiceImpl.hasPermission(#userDetails.username, T(com.smartcampus.common.enums.information.NotificationPermissionEnum).ARCHIVE)")
    public ApiResponse<Page<NotificationDTO>> getRecycleBin(
            NotificationQueryDTO queryDTO,
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("获取回收站列表");
        queryDTO.setStatus(NotificationStatusEnum.DELETED.getCode());
        Page<NotificationDTO> page = notificationService.getNotifications(queryDTO, pageable, userDetails.getUsername());
        return ApiResponse.success(page);
    }

    @ApiOperation("获取范围选项")
    @GetMapping("/scopes")
    public ApiResponse<List<Map<String, Object>>> getScopes() {
        log.info("获取通知公告范围选项");
        List<Map<String, Object>> scopes = notificationService.getAvailableScopes();
        return ApiResponse.success(scopes);
    }

    @ApiOperation("获取类型选项")
    @GetMapping("/types")
    public ApiResponse<List<Map<String, Object>>> getTypes() {
        log.info("获取通知公告类型选项");
        List<Map<String, Object>> types = notificationService.getAvailableTypes();
        return ApiResponse.success(types);
    }
} 