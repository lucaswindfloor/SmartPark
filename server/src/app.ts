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

// 加载环境变量
dotenv.config();

const app = express();

// 创建数据库连接
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './database/smartpark.db',
  synchronize: true,
  logging: true,
  entities: [
    Announcement,
    AnnouncementView,
    AnnouncementConfirm,
    AnnouncementAudit
  ]
});

// 中间件
app.use(cors());
app.use(express.json());

// 基础路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API路由
app.use('/api', routes);

// 数据库连接和服务器启动
const startServer = async () => {
  try {
    // 初始化数据库连接
    await AppDataSource.initialize();
    console.log('Database connected');

    // 启动服务器
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 