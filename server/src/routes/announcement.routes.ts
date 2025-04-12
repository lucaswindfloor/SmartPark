import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';
import { permissionMiddleware } from '../middleware/permission.middleware';
import { AnnouncementPermission } from '../utils/permissions';

const router = Router();
const controller = new AnnouncementController();

// 管理端接口 - 需要权限验证
router.post('/', permissionMiddleware(AnnouncementPermission.CREATE), controller.create);
router.put('/:id', permissionMiddleware(AnnouncementPermission.UPDATE), controller.update);
router.delete('/:id', permissionMiddleware(AnnouncementPermission.DELETE), controller.delete);
router.post('/:id/audit', permissionMiddleware(AnnouncementPermission.REVIEW), controller.audit);
router.post('/:id/publish', permissionMiddleware(AnnouncementPermission.PUBLISH), controller.publish);
router.post('/:id/top', permissionMiddleware(AnnouncementPermission.TOP), controller.toggleTop);
router.get('/', permissionMiddleware(AnnouncementPermission.VIEW_ALL), controller.getList);
router.get('/:id', permissionMiddleware(AnnouncementPermission.VIEW_ALL), controller.getDetail);
router.get('/:id/stats', permissionMiddleware(AnnouncementPermission.VIEW_STATS), controller.getStats);

// 用户端接口 - 无需权限验证
router.get('/client/list', controller.getClientList);
router.get('/client/:id', controller.getClientDetail);
router.post('/client/:id/confirm', controller.confirm);
router.post('/client/:id/read', controller.markAsRead);

export const announcementRoutes = router; 