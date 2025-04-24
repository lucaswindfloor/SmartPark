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
}
