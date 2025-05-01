package com.smartcampus.infrastructure.persistence.mysql.entity;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class UserPO {
    private Long id;
    private String username;
    private String passwordHash;
    private String nickname;
    private String email;
    private String phoneNumber;
    private String avatar;
    private Boolean status; // Map TINYINT(1) to Boolean or Integer
    private String createdBy;
    private Timestamp createdAt;
    private String updatedBy;
    private Timestamp updatedAt;
    private String remark;
    private Boolean deleted; // Map TINYINT(1) to Boolean or Integer
} 