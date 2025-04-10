import { dbQuery } from '../db/database';

// 定义常量
export enum NoticeStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}

export enum NoticeCategory {
  NOTICE = 'notice',
  ANNOUNCEMENT = 'announcement',
  IMPORTANT = 'important'
}

export enum PublicRange {
  ENTERPRISE = 'enterprise',
  EMPLOYEE = 'employee',
  PUBLIC = 'public'
}

// 接口定义
export interface Notice {
  id: number;
  title: string;
  content: string;
  category: NoticeCategory;
  status: NoticeStatus;
  is_top: number;
  require_confirmation: number;
  created_by: number;
  reviewed_by?: number;
  reject_reason?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  public_ranges?: PublicRange[];
  view_count?: number;
  confirm_count?: number;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  category: NoticeCategory;
  require_confirmation?: boolean;
  public_ranges: PublicRange[];
}

export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  category?: NoticeCategory;
  status?: NoticeStatus;
  require_confirmation?: boolean;
  public_ranges?: PublicRange[];
}

export interface ReviewNoticeRequest {
  status: 'published' | 'rejected';
  reject_reason?: string;
}

export interface NoticeQueryParams {
  page: number;
  page_size: number;
  keyword?: string;
  status?: NoticeStatus;
  category?: NoticeCategory;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

class NoticeService {
  /**
   * 获取通知公告列表（分页）
   */
  async getNotices(params: NoticeQueryParams): Promise<PaginatedResult<Notice>> {
    try {
      const {
        page = 1,
        page_size = 10,
        keyword,
        status,
        category,
        start_date,
        end_date
      } = params;

      // 构建查询条件
      const conditions: string[] = [];
      const queryParams: any[] = [];

      if (keyword) {
        conditions.push('(n.title LIKE ? OR n.content LIKE ?)');
        queryParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      if (status) {
        conditions.push('n.status = ?');
        queryParams.push(status);
      }

      if (category) {
        conditions.push('n.category = ?');
        queryParams.push(category);
      }

      if (start_date) {
        conditions.push('DATE(n.created_at) >= DATE(?)');
        queryParams.push(start_date);
      }

      if (end_date) {
        conditions.push('DATE(n.created_at) <= DATE(?)');
        queryParams.push(end_date);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // 计算总数
      const countQuery = `
        SELECT COUNT(*) as total
        FROM notices n
        ${whereClause}
      `;
      
      const countResult = await dbQuery.get<{ total: number }>(countQuery, queryParams);
      const total = countResult?.total || 0;

      // 没有记录提前返回
      if (total === 0) {
        return {
          data: [],
          total: 0,
          page,
          page_size,
          total_pages: 0
        };
      }

      // 计算分页
      const offset = (page - 1) * page_size;
      const total_pages = Math.ceil(total / page_size);

      // 获取主数据
      const query = `
        SELECT 
          n.*,
          (SELECT COUNT(*) FROM notice_views WHERE notice_id = n.id) AS view_count,
          (SELECT COUNT(*) FROM notice_confirmations WHERE notice_id = n.id) AS confirm_count
        FROM notices n
        ${whereClause}
        ORDER BY n.is_top DESC, n.created_at DESC
        LIMIT ? OFFSET ?
      `;

      // 执行查询
      const notices = await dbQuery.all<Notice>(query, [...queryParams, page_size, offset]);

      // 获取每个通知的公开范围
      for (const notice of notices) {
        const rangesQuery = `
          SELECT public_range
          FROM notice_public_ranges
          WHERE notice_id = ?
        `;
        const ranges = await dbQuery.all<{ public_range: PublicRange }>(rangesQuery, [notice.id]);
        notice.public_ranges = ranges.map(r => r.public_range);
      }

      return {
        data: notices,
        total,
        page,
        page_size,
        total_pages
      };
    } catch (error) {
      console.error('获取通知列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取通知公告详情
   */
  async getNoticeById(id: number): Promise<Notice | null> {
    try {
      const query = `
        SELECT 
          n.*,
          (SELECT COUNT(*) FROM notice_views WHERE notice_id = n.id) AS view_count,
          (SELECT COUNT(*) FROM notice_confirmations WHERE notice_id = n.id) AS confirm_count
        FROM notices n
        WHERE n.id = ?
      `;
      
      const notice = await dbQuery.get<Notice>(query, [id]);
      
      if (!notice) {
        return null;
      }

      // 获取公开范围
      const rangesQuery = `
        SELECT public_range
        FROM notice_public_ranges
        WHERE notice_id = ?
      `;
      const ranges = await dbQuery.all<{ public_range: PublicRange }>(rangesQuery, [id]);
      notice.public_ranges = ranges.map(r => r.public_range);
      
      return notice;
    } catch (error) {
      console.error(`获取通知ID=${id}详情失败:`, error);
      throw error;
    }
  }

  /**
   * 创建通知公告
   */
  async createNotice(data: CreateNoticeRequest, userId: number): Promise<Notice> {
    try {
      return await dbQuery.transaction(async () => {
        // 插入通知基本信息
        const { title, content, category, require_confirmation } = data;
        const result = await dbQuery.run(`
          INSERT INTO notices (
            title, content, category, status, is_top, require_confirmation, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          title, 
          content, 
          category, 
          'draft' as NoticeStatus, 
          0, 
          require_confirmation ? 1 : 0, 
          userId
        ]);
        
        // 获取新插入的ID
        const noticeId = (result as any).lastID;
        
        // 插入公开范围
        for (const range of data.public_ranges) {
          await dbQuery.run(`
            INSERT INTO notice_public_ranges (notice_id, public_range)
            VALUES (?, ?)
          `, [noticeId, range]);
        }
        
        // 获取完整通知信息
        const newNotice = await this.getNoticeById(noticeId);
        if (!newNotice) {
          throw new Error('创建通知失败，无法获取新通知信息');
        }
        
        return newNotice;
      });
    } catch (error) {
      console.error('创建通知失败:', error);
      throw error;
    }
  }

  /**
   * 更新通知公告
   */
  async updateNotice(id: number, data: UpdateNoticeRequest, userId: number): Promise<Notice> {
    try {
      // 获取原有通知信息
      const existingNotice = await this.getNoticeById(id);
      if (!existingNotice) {
        throw new Error('通知不存在');
      }
      
      // 只有草稿状态或被拒绝状态的通知可以编辑内容
      const canEditContent = existingNotice.status === 'draft' || existingNotice.status === 'rejected';
      
      return await dbQuery.transaction(async () => {
        // 准备更新字段
        const updateFields: string[] = [];
        const updateParams: any[] = [];
        
        if (canEditContent && data.title !== undefined) {
          updateFields.push('title = ?');
          updateParams.push(data.title);
        }
        
        if (canEditContent && data.content !== undefined) {
          updateFields.push('content = ?');
          updateParams.push(data.content);
        }
        
        if (canEditContent && data.category !== undefined) {
          updateFields.push('category = ?');
          updateParams.push(data.category);
        }
        
        if (canEditContent && data.require_confirmation !== undefined) {
          updateFields.push('require_confirmation = ?');
          updateParams.push(data.require_confirmation ? 1 : 0);
        }
        
        if (data.status !== undefined) {
          updateFields.push('status = ?');
          updateParams.push(data.status);
          
          // 如果状态更新为已发布，则设置发布时间
          if (data.status === 'published') {
            updateFields.push('published_at = CURRENT_TIMESTAMP');
          }
        }
        
        // 至少要有一个字段更新
        if (updateFields.length === 0) {
          return existingNotice;
        }
        
        // 添加更新时间和参数
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateParams.push(id); // WHERE id = ?
        
        // 执行更新
        await dbQuery.run(`
          UPDATE notices
          SET ${updateFields.join(', ')}
          WHERE id = ?
        `, updateParams);
        
        // 如果需要更新公开范围
        if (canEditContent && data.public_ranges !== undefined) {
          // 删除原有公开范围
          await dbQuery.run('DELETE FROM notice_public_ranges WHERE notice_id = ?', [id]);
          
          // 添加新的公开范围
          for (const range of data.public_ranges) {
            await dbQuery.run(`
              INSERT INTO notice_public_ranges (notice_id, public_range)
              VALUES (?, ?)
            `, [id, range]);
          }
        }
        
        // 获取更新后的通知信息
        const updatedNotice = await this.getNoticeById(id);
        if (!updatedNotice) {
          throw new Error('更新通知失败，无法获取更新后的通知信息');
        }
        
        return updatedNotice;
      });
    } catch (error) {
      console.error(`更新通知ID=${id}失败:`, error);
      throw error;
    }
  }

  /**
   * 审核通知公告
   */
  async reviewNotice(id: number, data: ReviewNoticeRequest, reviewerId: number): Promise<Notice> {
    try {
      // 获取原有通知信息
      const existingNotice = await this.getNoticeById(id);
      if (!existingNotice) {
        throw new Error('通知不存在');
      }
      
      // 只有待审核状态的通知可以审核
      if (existingNotice.status !== 'pending') {
        throw new Error('只有待审核状态的通知可以审核');
      }
      
      return await dbQuery.transaction(async () => {
        const { status, reject_reason } = data;
        
        // 构建更新参数
        const updateFields = [
          'status = ?',
          'reviewed_by = ?',
          'updated_at = CURRENT_TIMESTAMP'
        ];
        
        const updateParams: any[] = [status, reviewerId];
        
        // 如果拒绝，添加拒绝原因
        if (status === 'rejected' && reject_reason) {
          updateFields.push('reject_reason = ?');
          updateParams.push(reject_reason as any);
        } else if (status === 'published') {
          // 如果通过，设置发布时间
          updateFields.push('published_at = CURRENT_TIMESTAMP');
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
        
        // 获取更新后的通知信息
        const updatedNotice = await this.getNoticeById(id);
        if (!updatedNotice) {
          throw new Error('审核通知失败，无法获取更新后的通知信息');
        }
        
        return updatedNotice;
      });
    } catch (error) {
      console.error(`审核通知ID=${id}失败:`, error);
      throw error;
    }
  }

  /**
   * 切换通知置顶状态
   */
  async toggleNoticeTop(id: number): Promise<Notice> {
    try {
      // 获取原有通知信息
      const existingNotice = await this.getNoticeById(id);
      if (!existingNotice) {
        throw new Error('通知不存在');
      }
      
      // 只有已发布状态的通知可以置顶
      if (existingNotice.status !== 'published') {
        throw new Error('只有已发布状态的通知可以设置置顶');
      }
      
      // 执行更新
      await dbQuery.run(`
        UPDATE notices
        SET is_top = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [existingNotice.is_top ? 0 : 1, id]);
      
      // 获取更新后的通知信息
      const updatedNotice = await this.getNoticeById(id);
      if (!updatedNotice) {
        throw new Error('切换置顶状态失败，无法获取更新后的通知信息');
      }
      
      return updatedNotice;
    } catch (error) {
      console.error(`切换通知ID=${id}置顶状态失败:`, error);
      throw error;
    }
  }

  /**
   * 删除通知公告
   */
  async deleteNotice(id: number): Promise<boolean> {
    try {
      // 获取原有通知信息
      const existingNotice = await this.getNoticeById(id);
      if (!existingNotice) {
        throw new Error('通知不存在');
      }
      
      // 已发布的通知不能删除
      if (existingNotice.status === 'published') {
        throw new Error('已发布的通知不能删除');
      }
      
      // 执行删除（级联删除关联表数据）
      await dbQuery.run('DELETE FROM notices WHERE id = ?', [id]);
      
      return true;
    } catch (error) {
      console.error(`删除通知ID=${id}失败:`, error);
      throw error;
    }
  }

  /**
   * 记录通知查看
   */
  async recordNoticeView(noticeId: number, userId: number): Promise<void> {
    try {
      // 先检查是否已经查看过
      const existingView = await dbQuery.get(`
        SELECT id FROM notice_views
        WHERE notice_id = ? AND user_id = ?
      `, [noticeId, userId]);
      
      // 如果没有查看过，添加查看记录
      if (!existingView) {
        await dbQuery.run(`
          INSERT INTO notice_views (notice_id, user_id)
          VALUES (?, ?)
        `, [noticeId, userId]);
      }
    } catch (error) {
      console.error(`记录通知ID=${noticeId}查看失败:`, error);
      throw error;
    }
  }

  /**
   * 记录通知确认
   */
  async confirmNotice(noticeId: number, userId: number): Promise<void> {
    try {
      // 先检查通知是否需要确认
      const notice = await this.getNoticeById(noticeId);
      if (!notice) {
        throw new Error('通知不存在');
      }
      
      if (notice.require_confirmation !== 1) {
        throw new Error('此通知不需要确认');
      }
      
      // 先检查是否已经确认过
      const existingConfirmation = await dbQuery.get(`
        SELECT id FROM notice_confirmations
        WHERE notice_id = ? AND user_id = ?
      `, [noticeId, userId]);
      
      // 如果没有确认过，添加确认记录
      if (!existingConfirmation) {
        await dbQuery.run(`
          INSERT INTO notice_confirmations (notice_id, user_id)
          VALUES (?, ?)
        `, [noticeId, userId]);
      }
      
      // 同时记录查看
      await this.recordNoticeView(noticeId, userId);
    } catch (error) {
      console.error(`确认通知ID=${noticeId}失败:`, error);
      throw error;
    }
  }

  /**
   * 提交通知到审核
   */
  async submitToReview(id: number, userId: number): Promise<Notice> {
    try {
      // 获取原有通知信息
      const existingNotice = await this.getNoticeById(id);
      if (!existingNotice) {
        throw new Error('通知不存在');
      }
      
      // 只有草稿状态的通知可以提交审核
      if (existingNotice.status !== 'draft') {
        throw new Error('只有草稿状态的通知可以提交审核');
      }
      
      // 执行更新
      return await this.updateNotice(id, { status: NoticeStatus.PENDING }, userId);
    } catch (error) {
      console.error(`提交通知ID=${id}审核失败:`, error);
      throw error;
    }
  }
}

export default new NoticeService(); 