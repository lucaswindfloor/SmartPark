package com.smartcampus.domain.information.service.impl;

import com.smartcampus.common.enums.information.NotificationPermissionEnum;
import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.UserPermission;
import com.smartcampus.domain.information.repository.UserPermissionRepository;
import com.smartcampus.domain.information.service.NotificationPermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 通知权限服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationPermissionServiceImpl implements NotificationPermissionService {

    private final UserPermissionRepository userPermissionRepository;
    
    // 操作与权限的映射
    private static final Map<String, NotificationPermissionEnum> OPERATION_PERMISSION_MAP = new HashMap<>();
    
    // 状态与所需权限的映射
    private static final Map<NotificationStatusEnum, Map<String, NotificationPermissionEnum>> STATUS_OPERATION_PERMISSION_MAP = new HashMap<>();
    
    static {
        // 初始化操作权限映射
        OPERATION_PERMISSION_MAP.put("create", NotificationPermissionEnum.DRAFT);
        OPERATION_PERMISSION_MAP.put("edit", NotificationPermissionEnum.DRAFT);
        OPERATION_PERMISSION_MAP.put("submit", NotificationPermissionEnum.DRAFT);
        OPERATION_PERMISSION_MAP.put("audit", NotificationPermissionEnum.AUDIT);
        OPERATION_PERMISSION_MAP.put("approve", NotificationPermissionEnum.AUDIT);
        OPERATION_PERMISSION_MAP.put("reject", NotificationPermissionEnum.AUDIT);
        OPERATION_PERMISSION_MAP.put("publish", NotificationPermissionEnum.PUBLISH);
        OPERATION_PERMISSION_MAP.put("schedule", NotificationPermissionEnum.PUBLISH);
        OPERATION_PERMISSION_MAP.put("pin", NotificationPermissionEnum.MANAGE);
        OPERATION_PERMISSION_MAP.put("unpin", NotificationPermissionEnum.MANAGE);
        OPERATION_PERMISSION_MAP.put("extend", NotificationPermissionEnum.MANAGE);
        OPERATION_PERMISSION_MAP.put("cancel", NotificationPermissionEnum.MANAGE);
        OPERATION_PERMISSION_MAP.put("archive", NotificationPermissionEnum.ARCHIVE);
        OPERATION_PERMISSION_MAP.put("unarchive", NotificationPermissionEnum.ARCHIVE);
        OPERATION_PERMISSION_MAP.put("delete", NotificationPermissionEnum.MANAGE);
        OPERATION_PERMISSION_MAP.put("restore", NotificationPermissionEnum.ARCHIVE);
        
        // 草稿状态操作权限
        Map<String, NotificationPermissionEnum> draftOperations = new HashMap<>();
        draftOperations.put("edit", NotificationPermissionEnum.DRAFT);
        draftOperations.put("submit", NotificationPermissionEnum.DRAFT);
        draftOperations.put("delete", NotificationPermissionEnum.DRAFT);
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.DRAFT, draftOperations);
        
        // 待审核状态操作权限
        Map<String, NotificationPermissionEnum> pendingAuditOperations = new HashMap<>();
        pendingAuditOperations.put("approve", NotificationPermissionEnum.AUDIT);
        pendingAuditOperations.put("reject", NotificationPermissionEnum.AUDIT);
        pendingAuditOperations.put("withdraw", NotificationPermissionEnum.DRAFT); // 特殊情况：只有创建者可以撤回
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.PENDING_AUDIT, pendingAuditOperations);
        
        // 待发布状态操作权限
        Map<String, NotificationPermissionEnum> pendingPublishOperations = new HashMap<>();
        pendingPublishOperations.put("publish", NotificationPermissionEnum.PUBLISH);
        pendingPublishOperations.put("schedule", NotificationPermissionEnum.PUBLISH);
        pendingPublishOperations.put("withdraw", NotificationPermissionEnum.DRAFT); // 特殊情况：只有创建者可以撤回
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.PENDING_PUBLISH, pendingPublishOperations);
        
        // 已发布状态操作权限
        Map<String, NotificationPermissionEnum> publishedOperations = new HashMap<>();
        publishedOperations.put("pin", NotificationPermissionEnum.MANAGE);
        publishedOperations.put("unpin", NotificationPermissionEnum.MANAGE);
        publishedOperations.put("extend", NotificationPermissionEnum.MANAGE);
        publishedOperations.put("cancel", NotificationPermissionEnum.MANAGE);
        publishedOperations.put("delete", NotificationPermissionEnum.MANAGE);
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.PUBLISHED, publishedOperations);
        
        // 已过期状态操作权限
        Map<String, NotificationPermissionEnum> expiredOperations = new HashMap<>();
        expiredOperations.put("archive", NotificationPermissionEnum.ARCHIVE);
        expiredOperations.put("extend", NotificationPermissionEnum.MANAGE);
        expiredOperations.put("delete", NotificationPermissionEnum.MANAGE);
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.EXPIRED, expiredOperations);
        
        // 已取消发布状态操作权限
        Map<String, NotificationPermissionEnum> canceledOperations = new HashMap<>();
        canceledOperations.put("archive", NotificationPermissionEnum.ARCHIVE);
        canceledOperations.put("delete", NotificationPermissionEnum.MANAGE);
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.CANCELED, canceledOperations);
        
        // 已归档状态操作权限
        Map<String, NotificationPermissionEnum> archivedOperations = new HashMap<>();
        archivedOperations.put("unarchive", NotificationPermissionEnum.ARCHIVE);
        archivedOperations.put("delete", NotificationPermissionEnum.MANAGE);
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.ARCHIVED, archivedOperations);
        
        // 已删除状态操作权限（回收站）
        Map<String, NotificationPermissionEnum> deletedOperations = new HashMap<>();
        deletedOperations.put("restore", NotificationPermissionEnum.ARCHIVE);
        deletedOperations.put("permanentDelete", NotificationPermissionEnum.ARCHIVE);
        STATUS_OPERATION_PERMISSION_MAP.put(NotificationStatusEnum.DELETED, deletedOperations);
    }

    @Override
    public boolean hasPermission(String userId, NotificationPermissionEnum permission) {
        if (userId == null || permission == null) {
            return false;
        }
        
        // 查询用户权限
        return userPermissionRepository.existsByUserIdAndPermission(userId, permission.name());
    }

    @Override
    public Set<NotificationPermissionEnum> getUserPermissions(String userId) {
        if (userId == null) {
            return Collections.emptySet();
        }
        
        List<UserPermission> permissions = userPermissionRepository.findByUserId(userId);
        return permissions.stream()
                .map(p -> NotificationPermissionEnum.valueOf(p.getPermission()))
                .collect(Collectors.toSet());
    }

    @Override
    public boolean grantPermission(String userId, NotificationPermissionEnum permission) {
        if (userId == null || permission == null) {
            return false;
        }
        
        // 检查权限是否已存在
        if (hasPermission(userId, permission)) {
            return true;
        }
        
        // 创建并保存新权限
        UserPermission userPermission = new UserPermission();
        userPermission.setUserId(userId);
        userPermission.setPermission(permission.name());
        userPermissionRepository.save(userPermission);
        
        log.info("授予用户 {} 权限: {}", userId, permission);
        return true;
    }

    @Override
    public boolean revokePermission(String userId, NotificationPermissionEnum permission) {
        if (userId == null || permission == null) {
            return false;
        }
        
        // 删除权限
        int deleted = userPermissionRepository.deleteByUserIdAndPermission(userId, permission.name());
        
        if (deleted > 0) {
            log.info("撤销用户 {} 权限: {}", userId, permission);
            return true;
        }
        
        return false;
    }

    @Override
    public NotificationPermissionEnum getRequiredPermission(NotificationStatusEnum status, String operationType) {
        if (status == null || operationType == null) {
            return null;
        }
        
        Map<String, NotificationPermissionEnum> operationPermissions = STATUS_OPERATION_PERMISSION_MAP.get(status);
        if (operationPermissions == null) {
            return OPERATION_PERMISSION_MAP.get(operationType);
        }
        
        NotificationPermissionEnum permission = operationPermissions.get(operationType);
        if (permission == null) {
            return OPERATION_PERMISSION_MAP.get(operationType);
        }
        
        return permission;
    }

    @Override
    public boolean canPerformOperation(String userId, NotificationStatusEnum status, String operationType) {
        NotificationPermissionEnum requiredPermission = getRequiredPermission(status, operationType);
        if (requiredPermission == null) {
            log.warn("未找到操作 {} 在状态 {} 下需要的权限", operationType, status);
            return false;
        }
        
        return hasPermission(userId, requiredPermission);
    }

    @Override
    public List<String> getUsersWithPermission(NotificationPermissionEnum permission) {
        if (permission == null) {
            return Collections.emptyList();
        }
        
        List<UserPermission> permissions = userPermissionRepository.findByPermission(permission.name());
        return permissions.stream()
                .map(UserPermission::getUserId)
                .collect(Collectors.toList());
    }
} 