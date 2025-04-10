import { Router } from 'express';
import NoticeController from '../controllers/NoticeController';

const router = Router();

// 获取通知列表(公开和授权用户都可以访问)
router.get('/', NoticeController.getNotices);

// 获取通知详情(公开和授权用户都可以访问)
router.get('/:id', NoticeController.getNoticeById);

// 创建通知
router.post('/', NoticeController.createNotice);

// 更新通知
router.put('/:id', NoticeController.updateNotice);

// 删除通知
router.delete('/:id', NoticeController.deleteNotice);

// 提交通知到审核
router.post('/:id/submit', NoticeController.submitToReview);

// 审核通知
router.post('/:id/review', NoticeController.reviewNotice);

// 切换通知置顶状态
router.post('/:id/toggle-top', NoticeController.toggleNoticeTop);

// 确认通知
router.post('/:id/confirm', NoticeController.confirmNotice);

export default router; 