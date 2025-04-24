package com.smartcampus.platform.comprehensive.service.service.information;

import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.domain.information.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 通知服务实现类
 */
@Service("informationNotificationService")
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Notification createNotification(Notification notification) {
        log.info("创建通知: {}", notification);
        return notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public Notification getNotificationById(Long id) {
        log.info("获取通知详情, ID: {}", id);
        return notificationRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Notification> getNotifications(String recipient, Integer status, Integer type, Integer importance, Pageable pageable) {
        log.info("查询通知列表, 接收者: {}, 状态: {}, 类型: {}, 重要性: {}", recipient, status, type, importance);
        
        if (status != null) {
            return notificationRepository.findByRecipientAndStatus(recipient, status, pageable);
        } else if (type != null) {
            return notificationRepository.findByRecipientAndType(recipient, type, pageable);
        } else if (importance != null) {
            return notificationRepository.findByRecipientAndImportance(recipient, importance, pageable);
        } else {
            return notificationRepository.findByRecipient(recipient, pageable);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(String recipient) {
        log.info("获取未读通知, 接收者: {}", recipient);
        return notificationRepository.findByRecipientAndStatusNot(recipient, 1);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadNotifications(String recipient) {
        log.info("统计未读通知数量, 接收者: {}", recipient);
        return notificationRepository.countByRecipientAndStatusNot(recipient, 1);
    }

    @Override
    @Transactional
    public boolean markAsRead(Long id, String recipient) {
        log.info("标记通知为已读, ID: {}, 接收者: {}", id, recipient);
        int rows = notificationRepository.updateStatus(id, 1);
        return rows > 0;
    }

    @Override
    @Transactional
    public boolean deleteNotification(Long id) {
        log.info("删除通知, ID: {}", id);
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean sendNotification(Long id) {
        log.info("发送通知, ID: {}", id);
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            // 实际发送逻辑...
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean cancelNotification(Long id) {
        log.info("取消通知, ID: {}", id);
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            // 取消发送逻辑...
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public void processPendingNotifications() {
        log.info("处理待发送通知");
        // 实现批量发送逻辑...
    }
} 