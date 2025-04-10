import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';

const router = Router();
const controller = new AnnouncementController();

// 管理端接口
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/audit', controller.audit);
router.post('/:id/publish', controller.publish);
router.post('/:id/top', controller.toggleTop);
router.get('/', controller.getList);
router.get('/:id', controller.getDetail);
router.get('/:id/stats', controller.getStats);

// 用户端接口
router.get('/client/list', controller.getClientList);
router.get('/client/:id', controller.getClientDetail);
router.post('/client/:id/confirm', controller.confirm);
router.post('/client/:id/read', controller.markAsRead);

export const announcementRoutes = router; 