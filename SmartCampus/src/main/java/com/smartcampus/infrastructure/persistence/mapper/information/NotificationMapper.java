package com.smartcampus.infrastructure.persistence.mapper.information;

import com.smartcampus.domain.information.entity.Notification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 通知Mapper接口
 */
@Mapper
public interface NotificationMapper {

    /**
     * 新增通知
     */
    int insert(Notification notification);
    
    /**
     * 更新通知
     */
    int update(Notification notification);
    
    /**
     * 通过ID查询单条数据
     */
    Notification selectById(Long id);
    
    /**
     * 查询所有通知
     */
    @Select("SELECT * FROM t_notifications")
    List<Notification> selectAll();
    
    /**
     * 统计总行数
     */
    long count();
    
    /**
     * 查询接收者的通知
     */
    List<Notification> selectByRecipient(@Param("recipient") String recipient);
    
    /**
     * 查询指定范围的通知
     */
    @Select("SELECT * FROM t_notifications WHERE scope = #{scope}")
    List<Notification> selectByScope(@Param("scope") String scope);
    
    /**
     * 查询接收者的指定状态的通知
     */
    List<Notification> selectByRecipientAndStatus(@Param("recipient") String recipient, @Param("status") Integer status);
    
    /**
     * 分页查询接收者的通知
     */
    Page<Notification> selectPageByRecipient(@Param("recipient") String recipient, Pageable pageable);
    
    /**
     * 更新通知状态
     */
    @Update("UPDATE t_notification SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);
    
    /**
     * 更新通知已读状态
     */
    @Update("UPDATE t_notifications SET is_read = #{isRead}, read_at = CASE WHEN #{isRead} = true THEN CURRENT_TIMESTAMP ELSE read_at END WHERE id = #{id}")
    int updateReadStatus(@Param("id") Long id, @Param("isRead") boolean isRead);
    
    /**
     * 删除通知
     */
    int deleteById(Long id);
} 