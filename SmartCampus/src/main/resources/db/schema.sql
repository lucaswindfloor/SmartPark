-- Announcement Table (previously t_notices)
CREATE TABLE IF NOT EXISTS t_announcement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Announcement unique identifier',
    title VARCHAR(100) NOT NULL COMMENT 'Title',
    content TEXT NOT NULL COMMENT 'Content (Rich Text)', -- Changed to NOT NULL
    type VARCHAR(50) COMMENT 'Type code (from AnnouncementTypeEnum)',
    status VARCHAR(50) COMMENT 'Status code (from AnnouncementStatusEnum)',
    importance VARCHAR(50) COMMENT 'Importance level code', -- Added
    require_confirmation BOOLEAN DEFAULT FALSE COMMENT 'Requires confirmation flag', -- Added
    confirmation_deadline DATETIME COMMENT 'Confirmation deadline', -- Added
    attachments JSON COMMENT 'Attachments info (filename, URL)', -- Added
    publish_time DATETIME COMMENT 'Actual publish time',
    scheduled_publish_at DATETIME COMMENT 'Scheduled publish time', -- Added
    expiry_time DATETIME COMMENT 'Expiry time',
    validity_period INT DEFAULT 7 COMMENT 'Validity period (days)', -- Added
    archived_at DATETIME COMMENT 'Archive time', -- Added
    is_top BOOLEAN DEFAULT FALSE COMMENT 'Is pinned/top',
    sort_order INT DEFAULT 0 COMMENT 'Sort order for pinned items',
    view_count INT DEFAULT 0 COMMENT 'View count', -- Added
    -- Columns from BaseEntity
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    create_by VARCHAR(64) COMMENT 'Creator username or ID',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
    update_by VARCHAR(64) COMMENT 'Last updater username or ID',
    delete_flag TINYINT DEFAULT 0 COMMENT 'Logic delete flag (0: not deleted, 1: deleted)',
    -- Additional fields from original t_notices (optional, based on detailed requirements)
    -- creator_id BIGINT COMMENT 'Creator User ID (alternative to create_by)',
    -- scope TINYINT DEFAULT 1 COMMENT 'Scope: 1-All 2-Enterprise 3-Role',
    -- scope_details JSON COMMENT 'Scope details (list of IDs)',
    -- importance TINYINT DEFAULT 2 COMMENT 'Importance: 1-Normal 2-Important 3-Urgent',
    -- require_confirmation BOOLEAN DEFAULT FALSE COMMENT 'Requires confirmation flag',
    -- confirmation_deadline DATETIME COMMENT 'Confirmation deadline',
    -- view_count INT DEFAULT 0 COMMENT 'View count',
    -- scheduled_publish_at DATETIME COMMENT 'Scheduled publish time',
    -- validity_period INT DEFAULT 7 COMMENT 'Validity period (days)',
    -- archived_at DATETIME COMMENT 'Archive time',
    -- extra_data JSON COMMENT 'Extra data',
    INDEX idx_status (status),
    -- INDEX idx_creator (creator_id), -- If using creator_id
    INDEX idx_create_time (create_time),
    INDEX idx_type (type),
    INDEX idx_importance (importance), -- Added index
    INDEX idx_publish_time (publish_time),
    INDEX idx_scheduled_publish_at (scheduled_publish_at), -- Added index
    INDEX idx_is_top_sort (is_top, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement Table';

-- Announcement Permission/Scope Table (replaces t_user_permissions)
CREATE TABLE IF NOT EXISTS t_announcement_permission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Record unique identifier',
    announcement_id BIGINT NOT NULL COMMENT 'Announcement ID',
    target_type VARCHAR(50) NOT NULL COMMENT 'Target type (e.g., ROLE, DEPARTMENT, USER, ENTERPRISE)',
    target_id BIGINT NOT NULL COMMENT 'Target ID (ID of role, department, user, etc.)',
    -- Columns from BaseEntity
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    create_by VARCHAR(64) COMMENT 'Creator username or ID',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
    update_by VARCHAR(64) COMMENT 'Last updater username or ID',
    delete_flag TINYINT DEFAULT 0 COMMENT 'Logic delete flag (0: not deleted, 1: deleted)',
    INDEX idx_announcement (announcement_id),
    INDEX idx_target (target_type, target_id),
    UNIQUE KEY uk_announcement_target (announcement_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement Permission/Scope Table';


-- Announcement Log Table (previously t_notice_logs)
CREATE TABLE IF NOT EXISTS t_announcement_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Log unique identifier',
    announcement_id BIGINT NOT NULL COMMENT 'Announcement ID',
    operation VARCHAR(50) NOT NULL COMMENT 'Operation type (e.g., CREATE, SUBMIT_APPROVAL, PUBLISH)',
    user_id BIGINT NOT NULL COMMENT 'Operator User ID',
    username VARCHAR(64) COMMENT 'Operator username',
    comment TEXT COMMENT 'Remark (e.g., rejection reason)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Operation time',
    INDEX idx_announcement (announcement_id),
    INDEX idx_user (user_id),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement Operation Log Table';

-- Announcement View Record Table (previously t_notice_views)
CREATE TABLE IF NOT EXISTS t_announcement_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Record unique identifier',
    announcement_id BIGINT NOT NULL COMMENT 'Announcement ID',
    user_id BIGINT NOT NULL COMMENT 'Viewer User ID',
    view_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'View time',
    INDEX idx_announcement (announcement_id),
    INDEX idx_user (user_id),
    INDEX idx_view_time (view_time),
    UNIQUE KEY uk_announcement_user (announcement_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement View Record Table';

-- Announcement Confirmation Record Table (previously t_notice_confirmations)
CREATE TABLE IF NOT EXISTS t_announcement_confirmations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Record unique identifier',
    announcement_id BIGINT NOT NULL COMMENT 'Announcement ID',
    user_id BIGINT NOT NULL COMMENT 'Confirmer User ID',
    confirmation_time DATETIME COMMENT 'Confirmation time',
    -- Columns from BaseEntity
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    create_by VARCHAR(64) COMMENT 'Creator username or ID (Might be the user ID)',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
    update_by VARCHAR(64) COMMENT 'Last updater username or ID',
    delete_flag TINYINT DEFAULT 0 COMMENT 'Logic delete flag (0: not deleted, 1: deleted)',
    INDEX idx_announcement (announcement_id),
    INDEX idx_user (user_id),
    INDEX idx_confirmation_time (confirmation_time),
    UNIQUE KEY uk_announcement_user (announcement_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement Confirmation Record Table';

-- Announcement Recycle Bin Table (previously t_recycle_bin)
CREATE TABLE IF NOT EXISTS t_announcement_recycle_bin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Recycle record unique identifier',
    announcement_id BIGINT NOT NULL COMMENT 'Announcement ID',
    delete_by BIGINT NOT NULL COMMENT 'Deleter User ID',
    delete_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Deletion time',
    expire_time DATETIME NOT NULL COMMENT 'Recycle bin expiry time (e.g., 30 days)',
    INDEX idx_announcement (announcement_id),
    INDEX idx_delete_by (delete_by),
    INDEX idx_expire_time (expire_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement Recycle Bin Table';


-- User Table (Keep as is, assuming it's a general user table)
CREATE TABLE IF NOT EXISTS t_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'User unique identifier',
    username VARCHAR(50) NOT NULL COMMENT 'Username',
    password VARCHAR(100) NOT NULL COMMENT 'Password (Hashed)', -- Added password
    email VARCHAR(100) COMMENT 'Email, used for notifications',
    phone VARCHAR(20) COMMENT 'Phone number', -- Added phone
    enterprise_id BIGINT COMMENT 'Associated enterprise ID',
    role VARCHAR(50) COMMENT 'Role (Consider using a separate Role table)',
    status TINYINT DEFAULT 0 COMMENT 'User status (0: normal, 1: disabled)', -- Added status
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    create_by VARCHAR(64) COMMENT 'Creator username or ID',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
    update_by VARCHAR(64) COMMENT 'Last updater username or ID',
    delete_flag TINYINT DEFAULT 0 COMMENT 'Logic delete flag (0: not deleted, 1: deleted)', -- Added delete_flag
    UNIQUE KEY uk_username (username),
    INDEX idx_enterprise (enterprise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User Table';


-- Notification Table (Keep as is for push notifications, distinct from announcements)
CREATE TABLE IF NOT EXISTS t_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Notification unique identifier',
    -- announcement_id BIGINT COMMENT 'Related Announcement ID (Optional)', -- Can link to announcement if needed
    recipient_id BIGINT NOT NULL COMMENT 'Recipient User ID',
    type VARCHAR(20) NOT NULL COMMENT 'Notification type (e.g., INBOX, APP_PUSH, SMS, EMAIL)',
    title VARCHAR(100) COMMENT 'Notification title',
    content TEXT NOT NULL COMMENT 'Notification content',
    sent_at DATETIME COMMENT 'Send time',
    is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Is read flag',
    read_at DATETIME COMMENT 'Read time',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    -- INDEX idx_announcement (announcement_id), -- If adding link
    INDEX idx_recipient (recipient_id),
    INDEX idx_type (type),
    INDEX idx_sent_at (sent_at),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Push Notification Record Table'; 