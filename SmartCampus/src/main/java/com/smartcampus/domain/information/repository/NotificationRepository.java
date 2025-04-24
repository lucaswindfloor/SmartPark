package com.smartcampus.domain.information.repository;

import com.smartcampus.domain.information.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 通知仓储接口
 */
public interface NotificationRepository {

    /**
     * 保存通知
     */
    Notification save(Notification notification);
    
    /**
     * 根据ID查找通知
     */
    Optional<Notification> findById(Long id);
    
    /**
     * 查找接收者的通知，分页
     */
    Page<Notification> findByRecipient(String recipient, Pageable pageable);
    
    /**
     * 根据接收者和状态查询通知，分页
     */
    Page<Notification> findByRecipientAndStatus(String recipient, Integer status, Pageable pageable);
    
    /**
     * 根据接收者和类型查询通知，分页
     */
    Page<Notification> findByRecipientAndType(String recipient, Integer type, Pageable pageable);
    
    /**
     * 根据接收者和重要性查询通知，分页
     */
    Page<Notification> findByRecipientAndImportance(String recipient, Integer importance, Pageable pageable);
    
    /**
     * 查找接收者的未读通知
     */
    List<Notification> findByRecipientAndStatusNot(String recipient, Integer status);
    
    /**
     * 统计接收者的未读通知数量
     */
    long countByRecipientAndStatusNot(String recipient, Integer status);
    
    /**
     * 更新通知状态
     */
    int updateStatus(Long id, Integer status);
    
    /**
     * 查找指定状态的通知
     */
    List<Notification> findByStatus(Integer status);
    
    /**
     * 删除通知
     */
    void deleteById(Long id);
    
    /**
     * 判断通知是否存在
     */
    boolean existsById(Long id);
} 