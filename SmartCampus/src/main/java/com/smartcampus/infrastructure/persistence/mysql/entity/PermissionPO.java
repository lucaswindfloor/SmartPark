package com.smartcampus.infrastructure.persistence.mysql.entity;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class PermissionPO {
    private Long id;
    private String permissionString;
    private String description;
    private String module;
    private Timestamp createdAt;
    private Timestamp updatedAt;
} 