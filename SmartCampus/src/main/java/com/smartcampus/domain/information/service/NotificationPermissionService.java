package com.smartcampus.domain.information.service;

import com.smartcampus.common.enums.information.NotificationPermissionEnum;
import com.smartcampus.common.enums.information.NotificationStatusEnum;

import java.util.List;
import java.util.Set;

/**
 * 通知权限服务
 * 负责检查用户是否拥有特定权限，以及基于状态判断可以执行的操作
 */
public interface NotificationPermissionService {

    /**
     * 检查用户是否拥有指定权限
     * @param userId 用户ID
     * @param permission 权限类型
     * @return 是否拥有权限
     */
    boolean hasPermission(String userId, NotificationPermissionEnum permission);
    
    /**
     * 获取用户拥有的所有通知相关权限
     * @param userId 用户ID
     * @return 权限集合
     */
    Set<NotificationPermissionEnum> getUserPermissions(String userId);
    
    /**
     * 授予用户权限
     * @param userId 用户ID
     * @param permission 权限类型
     * @return 是否授权成功
     */
    boolean grantPermission(String userId, NotificationPermissionEnum permission);
    
    /**
     * 撤销用户权限
     * @param userId 用户ID
     * @param permission 权限类型
     * @return 是否撤销成功
     */
    boolean revokePermission(String userId, NotificationPermissionEnum permission);
    
    /**
     * 根据通知状态判断需要哪些权限才能执行操作
     * @param status 通知状态
     * @param operationType 操作类型（如"edit", "publish", "delete"等）
     * @return 执行该操作需要的权限
     */
    NotificationPermissionEnum getRequiredPermission(NotificationStatusEnum status, String operationType);
    
    /**
     * 检查用户是否能够对特定状态的通知执行特定操作
     * @param userId 用户ID
     * @param status 通知状态
     * @param operationType 操作类型
     * @return 是否允许操作
     */
    boolean canPerformOperation(String userId, NotificationStatusEnum status, String operationType);
    
    /**
     * 获取拥有指定权限的用户列表
     * @param permission 权限类型
     * @return 用户ID列表
     */
    List<String> getUsersWithPermission(NotificationPermissionEnum permission);
} 