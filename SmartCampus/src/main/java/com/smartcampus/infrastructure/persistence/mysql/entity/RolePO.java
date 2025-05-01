package com.smartcampus.infrastructure.persistence.mysql.entity;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class RolePO {
    private Long id;
    private String roleKey;
    private String roleName;
    private String description;
    private Boolean status;
    private String createdBy;
    private Timestamp createdAt;
    private String updatedBy;
    private Timestamp updatedAt;
    private Boolean deleted;
} 