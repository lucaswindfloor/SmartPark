package com.smartcampus.infrastructure.persistence.mysql.mapper.security;

import com.smartcampus.infrastructure.persistence.mysql.entity.RolePO; // Assuming RolePO exists or needs creation
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Set;

@Mapper
public interface RoleMapper {

    /**
     * Select roles associated with a user ID.
     *
     * @param userId The user ID.
     * @return A set of RolePO objects.
     */
    Set<RolePO> selectRolesByUserId(@Param("userId") Long userId);

} 