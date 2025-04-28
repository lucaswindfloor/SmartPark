package com.smartcampus.domain.information.repository;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 通知公告仓库接口
 */
@Repository
public interface AnnouncementRepository extends JpaRepository<Notification, Long>, 
                                             JpaSpecificationExecutor<Notification>,
                                             AnnouncementRepositoryCustom {

    /**
     * 保存通知公告
     */
    Notification save(Notification notification);
    
    /**
     * 根据ID查找通知公告
     */
    Optional<Notification> findById(Long id);
    
    /**
     * 根据范围和状态查询通知，分页
     */
    Page<Notification> findByScopeAndStatus(String scope, Integer status, Pageable pageable);
    
    /**
     * 根据范围和类型查询通知，分页
     */
    Page<Notification> findByScopeAndType(String scope, Integer type, Pageable pageable);
    
    /**
     * 根据范围和重要性查询通知，分页
     */
    Page<Notification> findByScopeAndImportance(String scope, Integer importance, Pageable pageable);
    
    /**
     * 查找特定范围内非指定状态的通知
     */
    List<Notification> findByScopeAndStatusNot(String scope, Integer status);
    
    /**
     * 统计特定范围内非指定状态的通知数量
     */
    long countByScopeAndStatusNot(String scope, Integer status);
    
    /**
     * 根据状态查询通知公告
     */
    List<Notification> findByStatus(NotificationStatusEnum status);
    
    /**
     * 根据状态查询通知公告（分页）
     */
    Page<Notification> findByStatus(NotificationStatusEnum status, Pageable pageable);
    
    /**
     * 根据创建人ID查询通知公告
     */
    Page<Notification> findByCreatorId(String creatorId, Pageable pageable);
    
    /**
     * 根据创建人ID和状态查询通知公告
     */
    Page<Notification> findByCreatorIdAndStatus(String creatorId, NotificationStatusEnum status, Pageable pageable);
    
    /**
     * 查询公开范围为全部的通知公告
     */
    Page<Notification> findByScopeAndStatus(String scope, NotificationStatusEnum status, Pageable pageable);
    
    /**
     * 查询已过期的通知公告
     */
    List<Notification> findByStatusAndExpireTimeBefore(NotificationStatusEnum status, LocalDateTime expireTime);
    
    /**
     * 查询待定时发布的通知公告
     */
    List<Notification> findByStatusAndScheduledPublishTimeLessThanEqual(NotificationStatusEnum status, LocalDateTime now);
    
    /**
     * 更新通知公告状态
     */
    @Modifying
    @Query("UPDATE Notification n SET n.status = :status, n.updateTime = CURRENT_TIMESTAMP WHERE n.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") NotificationStatusEnum status);
    
    /**
     * 查询置顶通知公告
     */
    Page<Notification> findByStatusAndIsPinned(NotificationStatusEnum status, Boolean isPinned, Pageable pageable);
    
    /**
     * 根据类型和状态查询通知公告
     */
    Page<Notification> findByTypeAndStatus(String type, NotificationStatusEnum status, Pageable pageable);
    
    /**
     * 根据重要性和状态查询通知公告
     */
    Page<Notification> findByImportanceAndStatus(String importance, NotificationStatusEnum status, Pageable pageable);
    
    /**
     * 删除通知公告
     */
    void deleteById(Long id);
    
    /**
     * 判断通知是否存在
     */
    boolean existsById(Long id);
    
    /**
     * 获取已归档超过指定时间的通知
     * @param status 归档状态
     * @param archiveTime 归档截止时间
     * @return 通知列表
     */
    List<Notification> findByStatusAndArchiveTimeBefore(NotificationStatusEnum status, LocalDateTime archiveTime);
    
    /**
     * 获取回收站中超时的通知（用于自动清理回收站）
     * @param status 已删除状态
     * @param deleteTime 删除截止时间
     * @return 通知列表
     */
    List<Notification> findByStatusAndUpdateTimeBefore(NotificationStatusEnum status, LocalDateTime deleteTime);
    
    /**
     * 根据范围查询通知，分页
     */
    Page<Notification> findByScope(String scope, Pageable pageable);
} 