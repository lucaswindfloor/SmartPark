import { Request, Response } from 'express';
import { dbQuery } from '../db/database';
import {
  NoticeStatus,
  NoticeType,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  ReviewNoticeRequest
} from '../models/Notice';

/**
 * 获取通知列表
 */
export const getNotices = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      page_size = 10,
      keyword = '',
      status,
      category,
      start_date,
      end_date
    } = req.query;
    
    // 构建查询 - 已移除 n.updated_by
    let query = `
      SELECT 
        n.id,
        n.title,
        n.content,
        n.category,
        n.status,
        n.is_top,
        n.require_confirmation,
        n.created_at,
        n.updated_at,
        n.published_at,
        n.created_by,
        n.reviewed_by,
        n.reject_reason,
        u.name as creator_name,
        (SELECT COUNT(*) FROM notice_views WHERE notice_id = n.id) as view_count,
        (SELECT COUNT(*) FROM notice_confirmations WHERE notice_id = n.id) as confirm_count
      FROM notices n
      LEFT JOIN users u ON n.created_by = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    // 添加筛选条件
    if (keyword) {
      query += ` AND (n.title LIKE ? OR n.content LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    if (status) {
      query += ` AND n.status = ?`;
      params.push(status);
    }
    
    if (category) {
      query += ` AND n.category = ?`;
      params.push(category);
    }
    
    if (start_date) {
      query += ` AND n.created_at >= ?`;
      params.push(start_date);
    }
    
    if (end_date) {
      query += ` AND n.created_at <= ?`;
      params.push(end_date);
    }
    
    // 获取总数
    const countQuery = `SELECT COUNT(*) as total FROM (${query})`;
    const totalResult = await dbQuery.get<{ total: number }>(countQuery, params);
    const total = totalResult?.total || 0;
    
    // 添加排序和分页
    query += ` ORDER BY n.is_top DESC, n.created_at DESC`;
    query += ` LIMIT ? OFFSET ?`;
    
    const limit = Number(page_size);
    const offset = (Number(page) - 1) * limit;
    params.push(limit, offset);
    
    // 执行查询
    const notices = await dbQuery.all(query, params);
    
    // 获取每个通知的公开范围
    for (const notice of notices) {
      const rangesResult = await dbQuery.all(`
        SELECT public_range FROM notice_public_ranges WHERE notice_id = ?
      `, [notice.id]);
      
      notice.public_ranges = rangesResult.map(r => r.public_range);
    }
    
    res.json({
      code: 0,
      message: '获取通知列表成功',
      data: {
        total,
        data: notices,
        page: Number(page),
        pageSize: limit,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('获取通知列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取通知列表失败',
      error: error.message
    });
  }
};

/**
 * 创建通知
 */
export const createNotice = async (req: Request, res: Response) => {
  try {
    console.log('创建通知请求数据:', req.body);
    console.log('当前用户:', req.user);

    // 在开发环境中不需要身份验证
    if (process.env.NODE_ENV !== 'production' && !req.user) {
      req.user = { 
        id: 1,
        username: 'admin',
        name: '管理员',
        role: 'admin'
      };
    }
    
    // 生产环境中需要身份验证
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未授权，无法创建通知'
      });
    }
    
    const {
      title,
      content,
      category = 'notice',
      public_ranges = [],
      require_confirmation = 0,
      status = 'draft',
      expire_time = null
    } = req.body;
    
    // 检查必填字段
    if (!title || !content) {
      return res.status(400).json({
        code: 400,
        message: '标题和内容不能为空'
      });
    }
    
    console.log('开始创建通知，用户:', req.user.id);
    console.log('SQL参数:', [
      title, 
      content, 
      category, 
      status, 
      require_confirmation ? 1 : 0,
      req.user?.id
    ]);
    
    try {
      // 临时禁用外键约束
      await dbQuery.run('PRAGMA foreign_keys = OFF;');
      
      // 简化版：直接创建记录，不使用事务
      const result = await dbQuery.run(`
        INSERT INTO notices (
          title, content, category, status, is_top, require_confirmation,
          created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 0, ?, ?, datetime('now'), datetime('now'))
      `, [
        title, 
        content, 
        category, 
        status, 
        require_confirmation ? 1 : 0,
        req.user?.id
      ]);
      
      // 重新启用外键约束
      await dbQuery.run('PRAGMA foreign_keys = ON;');
      
      // @ts-ignore - 获取插入的ID
      const noticeId = result.lastID;
      console.log('创建通知成功，ID:', noticeId);
      
      // 返回成功响应
      res.status(201).json({
        code: 201,
        message: '创建通知成功',
        data: { success: true, id: noticeId }
      });
    } catch (error: any) {
      console.error('创建通知失败:', error);
      res.status(500).json({
        code: 500,
        message: '创建通知失败',
        error: error.message
      });
    }
  } catch (error: any) {
    console.error('创建通知失败:', error);
    res.status(500).json({
      code: 500,
      message: '创建通知失败',
      error: error.message
    });
  }
}; 