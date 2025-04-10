import { Router } from 'express';
import { announcementRoutes } from './announcement.routes';

const router = Router();

// 通知公告路由
router.use('/announcements', announcementRoutes);

export const routes = router; 