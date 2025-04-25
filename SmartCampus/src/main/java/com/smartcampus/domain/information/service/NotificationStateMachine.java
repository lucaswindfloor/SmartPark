package com.smartcampus.domain.information.service;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.Notification;

/**
 * 通知状态机服务
 */
public interface NotificationStateMachine {

    /**
     * 获取通知当前状态
     */
    NotificationStatusEnum getCurrentStatus(Notification notification);
    
    /**
     * 通知状态转换：待发送 -> 已发送
     */
    boolean transitionToSent(Notification notification);
    
    /**
     * 通知状态转换：已发送 -> 已读
     */
    boolean transitionToRead(Notification notification);
    
    /**
     * 通知状态转换：待发送 -> 已取消
     */
    boolean transitionToCancelled(Notification notification);
    
    /**
     * 通知状态转换：待发送/已发送 -> 发送失败
     */
    boolean transitionToFailed(Notification notification);
    
    /**
     * 检查状态转换是否有效
     */
    boolean isValidTransition(NotificationStatusEnum fromStatus, NotificationStatusEnum toStatus);
    
    /**
     * 执行状态转换
     * @param notification 通知对象
     * @param toStatus 目标状态
     * @return 转换是否成功
     */
    boolean transition(Notification notification, NotificationStatusEnum toStatus);
    
    /**
     * 提交审核
     */
    boolean submitForAudit(Notification notification);
    
    /**
     * 审核通过
     */
    boolean approveAudit(Notification notification);
    
    /**
     * 审核驳回
     */
    boolean rejectAudit(Notification notification);
    
    /**
     * 发布通知
     */
    boolean publish(Notification notification);
    
    /**
     * 撤回通知
     */
    boolean withdraw(Notification notification);
    
    /**
     * 通知过期
     */
    boolean expire(Notification notification);
    
    /**
     * 归档通知
     */
    boolean archive(Notification notification);
    
    /**
     * 解除归档
     */
    boolean unarchive(Notification notification);
    
    /**
     * 取消发布
     */
    boolean cancel(Notification notification);
    
    /**
     * 移至回收站
     */
    boolean moveToRecycleBin(Notification notification);
    
    /**
     * 从回收站恢复
     * @param notification 通知对象
     * @param originalStatus 恢复到的原始状态
     * @return 恢复是否成功
     */
    boolean restore(Notification notification, NotificationStatusEnum originalStatus);
}
