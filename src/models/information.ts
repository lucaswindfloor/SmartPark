import { Dayjs } from 'dayjs';

// 通用状态类型
export type Status = 'draft' | 'pending' | 'published' | 'rejected' | 'expired';

// 通知类别
export type NoticeCategory = 'notice' | 'announcement' | 'important';

// 公开范围
export type PublicRange = 'enterprise' | 'employee' | 'public';

// 通知公告
export interface Notice {
  id: number;
  title: string;
  content: string;
  category: NoticeCategory;
  publicRange: PublicRange[];
  status: Status;
  isTop: boolean;
  requireConfirmation: boolean;
  confirmCount: number;
  viewCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
}

// 政策文件
export interface Policy {
  id: number;
  title: string;
  content: string;
  policyNumber: string;
  issueDate: string;
  department: string;
  category: string;
  attachments?: string[];
  status: Status;
  viewCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 园区活动
export interface Activity {
  id: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  enrollCount: number;
  category: string;
  images?: string[];
  status: Status;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 活动参与者
export interface ActivityParticipant {
  id: number;
  activityId: number;
  userId: number;
  userName: string;
  userPhone: string;
  attendStatus: 'registered' | 'attended' | 'cancelled';
  registrationTime: string;
  checkInTime?: string;
  remark?: string;
}

// 调查问卷
export interface Survey {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isAnonymous: boolean;
  status: Status;
  responseCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questions?: SurveyQuestion[];
}

// 问卷问题
export interface SurveyQuestion {
  id: number;
  surveyId: number;
  questionType: 'single' | 'multiple' | 'text' | 'rating';
  questionText: string;
  required: boolean;
  sort: number;
  options?: SurveyOption[];
}

// 问卷选项
export interface SurveyOption {
  id: number;
  questionId: number;
  optionText: string;
  sort: number;
}

// 问卷回答
export interface SurveyResponse {
  id: number;
  surveyId: number;
  userId?: number;
  submitTime: string;
  answers: SurveyAnswer[];
}

// 问题答案
export interface SurveyAnswer {
  id: number;
  responseId: number;
  questionId: number;
  answerText?: string;
  optionIds?: number[];
  rating?: number;
}

// 问卷统计
export interface SurveyStats {
  surveyId: number;
  totalResponses: number;
  completeRate: number;
  questionStats: {
    questionId: number;
    questionText: string;
    optionStats?: {
      optionId: number;
      optionText: string;
      count: number;
      percentage: number;
    }[];
    textResponses?: string[];
    averageRating?: number;
  }[];
}

// 需求发布
export interface Demand {
  id: number;
  title: string;
  content: string;
  category: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  response?: string;
  respondent?: string;
  responseTime?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 创建或更新请求的通用参数类型
export interface QueryParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: Status;
  category?: NoticeCategory;
  startDate?: string;
  endDate?: string;
}

// 审核请求参数
export interface ReviewRequest {
  status: 'published' | 'rejected';
  reason?: string; // 拒绝原因
} 