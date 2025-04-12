import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/permission.service';

// 扩展Request类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        name: string;
        role: string;
      };
    }
  }
}

const permissionService = new PermissionService();

/**
 * 权限验证中间件
 * @param permissionCode 权限代码
 * @returns 中间件函数
 */
export const permissionMiddleware = (permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未授权，请登录'
      });
    }

    try {
      const hasPermission = await permissionService.checkUserPermission(req.user.id, permissionCode);
      
      if (!hasPermission) {
        return res.status(403).json({
          code: 403,
          message: '权限不足'
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误'
      });
    }
  };
};

/**
 * 角色验证中间件
 * @param roles 允许的角色代码列表
 * @returns 中间件函数
 */
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未授权，请登录'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: '权限不足'
      });
    }

    next();
  };
}; 