// 定义通知公告权限
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

// 定义功能模块
export enum PermissionModule {
  ENTERPRISE_MANAGEMENT = 'enterpriseManagement',
  CONTRACT_MANAGEMENT = 'contractManagement',
  BILLING_MANAGEMENT = 'billingManagement',
  SERVICE_APPLICATION = 'serviceApplication',
  VISITOR_MANAGEMENT = 'visitorManagement',
  PARK_ACTIVITIES = 'parkActivities',
  ANNOUNCEMENT_MANAGEMENT = 'announcementManagement',
}

// 定义具体功能点
export enum PermissionAction {
  // 企业管理
  MANAGE_ENTERPRISE = 'manage_enterprise',
  VIEW_ENTERPRISE_INFO = 'view_enterprise_info',
  EDIT_ENTERPRISE_INFO = 'editEnterpriseInfo',
  MANAGE_EMPLOYEES = 'manageEmployees',
  CONFIGURE_DEPARTMENTS = 'configureDepartments',
  // 合同管理
  VIEW_CONTRACTS = 'viewContracts',
  APPLY_CONTRACT_RENEWAL = 'applyContractRenewal',
  APPLY_CONTRACT_CHANGE = 'applyContractChange',
  UPLOAD_CONTRACT_DOCUMENTS = 'uploadContractDocuments',
  // 账单管理
  VIEW_BILLS = 'viewBills',
  PAY_BILLS = 'payBills',
  VIEW_PAYMENT_RECORDS = 'viewPaymentRecords',
  REQUEST_INVOICE = 'requestInvoice',
  // 服务申请
  APPLY_ENTERPRISE_SERVICE = 'applyEnterpriseService',
  BOOK_MEETING_ROOM = 'bookMeetingRoom',
  REPORT_MAINTENANCE = 'reportMaintenance',
  CHECK_SERVICE_STATUS = 'checkServiceStatus',
  // 访客管理
  INVITE_VISITORS = 'inviteVisitors',
  VIEW_VISITOR_RECORDS = 'viewVisitorRecords',
  BATCH_IMPORT_VISITORS = 'batchImportVisitors',
  REQUEST_VISITOR_ACCESS = 'requestVisitorAccess',
  // 园区活动
  VIEW_ACTIVITIES = 'viewActivities',
  REGISTER_ACTIVITIES = 'registerActivities',
  PUBLISH_ACTIVITIES = 'publishActivities',
  DOWNLOAD_ACTIVITY_MATERIALS = 'downloadActivityMaterials',
} 