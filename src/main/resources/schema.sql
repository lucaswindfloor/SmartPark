-- 用户表
CREATE TABLE IF NOT EXISTS t_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    nickname VARCHAR(50) COMMENT '昵称',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    user_type TINYINT NOT NULL DEFAULT 1 COMMENT '用户类型：1-系统用户，2-企业用户，3-个人用户',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_username (username)
) COMMENT '用户表';

-- 角色表
CREATE TABLE IF NOT EXISTS t_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL COMMENT '角色编码',
    description VARCHAR(200) COMMENT '角色描述',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_role_code (role_code)
) COMMENT '角色表';

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS t_user_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_role (user_id, role_id)
) COMMENT '用户角色关联表';

-- 通知公告表
CREATE TABLE IF NOT EXISTS t_notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT NOT NULL COMMENT '通知内容',
    type TINYINT NOT NULL COMMENT '通知类型：1-通知公告，2-政策文件，3-园区活动，4-调查问卷，5-需求发布',
    importance TINYINT NOT NULL DEFAULT 0 COMMENT '重要程度：0-普通，1-重要，2-紧急',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-草稿，1-待审核，2-已发布，3-已归档，4-已驳回',
    publish_range VARCHAR(500) COMMENT '发布范围，JSON格式，例如：{"all":true, "depts":[1,2], "roles":[1,2]}',
    publish_time DATETIME COMMENT '发布时间',
    expire_time DATETIME COMMENT '过期时间',
    is_top TINYINT NOT NULL DEFAULT 0 COMMENT '是否置顶：0-否，1-是',
    is_confirm TINYINT NOT NULL DEFAULT 0 COMMENT '是否需要确认：0-否，1-是',
    confirm_count INT NOT NULL DEFAULT 0 COMMENT '确认人数',
    audit_user_id BIGINT COMMENT '审核人ID',
    audit_time DATETIME COMMENT '审核时间',
    audit_opinion VARCHAR(500) COMMENT '审核意见',
    creator_id BIGINT NOT NULL COMMENT '创建人ID',
    creator_name VARCHAR(50) NOT NULL COMMENT '创建人姓名',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    delete_flag TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志：0-正常，1-已删除',
    mobile_optimized TINYINT NOT NULL DEFAULT 0 COMMENT '是否移动端优化：0-否，1-是',
    alt_text VARCHAR(500) COMMENT '无障碍替代文本'
) COMMENT '通知公告表';

-- 通知阅读表
CREATE TABLE IF NOT EXISTS t_notification_read (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    notification_id BIGINT NOT NULL COMMENT '通知ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    read_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '阅读时间',
    is_confirmed TINYINT NOT NULL DEFAULT 0 COMMENT '是否已确认：0-否，1-是',
    confirm_time DATETIME COMMENT '确认时间',
    UNIQUE KEY uk_notification_user (notification_id, user_id)
) COMMENT '通知阅读表';

-- 通知附件表
CREATE TABLE IF NOT EXISTS t_notification_attachment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    notification_id BIGINT NOT NULL COMMENT '通知ID',
    file_name VARCHAR(200) NOT NULL COMMENT '文件名称',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
    file_type VARCHAR(100) COMMENT '文件类型',
    upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间'
) COMMENT '通知附件表';

-- 初始化管理员账户
INSERT INTO t_user (username, password, nickname, status, user_type) 
VALUES ('admin', '$2a$10$IS5KyaU/z9Qu9u.ydLjwBe5uMGqcnL9R6yJPAO/s8GqfLx4uxgB/G', '系统管理员', 1, 1);

-- 初始化角色
INSERT INTO t_role (role_name, role_code, description, status) 
VALUES ('系统管理员', 'ROLE_ADMIN', '系统管理员角色，拥有所有权限', 1),
       ('运维人员', 'ROLE_OPERATOR', '运维人员角色，负责日常运维工作', 1),
       ('企业管理员', 'ROLE_ENTERPRISE_ADMIN', '企业管理员角色，负责企业内部管理', 1);

-- 分配角色给管理员
INSERT INTO t_user_role (user_id, role_id) VALUES (1, 1); 