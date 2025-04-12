import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { routes } from './routes';
import { Announcement } from './models/announcement.entity';
import { AnnouncementView } from './models/announcement-view.entity';
import { AnnouncementConfirm } from './models/announcement-confirm.entity';
import { AnnouncementAudit } from './models/announcement-audit.entity';
import { AnnouncementVisibility } from './models/announcement-visibility.entity';
import { User } from './models/user.entity';
import { Role } from './models/role.entity';
import { Permission } from './models/permission.entity';
import { RolePermission } from './models/role-permission.entity';
import { UserRole } from './models/user-role.entity';
import { initDatabase } from './config/initDb';

// 加载环境变量
dotenv.config();

// 配置数据库连接
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || './database/smartpark.db',
  entities: [
    Announcement,
    AnnouncementView,
    AnnouncementConfirm,
    AnnouncementAudit,
    AnnouncementVisibility,
    User,
    Role,
    Permission,
    RolePermission,
    UserRole
  ],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development'
});

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 基础路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API路由
app.use('/api', routes);

// 启动服务器
AppDataSource.initialize()
  .then(async () => {
    console.log('数据库连接成功');
    
    // 初始化权限数据
    try {
      await initDatabase();
      console.log('权限数据初始化成功');
    } catch (error) {
      console.error('权限数据初始化失败:', error);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('数据库连接失败:', error);
  }); 