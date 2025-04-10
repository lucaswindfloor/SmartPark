import express from 'express';
import cors from 'cors';
import path from 'path';
import noticeRoutes from './routes/noticeRoutes';
import { closeDatabase } from './db/database';
import jwt from 'jsonwebtoken';
import { dbQuery } from './db/database';

// 添加类型声明
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        name: string;
        role: string;
      };
    }
  }
}

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use(express.static(path.join(__dirname, '../../public')));

// 简单的认证中间件，无需外部文件
app.use((req, res, next) => {
  // 先确保user是undefined
  req.user = undefined;
  
  // 尝试从认证头获取用户信息
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // 解析JWT
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      // 在路由处理中再根据需要从数据库获取完整用户信息
      req.user = {
        id: decoded.id, 
        username: decoded.username || '',
        name: decoded.name || '',
        role: decoded.role || 'user'
      };
    } catch(err) {
      // JWT解析出错，用户仍为undefined
      console.log('JWT解析失败，继续处理请求');
    }
  }
  
  // 继续处理请求，不管认证是否成功
  next();
});

// API路由
app.use('/api/notices', noticeRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`服务器已在 http://localhost:${PORT} 端口启动`);
});

// 处理进程终止
process.on('SIGTERM', () => {
  console.log('SIGTERM 信号接收，关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    closeDatabase().then(() => {
      console.log('数据库连接已关闭');
      process.exit(0);
    });
  });
});

export default app; 