import { Request, Response } from 'express';
import { AnnouncementService } from '../services/announcement.service';

export class AnnouncementController {
  private service: AnnouncementService;

  constructor() {
    this.service = new AnnouncementService();
  }

  // 创建通知公告
  create = async (req: Request, res: Response) => {
    try {
      const data = {
        ...req.body,
        createdBy: req.user?.id
      };
      const announcement = await this.service.create(data);
      res.status(201).json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 更新通知公告
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = {
        ...req.body,
        updatedBy: req.user?.id
      };
      const announcement = await this.service.update(parseInt(id), data);
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 删除通知公告
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.delete(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 审核通知公告
  audit = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const auditData = {
        ...req.body,
        auditorId: req.user?.id
      };
      await this.service.audit(parseInt(id), auditData);
      res.status(200).json({ message: '审核操作成功' });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 发布通知公告
  publish = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const publisherId = req.user?.id || 0; // 提供默认值防止undefined
      await this.service.publish(parseInt(id), publisherId);
      res.status(200).json({ message: '发布成功' });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 置顶/取消置顶
  toggleTop = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.toggleTop(parseInt(id), req.body);
      res.status(200).json({ message: req.body.isTop ? '置顶成功' : '取消置顶成功' });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 获取列表
  getList = async (req: Request, res: Response) => {
    try {
      const announcements = await this.service.getList(req.query);
      res.json(announcements);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 获取详情
  getDetail = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const announcement = await this.service.getDetail(parseInt(id));
      
      if (!announcement) {
        return res.status(404).json({ message: '通知公告不存在' });
      }
      
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 获取统计数据
  getStats = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stats = await this.service.getStats(parseInt(id));
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 获取用户端列表
  getClientList = async (req: Request, res: Response) => {
    try {
      const query = {
        ...req.query,
        userId: req.user?.id,
        userRole: req.user?.role
      };
      const announcements = await this.service.getClientList(query);
      res.json(announcements);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 获取用户端详情
  getClientDetail = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const announcement = await this.service.getClientDetail(parseInt(id), req.user?.id);
      
      if (!announcement) {
        return res.status(404).json({ message: '通知公告不存在' });
      }
      
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 确认接收
  confirm = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: '请先登录' });
      }
      
      await this.service.confirm(parseInt(id), userId);
      res.status(200).json({ message: '确认接收成功' });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 标记已读
  markAsRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: '请先登录' });
      }
      
      await this.service.markAsRead(parseInt(id), userId);
      res.status(200).json({ message: '标记已读成功' });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };
} 