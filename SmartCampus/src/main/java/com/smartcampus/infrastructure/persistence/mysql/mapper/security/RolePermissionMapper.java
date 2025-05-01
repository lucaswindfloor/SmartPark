package com.smartcampus.infrastructure.persistence.mysql.mapper.security;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * Mapper interface for role_permissions table.
 */
@Mapper
public interface RolePermissionMapper {

    /**
     * Find permission strings associated with a set of role IDs.
     *
     * @param roleIds The set of role IDs.
     * @return A set of permission strings associated with the roles.
     */
    Set<String> findPermissionStringsByRoleIds(@Param("roleIds") Set<Long> roleIds);

    // Add methods for inserting/deleting relationships if needed for future role management features
    // int insertRolePermission(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);
    // int deleteRolePermissionsByRoleId(@Param("roleId") Long roleId);
} 