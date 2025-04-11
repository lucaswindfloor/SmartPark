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
    
    // 构建查询
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
        n.updated_by,
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
      code: 200,
      message: '获取通知列表成功',
      data: {
        total,
        data: notices,
        page: Number(page),
        pageSize: limit
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
    
    // 使用事务确保数据一致性
    await dbQuery.transaction(async () => {
      // 创建通知记录
      const result = await dbQuery.run(`
        INSERT INTO notices (
          title, content, category, status, is_top, require_confirmation,
          created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, datetime('now'), datetime('now'))
      `, [
        title, 
        content, 
        category, 
        status, 
        require_confirmation ? 1 : 0,
        req.user?.id,
        req.user?.id
      ]);
      
      // @ts-ignore - 获取插入的ID
      const noticeId = result.lastID;
      console.log('创建通知成功，ID:', noticeId);
      
      // 插入公开范围
      if (public_ranges && public_ranges.length > 0) {
        for (const range of public_ranges) {
          await dbQuery.run(`
            INSERT INTO notice_public_ranges (notice_id, public_range)
            VALUES (?, ?)
          `, [noticeId, range]);
        }
      }
      
      // 返回创建的通知
      const notice = await dbQuery.get(`
        SELECT * FROM notices WHERE id = ?
      `, [noticeId]);
      
      return notice;
    });
    
    res.status(201).json({
      code: 201,
      message: '创建通知成功',
      data: { success: true }
    });
  } catch (error: any) {
    console.error('创建通知失败:', error);
    res.status(500).json({
      code: 500,
      message: '创建通知失败',
      error: error.message
    });
  }
};

/**
 * 更新通知
 */
export const updateNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      category,
      public_ranges,
      status,
      require_confirmation,
      expire_time
    } = req.body;
    
    // 检查通知是否存在
    const notice = await dbQuery.get(`SELECT * FROM notices WHERE id = ?`, [id]);
    if (!notice) {
      return res.status(404).json({
        code: 404,
        message: '通知不存在'
      });
    }
    
    // 构建更新字段
    const updateFields: string[] = [];
    const params: any[] = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      params.push(title);
    }
    
    if (content !== undefined) {
      updateFields.push('content = ?');
      params.push(content);
    }
    
    if (category !== undefined) {
      updateFields.push('category = ?');
      params.push(category);
    }
    
    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status);
    }
    
    if (require_confirmation !== undefined) {
      updateFields.push('require_confirmation = ?');
      params.push(require_confirmation ? 1 : 0);
    }
    
    if (expire_time !== undefined) {
      updateFields.push('expire_time = ?');
      params.push(expire_time);
    }
    
    updateFields.push('updated_at = datetime("now")');
    updateFields.push('updated_by = ?');
    params.push(req.user?.id || 1);
    
    // 使用事务确保数据一致性
    await dbQuery.transaction(async () => {
      // 更新通知
      if (updateFields.length > 0) {
        const query = `UPDATE notices SET ${updateFields.join(', ')} WHERE id = ?`;
        params.push(id);
        await dbQuery.run(query, params);
      }
      
      // 更新公开范围
      if (public_ranges && public_ranges.length > 0) {
        // 先删除所有旧的公开范围
        await dbQuery.run('DELETE FROM notice_public_ranges WHERE notice_id = ?', [id]);
        
        // 插入新的公开范围
        for (const range of public_ranges) {
          await dbQuery.run(`
            INSERT INTO notice_public_ranges (notice_id, public_range)
            VALUES (?, ?)
          `, [id, range]);
        }
      }
      
      return true;
    });
    
    res.json({
      code: 200,
      message: '更新通知成功',
      data: { success: true }
    });
  } catch (error: any) {
    console.error('更新通知失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新通知失败',
      error: error.message
    });
  }
};

/**
 * 删除通知
 */
export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 检查通知是否存在
    const notice = await dbQuery.get(`SELECT * FROM notices WHERE id = ?`, [id]);
    if (!notice) {
      return res.status(404).json({
        code: 404,
        message: '通知不存在'
      });
    }
    
    // 使用事务确保数据一致性
    await dbQuery.transaction(async () => {
      // 删除相关数据
      await dbQuery.run('DELETE FROM notice_public_ranges WHERE notice_id = ?', [id]);
      await dbQuery.run('DELETE FROM notice_views WHERE notice_id = ?', [id]);
      await dbQuery.run('DELETE FROM notice_confirmations WHERE notice_id = ?', [id]);
      
      // 删除通知
      await dbQuery.run('DELETE FROM notices WHERE id = ?', [id]);
      
      return true;
    });
    
    res.json({
      code: 200,
      message: '删除通知成功',
      data: { success: true }
    });
  } catch (error: any) {
    console.error('删除通知失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除通知失败',
      error: error.message
    });
  }
};

/**
 * 获取通知详情
 */
export const getNoticeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 获取通知详情
    const notice = await dbQuery.get(`
      SELECT 
        n.*,
        u.name as created_by_name,
        (SELECT COUNT(*) FROM notice_views WHERE notice_id = n.id) as view_count,
        (SELECT COUNT(*) FROM notice_confirmations WHERE notice_id = n.id) as confirm_count
      FROM notices n
      LEFT JOIN users u ON n.created_by = u.id
      WHERE n.id = ?
    `, [id]);
    
    if (!notice) {
      return res.status(404).json({
        code: 404,
        message: '通知不存在'
      });
    }
    
    // 获取通知的公开范围
    const rangesResult = await dbQuery.all(`
      SELECT public_range FROM notice_public_ranges WHERE notice_id = ?
    `, [id]);
    
    notice.public_ranges = rangesResult.map(r => r.public_range);
    
    // 记录查看次数
    if (req.user) {
      await dbQuery.run(`
        INSERT OR IGNORE INTO notice_views (notice_id, user_id, viewed_at)
        VALUES (?, ?, datetime('now'))
      `, [id, req.user.id]);
    }
    
    res.json({
      code: 200,
      message: '获取通知详情成功',
      data: notice
    });
  } catch (error: any) {
    console.error('获取通知详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取通知详情失败',
      error: error.message
    });
  }
};

/**
 * 提交通知到审核
 */
export const submitToReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 检查通知是否存在
    const notice = await dbQuery.get(`SELECT * FROM notices WHERE id = ?`, [id]);
    if (!notice) {
      return res.status(404).json({
        code: 404,
        message: '通知不存在'
      });
    }
    
    // 只有草稿状态的通知可以提交审核
    if (notice.status !== 'draft') {
      return res.status(400).json({
        code: 400,
        message: '只有草稿状态的通知可以提交审核'
      });
    }
    
    // 更新通知状态为待审核
    await dbQuery.run(`
      UPDATE notices
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `, ['pending', id]);
    
    res.json({
      code: 200,
      message: '提交审核成功',
      data: { success: true }
    });
  } catch (error: any) {
    console.error('提交通知审核失败:', error);
    res.status(500).json({
      code: 500,
      message: '提交通知审核失败',
      error: error.message
    });
  }
};

/**
 * 审核通知
 */
export const reviewNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body as ReviewNoticeRequest;
    
    // 检查通知是否存在
    const notice = await dbQuery.get(`SELECT * FROM notices WHERE id = ?`, [id]);
    if (!notice) {
      return res.status(404).json({
        code: 404,
        message: '通知不存在'
      });
    }
    
    // 只有待审核状态的通知可以审核
    if (notice.status !== 'pending') {
      return res.status(400).json({
        code: 400,
        message: '只有待审核状态的通知可以审核'
      });
    }
    
    // 构建更新字段
    const updateFields = [
      'status = ?',
      'reviewed_by = ?',
      'updated_at = datetime("now")'
    ];
    
    const updateParams: any[] = [status, req.user?.id || 1];
    
    // 如果拒绝，添加拒绝原因
    if (status === 'rejected' && comment) {
      updateFields.push('reject_reason = ?');
      updateParams.push(comment);
    } else if (status === 'published') {
      // 如果通过，设置发布时间
      updateFields.push('published_at = datetime("now")');
      // 清空拒绝原因
      updateFields.push('reject_reason = NULL');
    }
    
    // 添加ID参数
    updateParams.push(id);
    
    // 执行更新
    await dbQuery.run(`
      UPDATE notices
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateParams);
    
    res.json({
      code: 200,
      message: status === 'published' ? '通知审核通过并发布成功' : '通知审核已拒绝',
      data: { success: true }
    });
  } catch (error: any) {
    console.error('审核通知失败:', error);
    res.status(500).json({
      code: 500,
      message: '审核通知失败',
      error: error.message
    });
  }
};

/**
 * 切换通知置顶状态
 */
export const toggleNoticeTop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 检查通知是否存在
    const notice = await dbQuery.get(`SELECT * FROM notices WHERE id = ?`, [id]);
    if (!notice) {
      return res.status(404).json({
        code: 404,
        message: '通知不存在'
      });
    }
    
    // 只有已发布状态的通知可以置顶
    if (notice.status !== 'published') {
      return res.status(400).json({
        code: 400,
        message: '只有已发布状态的通知可以设置置顶'
      });
    }
    
    // 执行更新
    await dbQuery.run(`
      UPDATE notices
      SET is_top = ?, updated_at = datetime('now')
      WHERE id = ?
    `, [notice.is_top ? 0 : 1, id]);
    
    res.json({
      code: 200,
      message: notice.is_top ? '取消置顶成功' : '置顶成功',
      data: { success: true }
    });
  } catch (error: any) {
    console.error('切换通知置顶状态失败:', error);
    res.status(500).json({
      code: 500,
      message: '切换通知置顶状态失败',
      error: error.message
    });
  }
};

/**
 * 确认通知
 */
export const confirmNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 检查通知是否存在
    const notice = await dbQuery.get(`SELECT * FROM notices WHERE id = ?`, [id]);
    if (!notice) {
      return res.status(404).json({
        code: 404,
        message: '通知不存在'
      });
    }
    
    // 检查是否需要确认
    if (notice.require_confirmation !== 1) {
      return res.status(400).json({
        code: 400,
        message: '此通知不需要确认'
      });
    }
    
    // 检查用户是否已登录
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        code: 401,
        message: '请先登录'
      });
    }
    
    // 添加确认记录
    await dbQuery.run(`
      INSERT OR IGNORE INTO notice_confirmations (notice_id, user_id)
      VALUES (?, ?)
    `, [id, req.user.id]);
    
    res.json({
      code: 200,
      message: '确认通知成功',
      data: { success: true }
    });
  } catch (error: any) {
    console.error('确认通知失败:', error);
    res.status(500).json({
      code: 500,
      message: '确认通知失败',
      error: error.message
    });
  }
};

// 导出控制器函数
export default {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  submitToReview,
  reviewNotice,
  toggleNoticeTop,
  confirmNotice
}; 