import { AppDataSource } from '../app';
import { Announcement } from '../models/announcement.entity';
import { AnnouncementView } from '../models/announcement-view.entity';
import { AnnouncementConfirm } from '../models/announcement-confirm.entity';
import { AnnouncementAudit } from '../models/announcement-audit.entity';

export class AnnouncementService {
  private announcementRepository = AppDataSource.getRepository(Announcement);
  private viewRepository = AppDataSource.getRepository(AnnouncementView);
  private confirmRepository = AppDataSource.getRepository(AnnouncementConfirm);
  private auditRepository = AppDataSource.getRepository(AnnouncementAudit);

  // 创建通知公告
  async create(data: any) {
    const announcement = this.announcementRepository.create(data);
    return await this.announcementRepository.save(announcement);
  }

  // 更新通知公告
  async update(id: number, data: any) {
    await this.announcementRepository.update(id, data);
    return await this.announcementRepository.findOne({ where: { id } });
  }

  // 删除通知公告
  async delete(id: number) {
    await this.announcementRepository.delete(id);
  }

  // 审核通知公告
  async audit(id: number, data: any) {
    const { action, comment, auditorId } = data;
    const audit = this.auditRepository.create({
      announcementId: id,
      auditorId,
      action,
      comment
    });
    await this.auditRepository.save(audit);

    if (action === 2) { // 审核通过
      await this.announcementRepository.update(id, { status: 2 });
    } else if (action === 3) { // 审核拒绝
      await this.announcementRepository.update(id, { status: 0 });
    }
  }

  // 发布通知公告
  async publish(id: number) {
    await this.announcementRepository.update(id, {
      status: 2,
      publishedAt: new Date()
    });
  }

  // 置顶/取消置顶
  async toggleTop(id: number, data: any) {
    const { isTop, expireTime } = data;
    await this.announcementRepository.update(id, {
      isTop,
      topExpireTime: expireTime
    });
  }

  // 获取列表
  async getList(query: any) {
    const { page = 1, pageSize = 10, ...filters } = query;
    const [items, total] = await this.announcementRepository.findAndCount({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        isTop: 'DESC',
        createdAt: 'DESC'
      }
    });

    return {
      items,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    };
  }

  // 获取详情
  async getDetail(id: number) {
    return await this.announcementRepository.findOne({ where: { id } });
  }

  // 获取统计数据
  async getStats(id: number) {
    const viewCount = await this.viewRepository.count({ where: { announcementId: id } });
    const confirmCount = await this.confirmRepository.count({ where: { announcementId: id } });

    return {
      viewCount,
      confirmCount
    };
  }

  // 获取用户端列表
  async getClientList(query: any) {
    const { userId, page = 1, pageSize = 10 } = query;
    
    // 基于用户权限和公开范围筛选
    const [items, total] = await this.announcementRepository.findAndCount({
      where: {
        status: 2, // 已发布
        // TODO: 添加可见性过滤
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        isTop: 'DESC',
        publishedAt: 'DESC'
      }
    });

    // 获取已读状态
    const announcements = await Promise.all(
      items.map(async (item) => {
        const viewed = await this.viewRepository.findOne({
          where: { announcementId: item.id, userId }
        });
        return {
          ...item,
          isNew: !viewed
        };
      })
    );

    return {
      items: announcements,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    };
  }

  // 获取用户端详情
  async getClientDetail(id: number) {
    return await this.announcementRepository.findOne({ where: { id } });
  }

  // 确认接收
  async confirm(id: number, userId: number) {
    const confirm = this.confirmRepository.create({
      announcementId: id,
      userId
    });
    await this.confirmRepository.save(confirm);
  }

  // 标记已读
  async markAsRead(id: number, userId: number) {
    const view = this.viewRepository.create({
      announcementId: id,
      userId
    });
    await this.viewRepository.save(view);
  }
} 