// 定义通知公告相关的权限

// 权限常量，映射到后端权限定义
export enum AnnouncementPermission {
  CREATE = 'announcement:create',
  UPDATE = 'announcement:update',
  DELETE = 'announcement:delete',
  REVIEW = 'announcement:review',
  PUBLISH = 'announcement:publish',
  TOP = 'announcement:top',
  VIEW = 'announcement:view',
  CONFIRM = 'announcement:confirm',
}

// 通知公告权限映射到功能描述
export const ANNOUNCEMENT_PERMISSION_LABELS: Record<AnnouncementPermission, string> = {
  [AnnouncementPermission.CREATE]: '创建通知公告',
  [AnnouncementPermission.UPDATE]: '编辑通知公告',
  [AnnouncementPermission.DELETE]: '删除通知公告',
  [AnnouncementPermission.REVIEW]: '审核通知公告',
  [AnnouncementPermission.PUBLISH]: '发布通知公告',
  [AnnouncementPermission.TOP]: '置顶通知公告',
  [AnnouncementPermission.VIEW]: '查看通知公告',
  [AnnouncementPermission.CONFIRM]: '确认通知公告',
};

// 角色对应的权限集合
export const ROLE_PERMISSIONS = {
  // 园区管理员拥有所有权限
  parkAdmin: Object.values(AnnouncementPermission),
  
  // 内容管理员可以创建、编辑、删除通知，但不能审核和发布
  contentAdmin: [
    AnnouncementPermission.CREATE,
    AnnouncementPermission.UPDATE,
    AnnouncementPermission.DELETE,
    AnnouncementPermission.VIEW,
  ],
  
  // 审核人员可以审核和发布通知
  reviewer: [
    AnnouncementPermission.REVIEW,
    AnnouncementPermission.PUBLISH,
    AnnouncementPermission.VIEW,
  ],
  
  // 企业管理员只能查看和确认通知
  enterpriseAdmin: [
    AnnouncementPermission.VIEW,
    AnnouncementPermission.CONFIRM,
  ],
  
  // 企业员工只能查看和确认通知
  employee: [
    AnnouncementPermission.VIEW,
    AnnouncementPermission.CONFIRM,
  ],
  
  // 公众用户只能查看公开的通知
  public: [
    AnnouncementPermission.VIEW,
  ],
};

// 检查用户是否拥有指定权限
export const hasPermission = (
  userRole: string, 
  userPermissions: string[], 
  requiredPermission: AnnouncementPermission
): boolean => {
  // 如果用户是园区管理员，默认拥有所有权限
  if (userRole === 'parkAdmin') {
    return true;
  }
  
  // 检查用户的权限列表中是否包含所需权限
  return userPermissions.includes(requiredPermission);
};

// 根据用户角色获取权限列表
export const getPermissionsByRole = (role: string): AnnouncementPermission[] => {
  // @ts-ignore
  return ROLE_PERMISSIONS[role] || [];
}; 