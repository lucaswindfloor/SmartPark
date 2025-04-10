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
      const announcement = await this.service.create(req.body);
      res.status(201).json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 更新通知公告
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const announcement = await this.service.update(parseInt(id), req.body);
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
      await this.service.audit(parseInt(id), req.body);
      res.status(200).send();
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 发布通知公告
  publish = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.publish(parseInt(id));
      res.status(200).send();
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 置顶/取消置顶
  toggleTop = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.toggleTop(parseInt(id), req.body);
      res.status(200).send();
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
      const announcements = await this.service.getClientList(req.query);
      res.json(announcements);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 获取用户端详情
  getClientDetail = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const announcement = await this.service.getClientDetail(parseInt(id));
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 确认接收
  confirm = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.confirm(parseInt(id), req.body.userId);
      res.status(200).send();
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };

  // 标记已读
  markAsRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.markAsRead(parseInt(id), req.body.userId);
      res.status(200).send();
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  };
} 