import { AppDataSource } from '../app';
import { PermissionService } from '../services/permission.service';
import { 
  UserRoleCode, 
  PermissionModule, 
  AnnouncementPermission, 
  ROLE_PERMISSIONS 
} from '../utils/permissions';
import { User } from '../models/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * 初始化数据库
 */
export async function initDatabase() {
  // 确保数据库连接已初始化
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return;
  }

  const permissionService = new PermissionService();
  const userRepository = AppDataSource.getRepository(User);

  // 初始化权限
  const permissions = [
    // 通知公告权限
    { 
      code: AnnouncementPermission.CREATE, 
      name: '创建通知公告', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许创建新的通知公告' 
    },
    { 
      code: AnnouncementPermission.UPDATE, 
      name: '修改通知公告', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许修改已有的通知公告' 
    },
    { 
      code: AnnouncementPermission.DELETE, 
      name: '删除通知公告', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许删除通知公告' 
    },
    { 
      code: AnnouncementPermission.VIEW_ALL, 
      name: '查看所有通知公告', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许查看所有通知公告，包括草稿状态的' 
    },
    { 
      code: AnnouncementPermission.REVIEW, 
      name: '审核通知公告', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许审核通知公告' 
    },
    { 
      code: AnnouncementPermission.PUBLISH, 
      name: '发布通知公告', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许发布通知公告' 
    },
    { 
      code: AnnouncementPermission.TOP, 
      name: '置顶通知公告', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许置顶通知公告' 
    },
    { 
      code: AnnouncementPermission.VIEW_STATS, 
      name: '查看统计数据', 
      module: PermissionModule.ANNOUNCEMENT,
      description: '允许查看通知公告的统计数据' 
    }
  ];

  await permissionService.initPermissions(permissions);
  console.log('权限初始化完成');

  // 初始化角色
  const roles = [
    { 
      code: UserRoleCode.PARK_ADMIN, 
      name: '园区管理员', 
      description: '园区管理员拥有系统的所有权限'
    },
    { 
      code: UserRoleCode.CONTENT_ADMIN, 
      name: '内容管理员', 
      description: '负责内容创建和管理'
    },
    { 
      code: UserRoleCode.REVIEWER, 
      name: '审核员', 
      description: '负责审核内容'
    },
    { 
      code: UserRoleCode.PUBLISHER, 
      name: '发布员', 
      description: '负责发布和置顶内容'
    },
    { 
      code: UserRoleCode.ENTERPRISE_ADMIN, 
      name: '企业管理员', 
      description: '企业管理员'
    },
    { 
      code: UserRoleCode.EMPLOYEE, 
      name: '企业员工', 
      description: '企业普通员工'
    },
    { 
      code: UserRoleCode.PUBLIC, 
      name: '公众用户', 
      description: '未注册用户或普通访客'
    }
  ];

  await permissionService.initRoles(roles);
  console.log('角色初始化完成');

  // 初始化角色-权限关系
  await permissionService.initRolePermissions(ROLE_PERMISSIONS);
  console.log('角色权限关系初始化完成');

  // 创建默认用户
  const saltRounds = 10;
  const defaultUsers = [
    {
      username: 'admin',
      password: await bcrypt.hash('admin123', saltRounds),
      name: '系统管理员',
      email: 'admin@example.com',
      role: UserRoleCode.PARK_ADMIN,
      status: 'active'
    },
    {
      username: 'content_admin',
      password: await bcrypt.hash('content123', saltRounds),
      name: '内容管理员',
      email: 'content@example.com',
      role: UserRoleCode.CONTENT_ADMIN,
      status: 'active'
    },
    {
      username: 'reviewer',
      password: await bcrypt.hash('reviewer123', saltRounds),
      name: '审核员',
      email: 'reviewer@example.com',
      role: UserRoleCode.REVIEWER,
      status: 'active'
    },
    {
      username: 'publisher',
      password: await bcrypt.hash('publisher123', saltRounds),
      name: '发布员',
      email: 'publisher@example.com',
      role: UserRoleCode.PUBLISHER,
      status: 'active'
    },
    {
      username: 'enterprise',
      password: await bcrypt.hash('enterprise123', saltRounds),
      name: '企业管理员',
      email: 'enterprise@example.com',
      role: UserRoleCode.ENTERPRISE_ADMIN,
      status: 'active'
    },
    {
      username: 'employee',
      password: await bcrypt.hash('employee123', saltRounds),
      name: '企业员工',
      email: 'employee@example.com',
      role: UserRoleCode.EMPLOYEE,
      status: 'active'
    }
  ];

  for (const userData of defaultUsers) {
    const existingUser = await userRepository.findOne({ where: { username: userData.username } });
    if (!existingUser) {
      await userRepository.save(userData);
    }
  }
  console.log('默认用户创建完成');
}

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('数据库初始化成功');
      process.exit(0);
    })
    .catch(error => {
      console.error('数据库初始化失败:', error);
      process.exit(1);
    });
} 