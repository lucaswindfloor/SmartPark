import { AppDataSource } from '../app';
import { Announcement } from '../models/announcement.entity';
import { AnnouncementView } from '../models/announcement-view.entity';
import { AnnouncementConfirm } from '../models/announcement-confirm.entity';
import { AnnouncementAudit } from '../models/announcement-audit.entity';
import { AnnouncementVisibility } from '../models/announcement-visibility.entity';

export class AnnouncementService {
  private announcementRepository = AppDataSource.getRepository(Announcement);
  private viewRepository = AppDataSource.getRepository(AnnouncementView);
  private confirmRepository = AppDataSource.getRepository(AnnouncementConfirm);
  private auditRepository = AppDataSource.getRepository(AnnouncementAudit);
  private visibilityRepository = AppDataSource.getRepository(AnnouncementVisibility);

  // 创建通知公告
  async create(data: any) {
    // 开启事务
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { visibilityRanges, ...announcementData } = data;
      
      // 创建通知公告
      const announcement = this.announcementRepository.create({
        ...announcementData,
        status: 0, // 草稿状态
      });
      const savedAnnouncement = await queryRunner.manager.save(announcement);

      // 保存可见范围
      if (visibilityRanges && Array.isArray(visibilityRanges)) {
        for (const range of visibilityRanges) {
          const visibility = this.visibilityRepository.create({
            announcementId: savedAnnouncement.id,
            visibilityType: range
          });
          await queryRunner.manager.save(visibility);
        }
      }

      await queryRunner.commitTransaction();
      return savedAnnouncement;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 更新通知公告
  async update(id: number, data: any) {
    // 开启事务
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { visibilityRanges, ...announcementData } = data;
      
      // 更新通知公告
      await queryRunner.manager.update(Announcement, id, announcementData);

      // 如果提供了新的可见范围
      if (visibilityRanges && Array.isArray(visibilityRanges)) {
        // 删除现有可见范围
        await queryRunner.manager.delete(AnnouncementVisibility, { announcementId: id });

        // 保存新的可见范围
        for (const range of visibilityRanges) {
          const visibility = this.visibilityRepository.create({
            announcementId: id,
            visibilityType: range
          });
          await queryRunner.manager.save(visibility);
        }
      }

      await queryRunner.commitTransaction();
      return await this.announcementRepository.findOne({ where: { id } });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
      await this.announcementRepository.update(id, { status: 1 }); // 待发布状态
    } else if (action === 3) { // 审核拒绝
      await this.announcementRepository.update(id, { status: 0 }); // 退回草稿状态
    }
  }

  // 发布通知公告
  async publish(id: number, publisherId: number) {
    await this.announcementRepository.update(id, {
      status: 2, // 已发布状态
      publishedAt: new Date(),
      publishedBy: publisherId
    });
  }

  // 置顶/取消置顶
  async toggleTop(id: number, data: any) {
    const { isTop, topExpireTime } = data;
    await this.announcementRepository.update(id, {
      isTop,
      topExpireTime
    });
  }

  // 获取列表
  async getList(query: any) {
    const { page = 1, pageSize = 10, title, status, ...filters } = query;
    
    // 构建查询条件
    const where: any = { ...filters };
    
    if (title) {
      where.title = title;
    }
    
    if (status !== undefined) {
      where.status = status;
    }
    
    const [items, total] = await this.announcementRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        isTop: 'DESC',
        createdAt: 'DESC'
      }
    });

    // 获取每个通知的可见范围
    const announcements = await Promise.all(
      items.map(async (item) => {
        const visibilities = await this.visibilityRepository.find({
          where: { announcementId: item.id }
        });
        return {
          ...item,
          visibilityRanges: visibilities.map(v => v.visibilityType)
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

  // 获取详情
  async getDetail(id: number) {
    const announcement = await this.announcementRepository.findOne({ where: { id } });
    
    if (!announcement) {
      return null;
    }
    
    // 获取可见范围
    const visibilities = await this.visibilityRepository.find({
      where: { announcementId: id }
    });
    
    return {
      ...announcement,
      visibilityRanges: visibilities.map(v => v.visibilityType)
    };
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
    const { userId, userRole, page = 1, pageSize = 10 } = query;
    
    // 查询已发布的通知公告
    const qb = this.announcementRepository.createQueryBuilder('a')
      .where('a.status = :status', { status: 2 }) // 已发布状态
      .orderBy('a.isTop', 'DESC')
      .addOrderBy('a.publishedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    // 根据用户角色过滤可见性
    if (userRole) {
      // 查询该用户角色可见的通知
      qb.innerJoin(
        'announcement_visibilities',
        'av',
        'a.id = av.announcementId AND av.visibilityType = :userRole',
        { userRole }
      );
    }
    
    const [items, total] = await qb.getManyAndCount();

    // 获取已读状态
    const announcements = await Promise.all(
      items.map(async (item) => {
        // 判断是否已读
        const viewed = userId ? await this.viewRepository.findOne({
          where: { announcementId: item.id, userId }
        }) : null;
        
        // 判断是否需要确认
        const confirmed = (userId && item.needConfirm) ? await this.confirmRepository.findOne({
          where: { announcementId: item.id, userId }
        }) : null;
        
        // 获取可见范围
        const visibilities = await this.visibilityRepository.find({
          where: { announcementId: item.id }
        });
        
        return {
          ...item,
          isNew: !viewed,
          needConfirm: item.needConfirm,
          isConfirmed: !!confirmed,
          visibilityRanges: visibilities.map(v => v.visibilityType)
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
  async getClientDetail(id: number, userId?: number) {
    const announcement = await this.announcementRepository.findOne({ where: { id } });
    
    if (!announcement) {
      return null;
    }
    
    // 获取可见范围
    const visibilities = await this.visibilityRepository.find({
      where: { announcementId: id }
    });
    
    // 如果提供了用户ID，自动标记为已读
    if (userId) {
      await this.markAsRead(id, userId);
    }
    
    return {
      ...announcement,
      visibilityRanges: visibilities.map(v => v.visibilityType)
    };
  }

  // 确认接收
  async confirm(id: number, userId: number) {
    // 检查是否已确认
    const existingConfirm = await this.confirmRepository.findOne({
      where: { announcementId: id, userId }
    });
    
    if (existingConfirm) {
      return;
    }
    
    const confirm = this.confirmRepository.create({
      announcementId: id,
      userId
    });
    await this.confirmRepository.save(confirm);
  }

  // 标记已读
  async markAsRead(id: number, userId: number) {
    // 检查是否已读
    const existingView = await this.viewRepository.findOne({
      where: { announcementId: id, userId }
    });
    
    if (existingView) {
      return;
    }
    
    const view = this.viewRepository.create({
      announcementId: id,
      userId
    });
    await this.viewRepository.save(view);
  }
} 