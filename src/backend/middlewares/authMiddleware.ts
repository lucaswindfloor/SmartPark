import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { dbQuery } from '../db/database';

// 扩展Express的Request类型，添加user属性
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

// JWT密钥，实际应用中应该从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * 身份验证中间件
 * 验证请求头中的JWT令牌，解析用户信息并添加到req.user中
 */
export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '未授权，请登录'
      });
    }

    // 验证token格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        code: 401,
        message: '无效的授权格式'
      });
    }

    const token = parts[1];

    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // 从数据库获取用户信息
    const user = await dbQuery.get(`
      SELECT id, username, name, role, status
      FROM users
      WHERE id = ?
    `, [decoded.id]);

    // 验证用户是否存在
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在或已删除'
      });
    }

    // 验证用户状态
    if (user.status !== 'active') {
      return res.status(403).json({
        code: 403,
        message: '用户已禁用'
      });
    }

    // 将用户信息添加到请求对象中
    req.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    };

    // 继续下一个中间件
    next();
  } catch (error) {
    // Token无效或过期
    return res.status(401).json({
      code: 401,
      message: '无效的认证，请重新登录'
    });
  }
};

/**
 * 角色验证中间件生成函数
 * 检查用户是否具有指定角色
 * @param roles 允许的角色数组
 */
export const roleMiddleware = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    // 确保authMiddleware先运行
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未授权，请登录'
      });
    }

    // 检查用户角色是否在允许的角色列表中
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: '权限不足'
      });
    }

    // 角色验证通过，继续
    next();
  };
}; 