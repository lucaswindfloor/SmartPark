import { AppDataSource } from '../app';
import { Permission } from '../models/permission.entity';
import { Role } from '../models/role.entity';
import { RolePermission } from '../models/role-permission.entity';
import { User } from '../models/user.entity';
import { UserRole } from '../models/user-role.entity';

export class PermissionService {
  private permissionRepository = AppDataSource.getRepository(Permission);
  private roleRepository = AppDataSource.getRepository(Role);
  private rolePermissionRepository = AppDataSource.getRepository(RolePermission);
  private userRoleRepository = AppDataSource.getRepository(UserRole);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * 检查用户是否具有指定权限
   * @param userId 用户ID
   * @param permissionCode 权限代码
   * @returns 是否具有权限
   */
  async checkUserPermission(userId: number, permissionCode: string): Promise<boolean> {
    // 获取用户角色
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role']
    });

    if (!userRoles.length) {
      return false;
    }

    // 获取所有角色ID
    const roleIds = userRoles.map(ur => ur.roleId);

    // 获取权限信息
    const permission = await this.permissionRepository.findOne({
      where: { code: permissionCode }
    });

    if (!permission) {
      return false;
    }

    // 检查角色是否具有该权限
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        permissionId: permission.id,
        roleId: roleIds as any // TypeORM的In操作符类型有问题
      }
    });

    return !!rolePermission;
  }

  /**
   * 获取用户所有权限
   * @param userId 用户ID
   * @returns 权限代码列表
   */
  async getUserPermissions(userId: number): Promise<string[]> {
    // 获取用户角色
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role']
    });

    if (!userRoles.length) {
      return [];
    }

    // 获取所有角色ID
    const roleIds = userRoles.map(ur => ur.roleId);

    // 获取角色权限
    const rolePermissions = await this.rolePermissionRepository.find({
      where: {
        roleId: roleIds as any // TypeORM的In操作符类型有问题
      },
      relations: ['permission']
    });

    // 提取权限代码
    const permissionCodes = rolePermissions.map(rp => rp.permission.code);

    // 去重
    return [...new Set(permissionCodes)];
  }

  /**
   * 初始化系统权限
   * @param permissions 权限列表 [{code, name, module, description}]
   */
  async initPermissions(permissions: Partial<Permission>[]): Promise<void> {
    for (const perm of permissions) {
      // 检查权限是否已存在
      const existingPerm = await this.permissionRepository.findOne({
        where: { code: perm.code }
      });

      if (!existingPerm) {
        await this.permissionRepository.save(perm);
      }
    }
  }

  /**
   * 初始化系统角色
   * @param roles 角色列表 [{code, name, description}]
   */
  async initRoles(roles: Partial<Role>[]): Promise<void> {
    for (const role of roles) {
      // 检查角色是否已存在
      const existingRole = await this.roleRepository.findOne({
        where: { code: role.code }
      });

      if (!existingRole) {
        await this.roleRepository.save(role);
      }
    }
  }

  /**
   * 初始化角色权限
   * @param rolePermissionMap 角色权限映射 {roleCode: [permissionCode1, permissionCode2]}
   */
  async initRolePermissions(rolePermissionMap: Record<string, string[]>): Promise<void> {
    for (const [roleCode, permissionCodes] of Object.entries(rolePermissionMap)) {
      // 获取角色
      const role = await this.roleRepository.findOne({
        where: { code: roleCode }
      });

      if (!role) continue;

      for (const permCode of permissionCodes) {
        // 获取权限
        const permission = await this.permissionRepository.findOne({
          where: { code: permCode }
        });

        if (!permission) continue;

        // 检查角色权限关联是否已存在
        const existingRelation = await this.rolePermissionRepository.findOne({
          where: {
            roleId: role.id,
            permissionId: permission.id
          }
        });

        if (!existingRelation) {
          await this.rolePermissionRepository.save({
            roleId: role.id,
            permissionId: permission.id
          });
        }
      }
    }
  }
} 