package com.smartcampus.domain.information.entity;

import com.smartcampus.common.enums.information.NoticePermissionEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 用户权限实体类
 */
@Entity
@Table(name = "t_user_permissions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "permission"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 用户ID
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * 权限（draft、audit、publish、manage、archive）
     */
    @Column(name = "permission", nullable = false, length = 20)
    private String permission;
    
    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 检查是否具有特定权限
     * 
     * @param permissionEnum 权限枚举
     * @return 是否具有权限
     */
    public boolean hasPermission(NoticePermissionEnum permissionEnum) {
        return this.permission.equals(permissionEnum.getKey());
    }
} 