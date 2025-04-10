import mongoose, { Schema, Document } from 'mongoose';

// 通知状态枚举
export enum NoticeStatus {
  DRAFT = 'draft',      // 草稿
  PENDING = 'pending',  // 待审核
  PUBLISHED = 'published', // 已发布
  REJECTED = 'rejected'  // 已拒绝
}

// 通知类型枚举
export enum NoticeType {
  ANNOUNCEMENT = 'announcement', // 公告
  NEWS = 'news',               // 新闻
  ACTIVITY = 'activity',       // 活动
  NOTICE = 'notice',           // 通知
  POLICY = 'policy'            // 政策
}

// 通知查询参数
export interface NoticeQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: NoticeStatus;
  type?: NoticeType;
  isPublic?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 创建通知请求
export interface CreateNoticeRequest {
  title: string;
  content: string;
  type: NoticeType;
  summary?: string;
  coverImage?: string;
  attachments?: string[];
  startDate?: Date;
  endDate?: Date;
  targetUsers?: string[];
}

// 更新通知请求
export interface UpdateNoticeRequest extends Partial<CreateNoticeRequest> {
  isAdmin?: boolean; // 标识是否为管理员操作
}

// 审核通知请求
export interface ReviewNoticeRequest {
  approved: boolean;
  rejectReason?: string;
}

// 通知接口
export interface INotice extends Document {
  title: string;
  content: string;
  summary?: string;
  type: NoticeType;
  status: NoticeStatus;
  coverImage?: string;
  attachments: string[];
  isTop: boolean;
  startDate?: Date;
  endDate?: Date;
  targetUsers: string[];
  confirmedUsers: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 通知Schema
const NoticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  type: { 
    type: String, 
    enum: Object.values(NoticeType),
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(NoticeStatus),
    default: NoticeStatus.DRAFT
  },
  coverImage: { type: String },
  attachments: [{ type: String }],
  isTop: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  targetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  confirmedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  rejectReason: { type: String },
}, {
  timestamps: true
});

// 索引
NoticeSchema.index({ title: 'text', content: 'text' });
NoticeSchema.index({ status: 1 });
NoticeSchema.index({ type: 1 });
NoticeSchema.index({ isTop: -1, createdAt: -1 });
NoticeSchema.index({ createdBy: 1 });

const Notice = mongoose.model<INotice>('Notice', NoticeSchema);

export default Notice; 