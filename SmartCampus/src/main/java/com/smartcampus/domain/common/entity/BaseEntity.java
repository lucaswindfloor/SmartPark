package com.smartcampus.domain.common.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 基础实体类，包含通用字段
 */
@Data
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    // Consider adding ID here if all entities have a common ID type, or keep it in specific entities
    // private Long id;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT)
    private String createBy; // Or Long createById

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String updateBy; // Or Long updateById

    @TableLogic // Mybatis-Plus logic delete annotation
    @TableField(select = false) // Usually, don't select this field by default
    private Integer deleteFlag; // 0: not deleted, 1: deleted

} 