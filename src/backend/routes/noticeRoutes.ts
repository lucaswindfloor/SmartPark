import { Router, RequestHandler } from 'express';
import * as noticeController from '../controllers/NoticeController';
import { getNotices, createNotice } from '../controllers/FixedNoticeController';

const router = Router();

// 获取通知列表(公开和授权用户都可以访问)
router.get('/', getNotices as RequestHandler);

// 获取通知详情(公开和授权用户都可以访问)
router.get('/:id', noticeController.getNoticeById as RequestHandler);

// 创建通知
router.post('/', createNotice as RequestHandler);

// 更新通知
router.put('/:id', noticeController.updateNotice as RequestHandler);

// 删除通知
router.delete('/:id', noticeController.deleteNotice as RequestHandler);

// 提交通知到审核
router.post('/:id/submit', noticeController.submitToReview as RequestHandler);

// 审核通知
router.post('/:id/review', noticeController.reviewNotice as RequestHandler);

// 切换通知置顶状态
router.post('/:id/toggle-top', noticeController.toggleNoticeTop as RequestHandler);

// 确认通知
router.post('/:id/confirm', noticeController.confirmNotice as RequestHandler);

export default router; 