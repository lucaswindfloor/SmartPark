/**
 * 通知公告相关类型定义
 */

/**
 * 通知状态枚举
 */
export enum NoticeStatus {
  DRAFT = 'draft',         // 草稿
  REVIEWING = 'reviewing', // 审核中
  PUBLISHED = 'published', // 已发布
  REJECTED = 'rejected',   // 已拒绝
  EXPIRED = 'expired',     // 已过期
  ARCHIVED = 'archived'    // 已归档
}

/**
 * 通知类型枚举
 */
export enum NoticeType {
  NOTICE = 'notice',       // 公告
  NEWS = 'news',           // 新闻
  EVENT = 'event',         // 活动
  ALERT = 'alert'          // 提醒
}

/**
 * 通知公开范围类型
 */
export type NoticePublicRange = 'all' | 'tenant' | 'property' | 'department' | string;

/**
 * 通知基础接口
 */
export interface INotice {
  id?: number;
  title: string;
  content: string;
  category: string;
  status: NoticeStatus | string;
  is_top: boolean | number;
  require_confirmation: boolean | number;
  public_ranges?: NoticePublicRange[];
  attachments?: string[];
  cover?: string;
  view_count?: number;
  confirm_count?: number;
  publish_time?: string | null;
  expire_time?: string | null;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  reviewed_by?: number;
  review_time?: string | null;
  review_comment?: string | null;
  created_by_name?: string;
}

/**
 * 创建通知请求接口
 */
export interface CreateNoticeRequest {
  title: string;
  content: string;
  category?: string;
  public_ranges?: NoticePublicRange[];
  attachments?: string[];
  cover?: string;
  require_confirmation?: boolean | number;
  status?: NoticeStatus | string;
  expire_time?: string | null;
}

/**
 * 更新通知请求接口
 */
export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  category?: string;
  public_ranges?: NoticePublicRange[];
  attachments?: string[];
  cover?: string;
  require_confirmation?: boolean | number;
  status?: NoticeStatus | string;
  expire_time?: string | null;
}

/**
 * 查询通知参数接口
 */
export interface NoticeQueryParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  status?: NoticeStatus | string;
  category?: NoticeType | string;
  start_date?: string;
  end_date?: string;
}

/**
 * 通知审核请求接口
 */
export interface ReviewNoticeRequest {
  status: 'published' | 'rejected';
  comment?: string;
} 