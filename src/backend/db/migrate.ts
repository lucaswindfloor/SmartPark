import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// 确保数据目录存在
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 数据库文件路径
const dbPath = path.resolve(dbDir, 'smartpark.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath);

// 执行迁移
db.serialize(() => {
  // 启用外键约束
  db.run('PRAGMA foreign_keys = ON;');

  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      avatar TEXT,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建通知公告表
  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('notice', 'announcement', 'important')),
      status TEXT NOT NULL CHECK(status IN ('draft', 'pending', 'published', 'rejected', 'expired')),
      is_top INTEGER NOT NULL DEFAULT 0,
      require_confirmation INTEGER NOT NULL DEFAULT 0,
      created_by INTEGER NOT NULL,
      reviewed_by INTEGER,
      reject_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `);

  // 通知公告公开范围关联表
  db.run(`
    CREATE TABLE IF NOT EXISTS notice_public_ranges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notice_id INTEGER NOT NULL,
      public_range TEXT NOT NULL CHECK(public_range IN ('enterprise', 'employee', 'public')),
      FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE,
      UNIQUE (notice_id, public_range)
    )
  `);

  // 通知公告浏览记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS notice_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notice_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (notice_id, user_id)
    )
  `);

  // 通知公告确认记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS notice_confirmations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notice_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      confirmed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (notice_id, user_id)
    )
  `);

  console.log('数据库迁移完成。');
});

// 关闭数据库连接
db.close((err) => {
  if (err) {
    console.error('关闭数据库连接出错:', err.message);
  } else {
    console.log('数据库连接已关闭。');
  }
}); 