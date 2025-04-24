-- 通知公告表
CREATE TABLE IF NOT EXISTS t_notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '公告唯一标识',
    title VARCHAR(100) NOT NULL COMMENT '标题',
    content TEXT NOT NULL COMMENT '正文（富文本）',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-草稿 2-待审核 3-待发布 4-已发布 5-已过期 6-已取消发布 7-档案',
    creator_id BIGINT NOT NULL COMMENT '起草人ID',
    scope TINYINT NOT NULL DEFAULT 1 COMMENT '公开范围：1-全部 2-企业 3-角色',
    scope_details JSON COMMENT '范围详情（企业ID、角色ID列表）',
    type TINYINT NOT NULL DEFAULT 1 COMMENT '类型：1-普通 2-政策 3-活动 4-紧急',
    importance TINYINT NOT NULL DEFAULT 2 COMMENT '重要性：1-普通 2-重要 3-紧急',
    require_confirmation BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否需确认',
    confirmation_deadline DATETIME COMMENT '确认截止时间',
    view_count INT NOT NULL DEFAULT 0 COMMENT '查看次数',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    published_at DATETIME COMMENT '发布时间',
    scheduled_publish_at DATETIME COMMENT '定时发布时间',
    expired_at DATETIME COMMENT '过期时间',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否置顶',
    validity_period INT DEFAULT 7 COMMENT '有效期（默认7天）',
    archived_at DATETIME COMMENT '归档时间',
    attachments JSON COMMENT '附件信息（文件名、URL）',
    extra_data JSON COMMENT '扩展数据',
    INDEX idx_status (status),
    INDEX idx_creator (creator_id),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type),
    INDEX idx_importance (importance)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知公告表';

-- 用户表(如果已存在，可以跳过)
CREATE TABLE IF NOT EXISTS t_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户唯一标识',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) COMMENT '邮箱，用于通知',
    enterprise_id BIGINT COMMENT '所属企业ID',
    role VARCHAR(50) COMMENT '角色',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_username (username),
    INDEX idx_enterprise (enterprise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 权限表
CREATE TABLE IF NOT EXISTS t_user_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录唯一标识',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    permission VARCHAR(20) NOT NULL COMMENT '权限：draft、audit、publish、manage、archive',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user (user_id),
    INDEX idx_permission (permission),
    UNIQUE KEY uk_user_permission (user_id, permission)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户权限表';

-- 操作日志表
CREATE TABLE IF NOT EXISTS t_notice_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志唯一标识',
    notice_id BIGINT NOT NULL COMMENT '公告ID',
    operation VARCHAR(50) NOT NULL COMMENT '操作类型（如提交审核、发布）',
    user_id BIGINT NOT NULL COMMENT '操作人ID',
    comment TEXT COMMENT '备注（如驳回原因）',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    INDEX idx_notice (notice_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知操作日志表';

-- 查看记录表
CREATE TABLE IF NOT EXISTS t_notice_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录唯一标识',
    notice_id BIGINT NOT NULL COMMENT '公告ID',
    user_id BIGINT NOT NULL COMMENT '查看用户ID',
    viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '查看时间',
    INDEX idx_notice (notice_id),
    INDEX idx_user (user_id),
    INDEX idx_viewed_at (viewed_at),
    UNIQUE KEY uk_notice_user (notice_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知查看记录表';

-- 确认记录表
CREATE TABLE IF NOT EXISTS t_notice_confirmations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录唯一标识',
    notice_id BIGINT NOT NULL COMMENT '公告ID',
    user_id BIGINT NOT NULL COMMENT '确认用户ID',
    confirmed_at DATETIME COMMENT '确认时间',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_notice (notice_id),
    INDEX idx_user (user_id),
    INDEX idx_confirmed_at (confirmed_at),
    UNIQUE KEY uk_notice_user (notice_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知确认记录表';

-- 回收站表
CREATE TABLE IF NOT EXISTS t_recycle_bin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '回收记录唯一标识',
    notice_id BIGINT NOT NULL COMMENT '公告ID',
    deleted_by BIGINT NOT NULL COMMENT '删除人ID',
    deleted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '删除时间',
    expire_at DATETIME NOT NULL COMMENT '回收站过期时间（30天）',
    INDEX idx_notice (notice_id),
    INDEX idx_deleted_by (deleted_by),
    INDEX idx_expire_at (expire_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知回收站表';

-- 通知记录表
CREATE TABLE IF NOT EXISTS t_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '通知唯一标识',
    notice_id BIGINT NOT NULL COMMENT '公告ID',
    recipient_id BIGINT NOT NULL COMMENT '接收人ID',
    type VARCHAR(20) NOT NULL COMMENT '通知类型（inbox、app、sms）',
    content TEXT NOT NULL COMMENT '通知内容',
    sent_at DATETIME COMMENT '发送时间',
    is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已读',
    read_at DATETIME COMMENT '阅读时间',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_notice (notice_id),
    INDEX idx_recipient (recipient_id),
    INDEX idx_type (type),
    INDEX idx_sent_at (sent_at),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知推送记录表'; 