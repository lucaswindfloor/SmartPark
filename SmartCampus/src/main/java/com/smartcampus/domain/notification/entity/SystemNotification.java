package com.smartcampus.domain.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * System Notification entity
 */
@Entity(name = "SystemNotification")
@Table(name = "t_notification")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String title;
    
    @NotBlank(message = "Content cannot be empty")
    @Size(max = 2000, message = "Content cannot exceed 2000 characters")
    @Column(nullable = false, length = 2000)
    private String content;
    
    @NotNull(message = "Notification type cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Column(nullable = false)
    private String sender;
    
    @Column(nullable = false)
    private String recipient;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status = NotificationStatus.PENDING;
    
    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createTime = LocalDateTime.now();
    
    private LocalDateTime sendTime;
    
    private LocalDateTime readTime;
    
    private String extraData;
} 