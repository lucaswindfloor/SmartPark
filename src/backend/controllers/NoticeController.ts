import { Request, Response } from 'express';
import NoticeService from '../services/NoticeService';
import { 
  CreateNoticeRequest, 
  UpdateNoticeRequest, 
  ReviewNoticeRequest, 
  NoticeQueryParams
} from '../services/NoticeService';

/**
 * 通知公告控制器
 */
class NoticeController {
  /**
   * 获取通知公告列表
   */
  async getNotices(req: Request, res: Response): Promise<void> {
    try {
      const params: NoticeQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        page_size: req.query.page_size ? parseInt(req.query.page_size as string, 10) : 10,
        keyword: req.query.keyword as string,
        status: req.query.status as any,
        category: req.query.category as any,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
      };

      const result = await NoticeService.getNotices(params);

      res.json({
        code: 0,
        message: '获取通知列表成功',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '获取通知列表失败',
        error: error.message
      });
    }
  }

  /**
   * 获取通知公告详情
   */
  async getNoticeById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      // 记录查看
      if (req.user && req.user.id) {
        await NoticeService.recordNoticeView(id, req.user.id);
      }
      
      const notice = await NoticeService.getNoticeById(id);
      
      if (!notice) {
        res.status(404).json({
          code: 404,
          message: '通知不存在'
        });
        return;
      }
      
      res.json({
        code: 0,
        message: '获取通知详情成功',
        data: notice
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '获取通知详情失败',
        error: error.message
      });
    }
  }

  /**
   * 创建通知公告
   */
  async createNotice(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateNoticeRequest = req.body;
      
      if (!req.user || !req.user.id) {
        res.status(401).json({
          code: 401,
          message: '未授权，无法创建通知'
        });
        return;
      }
      
      const notice = await NoticeService.createNotice(data, req.user.id);
      
      res.status(201).json({
        code: 0,
        message: '创建通知成功',
        data: notice
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '创建通知失败',
        error: error.message
      });
    }
  }

  /**
   * 更新通知公告
   */
  async updateNotice(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const data: UpdateNoticeRequest = req.body;
      
      if (!req.user || !req.user.id) {
        res.status(401).json({
          code: 401,
          message: '未授权，无法更新通知'
        });
        return;
      }
      
      const notice = await NoticeService.updateNotice(id, data, req.user.id);
      
      res.json({
        code: 0,
        message: '更新通知成功',
        data: notice
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '更新通知失败',
        error: error.message
      });
    }
  }

  /**
   * 删除通知公告
   */
  async deleteNotice(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      // 权限检查 - 只有管理员可以删除
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        res.status(403).json({
          code: 403,
          message: '权限不足，不能删除通知'
        });
        return;
      }
      
      await NoticeService.deleteNotice(id);
      
      res.json({
        code: 0,
        message: '删除通知成功'
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '删除通知失败',
        error: error.message
      });
    }
  }

  /**
   * 提交通知到审核
   */
  async submitToReview(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (!req.user || !req.user.id) {
        res.status(401).json({
          code: 401,
          message: '未授权，无法提交审核'
        });
        return;
      }
      
      const notice = await NoticeService.submitToReview(id, req.user.id);
      
      res.json({
        code: 0,
        message: '提交审核成功',
        data: notice
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '提交审核失败',
        error: error.message
      });
    }
  }

  /**
   * 审核通知公告
   */
  async reviewNotice(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const data: ReviewNoticeRequest = req.body;
      
      // 权限检查 - 只有管理员可以审核
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        res.status(403).json({
          code: 403,
          message: '权限不足，不能审核通知'
        });
        return;
      }
      
      if (!req.user.id) {
        res.status(401).json({
          code: 401,
          message: '未授权，无法审核通知'
        });
        return;
      }
      
      const notice = await NoticeService.reviewNotice(id, data, req.user.id);
      
      res.json({
        code: 0,
        message: data.status === 'published' ? '通知审核通过并发布成功' : '通知审核已拒绝',
        data: notice
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '审核通知失败',
        error: error.message
      });
    }
  }

  /**
   * 切换通知置顶状态
   */
  async toggleNoticeTop(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      // 权限检查 - 只有管理员可以切换置顶
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        res.status(403).json({
          code: 403,
          message: '权限不足，不能设置置顶状态'
        });
        return;
      }
      
      const notice = await NoticeService.toggleNoticeTop(id);
      
      res.json({
        code: 0,
        message: notice.is_top ? '通知置顶成功' : '取消通知置顶成功',
        data: notice
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '切换通知置顶状态失败',
        error: error.message
      });
    }
  }

  /**
   * 确认通知
   */
  async confirmNotice(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (!req.user || !req.user.id) {
        res.status(401).json({
          code: 401,
          message: '未授权，无法确认通知'
        });
        return;
      }
      
      await NoticeService.confirmNotice(id, req.user.id);
      
      res.json({
        code: 0,
        message: '确认通知成功'
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: '确认通知失败',
        error: error.message
      });
    }
  }
}

export default new NoticeController(); 