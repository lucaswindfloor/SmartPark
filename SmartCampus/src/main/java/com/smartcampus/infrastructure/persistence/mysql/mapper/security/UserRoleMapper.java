package com.smartcampus.infrastructure.persistence.mysql.mapper.security;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Set;

/**
 * Mapper interface for user_roles table.
 */
@Mapper
public interface UserRoleMapper {

    /**
     * Find role IDs associated with a user ID.
     *
     * @param userId The user ID.
     * @return A set of role IDs associated with the user.
     */
    Set<Long> findRoleIdsByUserId(@Param("userId") Long userId);

    // Add methods for inserting/deleting relationships if needed for future user management features
    // int insertUserRole(@Param("userId") Long userId, @Param("roleId") Long roleId);
    // int deleteUserRolesByUserId(@Param("userId") Long userId);
} 