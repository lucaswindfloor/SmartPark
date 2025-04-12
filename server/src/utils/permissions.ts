// 用户角色定义
export enum UserRoleCode {
  PARK_ADMIN = 'park_admin',          // 园区管理员
  CONTENT_ADMIN = 'content_admin',    // 内容管理员
  REVIEWER = 'reviewer',              // 审核员(同时具备发布权限)
  ENTERPRISE_ADMIN = 'enterprise',    // 企业管理员
  EMPLOYEE = 'employee',              // 企业员工
  PUBLIC = 'public'                   // 公众用户
}

// 权限模块定义
export enum PermissionModule {
  SYSTEM = 'system',               // 系统管理
  USER = 'user',                   // 用户管理
  ROLE = 'role',                   // 角色管理
  ANNOUNCEMENT = 'announcement',   // 通知公告
  POLICY = 'policy',               // 政策文件
  ACTIVITY = 'activity',           // 园区活动
  SURVEY = 'survey',               // 调查问卷
  DEMAND = 'demand'                // 需求发布
}

// 权限定义 - 通知公告模块
export enum AnnouncementPermission {
  CREATE = 'announcement:create',         // 创建通知公告
  UPDATE = 'announcement:update',         // 修改通知公告
  DELETE = 'announcement:delete',         // 删除通知公告
  VIEW_ALL = 'announcement:view:all',     // 查看所有通知公告
  REVIEW = 'announcement:review',         // 审核通知公告
  PUBLISH = 'announcement:publish',       // 发布通知公告
  TOP = 'announcement:top',               // 置顶通知公告
  VIEW_STATS = 'announcement:view:stats'  // 查看统计数据
}

// 角色-权限映射表
export const ROLE_PERMISSIONS = {
  [UserRoleCode.PARK_ADMIN]: [
    AnnouncementPermission.CREATE,
    AnnouncementPermission.UPDATE,
    AnnouncementPermission.DELETE,
    AnnouncementPermission.VIEW_ALL,
    AnnouncementPermission.REVIEW,
    AnnouncementPermission.PUBLISH,
    AnnouncementPermission.TOP,
    AnnouncementPermission.VIEW_STATS
  ],
  [UserRoleCode.CONTENT_ADMIN]: [
    AnnouncementPermission.CREATE,
    AnnouncementPermission.UPDATE,
    AnnouncementPermission.DELETE,
    AnnouncementPermission.VIEW_ALL,
    AnnouncementPermission.VIEW_STATS
  ],
  [UserRoleCode.REVIEWER]: [
    AnnouncementPermission.VIEW_ALL,
    AnnouncementPermission.REVIEW,
    AnnouncementPermission.PUBLISH,
    AnnouncementPermission.TOP,
    AnnouncementPermission.VIEW_STATS
  ]
}; 