package com.smartcampus.infrastructure.persistence.repository.information;

import com.smartcampus.common.enums.information.NotificationStatusEnum;
import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.domain.information.repository.NotificationRepository;
import com.smartcampus.infrastructure.persistence.mapper.information.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 通知仓储实现类
 */
@Repository
@RequiredArgsConstructor
public class NotificationRepositoryImpl implements NotificationRepository {

    private final NotificationMapper notificationMapper;
    
    @Override
    public Notification save(Notification notification) {
        if (notification.getId() == null) {
            notificationMapper.insert(notification);
        } else {
            notificationMapper.update(notification);
        }
        return notification;
    }

    @Override
    public Optional<Notification> findById(Long id) {
        return Optional.ofNullable(notificationMapper.selectById(id));
    }

    @Override
    public Page<Notification> findByRecipient(String recipient, Pageable pageable) {
        return notificationMapper.selectPageByRecipient(recipient, pageable);
    }

    @Override
    public Page<Notification> findByRecipientAndStatus(String recipient, Integer status, Pageable pageable) {
        // 这里简化处理，实际可能需要实现更复杂的分页逻辑
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        List<Notification> notifications = notificationMapper.selectByRecipient(recipient)
                .stream()
                .filter(n -> n.getIsRead() == isRead)
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public Page<Notification> findByRecipientAndType(String recipient, Integer type, Pageable pageable) {
        // 同上，简化处理
        List<Notification> notifications = notificationMapper.selectByRecipient(recipient)
                .stream()
                .filter(n -> n.getType().equals(type))
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public Page<Notification> findByRecipientAndImportance(String recipient, Integer importance, Pageable pageable) {
        // 由于Notification实体中没有importance字段，暂时返回所有结果
        List<Notification> notifications = notificationMapper.selectByRecipient(recipient);
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), notifications.size());
        List<Notification> pageContent = notifications.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, notifications.size());
    }

    @Override
    public List<Notification> findByRecipientAndStatusNot(String recipient, Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.selectByRecipient(recipient)
                .stream()
                .filter(n -> n.getIsRead() != isRead)
                .collect(Collectors.toList());
    }

    @Override
    public long countByRecipientAndStatusNot(String recipient, Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.selectByRecipient(recipient)
                .stream()
                .filter(n -> n.getIsRead() != isRead)
                .count();
    }

    @Override
    public int updateStatus(Long id, Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.updateReadStatus(id, isRead);
    }

    @Override
    public List<Notification> findByStatus(Integer status) {
        // status=1表示已读，status=0表示未读
        boolean isRead = status == 1;
        return notificationMapper.selectByRecipient(null)
                .stream()
                .filter(n -> n.getIsRead() == isRead)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        notificationMapper.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return notificationMapper.selectById(id) != null;
    }
} 