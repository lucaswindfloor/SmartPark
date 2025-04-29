package com.smartcampus.common.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base Entity class containing common fields for domain entities.
 */
@Data
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * Creation Time
     * Can be automatically filled by MyBatis Plus with a MetaObjectHandler configuration
     * Example: @TableField(fill = FieldFill.INSERT)
     */
    @TableField("create_time")
    private LocalDateTime createTime;

    /**
     * Creator (Username or ID)
     * Can be automatically filled
     * Example: @TableField(fill = FieldFill.INSERT)
     */
    @TableField("create_by")
    private String createBy;

    /**
     * Last Update Time
     * Can be automatically filled
     * Example: @TableField(fill = FieldFill.INSERT_UPDATE)
     */
    @TableField("update_time")
    private LocalDateTime updateTime;

    /**
     * Last Updater (Username or ID)
     * Can be automatically filled
     * Example: @TableField(fill = FieldFill.INSERT_UPDATE)
     */
    @TableField("update_by")
    private String updateBy;

    /**
     * Logical Delete Flag (0: not deleted, 1: deleted)
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;
} 