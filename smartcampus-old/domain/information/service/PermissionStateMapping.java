package com.smartcampus.domain.information.service;

import com.smartcampus.common.enums.information.NoticePermissionEnum;
import com.smartcampus.common.enums.information.NoticeStatusEnum;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 状态与权限的映射关系类
 * 实现状态与权限挂钩的核心逻辑
 */
public class PermissionStateMapping {
    
    /**
     * 状态与权限的映射关系
     */
    private static final Map<NoticeStatusEnum, List<NoticePermissionEnum>> STATE_PERMISSION_MAP;
    
    static {
        Map<NoticeStatusEnum, List<NoticePermissionEnum>> map = new HashMap<>();
        
        // 草稿状态：可进行创建、编辑、保存、提交审核、删除操作
        map.put(NoticeStatusEnum.DRAFT, Collections.singletonList(
            NoticePermissionEnum.DRAFT
        ));
        
        // 待审核状态：可进行通过、驳回、建议修改操作
        map.put(NoticeStatusEnum.PENDING_REVIEW, Collections.singletonList(
            NoticePermissionEnum.AUDIT
        ));
        
        // 待发布状态：可进行预览、发布、撤回操作
        map.put(NoticeStatusEnum.PENDING_PUBLISH, Collections.singletonList(
            NoticePermissionEnum.PUBLISH
        ));
        
        // 已发布状态：可进行置顶、取消置顶、延期、取消发布、删除、统计操作
        map.put(NoticeStatusEnum.PUBLISHED, Collections.singletonList(
            NoticePermissionEnum.MANAGE
        ));
        
        // 已过期状态：可进行查询、归档操作
        map.put(NoticeStatusEnum.EXPIRED, Collections.singletonList(
            NoticePermissionEnum.ARCHIVE
        ));
        
        // 已取消发布状态：可进行查询、归档操作
        map.put(NoticeStatusEnum.CANCELLED, Collections.singletonList(
            NoticePermissionEnum.ARCHIVE
        ));
        
        // 档案状态：可进行查询、解档操作
        map.put(NoticeStatusEnum.ARCHIVED, Collections.singletonList(
            NoticePermissionEnum.ARCHIVE
        ));
        
        STATE_PERMISSION_MAP = Collections.unmodifiableMap(map);
    }
    
    /**
     * 获取指定状态下所需的权限列表
     *
     * @param status 状态
     * @return 权限列表
     */
    public static List<NoticePermissionEnum> getRequiredPermissions(NoticeStatusEnum status) {
        return STATE_PERMISSION_MAP.getOrDefault(status, Collections.emptyList());
    }
    
    /**
     * 检查用户在指定状态下是否有权限操作
     *
     * @param status 状态
     * @param userPermission 用户权限
     * @return 是否有权限
     */
    public static boolean hasPermission(NoticeStatusEnum status, NoticePermissionEnum userPermission) {
        List<NoticePermissionEnum> requiredPermissions = getRequiredPermissions(status);
        return requiredPermissions.contains(userPermission);
    }
    
    /**
     * 获取下一个状态（按操作类型）
     *
     * @param currentStatus 当前状态
     * @param operation 操作类型
     * @return 下一个状态
     */
    public static NoticeStatusEnum getNextStatus(NoticeStatusEnum currentStatus, String operation) {
        switch (currentStatus) {
            case DRAFT:
                if ("submit".equals(operation)) {
                    return NoticeStatusEnum.PENDING_REVIEW;
                }
                break;
            case PENDING_REVIEW:
                if ("approve".equals(operation)) {
                    return NoticeStatusEnum.PENDING_PUBLISH;
                } else if ("reject".equals(operation) || "suggest".equals(operation)) {
                    return NoticeStatusEnum.DRAFT;
                }
                break;
            case PENDING_PUBLISH:
                if ("publish".equals(operation)) {
                    return NoticeStatusEnum.PUBLISHED;
                } else if ("withdraw".equals(operation)) {
                    return NoticeStatusEnum.DRAFT;
                }
                break;
            case PUBLISHED:
                if ("cancel".equals(operation)) {
                    return NoticeStatusEnum.CANCELLED;
                } else if ("expire".equals(operation)) {
                    return NoticeStatusEnum.EXPIRED;
                } else if ("archive".equals(operation)) {
                    return NoticeStatusEnum.ARCHIVED;
                }
                break;
            case EXPIRED:
            case CANCELLED:
                if ("archive".equals(operation)) {
                    return NoticeStatusEnum.ARCHIVED;
                }
                break;
            case ARCHIVED:
                if ("unarchive".equals(operation)) {
                    return NoticeStatusEnum.DRAFT;
                }
                break;
        }
        // 状态不变
        return currentStatus;
    }
} 