package com.smartcampus.platform.comprehensive.service.controller.information;

import com.smartcampus.common.response.Result;
import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.platform.comprehensive.service.service.information.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 通知公告控制器
 */
@RestController("noticeController")
@RequestMapping("/service/notifications")
@Slf4j
public class NoticeController {

    private final NotificationService notificationService;

    public NoticeController(@Qualifier("informationNotificationService") NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    /**
     * 创建通知
     */
    @PostMapping
    public Result<Notification> createNotification(@RequestBody @Valid Notification notification) {
        log.info("创建通知: {}", notification);
        Notification created = notificationService.createNotification(notification);
        return Result.success(created);
    }
    
    /**
     * 获取通知详情
     */
    @GetMapping("/{id}")
    public Result<Notification> getNotification(@PathVariable Long id) {
        log.info("获取通知详情, ID: {}", id);
        Notification notification = notificationService.getNotificationById(id);
        return Result.success(notification);
    }
    
    /**
     * 分页查询通知
     */
    @GetMapping
    public Result<Page<Notification>> getNotifications(
            @RequestParam(required = false) String recipient,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer importance,
            @PageableDefault(size = 20, sort = "createTime,desc") Pageable pageable) {
        
        log.info("查询通知列表, 接收者: {}, 状态: {}, 类型: {}, 重要性: {}", recipient, status, type, importance);
        
        Page<Notification> page = notificationService.getNotifications(recipient, status, type, importance, pageable);
        return Result.success(page);
    }
    
    /**
     * 获取未读通知
     */
    @GetMapping("/unread")
    public Result<List<Notification>> getUnreadNotifications(@RequestParam String recipient) {
        log.info("获取未读通知, 接收者: {}", recipient);
        List<Notification> notifications = notificationService.getUnreadNotifications(recipient);
        return Result.success(notifications);
    }
    
    /**
     * 统计未读通知数量
     */
    @GetMapping("/unread/count")
    public Result<Long> countUnreadNotifications(@RequestParam String recipient) {
        log.info("统计未读通知数量, 接收者: {}", recipient);
        long count = notificationService.countUnreadNotifications(recipient);
        return Result.success(count);
    }
    
    /**
     * 标记通知为已读
     */
    @PutMapping("/{id}/read")
    public Result<Boolean> markAsRead(@PathVariable Long id, @RequestParam String recipient) {
        log.info("标记通知为已读, ID: {}, 接收者: {}", id, recipient);
        boolean success = notificationService.markAsRead(id, recipient);
        return Result.success(success);
    }
    
    /**
     * 发送通知
     */
    @PutMapping("/{id}/send")
    public Result<Boolean> sendNotification(@PathVariable Long id) {
        log.info("发送通知, ID: {}", id);
        boolean success = notificationService.sendNotification(id);
        return Result.success(success);
    }
    
    /**
     * 取消通知
     */
    @PutMapping("/{id}/cancel")
    public Result<Boolean> cancelNotification(@PathVariable Long id) {
        log.info("取消通知, ID: {}", id);
        boolean success = notificationService.cancelNotification(id);
        return Result.success(success);
    }
    
    /**
     * 删除通知
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteNotification(@PathVariable Long id) {
        log.info("删除通知, ID: {}", id);
        boolean success = notificationService.deleteNotification(id);
        return Result.success(success);
    }
} 