package com.smartcampus.domain.information.repository;

import com.smartcampus.domain.information.entity.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 用户权限仓库接口
 */
@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {

    /**
     * 根据用户ID查询权限列表
     * @param userId 用户ID
     * @return 权限列表
     */
    List<UserPermission> findByUserId(String userId);
    
    /**
     * 根据权限类型查询用户权限
     * @param permission 权限类型
     * @return 用户权限列表
     */
    List<UserPermission> findByPermission(String permission);
    
    /**
     * 检查用户是否拥有指定权限
     * @param userId 用户ID
     * @param permission 权限类型
     * @return 是否存在
     */
    boolean existsByUserIdAndPermission(String userId, String permission);
    
    /**
     * 删除用户特定权限
     * @param userId 用户ID
     * @param permission 权限类型
     * @return 删除的记录数
     */
    int deleteByUserIdAndPermission(String userId, String permission);
    
    /**
     * 删除用户所有权限
     * @param userId 用户ID
     * @return 删除的记录数
     */
    int deleteByUserId(String userId);
} 