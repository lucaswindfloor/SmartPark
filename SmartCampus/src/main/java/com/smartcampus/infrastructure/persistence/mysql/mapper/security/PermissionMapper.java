package com.smartcampus.infrastructure.persistence.mysql.mapper.security;

import com.smartcampus.infrastructure.persistence.mysql.entity.PermissionPO; // Assuming PermissionPO exists or needs creation
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Set;

@Mapper
public interface PermissionMapper {

    /**
     * Select permission strings associated with a role ID.
     *
     * @param roleId The role ID.
     * @return A set of permission strings.
     */
    Set<String> selectPermissionsByRoleId(@Param("roleId") Long roleId);

} 