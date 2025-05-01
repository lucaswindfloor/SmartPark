package com.smartcampus.infrastructure.persistence.mysql.mapper.security;

import com.smartcampus.infrastructure.persistence.mysql.entity.UserPO; // Assuming UserPO exists or needs creation
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    /**
     * Select user details by username.
     *
     * @param username The username.
     * @return UserPO or null if not found.
     */
    UserPO findByUsername(@Param("username") String username);

} 